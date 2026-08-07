// 表单接收端点（M3，docs/03）：Turnstile → honeypot → 字段校验 → 邮箱三层验证
// → request.cf 归属地 → 飞书多维表格（主存储，失败即 5xx 让用户可感知）
// → DirectMail + 群机器人提醒（通知类，失败只告警不阻断）
import type { APIRoute } from 'astro';
// Astro v7 + adapter v14：env 经 cloudflare:workers 导入（locals.runtime.env 已移除）
// @ts-expect-error cloudflare:workers 为 Workers 运行时虚拟模块
import { env as workerEnv } from 'cloudflare:workers';
import { verifyEmail } from '../../../server/email-verify';
import { appendRecord, botAlert, feishuConfigured, type FeishuEnv } from '../../../server/feishu';
import { directmailConfigured, sendMail, type DirectMailEnv } from '../../../server/directmail';

export const prerender = false;

type Env = FeishuEnv & DirectMailEnv & { TURNSTILE_SECRET_KEY?: string };

interface Runtime {
  cf?: { country?: string; city?: string };
  ctx?: { waitUntil(p: Promise<unknown>): void };
}

const str = (v: unknown, max = 200): string => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const arr = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string').map((x) => x.trim().slice(0, 100)) : [];

const json = (status: number, body: object) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

export const POST: APIRoute = async ({ params, request, locals, clientAddress }) => {
  const runtime = (locals as { runtime?: Runtime }).runtime;
  const env = (workerEnv ?? {}) as Env;
  const cf = ((request as unknown as { cf?: Runtime['cf'] }).cf ?? runtime?.cf) as Runtime['cf'];
  const defer = (p: Promise<unknown>) => {
    if (runtime?.ctx?.waitUntil) runtime.ctx.waitUntil(p);
    else void p.catch(() => {});
  };
  const form = params.form;
  if (form !== 'client' && form !== 'collector') return json(404, { error: 'unknown_form' });

  let payload: Record<string, unknown>;
  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return json(400, { error: 'invalid_json' });
  }

  // honeypot：机器人填了隐藏字段 → 假装成功，不给探测信号
  if (str(payload.website)) return json(200, { ok: true });

  // Turnstile（配置后强制；未配置阶段跳过以便预览联调）
  if (env.TURNSTILE_SECRET_KEY) {
    const token = str(payload['cf-turnstile-response'], 4096);
    if (!token) return json(403, { error: 'turnstile_missing' });
    const verify = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY, response: token, remoteip: clientAddress ?? '' }),
    });
    const outcome = (await verify.json()) as { success: boolean };
    if (!outcome.success) return json(403, { error: 'turnstile_failed' });
  }

  // 字段校验（与 v0.2 必填规格一致；consent 为 GDPR 硬性要求）
  const email = str(payload.email);
  const base = { first_name: str(payload.first_name), last_name: str(payload.last_name) };
  if (!base.first_name || !base.last_name || !email) return json(400, { error: 'missing_required' });
  if (payload.consent !== 'on' && payload.consent !== true) return json(400, { error: 'consent_required' });

  const emailVerdict = await verifyEmail(email);
  if (!emailVerdict.ok) return json(400, { error: `email_${emailVerdict.reason}` });

  const geo = [cf?.city, cf?.country].filter(Boolean).join(', ') || 'unknown';
  const now = new Date().toISOString();

  let tableId: string | undefined;
  let fields: Record<string, string>;
  let mailSubject: string;
  let summary: string;

  if (form === 'client') {
    const company = str(payload.name);
    const projectTypes = arr(payload.project_type);
    if (!company || projectTypes.length === 0) return json(400, { error: 'missing_required' });
    tableId = env.FEISHU_TABLE_ID_CLIENT;
    fields = {
      ...base,
      email,
      name: company,
      project_type: projectTypes.join(', '),
      country: str(payload.country),
      message: str(payload.message, 500),
      ip_geo: geo,
      submitted_at: now,
    };
    // FR-2：标题含公司名与需求类型
    mailSubject = `New enquiry — ${company} · ${projectTypes.join(' / ')}`;
    summary = `[Client enquiry]\n${company} · ${projectTypes.join(' / ')}\n${base.first_name} ${base.last_name} <${email}>\nCountry: ${fields.country || '-'} · IP: ${geo}`;
  } else {
    const type = str(payload.type) === 'team' ? 'team' : 'individual';
    const country = str(payload.country);
    if (!country) return json(400, { error: 'missing_required' });
    if (type === 'individual' && !str(payload.preferred_channel)) return json(400, { error: 'missing_required' });
    if (type === 'team' && (!str(payload.company) || !str(payload.team_size))) return json(400, { error: 'missing_required' });
    tableId = env.FEISHU_TABLE_ID_COLLECTOR;
    fields = {
      ...base,
      email,
      type,
      country,
      preferred_channel: str(payload.preferred_channel),
      contact_handle: str(payload.contact_handle),
      phone: str(payload.phone, 32),
      company: str(payload.company),
      team_size: str(payload.team_size, 16),
      regions: str(payload.regions, 500),
      task_types: arr(payload.task_types).join(', '),
      availability: str(payload.availability, 32),
      referral_email: str(payload.referral_email),
      ip_geo: geo,
      submitted_at: now,
    };
    // FR-5：标题含地区与身份类型（v0.2 写"城市"，表单采集维度为 country，见 docs/03 备注）
    mailSubject = `New operator application — ${country} · ${type}`;
    summary = `[Operator application]\n${type} · ${country}\n${base.first_name} ${base.last_name} <${email}>\nChannel: ${fields.preferred_channel || '-'} · IP: ${geo}`;
  }

  // 主存储：未配置 → 503（前端失败 toast 引导备用邮箱）；写入失败 → 502（不可静默）
  if (!feishuConfigured(env) || !tableId) return json(503, { error: 'backend_not_configured' });
  try {
    await appendRecord(env, tableId, fields);
  } catch (err) {
    console.error('feishu write failed', err);
    defer(botAlert(env, `⚠️ 表格写入失败（用户已见失败提示）\n${summary}\n${String(err)}`));
    return json(502, { error: 'storage_failed' });
  }

  // 通知（邮件 + 群机器人）：失败互为告警，不阻断响应
  const notify = (async () => {
    try {
      await botAlert(env, summary);
    } catch (err) {
      console.error('feishu bot failed', err);
    }
    if (directmailConfigured(env)) {
      try {
        await sendMail(env, mailSubject, summary);
      } catch (err) {
        console.error('directmail failed', err);
        await botAlert(env, `⚠️ DirectMail 发送失败（记录已入表格）\n${mailSubject}\n${String(err)}`).catch(() => {});
      }
    }
  })();
  defer(notify);

  return json(200, { ok: true });
};

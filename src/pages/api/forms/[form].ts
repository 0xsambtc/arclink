// 表单接收端点（M3，docs/03）：Turnstile → honeypot → 字段校验 → 邮箱三层验证
// → request.cf 归属地 → 飞书多维表格（主存储，失败即 5xx 让用户可感知）
// → DirectMail + 群机器人提醒（通知类，失败只告警不阻断）
import type { APIRoute } from 'astro';
// Astro v7 + adapter v14：env 经 cloudflare:workers 导入（locals.runtime.env 已移除）
// @ts-expect-error cloudflare:workers 为 Workers 运行时虚拟模块
import { env as workerEnv } from 'cloudflare:workers';
import { verifyEmail } from '../../../server/email-verify';
import { appendRecord, botAlert, botCard, feishuConfigured, type FeishuEnv } from '../../../server/feishu';
import { directmailConfigured, sendMail, type DirectMailEnv } from '../../../server/directmail';

export const prerender = false;

type Env = FeishuEnv & DirectMailEnv & { TURNSTILE_SECRET_KEY?: string; FEISHU_BASE_URL?: string };

interface CfContext {
  waitUntil(p: Promise<unknown>): void;
}

const str = (v: unknown, max = 200): string => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const arr = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string').map((x) => x.trim().slice(0, 100)) : [];

const json = (status: number, body: object) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

export const POST: APIRoute = async ({ params, request, locals, clientAddress }) => {
  const env = (workerEnv ?? {}) as Env;
  const cf = (request as unknown as { cf?: { country?: string; city?: string; asOrganization?: string; colo?: string } }).cf;
  // adapter v14：ExecutionContext 经 locals.cfContext 暴露（locals.runtime 已整体移除）
  const ctx = (locals as { cfContext?: CfContext }).cfContext;
  const defer = (p: Promise<unknown>) => {
    if (ctx?.waitUntil) ctx.waitUntil(p);
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

  // 字段校验（v0.2 必填规格；consent 仅执行者表单要求——samuel 2026-08-09 定，Talk to Sales 不设勾选）
  const email = str(payload.email);
  const base = { first_name: str(payload.first_name), last_name: str(payload.last_name) };
  if (!base.first_name || !base.last_name || !email) return json(400, { error: 'missing_required' });
  if (form === 'collector' && payload.consent !== 'on' && payload.consent !== true)
    return json(400, { error: 'consent_required' });

  const emailVerdict = await verifyEmail(email);
  if (!emailVerdict.ok) return json(400, { error: `email_${emailVerdict.reason}` });

  const geo = [cf?.city, cf?.country].filter(Boolean).join(', ') || 'unknown';
  // 网络运营商：数据中心/VPN 出口一眼可辨（自述 country 与之矛盾时人工复核）
  const network = cf?.asOrganization ? ` (${cf.asOrganization})` : '';
  // 记录用 UTC+8（团队所在时区），带偏移标注避免歧义
  const now = new Date(Date.now() + 8 * 3600_000).toISOString().replace('T', ' ').slice(0, 19) + ' +08:00';

  let tableId: string | undefined;
  let fields: Record<string, string>;
  let mailSubject: string;
  let summary: string; // 邮件正文（纯文本）
  let card: unknown; // 群卡片（三类消息各自的判断维度不同，字段与配色分开设计）

  // 卡片构件：双列字段扫读 + 脚注（时间/来源）+ 表格直达按钮
  const pair = (label: string, value: string) => ({
    is_short: true,
    text: { tag: 'lark_md', content: `**${label}**\n${value || '-'}` },
  });
  const buildCard = (template: string, title: string, pairs: [string, string][], block?: string) => ({
    config: { wide_screen_mode: true },
    header: { template, title: { tag: 'plain_text', content: title } },
    elements: [
      { tag: 'div', fields: pairs.map(([l, v]) => pair(l, v)) },
      ...(block ? [{ tag: 'hr' }, { tag: 'div', text: { tag: 'lark_md', content: block } }] : []),
      { tag: 'note', elements: [{ tag: 'plain_text', content: `${now} · IP ${geo}${network}` }] },
      ...(env.FEISHU_BASE_URL
        ? [{
            tag: 'action',
            actions: [{
              tag: 'button',
              text: { tag: 'plain_text', content: '打开多维表格' },
              url: env.FEISHU_BASE_URL,
              type: 'primary',
            }],
          }]
        : []),
    ],
  });

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
    // 需求方线索：判断「哪家公司、要什么、谁联系」→ 蓝色最高优先级
    card = buildCard('blue', `💼 新线索 · ${company}`, [
      ['需求类型', projectTypes.join(' / ')],
      ['国家（自述）', fields.country],
      ['联系人', `${base.first_name} ${base.last_name}`],
      ['邮箱', email],
    ], fields.message ? `**留言**\n${fields.message}` : undefined);
    summary = [
      `[Client enquiry] ${now}`,
      `${company} · ${projectTypes.join(' / ')}`,
      `${base.first_name} ${base.last_name} <${email}>`,
      `Country: ${fields.country || '-'} · IP: ${geo}${network}`,
      fields.message ? `Message: ${fields.message.slice(0, 200)}` : null,
    ].filter(Boolean).join('\n');
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
    if (type === 'team') {
      // 团队申请：判断「哪家、多大规模、覆盖哪、能做什么」→ BD 对接视角
      card = buildCard('indigo', `🏢 团队申请 · ${fields.company || country}`, [
        ['团队规模', fields.team_size],
        ['所在国家', country],
        ['覆盖区域', fields.regions],
        ['任务类型', fields.task_types],
        ['联系人', `${base.first_name} ${base.last_name}`],
        ['邮箱', email],
      ]);
    } else {
      // 个人执行者：判断「在哪、能做什么、何时可上、怎么联系」→ 派单视角
      card = buildCard('green', `🧭 执行者申请 · ${country}`, [
        ['姓名', `${base.first_name} ${base.last_name}`],
        ['可投入度', fields.availability],
        ['覆盖区域', fields.regions],
        ['任务类型', fields.task_types],
        ['联系渠道', fields.preferred_channel],
        ['账号 / 电话', [fields.contact_handle, fields.phone].filter(Boolean).join(' · ')],
        ['邮箱', email],
        ['推荐人', fields.referral_email],
      ]);
    }
    // FR-5：标题含地区与身份类型（v0.2 写"城市"，表单采集维度为 country，见 docs/03 备注）
    mailSubject = `New operator application — ${country} · ${type}`;
    summary = [
      `[Operator application] ${now}`,
      `${type} · ${country}`,
      `${base.first_name} ${base.last_name} <${email}>`,
      fields.company ? `Company: ${fields.company}${fields.team_size ? ' · team ' + fields.team_size : ''}` : null,
      `Channel: ${fields.preferred_channel || '-'}${fields.contact_handle ? ' (' + fields.contact_handle + ')' : ''}`,
      fields.phone ? `Phone: ${fields.phone}` : null,
      fields.task_types ? `Tasks: ${fields.task_types}` : null,
      fields.regions ? `Regions: ${fields.regions.slice(0, 150)}` : null,
      fields.availability ? `Availability: ${fields.availability}` : null,
      fields.referral_email ? `Referral: ${fields.referral_email}` : null,
      `IP: ${geo}${network}`,
    ].filter(Boolean).join('\n');
  }

  // 主存储：未配置 → 503（前端失败 toast 引导备用邮箱）；写入失败 → 502（不可静默）
  if (!feishuConfigured(env) || !tableId) return json(503, { error: 'backend_not_configured' });
  try {
    await appendRecord(env, tableId, fields);
  } catch (err) {
    console.error('feishu write failed', err);
    defer(botCard(env, buildCard('red', '⚠️ 表格写入失败（用户已见失败提示）', [
      ['表单', form === 'client' ? '需求方' : '执行者'],
      ['联系人', `${base.first_name} ${base.last_name}`],
      ['邮箱', email],
      ['错误', String(err).slice(0, 120)],
    ], `**原始内容（供人工补录）**\n${summary}`)));
    return json(502, { error: 'storage_failed' });
  }

  // 通知（邮件 + 群机器人）：失败互为告警，不阻断响应
  const notify = (async () => {
    try {
      await botCard(env, card);
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

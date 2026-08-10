// 飞书写入（主存储，docs/03/04）：tenant_access_token → 多维表格 append
// 写入失败必须让用户可感知（抛错 → 端点 5xx → 前端失败 toast），不静默
export interface FeishuEnv {
  FEISHU_APP_ID?: string;
  FEISHU_APP_SECRET?: string;
  FEISHU_BITABLE_APP_TOKEN?: string;
  FEISHU_TABLE_ID_CLIENT?: string;
  FEISHU_TABLE_ID_COLLECTOR?: string;
  FEISHU_BOT_WEBHOOK?: string;
}

// Lark 国际版租户（larksuite.com 账号体系，2026-08-09 确认）；飞书国内版为 open.feishu.cn，两套不互通
const BASE = 'https://open.larksuite.com/open-apis';

export function feishuConfigured(env: FeishuEnv): boolean {
  return Boolean(env.FEISHU_APP_ID && env.FEISHU_APP_SECRET && env.FEISHU_BITABLE_APP_TOKEN);
}

async function tenantToken(env: FeishuEnv): Promise<string> {
  const res = await fetch(`${BASE}/auth/v3/tenant_access_token/internal`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ app_id: env.FEISHU_APP_ID, app_secret: env.FEISHU_APP_SECRET }),
  });
  const data = (await res.json()) as { code: number; msg: string; tenant_access_token?: string };
  if (data.code !== 0 || !data.tenant_access_token) {
    throw new Error(`feishu token failed: ${data.code} ${data.msg}`);
  }
  return data.tenant_access_token;
}

/** 多维表格 append 一行；fields 的键须与表格列名完全一致（列规格见 docs/03） */
export async function appendRecord(
  env: FeishuEnv,
  tableId: string,
  fields: Record<string, string>
): Promise<void> {
  const token = await tenantToken(env);
  const res = await fetch(
    `${BASE}/bitable/v1/apps/${env.FEISHU_BITABLE_APP_TOKEN}/tables/${tableId}/records`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
      body: JSON.stringify({ fields }),
    }
  );
  const data = (await res.json()) as { code: number; msg: string };
  if (data.code !== 0) throw new Error(`feishu append failed: ${data.code} ${data.msg}`);
}

/** 群机器人卡片（结构化通知：标题色分级 + 字段双列 + 直达表格按钮） */
export async function botCard(env: FeishuEnv, card: unknown): Promise<void> {
  if (!env.FEISHU_BOT_WEBHOOK) return;
  await fetch(env.FEISHU_BOT_WEBHOOK, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ msg_type: 'interactive', card }),
  });
}

/** 群机器人告警（通知类：失败不阻断主流程，由调用方决定降级） */
export async function botAlert(env: FeishuEnv, text: string): Promise<void> {
  if (!env.FEISHU_BOT_WEBHOOK) return;
  await fetch(env.FEISHU_BOT_WEBHOOK, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ msg_type: 'text', content: { text } }),
  });
}

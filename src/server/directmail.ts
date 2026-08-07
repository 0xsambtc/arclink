// 阿里云 DirectMail SingleSendMail（docs/05）：RPC 签名 V1.0（HMAC-SHA1，Web Crypto 实现）
// 通知类通道：失败不阻断主流程，由调用方转飞书机器人告警
export interface DirectMailEnv {
  DM_ACCESS_KEY_ID?: string;
  DM_ACCESS_KEY_SECRET?: string;
  DM_ACCOUNT_NAME?: string; // 发信地址，如 no-reply@send.arclink-solutions.com
  DM_TO_ADDRESS?: string; // 提醒收件箱，默认 support@arclink-solution.com
}

export function directmailConfigured(env: DirectMailEnv): boolean {
  return Boolean(env.DM_ACCESS_KEY_ID && env.DM_ACCESS_KEY_SECRET && env.DM_ACCOUNT_NAME);
}

// RFC3986 百分号编码（阿里云签名要求：空格 %20、* %2A、~ 不编码）
function pe(value: string): string {
  return encodeURIComponent(value)
    .replace(/\+/g, '%20')
    .replace(/\*/g, '%2A')
    .replace(/%7E/g, '~');
}

async function hmacSha1(key: string, message: string): Promise<string> {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(key),
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', cryptoKey, new TextEncoder().encode(message));
  return btoa(String.fromCharCode(...new Uint8Array(sig)));
}

export async function sendMail(
  env: DirectMailEnv,
  subject: string,
  textBody: string
): Promise<void> {
  const params: Record<string, string> = {
    Action: 'SingleSendMail',
    AccountName: env.DM_ACCOUNT_NAME!,
    AddressType: '1',
    ReplyToAddress: 'false',
    ToAddress: env.DM_TO_ADDRESS ?? 'support@arclink-solution.com',
    Subject: subject,
    TextBody: textBody,
    Format: 'JSON',
    Version: '2015-11-23',
    AccessKeyId: env.DM_ACCESS_KEY_ID!,
    SignatureMethod: 'HMAC-SHA1',
    SignatureVersion: '1.0',
    SignatureNonce: crypto.randomUUID(),
    Timestamp: new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'),
  };
  const canonical = Object.keys(params)
    .sort()
    .map((k) => `${pe(k)}=${pe(params[k])}`)
    .join('&');
  const stringToSign = `POST&${pe('/')}&${pe(canonical)}`;
  params.Signature = await hmacSha1(`${env.DM_ACCESS_KEY_SECRET}&`, stringToSign);

  const body = Object.keys(params)
    .map((k) => `${pe(k)}=${pe(params[k])}`)
    .join('&');
  const res = await fetch('https://dm.aliyuncs.com/', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!res.ok) throw new Error(`directmail failed: ${res.status} ${await res.text()}`);
}

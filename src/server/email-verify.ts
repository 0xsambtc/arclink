// 邮箱三层验证（docs/03）：语法 → DoH 查 MX → 一次性域名黑名单
// 网络失败时放行（宁可收到垃圾也不误拒真实线索——表单是高价值低频事件）
import { DISPOSABLE_DOMAINS } from './disposable-domains';

const SYNTAX_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type EmailVerdict = { ok: true } | { ok: false; reason: 'syntax' | 'mx' | 'disposable' };

export async function verifyEmail(email: string): Promise<EmailVerdict> {
  if (!SYNTAX_RE.test(email)) return { ok: false, reason: 'syntax' };
  const domain = email.split('@')[1]!.toLowerCase();
  if (DISPOSABLE_DOMAINS.has(domain)) return { ok: false, reason: 'disposable' };
  try {
    const res = await fetch(
      `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=MX`,
      { headers: { accept: 'application/dns-json' }, signal: AbortSignal.timeout(3000) }
    );
    if (!res.ok) return { ok: true }; // DoH 不可用：放行
    const data = (await res.json()) as { Status: number; Answer?: unknown[] };
    // Status 0 且有应答记录才算有 MX；NXDOMAIN(3)/无记录判拒
    if (data.Status === 0 && (data.Answer?.length ?? 0) > 0) return { ok: true };
    return { ok: false, reason: 'mx' };
  } catch {
    return { ok: true }; // 超时/异常：放行
  }
}

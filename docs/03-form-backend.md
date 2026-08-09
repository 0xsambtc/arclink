# 03 · 表单"后端"方案与取舍

> 状态：✅ 已定 —— 无传统后端，单 serverless 函数。切换时机见文末。

## 需求

两类表单（需求方项目咨询 / 采集人员加入申请），提交后：
1. 指定公司邮箱（阿里企业邮箱）收到邮件提醒；
2. 采集人员信息存入数据库（运营可浏览筛选）；
3. 邮箱有效性验证；
4. 记录提交者 IP 归属地。

## 方案一（已选）：无后端 —— 单 serverless 函数

前端保留自研深色弹窗表单（表单 SaaS 的 iframe 嵌入会破坏品牌一致性），提交到与前端同仓的 Astro API endpoint（`prerender = false`，Cloudflare adapter）：

```
表单 → POST /api/submit
  → Turnstile 人机验证（免费）
  → 邮箱三层验证
      1. 语法正则（前端+函数各一次）
      2. MX 记录检查：DoH 一个 fetch（cloudflare-dns.com/dns-query?type=MX，无需任何库）
      3. 一次性邮箱域名黑名单（disposable-email-domains 开源列表，构建期打包）
  → IP 归属地：request.cf 自带 country/city/region/经纬度/ASN（免费全 plan，已核实官方文档）
      IP 本体取 CF-Connecting-IP header；ASN 顺手识别数据中心/代理 IP
  → 写入多维表格（主存储，见 04——2026-08-03 决策：不建数据库，直接存多维表格类工具）
  → 发邮件（DirectMail，见 05）+ IM 群机器人提醒
  → 失败处理：多维表格写入失败 = 落库失败，整个请求报错（前端提示重试）；通知类失败只告警
```

约 150-200 行、无框架无重依赖。可选增强（先不做）：SMTP 级邮箱验证 API（ZeroBounce 免费 100 次/月），前三层已拦截绝大多数垃圾/错拼。

### 为什么不用表单 SaaS（Formspree/Web3Forms/Basin/Tally 等）

调研结论（2026-08 查证）：**纯 SaaS 无法闭环需求**——所有主流表单 SaaS 都不做 MX/一次性邮箱校验，IP 归属地要么没有要么锁贵价 plan；免费额度能打的只有 Tally（无限但 iframe）和 Web3Forms（250/月但不存数据）。要补齐就得 SaaS 后面再挂函数，变成两套系统，比"只有函数"更复杂。

## 方案二（备选）：自建后端

VPS（Hetzner/DO $4-6/月）或 PaaS（Fly.io/Railway $5/月起）+ Node(Hono)/Python(FastAPI) + SQLite/Postgres + MaxMind GeoLite2 + 仍需邮件 API（自建 SMTP 送达率是深坑）。变体：Supabase/PocketBase 类 BaaS 居中。

## 正面对比

| 维度 | 无后端（函数） | 有后端（自建） |
|---|---|---|
| 月成本 | **$0** | $5-10 起 |
| 运维 | **趋零**（无服务器/补丁/备份/证书） | 持续税，一人团队最伤 |
| 四个需求点 | 全覆盖；IP 归属地平台白送 | 全覆盖；GeoIP 库自己月更 |
| 数据主权 | 多维表格可全量导出（见 04） | 完全自有 |
| 扩展上限 | 表单类逻辑随便加；做不了"系统"（登录/后台/任务流） | 无上限，是未来采集系统的地基 |
| 故障面 | 依赖 Cloudflare/DirectMail 可用性与条款 | 故障自己扛（半夜挂了表单丢） |
| 调试/日志 | 平台日志够用但简陋 | 完整可控 |

## 取舍结论与切换时机

**现阶段需求本质是"低频高价值表单收集"，两方案都 100% 满足需求，自建不产生任何额外能力、只产生运维面 → 无后端完胜。** samuel 会写后端不改变这个判断——判断依据是需求，不是技能。

**切换时机**：当业务长出函数装不下的"系统需求"（采集人员注册登录、审核流、任务分发）时再建后端——那已经不是官网，是另一个产品。届时函数改为把提交转发给新后端，前端零改动。两方案是阶段关系，不是二选一定终身。

## 铁律

表单静默失败不可接受：① **写入多维表格失败必须让用户可感知**——整个请求报错，前端给重试提示 + 展示备用联系邮箱（无兜底库，这一步就是落库）；② 通知类下游（邮件/IM）失败只告警不阻断；③ 邮件 + IM 双通道提醒，同挂概率可忽略。

---

# M3 实现记录（2026-08-07，代码已就绪，待凭证联调）

端点：`src/pages/api/forms/[form].ts`（client|collector，`prerender=false` 走 Worker）；辅助模块 `src/server/{feishu,directmail,email-verify,disposable-domains}.ts`。管线：Turnstile（配置后强制）→ honeypot 假 200 → 字段校验（v0.2 必填 + consent）→ 邮箱三层（语法/DoH MX/一次性域名，网络失败放行）→ `request.cf` 归属地 → 飞书多维表格写入（失败 502，用户可感知）→ 群机器人 + DirectMail 提醒（互为告警，不阻断）。前端 `PUBLIC_TURNSTILE_SITE_KEY` 存在时渲染 interaction-only 组件；服务端 email_* 拒绝映射回邮箱字段错误。

## 需要配置的密钥（`wrangler secret put <NAME>`；PUBLIC_ 前缀走构建环境变量）

| 名称 | 来源 |
|---|---|
| TURNSTILE_SECRET_KEY / PUBLIC_TURNSTILE_SITE_KEY | Cloudflare → Turnstile 新建 widget（域名 arclink-solutions.com） |
| FEISHU_APP_ID / FEISHU_APP_SECRET | 飞书开放平台 → 自建应用（开通 bitable:record:write 权限） |
| FEISHU_BITABLE_APP_TOKEN | 多维表格 URL 中的 app token |
| FEISHU_TABLE_ID_CLIENT / FEISHU_TABLE_ID_COLLECTOR | 两张数据表的 table id |
| FEISHU_BOT_WEBHOOK | 告警群 → 自定义机器人 webhook |
| DM_ACCESS_KEY_ID / DM_ACCESS_KEY_SECRET | 阿里云 RAM（仅授 DirectMail） |
| DM_ACCOUNT_NAME | DirectMail 发信地址（建议 no-reply@send.arclink-solutions.com） |
| DM_TO_ADDRESS | 默认 support@arclink-solutions.com，可省略 |

## 多维表格列规格（列名须与下表完全一致，均为文本列）

- **Client 表**：first_name, last_name, email, name, project_type, country, message, ip_geo, submitted_at
- **Collector 表**：first_name, last_name, email, type, country, preferred_channel, contact_handle, phone, company, team_size, regions, task_types, availability, referral_email, ip_geo, submitted_at

## 备注

- FR-5 邮件标题规格写"城市"，表单采集维度是 country（v0.2 字段表如此），标题用 country——已列入 PM 勘误清单。
- 未配置凭证时端点返回 503 → 前端失败 toast（含备用邮箱），部署预览阶段行为诚实。
- 本地联调：`npx wrangler dev`（已验证 503/蜜罐/一次性邮箱/缺 consent 四条路径）。
- **域名**：站点与邮箱同域 arclink-solutions.com（samuel 2026-08-09 确认；PM 材料通篇误写为 arclink-solution.com，已入勘误清单）。发信用 send. 子域，根域 MX 归阿里邮箱。

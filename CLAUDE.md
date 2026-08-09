# CLAUDE.md

## 项目是什么

Arclink（Arclink Solutions Pte. Ltd.，新加坡主体）官网。业务定位（2026-08-07 v0.2 起）：**Execution Infrastructure for the Real World**——帮企业规划/部署/核验线下作业（数据采集、实地核验、外联），通过可信的本地执行者网络交付。采购方在海外。官网双目标：给企业采购方建立信任感、承接两类表单（需求方 Talk to Sales / 执行者 Join Our Network）。**站点内容为英文**；与 samuel 的沟通用中文。

## 关键背景

- samuel 一人全栈（会 React，也能写后端），无其他工程资源；方案原则是运维趋零、成本趋零（目标 $0/月）。
- **内容唯一来源是 `docs/content/requirements-v0.2.md`**（PM 2026-08-07 交付，含全部文案、表单字段规格、Careers 岗位）+ 同目录隐私政策/服务条款全文。M2 期"勘测年鉴"设计已作废（原因：没有真实交付数据支撑）。所有 section 数据驱动、文案槽位化（改内容不动布局代码）。
- 交互原型在 `~/Downloads/guanwangv2`（纯 HTML/CSS/JS，保留第一版落地页 + 页面级流程）——**开发以它的结构为准，细节可优化**。视觉体系：深海军蓝 `#030b1d` + 电光蓝 `#2563eb` + 白，Inter 字体。
- 正式联系信息（v0.2 起可用）：`support@arclink-solutions.com`；注册地址 60 PAYA LEBAR ROAD, #04-06 PAYA LEBAR SQUARE, SINGAPORE 409051。
- 公司邮箱是**阿里企业邮箱**；协作用**飞书**——表单数据存飞书多维表格、告警走飞书群机器人（2026-08-03 问答确认）。

## 已锁定的技术决策（2026-08 两轮调研定稿，勿重新论证）

- **前端**：Astro 7（output: static）+ React islands（交互组件用 React）+ GSAP 3.15（已全免费含商用，含 ScrollTrigger/SplitText）+ cobe 2.0（hero 地球，v2 起原生支持弧线）。不用 Next.js、Lenis。Inter 用 Astro Fonts API self-host。
- **表单后端**：无传统后端。一个 Astro API endpoint（`prerender = false`）跑在 Cloudflare：Turnstile → 邮箱三层验证（语法 / DoH 查 MX / 一次性域名黑名单）→ `request.cf` 取 IP 归属地 → 写入多维表格（主存储；2026-08-03 决策：**不建数据库、不自建数据展示**，未来采集团队壮大后一次性迁移到自建后端+DB）→ DirectMail 发邮件 + IM 机器人提醒。
- **部署**：Cloudflare Workers static assets（免费无商用限制、静态带宽不限量）。Vercel Hobby 明文禁商用，已排除。**CI/CD git-first**：GitHub 私有仓库 + Workers Builds，push 即部署、分支/PR 出 preview；Claude 在里程碑/任务边界提交；`wrangler deploy` 仅作 CI 故障逃生通道。
- **发信**：阿里云 DirectMail 为主（收件方是阿里邮箱，同生态送达稳；¥2/1000 封）；Resend 备选（未来发海外收件人时用）。发信用 `send.` 子域，根域 DNS 归阿里邮箱。
- **分析**：Cloudflare Web Analytics。不用 GA4（大陆被墙且拖慢加载——虽然买家在海外，但仍不选）。
- **调性（2026-08-07 反转）**：docs/10 的"勘测年鉴"体系整体作废（依赖真实交付数据，数据不存在）。现行标准 = guanwangv2 原型的视觉与结构（深蓝 hero + SVG 网络图、白/浅底内容区、深色平台卡区），细节允许优化但不推翻。性能硬指标保留（LCP<1.5s/CLS<0.05/<3MB/60fps）。
- **SEO/AI 搜索**（见 docs/08）：架构无硬伤，上线必做的排雷——Cloudflare 新 zone 默认拦 AI 爬虫，须在 AI Crawl Control 放行**全部爬虫**（robots 策略已定为 A：全开放含训练爬虫，samuel 2026-08-03 拍板）；**永不启用网络层 block-Training**（会连带拦 Googlebot/Bingbot）；robots.txt 自维护于 `public/`（全 Allow + Sitemap 行），不开 managed robots.txt 和 Pay Per Crawl；JSON-LD 用 Organization/WebSite/BreadcrumbList/Service；SEO 路由骨架 `/services|industries|case-studies|compare/[slug]`。

## 开放问题（做之前先问或先查 docs）

1. 域名已定 arclink-solutions.com，邮箱同域（2026-08-09 确认；PM 材料曾少写 s，勘误清单见 docs/TODO.md）；Cloudflare/阿里云账号均待注册开通。
2. 隐私政策 §9 的 `[dpo@arclink.com]` 是 PM 留下的占位邮箱，与 support@arclink-solutions.com 不一致——待 PM 确认后更正。
3. 表单后端（M3）未接：前端提交指向 `/api/forms/*`，端点上线前提交会走失败 toast（含备用邮箱指引），上线前必须完成 M3。

## 协作与进度约定

- **进度追踪在 `docs/TODO.md`**：每次会话开始先读它接上进度；每完成一个里程碑级任务或状态变化，立即更新它（状态/等待输入/决策队列/会话日志），会话结束前必须是最新的。
- **分工**：Claude 负责实现、调研、验证与文档维护；samuel 负责决策（拍板/投票）、外部输入（账号/域名/PM 对接）与最终把关。**决策点不自作主张**——列出选项 + 推荐 + 理由，等 samuel 定，定了记入对应 docs 文档和 TODO.md。
- **节奏**：按里程碑垂直切片串行推进（见 TODO.md），每片结束有可部署产物；预览走 workers.dev（noindex）给 samuel/PM 看实物。
- samuel 会不定期粘贴与 PM/合作方的对话——视为项目输入，吸收进 docs 并同步调整方案，冲突处以最新对话为准。

## 工作约定

- 动效原则：配色纪律（三色不加色）、连线/地图绑定真实覆盖数据（勿纯装饰）、所有动效包 `gsap.matchMedia()` 的 `prefers-reduced-motion` 条件、canvas 懒初始化保 LCP（H1 文本直出即 LCP）。
- 表单是高价值低频事件，**任何静默失败不可接受**：多维表格写入失败必须让用户可感知（请求报错、前端提示重试 + 备用邮箱）；通知类失败只告警（邮件 + IM 双通道）。
- 方案文档在 `docs/`，改动技术决策时同步更新对应文档和本文件。
- **代码注释纪律（samuel 2026-08-04 定）**：注释只陈述当前约束与意图（可引用 `docs/` 文档路径），**禁止过程叙事**——人名、评审轮次、缺陷/修正/方案编号（"QA修复第N条""缺陷7""S2""红队""xx 评审"等）一律不进代码；过程记录归 git 提交信息与 docs/。

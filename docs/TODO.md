# 进度追踪

> 本文件由 Claude 在每次工作会话结束时更新；samuel 只读即可。状态：⬜ 未开始 / 🔵 进行中 / ✅ 完成 / ⏸ 等外部输入。
> 最后更新：2026-08-03（M0 本地部分完成）

## 当前状态一句话

M1 完成（首页 9 个 section 组件化 + 三弹窗表单，双端验证通过）；下一步 M2 双首屏变体（需覆盖城市清单）或 M3 表单链路（需飞书凭证）；M0 剩余的 GitHub/Workers Builds 接入等账号到位。

## 里程碑

| # | 任务 | 状态 | 备注 |
|---|---|---|---|
| M0 | 仓库初始化（git init + GitHub 私有仓库 + Workers Builds 接入 + Astro 骨架 + 设计 token，push 即部署、workers.dev 可访问） | 🔵 | **本地部分已完成**（2026-08-03：git main + Astro 7 骨架 + tokens + 构建通过，commit c32f399）；剩 GitHub 仓库 + Workers Builds，等账号 |
| M1 | 底座搭建：原型作底稿落进组件结构 + 按 docs/01 参照标准做视觉升级（token 化、Linear 式卡片、Anduril 式排版）——非照搬原型 | ✅ | 2026-08-04 完成（commit d5f8594）：9 个 section 组件、home.ts 槽位化、三弹窗完整表单、双端截图验证 |
| M2 | 变体实物对比 → 投票定稿（定调见 docs/10） | 🔵 | **三变体 × 双语已就绪待投票**（2026-08-04，commit a2fec9d）：`/m2/atlas`（年鉴·深色）/ `/m2/atlas-paper`（年鉴·纸面）/ `/m2/station`（地面站），各有 `/zh/` 中文版；已含原型正式文案（能力/行业/宣言区）；投票后按胜者做全站统一 |
| M3 | 表单链路端到端（Turnstile → 验证 → 存储 adapter → DirectMail + IM 告警） | ⬜ | 可与 M2 并行；存储用 adapter，工具未定不阻塞 |
| M4 | SEO 基建（sitemap/robots/JSON-LD/路由骨架/content collections） | ⬜ | robots 已定全开放 |
| M5 | 上线（域名/DNS/发信域/Cloudflare 排雷/GSC+Bing/监控） | ⬜ | 检查清单见 docs/06、docs/08 |
| M6 | 内容填充与动效打磨 | ⏸ | 等 PM 内容框架 |

## 等待 samuel 的输入

> 账号/材料类已整理成可转发的 [setup-for-pm.md](setup-for-pm.md)（2026-08-03 交给产品执行）。

| 输入 | 用于 | 状态 |
|---|---|---|
| ~~IM 告警通道~~ | M3 | ✅ 已定：飞书群机器人（2026-08-03 问答） |
| ~~多维表格工具~~ | M3 | ✅ 已定：飞书多维表格（2026-08-03 问答） |
| Cloudflare 账号注册 | M0 部署前 | ⏸ 待办（免费，5 分钟） |
| 阿里云账号注册+实名 → 开通 DirectMail | M3 前 | ⏸ 待办（跟随现有阿里邮箱所在体系：国内站/国际站） |
| 真实覆盖城市清单（先给 10 个也行） | M2 hero 数据 | ⏸ 方便时粘贴 |
| 公司注册信息（法定名称/新加坡地址） | JSON-LD / footer | ⏸ 方便时粘贴 |
| 域名（购买中）+ 是否与阿里邮箱同域 | M5 | ⏸ 购买中，到手后告知；DNS 建议托管 Cloudflare |
| Logo 矢量源文件（AI/SVG）+ 深色底反白版 | header 真 logo / 精确 favicon | ⏸ 已有浅底 PNG（public/brand/），矢量版待提供 |

## 待 samuel 决策的队列

1. **审定 v2 收束方案**（docs/11）：单一设计"纸面年鉴+深色插页"取代三变体投票——五条定案（冷纸为主/图形宪法从严/chrome 减密/动效系统/分节定稿）。通过后执行 v2 收束 pass 并收官 M2。

## 会话日志（倒序，只记里程碑级变化）

- **2026-08-04（冲奖重构）**：samuel 评审否决初版（"拿不了奖"）→ 5-agent 评审工作流（Design/Creativity 尸检 + 配色/构图提案）→ 实施：NORTH PAPER 冷纸配色（修色温冲突 + WCAG）、十条构图缺陷全修（单轴病/字阶断层/hero 避让/图版锁笼）、五签名（印张系统/整版字标图版/归档落版/跨页图版/打样台）。评审材料存 scratchpad，commit 2d4d7a4。

- **2026-08-04（基建补齐）**：404 页（补上 wrangler 已引用的缺口）、favicon（logo 元素派生 SVG）、skip-link + :focus-visible、`astro check` 进构建；**i18n 配置层就位**（en 默认 + zh fallback 重定向 + sitemap hreflang，中文内容到位即覆盖）；logo PNG 入库并采样品牌原色（#0a1d33 / #147dfd → brand tokens）；新增 docs/09 设计系统文档。

- **2026-08-04（M1）**：原型移植完成——SiteHeader/Hero/Belief/Process/Platform/Industries/NetworkCta/Footer/ContactModals 九个组件，全部数据驱动（home.ts）；视觉升级落地（Linear 卡片、mono 序号替代 glyph、Mapping 居首）；三弹窗升级为完整表单（honeypot + Turnstile 挂载点，M3 接真实提交）；桌面 1440/移动 390 截图验证；6 个 section 由并行 workflow 构建（Platform agent 被误拦后由主循环补齐）。

- **2026-08-03（M0 本地）**：git 仓库就位（main，两个 commit：docs / 骨架）；Astro 7.1.6 + React 19 + GSAP 3.15 + cobe 2.0.1 安装并构建通过；tokens.css 设计变量体系、Base 布局（防白闪 + reduced-motion）、占位首页、robots.txt（策略 A）、wrangler.jsonc 就绪。

- **2026-08-03（补充）**：问答收口——存储定为**飞书多维表格**、告警定为**飞书群机器人**；域名购买中；Cloudflare/阿里云账号待注册。工程约定（token 化/组件分层/adapter/TS）写入 docs/02；M2 防锚定机制写入 docs/01。
- **2026-08-03**：方案阶段完成。两轮+两次专项调研（设计参照/免后端/技术栈/部署/globe 参照/geo 同行/SEO-AEO），docs/00–08 全部定稿；存储定为多维表格直存（无数据库）、robots 定为全开放、发信定为 DirectMail。代码未开工。

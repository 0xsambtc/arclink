# 进度追踪

> 本文件由 Claude 在每次工作会话结束时更新；samuel 只读即可。状态：⬜ 未开始 / 🔵 进行中 / ✅ 完成 / ⏸ 等外部输入。
> 最后更新：2026-08-07（v0.2 反转，按新需求重建中）

## 当前状态一句话

**UI 阶段 samuel 已通过（2026-08-07），冻结待 PM 反馈**：v0.2 全量重建 + 三轮评审（合规逐字审计/结构评审/两轮设计精修）+ samuel 多轮拍脸修正全部落地；正式 logo 上刊；设计使用规范成文 docs/09。下一步：M0 部署出 workers.dev 预览链接给 PM 实物评审（需 Cloudflare 账号）→ PM 反馈与供稿回填 → M3 表单后端 → M4 SEO → M5 上线。

## 里程碑（v0.2 重排）

| # | 任务 | 状态 | 备注 |
|---|---|---|---|
| M0 | 仓库初始化（GitHub 私有仓库 + Workers Builds 接入） | ⏸ | 本地 git 就绪；剩账号相关，等 Cloudflare 账号 |
| R1 | v0.2 重建：首页六区（Hero/Belief/HowWorks/Platform/Industries/Network）+ 导航页脚 | ✅ | 2026-08-07；M1 组件底座复用，内容层全换 |
| R2 | v0.2 重建：/contact（Talk to Sales）+ /join（双表单）+ /careers + 法律页 | ✅ | 2026-08-07；表单字段/校验/toast 按 v0.2 规格实测通过（后端待 M3） |
| M3 | 表单后端（Turnstile → 校验 → 飞书多维表格 → DirectMail + 群机器人） | 🔵 | **代码已就绪并本地冒烟通过**（2026-08-07，含 Cloudflare adapter 接入与 Turnstile 前端挂载）；剩凭证配置与联调，密钥清单见 docs/03 |
| M4 | SEO 基建（sitemap/robots/JSON-LD——现在有真实法律主体与地址可填 Organization） | ⬜ | robots 已定全开放 |
| M5 | 上线（域名/DNS/发信域/Cloudflare 排雷/GSC+Bing/监控） | ⬜ | 检查清单见 docs/06、docs/08 |

## 等待 samuel 的输入

| 输入 | 用于 | 状态 |
|---|---|---|
| Cloudflare 账号注册 | M0/M3/M5 | ⏸ |
| 阿里云账号 → DirectMail | M3 | ⏸ |
| 飞书多维表格 + 群机器人凭证 | M3 | ⏸ |
| ~~域名~~ | M5 | ✅ arclink-solutions.com（2026-08-07）；邮箱同域 support@arclink-solutions.com（2026-08-09 samuel 确认） |
| 隐私政策 §9 占位邮箱 `[dpo@arclink.com]` 的正确值 | 法律页 | ⏸ 转 PM 确认 |
| Logo 矢量源文件 | header 真 logo | ⏸ 已有新版 JPG（public/brand/logo-v2.jpg），矢量待提供 |

## 待 samuel / PM 决策的队列（2026-08-07 汇总：合规审计 + 结构评审 + 精修评审）

**需 PM 供稿（工程侧槽位已就位或成本极低）：**
- Careers 岗位申请通道与指引文案（现为死胡同；最低成本 mailto:support+subject）
- /join 成功句 application 版（现复用 "We've received your message…"，执行者被叫 message 欠妥）
- 三个字段引导：regions placeholder / referral email 用途说明 / channel handle 示例
- /contact 前置 SLA 句正式措辞（现临时用 "We'll get back to you within 1–2 business days."，由成功 toast 句改写主语，待复核）
- Careers→/join 分流句（低英语用户会把 Careers 误当接单入口）
- /join 缺"能赚多少/接下来流程"内容块；提交后渠道联系预告句

**需拍板的取舍：**
- header 两颗 CTA 主次（现 header 主=Join、hero 主=Talk to Sales，互相矛盾：采购优先还是供给优先？）
- 导航 "Network" 标签对采购方的歧义（预期看覆盖，点开是招募）
- /join 桌面端 referral 左置为 v0.2 明文规格，但 PM 视角建议申请面板占主位——若调整需先改规格
- 失焦即报必填错（v0.2 明文"失焦即校验"）vs 首次提交后才报（Linear/Stripe 惯例）——规格微调需 PM 确认
- 跨页锚点全程平滑滚动（观光 vs 直达）
- 页脚 "Talk to Sales" 链接与页尾收口 CTA 同屏重复，是否去其一
- 信任证据层（证言/案例/合规版块）内容路线图（对接 docs/08 预留的 /case-studies 路由）

## 历史决策队列（2026-08-07 合规审计产出）

1. **WeChat vs Wechat**：v0.2 规格拼写为 "Wechat"，实现用了官方拼写 "WeChat"。保留官方拼写（推荐）还是逐字跟规格？定了请让 PM 在 v0.2 同步勘误。
2. **Hero eyebrow "EXECUTION INFRASTRUCTURE"**：v0.2 文字清单与原型均无，但产品效果图上有——按效果图保留（推荐）还是删除？
3. **转 PM 确认的规格疑似笔误**（实现已按合理值执行，待归档勘误）：① 流程步骤 1 句末双句号 ".."；② 岗位卡 3 Overview 的 "ARCLINK’s" 全大写（已逐字照排，若属笔误请 PM 更正后我再统一为 Arclink）；③ 全站撇号规范（v0.2 弯直混用，实现已逐字跟随，建议 PM 定一个统一规范）。
4. 既有：隐私政策 §9 占位邮箱 `[dpo@arclink.com]`（开放问题 2）。
5. **邮箱域拼写勘误（2026-08-09）**：PM 全部材料（v0.2 需求 5 处、隐私政策 2 处、条款 1 处、原型 5 处）均写 `support@arclink-solution.com`（少 s）；samuel 确认正确为 `support@arclink-solutions.com`。站点与法律页渲染版已全量更正，`docs/content/` 原件保留原样作收件记录——请 PM 在源文档同步勘误。

## 已作废（2026-08-07，git 历史保留）

- M2 全部产物：勘测年鉴 /atlas、地面站 /station、STOCK/EDITION 切换、coverage 占位数据、arcfield 图形引擎、双语路由。作废原因：设计依赖真实交付数据，数据不存在；且 v0.2 内容为英文单语。
- docs/10、docs/11 调性文档随之失效（保留作历史记录）。

## 会话日志（倒序，只记里程碑级变化）

- **2026-08-07（UI 冻结）**：samuel 通过 UI 阶段，送 PM 评审。本日全部工作：v0.2 反转重建 → 合规逐字审计（区块顺序/撇号/蜜罐等修复）→ 结构评审（导航断层/弹窗蜜罐焦点/收口 CTA/SEO 元数据/无障碍）→ 两轮设计精修（hero 平面点阵地图对齐效果图、按钮体系全局化、token 收敛、自绘下拉、Process 进度轨、Industries 卡片矩阵、hidden 语义修复、铅垂过渡线）；正式 logo + favicon + og 卡上刊。
- **2026-08-07（细节优化轮）**：hero 视觉对齐产品效果图——平面点阵世界地图（陆地数据自 cobe 掩码提取为 3.6kB 静态点阵）+ 高拱辉光弧线 + 流光/节点呼吸（Canvas 2D，LCP 无损）；四镜头挑剔设计师评审（首页版式/子页表单/动效/系统一致性）P1/P2 全量落地：按钮体系全局化（修子页裸按钮）、字阶与功能色 token 收敛、eyebrow AA、弹窗滚动壳+焦点圈禁、Legal 阅读排版等。commit 4e68eee + 7c51631。
- **2026-08-07（v0.2 反转）**：PM 交付需求 v0.2 / 隐私政策 / 服务条款 / guanwangv2 原型 / 新 logo；三文档入库 `docs/content/`；M2 设计作废；按原型结构重建（首页六区 + 4 条页面流程），M1 组件底座复用。
- **2026-08-04（冲奖重构 → 后作废）**：NORTH PAPER 冷纸配色 + 五签名 + hero v3 活体外业图版；4-lens 评审揭示采购方视角缺联系方式/法律主体/真实数据——该缺口由 v0.2 材料补齐，但设计路线整体被 v0.2 取代。
- **2026-08-04（基建）**：404 页、favicon、skip-link、astro check 进构建、i18n 配置、logo 采样品牌色、docs/09 设计系统。
- **2026-08-04（M1）**：原型移植——9 个 section 组件全部数据驱动（home.ts）；该底座在 v0.2 重建中继续服役。
- **2026-08-03（M0 本地）**：git + Astro 7.1.6 + tokens + wrangler.jsonc + robots.txt。
- **2026-08-03**：方案定稿 docs/00–08；存储=飞书多维表格、告警=飞书群机器人、robots=全开放、发信=DirectMail。

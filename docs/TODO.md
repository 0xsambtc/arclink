# 进度追踪

> 本文件由 Claude 在每次工作会话结束时更新；samuel 只读即可。状态：⬜ 未开始 / 🔵 进行中 / ✅ 完成 / ⏸ 等外部输入。
> 最后更新：2026-08-07（v0.2 反转，按新需求重建中）

## 当前状态一句话

**v0.2 重建完成，待 samuel 验收（2026-08-07）**：首页六区 + /contact + /join + /careers + 隐私/条款页全部按 guanwangv2 原型结构重建并通过构建与双端走查；文案与表单字段以 `docs/content/requirements-v0.2.md` 为唯一来源；表单前端行为（失焦校验/consent 门禁/防重复/toast）已按规格实测通过，后端待 M3。

## 里程碑（v0.2 重排）

| # | 任务 | 状态 | 备注 |
|---|---|---|---|
| M0 | 仓库初始化（GitHub 私有仓库 + Workers Builds 接入） | ⏸ | 本地 git 就绪；剩账号相关，等 Cloudflare 账号 |
| R1 | v0.2 重建：首页六区（Hero/Belief/HowWorks/Platform/Industries/Network）+ 导航页脚 | ✅ | 2026-08-07；M1 组件底座复用，内容层全换 |
| R2 | v0.2 重建：/contact（Talk to Sales）+ /join（双表单）+ /careers + 法律页 | ✅ | 2026-08-07；表单字段/校验/toast 按 v0.2 规格实测通过（后端待 M3） |
| M3 | 表单后端（Astro API endpoint：Turnstile → 校验 → 飞书多维表格 → DirectMail + 群机器人） | ⬜ | 前端已按 `/api/forms/*` 约定预留；需飞书/阿里云凭证 |
| M4 | SEO 基建（sitemap/robots/JSON-LD——现在有真实法律主体与地址可填 Organization） | ⬜ | robots 已定全开放 |
| M5 | 上线（域名/DNS/发信域/Cloudflare 排雷/GSC+Bing/监控） | ⬜ | 检查清单见 docs/06、docs/08 |

## 等待 samuel 的输入

| 输入 | 用于 | 状态 |
|---|---|---|
| Cloudflare 账号注册 | M0/M3/M5 | ⏸ |
| 阿里云账号 → DirectMail | M3 | ⏸ |
| 飞书多维表格 + 群机器人凭证 | M3 | ⏸ |
| 域名（购买中） | M5 | ⏸ |
| 隐私政策 §9 占位邮箱 `[dpo@arclink.com]` 的正确值 | 法律页 | ⏸ 转 PM 确认 |
| Logo 矢量源文件 | header 真 logo | ⏸ 已有新版 JPG（public/brand/logo-v2.jpg），矢量待提供 |

## 已作废（2026-08-07，git 历史保留）

- M2 全部产物：勘测年鉴 /atlas、地面站 /station、STOCK/EDITION 切换、coverage 占位数据、arcfield 图形引擎、双语路由。作废原因：设计依赖真实交付数据，数据不存在；且 v0.2 内容为英文单语。
- docs/10、docs/11 调性文档随之失效（保留作历史记录）。

## 会话日志（倒序，只记里程碑级变化）

- **2026-08-07（细节优化轮）**：hero 视觉对齐产品效果图——平面点阵世界地图（陆地数据自 cobe 掩码提取为 3.6kB 静态点阵）+ 高拱辉光弧线 + 流光/节点呼吸（Canvas 2D，LCP 无损）；四镜头挑剔设计师评审（首页版式/子页表单/动效/系统一致性）P1/P2 全量落地：按钮体系全局化（修子页裸按钮）、字阶与功能色 token 收敛、eyebrow AA、弹窗滚动壳+焦点圈禁、Legal 阅读排版等。commit 4e68eee + 7c51631。
- **2026-08-07（v0.2 反转）**：PM 交付需求 v0.2 / 隐私政策 / 服务条款 / guanwangv2 原型 / 新 logo；三文档入库 `docs/content/`；M2 设计作废；按原型结构重建（首页六区 + 4 条页面流程），M1 组件底座复用。
- **2026-08-04（冲奖重构 → 后作废）**：NORTH PAPER 冷纸配色 + 五签名 + hero v3 活体外业图版；4-lens 评审揭示采购方视角缺联系方式/法律主体/真实数据——该缺口由 v0.2 材料补齐，但设计路线整体被 v0.2 取代。
- **2026-08-04（基建）**：404 页、favicon、skip-link、astro check 进构建、i18n 配置、logo 采样品牌色、docs/09 设计系统。
- **2026-08-04（M1）**：原型移植——9 个 section 组件全部数据驱动（home.ts）；该底座在 v0.2 重建中继续服役。
- **2026-08-03（M0 本地）**：git + Astro 7.1.6 + tokens + wrangler.jsonc + robots.txt。
- **2026-08-03**：方案定稿 docs/00–08；存储=飞书多维表格、告警=飞书群机器人、robots=全开放、发信=DirectMail。

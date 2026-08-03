# 00 · 项目总览与决策状态

> 更新：2026-08-03。本目录所有结论来自两轮多 agent 调研（设计参照 / 表单免后端 / 前端技术栈 / 部署运维 / globe 参照 / geo 同行 / 实现方案），关键事实均经一手来源（官方定价页、条款、仓库、Awwwards 官方库）独立核实。

## 背景

- **公司**：Arclink Solutions Pte. Ltd.（新加坡），"Execution Infrastructure for the Physical World"。
- **业务主线**：海外地理信息采集（GEO data collection）。国内 geo 采集是红海，海外是蓝海；需求来源为一位前高德产品经理，官网内容框架将由其提供。
- **受众**：① 海外企业采购方（英文站，信任感是第一 KPI）；② 想加入网络的采集人员/供应商。
- **同行画像**：Bee Maps/Hivemapper、Premise、Spexi、Mapillary 等。行业官网设计水位中等偏低（Premise/SafeGraph/Mapillary 平庸），做到"深色真实地图 hero + 覆盖大数字 + 双 CTA 分流"即进入第一梯队。

## 约束

| 约束 | 含义 |
|---|---|
| 一人全栈（samuel，会 React/后端） | 方案不受技能限制，但**长期维护面要小**——能不养的东西不养 |
| 成本趋零 | 目标 $0/月 + 域名年费；所有选型先查免费额度和商用条款 |
| 内容后置 | 文案由 PM 提供、尚未到位——UI 必须数据驱动、文案槽位化 |
| 公司邮箱 = 阿里企业邮箱 | 影响发信服务选型（见 05），不影响存储 |

## 推荐组合

| 维度 | 推荐 | 文档 | 状态 |
|---|---|---|---|
| UI 设计 | 方案 A 基底 + B 的 globe hero 与覆盖数字；共用底座出 A/B 两个首屏变体实拍对比 | [01](01-ui-design.md) | 🟡 待对比定稿 |
| 前端 | Astro 7 + React islands + GSAP 3.15 + cobe 2.0 | [02](02-frontend.md) | ✅ 已定 |
| 表单后端 | 无后端：单 serverless 函数 | [03](03-form-backend.md) | ✅ 已定 |
| 存储 | 多维表格类工具直存（无数据库，未来一次迁移） | [04](04-storage.md) | ✅ 架构已定，工具四选一待定 |
| 邮件 | 阿里云 DirectMail 主 + Resend 备 + IM 机器人兜底 | [05](05-email-notification.md) | ✅ 已定 |
| 部署 | Cloudflare（前后端同仓）；EdgeOne 留作补充 | [06](06-deployment.md) | ✅ 已定 |
| 其他 | 域名/反垃圾/CMS/合规/监控 | [07](07-other-decisions.md) | 各项见文内 |
| SEO/AI 搜索 | 架构天然占优；Cloudflare AI 爬虫排雷 + 技术清单 + GEO 内容规范；robots 全开放（A） | [08](08-seo-ai-search.md) | ✅ 全部已定 |

**月成本合计：$0 + 域名年费（约 $10）。**

## 开放问题清单

1. **UI 变体对比**：A+B 混合 vs 纯 B（覆盖叙事），待底座搭好后用两个真实可滚动首屏对比定稿（samuel + PM 投票）。
2. **多维表格工具四选一**：钉钉多维表（阿里生态，有开放 API）/ 飞书多维表格 / Notion / Airtable，按团队实际协作生态定；同时决定 IM 提醒通道。
3. **域名**：官网域名与阿里邮箱绑定域名是否同域（影响 DNS 协调，不影响架构）。
4. **内容框架**：等 PM 交付；建议向 PM 同步行业信号——2026 年头部同行（Bee Maps/HERE/NATIX/Spexi）headline 清一色 "Physical AI / real-world AI"；GEO 内容规范见 [08](08-seo-ai-search.md) 第四节（可引用性/对比页/楔子关键词）。

## 里程碑建议

1. **底座**：Astro 仓库 + 原型移植 + 设计 token + 表单函数骨架（本地跑通）。
2. **双首屏变体**：A+B 混合版 vs 纯 B 版，实拍对比定稿。
3. **表单链路端到端**：Turnstile → 验证 → 多维表格 → DirectMail + IM 提醒，含失败处理与告警。
4. **上线**：域名/DNS/发信域配置，`wrangler deploy` 直传，随后接 GitHub 自动部署；SEO/AI 基建同步做（GSC/Bing、AI 爬虫放行、JSON-LD，见 [08](08-seo-ai-search.md)）。
5. **内容填充**：PM 内容到位后替换槽位文案，动效逐 section 打磨。

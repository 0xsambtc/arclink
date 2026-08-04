# Arclink 官网

Arclink Solutions Pte. Ltd. 的公司官网 —— "Execution Infrastructure for the Physical World"。业务主线为海外地理信息采集（GEO data collection），面向海外企业采购方（英文站）。

## 项目目标

1. **建立信任感**：面向大厂采购方，让对方看到我们是认真做事的公司。要求前端动效扎实，内容为主（1 个主页 + 1-2 个纯展示子页）。
2. **联系入口**：两类用户通过官网联系我们——需求方（提交项目需求）、采集人员/供应商（申请加入）。提交后指定公司邮箱收到邮件提醒；采集人员信息入库；附带邮箱有效性验证与提交者 IP 归属地记录。

## 当前状态

**规划阶段**（2026-08-03）：技术方案已调研定稿（两轮多 agent 调研，关键事实均经一手来源核实），代码未开工。交互原型在 `~/Downloads/arclink-interactive-prototype`（纯 HTML/CSS/JS，将移植进本仓库）。实时进度见 [docs/TODO.md](docs/TODO.md)。

## 方案文档

| 文档 | 内容 | 状态 |
|---|---|---|
| [00 总览](docs/00-overview.md) | 背景、约束、推荐组合、决策状态表 | — |
| [01 UI 设计](docs/01-ui-design.md) | 三个设计方向与取舍、获奖参照、hero 实现分档 | 待双变体实拍对比 |
| [02 前端实现](docs/02-frontend.md) | Astro vs Next.js vs 纯 HTML，动效技术栈 | 已定（Astro + React islands） |
| [03 表单后端](docs/03-form-backend.md) | 无后端 vs 有后端对比、表单处理链路 | 已定（无后端，单函数） |
| [04 数据存储](docs/04-storage.md) | 多维表格直存决策、候选矩阵、迁移路径 | 已定（工具四选一待定） |
| [05 邮件通知](docs/05-email-notification.md) | DirectMail vs Resend、送达率、DNS 方案 | 已定（DirectMail 主） |
| [06 部署](docs/06-deployment.md) | 平台对比、CI/CD、网站分析 | 已定（Cloudflare） |
| [07 其他决策](docs/07-other-decisions.md) | 域名、反垃圾、CMS、合规、监控 | 各项见文内 |
| [08 SEO 与 AI 搜索](docs/08-seo-ai-search.md) | Google SEO 清单、Cloudflare AI 爬虫排雷、GEO 内容规范 | 已定（robots 全开放） |
| [09 设计系统](docs/09-design-system.md) | 品牌色（含 logo 采样）、排版、组件库现状、风格规则、i18n 结构 | 随代码演进 |
| [10 定调方案](docs/10-tone-directions.md) | 冲奖调研 + 三案（年鉴/地面站/弧场）对比与裁决建议 | 🟡 待选主调 |

## 推荐组合速览

Astro 7 + React islands + GSAP + cobe 2.0 · Cloudflare（前后端同仓）· 单 serverless 函数处理表单 · 多维表格直存（无数据库，未来一次迁移）· 阿里云 DirectMail 发信 · **全套 $0/月 + 域名年费**。

详细论证与取舍见各文档。

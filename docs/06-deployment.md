# 06 · 部署方案与取舍

> 状态：✅ 已定 —— Cloudflare（前端静态 + 表单函数同仓同部署）。

## 平台对比（2026-08 查证，商用官网视角）

| 平台 | 免费额度 | 商用 | 结论 |
|---|---|---|---|
| **Cloudflare（已选）** | 静态请求/带宽官方原文 "free and unlimited"；函数 10 万次/天（[定价页](https://developers.cloudflare.com/workers/platform/pricing/)） | ✅ 无限制 | 唯一"免费 + 合规商用 + 额度无忧"三全；Turnstile / Web Analytics / request.cf（IP 归属地）同生态 |
| Netlify | 300 credits/月 ≈ 15GB 带宽，部署也扣 credits | ✅ 允许 | 合规备选但额度紧 |
| Vercel | 额度大 | ❌ **Hobby 官方原文 "restricted to non-commercial personal use only"**（[Fair Use](https://vercel.com/docs/limits/fair-use-guidelines)），合规 = Pro $20/月 | 排除（除非未来改用 Next.js 重 SSR） |
| 腾讯 EdgeOne Pages 国际站 | 免费，5GB 存储 | ✅ | 不强制 ICP 备案；**留作补充**：若发现部分买家从大陆/东南亚访问慢，同一构建产物再发一份做 `cn.` 入口 |

形态说明：Cloudflare 官方新项目建议用 **Workers static assets** 形态（前后端一个 Worker，与 Pages 功能已对齐、新功能投入在此）；用 Pages 也完全可行。

## 会改变结论的三种情况（当前均不成立）

1. 买家主要在中国大陆 → 需 EdgeOne 入口（已确认买家在海外，不触发）；
2. 改用 Next.js 且用重 SSR → Vercel 变自然选择（当前是 Astro 静态输出，不触发）；
3. 需要企业级 SLA/合同 → 付费层面的事，平台不换。

## 大陆可访问性备忘

`*.pages.dev` / `*.vercel.app` / `*.netlify.app` 默认域名在大陆均不可达——**绑自定义域名是底线**（这条与买家在哪无关，都要做）。绑定后大陆流量走 Cloudflare 港/日节点，"打开看一眼"够用；不做 ICP 备案（新加坡主体无国内实体，也做不了）的上限就是海外节点就近访问。

## CI/CD（git-first，samuel 2026-08-03 确认）

1. **M0 即建 git**：`git init` + GitHub 私有仓库 + Cloudflare Workers Builds git 集成（免费 3,000 构建分钟/月）——push 即构建部署，**每个分支/PR 自动出独立 preview URL**（M2 双变体对比、给 PM 看稿都靠它）；
2. 工作流：main = 生产；里程碑/功能走分支 → preview 验收 → 合入；Claude 在里程碑/任务边界提交，commit message 写清做了什么；
3. `npx wrangler deploy` 降级为**逃生通道**（CI 故障时手动直传）；
4. 背景备忘：Pages 的 Direct Upload 项目**不能后切 git 集成**（要新建项目重绑域名），git-first 从根上避开此类坑。

## 网站分析

| 方案 | 结论 |
|---|---|
| **Cloudflare Web Analytics（已选）** | 完全免费、零维护、无 cookie（连 cookie banner 都可省） |
| Umami Cloud 免费层 | 10 万 events/月；要更细看板时再加 |
| GA4 | **不用**：大陆被墙全丢数据且脚本挂起拖慢页面；买家虽在海外，也没有理由选它 |

## 上线检查清单

- [ ] 域名绑定 + SSL 自动签发（Cloudflare）
- [ ] DNS：根域邮箱记录 + `send.` 子域发信记录（见 [05](05-email-notification.md)）
- [ ] Turnstile site key 配置
- [ ] **AI 爬虫放行**：onboarding 允许 AI 爬虫；AI Crawl Control 核对搜索类爬虫全部 Allow；不开 managed robots.txt / Pay Per Crawl / 网络层 block-Training（详见 [08](08-seo-ai-search.md)）
- [ ] workers.dev 默认路由禁用或 noindex（防重复内容）；Crawler Hints（IndexNow）开启
- [ ] GSC + Bing Webmaster Tools 注册，提交 sitemap
- [ ] 函数 secrets（DirectMail 密钥、多维表格 API 凭证、IM webhook）用 `wrangler secret` 注入，不进代码库
- [ ] 真实提交表单端到端测试（含垃圾箱检查）
- [ ] UptimeRobot 监控 + 告警通道验证（见 [07](07-other-decisions.md)）

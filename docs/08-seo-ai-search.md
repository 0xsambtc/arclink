# 08 · Google SEO 与 AI 搜索优化（GEO/AEO）

> 状态：✅ 全部已定（架构零改动，补配置与内容规范）；robots.txt 策略已定为 **A：全开放**（samuel 2026-08-03 拍板）。
> 调研：2026-08-03，三方向多 agent 调研，关键声明经一手来源核实。

## 总结论

**已定架构（Astro 纯静态 + Cloudflare）对 Google SEO 和 AI 搜索不仅兼容，而且占优**：Google 官方文档原文背书 "server-side or pre-rendering is still a great idea…not all bots can run JavaScript"（[JS SEO basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)）；Vercel/MERJ 爬虫日志研究证实主流 AI 爬虫（GPTBot/ClaudeBot/PerplexityBot）**不执行 JS**（[The rise of the AI crawler](https://vercel.com/blog/the-rise-of-the-ai-crawler)）——零 JS 静态输出意味着内容对所有爬虫首抓即全量。需要做的全部是配置和内容层工作，**唯一必须主动排雷的点在 Cloudflare**（见下）。

## 一、⚠️ Cloudflare AI 爬虫排雷（上线时必做）

**背景（已核实官方原文）**：Cloudflare 2025-07-01 起对新接入域名实行 permission-based 默认（onboarding 询问、默认拒绝 AI 爬虫，拦截走 WAF 网络层——**robots.txt 写允许也无效**）；2026-07-01 宣布新规：AI 流量分 **Search / Agent / Training** 三类，2026-09-15 起新域名默认 Search 放行、Training/Agent 仅在展示广告的页面拦截（[2025 公告](https://blog.cloudflare.com/content-independence-day-no-ai-crawl-without-compensation/) · [2026 更新](https://blog.cloudflare.com/content-independence-day-ai-options/)）。

**配置清单**：
1. 新 zone onboarding 时显式选择**允许 AI 爬虫**；
2. Security → "Block AI bots" 保持 **Allow**；**永不启用网络层 block-Training**——官方原文确认按最严格规则执行时会连带拦截 Googlebot/Applebot/Bingbot 等多用途爬虫（[Block AI bots 文档](https://developers.cloudflare.com/bots/additional-configurations/block-ai-bots/)），等于自杀式 SEO；若要拒绝训练，用 robots.txt 声明层表达（我方推荐，注意 Cloudflare 视 robots.txt 为偏好声明而非拦截）；
3. **AI Crawl Control** 里核对以下全部 Allow：`Googlebot` `Bingbot` `OAI-SearchBot` `ChatGPT-User` `PerplexityBot` `Perplexity-User` `Claude-SearchBot` `Claude-User` `Applebot`；
4. **不开** managed robots.txt（会注入 `ai-train=no` + 对训练爬虫 Disallow，且有整体替换而非合并的历史 bug 报告）——robots.txt 以 Astro `public/robots.txt` 为唯一真相源；
5. **不开** Pay Per Crawl（内容变现工具，与"最大化被引用"目标相反）；
6. 上线后实测：`curl -A "OAI-SearchBot" https://域名/` 等逐 UA 验证 + AI Crawl Control 面板观察爬取。

## 二、AI 搜索各家机制与对策（均查证官方文档）

| 引擎 | 机制 | 我们要做的 |
|---|---|---|
| ChatGPT search | 自建索引爬虫 **OAI-SearchBot**（与训练爬虫 GPTBot 严格分离）+ 仍依赖 **Bing** 第三方索引（[OpenAI bots](https://developers.openai.com/api/docs/bots)） | 放行 OAI-SearchBot + **Bing Webmaster Tools 注册**（支持从 GSC 一键导入）+ IndexNow |
| Perplexity | **PerplexityBot** 自建搜索索引（官方明确不用于训练）（[Perplexity bots](https://docs.perplexity.ai/guides/bots)） | 放行 |
| Claude | **Claude-SearchBot**（搜索）/ ClaudeBot（训练）/ Claude-User（用户抓取）；搜索后端主要由 **Brave Search** 支撑 | 放行三者；确认 Brave 可索引（正常站点默认可） |
| Google AI Overviews / AI Mode | **与传统搜索同一索引同一排名系统，官方明确无额外要求**（[AI features](https://developers.google.com/search/docs/appearance/ai-features)）；Ahrefs 追踪显示被引页面来自前 10 名的比例已降至 38%——**新域名不进前 10 也有被引机会** | 做好传统 SEO 即拿到门票 |

**robots.txt 策略：✅ 已定为 A——全开放（含训练爬虫）**。理由：营销内容无版权顾虑，进入未来模型训练语料 = 品牌被模型"记住"的长期 GEO 资产。落地：`public/robots.txt` 对所有 UA `Allow: /` + `Sitemap:` 行，无任何 Disallow（`/api/` 可 Disallow，纯接口无收录价值）；Cloudflare 侧全部爬虫（含 GPTBot/ClaudeBot/CCBot 等训练类）保持 Allow。
（备档：曾评估过的 B 方案为允许搜索、拒绝训练——Disallow `GPTBot` `ClaudeBot` `Google-Extended` `Applebot-Extended` `meta-externalagent` `CCBot`，四家官方均确认不影响搜索引用。若未来对内容授权态度改变可切换，只改 robots.txt 一个文件。）

## 三、传统 Google SEO 清单

| 项 | 做法 |
|---|---|
| sitemap | `@astrojs/sitemap` 官方集成，提交 GSC/Bing；i18n 选项预留 hreflang |
| robots.txt | `public/robots.txt` 静态维护 + `Sitemap:` 行 |
| canonical/meta | layout 层 `<SEO>` 组件统一输出（title/description/OG/Twitter card，frontmatter 驱动） |
| Core Web Vitals | 零 JS 静态站 **INP 天然满分**（当前全网 fail 率最高项）；LCP/CLS 已在 [02](02-frontend.md) 性能要点覆盖。官方定位：tie-breaker 非主排序因子 |
| 防重复内容 | **禁用 workers.dev 默认路由**或对其加 `X-Robots-Tag: noindex`；apex/www 二选一 301；`html_handling` 与站内链接/canonical/sitemap 三者统一；真 404（`not_found_handling`） |
| 提交与推送 | GSC（DNS TXT 验证）→ Bing Webmaster（GSC 一键导入）→ Cloudflare **Crawler Hints** 开关（自动 IndexNow，零开发） |
| JSON-LD | 见下节 |

**JSON-LD 配置**（内联 `<script type="application/ld+json">`，不违背零 JS 原则）：
- **必配**：`Organization`（legalName/新加坡地址/logo/`sameAs` → LinkedIn、Crunchbase——实体消歧核心）、`WebSite`（site name，首页）、`BreadcrumbList`；
- **建议**：`Service`（各能力页，provider 指回 Organization）、`Article`（blog/resources）；
- **注意**：Google 已于 **2026-05-07 全面停止 FAQ rich results**——页面上保留**可见的 FAQ 内容块**（对 AI 引擎抽取答案极有价值），但不再指望 Google 富摘要；Bing 官方（2025-03）确认 schema 帮助其 LLM（Copilot）理解内容——这是配 schema 的另一半理由。

## 四、内容层 GEO 规范（转给 PM 的部分）

实证依据：Princeton GEO 论文（KDD 2024，约 1 万查询受控实验）——内容中加入**引用来源、专家引语、统计数字**可提升生成式引擎可见度 **22–41%**，且**排名靠后的小站获益最大**；关键词堆砌无效（[arXiv 2311.09735](https://arxiv.org/pdf/2311.09735)）。Ahrefs 7.5 万品牌研究：与 AI 可见度相关性最强的是**站外品牌提及（0.664）**，传统反向链接仅 0.218（[研究](https://ahrefs.com/blog/ai-overview-brand-correlation/)）。

1. **可引用性**：每个服务页开头一段"定义式文案"（可被 AI 直接摘走）；给真实的具体数字（覆盖国家数、点位量级、QA 通过率）；引用行业数据注明来源；
2. **实体清晰度**：全站统一公司名与一句话描述；LinkedIn 公司页 + Crunchbase 条目立刻建（成本最低的站外实体引用，也是 `sameAs` 指向）；
3. **FAQ**：服务页附真实买家问题（"How is street-level imagery collected for POI verification?"）；
4. **对比页**：`/compare/` 路径——`Hivemapper alternative`、`Arclink vs Bee Maps`、`crowdsourced vs managed field data collection`——竞争极低、意图极高，且是 AI 回答比较类问题的直接素材；
5. **行业目录**：本垂类 SERP 被目录榜单占据，"进目录=进首页"——优先 **Datarade**（geospatial data providers 类目在 Google 首页）、**ensun**、G2/Clutch；行业媒体（Geospatial World、GIM International）供稿一条即可；
6. **关键词楔子**（首批内容主攻，避开巨头词）：`street-level imagery collection` `POI verification services` `ground truth data collection` `map data validation` + 地域组合（Southeast Asia / emerging markets）。**陷阱**：`field data collection` 的 SERP 意图是"找表单软件"而非采集服务商，必须加 services/provider 修饰。
7. Google 官方反"偏方"：不为 AI 切块改写、不制造虚假第三方提及（[AI optimization guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)）。

**架构预留**（内容后置前提下现在就做）：路由骨架 `/services/[slug]`、`/industries/[slug]`、`/case-studies/[slug]`、`/compare/[slug]`、`/resources/`；Content Collections frontmatter schema 含 `title/description/faq[]/relatedServices[]`——PM 交内容即自动获得完整 meta/JSON-LD/内链。

## 五、如实评估：llms.txt

Google 官方明确忽略此类文件（"You don't need to create…AI text files"）；Ahrefs 13.7 万域名日志显示 **97% 的 llms.txt 零请求**，有请求的主要是 SEO 工具而非 AI 引擎。**结论：成本≈0 可以生成一份做保险，但没有任何证据表明它影响被引用，优先级最后，绝不替代真实 HTML 内容。**

## 六、冷启动预期与度量

- **预期管理**：新域名 3–6 个月内竞争词基本无排名（Google 否认"沙盒"但承认信任建立 lag）；前 6 个月 KPI = 收录完整 + 品牌词第一 + 长尾词开始曝光 + AI 引擎能正确回答 "What is Arclink"。
- **度量**：GSC 曝光/点击；AI Crawl Control 面板看各 AI 爬虫抓取；referral 里识别 chatgpt.com / perplexity.ai 来源；每月手动抽查主流 AI 引擎对品牌与楔子词的回答。

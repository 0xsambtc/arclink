# 01 · UI 设计方案与取舍

> 状态：🟡 方向已收敛（A 基底 + B 元素），最终形态待"双首屏变体实拍对比"定稿。

## 三个候选方向

### 方案 A：企业精密风（原型升级版）

保留现有原型的布局骨架与三色体系（`#030b1d` / `#2563eb` / 白），三个升级：

1. hero 从抽象 SVG 连线 → 真实地球/地图 + 覆盖点位（见下文实现分档）；
2. 每个 section 配一个小型独立交互图形（Shopify Editions 模式），而非整页 WebGL；
3. 卡片体系换 Linear 式"1px 低饱和描边 + 顶部内发光"，深色下用发光代替阴影表达层级。

双 CTA 照搬 Spexi：主 CTA "Start a Project"（买家）/ 次 CTA "Join as Collector"（采集者）。

- ✅ 原型资产全保留、风险最低、可达同行第一梯队（Spexi 级）
- ❌ 不是最差异化的选择

### 方案 B：覆盖叙事驱动（地图即网站）

整站围绕"地理覆盖"组织：globe/地图作为贯穿元素，滚动时地球转向不同区域（东南亚 → 中东 → 拉美），章节按区域/能力划分，Bee Maps 式覆盖大数字，二期做可搜索 coverage 页。

- ✅ 与 geo 业务绑定最深，采购方秒懂；行业里只有 Bee Maps 做到这个程度
- ❌ **叙事强依赖真实覆盖数据**——早期覆盖薄时会暴露单薄（地图上零星几个点适得其反）；与 PM 未交付的内容框架深度耦合

### 方案 C：极简机构风（真实素材驱动）

Anduril/Planet 路线：动效极克制，信任感来自真实采集样张、设备/人员实拍、具体数字。

- ✅ "展示真东西"对采购方说服力最强；动效工作量最小
- ❌ **冷启动没素材就是死穴**；当前阶段不可行，作为素材积累后的演进方向

## 取舍结论

**A 为基底 + 吸收 B 的 hero 与覆盖数字区**；纯 B 是否更好，不靠纸面争论——共用底座（设计 token、section 组件、表单）+ 两个首屏/叙事变体都做出来（A/B 分叉点只占约 20% 工作量），samuel + PM 实拍对比后定稿。淘汰方不浪费：纯 B 变体即未来覆盖数据长起来后的演进路线；C 的"真实素材"随业务积累逐步补强。

### 防锚定机制（M2 执行纪律，防止 B 被原型同化）

1. **B 独立起稿**：B 的首屏结构由**未接触过原型代码/截图的全新 agent** 从业务简报 + 参照清单 + 内容大纲 + 品牌三色出发独立提出（2-3 个方案择优），不从 A 的代码改；
2. **共享层白名单**：A/B 只共享品牌三色与字体、表单管线、原始内容数据；B 不得继承 A 的 section 划分、布局骨架、间距节奏、卡片样式、滚动结构——B 的信息架构从"覆盖叙事"概念重新推导；
3. **先 B 后 A**：M2 内先做 B 再装配 A，新鲜脑力留给需要跳出原型的一侧；
4. **评审标准外置**：投票不问"哪个顺眼"，按外置标准打分——30 秒信任感、geo 业务传达速度、与平庸同行（Premise/SafeGraph 档）的差异度、本文参照检查表符合度；
5. 边界：配色纪律/logo/企业信任感的收敛是**故意的**（品牌资产，非原型遗产）；目标不是 B 最大化不同，而是 B 忠实代表覆盖叙事概念。

## 参照清单（获奖信息均经 Awwwards 官方页核实）

### 业务同构（必看）

| 站点 | 看什么 |
|---|---|
| [Spexi](https://www.spexi.com) | 深色夜景地图+发光点位 hero 与我们视觉同构；**hero 双 CTA 分流**（Book a Demo / Fly to Earn）直接照搬 |
| [Bee Maps](https://beemaps.com) + [Hivemapper Coverage](https://hivemapper.com/coverage) | 全行业最实的覆盖可视化：三个大数字（754M KM 等）+ 真实交互覆盖地图；买家/采集者**双域名分流**（规模化后的演进形态） |

### 视觉/动效标杆

| 站点 | 奖项（已核实） | 看什么 |
|---|---|---|
| [Populous](https://populous.com) | Awwwards SOTD 2024-09-20 | 单色系 globe 也能高级；globe 点位即导航 |
| [Kelvin Zero](https://www.kzero.com) | Awwwards SOTD 2024 + FWA + CSSDA | 蓝色系企业信任感；一个几何隐喻贯穿全站 |
| [stripe.dev](https://stripe.dev) | Awwwards SOTD 2024 | 配色纪律：动效再多不加色 |
| [Shopify Editions S24](https://www.shopify.com/editions/summer2024) | SOTD + Developer Award | 每 section 一个小交互图形的工程量控制模式 |
| [Vercel Ship](https://vercel.com/ship) | Honorable Mention | 网格线框背景的"基础设施感"（纯 CSS）；CTA 微动效 |
| [Anduril](https://www.anduril.com) | Honorable Mention | 机构感排版：mono 大写小标签 + 大号紧字距标题 |
| [Linear](https://linear.app) | 未获奖/标杆 | 深色卡片层级系统（描边+内发光）教材 |
| [GitHub globe 工程博客](https://github.blog/engineering/engineering-principles/how-we-built-the-github-globe/) | — | 连线动效实现层最有价值文档；"proof of life"原则 |

合集猎源：[Awwwards Dark](https://www.awwwards.com/websites/dark/) · [Maps & Geolocation collection](https://www.awwwards.com/awwwards/collections/maps-geolocation-streetview/) · [Godly](https://godly.website/)

### 获奖深色 B2B 站共性规律（内容把关时的检查表）

1. 配色纪律与动效复杂度成反比——三色不加色；
2. 连线/地图必须绑定真实数据（真实覆盖城市），纯装饰连线=模板感；
3. 一个几何隐喻（节点-连线网络）贯穿全站，hero/流程图/行业区复用；
4. 滚动叙事按章节编排 + 每节一个小交互图形，不做整页 WebGL；
5. hero 之后立刻放信任构件（logo wall / count-up 大数字），case 用数字不用形容词。

## Hero 实现分档（详见 [02-frontend](02-frontend.md)）

| 档 | 组合 | 工作量 | 用途 |
|---|---|---|---|
| A | cobe 静态配置 或 纯静态点阵 SVG + GSAP | 1 天内 | 点阵 SVG 版同时就是 reduced-motion/无 WebGL 的降级资产，先做不浪费 |
| **B（推荐）** | cobe 2.0（v2 原生弧线）+ GSAP ScrollTrigger：可拖转 + 滚动转向覆盖区域 + 完整降级链 | 2-3 天 | 本次官网 hero |
| C | three.js/globe.gl 定制（hover tooltip、真实贴图） | 一周+ | 未来升级，现阶段不做 |

行业话术信号：2026 年头部同行 headline 清一色 "Physical AI / real-world AI"（Bee Maps、HERE、NATIX、Spexi），供 PM 定英文 headline 时参考。反面教材：NATIX 把 token 奖励话术与企业产品混在同一站，买家信任被稀释——采集者激励话术不进主站买家动线。

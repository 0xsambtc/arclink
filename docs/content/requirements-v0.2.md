## 官网主页内容

### 首屏：
标题：Building the Execution Infrastructure for the Real World.
描述：
Arclink helps enterprises plan, deploy, and verify on-the-ground operations—from data collection to field verification and outreach—at scale through a trusted network of operators.

### 模块1
Eyebrow：
OUR BELIEF
Our Belief
标题：The real world still needs execution. 
正文：
Digital technology has transformed how organizations make decisions. AI processes information. Software automates workflows. But every digital decision ultimately depends on execution in the real world.
We believe execution should be as scalable as software, as measurable as data and as reliable as infrastructure.
That is why Arclink exists.

### 模块2
Eyebrow：
OUR PLATFORM
标题：
The platform powering field operations at scale.
正文：
Arclink brings technology, standardized workflows and trusted local execution together into one platform.
5个能力卡片
Task Management
Plan, assign and track every task across cities, regions and countries with progress and coverage visible in real time.

Workforce Management
Match and deploy local operators and field teams to each task by location, capacity and performance.

Data Collection
Standardize on-site data collection so every task submission comes back as structured, ready-to-use data.

Quality Assurance
Verify task submissions with GPS and timestamp checks, photo evidence, automated rule checks and multi-layer review.

Analytics & Optimization
Bring task, resource and quality data together to see where work slows down and steadily improve workflows, efficiency and completion quality.

### 模块3
Eyebrow：
INDUSTRIES WE SERVE
标题：
Wherever field data and on-site work matter.
4个行业示例卡片
AI Training
Ground-truth data collection and labeling for physical-world AI systems.

Retail
Store audits, shelf checks and merchant outreach.

Maps & Navigation
POI collection, tagging and verification for maps and LBS platforms.

Logistics & Delivery
Address, hub and last-mile verification.

### 模块4
Eyebrow：
HOW ARCLINK WORKS
标题：
End-to-end. On the ground. At scale.
内容：
**1 · Scope & Plan**  
Tell us what you need, where and by when — we turn it into a clear plan for execution..
**2 · Activate the Network**  
We deploy vetted local operators on-demand, from a single city to global scales.
**3 · Execute Consistently**  
Every operator follows the standardized workflow, ensuring consistent results across markets.
**4 · Verify & Deliver**  
Every result is reviewed and verified before delivery.

### 模块5
Eyebrow：JOIN OUR NETWORK
标题：Join the network that gets the real world done.
Whether you're an individual operator or a local team, join our network to take on tasks nearby and get paid for every job you complete.



## Talk to Sales & Join Our Network

### Talk to Sales
点击后，直接在当前页面内进入一个新的页面。页面左侧有公司邮箱、注册地址和覆盖位置等信息，右侧则是用户可提交的表单。

左侧内容
Eyebrow：TALK TO SALES
标题：
We're Here to Help

Email
[support@arclink-solution.com](mailto:support@arclink-solution.com)

Registered address
**60 PAYA LEBAR ROAD, #04-06 PAYA LEBAR SQUARE,  
SINGAPORE 409051**


### Join Our Network
点击后，同样直接在当前页面内进入一个新的页面
显示加入规则
展示两个选项卡Individual 、Team or Organization
每个选项卡上有几个说明信息
点击申请后直接在当前页面弹窗输入信息

Eyebrow：JOIN OUR NETWORK
标题：
Expand the network with us.
正文：
Join a trusted global network helping organizations deliver high-quality work in the physical world.

申请提交左侧区域页面内容
**Invite a friend. Earn a referral reward.**

Know someone who'd be a good fit for the Arclink network? Send them your way. Once they join and finish their first approved tasks, you’ll receive a referral bonus.

Bonuses are paid after your referral hits that milestone. Spots are limited and the program closes once we reach the cap—so the earlier you refer, the better.

申请卡片：
Independent Operator
Put your local skills to work.  
For field operators who get real-world tasks done reliably—and want to be matched to tasks near them.

TEAMS & AGENCIES
Bring your whole team on.  
For agencies and delivery teams with a proven local track record and the capacity to scale up.

### 1 需求方（Client）

- FR-1：提供需求方表单（字段见 需求方 (Client) 表单）。
- FR-2：提交成功后，向 **support 邮箱**（ `support@arclink-solution.com`）发送邮件提醒，标题含公司名与需求类型。

### 2 采集方（Collector）

- FR-3：提供采集方表单，支持「个人 / 机构」两种子类型，字段动态显示（见 采集方 (Collector) 表单）。
- FR-4：提交成功后，信息**必须写入飞书表格之类**保存。
- FR-5：写入成功后，向 **support 邮箱**（ `support@arclink-solution.com`）发送邮件提醒，标题含城市与身份类型。
- 是否需要触发欢迎邮件之类的？
### 3 通用

- FR-6：全部为英文表单（面向海外用户），关键提示可中英对照。
- FR-7：提交需有明确的成功 / 失败 / 加载状态反馈。
- FR-8：需有防垃圾提交与基础安全措施。
- FR-9（可选，推荐）：给提交人自动回复一封确认邮件

### 表单字段需求

> `*` = 必填。每一套表单提交分别对应一张飞书？表承接，落入对应表内。
#### 1 需求方 (Client) 表单

| 字段 key       | UI 标签                         | 类型       | 必填  | 说明                                                                                                                      |
| ------------ | ----------------------------- | -------- | --- | ----------------------------------------------------------------------------------------------------------------------- |
| first_name   | First Name                    | text     | *   | 联系人                                                                                                                     |
| last_name    | Last Name                     | text     | *   | 联系人                                                                                                                     |
| email        | Company Email                 | email    | *   | 需要基本的邮箱格式校验                                                                                                             |
| name         | Company Name                  | text     | *   | 用于触发内部推送邮件的标题                                                                                                           |
| project_type | Services You're Interested in | 多选       | *   | POI collection & tagging / Local listings & check-in data / On-the-ground merchant outreach / Data verification / Other |
| country      | Country                       | 单选       | 选填  |                                                                                                                         |
| message      | Tell us more                  | textarea | 选填  | 带placeholder，提示：Task type, volume, target locations, timeline, and budget (if any).<br>最多500字符                          |

#### 2 采集方 (Collector) 表单

Individual：

| 字段 key            | UI 标签                    | 类型       | 必填  | 说明                                                                              |
| ----------------- | ------------------------ | -------- | --- | ------------------------------------------------------------------------------- |
| first_name        | First Name               | text     | *   | 联系人                                                                             |
| last_name         | Last Name                | text     | *   | 联系人                                                                             |
| email             | Email                    | email    | *   | 需要基本的邮箱格式校验                                                                     |
| preferred_channel | Preferred Contact Method | 单选       | *   | WhatsApp / Telegram / Discord / Wechat 。**决定运营用哪个渠道派单**                         |
| country           | Country                  | 单选       | *   | **派单核心维度**                                                                      |
| regions           | Areas you can cover      | textarea | 选填  | 最多500字符                                                                         |
| task_types        | Tasks you can do         | 多选       | 选填  | POI collection / Store check-in / Field promotion / Photo capture / Merchant BD |
| availability      | Availability             | 单选       | 选填  | Part-time / Full-time / Weekends only                                           |
| phone             | Phone                    | tel      | 选填  | 含国际区号，需要基本电话位数校验                                                                |
| contact_handle    | Number for the channel   | text     | 选填  | WhatsApp /Telegram/Discord/Wechat被选中后展示此选项                                      |
| referral_email    | Referral Email           | text     | 选填  | 推荐人邮箱                                                                           |
| consent           | 同意隐私政策勾选                 | checkbox | *   | 采集个人信息，GDPR 必需                                                                  |

Team or Organization：

| 字段 key     | UI 标签               | 类型       | 必填  | 说明                                                                              |
| ---------- | ------------------- | -------- | --- | ------------------------------------------------------------------------------- |
| first_name | First Name          | text     | *   | 联系人                                                                             |
| last_name  | Last Name           | text     | *   | 联系人                                                                             |
| email      | Company Email       | email    | *   | 需要基本的邮箱格式校验                                                                     |
| company    | Company Name        | text     | *   |                                                                                 |
| team_size  | Team Size           | 单选       | *   | Under 5 / 5–10 / 11–100 / 100+                                                  |
| country    | Country             | 单选       | *   | **派单核心维度**                                                                      |
| regions    | Areas you can cover | textarea | 选填  | 最多500字符                                                                         |
| task_types | Tasks you can do    | 多选       | 选填  | POI collection / Store check-in / Field promotion / Photo capture / Merchant BD |

### 交互与状态需求：

字段**失焦即校验**，必填项与格式错误标红提示。
- 必填项未填的提示信息：This field is required
- 校验错误提示：
	- 邮箱格式校验未通过：Please enter a valid email
	- 手机格式校验未通过：Please enter a valid phone number
	- 超过最大字符上限：Maximum allowed is 500 characters

提交时按钮进入禁用状态，**防止重复提交**。

结果反馈：
    - 成功：显示toast：We've received your message and will get back to you within 1–2 business days. 并清空表单。
    - 失败：显示toast：Submission failed. Please try again later, or email us directly at support@arclink-solution.com. 并保留表单填写内容不清空。

采集海外用户个人信息（尤其欧盟）适用 GDPR：
- 表单必须有**明确勾选同意** + **隐私政策**链接（不可默认勾选）
- 用户如果未勾选，则提交按钮不可点击，无法提交。
- 点击隐私协议在新标签页打开协议页面，协议内容待补充



## Careers

Eyebrow：
CAREERS AT ARCLINK
标题：
Build the future of real-world execution.
正文：
We are looking for people to build it together. Join our international team, work flexibly, and grow your career with us.


Open Roles左侧文案
标题：How we work
下方展示3个小节：
**Remote by default**  
Our team works remotely across borders and time zones, with clear communication and trust.

**Built with customers**
We work closely with customers to understand what matters most, keep improving our delivery process with quality in mind at every step.

Ownership and results
We empower people to make decisions, and we focus on outcomes, not activity.

Open Roles中的3个岗位卡：

**Global Business Development & Partnerships Manager**

Location: Singapore / Malaysia

Overview:  
Work directly with the Founder to drive Arclink's growth in a new market—from first enterprise deals to the partner network behind them. You'll open doors with enterprise clients, sign regional service and technology partners, and turn early wins into a repeatable playbook for expansion.

What you’ll do:

- Drive enterprise business development and client acquisition
- Build strategic partnerships across clients, partners, and regional networks
- Manage the sales pipeline from outreach to proposal development
- Support market expansion into new regions
- Own client and partner relationships with a long-term growth mindset

What we look for:

- Fluent English with strong communication and presentation skills
- Strong relationship-building ability across different markets 
- Proactive, commercially minded, and able to turn goals into measurable results
- Able to navigate uncertainty, prioritize opportunities, and move conversations toward concrete next steps.
- Nice to have: Mandarin, B2B business development, SaaS, consulting, or technology background

**Global Workforce & Community Growth Specialist**

Location: Singapore / Malaysia

Overview:  
Help identify, engage, and grow communities of trusted field operators across countries, with a focus on SEA. You will support the growth of Arclink’s operator network by building sourcing channels, engaging local communities, and helping qualified candidates move from interest to activation.

What you’ll do:

- Source field operators through social, professional, and community channels
- Build and manage Arclink’s online and local operator communities
- Guide candidates through registration, onboarding and activation
- Maintain accurate workforce records and operator pipeline updates
- Research new sourcing channels and support network growth in SEA

What we look for:

- Fluent English and Mandarin Chinese
- Comfortable sourcing, engaging, and communicating with people online
- Highly organized, self-motivated, and responsive
- Able to manage many candidate conversations with care and consistency
- Nice to have: Bahasa Malaysia / Indonesia, recruitment, community management, or operations experience

**Operations Specialist - Payments & Rewards**

Location: Singapore / Malaysia

Overview:  
Manage operator payments, reward programs, and settlement operations across ARCLINK’s global workforce platform. You will help ensure accurate, timely payouts while improving operational workflows and creating a reliable payment experience for our operator network.

What you’ll do:

- Calculate operator rewards and review payout requests
- Process payments, referral rewards, and settlement records
- Manage reconciliation, reporting, and payment tracking
- Handle payment inquiries and support issue resolution
- Improve payment workflows, documentation, and SOPs with the operations team

What we look for:

- Excellent written and spoken English
- Strong attention to detail and analytical problem-solving skills
- Proficiency in Excel / Google Sheets
- Able to work independently with accuracy and accountability
- Nice to have: operations, payments, finance, marketplace, or workforce platform experience
// 首页文案 — 中文版（与 home.ts 结构完全一致，未来 /zh/ 站点与双语页面共用）
// 翻译原则：自然中文优先于逐字直译；mono 编号语言（SEC./MOD./城市代码/UTC 时间戳）不翻译（调性设计，见 docs/10）

export const nav = {
  links: [
    { label: '平台', href: '#platform', key: 'platform' },
    { label: '基础设施', href: '#infrastructure', key: 'infrastructure' },
    { label: '行业', href: '#industries', key: 'industries' },
    { label: '网络', href: '#network', key: 'network' },
    { label: '关于', href: '#about', key: 'about' },
  ],
  ctaPrimary: { label: '发起项目', modal: 'project' },
  ctaSecondary: { label: '加入网络', modal: 'network' },
} as const;

export const hero = {
  eyebrow: '执行基础设施',
  headline: { pre: '为物理世界', accent: '构建执行基础设施', post: '' },
  description:
    'Arclink 让企业通过技术、标准化工作流与可信的本地执行网络，规划、部署并核验真实世界中的作业。',
} as const;

export const belief = {
  id: 'about',
  eyebrow: '我们的信念',
  heading: { pre: '物理世界', accent: '依然重要。' },
  copy: '每一个数字决策，最终都依赖于物理世界中的执行。',
  manifestoLabel: { open: '阅读我们的宣言', close: '收起宣言' },
  manifesto: [
    'AI 能处理信息，软件能自动化流程。但总要有人在现场。',
    '我们相信，执行应当像软件一样可扩展、像数据一样可度量、像基础设施一样可依赖。',
    '这就是 Arclink 存在的理由。',
  ],
} as const;

export const process = {
  id: 'infrastructure',
  eyebrow: '执行基础设施',
  heading: '端到端。在现场。规模化。',
  steps: [
    { number: '01', title: '规划', description: '明确范围、地点与要求。' },
    { number: '02', title: '部署', description: '把对的人派到对的任务上。' },
    { number: '03', title: '执行', description: '以标准化工作流完成作业。' },
    { number: '04', title: '核验', description: '通过结构化质检复核质量。' },
    { number: '05', title: '报告', description: '交付结构化成果与洞察。' },
  ],
} as const;

export const platform = {
  id: 'platform',
  eyebrow: '我们的平台',
  heading: '驱动物理世界执行的平台。',
  description: 'Arclink 将技术、标准化工作流与可信的本地执行，整合为一个企业级平台。',
  features: [
    { title: '执行引擎', description: '以智能任务编排协调现场作业。' },
    { title: '质量引擎', description: '实施结构化质量控制与多层复核。' },
    { title: '人力网络', description: '调动多个市场中可信的本地作业者。' },
    { title: '运营控制台', description: '追踪进度、状态与运营表现。' },
    { title: '报告与洞察', description: '把作业活动转化为结构化报告与情报。' },
    { title: '数据分析', description: '度量质量、效率与持续改进。' },
  ],
  statement: { pre: '执行不再是一种服务，而是', accent: '基础设施。' },
} as const;

export const industries = {
  id: 'industries',
  eyebrow: '服务行业',
  heading: '执行基础设施，覆盖驱动世界运转的行业。',
  items: [
    { key: 'Mapping', label: '地图', description: '为数字地图平台提供位置核验与实地情报。' },
    { key: 'AI', label: 'AI', description: '为运行于物理世界的 AI 系统提供数据与执行支持。' },
    { key: 'Retail', label: '零售', description: '为分布式零售网点提供一致的实地运营可见性。' },
    { key: 'Mobility', label: '出行', description: '为出行资产、线路与设施提供实地核验。' },
    { key: 'Logistics', label: '物流', description: '为供应链与配送环境提供分布式运营可见性。' },
    { key: 'Infrastructure', label: '基础设施', description: '为实体基础设施提供本地巡检、核验与报告。' },
  ],
} as const;

export const network = {
  id: 'network',
  eyebrow: '加入网络',
  heading: '基础设施背后的网络。',
  description: '无论你是个人作业者还是机构团队，加入我们的网络，与我们一起成长。',
  ctaPrimary: { label: '成为作业者', modal: 'network' },
  ctaSecondary: { label: '成为合作伙伴', modal: 'partner' },
} as const;

export const footerData = {
  tagline: '为物理世界构建执行基础设施。',
  columns: [
    {
      title: '平台',
      links: [
        { label: '执行引擎', href: '#platform' },
        { label: '质量引擎', href: '#platform' },
        { label: '运营控制台', href: '#platform' },
      ],
    },
    {
      title: '基础设施',
      links: [
        { label: '工作方式', href: '#infrastructure' },
        { label: '质量标准', href: '#infrastructure' },
      ],
    },
    {
      title: '网络',
      links: [
        { label: '成为作业者', href: '#network' },
        { label: '成为合作伙伴', href: '#network' },
      ],
    },
    {
      title: '公司',
      links: [
        { label: '关于', href: '#about' },
        { label: '宣言', href: '#about' },
        { label: '联系', href: '#home' },
      ],
    },
  ],
  // TODO: 公司法定名称待 PM 提供后核对
  legal: '© 2026 Arclink Solutions Pte. Ltd.',
} as const;

export const modalsData = {
  project: {
    eyebrow: '发起项目',
    heading: '告诉我们，物理世界里需要完成什么。',
    fields: {
      name: '姓名',
      email: '工作邮箱',
      company: '公司',
      message: '项目概述',
    },
    submit: '提交需求',
    successMessage: '已收到您的需求，我们会尽快与您联系。',
  },
  network: {
    eyebrow: '加入网络',
    heading: '创建你的作业者档案。',
    copy: '告诉我们你是谁、在哪些地区作业。',
    choices: [
      { key: 'individual', title: '个人作业者', description: '以本地执行专业者的身份加入。' },
      { key: 'organization', title: '团队或机构', description: '注册本地团队或交付伙伴。' },
    ],
    fields: {
      name: '姓名',
      email: '邮箱',
      location: '国家 / 城市',
      message: '介绍一下你的经验',
    },
    submit: '提交申请',
    successMessage: '申请已收到，我们会尽快与你联系。',
  },
  partner: {
    eyebrow: '成为合作伙伴',
    heading: '一起构建本地执行能力。',
    copy: '面向具备本地交付能力的机构。',
    fields: {
      name: '姓名',
      email: '工作邮箱',
      company: '机构名称',
      message: '你希望以什么方式合作？',
    },
    submit: '开始洽谈',
    successMessage: '已收到，我们会尽快与你沟通后续。',
  },
} as const;

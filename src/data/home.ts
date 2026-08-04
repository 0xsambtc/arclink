// 首页全部文案槽位 — 占位内容（源自原型，Mapping 已按旗舰垂类决策提到行业区首位）
// 正式文案由 PM 提供后仅改本文件，不动组件（docs/02 工程约定：内容与代码分离）

export const nav = {
  links: [
    { label: 'Platform', href: '#platform', key: 'platform' },
    { label: 'Infrastructure', href: '#infrastructure', key: 'infrastructure' },
    { label: 'Industries', href: '#industries', key: 'industries' },
    { label: 'Network', href: '#network', key: 'network' },
    { label: 'About', href: '#about', key: 'about' },
  ],
  ctaPrimary: { label: 'Start a Project', modal: 'project' },
  ctaSecondary: { label: 'Join Our Network', modal: 'network' },
} as const;

export const hero = {
  eyebrow: 'Execution Infrastructure',
  // 三行标题，中间行为强调色
  headline: { pre: 'Building the', accent: 'Execution Infrastructure', post: 'for the Physical World.' },
  description:
    'Arclink enables enterprises to plan, deploy and verify real-world operations through technology, standardized workflows and trusted local execution.',
} as const;

export const belief = {
  id: 'about',
  eyebrow: 'Our Belief',
  heading: { pre: 'The Physical World', accent: 'Still Matters.' },
  copy: 'Every digital decision ultimately depends on execution in the physical world.',
  manifestoLabel: { open: 'Read Our Manifesto', close: 'Close Manifesto' },
  manifesto: [
    'AI can process information. Software can automate workflows. But someone still needs to be there.',
    'We believe execution should be as scalable as software, as measurable as data and as reliable as infrastructure.',
    'That is why Arclink exists.',
  ],
} as const;

export const process = {
  id: 'infrastructure',
  eyebrow: 'Execution Infrastructure',
  heading: 'End-to-end. On the ground. At scale.',
  steps: [
    { number: '01', title: 'Planning', description: 'Define scope, locations and requirements.' },
    { number: '02', title: 'Deployment', description: 'Assign the right people to the right work.' },
    { number: '03', title: 'Execution', description: 'Run operations with standardized workflows.' },
    { number: '04', title: 'Verification', description: 'Review quality through structured controls.' },
    { number: '05', title: 'Reporting', description: 'Deliver structured outputs and insights.' },
  ],
} as const;

export const platform = {
  id: 'platform',
  eyebrow: 'Our Platform',
  heading: 'The platform powering execution in the physical world.',
  description:
    'Arclink brings together technology, standardized workflows and trusted local execution into one enterprise platform.',
  features: [
    { title: 'Execution Engine', description: 'Coordinate field activities with intelligent task orchestration.' },
    { title: 'Quality Engine', description: 'Apply structured quality controls and multi-layer review.' },
    { title: 'Workforce Network', description: 'Activate trusted local operators across multiple markets.' },
    { title: 'Operations Console', description: 'Track progress, status and operational performance.' },
    { title: 'Reporting & Insights', description: 'Transform activity into structured reporting and intelligence.' },
    { title: 'Analytics', description: 'Measure quality, efficiency and continuous improvement.' },
  ],
  statement: { pre: 'Execution is no longer a service. It is ', accent: 'infrastructure.' },
} as const;

export const industries = {
  id: 'industries',
  eyebrow: 'Industries We Serve',
  heading: 'Execution infrastructure across industries that move the world.',
  // Mapping 置于首位（geo 旗舰垂类，docs/00 决策）
  items: [
    { key: 'Mapping', label: 'Mapping', description: 'Location verification and field intelligence for digital mapping platforms.' },
    { key: 'AI', label: 'AI', description: 'Data and execution support for AI systems operating in the physical world.' },
    { key: 'Retail', label: 'Retail', description: 'Consistent real-world operational visibility across distributed retail locations.' },
    { key: 'Mobility', label: 'Mobility', description: 'Physical-world validation for mobility assets, routes and infrastructure.' },
    { key: 'Logistics', label: 'Logistics', description: 'Distributed operational visibility across supply-chain and delivery environments.' },
    { key: 'Infrastructure', label: 'Infrastructure', description: 'Local inspection, verification and reporting for physical infrastructure.' },
  ],
} as const;

export const network = {
  id: 'network',
  eyebrow: 'Join Our Network',
  heading: 'The network behind the infrastructure.',
  description: 'Whether you are an individual operator or an organization, join our network and grow with us.',
  ctaPrimary: { label: 'Apply as an Operator', modal: 'network' },
  ctaSecondary: { label: 'Partner with Us', modal: 'partner' },
} as const;

export const footerData = {
  tagline: 'Building the Execution Infrastructure for the Physical World.',
  columns: [
    {
      title: 'Platform',
      links: [
        { label: 'Execution Engine', href: '#platform' },
        { label: 'Quality Engine', href: '#platform' },
        { label: 'Operations Console', href: '#platform' },
      ],
    },
    {
      title: 'Infrastructure',
      links: [
        { label: 'How It Works', href: '#infrastructure' },
        { label: 'Quality Standards', href: '#infrastructure' },
      ],
    },
    {
      title: 'Network',
      links: [
        { label: 'Join as Operator', href: '#network' },
        { label: 'Partner with Us', href: '#network' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '#about' },
        { label: 'Manifesto', href: '#about' },
        { label: 'Contact', href: '#home' },
      ],
    },
  ],
  // TODO: 公司法定名称待 PM 提供后核对
  legal: '© 2026 Arclink Solutions Pte. Ltd.',
} as const;

export const modalsData = {
  project: {
    eyebrow: 'Start a Project',
    heading: 'Tell us what needs to happen in the physical world.',
    fields: {
      name: 'Name',
      email: 'Work email',
      company: 'Company',
      message: 'Project overview',
    },
    submit: 'Submit Enquiry',
    successMessage: 'Thanks — we received your enquiry and will get back to you shortly.',
  },
  network: {
    eyebrow: 'Join Our Network',
    heading: 'Create your operator profile.',
    copy: 'Tell us who you are and where you operate.',
    choices: [
      { key: 'individual', title: 'Individual Operator', description: 'Join as a local execution professional.' },
      { key: 'organization', title: 'Team or Organization', description: 'Register a local team or delivery partner.' },
    ],
    fields: {
      name: 'Name',
      email: 'Email',
      location: 'Country / City',
      message: 'Tell us about your experience',
    },
    submit: 'Apply to Join',
    successMessage: 'Thanks — your application has been received.',
  },
  partner: {
    eyebrow: 'Partner with Us',
    heading: 'Build local execution capacity together.',
    copy: 'Partnerships for organizations with local delivery capabilities.',
    fields: {
      name: 'Name',
      email: 'Work email',
      company: 'Organization',
      message: 'How would you like to partner?',
    },
    submit: 'Start the Conversation',
    successMessage: 'Thanks — we will reach out to discuss next steps.',
  },
} as const;

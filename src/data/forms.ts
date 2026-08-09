// 表单文案与选项 — 字段/校验/反馈文案逐字对齐 docs/content/requirements-v0.2.md「表单字段需求」与「交互与状态需求」
// 校验行为（失焦校验/consent 门禁/防重复提交/toast）在 src/scripts/form-ux.ts，由 DOM 属性驱动

export const formMessages = {
  errors: {
    required: 'This field is required',
    email: 'Please enter a valid email',
    phone: 'Please enter a valid phone number',
    maxLength: 'Maximum allowed is 500 characters',
  },
  toasts: {
    success: "We've received your message and will get back to you within 1–2 business days.",
    failure: 'Submission failed. Please try again later, or email us directly at support@arclink-solutions.com.',
  },
  submitting: 'Submitting…',
} as const;

export const consentCopy = {
  // GDPR：不可默认勾选；未勾选时提交按钮禁用；隐私政策新标签页打开
  label: 'I agree to the',
  privacyLink: { label: 'Privacy Policy', href: '/privacy-policy' },
} as const;

// —— 需求方（Client）表单 —— 提交 → POST /api/forms/client（M3 实现）
export const clientForm = {
  endpoint: '/api/forms/client',
  aside: {
    eyebrow: 'Talk to Sales',
    heading: "We're Here to Help",
    emailLabel: 'Email',
    addressLabel: 'Registered address',
  },
  intro: { eyebrow: 'Start a Conversation', heading: 'Tell us what you need.' },
  fields: {
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Company Email',
    company: 'Company Name',
    projectType: "Services You're Interested in",
    country: 'Country',
    message: 'Tell us more',
  },
  projectTypeOptions: [
    'POI collection & tagging',
    'Local listings & check-in data',
    'On-the-ground merchant outreach',
    'Data verification',
    'Other',
  ],
  messagePlaceholder: 'Task type, volume, target locations, timeline, and budget (if any).',
  submit: 'Submit enquiry',
} as const;

// —— 采集方（Collector）表单 —— 提交 → POST /api/forms/collector（M3 实现）
export const collectorForm = {
  endpoint: '/api/forms/collector',
  page: {
    eyebrow: 'Join Our Network',
    heading: 'Expand the network with us.',
    description: 'Join a trusted global network helping organizations deliver high-quality work in the physical world.',
  },
  referral: {
    heading: 'Invite a friend. Earn a referral reward.',
    paragraphs: [
      "Know someone who'd be a good fit for the Arclink network? Send them your way. Once they join and finish their first approved tasks, you’ll receive a referral bonus.",
      "Bonuses are paid after your referral hits that milestone. Spots are limited and the program closes once we reach the cap—so the earlier you refer, the better.",
    ],
  },
  tabs: {
    individual: {
      tabLabel: 'Individual',
      eyebrow: 'Independent Operator',
      heading: 'Put your local skills to work.',
      description: 'For field operators who get real-world tasks done reliably—and want to be matched to tasks near them.',
      cta: 'Apply as an individual',
    },
    team: {
      tabLabel: 'Team or Organization',
      eyebrow: 'Teams & Agencies',
      heading: 'Bring your whole team on.',
      description: 'For agencies and delivery teams with a proven local track record and the capacity to scale up.',
      cta: 'Apply as a team',
    },
  },
  fields: {
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    companyEmail: 'Company Email',
    company: 'Company Name',
    teamSize: 'Team Size',
    preferredChannel: 'Preferred Contact Method',
    country: 'Country',
    regions: 'Areas you can cover',
    taskTypes: 'Tasks you can do',
    availability: 'Availability',
    phone: 'Phone',
    contactHandle: 'Number for the channel',
    referralEmail: 'Referral Email',
  },
  channelOptions: ['WhatsApp', 'Telegram', 'Discord', 'WeChat'],
  taskTypeOptions: ['POI collection', 'Store check-in', 'Field promotion', 'Photo capture', 'Merchant BD'],
  availabilityOptions: ['Part-time', 'Full-time', 'Weekends only'],
  teamSizeOptions: ['Under 5', '5–10', '11–100', '100+'],
  submit: 'Submit application',
  modal: {
    individual: { eyebrow: 'Independent Operator', heading: 'Apply as an individual.' },
    team: { eyebrow: 'Teams & Agencies', heading: 'Apply as a team.' },
  },
} as const;

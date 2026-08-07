// 首页全部文案槽位 — 唯一来源 docs/content/requirements-v0.2.md（改内容只动本文件，不动组件）

export const nav = {
  solutions: {
    label: 'Solutions',
    items: [
      { label: 'Platform', href: '/#platform' },
      { label: 'Industries', href: '/#industries' },
      { label: 'How Arclink Works', href: '/#infrastructure' },
    ],
  },
  links: [
    { label: 'Network', href: '/#network', key: 'network' },
    { label: 'Careers', href: '/careers', key: 'careers' },
  ],
  ctaSales: { label: 'Talk to Sales', href: '/contact' },
  ctaNetwork: { label: 'Join Our Network', href: '/join' },
} as const;

export const hero = {
  headline: { pre: 'Building the', accent: 'Execution Infrastructure', post: 'for the Real World.' },
  description:
    'Arclink helps enterprises plan, deploy, and verify on-the-ground operations—from data collection to field verification and outreach—at scale through a trusted network of operators.',
  ctaPrimary: { label: 'Talk to Sales', href: '/contact' },
  ctaSecondary: { label: 'Join Our Network', href: '/join' },
} as const;

export const belief = {
  id: 'about',
  eyebrow: 'Our Belief',
  heading: 'The real world still needs execution.',
  paragraphs: [
    'Digital technology has transformed how organizations make decisions. AI processes information. Software automates workflows. But every digital decision ultimately depends on execution in the real world.',
    'We believe execution should be as scalable as software, as measurable as data and as reliable as infrastructure.',
    'That is why Arclink exists.',
  ],
} as const;

export const process = {
  id: 'infrastructure',
  eyebrow: 'How Arclink Works',
  heading: 'End-to-end. On the ground. At scale.',
  steps: [
    {
      number: '1',
      title: 'Scope & Plan',
      description: 'Tell us what you need, where and by when — we turn it into a clear plan for execution.',
    },
    {
      number: '2',
      title: 'Activate the Network',
      description: 'We deploy vetted local operators on-demand, from a single city to global scales.',
    },
    {
      number: '3',
      title: 'Execute Consistently',
      description: 'Every operator follows the standardized workflow, ensuring consistent results across markets.',
    },
    {
      number: '4',
      title: 'Verify & Deliver',
      description: 'Every result is reviewed and verified before delivery.',
    },
  ],
} as const;

export const platform = {
  id: 'platform',
  eyebrow: 'Our Platform',
  heading: 'The platform powering field operations at scale.',
  description: 'Arclink brings technology, standardized workflows and trusted local execution together into one platform.',
  features: [
    {
      title: 'Task Management',
      description:
        'Plan, assign and track every task across cities, regions and countries with progress and coverage visible in real time.',
    },
    {
      title: 'Workforce Management',
      description: 'Match and deploy local operators and field teams to each task by location, capacity and performance.',
    },
    {
      title: 'Data Collection',
      description: 'Standardize on-site data collection so every task submission comes back as structured, ready-to-use data.',
    },
    {
      title: 'Quality Assurance',
      description:
        'Verify task submissions with GPS and timestamp checks, photo evidence, automated rule checks and multi-layer review.',
    },
    {
      title: 'Analytics & Optimization',
      description:
        'Bring task, resource and quality data together to see where work slows down and steadily improve workflows, efficiency and completion quality.',
    },
  ],
} as const;

export const industries = {
  id: 'industries',
  eyebrow: 'Industries We Serve',
  heading: 'Wherever field data and on-site work matter.',
  items: [
    { key: 'ai-training', label: 'AI Training', description: 'Ground-truth data collection and labeling for physical-world AI systems.' },
    { key: 'retail', label: 'Retail', description: 'Store audits, shelf checks and merchant outreach.' },
    { key: 'maps', label: 'Maps & Navigation', description: 'POI collection, tagging and verification for maps and LBS platforms.' },
    { key: 'logistics', label: 'Logistics & Delivery', description: 'Address, hub and last-mile verification.' },
  ],
} as const;

export const network = {
  id: 'network',
  eyebrow: 'Join Our Network',
  heading: 'Join the network that gets the real world done.',
  description:
    "Whether you're an individual operator or a local team, join our network to take on tasks nearby and get paid for every job you complete.",
  ctaPrimary: { label: 'Apply as an individual', href: '/join#individual' },
  ctaSecondary: { label: 'Apply as a team', href: '/join#team' },
} as const;

export const footerData = {
  legalLinks: [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms of Service', href: '/terms-of-service' },
  ],
} as const;

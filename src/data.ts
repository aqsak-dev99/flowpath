/* All the site's content lives here. Change names, text, numbers and links in this one file. */

export const SITE = {
  name: 'flowpath',
  tagline: 'A digital marketing studio in Lahore, working with brands everywhere.',
  email: 'hello@flowpath.example',
  phone: '+92 300 0000000',
  whatsapp: 'https://wa.me/923000000000',
  address: 'Gulberg III, Lahore',
  // Background film. Replace with a video you own before a client uses the site.
  video:
    'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260703_053131_1ec3dd1c-d627-44fb-ab20-6e1fce41b0d5.mp4',
}

export type NavItem = { label: string; to: string; items?: [string, string][] }

export const NAV: NavItem[] = [
  {
    label: 'Services',
    to: '/services',
    items: [
      ['Social media', '/services#social-media'],
      ['Paid advertising', '/services#paid-advertising'],
      ['Search and SEO', '/services#seo'],
    ],
  },
  {
    label: 'Work',
    to: '/work',
    items: [
      ['All case studies', '/work'],
      ['Koel Skincare', '/work/koel-skincare'],
      ['Tandoor Street', '/work/tandoor-street'],
    ],
  },
  {
    label: 'About',
    to: '/about',
    items: [
      ['Our story', '/about'],
      ['How we work', '/about#process'],
      ['Open roles', '/about#roles'],
    ],
  },
  { label: 'Contact', to: '/contact' },
]

export const CHANNELS = ['Instagram and TikTok', 'Google Search', 'Email and WhatsApp', 'Video and creators']

export type Service = {
  id: string
  name: string
  caption: string
  short: string
  long: string
  items: string[]
  monthly: string[]
  visual: 'bars' | 'line' | 'rank'
}

export const SERVICES: Service[] = [
  {
    id: 'social-media',
    name: 'Social media',
    caption: 'Weekly reach, first seven weeks',
    short: 'We plan the calendar, make the posts and answer the comments, so your pages sound like one brand every day.',
    long: 'Most brand pages post when someone remembers to. We run yours on a monthly plan agreed with you in advance, shoot and edit the content ourselves, and reply to comments and messages within working hours so nobody is left waiting.',
    items: ['Monthly content calendar', 'Reels and short video', 'Community management'],
    monthly: ['12 to 20 posts across your platforms', '4 to 8 short videos', 'Replies to comments and messages', 'A one-page report on reach and saves'],
    visual: 'bars',
  },
  {
    id: 'paid-advertising',
    name: 'Paid advertising',
    caption: 'Cost for each new order',
    short: 'Campaigns on Meta, Google and TikTok, built around what a customer costs you and what they are worth.',
    long: 'We start from two numbers: what you can afford to pay for a customer, and what that customer spends over a year. Every campaign is judged against those, and we switch off what does not earn its budget, including ads we liked.',
    items: ['Meta and TikTok ads', 'Google Search and Shopping', 'Weekly budget reviews'],
    monthly: ['Campaign builds and creative tests', 'Weekly budget and bid reviews', 'New ad creative every two weeks', 'A report of spend against orders'],
    visual: 'line',
  },
  {
    id: 'seo',
    name: 'Search and SEO',
    caption: 'Where you appear on Google',
    short: 'We fix what stops your site ranking, then write the pages people are already searching for.',
    long: 'Search work is slow and it compounds. In the first month we fix the technical problems that hold your site back. After that we publish pages that answer the exact questions your customers type, and we track where each one ranks.',
    items: ['Technical site audit', 'Keyword and content plan', 'Local search listings'],
    monthly: ['A technical fix list, done for you', '4 new or rewritten pages', 'Google Business profile updates', 'Rankings tracked for your key searches'],
    visual: 'rank',
  },
]

export type CaseStudy = {
  slug: string
  client: string
  sector: string
  year: string
  duration: string
  services: string[]
  did: string
  result: string
  brief: string
  approach: string[]
  metrics: { to: number; decimals: number; suffix: string; label: string }[]
  chart: { title: string; unit: string; labels: string[]; values: number[] }
  quote?: { text: string; name: string; role: string }
  cover: number
}

export const CASES: CaseStudy[] = [
  {
    slug: 'koel-skincare',
    client: 'Koel Skincare',
    sector: 'Skincare, online store',
    year: '2026',
    duration: 'Six months',
    services: ['Paid advertising', 'Social media', 'Store rebuild'],
    did: 'Store rebuild, paid social and creator videos',
    result: 'Revenue up 5.3 times in six months',
    brief: 'Koel was selling almost entirely through Instagram messages. Orders were limited by how fast two people could reply, and nobody knew which posts actually led to sales.',
    approach: [
      'Rebuilt the online store so customers could order without sending a message.',
      'Filmed twelve short videos with three creators who already used the products.',
      'Ran paid campaigns on Meta and TikTok, and stopped every ad that cost more than its orders were worth.',
      'Added a welcome email and a reorder reminder at 45 days.',
    ],
    metrics: [
      { to: 5.3, decimals: 1, suffix: 'x', label: 'Monthly revenue, month six against month one' },
      { to: 41, decimals: 0, suffix: '%', label: 'Lower cost for each new order' },
      { to: 212, decimals: 0, suffix: 'k', label: 'New followers across three platforms' },
    ],
    chart: { title: 'Monthly online revenue', unit: 'Rs lakh', labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'], values: [18, 24, 31, 47, 68, 96] },
    quote: {
      text: 'They were the first agency to tell us which of our ads to switch off. Our spend went down and our orders went up.',
      name: 'Mehreen Aftab',
      role: 'Founder, Koel Skincare',
    },
    cover: 0,
  },
  {
    slug: 'tandoor-street',
    client: 'Tandoor Street',
    sector: 'Restaurant, DHA Lahore',
    year: '2026',
    duration: 'Eight weeks',
    services: ['Social media', 'Paid advertising'],
    did: 'Launch campaign for a new restaurant in DHA',
    result: 'Fully booked for the first three weekends',
    brief: 'A new restaurant with no following, opening in a neighbourhood that already had forty places to eat. The owners needed full tables from the first weekend, not the third month.',
    approach: [
      'Filmed the kitchen for two weeks before opening and posted one short video a day.',
      'Invited sixty local food writers and creators to two preview nights.',
      'Ran ads only within eight kilometres of the restaurant, with a reservation link.',
      'Set up Google Business with the menu, photos and booking so searches led straight to a table.',
    ],
    metrics: [
      { to: 3, decimals: 0, suffix: '', label: 'Fully booked weekends from opening day' },
      { to: 1.4, decimals: 1, suffix: 'm', label: 'Video views in the launch month' },
      { to: 62, decimals: 0, suffix: '%', label: 'Of reservations made through the ad link' },
    ],
    chart: { title: 'Reservations each week', unit: 'tables', labels: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Wk 5', 'Wk 6'], values: [142, 168, 175, 160, 181, 190] },
    cover: 1,
  },
  {
    slug: 'sabz-homes',
    client: 'Sabz Homes',
    sector: 'Housing developer',
    year: '2025',
    duration: 'Five months',
    services: ['Search and SEO', 'Paid advertising'],
    did: 'Search ads and landing pages for a housing project',
    result: 'Cost for each enquiry cut by more than half',
    brief: 'Sabz Homes was paying for clicks from people who were browsing, not buying. The sales team spent most of its day calling enquiries that went nowhere.',
    approach: [
      'Rewrote the search campaigns around the words serious buyers use, such as plot sizes and payment plans.',
      'Built a separate landing page for each plot size, with the price and plan shown up front.',
      'Added three questions to the enquiry form so the sales team could call the strongest leads first.',
      'Published guides on payment plans and possession dates that now rank on the first page.',
    ],
    metrics: [
      { to: 54, decimals: 0, suffix: '%', label: 'Lower cost for each enquiry' },
      { to: 2.1, decimals: 1, suffix: 'x', label: 'More site visits booked each month' },
      { to: 9, decimals: 0, suffix: '', label: 'Searches where the site ranks on page one' },
    ],
    chart: { title: 'Cost for each enquiry', unit: 'Rs', labels: ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5'], values: [2600, 2150, 1700, 1350, 1190] },
    quote: {
      text: 'The monthly report is two pages and I understand all of it. That alone was worth changing agencies for.',
      name: 'Bilal Chaudhry',
      role: 'Marketing head, Sabz Homes',
    },
    cover: 2,
  },
  {
    slug: 'rangrez-studio',
    client: 'Rangrez Studio',
    sector: 'Clothing label',
    year: '2026',
    duration: 'Six weeks',
    services: ['Social media', 'Email and WhatsApp'],
    did: 'Eid collection film and email flows',
    result: 'Sold out in nine days',
    brief: 'Rangrez releases one large collection before each Eid. The previous launch sold slowly and ended in a discount, which the founder did not want to repeat.',
    approach: [
      'Made a ninety-second film of the collection and cut it into fourteen shorter pieces.',
      'Opened a waiting list three weeks early and gave it first access for 24 hours.',
      'Sent past customers a WhatsApp preview with their usual size already selected.',
      'Held back paid ads until day three, then pointed them only at what was still in stock.',
    ],
    metrics: [
      { to: 9, decimals: 0, suffix: '', label: 'Days to sell out the collection' },
      { to: 34, decimals: 0, suffix: '%', label: 'Of orders from returning customers' },
      { to: 0, decimals: 0, suffix: '', label: 'Pieces sold at a discount' },
    ],
    chart: { title: 'Stock remaining', unit: '%', labels: ['Day 1', 'Day 3', 'Day 5', 'Day 7', 'Day 9'], values: [71, 48, 29, 11, 0] },
    cover: 3,
  },
]

export const STEPS: [string, string][] = [
  ['Audit', 'Two weeks inside your numbers, your pages and your competitors, ending in a written report you keep.'],
  ['Plan', 'One page that says who we are talking to, what we will say, where, and what it should cost.'],
  ['Launch', 'We make the content, build the campaigns and switch them on, with small tests before big budgets.'],
  ['Report', 'A plain-language report every month: what we spent, what came back and what we change next.'],
]

export const FACTS: [string, string][] = [
  ['Since', '2019'],
  ['Based in', 'Lahore, working worldwide'],
  ['Team', '14 strategists, makers and media buyers'],
  ['Clients', 'Retail, food, property and fashion'],
]

export const VALUES: [string, string][] = [
  ['We show the numbers', 'You get access to the ad accounts and the analytics. Nothing is reported that you cannot check yourself.'],
  ['We switch things off', 'If an ad, a channel or a whole idea is not paying for itself, we say so and stop it.'],
  ['One team, one plan', 'The people who plan your campaign are the people who make it and report on it.'],
]

export const TEAM: [string, string][] = [
  ['Hamza Riaz', 'Founder and strategy'],
  ['Sana Iqbal', 'Head of content'],
  ['Omar Sheikh', 'Paid media lead'],
  ['Zainab Malik', 'Search and analytics'],
  ['Ali Raza', 'Video and motion'],
  ['Noor Fatima', 'Client partner'],
]

export const ROLES: [string, string, string][] = [
  ['Media buyer', 'Full time, Lahore', 'Two or more years running Meta and Google campaigns with real budgets.'],
  ['Video editor', 'Full time, Lahore or remote', 'Short-form editing for Reels and TikTok, with motion graphics a plus.'],
]

export const FAQS: [string, string][] = [
  ['How much does it cost?', 'Most clients spend between Rs 150,000 and Rs 400,000 a month with us, plus their ad budget. We quote a fixed monthly fee after the audit, so there are no surprises.'],
  ['Is there a minimum contract?', 'Three months, because that is how long it takes to see what works. After that it runs month to month.'],
  ['Who owns the ad accounts and content?', 'You do. Everything is set up in your name, and you keep it if we stop working together.'],
  ['How soon will we see results?', 'Paid campaigns usually show a clear direction within four to six weeks. Search and SEO take three to six months.'],
  ['Do you work with small businesses?', 'Yes. About half our clients have fewer than twenty staff. We scope the work to the budget you have.'],
]

export const BUDGETS = [
  'Under Rs 150,000 a month',
  'Rs 150,000 to 400,000 a month',
  'Rs 400,000 to 1,000,000 a month',
  'More than Rs 1,000,000 a month',
]

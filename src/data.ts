// Every string, price and figure here comes from the ALTERNATE screens on the pen.dev canvas.

export const IMG = {
  six: '/img/six.png',
  vault: '/img/vault.png',
  moment: '/img/moment.png',
  ponting: '/img/ponting-bat.png',
  raza: '/img/raza.png',
  mohur: '/img/mohur.png',
  stumps: '/img/stumps.png',
  blazer: '/img/blazer.png',
  proclamation: '/img/proclamation.png',
  heirlooms: '/img/heirlooms.png',
  watches: '/img/watches.png',
  film: '/img/film.png',
}

export type Item = {
  id: string
  name: string
  img: string
  price: number
  changePct: number
  lot?: string
  category?: string
}

export const ITEMS: Record<string, Item> = {
  six: { id: 'six', name: 'The 2011 Six', img: IMG.six, price: 612, changePct: 1.8, lot: 'LOT 014 · MEMORABILIA', category: 'Cricket memorabilia' },
  ponting: { id: 'ponting', name: "Ponting's 2003 final bat", img: IMG.ponting, price: 4120, changePct: 6.4, category: 'Cricket memorabilia' },
  mohur: { id: 'mohur', name: '1911 Delhi Durbar mohur', img: IMG.mohur, price: 1860, changePct: 4.1, category: 'Coins & currency' },
  raza: { id: 'raza', name: 'Raza · Untitled, 1974', img: IMG.raza, price: 9240, changePct: 3.7, category: 'Modern art' },
  stumps: { id: 'stumps', name: '1983 final stumps (pair)', img: IMG.stumps, price: 430, changePct: -0.9, category: 'Cricket memorabilia' },
  blazer: { id: 'blazer', name: "Gavaskar's 1971 tour blazer", img: IMG.blazer, price: 1240, changePct: 7.8, category: 'Cricket memorabilia' },
  proclamation: { id: 'proclamation', name: '1947 Independence proclamation', img: IMG.proclamation, price: 680, changePct: 0, category: 'Royal heirlooms' },
  ticket: { id: 'ticket', name: 'Wankhede 2011 turnstile ticket', img: IMG.moment, price: 210, changePct: 2.4, category: 'Cricket memorabilia' },
  cap: { id: 'cap', name: "Kapil's 1983 signed cap", img: IMG.blazer, price: 1980, changePct: 0.8, category: 'Cricket memorabilia' },
  souza: { id: 'souza', name: 'Souza · Head, 1962', img: IMG.raza, price: 2180, changePct: 11.8, category: 'Modern art' },
}

/* ---------- Dashboard ---------- */

export const GAINERS = [
  { item: ITEMS.ponting, price: '₹4,120', change: '+6.4%' },
  { item: ITEMS.mohur, price: '₹1,860', change: '+4.1%' },
  { item: ITEMS.raza, price: '₹9,240', change: '+3.7%' },
]

export const MOST_TRADED = [
  { item: ITEMS.six, volume: '148 sh · ₹90,600', price: '₹612', change: '+1.8%', up: true },
  { item: ITEMS.stumps, volume: '96 sh · ₹41,200', price: '₹430', change: '−0.9%', up: false },
  { item: ITEMS.raza, volume: '61 sh · ₹5,63,000', price: '₹9,240', change: '+3.7%', up: true },
]

export const NEW_LISTINGS = [
  { item: ITEMS.blazer, price: '₹1,240', listed: '2 days ago' },
  { item: ITEMS.proclamation, price: '₹680', listed: '5 days ago' },
]

export const CATEGORY_CHIPS = ['Cricket memorabilia', 'Modern art', 'Coins & currency', 'Watches']

export const CATEGORY_RAIL = [
  { item: ITEMS.six, price: '₹612', change: '+1.8%', up: true, spark: 'sparkUp1' as const },
  { item: ITEMS.ponting, price: '₹4,120', change: '+6.4%', up: true, spark: 'sparkUp2' as const },
  { item: ITEMS.stumps, price: '₹430', change: '−0.9%', up: false, spark: 'sparkDown' as const },
]

export const CLOSING_SOON = [
  { item: ITEMS.mohur, pct: 78, meta: '78% subscribed · 220 shares left', time: '2h 40m' },
  { item: ITEMS.raza, pct: 61, meta: '61% subscribed · 390 shares left', time: '1d 4h' },
]

export const EXCHANGE_FEED = [
  { icon: 'users' as const, tone: 'pos' as const, text: '689 people now own a share of The 2011 Six', time: '2h' },
  { icon: 'gavel' as const, tone: 'brass' as const, text: "A new buyout offer of ₹7,40,000 was made on Ponting's 2003 final bat", time: '5h' },
  { icon: 'trendingUp' as const, tone: 'pos' as const, text: 'Raza · Untitled, 1974 crossed ₹92 L market cap', time: '1d' },
]

export const FOR_YOU = [
  { item: ITEMS.ticket, price: '₹210', change: '+2.4%' },
  { item: ITEMS.cap, price: '₹1,980', change: '+0.8%' },
]

export const PRESS = [
  { source: 'MINT · 8 AUG 2026', headline: 'Fractional collectables find a foothold with Indian retail investors' },
  { source: 'ESPNCRICINFO · 2 AUG 2026', headline: 'The 2011 final ball resurfaces — now owned by 689 people' },
]

/* ---------- Explore ---------- */

export const EXPLORE_FILTERS = ['All', 'Under ₹1,000', 'Highly traded', 'Newly authenticated', 'Closing soon']

export const CATEGORIES = [
  { name: 'Cricket memorabilia', count: '128 objects', img: IMG.six },
  { name: 'Modern art', count: '86 objects', img: IMG.raza },
  { name: 'Coins & currency', count: '214 objects', img: IMG.mohur },
  { name: 'Film & music', count: '57 objects', img: IMG.film },
  { name: 'Royal heirlooms', count: '33 objects', img: IMG.heirlooms },
  { name: 'Watches', count: '41 objects', img: IMG.watches },
]

export const UNDERVALUED = [
  { item: ITEMS.six, meta: 'Last ₹612 · comparable est. ₹740', delta: '−17%' },
  { item: ITEMS.proclamation, meta: 'Last ₹680 · comparable est. ₹790', delta: '−14%' },
]

export const NEWLY_AUTHENTICATED = [
  { item: ITEMS.ponting, verified: 'Verified 2d ago', price: '₹4,120' },
  { item: ITEMS.stumps, verified: 'Verified 6d ago', price: '₹430' },
  { item: ITEMS.blazer, verified: 'Verified 11d ago', price: '₹1,240' },
]

export const EXPLORE_CLOSING = [
  { item: ITEMS.cap, pct: 84, meta: '84% subscribed · 160 shares left', time: '5h 10m' },
  { item: ITEMS.ticket, pct: 46, meta: '46% subscribed · 540 shares left', time: '2d 3h' },
]

export const COLLECTIONS = [
  { name: 'Independence-era memorabilia', meta: '18 objects · from ₹420', img: IMG.proclamation },
  { name: 'World Cup winning moments', meta: '12 objects · from ₹210', img: IMG.moment },
]

export const REFINE = {
  entry: ['₹500–5,000', '₹5,000–50,000', '₹50,000+'],
  minimum: ['₹500', '₹25,000'],
  liquidity: ['Highly traded', 'Steady', 'Long hold'],
}

/* ---------- Portfolio ---------- */

export type Holding = {
  item: Item
  shares: number
  avg: number
  value: string
  gain: string
  up: boolean
}

export const HOLDINGS: Holding[] = [
  { item: ITEMS.six, shares: 12, avg: 548, value: '₹7,344', gain: '+₹768 · +11.7%', up: true },
  { item: ITEMS.ponting, shares: 1, avg: 3600, value: '₹4,120', gain: '+₹520 · +14.4%', up: true },
  { item: ITEMS.mohur, shares: 2, avg: 1990, value: '₹3,720', gain: '−₹260 · −6.5%', up: false },
  { item: ITEMS.blazer, shares: 2, avg: 1150, value: '₹2,480', gain: '+₹180 · +7.8%', up: true },
  { item: ITEMS.souza, shares: 1, avg: 1950, value: '₹2,180', gain: '+₹230 · +11.8%', up: true },
  { item: ITEMS.stumps, shares: 1, avg: 500, value: '₹430', gain: '−₹70 · −14.0%', up: false },
]

export const ALLOCATION = [
  { name: 'Cricket memorabilia', value: '₹14,374', pct: 71, color: '#ede6d6' },
  { name: 'Coins & currency', value: '₹3,720', pct: 18, color: '#b8935b' },
  { name: 'Modern art', value: '₹2,180', pct: 11, color: '#6f6858' },
]

export const REALIZED = [
  { kind: 'Buyout payout', meta: "Tendulkar's 100th-century bat · 8 shares · 24 Jun 2026", amount: '+₹18,000', pct: '+45.2%' },
  { kind: 'Shares sold', meta: '1947 Independence proclamation · 8 shares · 2 May 2026', amount: '+₹1,240', pct: '+18.1%' },
]

export const PENDING = [
  { title: 'Open sell order', meta: 'The 2011 Six · 4 shares at ₹640', time: 'Expires 17:00', icon: 'candles' as const },
  { title: 'Buyout vote open', meta: "Ponting's 2003 final bat · ₹7,40,000 offer", time: '3d left', icon: 'gavel' as const },
  { title: 'Offering closing', meta: 'Gavaskar’s blazer · you hold 2 of 5 reserved', time: '5h 10m', icon: 'clock' as const },
]

/* ---------- Item detail: The 2011 Six ---------- */

export const RANGES = ['1W', '1M', '3M', '6M', '1Y', 'All']
export const DETAIL_TABS = ['Overview', 'Object', 'Activity', 'News']

export const STATS = [
  { label: 'Market cap', value: '₹6,12,000' },
  { label: 'Shares issued', value: '1,000' },
  { label: 'Since listing', value: '+22.4%', pos: true },
  { label: 'Session volume', value: '148 sh' },
]

export const ORDER_BOOK = {
  bids: [
    { price: '₹608', qty: '12', fill: 0.3 },
    { price: '₹602', qty: '3', fill: 0.1 },
    { price: '₹590', qty: '40', fill: 1 },
    { price: '₹575', qty: '25', fill: 0.62 },
  ],
  asks: [
    { price: '₹615', qty: '4', fill: 0.2 },
    { price: '₹624', qty: '20', fill: 0.5 },
    { price: '₹650', qty: '8', fill: 0.26 },
    { price: '₹700', qty: '15', fill: 0.4 },
  ],
  meta: ['Spread ₹7 · 1.14%', 'Session volume 148 sh', 'Last trade 14:06'],
}

export const TRADING_RULES = [
  'Asks cannot be placed below ₹184, 30% of the last traded price.',
  'Shares you buy are locked for 5 business days before they can be re-sold.',
  'You cannot hold an open bid and an open ask on the same item.',
]

export const PROVENANCE = [
  { date: '2 APR 2011', title: 'Origin', body: 'Wankhede Stadium, Mumbai. Recovered from the lower tier by a stadium steward.' },
  { date: '2011 — 2019', title: 'Private ownership', body: 'Held by the recovering steward, then by a single private collector in Mumbai.' },
  { date: 'NOV 2019', title: 'Auction, Mumbai', body: 'Sold at public auction with signed steward testimony and stadium records.' },
  { date: 'JAN 2024', title: 'Authenticated', body: 'Broadcast-frame match and BCCI ball records, certified by Forensic Sports Authentication (India).' },
  { date: 'FEB 2024', title: 'Acquired by ALTERNATE', body: 'Purchased outright for ₹4,40,000 and moved into the BKC vault.' },
  { date: 'MAR 2024', title: 'Listed', body: '1,000 shares at ₹500 · initial valuation ₹5,00,000.' },
]

export const CERTIFICATE = {
  no: 'ALT-04-2011SIX-0007',
  rows: [
    { label: 'Issued by', value: 'Forensic Sports\nAuthentication (India)' },
    { label: 'Method', value: 'Broadcast-frame match\n+ BCCI ball records' },
    { label: 'Date', value: '18 Jan 2024' },
  ],
}

export const VALUATION = [
  { label: 'Appraiser', value: 'Sethi & Associates, Mumbai' },
  { label: 'Last appraised', value: '12 Aug 2026' },
  { label: 'Next review', value: 'Feb 2027' },
]

export const SPECIFICATIONS = [
  { label: 'Format', value: 'ODI · World Cup final' },
  { label: 'Opponent', value: 'Sri Lanka' },
  { label: 'Venue', value: 'Wankhede Stadium, Mumbai' },
  { label: 'Date', value: '2 Apr 2011' },
  { label: 'Manufacturer', value: 'SG (Sanspareils Greenlands)' },
  { label: 'Serial no.', value: 'SG-WC11-0621' },
  { label: 'Held in trust by', value: 'ALTERNATE Series 04 LLP' },
]

export const DOCUMENTS = [
  { icon: 'verified' as const, label: 'Certificate of authenticity', meta: 'ALT-04-2011SIX-0007' },
  { icon: 'route' as const, label: 'Ownership audit trail', meta: '5 events · since 2 Apr 2011' },
  { icon: 'clipboard' as const, label: 'Condition report', meta: 'Grade A · inspected 12 Aug 2026' },
  { icon: 'shield' as const, label: 'Custody and insurance', meta: "Sotheby's · Insured ₹6,50,000 · BKC vault" },
]

export const BUYOUT_HISTORY = [
  { amount: '₹7,40,000', who: 'Sports Heritage Fund', status: 'Pending vote', date: '12 Aug 2026', tone: 'brass' as const },
  { amount: '₹6,20,000', who: 'Private collector', status: 'Rejected', date: '14 Jun 2026', tone: 'muted' as const },
  { amount: '₹5,40,000', who: 'Private collector', status: 'Rejected', date: '19 Nov 2025', tone: 'muted' as const },
]

export const SHAREHOLDER_SPLIT = [
  { label: '1–10 shares · 58%', pct: 58 },
  { label: '11–100 · 30%', pct: 30 },
  { label: '100+ · 12%', pct: 12 },
]

/* ---------- Buyout journey ---------- */

export const BUYOUT = {
  offer: '₹9.2 Cr',
  perShare: '₹6,133 / share · offered by a private collector',
  youHold: '12 shares',
  invested: '₹42,000',
  receive: '₹73,600',
  gain: '+₹31,600 · +75%',
  approved: 62,
  needed: 75,
  votes: '9,320 of 15,000 shares voted',
  daysLeft: '3 days left',
}

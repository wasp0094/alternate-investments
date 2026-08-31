import { motion } from 'framer-motion'
import { Icon, Row, SectionHead, Thumb } from '../components/ui'
import { press, stagger } from '../motion'
import { useApp } from '../state'

/* The canvas has no Account screen — this is built from the same system so the tab isn't a dead end. */
const GROUPS: { title: string; rows: { icon: 'verified' | 'fileText' | 'shield' | 'history' | 'rule' | 'bell'; label: string; meta: string }[] }[] = [
  {
    title: 'Account',
    rows: [
      { icon: 'verified', label: 'KYC & PAN', meta: 'Verified · 4 Mar 2024' },
      { icon: 'shield', label: 'Bank & wallet', meta: 'HDFC ····4192 · ₹42,600' },
      { icon: 'bell', label: 'Notifications', meta: 'Buyouts, fills, offerings' },
    ],
  },
  {
    title: 'Records',
    rows: [
      { icon: 'fileText', label: 'Statements', meta: 'Monthly · FY 2026–27' },
      { icon: 'history', label: 'Transaction history', meta: '38 events' },
      { icon: 'rule', label: 'Legal & disclosures', meta: 'LLP structure, risks, terms' },
    ],
  },
]

export function Account() {
  const { s } = useApp()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 26, padding: '54px 20px 120px' }}>
      <motion.div {...stagger(0)} style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
        <div style={{ width: 52, height: 52, borderRadius: 999, background: 'var(--brass-tint)', border: '1px solid var(--brass-line)', display: 'grid', placeItems: 'center', fontFamily: 'var(--display)', fontSize: 22, color: 'var(--brass)' }}>
          A
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ fontFamily: 'var(--display)', fontSize: 24, letterSpacing: '-0.3px' }}>Aditi</div>
          <div style={{ fontSize: 11, color: 'var(--t3)' }}>Member since Mar 2024 · Mumbai</div>
        </div>
      </motion.div>

      <motion.div
        {...stagger(1)}
        style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 12, padding: '16px 17px', display: 'flex', flexDirection: 'column', gap: 12 }}
      >
        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.8px', color: 'var(--t3)' }}>WALLET</div>
        <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.9px' }}>₹42,600</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <motion.button whileTap={press} style={{ flex: 1, padding: '11px 14px', borderRadius: 999, background: 'var(--brass)', fontSize: 12, fontWeight: 600, color: 'var(--ground)' }}>
            Add funds
          </motion.button>
          <motion.button whileTap={press} style={{ flex: 1, padding: '11px 14px', borderRadius: 999, border: '1px solid var(--line)', fontSize: 12, fontWeight: 600, color: 'var(--t3)' }}>
            Withdraw
          </motion.button>
        </div>
      </motion.div>

      {GROUPS.map((g, gi) => (
        <section key={g.title} style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
          <SectionHead title={g.title} />
          <div>
            {g.rows.map((r, i) => (
              <Row key={r.label} divider={i > 0} padding="13px 0" delay={gi * 0.06 + i * 0.04} onClick={() => {}}>
                <div style={{ width: 30, height: 30, borderRadius: 999, background: 'var(--raised)', display: 'grid', placeItems: 'center' }}>
                  <Icon name={r.icon} size={14} color="var(--t3)" />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{r.label}</span>
                  <span style={{ fontSize: 10, color: 'var(--t3)' }}>{r.meta}</span>
                </div>
                <Icon name="chevronRight" size={13} color="var(--t3)" />
              </Row>
            ))}
          </div>
        </section>
      ))}

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 10.5, color: 'var(--t4)', lineHeight: 1.5 }}>
        <Thumb src="/img/vault.png" size={34} radius={8} />
        Objects are held by ALTERNATE Series LLPs and stored in the BKC vault, insured by Sotheby’s.
      </div>
    </div>
  )
}

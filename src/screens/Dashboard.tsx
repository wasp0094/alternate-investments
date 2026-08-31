import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  CATEGORY_CHIPS,
  CATEGORY_RAIL,
  CLOSING_SOON,
  EXCHANGE_FEED,
  FOR_YOU,
  GAINERS,
  MOST_TRADED,
  NEW_LISTINGS,
  PRESS,
} from '../data'
import { Mark } from '../components/Mark'
import { AnimatedNumber, Card, Change, Icon, Pill, Progress, Row, SectionHead, Spark, Thumb } from '../components/ui'
import { press, softSpring, stagger } from '../motion'
import { useApp } from '../state'

const HOLDING_THUMBS = ['/img/six.png', '/img/ponting-bat.png', '/img/mohur.png', '/img/raza.png']

export function Dashboard() {
  const { s, d } = useApp()
  const [chip, setChip] = useState(0)
  const open = (id: string) => d({ type: 'open', itemId: id })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28, padding: '54px 20px 120px' }}>
      {/* header */}
      <motion.div {...stagger(0)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Mark size={26} />
          <div style={{ fontSize: 13.5, color: 'var(--t1)' }}>Good evening, Aditi</div>
        </div>
        <div style={{ display: 'flex', gap: 9 }}>
          {(['search', 'bell'] as const).map((n) => (
            <motion.button
              key={n}
              whileTap={press}
              onClick={() => (n === 'search' ? d({ type: 'tab', tab: 'explore' }) : undefined)}
              aria-label={n === 'search' ? 'Search' : 'Notifications'}
              style={{
                position: 'relative',
                width: 34,
                height: 34,
                borderRadius: 999,
                background: 'var(--surface-3)',
                border: '1px solid var(--line)',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <Icon name={n} size={15} color="var(--t1)" />
              {n === 'bell' && s.buyout !== 'none' && s.buyout !== 'exited' && (
                <span
                  style={{
                    position: 'absolute',
                    top: 6,
                    right: 7,
                    width: 6,
                    height: 6,
                    borderRadius: 999,
                    background: 'var(--brass)',
                  }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* portfolio snapshot */}
      <motion.div
        {...stagger(1)}
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--line)',
          borderRadius: 14,
          padding: '16px 17px',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.8px', color: 'var(--t3)' }}>YOUR PORTFOLIO</div>
            <motion.button
              whileTap={press}
              onClick={() => d({ type: 'tab', tab: 'portfolio' })}
              style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10.5, color: 'var(--t3)' }}
            >
              All holdings
              <Icon name="chevronRight" size={12} color="var(--t3)" />
            </motion.button>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.9px' }}>₹</span>
            <AnimatedNumber value={18420} style={{ fontSize: 30, fontWeight: 600, letterSpacing: '-0.9px' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="trendingUp" size={15} color="var(--pos)" />
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--pos)', letterSpacing: '-0.13px' }}>+₹214</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--pos)', letterSpacing: '-0.13px' }}>+1.2% today</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          {HOLDING_THUMBS.map((src, i) => (
            <motion.div key={src} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...softSpring, delay: 0.18 + i * 0.05 }}>
              <Thumb src={src} size={40} radius={9} />
            </motion.div>
          ))}
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 9,
              background: 'var(--raised)',
              border: '1px solid var(--line)',
              display: 'grid',
              placeItems: 'center',
              fontSize: 11,
              fontWeight: 600,
              color: 'var(--t3)',
            }}
          >
            +2
          </div>
          <div style={{ fontSize: 10.5, color: 'var(--t3)', lineHeight: 1.35 }}>
            6 items
            <br />
            1,240 shares
          </div>
        </div>
      </motion.div>

      {/* top gainers */}
      <Section delay={0.1}>
        <SectionHead title="Top gainers today" meta="Session closes 17:00" />
        <div className="hrail" style={{ gap: 10, margin: '0 -20px', padding: '0 20px' }}>
          {GAINERS.map((g, i) => (
            <Card key={g.item.id} delay={0.12 + i * 0.05} onClick={() => open(g.item.id)} style={{ width: 148, flexShrink: 0, padding: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div
                style={{
                  width: '100%',
                  height: 80,
                  borderRadius: 8,
                  backgroundImage: `url(${g.item.img})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <div style={{ fontSize: 11.5, fontWeight: 600 }}>{g.item.name}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: '-0.12px' }}>{g.price}</span>
                <Change text={g.change} up />
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* most traded */}
      <Section delay={0.14}>
        <SectionHead title="Most traded today" meta="By volume" />
        <div>
          {MOST_TRADED.map((m, i) => (
            <Row key={m.item.id + i} divider={i > 0} onClick={() => open(m.item.id)} delay={0.16 + i * 0.04}>
              <Thumb src={m.item.img} size={38} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
                <div style={{ fontSize: 12, fontWeight: 600 }}>{m.item.name}</div>
                <div style={{ fontSize: 10, color: 'var(--t3)' }}>{m.volume}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '-0.12px' }}>{m.price}</span>
                <Change text={m.change} up={m.up} size={10.5} />
              </div>
            </Row>
          ))}
        </div>
      </Section>

      {/* new listings */}
      <Section delay={0.18}>
        <SectionHead title="New listings" meta="See all" chevron onMeta={() => d({ type: 'tab', tab: 'explore' })} />
        <div className="hrail" style={{ gap: 11, margin: '0 -20px', padding: '0 20px' }}>
          {NEW_LISTINGS.map((n, i) => (
            <Card key={n.item.id} delay={0.2 + i * 0.05} onClick={() => open(n.item.id)} style={{ width: 212, flexShrink: 0, overflow: 'hidden' }}>
              <div style={{ width: '100%', height: 116, backgroundImage: `url(${n.item.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
              <div style={{ padding: '11px 12px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 600 }}>{n.item.name}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '-0.12px' }}>{n.price}</span>
                    <span style={{ fontSize: 10, color: 'var(--t3)' }}>/ share</span>
                  </div>
                  <span style={{ fontSize: 10, color: 'var(--t3)' }}>{n.listed}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* browse the salon */}
      <Section delay={0.22}>
        <SectionHead title="Browse the salon" />
        <div className="hrail" style={{ gap: 7, margin: '0 -20px', padding: '0 20px' }}>
          {CATEGORY_CHIPS.map((c, i) => (
            <Pill key={c} label={c} active={chip === i} onClick={() => setChip(i)} layoutId="dash-chip" />
          ))}
        </div>
        <div className="hrail" style={{ gap: 11, margin: '0 -20px', padding: '0 20px' }}>
          {CATEGORY_RAIL.map((c, i) => (
            <Card key={c.item.id} delay={0.24 + i * 0.05} onClick={() => open(c.item.id)} style={{ width: 156, flexShrink: 0, padding: 11, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <Thumb src={c.item.img} size={34} />
                <div style={{ fontSize: 11, fontWeight: 600, lineHeight: 1.25 }}>{c.item.name}</div>
              </div>
              <Spark name={c.spark} delay={0.3 + i * 0.08} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '-0.12px' }}>{c.price}</span>
                <Change text={c.change} up={c.up} size={10.5} />
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* closing soon */}
      <Section delay={0.26}>
        <SectionHead title="Closing soon" meta="Offering window" />
        <div>
          {CLOSING_SOON.map((c, i) => (
            <Row key={c.item.id} divider={i > 0} padding="12px 0" onClick={() => open(c.item.id)} delay={0.28 + i * 0.04}>
              <Thumb src={c.item.img} size={44} radius={9} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 7 }}>
                <div style={{ fontSize: 12, fontWeight: 600 }}>{c.item.name}</div>
                <Progress pct={c.pct} delay={0.3 + i * 0.06} />
                <div style={{ fontSize: 9.5, color: 'var(--t3)' }}>{c.meta}</div>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '5px 9px',
                  borderRadius: 999,
                  background: 'var(--brass-tint)',
                }}
              >
                <Icon name="clock" size={11} color="var(--brass)" />
                <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--brass)' }}>{c.time}</span>
              </div>
            </Row>
          ))}
        </div>
      </Section>

      {/* on the exchange */}
      <Section delay={0.3}>
        <SectionHead title="On the exchange" meta="Live" metaColor="var(--pos)" />
        <div>
          {EXCHANGE_FEED.map((f, i) => (
            <Row key={i} divider={i > 0} padding="12px 0" delay={0.32 + i * 0.04}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 999,
                  background: f.tone === 'pos' ? 'var(--pos-tint)' : 'var(--brass-tint)',
                  display: 'grid',
                  placeItems: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon name={f.icon} size={14} color={f.tone === 'pos' ? 'var(--pos)' : 'var(--brass)'} />
              </div>
              <div style={{ flex: 1, fontSize: 11.5, color: 'var(--t2)', lineHeight: 1.45 }}>{f.text}</div>
              <span style={{ fontSize: 10, color: 'var(--t3)' }}>{f.time}</span>
            </Row>
          ))}
        </div>
      </Section>

      {/* for you */}
      <Section delay={0.34}>
        <SectionHead title="Because you follow cricket" sub="Picked from categories you hold and view" />
        <div className="hrail" style={{ gap: 11, margin: '0 -20px', padding: '0 20px' }}>
          {FOR_YOU.map((f, i) => (
            <Card key={f.item.id} delay={0.36 + i * 0.05} onClick={() => open(f.item.id)} style={{ width: 171, flexShrink: 0, padding: 10, display: 'flex', gap: 10, alignItems: 'center' }}>
              <Thumb src={f.item.img} size={44} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5, minWidth: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 600, lineHeight: 1.25 }}>{f.item.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: '-0.12px' }}>{f.price}</span>
                  <Change text={f.change} up size={10} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* press */}
      <Section delay={0.38}>
        <SectionHead title="In the press" meta="Mentions of listed items" />
        <div>
          {PRESS.map((p, i) => (
            <Row key={i} divider={i > 0} padding="12px 0" delay={0.4 + i * 0.04}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
                <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.7px', color: 'var(--t3)' }}>{p.source}</div>
                <div style={{ fontSize: 11.5, color: 'var(--t2)', lineHeight: 1.4 }}>{p.headline}</div>
              </div>
              <Icon name="arrowUpRight" size={14} color="var(--t3)" />
            </Row>
          ))}
        </div>
      </Section>
    </div>
  )
}

function Section({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...softSpring, delay }}
      style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
    >
      {children}
    </motion.div>
  )
}

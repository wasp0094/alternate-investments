import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import {
  BUYOUT,
  BUYOUT_HISTORY,
  DETAIL_TABS,
  DOCUMENTS,
  ITEMS,
  PRESS,
  RANGES,
  SHAREHOLDER_SPLIT,
  SPECIFICATIONS,
  STATS,
} from '../data'
import { PriceChart } from '../components/PriceChart'
import { Icon, Progress, Row } from '../components/ui'
import { ItemClosed } from './ItemClosed'
import { press, softSpring, spring } from '../motion'
import { useApp } from '../state'

export function ItemDetail({ itemId }: { itemId: string }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { s, d } = useApp()
  const item = ITEMS[itemId] ?? ITEMS.six
  const [tab, setTab] = useState(0)
  const [range, setRange] = useState(5)
  const [saved, setSaved] = useState(false)
  const isSix = item.id === 'six'
  const halted = isSix && s.buyout === 'halted'
  const exited = isSix && s.buyout === 'exited'

  const { scrollY } = useScroll({ container: scrollRef })
  const heroY = useTransform(scrollY, [0, 403], [0, 120])
  const heroScale = useTransform(scrollY, [-160, 0], [1.24, 1])
  const heroFade = useTransform(scrollY, [120, 320], [1, 0])
  const navTitle = useTransform(scrollY, [180, 300], [0, 1])

  useEffect(() => {
    // ?scroll=1200 lands a deep link partway down the page
    const deep = Number(new URLSearchParams(window.location.search).get('scroll') ?? 0)
    if (deep) scrollRef.current?.scrollTo({ top: deep })
  }, [itemId])

  if (halted || exited) return <ItemClosed item={item} exited={exited} onBack={() => d({ type: 'back' })} />

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div className="scroll" ref={scrollRef} style={{ position: 'absolute', inset: 0, paddingBottom: 96 }}>
      {/* hero */}
      <div style={{ position: 'relative', height: 403, overflow: 'hidden' }}>
        <motion.div
          style={{
            position: 'absolute',
            inset: -1,
            y: heroY,
            scale: heroScale,
            backgroundImage: `url(${item.img})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #16130f66 0%, #16130f00 35%, #16130fb8 78%, #16130f 100%)' }} />
        <motion.div
          style={{
            position: 'absolute',
            left: 20,
            right: 20,
            bottom: 14,
            opacity: heroFade,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...softSpring, delay: 0.12 }}
            style={{
              alignSelf: 'flex-start',
              padding: '5px 10px',
              borderRadius: 2,
              background: '#16130f99',
              border: '0.5px solid var(--brass-line)',
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: '1px',
              color: 'var(--brass)',
            }}
          >
            {isSix ? 'Sports memorabilia' : item.category}
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ ...softSpring, delay: 0.16 }} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ fontFamily: 'var(--display)', fontSize: 34, letterSpacing: '-0.17px', lineHeight: 1.08 }}>{item.name}</div>
            {isSix && (
              <div style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.5 }}>
                The ball Dhoni hit into the Wankhede stands to win the World Cup — 2 April 2011, 48.2 overs, off Nuwan
                Kulasekara.
              </div>
            )}
          </motion.div>
          <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
            <div style={{ width: 16, height: 5, borderRadius: 999, background: 'var(--t1)' }} />
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: '#f5f2ec59' }} />
            ))}
          </div>
        </motion.div>
      </div>


      {/* price + chart */}
      <div style={{ padding: '22px 20px 32px', display: 'flex', flexDirection: 'column', gap: 22 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span style={{ fontSize: 24, fontWeight: 500, letterSpacing: '-1.2px' }}>₹</span>
            <span style={{ fontSize: 36, fontWeight: 500, letterSpacing: '-1.2px' }}>{item.price.toLocaleString('en-IN')}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <Icon name="trendingUp" size={16} color={item.changePct >= 0 ? 'var(--pos)' : 'var(--neg)'} />
            <span style={{ fontSize: 14, color: item.changePct >= 0 ? 'var(--pos)' : 'var(--neg)', letterSpacing: '-0.14px' }}>
              {item.changePct >= 0 ? '+₹11' : '−₹4'}
            </span>
            <span style={{ fontSize: 14, color: item.changePct >= 0 ? 'var(--pos)' : 'var(--neg)', letterSpacing: '-0.14px' }}>
              {item.changePct >= 0 ? '+' : ''}
              {item.changePct}% last session
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
          <PriceChart range={RANGES[range]} />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {['Mar 2024', 'Nov 2024', 'Aug 2025', 'Aug 2026'].map((t) => (
              <span key={t} style={{ fontSize: 10, color: 'var(--t3)' }}>
                {t}
              </span>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 2, padding: 3, borderRadius: 999, background: 'var(--surface-3)' }}>
            {RANGES.map((r, i) => (
              <motion.button
                key={r}
                whileTap={press}
                onClick={() => setRange(i)}
                style={{ position: 'relative', padding: '6px 12px', borderRadius: 999 }}
              >
                {range === i && (
                  <motion.span
                    layoutId="range-pill"
                    transition={spring}
                    style={{ position: 'absolute', inset: 0, borderRadius: 999, background: 'var(--line-2)' }}
                  />
                )}
                <span style={{ position: 'relative', fontSize: 11, fontWeight: 600, color: range === i ? 'var(--t1)' : 'var(--t3)' }}>{r}</span>
              </motion.button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 2, padding: 3, borderRadius: 999, background: 'var(--surface-3)' }}>
            <div style={{ padding: 6, borderRadius: 999, background: '#528980' }}>
              <Icon name="trendingUp" size={14} color="#16130f" />
            </div>
            <div style={{ padding: 6, borderRadius: 999 }}>
              <Icon name="candles" size={14} color="var(--t3)" />
            </div>
          </div>
        </div>

        {/* tabs */}
        <div style={{ display: 'flex', gap: 26 }}>
          {DETAIL_TABS.map((t, i) => (
            <button key={t} onClick={() => setTab(i)} style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              <span style={{ fontSize: 13, fontWeight: tab === i ? 600 : 400, color: tab === i ? 'var(--t1)' : 'var(--t3)' }}>{t}</span>
              <div style={{ height: 1.5, borderRadius: 2 }}>
                {tab === i && <motion.div layoutId="detail-tab" transition={spring} style={{ height: 1.5, borderRadius: 2, background: 'var(--t1)' }} />}
              </div>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 22 }}
          >
            {tab === 0 && <Overview holding={s.sixShares} isSix={isSix} />}
            {tab === 1 && <ObjectTab />}
            {tab === 2 && <ActivityTab />}
            {tab === 3 && <NewsTab />}
          </motion.div>
        </AnimatePresence>
      </div>

      </div>

      {/* pinned chrome — stays put while the page scrolls under it */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 92,
          background: '#16130fF2',
          backdropFilter: 'blur(18px)',
          borderBottom: '1px solid #2e2820',
          opacity: navTitle,
          zIndex: 29,
          pointerEvents: 'none',
        }}
      />
      <div style={{ position: 'absolute', top: 44, left: 0, right: 0, display: 'flex', alignItems: 'center', gap: 12, padding: '8px 20px', zIndex: 30 }}>
        <CircleButton onClick={() => d({ type: 'back' })} label="‹" name="Back" />
        <motion.div style={{ flex: 1, opacity: navTitle, display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--display)', fontSize: 14, letterSpacing: '-0.17px' }}>{item.name}</div>
          {isSix && (
            <div style={{ fontSize: 10, color: 'var(--t2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              The ball Dhoni hit into the Wankhe...
            </div>
          )}
        </motion.div>
        <div style={{ display: 'flex', gap: 10 }}>
          <CircleButton label="↑" name="Share" />
          <CircleButton label={saved ? '★' : '☆'} active={saved} onClick={() => setSaved((v) => !v)} name={saved ? 'Saved' : 'Save'} />
        </div>
      </div>

      {/* action bar */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          background: 'var(--ground)',
          borderTop: '1px solid var(--line)',
          padding: '13px 20px 26px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          zIndex: 40,
        }}
      >
        <div style={{ width: 142, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
            <span style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.17px' }}>₹{item.price.toLocaleString('en-IN')}</span>
            <span style={{ fontSize: 12, color: 'var(--t3)' }}>/ share</span>
          </div>
          <span style={{ fontSize: 11, color: 'var(--t3)', letterSpacing: '-0.11px' }}>
            47 available
          </span>
        </div>
        <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => d({ type: 'sheet', sheet: { kind: 'trade', side: 'sell', itemId: item.id } })}
              style={{ ...tradeButton, background: '#d95e45', border: '1px solid #d95e45' }}
            >
              Sell
            </motion.button>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => d({ type: 'sheet', sheet: { kind: 'trade', side: 'buy', itemId: item.id } })}
          style={{ ...tradeButton, background: '#60b57e', border: '1px solid #60b57e' }}
        >
          Buy
        </motion.button>
      </div>
    </div>
  )
}

/** Sell and Buy are peers: identical box, identical type, each taking half the row. */
const tradeButton: CSSProperties = {
  flex: 1,
  height: 44,
  borderRadius: 4,
  fontSize: 15,
  fontWeight: 600,
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
}

function CircleButton({ label, onClick, active, name }: { label: string; onClick?: () => void; active?: boolean; name: string }) {
  return (
    <motion.button
      whileTap={{ scale: 0.88 }}
      onClick={onClick}
      aria-label={name}
      style={{
        width: 36,
        height: 36,
        borderRadius: 999,
        background: '#0e0d0b8c',
        border: '1px solid #f5f2ec2e',
        backdropFilter: 'blur(12px)',
        display: 'grid',
        placeItems: 'center',
        fontSize: 14,
        color: active ? 'var(--brass)' : 'var(--t1)',
        flexShrink: 0,
      }}
    >
      {label}
    </motion.button>
  )
}

function Banner({ icon, title, body }: { icon: 'halt' | 'lock'; title: string; body: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      style={{ overflow: 'hidden', margin: '0 20px', marginTop: 16 }}
    >
      <div style={{ display: 'flex', gap: 10, padding: '13px 15px', borderRadius: 8, background: 'var(--brass-tint)', border: '1px solid #b8935b40' }}>
        <Icon name={icon} size={14} color="var(--brass)" style={{ marginTop: 2 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--brass)' }}>{title}</div>
          <div style={{ fontSize: 11, color: 'var(--t2)', lineHeight: 1.45 }}>{body}</div>
        </div>
      </div>
    </motion.div>
  )
}

function Overview({ holding, isSix }: { holding: number; isSix: boolean }) {
  const value = holding * 612
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ fontFamily: 'var(--display)', fontSize: 21, letterSpacing: '-0.2px' }}>Stats</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 11 }}>
          {STATS.map((st, i) => (
            <motion.div
              key={st.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...softSpring, delay: i * 0.04 }}
              style={{ background: 'var(--surface-2)', border: '1px solid #342d23', borderRadius: 10, padding: '13px 15px', display: 'flex', flexDirection: 'column', gap: 6 }}
            >
              <span style={{ fontSize: 11, color: 'var(--t3)' }}>{st.label}</span>
              <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.15px', color: st.pos ? '#528980' : 'var(--t1)' }}>{st.value}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {isSix && (
        <motion.div
          layout
          style={{ background: '#b8935b12', border: '1px solid #b8935b6b', borderRadius: 4, padding: '15px 17px', display: 'flex', flexDirection: 'column', gap: 12 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.88px', color: 'var(--brass)' }}>YOUR HOLDING</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#528980', letterSpacing: '-0.13px' }}>+₹768 · +11.7%</span>
          </div>
          <div style={{ display: 'flex' }}>
            {[
              { v: String(holding), l: 'Shares' },
              { v: `${((holding / 1000) * 100).toFixed(2)}%`, l: 'Of the item', brass: true },
              { v: '₹548', l: 'Avg cost' },
              { v: `₹${value.toLocaleString('en-IN')}`, l: 'Value' },
            ].map((c) => (
              <div key={c.l} style={{ width: 80, display: 'flex', flexDirection: 'column', gap: 3 }}>
                <motion.span
                  key={c.v}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.14px', color: c.brass ? 'var(--brass)' : 'var(--t1)' }}
                >
                  {c.v}
                </motion.span>
                <span style={{ fontSize: 10, color: 'var(--t3)' }}>{c.l}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </>
  )
}

function ObjectTab() {
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.88px', color: 'var(--t3)' }}>SPECIFICATIONS</div>
        <div>
          {SPECIFICATIONS.map((sp, i) => (
            <div key={sp.label} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '11px 0', borderTop: i > 0 ? '1px solid var(--line)' : undefined }}>
              <span style={{ fontSize: 12, color: 'var(--t3)' }}>{sp.label}</span>
              <span style={{ fontSize: 12, fontWeight: 500, textAlign: 'right' }}>{sp.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {DOCUMENTS.map((doc, i) => (
          <motion.div
            key={doc.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...softSpring, delay: i * 0.04 }}
            whileTap={{ scale: 0.99 }}
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 14px', background: 'var(--surface-2)', border: '1px solid #342d23', borderRadius: 8, cursor: 'pointer' }}
          >
            <div style={{ width: 30, height: 30, borderRadius: 999, background: 'var(--brass-tint)', display: 'grid', placeItems: 'center' }}>
              <Icon name={doc.icon} size={14} color="var(--brass)" />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 12.5, fontWeight: 500 }}>{doc.label}</span>
              <span style={{ fontSize: 10, color: 'var(--t3)' }}>{doc.meta}</span>
            </div>
            <Icon name="chevronRight" size={13} color="var(--t3)" />
          </motion.div>
        ))}
      </div>

      <motion.div whileTap={{ scale: 0.99 }} style={{ position: 'relative', height: 176, borderRadius: 10, overflow: 'hidden', border: '1px solid var(--line)', cursor: 'pointer' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/img/moment.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #16130f33, #16130fcc)' }} />
        <div style={{ position: 'absolute', left: 14, top: 14, padding: '6px 12px', borderRadius: 999, background: '#16130fB8', border: '1px solid #ede6d626', fontSize: 10, fontWeight: 600, letterSpacing: '0.7px' }}>
          0:42
        </div>
        <motion.div
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', left: '50%', top: '50%', translateX: '-50%', translateY: '-50%', width: 52, height: 52, borderRadius: 999, background: '#16130fB8', border: '1px solid #ede6d626', display: 'grid', placeItems: 'center' }}
        >
          <Icon name="play" size={18} color="var(--t1)" />
        </motion.div>
        <div style={{ position: 'absolute', left: 14, bottom: 13, fontSize: 12, fontWeight: 600 }}>Watch the moment</div>
        <div style={{ position: 'absolute', right: 14, bottom: 13, fontSize: 10, color: 'var(--t3)' }}>ICC archive</div>
      </motion.div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ fontSize: 11.5, color: 'var(--t3)', lineHeight: 1.5 }}>
          Shares represent an economic interest in ALTERNATE Series 04 LLP, which holds title to the item.
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11.5, color: 'var(--t2)' }}>
          Read the terms
          <Icon name="arrowUpRight" size={12} color="var(--t2)" />
        </div>
      </div>
    </>
  )
}

function ActivityTab() {
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.88px', color: 'var(--t3)' }}>BUYOUT OFFERS</span>
          <span style={{ fontSize: 10.5, color: 'var(--t3)' }}>17 since 2023</span>
        </div>
        <div style={{ background: 'var(--surface-2)', border: '1px solid #342d23', borderRadius: 10, padding: '15px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span style={{ fontSize: 10.5, color: 'var(--t3)' }}>Highest offer to date</span>
          <span style={{ fontFamily: 'var(--display)', fontSize: 26, letterSpacing: '-0.3px' }}>₹7,40,000</span>
          <Progress pct={92} />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 10, color: 'var(--t3)' }}>92% of the ₹8,00,000 vote floor</span>
            <span style={{ fontSize: 10, color: 'var(--brass)' }}>121% of market cap</span>
          </div>
        </div>
        <div>
          {BUYOUT_HISTORY.map((b, i) => (
            <Row key={b.date} divider={i > 0} padding="12px 0" delay={i * 0.04}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 12.5, fontWeight: 600 }}>{b.amount}</span>
                <span style={{ fontSize: 10, color: 'var(--t3)' }}>{b.who}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                <span
                  style={{
                    padding: '3px 8px',
                    borderRadius: 999,
                    fontSize: 9.5,
                    fontWeight: 600,
                    background: b.tone === 'brass' ? 'var(--brass-tint)' : 'var(--raised)',
                    color: b.tone === 'brass' ? 'var(--brass)' : 'var(--t3)',
                  }}
                >
                  {b.status}
                </span>
                <span style={{ fontSize: 10, color: 'var(--t3)' }}>{b.date}</span>
              </div>
            </Row>
          ))}
        </div>
        <div style={{ fontSize: 11, color: 'var(--t3)', lineHeight: 1.5 }}>
          No sale below ₹8,00,000 without shareholder vote. Open to any verified buyer · minimum offer ₹5,50,000 (90% of
          market cap).
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.88px', color: 'var(--t3)' }}>SHAREHOLDERS</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontFamily: 'var(--display)', fontSize: 26 }}>689</span>
          <span style={{ fontSize: 11, color: 'var(--t3)' }}>shareholders</span>
          <span style={{ fontSize: 11, color: 'var(--pos)', marginLeft: 'auto' }}>+38 this month</span>
        </div>
        <div style={{ display: 'flex', height: 8, borderRadius: 999, overflow: 'hidden', gap: 2 }}>
          {SHAREHOLDER_SPLIT.map((sp, i) => (
            <motion.div
              key={sp.label}
              initial={{ width: 0 }}
              animate={{ width: `${sp.pct}%` }}
              transition={{ ...softSpring, delay: 0.1 + i * 0.08 }}
              style={{ background: ['#b8935b', '#8c6f45', '#554e42'][i], borderRadius: 999 }}
            />
          ))}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {SHAREHOLDER_SPLIT.map((sp, i) => (
            <div key={sp.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 7, height: 7, borderRadius: 999, background: ['#b8935b', '#8c6f45', '#554e42'][i] }} />
              <span style={{ fontSize: 10, color: 'var(--t3)' }}>{sp.label}</span>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 11, color: 'var(--t3)', lineHeight: 1.5 }}>
          Top 10 holders own 34% of shares · avg. 1.5 shares per holder. 68% of holders are in Mumbai, Delhi and
          Bengaluru.
        </div>
      </div>
    </>
  )
}

function NewsTab() {
  return (
    <div>
      {PRESS.map((p, i) => (
        <Row key={p.source} divider={i > 0} padding="14px 0" delay={i * 0.04}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
            <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.7px', color: 'var(--t3)' }}>{p.source}</span>
            <span style={{ fontSize: 12.5, color: 'var(--t2)', lineHeight: 1.45 }}>{p.headline}</span>
          </div>
          <Icon name="arrowUpRight" size={14} color="var(--t3)" />
        </Row>
      ))}
    </div>
  )
}

import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ALLOCATION, HOLDINGS, PENDING, REALIZED } from '../data'
import { CHART_PATHS } from '../components/icons'
import { AnimatedNumber, Change, Icon, Row, SectionHead, Thumb } from '../components/ui'
import { press, softSpring, spring, stagger } from '../motion'
import { useApp } from '../state'

const SORTS = ['Value ↓', 'Gain %', 'Recently added']
const RANGES = ['1M', '6M', '1Y', 'All']

export function Portfolio() {
  const { s, d } = useApp()
  const [range, setRange] = useState(3)
  const [sort, setSort] = useState(0)
  const [mode, setMode] = useState(0)
  const exited = s.buyout === 'exited'
  const needsAttention = s.buyout === 'notified' || s.buyout === 'pending'

  const holdings = useMemo(() => {
    const list = HOLDINGS.filter((h) => !(exited && h.item.id === 'six'))
    if (sort === 1) return [...list].sort((a, b) => parseFloat(b.gain.split('·')[1]) - parseFloat(a.gain.split('·')[1]))
    if (sort === 2) return [...list].slice().reverse()
    return list
  }, [sort, exited])

  const total = exited ? 12930 : s.sixShares === 12 ? 20274 : 20274 + (s.sixShares - 12) * 612

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 26, padding: '54px 20px 120px' }}>
      <motion.div {...stagger(0)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ fontFamily: 'var(--display)', fontSize: 24, letterSpacing: '-0.3px' }}>Portfolio</div>
          <div style={{ fontSize: 11, color: 'var(--t3)' }}>
            {exited ? '5 objects · 7 shares' : `6 objects · ${s.sixShares + 7} shares`}
          </div>
        </div>
        <motion.button
          whileTap={press}
          style={{ width: 34, height: 34, borderRadius: 999, background: 'var(--surface-3)', border: '1px solid var(--line)', display: 'grid', placeItems: 'center' }}
        >
          <Icon name="fileText" size={15} color="var(--t1)" />
        </motion.button>
      </motion.div>

      {/* net worth */}
      <motion.div {...stagger(1)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.8px', color: 'var(--t3)' }}>TOTAL VALUE</div>
          <div style={{ fontSize: 34, fontWeight: 600, letterSpacing: '-1.1px' }}>
            ₹<AnimatedNumber value={total} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="trendingUp" size={15} color="var(--pos)" />
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--pos)', letterSpacing: '-0.13px' }}>+₹214</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--pos)', letterSpacing: '-0.13px' }}>+1.1% today</span>
          </div>
        </div>

        <div style={{ display: 'flex', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 12, padding: '13px 15px' }}>
          {[
            { l: 'All-time return', v: '+₹1,368', pos: true },
            { l: 'Return %', v: '+7.2%', pos: true },
            { l: 'Invested', v: '₹18,906' },
          ].map((c, i) => (
            <div key={c.l} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5, paddingLeft: i > 0 ? 13 : 0, borderLeft: i > 0 ? '1px solid var(--line)' : undefined }}>
              <span style={{ fontSize: 10, color: 'var(--t3)' }}>{c.l}</span>
              <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: '-0.13px', color: c.pos ? 'var(--pos)' : 'var(--t1)' }}>{c.v}</span>
            </div>
          ))}
        </div>

        <ValueChart key={range} />

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {['Mar 2024', 'Aug 2025', 'Aug 2026'].map((t) => (
            <span key={t} style={{ fontSize: 10, color: 'var(--t3)' }}>
              {t}
            </span>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 2, padding: 3, borderRadius: 999, background: 'var(--surface-3)', alignSelf: 'flex-start' }}>
          {RANGES.map((r, i) => (
            <motion.button key={r} whileTap={press} onClick={() => setRange(i)} style={{ position: 'relative', padding: '6px 12px', borderRadius: 999 }}>
              {range === i && <motion.span layoutId="pf-range" transition={spring} style={{ position: 'absolute', inset: 0, borderRadius: 999, background: 'var(--line-2)' }} />}
              <span style={{ position: 'relative', fontSize: 11, fontWeight: 600, color: range === i ? 'var(--t1)' : 'var(--t3)' }}>{r}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* breakdown */}
      <motion.div
        {...stagger(2)}
        style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}
      >
        <div style={{ display: 'flex', gap: 2, padding: 3, borderRadius: 999, background: 'var(--raised)' }}>
          {['By category', 'By performance'].map((t, i) => (
            <motion.button key={t} whileTap={press} onClick={() => setMode(i)} style={{ position: 'relative', flex: 1, padding: '7px 10px', borderRadius: 999 }}>
              {mode === i && <motion.span layoutId="pf-mode" transition={spring} style={{ position: 'absolute', inset: 0, borderRadius: 999, background: 'var(--line-2)' }} />}
              <span style={{ position: 'relative', fontSize: 11, fontWeight: 600, color: mode === i ? 'var(--t1)' : 'var(--t3)' }}>{t}</span>
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {mode === 0 ? (
            <motion.div key="cat" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.18 }} style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
              <div style={{ display: 'flex', gap: 2, height: 9 }}>
                {ALLOCATION.map((a, i) => (
                  <motion.div
                    key={a.name}
                    initial={{ width: 0 }}
                    animate={{ width: `${a.pct}%` }}
                    transition={{ ...softSpring, delay: i * 0.07 }}
                    style={{ background: a.color, borderRadius: 999 }}
                  />
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {ALLOCATION.map((a) => (
                  <div key={a.name} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: a.color }} />
                    <span style={{ flex: 1, fontSize: 11.5, color: 'var(--t2)' }}>{a.name}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '-0.11px' }}>{a.value}</span>
                    <span style={{ fontSize: 10, color: 'var(--t3)', width: 30, textAlign: 'right' }}>{a.pct}%</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key="perf" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.18 }} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: "Best · Ponting's 2003 final bat", value: '+14.4%', pos: true, pct: 100 },
                { label: 'Worst · 1983 final stumps (pair)', value: '−14.0%', pos: false, pct: 97 },
              ].map((r, i) => (
                <div key={r.label} style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 11.5, color: 'var(--t2)' }}>{r.label}</span>
                    <Change text={r.value} up={r.pos} />
                  </div>
                  <div style={{ height: 5, borderRadius: 999, background: 'var(--raised-2)', overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${r.pct}%` }}
                      transition={{ ...softSpring, delay: 0.05 + i * 0.08 }}
                      style={{ height: '100%', borderRadius: 999, background: r.pos ? 'var(--pos)' : 'var(--neg)' }}
                    />
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* holdings */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <SectionHead title="Holdings" meta={`${holdings.length} objects`} />
        <div style={{ display: 'flex', gap: 7 }}>
          {SORTS.map((t, i) => (
            <motion.button
              key={t}
              whileTap={press}
              onClick={() => setSort(i)}
              style={{
                position: 'relative',
                padding: '6px 11px',
                borderRadius: 999,
                border: sort === i ? '1px solid transparent' : '1px solid var(--line)',
              }}
            >
              {sort === i && <motion.span layoutId="pf-sort" transition={spring} style={{ position: 'absolute', inset: 0, borderRadius: 999, background: 'var(--line-2)' }} />}
              <span style={{ position: 'relative', fontSize: 10.5, fontWeight: 600, color: sort === i ? 'var(--t1)' : 'var(--t3)' }}>{t}</span>
            </motion.button>
          ))}
        </div>
        <motion.div layout>
          {holdings.map((h, i) => (
            <motion.div
              key={h.item.id}
              layout
              transition={spring}
              whileTap={{ backgroundColor: 'rgba(237,230,214,0.03)' }}
              onClick={() => d({ type: 'open', itemId: h.item.id })}
              style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '12px 0', borderTop: i > 0 ? '1px solid var(--line)' : undefined, cursor: 'pointer' }}
            >
              <Thumb src={h.item.img} size={44} radius={9} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 600 }}>{h.item.name}</span>
                <span style={{ fontSize: 9.5, color: 'var(--t3)' }}>
                  {h.item.id === 'six' ? `${s.sixShares} shares · avg ₹548` : `${h.shares} share${h.shares > 1 ? 's' : ''} · avg ₹${h.avg.toLocaleString('en-IN')}`}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                <span style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: '-0.13px' }}>
                  {h.item.id === 'six' ? `₹${(s.sixShares * 612).toLocaleString('en-IN')}` : h.value}
                </span>
                <Change text={h.gain} up={h.up} size={10} />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* past holdings appear once the buyout completes */}
      <AnimatePresence>
        {exited && (
          <motion.section
            initial={{ opacity: 0, y: 12, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            style={{ display: 'flex', flexDirection: 'column', gap: 12, overflow: 'hidden' }}
          >
            <SectionHead title="Past holdings" meta="1 exited" />
            <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '12px 13px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 11 }}>
              <Thumb src="/img/six.png" size={44} radius={9} style={{ filter: 'grayscale(0.55)' }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 600 }}>The 2011 Six</span>
                <span style={{ fontSize: 9.5, color: 'var(--t3)' }}>Sold 12 Aug 2026 · +₹31,600 (+75%)</span>
              </div>
              <span style={{ padding: '4px 8px', borderRadius: 999, background: 'var(--raised)', fontSize: 9.5, fontWeight: 600, color: 'var(--t3)' }}>
                Exited — buyout
              </span>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* realized */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
        <SectionHead title="Realized gains" meta={exited ? '₹50,840 lifetime' : '₹19,240 lifetime'} metaColor="var(--pos)" />
        <div>
          {REALIZED.map((r, i) => (
            <Row key={r.kind} divider={i > 0} padding="12px 0" delay={i * 0.04}>
              <div style={{ width: 30, height: 30, borderRadius: 999, background: 'var(--pos-tint)', display: 'grid', placeItems: 'center' }}>
                <Icon name={i === 0 ? 'gavel' : 'arrowOut'} size={14} color="var(--pos)" />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 600 }}>{r.kind}</span>
                <span style={{ fontSize: 9.5, color: 'var(--t3)' }}>{r.meta}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--pos)' }}>{r.amount}</span>
                <span style={{ fontSize: 10, color: 'var(--t3)' }}>{r.pct}</span>
              </div>
            </Row>
          ))}
        </div>
      </section>

      {/* pending actions */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 14, letterSpacing: '-0.2px' }}>Pending actions</span>
          <span style={{ padding: '4px 8px', borderRadius: 999, background: 'var(--brass-tint)', fontSize: 10, fontWeight: 600, color: 'var(--brass)' }}>
            {needsAttention ? 3 : 2}
          </span>
        </div>

        <AnimatePresence>
          {needsAttention && (
            <motion.div
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: 'hidden' }}
            >
              <motion.div
                animate={{ borderColor: ['#b8935b47', '#b8935b9e', '#b8935b47'] }}
                transition={{ duration: 2.6, repeat: Infinity }}
                style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '11px 12px', borderRadius: 10, background: 'var(--brass-tint)', border: '1px solid #b8935b47' }}
              >
                <Icon name="attention" size={14} color="var(--brass)" />
                <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--brass)' }}>1 action needs your attention</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {needsAttention && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => d({ type: 'sheet', sheet: { kind: 'buyoutReview' } })}
              style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '12px 13px', background: 'var(--surface)', border: '1px solid #b8935b47', borderRadius: 11, cursor: 'pointer' }}
            >
              <div style={{ width: 30, height: 30, borderRadius: 999, background: 'var(--brass-tint)', display: 'grid', placeItems: 'center' }}>
                <Icon name="gavel" size={14} color="var(--brass)" />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 600 }}>Buyout offer · The 2011 Six</span>
                <span style={{ fontSize: 9.5, color: 'var(--t3)' }}>₹9.2 Cr offer · you hold {s.sixShares} shares</span>
              </div>
              <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--brass)' }}>Closes in 3 days</span>
            </motion.div>
          )}

          {PENDING.filter((p) => !(needsAttention && p.title === 'Buyout vote open')).map((p, i) => (
            <motion.div
              key={p.title}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...softSpring, delay: i * 0.04 }}
              whileTap={{ scale: 0.99 }}
              style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '12px 13px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 11, cursor: 'pointer' }}
            >
              <div style={{ width: 30, height: 30, borderRadius: 999, background: 'var(--raised)', display: 'grid', placeItems: 'center' }}>
                <Icon name={p.icon} size={14} color="var(--t3)" />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 600 }}>{p.title}</span>
                <span style={{ fontSize: 9.5, color: 'var(--t3)' }}>{p.meta}</span>
              </div>
              <span style={{ fontSize: 10, color: 'var(--t3)' }}>{p.time}</span>
            </motion.div>
          ))}
        </div>
      </section>

      <motion.div
        whileTap={{ scale: 0.99 }}
        style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '13px 14px', background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: 11, cursor: 'pointer' }}
      >
        <div style={{ width: 30, height: 30, borderRadius: 999, background: 'var(--raised)', display: 'grid', placeItems: 'center' }}>
          <Icon name="history" size={14} color="var(--t3)" />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <span style={{ fontSize: 12, fontWeight: 600 }}>All transactions</span>
          <span style={{ fontSize: 10.5, color: 'var(--t3)' }}>Buys, sells and payouts · export for FY 2026–27</span>
        </div>
        <Icon name="chevronRight" size={14} color="var(--t3)" />
      </motion.div>
    </div>
  )
}

function ValueChart() {
  return (
    <div style={{ position: 'relative', width: '100%', height: 120 }}>
      <svg width="100%" height={120} viewBox="0 0 353 120" preserveAspectRatio="none" style={{ display: 'block', overflow: 'visible' }}>
        <defs>
          <linearGradient id="pfFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5fb49c" stopOpacity="0.26" />
            <stop offset="100%" stopColor="#5fb49c" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          d={`${CHART_PATHS.valueLine.d[0]} L 353 120 L 0 120 Z`}
          fill="url(#pfFill)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        />
        <motion.path
          d={CHART_PATHS.valueLine.d[0]}
          fill="none"
          stroke="#5FB49C"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ ...spring, delay: 1 }}
        style={{ position: 'absolute', right: -4, top: 4, width: 9, height: 9, borderRadius: '50%', background: '#F5F2EC', border: '1.5px solid #5FB49C' }}
      >
        <motion.span
          animate={{ scale: [1, 2.4], opacity: [0.55, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
          style={{ position: 'absolute', inset: -2, borderRadius: 999, border: '1px solid #5FB49C' }}
        />
      </motion.div>
    </div>
  )
}

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CATEGORIES,
  COLLECTIONS,
  EXPLORE_CLOSING,
  EXPLORE_FILTERS,
  ITEMS,
  NEWLY_AUTHENTICATED,
  UNDERVALUED,
} from '../data'
import { Card, Change, Icon, Pill, Progress, Row, SectionHead, Thumb } from '../components/ui'
import { softSpring, stagger } from '../motion'
import { useApp } from '../state'

export function Explore() {
  const { d } = useApp()
  const [filter, setFilter] = useState(0)
  const [query, setQuery] = useState('')
  const open = (id: string) => d({ type: 'open', itemId: id })

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return null
    return Object.values(ITEMS).filter(
      (i) => i.name.toLowerCase().includes(q) || (i.category ?? '').toLowerCase().includes(q),
    )
  }, [query])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 26, padding: '54px 20px 120px' }}>
      <motion.div {...stagger(0)} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <div style={{ fontFamily: 'var(--display)', fontSize: 24, letterSpacing: '-0.3px' }}>Explore</div>
        <div style={{ fontSize: 11, color: 'var(--t3)' }}>559 objects across 12 categories</div>
      </motion.div>

      {/* search */}
      <motion.div {...stagger(1)} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <motion.div
          layout
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 9,
            padding: '12px 16px',
            borderRadius: 999,
            background: 'var(--surface-3)',
            border: '1px solid var(--line)',
          }}
        >
          <Icon name="search" size={16} color="var(--t1)" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search objects, makers, moments"
            style={{ flex: 1, fontSize: 12.5, color: 'var(--t1)', minWidth: 0 }}
          />
          <AnimatePresence>
            {query && (
              <motion.button
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                onClick={() => setQuery('')}
                aria-label="Clear search"
              >
                <Icon name="close" size={13} color="var(--t3)" />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
        <motion.button
          whileTap={{ scale: 0.92, rotate: -8 }}
          onClick={() => d({ type: 'sheet', sheet: { kind: 'refine' } })}
          aria-label="Refine"
          style={{ width: 44, height: 44, borderRadius: 999, background: 'var(--brass)', display: 'grid', placeItems: 'center', flexShrink: 0 }}
        >
          <Icon name="sliders" size={17} color="var(--ground)" />
        </motion.button>
      </motion.div>

      <AnimatePresence mode="wait">
        {results ? (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
          >
            <SectionHead title={`${results.length} result${results.length === 1 ? '' : 's'}`} meta={`for “${query}”`} />
            <div>
              {results.map((r, i) => (
                <Row key={r.id} divider={i > 0} padding="12px 0" onClick={() => open(r.id)} delay={i * 0.03}>
                  <Thumb src={r.img} size={44} radius={9} />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{r.name}</div>
                    <div style={{ fontSize: 9.5, color: 'var(--t3)' }}>{r.category}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 600 }}>₹{r.price.toLocaleString('en-IN')}</span>
                    {r.changePct !== 0 && (
                      <Change text={`${r.changePct > 0 ? '+' : '−'}${Math.abs(r.changePct)}%`} up={r.changePct > 0} size={10.5} />
                    )}
                  </div>
                </Row>
              ))}
              {results.length === 0 && (
                <div style={{ padding: '28px 0', fontSize: 11.5, color: 'var(--t3)' }}>
                  Nothing in the salon matches that yet.
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div key="browse" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
            <div className="hrail" style={{ gap: 7, margin: '0 -20px', padding: '0 20px' }}>
              {EXPLORE_FILTERS.map((f, i) => (
                <Pill key={f} label={f} active={filter === i} onClick={() => setFilter(i)} layoutId="explore-filter" />
              ))}
            </div>

            <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <SectionHead title="Browse by category" meta="12 categories" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 11 }}>
                {CATEGORIES.map((c, i) => (
                  <motion.div
                    key={c.name}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...softSpring, delay: 0.05 + i * 0.04 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      position: 'relative',
                      height: 104,
                      borderRadius: 12,
                      border: '1px solid var(--line)',
                      backgroundImage: `url(${c.img})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      overflow: 'hidden',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #16130f00 30%, #16130fdd 100%)' }} />
                    <div style={{ position: 'absolute', left: 12, right: 12, bottom: 11, display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#f5f2ec' }}>{c.name}</div>
                      <div style={{ fontSize: 9.5, color: '#cfc6b4' }}>{c.count}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            <section style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: 14, letterSpacing: '-0.2px' }}>Undervalued picks</div>
                <div style={{ padding: '4px 8px', borderRadius: 999, background: 'var(--brass-tint)', fontSize: 9, fontWeight: 600, letterSpacing: '0.7px', color: 'var(--brass)' }}>
                  CURATED
                </div>
              </div>
              <div style={{ fontSize: 11, color: 'var(--t3)' }}>Objects our curators believe trade below comparable sales.</div>
              <div>
                {UNDERVALUED.map((u, i) => (
                  <Row key={u.item.id} divider={i > 0} padding="12px 0" onClick={() => open(u.item.id)} delay={i * 0.04}>
                    <Thumb src={u.item.img} size={44} radius={9} />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <div style={{ fontSize: 12, fontWeight: 600 }}>{u.item.name}</div>
                      <div style={{ fontSize: 9.5, color: 'var(--t3)' }}>{u.meta}</div>
                    </div>
                    <div style={{ padding: '4px 8px', borderRadius: 999, background: 'var(--brass-tint)', fontSize: 10.5, fontWeight: 600, color: 'var(--brass)' }}>
                      {u.delta}
                    </div>
                  </Row>
                ))}
              </div>
            </section>

            <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <SectionHead title="Newly authenticated" meta="Past 30 days" />
              <div className="hrail" style={{ gap: 11, margin: '0 -20px', padding: '0 20px' }}>
                {NEWLY_AUTHENTICATED.map((n, i) => (
                  <Card key={n.item.id} delay={i * 0.05} onClick={() => open(n.item.id)} style={{ width: 148, flexShrink: 0, padding: 10, display: 'flex', flexDirection: 'column', gap: 9 }}>
                    <div style={{ width: '100%', height: 76, borderRadius: 8, backgroundImage: `url(${n.item.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Icon name="verified" size={12} color="var(--pos)" />
                      <span style={{ fontSize: 9, color: 'var(--pos)' }}>{n.verified}</span>
                    </div>
                    <div style={{ fontSize: 11.5, fontWeight: 600 }}>{n.item.name}</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                      <span style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: '-0.12px' }}>{n.price}</span>
                      <span style={{ fontSize: 9.5, color: 'var(--t3)' }}>/ share</span>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            <section style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              <SectionHead title="Closing soon" meta="Offering window" />
              <div>
                {EXPLORE_CLOSING.map((c, i) => (
                  <Row key={c.item.id} divider={i > 0} padding="12px 0" onClick={() => open(c.item.id)} delay={i * 0.04}>
                    <Thumb src={c.item.img} size={44} radius={9} />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 7 }}>
                      <div style={{ fontSize: 12, fontWeight: 600 }}>{c.item.name}</div>
                      <Progress pct={c.pct} delay={i * 0.06} />
                      <div style={{ fontSize: 9.5, color: 'var(--t3)' }}>{c.meta}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 9px', borderRadius: 999, background: 'var(--brass-tint)' }}>
                      <Icon name="clock" size={11} color="var(--brass)" />
                      <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--brass)' }}>{c.time}</span>
                    </div>
                  </Row>
                ))}
              </div>
            </section>

            <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <SectionHead title="Collections" />
              <div className="hrail" style={{ gap: 11, margin: '0 -20px', padding: '0 20px' }}>
                {COLLECTIONS.map((c, i) => (
                  <motion.div
                    key={c.name}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...softSpring, delay: i * 0.05 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      position: 'relative',
                      width: 232,
                      height: 112,
                      flexShrink: 0,
                      borderRadius: 12,
                      border: '1px solid var(--line)',
                      backgroundImage: `url(${c.img})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      overflow: 'hidden',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #16130f00 30%, #16130fe6 100%)' }} />
                    <div style={{ position: 'absolute', left: 13, right: 13, bottom: 12, display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#f5f2ec' }}>{c.name}</div>
                      <div style={{ fontSize: 9.5, color: '#cfc6b4' }}>{c.meta}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

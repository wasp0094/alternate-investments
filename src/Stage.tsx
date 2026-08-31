import { motion } from 'framer-motion'
import { Mark } from './components/Mark'
import { press } from './motion'
import { useApp, type BuyoutStage } from './state'

type Step = { label: string; hint: string; run: () => void; done: boolean; active: boolean }

/** Director's panel: the flows a prototype can't reach by tapping alone. */
export function Stage() {
  const { s, d } = useApp()

  const stageIndex = (['none', 'notified', 'pending', 'voted', 'resolved', 'halted', 'paid', 'exited'] as BuyoutStage[]).indexOf(s.buyout)

  const steps: Step[] = [
    {
      label: 'Offer arrives',
      hint: 'Push notification on the lock screen',
      done: stageIndex > 1,
      active: stageIndex <= 1,
      run: () => {
        d({ type: 'buyout', stage: 'notified' })
        d({ type: 'lock', on: true })
      },
    },
    {
      label: 'Review and vote',
      hint: 'Offer terms, your position, the 75% threshold',
      done: stageIndex > 3,
      active: stageIndex === 2 || stageIndex === 3,
      run: () => {
        d({ type: 'buyout', stage: s.vote ? 'voted' : 'pending' })
        d({ type: 'tab', tab: 'portfolio' })
        d({ type: 'sheet', sheet: { kind: 'buyoutReview' } })
      },
    },
    {
      label: 'Vote closes',
      hint: 'Result lands as a notification',
      done: stageIndex > 4,
      active: stageIndex === 4,
      run: () => {
        d({ type: 'buyout', stage: 'resolved' })
        d({ type: 'lock', on: true })
      },
    },
    {
      label: 'Trading halts',
      hint: 'Item detail locks while payouts process',
      done: stageIndex > 5,
      active: stageIndex === 5,
      run: () => {
        d({ type: 'buyout', stage: 'halted' })
        d({ type: 'open', itemId: 'six' })
      },
    },
    {
      label: 'Payout lands',
      hint: '₹73,600 credited · +75%',
      done: stageIndex > 6,
      active: stageIndex === 6,
      run: () => {
        d({ type: 'buyout', stage: 'paid' })
        d({ type: 'sheet', sheet: { kind: 'payout' } })
      },
    },
    {
      label: 'Item exited',
      hint: 'Past holdings, item no longer tradable',
      done: s.buyout === 'exited',
      active: stageIndex === 7,
      run: () => {
        d({ type: 'buyout', stage: 'exited' })
        d({ type: 'tab', tab: 'portfolio' })
      },
    },
  ]

  return (
    <motion.aside
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.35, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{ width: 296, display: 'flex', flexDirection: 'column', gap: 22, color: 'var(--t2)' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Mark size={22} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: '0.5px', color: 'var(--t1)' }}>ALTERNATE</span>
          <span style={{ fontSize: 10.5, color: 'var(--t4)' }}>Interactive prototype</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <PanelLabel>THE BUYOUT JOURNEY</PanelLabel>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {steps.map((st, i) => (
            <div key={st.label} style={{ display: 'flex', gap: 11 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 11, paddingTop: 5 }}>
                <motion.span
                  animate={{
                    background: st.done ? '#b8935b' : st.active ? '#16130f' : '#16130f',
                    borderColor: st.done || st.active ? '#b8935b' : '#3a3128',
                    scale: st.active ? 1.15 : 1,
                  }}
                  style={{ width: 9, height: 9, borderRadius: 999, border: '1.5px solid', flexShrink: 0 }}
                />
                {i < steps.length - 1 && <span style={{ width: 1, flex: 1, background: st.done ? '#b8935b59' : '#2e2820' }} />}
              </div>
              <motion.button
                whileTap={press}
                onClick={st.run}
                style={{ flex: 1, textAlign: 'left', paddingBottom: 16, cursor: 'pointer' }}
              >
                <div style={{ fontSize: 12, fontWeight: 600, color: st.active ? 'var(--brass)' : st.done ? 'var(--t2)' : 'var(--t3)' }}>{st.label}</div>
                <div style={{ fontSize: 10.5, color: 'var(--t4)', marginTop: 3, lineHeight: 1.4 }}>{st.hint}</div>
              </motion.button>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <PanelLabel>JUMP TO</PanelLabel>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
          {[
            { l: 'Dashboard', run: () => d({ type: 'tab', tab: 'home' }) },
            { l: 'Explore', run: () => d({ type: 'tab', tab: 'explore' }) },
            { l: 'Item detail', run: () => d({ type: 'open', itemId: 'six' }) },
            { l: 'Buy ticket', run: () => d({ type: 'sheet', sheet: { kind: 'trade', side: 'buy', itemId: 'six' } }) },
            { l: 'Sell ticket', run: () => d({ type: 'sheet', sheet: { kind: 'trade', side: 'sell', itemId: 'six' } }) },
            { l: 'Portfolio', run: () => d({ type: 'tab', tab: 'portfolio' }) },
            { l: 'Refine', run: () => { d({ type: 'tab', tab: 'explore' }); d({ type: 'sheet', sheet: { kind: 'refine' } }) } },
            { l: 'Account', run: () => d({ type: 'tab', tab: 'account' }) },
          ].map((b) => (
            <motion.button
              key={b.l}
              whileTap={press}
              whileHover={{ borderColor: '#b8935b80', color: '#ede6d6' }}
              onClick={b.run}
              style={{ padding: '7px 11px', borderRadius: 999, border: '1px solid #2e2820', fontSize: 10.5, fontWeight: 600, color: 'var(--t3)' }}
            >
              {b.l}
            </motion.button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <PanelLabel>TRY</PanelLabel>
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            'Drag across the price chart to scrub',
            'Pull a sheet down to dismiss it',
            'Switch Market → Limit in the buy ticket',
            'Re-sort holdings and watch rows move',
          ].map((t) => (
            <li key={t} style={{ fontSize: 10.5, color: 'var(--t4)', lineHeight: 1.5, paddingLeft: 12, position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0, top: 7, width: 4, height: 4, borderRadius: 999, background: '#3a3128' }} />
              {t}
            </li>
          ))}
        </ul>
      </div>

      <motion.button
        whileTap={press}
        onClick={() => d({ type: 'reset' })}
        style={{ alignSelf: 'flex-start', padding: '9px 14px', borderRadius: 999, border: '1px solid #2e2820', fontSize: 11, fontWeight: 600, color: 'var(--t3)' }}
      >
        Reset prototype
      </motion.button>
    </motion.aside>
  )
}

function PanelLabel({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 9.5, fontWeight: 600, letterSpacing: '1.2px', color: 'var(--t4)' }}>{children}</div>
}

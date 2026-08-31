import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { REFINE } from '../data'
import { ChoiceChip, Sheet, SheetLabel } from '../components/Sheet'
import { Icon } from '../components/ui'
import { spring } from '../motion'
import { useApp } from '../state'

const MIN = 500
const MAX = 25000

export function RefineSheet() {
  const { d } = useApp()
  const [entry, setEntry] = useState(0)
  const [liquidity, setLiquidity] = useState(0)
  const [minimum, setMinimum] = useState(0.19)
  const track = useRef<HTMLDivElement>(null)
  const close = () => d({ type: 'closeSheet' })

  // count shifts with the filters so the CTA feels connected to the controls
  const count = Math.round(128 - entry * 31 - liquidity * 22 - minimum * 46)
  const amount = Math.round((MIN + (MAX - MIN) * minimum) / 100) * 100

  const setFromPointer = (clientX: number) => {
    const el = track.current
    if (!el) return
    const r = el.getBoundingClientRect()
    setMinimum(Math.min(1, Math.max(0, (clientX - r.left) / r.width)))
  }

  return (
    <Sheet title="Refine" onClose={close}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <SheetLabel>ENTRY PRICE</SheetLabel>
        <div style={{ display: 'flex', gap: 7 }}>
          {REFINE.entry.map((e, i) => (
            <ChoiceChip key={e} label={e} active={entry === i} onClick={() => setEntry(i)} />
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <SheetLabel>MINIMUM INVESTMENT</SheetLabel>
        <div
          ref={track}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId)
            setFromPointer(e.clientX)
          }}
          onPointerMove={(e) => e.currentTarget.hasPointerCapture(e.pointerId) && setFromPointer(e.clientX)}
          style={{ position: 'relative', height: 14, display: 'flex', alignItems: 'center', cursor: 'pointer', touchAction: 'none' }}
        >
          <div style={{ width: '100%', height: 4, borderRadius: 999, background: 'var(--raised-2)' }} />
          <motion.div
            animate={{ width: `${minimum * 100}%` }}
            transition={spring}
            style={{ position: 'absolute', left: 0, height: 4, borderRadius: 999, background: 'var(--brass)' }}
          />
          <motion.div
            animate={{ left: `calc(${minimum * 100}% - 7px)` }}
            transition={spring}
            whileTap={{ scale: 1.25 }}
            style={{
              position: 'absolute',
              width: 14,
              height: 14,
              borderRadius: '50%',
              background: 'var(--t1)',
              border: '2px solid var(--ground)',
            }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11, fontWeight: 600 }}>₹{amount.toLocaleString('en-IN')}</span>
          <span style={{ fontSize: 10, color: 'var(--t3)' }}>₹25,000</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <SheetLabel>EXPECTED LIQUIDITY</SheetLabel>
        <div style={{ display: 'flex', gap: 7 }}>
          {REFINE.liquidity.map((l, i) => (
            <ChoiceChip key={l} label={l} active={liquidity === i} onClick={() => setLiquidity(i)} />
          ))}
        </div>
      </div>

      <div>
        {[
          { label: 'Era', value: 'Any' },
          { label: 'Authentication', value: 'Verified only' },
        ].map((r, i) => (
          <div
            key={r.label}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '11px 0',
              borderTop: i > 0 ? '1px solid var(--line)' : undefined,
            }}
          >
            <span style={{ fontSize: 11.5, color: 'var(--t2)' }}>{r.label}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, fontWeight: 600 }}>
              {r.value}
              <Icon name="chevronRight" size={13} color="var(--t1)" />
            </span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 11, paddingTop: 6 }}>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => {
            setEntry(0)
            setLiquidity(0)
            setMinimum(0.19)
          }}
          style={{ padding: '12px 16px', borderRadius: 999, border: '1px solid var(--line)', fontSize: 12.5, fontWeight: 600, color: 'var(--t3)' }}
        >
          Reset all
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={close}
          style={{ flex: 1, padding: '12px 16px', borderRadius: 999, background: 'var(--brass)', fontSize: 12.5, fontWeight: 600, color: 'var(--ground)' }}
        >
          Show {count} objects
        </motion.button>
      </div>
    </Sheet>
  )
}

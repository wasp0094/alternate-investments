import { motion } from 'framer-motion'
import { ITEMS } from '../data'
import { Sheet } from '../components/Sheet'
import { Icon } from '../components/ui'
import { spring } from '../motion'
import { useApp } from '../state'
import { ItemStrip } from './TradeSheet'

/** Confirmation after a market order fills. */
export function FilledSheet({ shares, price, itemId }: { shares: number; price: number; itemId: string }) {
  const { s, d } = useApp()
  const item = ITEMS[itemId] ?? ITEMS.six
  const sold = shares < 0
  const n = Math.abs(shares)

  return (
    <Sheet title={sold ? 'Order filled' : 'Order filled'} onClose={() => d({ type: 'closeSheet' })}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '6px 0 2px' }}>
        <motion.div
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 14 }}
          style={{ position: 'relative', width: 52, height: 52, borderRadius: 999, background: 'var(--pos-tint)', display: 'grid', placeItems: 'center' }}
        >
          <motion.span
            animate={{ scale: [1, 1.9], opacity: [0.5, 0] }}
            transition={{ duration: 1.6, repeat: 2, ease: 'easeOut' }}
            style={{ position: 'absolute', inset: 0, borderRadius: 999, border: '1px solid var(--pos)' }}
          />
          <Icon name="check" size={24} color="var(--pos)" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} style={{ fontFamily: 'var(--display)', fontSize: 22 }}>
          Filled
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} style={{ fontSize: 11.5, color: 'var(--t2)' }}>
          {sold ? 'Sold' : 'Bought'} {n} shares of {item.name} at ₹{price}
        </motion.div>
      </div>

      <ItemStrip item={item} />

      <div>
        {[
          { l: 'Order ID', v: 'ALT-ORD-88213' },
          { l: 'Filled at', v: '14:06 · 12 Aug 2026' },
          { l: 'Total debit', v: `₹${(n * price + 37).toLocaleString('en-IN')}`, strong: true },
        ].map((r, i) => (
          <motion.div
            key={r.l}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...spring, delay: 0.2 + i * 0.05 }}
            style={{ display: 'flex', justifyContent: 'space-between', padding: '11px 0', borderTop: i > 0 ? '1px solid var(--line)' : undefined }}
          >
            <span style={{ fontSize: 11.5, color: r.strong ? 'var(--t1)' : 'var(--t3)' }}>{r.l}</span>
            <span style={{ fontSize: r.strong ? 14 : 11.5, fontWeight: 600, color: r.strong ? 'var(--t1)' : 'var(--t2)', letterSpacing: '-0.13px' }}>{r.v}</span>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, padding: '10px 11px', borderRadius: 9, background: '#5FB49C14' }}>
        <Icon name="check" size={13} color="var(--pos)" style={{ marginTop: 1 }} />
        <span style={{ fontSize: 10.5, color: 'var(--t2)', lineHeight: 1.4 }}>
          Your holding is updated. {s.sixShares} shares of {item.name} now in your portfolio.
        </span>
      </div>

      <motion.button
        whileTap={{ scale: 0.985 }}
        onClick={() => {
          d({ type: 'closeSheet' })
          d({ type: 'tab', tab: 'portfolio' })
        }}
        style={{ width: '100%', padding: '13px 16px', borderRadius: 4, background: 'var(--raised)', border: '1px solid var(--line)', fontSize: 12.5, fontWeight: 600, color: 'var(--t1)' }}
      >
        View portfolio
      </motion.button>
    </Sheet>
  )
}

/** Confirmation after a limit order rests on the book. */
export function OpenOrderSheet({
  shares,
  price,
  itemId,
  side = 'buy',
}: {
  shares: number
  price: number
  itemId: string
  side?: 'buy' | 'sell'
}) {
  const { d } = useApp()
  const item = ITEMS[itemId] ?? ITEMS.six

  return (
    <Sheet title="Order placed" onClose={() => d({ type: 'closeSheet' })}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '6px 0 2px' }}>
        <motion.div
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 14 }}
          style={{ width: 52, height: 52, borderRadius: 999, background: 'var(--brass-tint)', display: 'grid', placeItems: 'center' }}
        >
          <Icon name="clock" size={24} color="var(--brass)" />
        </motion.div>
        <div style={{ fontFamily: 'var(--display)', fontSize: 22 }}>Open order</div>
        <div style={{ fontSize: 11.5, color: 'var(--t2)' }}>
          Limit {side} · {shares} shares of {item.name} at ₹{price}
        </div>
      </div>

      <ItemStrip item={item} />

      <div>
        {[
          { l: 'Order ID', v: 'ALT-ORD-88240' },
          { l: 'Placed', v: '14:06 · 12 Aug 2026' },
          { l: 'Filled', v: `0 of ${shares} shares` },
          { l: 'Expires', v: 'End of session · 17:00' },
          { l: 'Amount if filled', v: `₹${(shares * price).toLocaleString('en-IN')}`, strong: true },
        ].map((r, i) => (
          <div key={r.l} style={{ display: 'flex', justifyContent: 'space-between', padding: '11px 0', borderTop: i > 0 ? '1px solid var(--line)' : undefined }}>
            <span style={{ fontSize: 11.5, color: r.strong ? 'var(--t1)' : 'var(--t3)' }}>{r.l}</span>
            <span style={{ fontSize: r.strong ? 14 : 11.5, fontWeight: 600, color: r.strong ? 'var(--t1)' : 'var(--t2)', letterSpacing: '-0.13px' }}>{r.v}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, padding: '10px 11px', borderRadius: 9, background: 'var(--brass-tint)' }}>
        <Icon name="info" size={13} color="var(--brass)" style={{ marginTop: 1 }} />
        <span style={{ fontSize: 10.5, color: 'var(--t2)', lineHeight: 1.4 }}>
          Sits in the book until matched. Unfilled orders expire when the session closes.
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <motion.button
          whileTap={{ scale: 0.985 }}
          onClick={() => d({ type: 'closeSheet' })}
          style={{ width: '100%', padding: '14px 16px', borderRadius: 4, border: '1px solid #C07A5E66', fontSize: 13, fontWeight: 600, color: '#C07A5E' }}
        >
          Cancel order
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.985 }}
          onClick={() => {
            d({ type: 'closeSheet' })
            d({ type: 'tab', tab: 'portfolio' })
          }}
          style={{ width: '100%', padding: '13px 16px', borderRadius: 4, border: '1px solid var(--line)', fontSize: 12.5, fontWeight: 600, color: 'var(--t3)' }}
        >
          View open orders
        </motion.button>
      </div>
    </Sheet>
  )
}

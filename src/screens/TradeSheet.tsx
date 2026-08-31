import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ITEMS } from '../data'
import { Sheet } from '../components/Sheet'
import { AnimatedNumber, Icon, Thumb } from '../components/ui'
import { press, spring } from '../motion'
import { useApp } from '../state'

const BALANCE = 42600

export function TradeSheet({ side, itemId }: { side: 'buy' | 'sell'; itemId: string }) {
  const { s, d } = useApp()
  const item = ITEMS[itemId] ?? ITEMS.six
  const owned = itemId === 'six' ? s.sixShares : 1
  const [type, setType] = useState<'market' | 'limit'>('market')
  const [shares, setShares] = useState(side === 'buy' ? 12 : Math.min(12, owned))
  const [limit, setLimit] = useState(item.price - 5)
  const [submitting, setSubmitting] = useState(false)
  const isSell = side === 'sell'
  const pendingBuyout = itemId === 'six' && (s.buyout === 'notified' || s.buyout === 'pending')

  const unit = type === 'market' ? item.price : limit
  const total = unit * shares
  const max = isSell ? owned : Math.floor(BALANCE / item.price)
  const drift = (((limit - item.price) / item.price) * 100).toFixed(1)

  const submit = () => {
    setSubmitting(true)
    // a beat of "working" before the confirmation lands — the pause is what sells it
    setTimeout(() => {
      if (type === 'limit' && !isSell) d({ type: 'placeLimit', shares, price: limit, itemId })
      else d({ type: 'buy', shares: isSell ? -shares : shares, price: unit, itemId })
      setSubmitting(false)
    }, 780)
  }

  return (
    <Sheet title={isSell ? 'Sell' : 'Buy'} onClose={() => d({ type: 'closeSheet' })}>
      <ItemStrip item={item} />

      <div style={{ display: 'flex', gap: 2, padding: 3, borderRadius: 999, background: 'var(--raised)' }}>
        {(['market', 'limit'] as const).map((t) => (
          <motion.button key={t} whileTap={press} onClick={() => setType(t)} style={{ position: 'relative', flex: 1, padding: '7px 10px', borderRadius: 999 }}>
            {type === t && <motion.span layoutId="order-type" transition={spring} style={{ position: 'absolute', inset: 0, borderRadius: 999, background: 'var(--line-2)' }} />}
            <span style={{ position: 'relative', fontSize: 11.5, fontWeight: 600, color: type === t ? 'var(--t1)' : 'var(--t3)' }}>
              {t === 'market' ? 'Market' : 'Limit'}
            </span>
          </motion.button>
        ))}
      </div>

      <Stepper
        label="Shares"
        hint={isSell ? `You own ${owned} shares` : undefined}
        value={shares}
        display={String(shares)}
        onChange={(n) => setShares(Math.max(1, Math.min(max, n)))}
        onMax={() => setShares(max)}
        showMax={type === 'market'}
      />

      <AnimatePresence initial={false}>
        {type === 'limit' && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
            <Stepper
              label="Limit price"
              hint={`${drift}% from market`}
              value={limit}
              display={`₹${limit}`}
              onChange={(n) => setLimit(Math.max(1, n))}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {pendingBuyout && isSell ? (
          <Notice
            key="warn"
            tone="neg"
            title="This item has a pending buyout offer — selling now forfeits your vote."
            body="Your shares would transfer before the vote closes on 15 Aug 2026."
          />
        ) : type === 'market' ? (
          <Notice
            key="market"
            title="Market orders fill at the live price"
            body={`₹${item.price} is indicative — the book moves and your fill may land a few rupees either side. Use a limit order to cap the price you pay.`}
          />
        ) : (
          <Notice
            key="limit"
            title={`Order will be executed at ₹${limit} or a ${isSell ? 'higher' : 'lower'} price`}
            body="Your bid rests on the book until a seller meets it. It may fill partially, or not at all, if the price never comes down."
          />
        )}
      </AnimatePresence>

      <div style={{ height: 1, background: 'var(--line)' }} />

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 12, color: 'var(--t3)' }}>
          {isSell ? `${shares} shares × ₹${unit}` : `Balance: ₹${BALANCE.toLocaleString('en-IN')}`}
        </span>
        <span style={{ fontSize: 12, color: isSell ? 'var(--t1)' : 'var(--t3)', fontWeight: isSell ? 600 : 400, letterSpacing: '-0.16px' }}>
          {isSell ? '₹' : 'Required: ₹'}
          <AnimatedNumber value={total} />
        </span>
      </div>

      <motion.button
        whileTap={{ scale: 0.985 }}
        onClick={submit}
        disabled={submitting}
        style={{
          width: '100%',
          padding: '14px 16px',
          borderRadius: 4,
          background: isSell ? '#d95e45' : '#60b57e',
          color: '#fff',
          fontSize: 13,
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        {submitting ? (
          <>
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
              style={{ width: 13, height: 13, borderRadius: 999, border: '1.6px solid #ffffff59', borderTopColor: '#fff' }}
            />
            Placing order
          </>
        ) : isSell ? (
          'Review sell order'
        ) : type === 'limit' ? (
          'Place limit order'
        ) : (
          'Buy shares'
        )}
      </motion.button>
    </Sheet>
  )
}

export function ItemStrip({ item }: { item: (typeof ITEMS)[string] }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 10, background: 'var(--raised)' }}>
      <Thumb src={item.img} size={32} radius={7} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <span style={{ fontSize: 12, fontWeight: 600 }}>{item.name}</span>
        <span style={{ fontSize: 9.5, color: 'var(--t3)' }}>₹{item.price} / share · 47 on offer</span>
      </div>
    </div>
  )
}

function Stepper({
  label,
  hint,
  value,
  display,
  onChange,
  onMax,
  showMax,
}: {
  label: string
  hint?: string
  value: number
  display: string
  onChange: (n: number) => void
  onMax?: () => void
  showMax?: boolean
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, color: 'var(--t3)' }}>{label}</span>
        {hint && <span style={{ fontSize: 10, color: 'var(--t3)' }}>{hint}</span>}
      </div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <StepButton icon="minus" onClick={() => onChange(value - 1)} />
        <div
          style={{
            flex: 1,
            height: 38,
            borderRadius: 10,
            background: 'var(--raised)',
            border: '1px solid var(--line)',
            display: 'grid',
            placeItems: 'center',
            overflow: 'hidden',
          }}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={display}
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -14, opacity: 0 }}
              transition={{ duration: 0.16 }}
              style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.16px' }}
            >
              {display}
            </motion.span>
          </AnimatePresence>
        </div>
        <StepButton icon="plus" onClick={() => onChange(value + 1)} />
        {showMax && onMax && (
          <motion.button
            whileTap={press}
            onClick={onMax}
            style={{ padding: '10px 11px', borderRadius: 999, border: '1px solid var(--line)', fontSize: 10.5, fontWeight: 600, color: 'var(--t3)' }}
          >
            Max
          </motion.button>
        )}
      </div>
    </div>
  )
}

function StepButton({ icon, onClick }: { icon: 'minus' | 'plus'; onClick: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.88, backgroundColor: '#3a3128' }}
      onClick={onClick}
      aria-label={icon === 'minus' ? 'Decrease' : 'Increase'}
      style={{ width: 38, height: 38, borderRadius: 999, background: 'var(--raised)', border: '1px solid var(--line)', display: 'grid', placeItems: 'center', flexShrink: 0 }}
    >
      <Icon name={icon} size={15} color="var(--t1)" />
    </motion.button>
  )
}

function Notice({ title, body, tone = 'brass' }: { title: string; body: string; tone?: 'brass' | 'neg' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.18 }}
      style={{
        display: 'flex',
        gap: 11,
        padding: '12px 13px',
        borderRadius: 10,
        background: tone === 'neg' ? '#24100b' : '#1F1709',
        border: `1px solid ${tone === 'neg' ? '#C07A5E66' : '#b8935b3D'}`,
      }}
    >
      <Icon name={tone === 'neg' ? 'warning' : 'info'} size={15} color={tone === 'neg' ? 'var(--neg)' : 'var(--brass)'} style={{ marginTop: 1 }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        <span style={{ fontSize: 11.5, fontWeight: 600, color: tone === 'neg' ? 'var(--neg)' : 'var(--t1)' }}>{title}</span>
        <span style={{ fontSize: 10.5, color: 'var(--t3)', lineHeight: 1.45 }}>{body}</span>
      </div>
    </motion.div>
  )
}

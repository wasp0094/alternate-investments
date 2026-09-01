import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BUYOUT } from '../data'
import { Mark } from '../components/Mark'
import { AnimatedNumber, Icon, Thumb } from '../components/ui'
import { softSpring, spring } from '../motion'
import { useApp } from '../state'

/* ---------------- lock screen + push ---------------- */

export function LockScreen() {
  const { s, d } = useApp()
  const [shown, setShown] = useState(false)
  const resolved = s.buyout === 'resolved'

  useEffect(() => {
    const t = setTimeout(() => setShown(true), 620)
    return () => clearTimeout(t)
  }, [])

  const approved = s.vote !== 'reject'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ position: 'absolute', inset: 0, zIndex: 80, overflow: 'hidden', background: 'var(--ground-deep)' }}
    >
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/img/vault.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <div style={{ position: 'absolute', inset: 0, background: '#0b0908a8' }} />

      <div style={{ position: 'absolute', top: 96, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: '#f5f2ecC7' }}>Saturday, 12 August</div>
        <div style={{ fontSize: 76, fontWeight: 600, letterSpacing: '-2px', color: '#f5f2ec', lineHeight: 1.05 }}>9:41</div>
      </div>

      <AnimatePresence>
        {shown && (
          <motion.div
            initial={{ y: -140, opacity: 0, scale: 0.94 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.4}
            whileTap={{ scale: 0.985 }}
            onClick={() => {
              d({ type: 'lock', on: false })
              // tab first: it clears the detail and any sheet left over from the vote
              d({ type: 'tab', tab: 'portfolio' })
              if (resolved && approved) {
                d({ type: 'buyout', stage: 'paid' })
                d({ type: 'sheet', sheet: { kind: 'payout' } })
              } else if (resolved) {
                d({ type: 'buyout', stage: 'pending' })
              } else {
                d({ type: 'buyout', stage: 'pending' })
                d({ type: 'sheet', sheet: { kind: 'buyoutReview' } })
              }
            }}
            style={{
              position: 'absolute',
              top: 268,
              left: 16,
              width: 361,
              padding: '13px 15px',
              borderRadius: 18,
              background: '#1A1611E0',
              border: '1px solid #f5f2ec1F',
              backdropFilter: 'blur(20px)',
              display: 'flex',
              flexDirection: 'column',
              gap: 7,
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 18, height: 18, borderRadius: 5, background: 'var(--brass)', display: 'grid', placeItems: 'center' }}>
                <Mark size={14} color="#16130f" />
              </div>
              <span style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.6px', color: 'var(--t2)' }}>ALTERNATE</span>
              <span style={{ marginLeft: 'auto', fontSize: 10.5, color: 'var(--t3)' }}>now</span>
            </div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>
              {resolved ? (approved ? 'Buyout confirmed' : 'Buyout offer rejected') : 'A buyout offer has been made'}
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--t2)', lineHeight: 1.45 }}>
              {resolved
                ? approved
                  ? '78% of shareholders approved the ₹9.2 Cr offer. Trading is halted while payouts are processed.'
                  : 'The ₹9.2 Cr offer did not reach the 75% threshold. The item stays listed and trading continues.'
                : `₹9.2 Cr offer received for The 2011 Six. You hold ${s.sixShares} shares — review and vote.`}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ position: 'absolute', bottom: 46, left: 0, right: 0, textAlign: 'center', fontSize: 11, color: '#f5f2ec8c' }}>
        Tap the notification to open ALTERNATE
      </div>
    </motion.div>
  )
}

/* ---------------- offer review + vote ---------------- */

export function BuyoutReview() {
  const { s, d } = useApp()
  const [busy, setBusy] = useState<'approve' | 'reject' | null>(null)
  const voted = s.vote
  const approvedPct = voted === 'approve' ? BUYOUT.approved + 6 : BUYOUT.approved

  const cast = (v: 'approve' | 'reject') => {
    setBusy(v)
    setTimeout(() => {
      d({ type: 'vote', vote: v })
      d({ type: 'toast', toast: { id: Date.now(), text: `Your vote is recorded — ${v}`, action: 'Undo', tone: v === 'approve' ? 'pos' : 'neg' } })
      setBusy(null)
    }, 520)
  }

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={spring}
      className="scroll"
      style={{ position: 'absolute', inset: 0, zIndex: 75, background: 'var(--ground)' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: '54px 20px 130px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => d({ type: 'closeSheet' })}
            aria-label="Back"
            style={{ width: 34, height: 34, borderRadius: 999, background: 'var(--surface-3)', border: '1px solid var(--line)', display: 'grid', placeItems: 'center' }}
          >
            <Icon name="chevronLeft" size={16} color="var(--t1)" />
          </motion.button>
          <span style={{ fontSize: 13, fontWeight: 600 }}>Buyout offer</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <Thumb src="/img/six.png" size={46} radius={10} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontFamily: 'var(--display)', fontSize: 19, letterSpacing: '-0.2px' }}>The 2011 Six</span>
            <span style={{ fontSize: 9.5, fontWeight: 600, letterSpacing: '0.9px', color: 'var(--t3)' }}>LOT 014 · MEMORABILIA</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.8px', color: 'var(--t3)' }}>OFFER ON THE TABLE</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.9px' }}>₹</span>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...softSpring, delay: 0.08 }}
              style={{ fontSize: 32, fontWeight: 600, letterSpacing: '-0.9px' }}
            >
              9.2 Cr
            </motion.span>
          </div>
          <span style={{ fontSize: 11.5, color: 'var(--t2)' }}>{BUYOUT.perShare}</span>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 12, padding: '4px 15px' }}>
          {[
            { l: 'You hold', v: `${s.sixShares} shares` },
            { l: 'Invested', v: BUYOUT.invested },
            { l: "You'd receive", v: BUYOUT.receive, strong: true },
            { l: 'Your gain', v: BUYOUT.gain, strong: true, pos: true },
          ].map((r, i) => (
            <motion.div
              key={r.l}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...softSpring, delay: 0.1 + i * 0.05 }}
              style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderTop: i > 0 ? '1px solid var(--line)' : undefined }}
            >
              <span style={{ fontSize: 11.5, color: r.strong ? 'var(--t1)' : 'var(--t3)' }}>{r.l}</span>
              <span style={{ fontSize: r.strong ? 14 : 12, fontWeight: 600, letterSpacing: '-0.13px', color: r.pos ? 'var(--pos)' : 'var(--t1)' }}>{r.v}</span>
            </motion.div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 9, padding: '11px 12px', borderRadius: 9, background: '#b8935b14' }}>
          <Icon name="rule" size={14} color="var(--brass)" style={{ marginTop: 1 }} />
          <span style={{ fontSize: 10.5, color: 'var(--t2)', lineHeight: 1.45 }}>
            Passes with 75% shareholder approval. Applies to all holders, including those who vote no.
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, fontWeight: 600 }}>
              <AnimatedNumber value={approvedPct} />% approved
            </span>
            <span style={{ fontSize: 10.5, color: 'var(--t3)' }}>{BUYOUT.daysLeft}</span>
          </div>
          <div style={{ position: 'relative', height: 14, display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '100%', height: 8, borderRadius: 999, background: 'var(--raised-2)' }} />
            <motion.div
              animate={{ width: `${approvedPct}%` }}
              transition={{ ...softSpring, delay: 0.15 }}
              initial={{ width: 0 }}
              style={{ position: 'absolute', left: 0, height: 8, borderRadius: 999, background: 'var(--brass)' }}
            />
            <div style={{ position: 'absolute', left: `${BUYOUT.needed}%`, width: 2, height: 14, borderRadius: 999, background: 'var(--t1)' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 9.5, color: 'var(--t3)' }}>{BUYOUT.votes}</span>
            <span style={{ fontSize: 9.5, color: 'var(--t3)' }}>75% needed</span>
          </div>
        </div>
      </div>

      {/* vote actions */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          background: 'var(--ground-deep)',
          borderTop: '1px solid var(--line)',
          padding: '14px 20px 30px',
          display: 'flex',
          gap: 11,
        }}
      >
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => cast('reject')}
          style={{
            padding: '14px 26px',
            borderRadius: 999,
            border: `1px solid ${voted === 'reject' ? '#C07A5E' : '#C07A5E66'}`,
            fontSize: 13,
            fontWeight: 600,
            color: voted ? (voted === 'reject' ? 'var(--neg)' : 'var(--t3)') : '#C07A5E',
            display: 'flex',
            alignItems: 'center',
            gap: 7,
          }}
        >
          {voted === 'reject' && <Icon name="check" size={14} color="var(--neg)" />}
          {busy === 'reject' ? 'Recording…' : voted === 'reject' ? 'Voted · Reject' : 'Reject'}
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => cast('approve')}
          style={{
            flex: 1,
            padding: '14px 26px',
            borderRadius: 999,
            border: voted === 'approve' ? '1px solid #5FB49C66' : '1px solid transparent',
            background: voted ? 'transparent' : '#60b57e',
            fontSize: 13,
            fontWeight: 600,
            color: voted === 'approve' ? 'var(--pos)' : voted ? 'var(--t3)' : '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 7,
          }}
        >
          {voted === 'approve' && <Icon name="check" size={14} color="var(--pos)" />}
          {busy === 'approve' ? 'Recording…' : voted === 'approve' ? 'Voted · Approve' : 'Approve'}
        </motion.button>
      </div>
    </motion.div>
  )
}

/* ---------------- payout ---------------- */

export function PayoutScreen() {
  const { d } = useApp()
  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={spring}
      className="scroll"
      style={{ position: 'absolute', inset: 0, zIndex: 75, background: 'var(--ground)' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: '54px 20px 130px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => d({ type: 'closeSheet' })}
            aria-label="Back"
            style={{ width: 34, height: 34, borderRadius: 999, background: 'var(--surface-3)', border: '1px solid var(--line)', display: 'grid', placeItems: 'center' }}
          >
            <Icon name="chevronLeft" size={16} color="var(--t1)" />
          </motion.button>
          <span style={{ fontSize: 13, fontWeight: 600 }}>Buyout payout</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '10px 0 2px' }}>
          <motion.div
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 240, damping: 13 }}
            style={{ position: 'relative', width: 56, height: 56, borderRadius: 999, background: 'var(--pos-tint)', display: 'grid', placeItems: 'center' }}
          >
            <motion.span
              animate={{ scale: [1, 2], opacity: [0.45, 0] }}
              transition={{ duration: 1.8, repeat: 3, ease: 'easeOut' }}
              style={{ position: 'absolute', inset: 0, borderRadius: 999, border: '1px solid var(--pos)' }}
            />
            <Icon name="check" size={26} color="var(--pos)" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} style={{ fontFamily: 'var(--display)', fontSize: 24, letterSpacing: '-0.3px' }}>
            Payout complete
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.5 }}>
            ₹73,600 credited for The 2011 Six — up ₹31,600 (+75%) from your ₹42,000 invested.
          </motion.div>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 12, padding: '4px 15px' }}>
          {[
            { l: 'Shares sold', v: '12 shares' },
            { l: 'Buyout price', v: '₹6,133 / share' },
            { l: 'Gross proceeds', v: '₹73,600' },
            { l: 'Invested', v: '₹42,000' },
            { l: 'Net gain', v: '+₹31,600 · +75%', strong: true, pos: true },
            { l: 'Credited to', v: 'Wallet · 12 Aug 2026', muted: true },
          ].map((r, i) => (
            <motion.div
              key={r.l}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...softSpring, delay: 0.2 + i * 0.05 }}
              style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderTop: i > 0 ? '1px solid var(--line)' : undefined }}
            >
              <span style={{ fontSize: 11.5, color: r.strong ? 'var(--t1)' : 'var(--t3)' }}>{r.l}</span>
              <span
                style={{
                  fontSize: r.strong ? 14 : 12,
                  fontWeight: 600,
                  letterSpacing: '-0.13px',
                  color: r.pos ? 'var(--pos)' : r.muted ? 'var(--t2)' : 'var(--t1)',
                }}
              >
                {r.v}
              </span>
            </motion.div>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '13px 14px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 12 }}>
          <div style={{ width: 30, height: 30, borderRadius: 999, background: 'var(--raised)', display: 'grid', placeItems: 'center' }}>
            <Icon name="scale" size={14} color="var(--brass)" />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 12, fontWeight: 600 }}>See vote results</span>
            <span style={{ fontSize: 9.5, color: 'var(--t3)' }}>78% approved · 22% rejected</span>
          </div>
          <Icon name="chevronRight" size={14} color="var(--t3)" />
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          background: 'var(--ground-deep)',
          borderTop: '1px solid var(--line)',
          padding: '14px 20px 30px',
          display: 'flex',
          gap: 11,
        }}
      >
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => {
            d({ type: 'closeSheet' })
            d({ type: 'buyout', stage: 'exited' })
            d({ type: 'tab', tab: 'portfolio' })
          }}
          style={{ padding: '14px 26px', borderRadius: 999, border: '1px solid var(--line)', fontSize: 13, fontWeight: 600, color: 'var(--t3)' }}
        >
          View portfolio
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            d({ type: 'closeSheet' })
            d({ type: 'buyout', stage: 'exited' })
            d({ type: 'open', itemId: 'six' })
          }}
          style={{ flex: 1, padding: '14px 26px', borderRadius: 999, background: 'var(--pos)', fontSize: 13, fontWeight: 600, color: '#16130f' }}
        >
          Done
        </motion.button>
      </div>
    </motion.div>
  )
}

/* ---------------- toast ---------------- */

export function Toast() {
  const { s, d } = useApp()
  const toast = s.toast

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => d({ type: 'toast', toast: null }), 4200)
    return () => clearTimeout(t)
  }, [toast, d])

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ y: 70, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 70, opacity: 0 }}
          transition={spring}
          style={{
            position: 'absolute',
            left: 16,
            bottom: 96,
            width: 361,
            zIndex: 95,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '13px 14px',
            borderRadius: 12,
            background: '#241E17F5',
            border: '1px solid #f5f2ec24',
            backdropFilter: 'blur(16px)',
          }}
        >
          <Icon name="check" size={15} color={toast.tone === 'neg' ? 'var(--neg)' : 'var(--pos)'} />
          <span style={{ flex: 1, fontSize: 12, fontWeight: 600 }}>{toast.text}</span>
          {toast.action && (
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => {
                d({ type: 'vote', vote: null })
                d({ type: 'toast', toast: null })
              }}
              style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--t3)' }}
            >
              {toast.action}
            </motion.button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

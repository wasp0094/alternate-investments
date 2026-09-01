import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Mark } from './Mark'
import { softSpring } from '../motion'

/**
 * The prototype renders a 393 × 852 device at true size next to its flow panel, so it needs
 * roughly 900px of width. Below that we say so rather than shipping a squashed layout.
 */
export const NARROW = '(max-width: 899px)'

export function useIsNarrow() {
  const [narrow, setNarrow] = useState(() => (typeof window === 'undefined' ? false : window.matchMedia(NARROW).matches))
  useEffect(() => {
    const mq = window.matchMedia(NARROW)
    const onChange = (e: MediaQueryListEvent) => setNarrow(e.matches)
    mq.addEventListener('change', onChange)
    setNarrow(mq.matches)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return narrow
}

export function MobileNotice() {
  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 26px',
        background: 'radial-gradient(120% 80% at 50% 0%, #17140f 0%, #0a0908 62%)',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...softSpring, delay: 0.08 }}
        style={{ width: '100%', maxWidth: 340, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 22 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Mark size={24} />
          <span style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: '0.5px', color: 'var(--t1)' }}>ALTERNATE</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h1 style={{ margin: 0, fontFamily: 'var(--display)', fontSize: 27, lineHeight: 1.18, fontWeight: 400, letterSpacing: '-0.3px', color: 'var(--t1)' }}>
            The prototype isn’t available on mobile
          </h1>
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: 'var(--t3)' }}>
            Please open this link on a desktop browser. It renders the phone at full size beside a panel
            for stepping through the flows, and needs a wider window than this one.
          </p>
        </div>

        {/* a small nod to what is waiting on the other side */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...softSpring, delay: 0.24 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '11px 14px',
            borderRadius: 12,
            background: 'var(--surface)',
            border: '1px solid var(--line)',
          }}
        >
          <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end' }}>
            <span style={{ width: 13, height: 22, borderRadius: 3, border: '1px solid var(--line-2)', background: 'var(--surface-2)' }} />
            <span style={{ width: 34, height: 26, borderRadius: 3, border: '1px solid var(--brass-line)', background: 'var(--brass-tint)' }} />
          </div>
          <span style={{ fontSize: 11, color: 'var(--t3)', textAlign: 'left', lineHeight: 1.45 }}>
            Best viewed at 900px wide or more
          </span>
        </motion.div>
      </motion.div>
    </div>
  )
}

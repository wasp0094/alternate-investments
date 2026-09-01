import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mark } from '../components/Mark'
import { softSpring } from '../motion'

const HOLD = 1900

/** 00 Splash from the canvas: the mark, the wordmark, and the line under it. */
export function Splash({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, HOLD)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
      onClick={onDone}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 85,
        background: 'var(--ground)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 22,
        padding: '0 40px',
        cursor: 'pointer',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.86 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ ...softSpring, delay: 0.1 }}
      >
        <Mark size={104} />
      </motion.div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 9 }}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...softSpring, delay: 0.26 }}
          style={{ fontFamily: 'var(--display)', fontSize: 34, fontWeight: 500, letterSpacing: '1.2px', color: 'var(--t1)' }}
        >
          Alternate
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...softSpring, delay: 0.38 }}
          style={{ fontSize: 12.5, letterSpacing: '0.3px', color: 'var(--t3)' }}
        >
          Own a piece of what’s iconic
        </motion.div>
      </div>
    </motion.div>
  )
}

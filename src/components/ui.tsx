import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion'
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { Icon, type IconName, CHART_PATHS } from './icons'
import { press, pressCard, quick, softSpring, spring } from '../motion'

/* ---------------- device chrome ---------------- */

export function StatusBar({ color = '#ede6d6' }: { color?: string }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: '0 0 auto 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 22px 10px 24px',
        zIndex: 90,
        pointerEvents: 'none',
      }}
    >
      <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.2px', color }}>9:41</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2 }}>
          {[4, 6, 8, 10.5].map((h) => (
            <div key={h} style={{ width: 3, height: h, borderRadius: 1, background: color }} />
          ))}
        </div>
        <Icon name="wifi" size={16} color={color} />
        <div style={{ position: 'relative', width: 27.2, height: 13 }}>
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0.5,
              width: 24.5,
              height: 12,
              border: `1px solid ${color}`,
              borderRadius: 3.8,
              opacity: 0.38,
            }}
          />
          <div
            style={{ position: 'absolute', left: 2.2, top: 2.5, width: 16, height: 8, borderRadius: 2.2, background: color }}
          />
          <div style={{ position: 'absolute', left: 25.2, top: 4.2, width: 1.5, height: 3.8, opacity: 0.38 }}>
            <Icon name="batteryCap" size={4} color={color} style={{ width: 1.5, height: 3.8 }} />
          </div>
        </div>
      </div>
    </div>
  )
}

export function StatusScrim() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: '0 0 auto 0',
        height: 50,
        background: 'linear-gradient(180deg, #16130f 0%, #16130f00 100%)',
        zIndex: 15,
        pointerEvents: 'none',
      }}
    />
  )
}

export function HomeIndicator({ light = false }: { light?: boolean }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: '100%',
        height: 22,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 95,
        pointerEvents: 'none',
      }}
    >
      <div style={{ width: 139, height: 5, borderRadius: 999, background: light ? '#ede6d6' : '#ede6d659' }} />
    </div>
  )
}

/* ---------------- primitives ---------------- */

export function Thumb({
  src,
  size,
  radius = 8,
  style,
}: {
  src: string
  size: number
  radius?: number
  style?: CSSProperties
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        border: '1px solid var(--line)',
        backgroundImage: `url(${src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        flexShrink: 0,
        ...style,
      }}
    />
  )
}

export function SectionHead({
  title,
  meta,
  sub,
  metaColor,
  onMeta,
  chevron,
}: {
  title: string
  meta?: string
  sub?: string
  metaColor?: string
  onMeta?: () => void
  chevron?: boolean
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: sub ? 'flex-start' : 'center',
        justifyContent: 'space-between',
        flexDirection: sub ? 'column' : 'row',
        gap: sub ? 3 : 0,
        width: '100%',
      }}
    >
      <div style={{ fontSize: 14, letterSpacing: '-0.2px', color: 'var(--t1)' }}>{title}</div>
      {sub && <div style={{ fontSize: 10.5, color: 'var(--t3)' }}>{sub}</div>}
      {meta && (
        <motion.button
          whileTap={onMeta ? press : undefined}
          onClick={onMeta}
          style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10.5, color: metaColor ?? 'var(--t3)' }}
        >
          {meta}
          {chevron && <Icon name="chevronRight" size={12} color="var(--t3)" />}
        </motion.button>
      )}
    </div>
  )
}

export function Card({
  children,
  onClick,
  style,
  delay = 0,
}: {
  children: ReactNode
  onClick?: () => void
  style?: CSSProperties
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...softSpring, delay }}
      whileTap={onClick ? pressCard : undefined}
      onClick={onClick}
      style={{
        background: 'var(--surface-2)',
        border: '1px solid var(--line)',
        borderRadius: 12,
        cursor: onClick ? 'pointer' : undefined,
        ...style,
      }}
    >
      {children}
    </motion.div>
  )
}

export function Row({
  children,
  onClick,
  divider,
  padding = '11px 0',
  delay = 0,
}: {
  children: ReactNode
  onClick?: () => void
  divider?: boolean
  padding?: string
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...softSpring, delay }}
      whileTap={onClick ? { backgroundColor: 'rgba(237,230,214,0.03)' } : undefined}
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 11,
        padding,
        width: '100%',
        borderTop: divider ? '1px solid var(--line)' : undefined,
        cursor: onClick ? 'pointer' : undefined,
      }}
    >
      {children}
    </motion.div>
  )
}

export function Pill({
  label,
  active,
  onClick,
  layoutId,
}: {
  label: string
  active?: boolean
  onClick?: () => void
  layoutId?: string
}) {
  return (
    <motion.button
      whileTap={press}
      onClick={onClick}
      style={{
        position: 'relative',
        padding: '7px 12px',
        borderRadius: 999,
        border: active ? '1px solid transparent' : '1px solid var(--line)',
        background: active ? 'transparent' : 'var(--surface-3)',
        flexShrink: 0,
      }}
    >
      {active && (
        <motion.span
          layoutId={layoutId}
          transition={spring}
          style={{ position: 'absolute', inset: 0, borderRadius: 999, background: 'var(--t1)' }}
        />
      )}
      <span
        style={{
          position: 'relative',
          fontSize: 11,
          fontWeight: 600,
          color: active ? 'var(--ground)' : 'var(--t3)',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </span>
    </motion.button>
  )
}

export function Progress({ pct, color = 'var(--brass)', height = 5, delay = 0 }: { pct: number; color?: string; height?: number; delay?: number }) {
  return (
    <div style={{ width: '100%', height, borderRadius: 999, background: 'var(--raised-2)', overflow: 'hidden' }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ ...softSpring, delay: delay + 0.1 }}
        style={{ height: '100%', borderRadius: 999, background: color }}
      />
    </div>
  )
}

/** Digits that roll up to their value — used on every headline number. */
export function AnimatedNumber({
  value,
  format = (n) => Math.round(n).toLocaleString('en-IN'),
  duration = 0.9,
  style,
}: {
  value: number
  format?: (n: number) => string
  duration?: number
  style?: CSSProperties
}) {
  const mv = useMotionValue(0)
  const smooth = useSpring(mv, { stiffness: 90, damping: 20, mass: 0.6 })
  const text = useTransform(smooth, (n) => format(n))
  useEffect(() => {
    const t = setTimeout(() => mv.set(value), 60)
    return () => clearTimeout(t)
  }, [value, mv, duration])
  return <motion.span style={style}>{text}</motion.span>
}

export function Change({ text, up, size = 11 }: { text: string; up: boolean; size?: number }) {
  return <span style={{ fontSize: size, fontWeight: 600, color: up ? 'var(--pos)' : 'var(--neg)' }}>{text}</span>
}

/** The designer's own sparkline geometry, drawn on with a stroke reveal. */
export function Spark({
  name,
  width = 134,
  height = 22,
  delay = 0,
}: {
  name: 'sparkUp1' | 'sparkUp2' | 'sparkDown'
  width?: number
  height?: number
  delay?: number
}) {
  const def = CHART_PATHS[name]
  const color = name === 'sparkDown' ? 'var(--neg)' : 'var(--pos)'
  return (
    <svg width="100%" height={height} viewBox={def.vb} preserveAspectRatio="none" style={{ display: 'block', overflow: 'visible' }}>
      <motion.path
        d={def.d[0]}
        fill="none"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay }}
      />
    </svg>
  )
}

/* ---------------- overlays ---------------- */

export function Backdrop({ onClick, opacity = 0.72 }: { onClick?: () => void; opacity?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={quick}
      onClick={onClick}
      style={{ position: 'absolute', inset: 0, background: `rgba(11,9,8,${opacity})`, zIndex: 60 }}
    />
  )
}

export function Grabber() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '9px 0 3px' }}>
      <div style={{ width: 36, height: 4, borderRadius: 999, background: '#f5f2ec2e' }} />
    </div>
  )
}

export function useTicker(from: number, to: number, ms = 1400) {
  const [v, setV] = useState(from)
  const ref = useRef(0)
  useEffect(() => {
    const start = performance.now()
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / ms)
      const eased = 1 - Math.pow(1 - p, 3)
      setV(from + (to - from) * eased)
      if (p < 1) ref.current = requestAnimationFrame(step)
    }
    ref.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(ref.current)
  }, [from, to, ms])
  return v
}

export { AnimatePresence, motion, Icon }
export type { IconName }

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { CHART_PATHS } from './icons'

const W = 353
const H = 128
const HIGH = 660
const LOW = 470

/** Drag across the chart to scrub — tracker, dot and tooltip follow the designer's own price path. */
export function PriceChart({ range }: { range: string }) {
  const pathRef = useRef<SVGPathElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  const [pt, setPt] = useState<{ x: number; y: number } | null>(null)
  const [drawn, setDrawn] = useState(false)

  useEffect(() => {
    setDrawn(false)
    setPt(null)
    const t = setTimeout(() => setDrawn(true), 30)
    return () => clearTimeout(t)
  }, [range])

  const pointAtX = (clientX: number) => {
    const box = boxRef.current
    const path = pathRef.current
    if (!box || !path) return
    const r = box.getBoundingClientRect()
    const ratio = Math.min(1, Math.max(0, (clientX - r.left) / r.width))
    const total = path.getTotalLength()
    // walk the path to the length whose x matches the pointer
    let lo = 0
    let hi = total
    const targetX = ratio * W
    for (let i = 0; i < 18; i++) {
      const mid = (lo + hi) / 2
      const p = path.getPointAtLength(mid)
      if (p.x < targetX) lo = mid
      else hi = mid
    }
    const p = path.getPointAtLength((lo + hi) / 2)
    setPt({ x: p.x, y: p.y })
  }

  const price = pt ? Math.round(HIGH - (pt.y / H) * (HIGH - LOW)) : null
  const pct = price ? (((price - 500) / 500) * 100).toFixed(1) : null

  return (
    <div
      ref={boxRef}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId)
        pointAtX(e.clientX)
      }}
      onPointerMove={(e) => e.currentTarget.hasPointerCapture(e.pointerId) && pointAtX(e.clientX)}
      onPointerUp={() => setPt(null)}
      onPointerCancel={() => setPt(null)}
      style={{ position: 'relative', width: '100%', height: H, touchAction: 'none', cursor: 'crosshair' }}
    >
      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display: 'block', overflow: 'visible' }}>
        <defs>
          <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5fb49c" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#5fb49c" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          d={`${CHART_PATHS.priceLine.d[0]} L ${W} ${H} L 0 ${H} Z`}
          fill="url(#priceFill)"
          initial={{ opacity: 0 }}
          animate={{ opacity: drawn ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        />
        <motion.path
          ref={pathRef}
          d={CHART_PATHS.priceLine.d[0]}
          fill="none"
          stroke="#60b57e"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: drawn ? 1 : 0 }}
          transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
        />
        {pt && (
          <>
            <line x1={pt.x} y1={0} x2={pt.x} y2={H} stroke="#5FB49C66" strokeWidth={1} vectorEffect="non-scaling-stroke" />
            <circle cx={pt.x} cy={pt.y} r={5} fill="#F5F2EC" stroke="#5FB49C" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
          </>
        )}
      </svg>

      {pt && price && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            position: 'absolute',
            left: `calc(${(pt.x / W) * 100}% - 46px)`,
            top: Math.max(0, pt.y - 42),
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 7px 6px 12px',
            background: '#1F1A14',
            border: '1px solid var(--line-2)',
            borderRadius: 999,
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '-0.12px' }}>₹{price}</span>
          <span style={{ padding: '3px 8px', borderRadius: 999, background: 'var(--pos)', fontSize: 10.5, fontWeight: 600, color: '#16130f' }}>
            {Number(pct) >= 0 ? '+' : ''}
            {pct}%
          </span>
        </motion.div>
      )}
    </div>
  )
}

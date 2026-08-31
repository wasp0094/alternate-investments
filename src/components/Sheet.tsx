import { motion, type PanInfo } from 'framer-motion'
import type { ReactNode } from 'react'
import { sheetSpring } from '../motion'
import { Icon } from './icons'

/** Bottom sheet: springs up, follows your finger, and snaps back unless you throw it. */
export function Sheet({
  children,
  onClose,
  title,
  padding = '10px 20px 30px',
}: {
  children: ReactNode
  onClose: () => void
  title?: string
  padding?: string
}) {
  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > 110 || info.velocity.y > 620) onClose()
  }

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={sheetSpring}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0, bottom: 0.6 }}
      onDragEnd={onDragEnd}
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 70,
        background: 'var(--surface)',
        borderRadius: '22px 22px 0 0',
        borderTop: '1px solid var(--line)',
        padding,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        maxHeight: 812,
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'center', padding: '0 0 6px', cursor: 'grab' }}>
        <div style={{ width: 38, height: 4, borderRadius: 999, background: '#ede6d63d' }} />
      </div>
      {title && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: 'var(--display)', fontSize: 20, letterSpacing: '-0.2px' }}>{title}</div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            style={{ width: 28, height: 28, borderRadius: 999, background: 'var(--raised)', display: 'grid', placeItems: 'center' }}
          >
            <Icon name="close" size={14} color="var(--t3)" />
          </motion.button>
        </div>
      )}
      {children}
    </motion.div>
  )
}

export function SheetLabel({ children }: { children: ReactNode }) {
  return (
    <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.8px', color: 'var(--t3)' }}>{children}</div>
  )
}

export function ChoiceChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      animate={{
        backgroundColor: active ? '#b8935b' : '#241e17',
        color: active ? '#16130f' : '#8c8474',
      }}
      transition={{ duration: 0.16 }}
      style={{
        padding: '6px 10px',
        borderRadius: 999,
        border: active ? '1px solid transparent' : '1px solid var(--line)',
        fontSize: 10.5,
        fontWeight: 600,
        whiteSpace: 'nowrap',
        flexShrink: 0,
      }}
    >
      {label}
    </motion.button>
  )
}

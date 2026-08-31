import { motion } from 'framer-motion'
import { Icon } from './icons'
import { spring } from '../motion'
import { useApp, type Tab } from '../state'

const TABS: { id: Tab; label: string; icon: 'tabHome' | 'tabExplore' | 'tabPortfolio' | 'tabAccount' }[] = [
  { id: 'home', label: 'Home', icon: 'tabHome' },
  { id: 'explore', label: 'Explore', icon: 'tabExplore' },
  { id: 'portfolio', label: 'Portfolio', icon: 'tabPortfolio' },
  { id: 'account', label: 'Account', icon: 'tabAccount' },
]

export function TabBar() {
  const { s, d } = useApp()
  const pendingCount = s.buyout === 'notified' || s.buyout === 'pending' ? 1 : 0

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: '100%',
        height: 67,
        background: 'var(--ground-deep)',
        borderTop: '1px solid var(--line)',
        display: 'flex',
        padding: '11px 0 8px',
        zIndex: 45,
      }}
    >
      {TABS.map((t) => {
        const active = s.tab === t.id && !s.detail
        return (
          <motion.button
            key={t.id}
            whileTap={{ scale: 0.9 }}
            onClick={() => d({ type: 'tab', tab: t.id })}
            style={{
              width: 98,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 5,
              position: 'relative',
            }}
          >
            <div style={{ position: 'relative' }}>
              <motion.div animate={{ scale: active ? 1 : 0.94, y: active ? -1 : 0 }} transition={spring}>
                <Icon name={t.icon} size={21} color={active ? '#f5f2ec' : '#8c8579'} />
              </motion.div>
              {t.id === 'portfolio' && pendingCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={spring}
                  style={{
                    position: 'absolute',
                    top: -2,
                    right: -4,
                    width: 7,
                    height: 7,
                    borderRadius: 999,
                    background: 'var(--brass)',
                    border: '1.5px solid var(--ground-deep)',
                  }}
                />
              )}
            </div>
            <span style={{ fontSize: 10, fontWeight: active ? 600 : 500, color: active ? '#f5f2ec' : '#8c8579' }}>
              {t.label}
            </span>
          </motion.button>
        )
      })}
    </div>
  )
}

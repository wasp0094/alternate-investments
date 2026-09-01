import { motion } from 'framer-motion'
import type { Item } from '../data'
import { Icon } from '../components/ui'
import { softSpring } from '../motion'

/**
 * Once a buyout completes the item stops being a tradable page: the canvas replaces the whole
 * detail screen with this stripped-back version — hero, a status banner, the last price, and
 * placeholder lines where the live content used to be.
 */
export function ItemClosed({ item, exited, onBack }: { item: Item; exited: boolean; onBack: () => void }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--ground)', overflow: 'hidden' }}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ position: 'relative', width: '100%', height: 300 }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${item.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 180, background: 'linear-gradient(180deg, #16130f00 0%, #16130f 100%)' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '10px 20px 20px' }}>
          {exited ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={softSpring}
              style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '13px 14px', borderRadius: 10, background: 'var(--surface)', border: '1px solid var(--line)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ padding: '4px 9px', borderRadius: 999, background: 'var(--raised)', fontSize: 9, fontWeight: 600, letterSpacing: '0.8px', color: 'var(--t3)' }}>
                  EXITED
                </span>
                <span style={{ fontSize: 10, color: 'var(--t3)' }}>12 Aug 2026</span>
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--t2)', lineHeight: 1.45 }}>
                This item was bought out on 12 Aug 2026 for ₹9.2 Cr. It’s no longer tradable.
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={softSpring}
              style={{ display: 'flex', gap: 10, padding: '12px 13px', borderRadius: 10, background: 'var(--brass-tint)', border: '1px solid #b8935b52' }}
            >
              <Icon name="halt" size={15} color="var(--brass)" style={{ marginTop: 1 }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--brass)' }}>Trading halted — buyout in progress</div>
                <div style={{ fontSize: 10.5, color: 'var(--t2)', lineHeight: 1.45 }}>
                  ₹9.2 Cr offer approved on 12 Aug 2026 · payouts are being processed
                </div>
              </div>
            </motion.div>
          )}

          <div style={{ fontSize: 9.5, fontWeight: 600, letterSpacing: '0.9px', color: 'var(--t3)' }}>{item.lot ?? 'LOT 014 · MEMORABILIA'}</div>
          <div style={{ fontFamily: 'var(--display)', fontSize: 26, letterSpacing: '-0.3px', color: 'var(--t1)' }}>{item.name}</div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.8px', color: exited ? 'var(--t3)' : 'var(--t1)' }}>
              ₹{item.price.toLocaleString('en-IN')}
            </span>
            <span style={{ fontSize: 12, color: 'var(--t3)' }}>/ share</span>
          </div>

          <div style={{ fontSize: 12.5, fontWeight: 600, color: exited ? 'var(--t3)' : 'var(--pos)' }}>
            {exited ? 'Final price ₹6,133 / share' : '▲ +₹11 · +1.8% last session'}
          </div>

          {/* the live content is gone — these stand in for it */}
          {[353, 320, 290].map((w, i) => (
            <motion.div
              key={w}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ ...softSpring, delay: 0.1 + i * 0.06 }}
              style={{ width: w, maxWidth: '100%', height: 9, borderRadius: 999, background: 'var(--raised)' }}
            />
          ))}
        </div>
      </div>

      {/* the canvas has no way back off this screen; the prototype needs one */}
      <motion.button
        whileTap={{ scale: 0.88 }}
        onClick={onBack}
        aria-label="Back"
        style={{
          position: 'absolute',
          top: 52,
          left: 20,
          width: 36,
          height: 36,
          borderRadius: 999,
          background: '#0e0d0b8c',
          border: '1px solid #f5f2ec2e',
          backdropFilter: 'blur(12px)',
          display: 'grid',
          placeItems: 'center',
          fontSize: 14,
          color: 'var(--t1)',
          zIndex: 30,
        }}
      >
        ‹
      </motion.button>

      {!exited && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            background: 'var(--ground-deep)',
            padding: '14px 20px 20px',
            display: 'flex',
            zIndex: 40,
          }}
        >
          <button
            disabled
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '14px 26px',
              borderRadius: 999,
              background: 'var(--raised)',
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--t3)',
              cursor: 'not-allowed',
            }}
          >
            <Icon name="lock" size={14} color="var(--t3)" />
            Trading halted
          </button>
        </div>
      )}
    </div>
  )
}

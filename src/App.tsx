import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { Dashboard } from './screens/Dashboard'
import { Explore } from './screens/Explore'
import { Portfolio } from './screens/Portfolio'
import { Account } from './screens/Account'
import { ItemDetail } from './screens/ItemDetail'
import { RefineSheet } from './screens/RefineSheet'
import { TradeSheet } from './screens/TradeSheet'
import { FilledSheet, OpenOrderSheet } from './screens/OrderResult'
import { BuyoutReview, LockScreen, PayoutScreen, Toast } from './screens/Buyout'
import { TabBar } from './components/TabBar'
import { HomeIndicator, StatusBar, StatusScrim } from './components/ui'
import { pushScreen, spring, tabSwap } from './motion'
import { useApp } from './state'
import { Stage } from './Stage'

export function App() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 52,
        padding: 40,
        background: 'radial-gradient(120% 90% at 50% 0%, #17140f 0%, #0a0908 60%)',
      }}
    >
      <Phone />
      <Stage />
    </div>
  )
}

function Phone() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ ...spring, delay: 0.1 }}
      style={{
        position: 'relative',
        width: 393,
        height: 852,
        borderRadius: 54,
        background: 'var(--ground)',
        boxShadow:
          '0 0 0 11px #131110, 0 0 0 12px #2b2620, 0 40px 90px -20px rgba(0,0,0,0.9), 0 0 140px -50px rgba(184,147,91,0.35)',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      <Screen />
    </motion.div>
  )
}

function Screen() {
  const { s, d } = useApp()
  const tabScroll = useRef<HTMLDivElement>(null)
  const sheet = s.sheet

  useEffect(() => {
    tabScroll.current?.scrollTo({ top: 0 })
  }, [s.tab])

  const fullScreenSheet = sheet.kind === 'buyoutReview' || sheet.kind === 'payout'
  const bottomSheet = sheet.kind !== 'none' && !fullScreenSheet

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--ground)', overflow: 'hidden' }}>
      {/*
        Not mode="wait": Portfolio holds a looping pulse animation, and an exiting subtree with an
        infinite animation never reports completion — which left the old tab on screen forever and
        made tab switches (and Reset) look like they did nothing. Cross-fading both layers is also
        the nicer transition; the outgoing one is inert via pointerEvents in the variants.
      */}
      <AnimatePresence initial={false}>
        <motion.div
          key={s.tab}
          variants={tabSwap}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="scroll"
          ref={tabScroll}
          style={{ position: 'absolute', inset: 0 }}
        >
          {s.tab === 'home' && <Dashboard />}
          {s.tab === 'explore' && <Explore />}
          {s.tab === 'portfolio' && <Portfolio />}
          {s.tab === 'account' && <Account />}
        </motion.div>
      </AnimatePresence>

      {!s.detail && <StatusScrim />}
      {!s.detail && <TabBar />}

      <AnimatePresence>
        {s.detail && (
          <motion.div
            key={s.detail}
            variants={pushScreen}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={spring}
            style={{ position: 'absolute', inset: 0, background: 'var(--ground)', zIndex: 25 }}
          >
            <ItemDetail itemId={s.detail} />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        animate={{ opacity: bottomSheet ? 1 : 0 }}
        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
        onClick={() => bottomSheet && d({ type: 'closeSheet' })}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(11,9,8,0.72)',
          zIndex: 60,
          pointerEvents: bottomSheet ? 'auto' : 'none',
        }}
      />

      <AnimatePresence>
        {sheet.kind === 'refine' && <RefineSheet key="refine" />}
        {sheet.kind === 'trade' && <TradeSheet key="trade" side={sheet.side} itemId={sheet.itemId} />}
        {sheet.kind === 'filled' && <FilledSheet key="filled" shares={sheet.shares} price={sheet.price} itemId={sheet.itemId} />}
        {sheet.kind === 'openOrder' && <OpenOrderSheet key="open" shares={sheet.shares} price={sheet.price} itemId={sheet.itemId} />}
      </AnimatePresence>

      <AnimatePresence>
        {sheet.kind === 'buyoutReview' && <BuyoutReview key="review" />}
        {sheet.kind === 'payout' && <PayoutScreen key="payout" />}
      </AnimatePresence>

      <Toast />

      <AnimatePresence>{s.lockScreen && <LockScreen key="lock" />}</AnimatePresence>

      <StatusBar />
      <HomeIndicator />
    </div>
  )
}

import { createContext, useContext, useMemo, useReducer, type ReactNode } from 'react'

export type Tab = 'home' | 'explore' | 'portfolio' | 'account'

/** Where the buyout story currently sits. Drives half a dozen screens. */
export type BuyoutStage =
  | 'none'
  | 'notified'
  | 'pending'
  | 'voted'
  | 'resolved'
  | 'halted'
  | 'paid'
  | 'exited'

export type Vote = 'approve' | 'reject' | null

export type Sheet =
  | { kind: 'none' }
  | { kind: 'trade'; side: 'buy' | 'sell'; itemId: string }
  | { kind: 'filled'; shares: number; price: number; itemId: string }
  | { kind: 'openOrder'; shares: number; price: number; itemId: string; side: 'buy' | 'sell' }
  | { kind: 'refine' }
  | { kind: 'buyoutReview' }
  | { kind: 'payout' }

export type Toast = { id: number; text: string; action?: string; tone?: 'pos' | 'neg' | 'brass' } | null

type State = {
  tab: Tab
  /** Item detail pushed on top of the tab. */
  detail: string | null
  sheet: Sheet
  lockScreen: boolean
  buyout: BuyoutStage
  vote: Vote
  sixShares: number
  toast: Toast
  orderCount: number
  splash: boolean
}

const initial: State = {
  tab: 'home',
  detail: null,
  sheet: { kind: 'none' },
  lockScreen: false,
  buyout: 'none',
  vote: null,
  sixShares: 12,
  toast: null,
  orderCount: 0,
  splash: true,
}

type Action =
  | { type: 'tab'; tab: Tab }
  | { type: 'open'; itemId: string }
  | { type: 'back' }
  | { type: 'sheet'; sheet: Sheet }
  | { type: 'closeSheet' }
  | { type: 'buy'; shares: number; price: number; itemId: string }
  | { type: 'placeLimit'; shares: number; price: number; itemId: string; side: 'buy' | 'sell' }
  | { type: 'lock'; on: boolean }
  | { type: 'buyout'; stage: BuyoutStage }
  | { type: 'vote'; vote: Vote }
  | { type: 'toast'; toast: Toast }
  | { type: 'splashDone' }
  | { type: 'reset' }

function reducer(s: State, a: Action): State {
  switch (a.type) {
    // any navigation also puts the lock screen away — it used to stay up over the app
    case 'tab':
      return { ...s, tab: a.tab, detail: null, sheet: { kind: 'none' }, lockScreen: false }
    case 'open':
      // clear the sheet too: a stale full-screen sheet would otherwise sit over the item page
      return { ...s, detail: a.itemId, sheet: { kind: 'none' }, lockScreen: false }
    case 'back':
      return { ...s, detail: null }
    case 'sheet':
      return { ...s, sheet: a.sheet, lockScreen: false }
    case 'closeSheet':
      return { ...s, sheet: { kind: 'none' } }
    case 'buy':
      return {
        ...s,
        sixShares: a.itemId === 'six' ? s.sixShares + a.shares : s.sixShares,
        sheet: { kind: 'filled', shares: a.shares, price: a.price, itemId: a.itemId },
      }
    case 'placeLimit':
      return {
        ...s,
        orderCount: s.orderCount + 1,
        sheet: { kind: 'openOrder', shares: a.shares, price: a.price, itemId: a.itemId, side: a.side },
      }
    case 'lock':
      return { ...s, lockScreen: a.on }
    case 'buyout':
      return { ...s, buyout: a.stage }
    case 'vote':
      return { ...s, vote: a.vote, buyout: a.vote ? 'voted' : 'pending' }
    case 'toast':
      return { ...s, toast: a.toast }
    case 'splashDone':
      return { ...s, splash: false }
    case 'reset':
      return initial
    default:
      return s
  }
}

const Ctx = createContext<{ s: State; d: React.Dispatch<Action> } | null>(null)

/** Deep links: ?tab=portfolio&detail=six&sheet=buy&buyout=pending — handy for sharing an exact state. */
function fromUrl(): State {
  if (typeof window === 'undefined') return initial
  const q = new URLSearchParams(window.location.search)
  const st = { ...initial, splash: [...q.keys()].length === 0 }
  const tab = q.get('tab') as Tab | null
  if (tab && ['home', 'explore', 'portfolio', 'account'].includes(tab)) st.tab = tab
  const detail = q.get('detail')
  if (detail) st.detail = detail
  const buyout = q.get('buyout') as BuyoutStage | null
  if (buyout) st.buyout = buyout
  const sheet = q.get('sheet')
  const itemId = detail ?? 'six'
  if (sheet === 'buy') st.sheet = { kind: 'trade', side: 'buy', itemId }
  else if (sheet === 'sell') st.sheet = { kind: 'trade', side: 'sell', itemId }
  else if (sheet === 'refine') st.sheet = { kind: 'refine' }
  else if (sheet === 'filled') st.sheet = { kind: 'filled', shares: 12, price: 612, itemId }
  else if (sheet === 'order') st.sheet = { kind: 'openOrder', shares: 12, price: 607, itemId, side: 'buy' }
  else if (sheet === 'buyoutReview') st.sheet = { kind: 'buyoutReview' }
  else if (sheet === 'payout') st.sheet = { kind: 'payout' }
  if (q.get('lock') === '1') st.lockScreen = true
  return st
}

export function StateProvider({ children }: { children: ReactNode }) {
  const [s, d] = useReducer(reducer, undefined as unknown as State, fromUrl)
  const value = useMemo(() => ({ s, d }), [s])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useApp() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useApp outside provider')
  return c
}

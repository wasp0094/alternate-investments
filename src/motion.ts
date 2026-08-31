import type { Transition, Variants } from 'framer-motion'

/** iOS-ish springs. Everything in the prototype leans on these three. */
export const spring: Transition = { type: 'spring', stiffness: 420, damping: 38, mass: 0.9 }
export const softSpring: Transition = { type: 'spring', stiffness: 260, damping: 30 }
export const sheetSpring: Transition = { type: 'spring', stiffness: 340, damping: 34, mass: 0.85 }
export const quick: Transition = { duration: 0.18, ease: [0.22, 1, 0.36, 1] }

/** Push / pop between full screens, the way a nav stack behaves. */
export const pushScreen: Variants = {
  initial: { x: '100%', opacity: 1 },
  animate: { x: 0, opacity: 1 },
  exit: { x: '35%', opacity: 0.6, filter: 'brightness(0.6)' },
}

/** Tab switches cross-fade with a touch of lift rather than sliding. */
export const tabSwap: Variants = {
  initial: { opacity: 0, y: 8, scale: 0.99 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -6, scale: 0.995 },
}

export const sheetIn: Variants = {
  initial: { y: '100%' },
  animate: { y: 0 },
  exit: { y: '100%' },
}

export const fade: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

/** Lists reveal one row at a time — 34ms apart reads as "settling", not "animating". */
export const stagger = (i: number, base = 0) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { ...softSpring, delay: base + i * 0.034 },
})

/** Press feedback used on every tappable surface. */
export const press = { scale: 0.975 }
export const pressCard = { scale: 0.985 }

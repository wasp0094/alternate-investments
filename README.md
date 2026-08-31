# ALTERNATE — live prototype

An interactive React prototype built from the 28 final screens in the `prototype` frame of the
pen.dev canvas (`pencil-welcome-desktop.pen`). Copy, figures, colours, type, spacing, icon paths,
chart geometry and photography are taken from the design export — not re-invented.

```bash
npm install
npm run dev      # http://localhost:5173
```

The phone renders at its true size (393 × 852). The panel on the right drives the flows that a
prototype can't reach by tapping alone.

## What's wired

| Flow | Path |
| --- | --- |
| Browse | Dashboard → item detail → back, tab switching, category chips |
| Discover | Explore → live search, quick filters, refine sheet (chips + drag slider) |
| Trade | Item detail → Buy/Sell ticket → market or limit → filled receipt / resting order |
| Hold | Portfolio → re-sortable holdings, allocation toggle, pending actions |
| Exit | Buyout: push notification → review & vote → result → trading halted → payout → item exited |

Buying actually moves the numbers: shares land in the portfolio, the holding card on the item
detail updates, and the totals recalculate.

## Microanimations

- Nav stack push/pop; tabs cross-fade with a small lift
- Hero parallax and scale-on-overscroll; the pinned header fades in as you scroll
- Price chart draws itself, then scrubs under your finger with tracker, dot and tooltip
- Sparklines and portfolio line stroke on
- Sheets spring up, follow a drag, and dismiss when thrown
- Numbers roll to their value; the share count flips digit-by-digit in the stepper
- Order-book depth bars, subscription progress and the vote bar fill on entry
- Staggered list reveals (~34 ms apart), press-scale on every tappable
- Success pulses on fills and payouts; the attention banner breathes while a vote is open
- `prefers-reduced-motion` collapses all of it

## Deep links

State is readable from the URL, so any screen is shareable:

```
?tab=portfolio            home | explore | portfolio | account
?detail=six               item detail (six, ponting, mohur, raza, stumps, blazer …)
?sheet=buy                buy | sell | refine | filled | order | buyoutReview | payout
?buyout=pending           none | notified | pending | voted | resolved | halted | paid | exited
?lock=1                   lock screen with the push notification
?scroll=2050              open an item detail partway down
```

## Structure

```
src/
  App.tsx              device frame, layers, sheet + overlay routing
  Stage.tsx            the flow panel beside the phone
  state.tsx            one reducer: tab, pushed detail, sheet, buyout stage, holdings
  data.ts              every string and figure, lifted from the canvas
  motion.ts            the three springs everything shares
  components/
    icons.tsx          icon + chart paths generated from the design export
    Mark.tsx           the twin-loop wordmark, 17 strokes, verbatim
    ui.tsx             status bar, home indicator, rows, pills, progress, animated numbers
    Sheet.tsx          draggable bottom sheet
    PriceChart.tsx     scrubbable price chart
    TabBar.tsx
  screens/             Dashboard, Explore, ItemDetail, Portfolio, Account,
                       TradeSheet, OrderResult, RefineSheet, Buyout
public/img/            the 12 photographs from the canvas
```

## Where the prototype goes beyond the canvas

These weren't in the design and were built to keep the prototype coherent — worth a look before
they're treated as decided:

- **Account tab.** The canvas has no Account screen; this one is assembled from existing patterns
  (wallet, KYC, statements). Placeholder content.
- **Pinned item-detail header.** The static screens don't say what happens to the nav bar on
  scroll. It fades into a solid bar so it stays legible over the cream editorial section.
- **Search results.** The Explore search field is live; the results list is a new layout.
- **Sort and filter behaviour.** Holdings sorting, refine chips and the slider all recompute
  (object counts, minimum investment) rather than being static states.
- **Limit-sell.** The canvas shows a market sell only; the limit path reuses the buy ticket's
  copy pattern.

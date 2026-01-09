# Visual Guide

Visual representations of the Kitchen Display System architecture and workflows.

## Order Status Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     ORDER LIFECYCLE                         │
└─────────────────────────────────────────────────────────────┘

    Customer Pays
         │
         ▼
    ┌─────────┐
    │  PAID   │  ← Order waiting to be prepared
    │  (Blue) │     Late if > 5 minutes
    └────┬────┘
         │ Click or
         │ Backend Event
         ▼
   ┌──────────────┐
   │ IN_PROGRESS  │  ← Order being prepared
   │   (Amber)    │     Late if > 10 minutes
   └──────┬───────┘
          │ Click or
          │ Backend Event
          ▼
      ┌────────┐
      │ READY  │  ← Order complete, awaiting pickup
      │ (Green)│     Non-interactive
      └────────┘

   OR at any point:
      ┌───────────┐
      │ CANCELED  │  ← Order canceled by POS
      │  (Gray)   │     Removed from active view
      └───────────┘
```

## System Architecture

```
┌───────────────────────────────────────────────────────────────┐
│                         FRONTEND                              │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────┐         ┌──────────────────┐           │
│  │  Demo Panel     │         │  WebSocket       │           │
│  │  (Dev Mode)     │         │  (Production)    │           │
│  └────────┬────────┘         └────────┬─────────┘           │
│           │                           │                      │
│           └──────────┬────────────────┘                      │
│                      ▼                                       │
│           ┌─────────────────────┐                           │
│           │  Event Dispatcher   │  ← Central event hub      │
│           │  (orderEventBus)    │                           │
│           └──────────┬──────────┘                           │
│                      │                                       │
│                      ▼                                       │
│              ┌──────────────┐                               │
│              │ Zustand Store│  ← State management           │
│              │ (orderStore) │                               │
│              └──────┬───────┘                               │
│                     │                                        │
│                     ▼                                        │
│         ┌───────────────────────┐                           │
│         │  React Components     │                           │
│         ├───────────────────────┤                           │
│         │ KitchenDisplay        │  ← Main screen            │
│         │   └── OrderCard (n)   │  ← Individual orders      │
│         └───────────────────────┘                           │
│                                                               │
└───────────────────────────────────────────────────────────────┘
                      ▲
                      │
                      │ Future Integration
                      │
           ┌──────────┴──────────┐
           │   POS Backend       │
           │   (Socket.IO /      │
           │    WebSocket)       │
           └─────────────────────┘
```

## Data Flow

```
EVENT SOURCES                  DISPATCHER              STORE                UI
┌──────────────┐             ┌──────────┐          ┌────────┐        ┌──────────┐
│              │             │          │          │        │        │          │
│ Demo Button  ├────────────►│  Event   ├─────────►│ Update ├───────►│ Re-render│
│              │  Dispatch   │  Bus     │  Handle  │ State  │ React │ OrderCard│
└──────────────┘             │          │          │        │        │          │
                             └──────────┘          └────────┘        └──────────┘
┌──────────────┐                  ▲
│              │                  │
│  WebSocket   ├──────────────────┘
│  Message     │   Dispatch
│              │
└──────────────┘

┌──────────────┐
│              │
│ User Click   ├──────────────────┐
│ on Card      │   Direct call    │
│              │                  ▼
└──────────────┘          ┌────────────────┐
                          │ Store Action   │
                          │ (updateStatus) │
                          └───────┬────────┘
                                  │
                                  ▼
                          ┌────────────────┐
                          │ Dispatch Event │
                          │ (for logging)  │
                          └────────────────┘
```

## Screen Layout

```
┌──────────────────────────────────────────────────────────────────┐
│                     Kitchen Display System                       │
│  [Header]                            Waiting: 3  Prep: 2  Ready: 1│
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │  Order #42  │  │  Order #43  │  │  Order #44  │             │
│  │   (Alex)    │  │  (Jordan)   │  │   (Sam)     │             │
│  │             │  │             │  │             │             │
│  │   PAID      │  │ IN_PROGRESS │  │   READY     │             │
│  │   [Blue]    │  │  [Amber]    │  │  [Green]    │             │
│  │   3:45      │  │   8:23      │  │  12:11      │             │
│  │             │  │             │  │             │             │
│  │ • Latte     │  │ • Cappuccino│  │ • Espresso  │             │
│  │   Extra shot│  │ • Croissant │  │ • Muffin    │             │
│  │ • Bagel     │  │   Toasted   │  │             │             │
│  │             │  │             │  │             │             │
│  │ Click to    │  │ Click to    │  │             │             │
│  │ advance     │  │ advance     │  │             │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│                                                                  │
│  [Empty space for more orders...]                               │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                   [DEMO PANEL - DEV MODE ONLY]                   │
│  ┌─────────────┬───────────────┬─────────────┬────────────────┐ │
│  │ Create      │ Late Orders   │ Select      │ Actions        │ │
│  │ [Random]    │ Delay: [6]min │ [#42 ▼]     │ [Advance]      │ │
│  │ [+3] [+5]   │ [Create Late] │ 3 active    │ [Cancel]       │ │
│  └─────────────┴───────────────┴─────────────┴────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

## Order Card States

```
┌──────────────────────────────────────────────────────────────────┐
│                       ORDER CARD VARIANTS                        │
└──────────────────────────────────────────────────────────────────┘

PAID (Waiting)          IN_PROGRESS            READY
┌─────────────┐         ┌─────────────┐       ┌─────────────┐
│ ╔═════════╗ │         │ ╔═════════╗ │       │ ╔═════════╗ │
│ ║  #42    ║ │         │ ║  #43    ║ │       │ ║  #44    ║ │
│ ║  Alex   ║ │         │ ║  Sam    ║ │       │ ║  Jordan ║ │
│ ╚═════════╝ │         │ ╚═════════╝ │       │ ╚═════════╝ │
│             │         │             │       │             │
│  [PAID]     │         │[IN_PROGRESS]│       │  [READY]    │
│  Blue Badge │         │ Amber Badge │       │ Green Badge │
│   2:15      │         │    7:42     │       │   11:03     │
│             │         │             │       │             │
│ Items...    │         │ Items...    │       │ Items...    │
│             │         │             │       │             │
│ Clickable   │         │ Clickable   │       │ Not         │
│ Hover scales│         │ Hover scales│       │ clickable   │
└─────────────┘         └─────────────┘       └─────────────┘


LATE ORDER (Overdue)    CANCELED
┌─────────────┐         ┌─────────────┐
│ ╔═════════╗ │         │ ┌─────────┐ │
│ ║  #45    ║ │         │ │  #46    │ │
│ ║  Riley  ║ │         │ │  Casey  │ │
│ ╚═════════╝ │         │ └─────────┘ │
│             │         │             │
│  [LATE!!!]  │         │ [CANCELED]  │
│  Red Badge  │         │ Gray Badge  │
│   12:47     │         │   --:--     │
│  Pulsing!   │         │             │
│             │         │ Items...    │
│ Items...    │         │             │
│             │         │ Not in      │
│ Clickable   │         │ active view │
└─────────────┘         └─────────────┘
```

## Event Flow Diagram

```
USER ACTION                    SYSTEM RESPONSE
─────────────                  ──────────────────

Demo: "Create Order"
        │
        ├──► Generate random order data
        │
        ├──► Add to store
        │         └──► orders[id] = order
        │
        ├──► Dispatch ORDER_CREATED event
        │         └──► Console log
        │
        └──► UI re-renders
                  └──► New OrderCard appears


User clicks OrderCard (PAID)
        │
        ├──► Call updateOrderStatus(id, 'IN_PROGRESS')
        │         │
        │         ├──► Update store
        │         │     └──► order.status = 'IN_PROGRESS'
        │         │     └──► order.startedAt = now
        │         │
        │         └──► Dispatch ORDER_STATUS_CHANGED
        │               └──► Console log
        │
        └──► UI re-renders
                  └──► Card changes to amber


Timer tick (every 1 second)
        │
        ├──► getElapsedSeconds(order.createdAt)
        │
        ├──► isOrderLate(...)
        │         │
        │         └──► Returns true/false
        │
        └──► UI re-renders
                  └──► Timer updates
                  └──► Late badge if threshold exceeded
```

## File Dependency Graph

```
main.tsx
  │
  └──► App.tsx
        ├──► KitchenDisplay.tsx
        │     ├──► useOrderStore() ───┐
        │     └──► OrderCard.tsx      │
        │           ├──► useOrderStore() ─┤
        │           ├──► time.ts      │   │
        │           └──► types/order.ts   │
        │                               │ │
        └──► DemoPanel.tsx              │ │
              ├──► useOrderStore() ─────┤ │
              ├──► dispatcher.ts        │ │
              ├──► orderGenerator.ts    │ │
              │     ├──► nanoid.ts      │ │
              │     └──► types/order.ts │ │
              └──► types/order.ts       │ │
                                        │ │
orderStore.ts ◄─────────────────────────┼─┘
  ├──► types/order.ts                   │
  └──► dispatcher.ts ◄───────────────────┘
        └──► types/events.ts
```

## Color Coding System

```
┌────────────────────────────────────────────────────────────┐
│                    STATUS COLOR GUIDE                      │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ████ PAID          #3B82F6  Blue    Order waiting        │
│                                                            │
│  ████ IN_PROGRESS   #F59E0B  Amber   Being prepared       │
│                                                            │
│  ████ READY         #10B981  Green   Pickup ready         │
│                                                            │
│  ████ CANCELED      #6B7280  Gray    Order canceled       │
│                                                            │
│  ████ LATE          #EF4444  Red     Overdue alert        │
│                                                            │
│  ████ Background    #0F172A  Dark    Main BG              │
│                                                            │
│  ████ Card BG       #1E293B  Slate   Card background      │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

## Time Thresholds

```
Order Timeline:
─────────────────────────────────────────────────────────────

PAID State:
┌───────┬─────────────────────────┬──────────────────►
│  0s   │        300s (5 min)     │  Late Alert
└───────┴─────────────────────────┴──────────────────►
  Normal         →              LATE (Red, Pulsing)


IN_PROGRESS State:
┌───────┬─────────────────────────────┬──────────────►
│  0s   │        600s (10 min)        │  Late Alert
└───────┴─────────────────────────────┴──────────────►
  Normal              →              LATE (Red, Pulsing)


READY State:
┌──────────────────────────────────────────────────────►
│  No late detection (waiting for customer pickup)
└──────────────────────────────────────────────────────►
```

## Development vs Production

```
┌──────────────────────────────────────────────────────────┐
│                    DEVELOPMENT MODE                      │
│                    (npm run dev)                         │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  • Demo panel visible                                    │
│  • Hot module replacement                                │
│  • Console logging enabled                               │
│  • Source maps included                                  │
│  • Unminified code                                       │
│  • Fast refresh on save                                  │
│                                                          │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│                   PRODUCTION MODE                        │
│                   (npm run build)                        │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  • Demo panel hidden (tree-shaken)                       │
│  • Optimized bundle                                      │
│  • Minified code                                         │
│  • No source maps                                        │
│  • Compressed assets                                     │
│  • Ready for deployment                                  │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

## Grid Responsive Behavior

```
Mobile (< 768px)               Tablet (768px - 1024px)
┌─────────────────┐           ┌──────────┬──────────┐
│                 │           │          │          │
│   Order #42     │           │ Order 42 │ Order 43 │
│                 │           │          │          │
├─────────────────┤           ├──────────┼──────────┤
│                 │           │          │          │
│   Order #43     │           │ Order 44 │ Order 45 │
│                 │           │          │          │
├─────────────────┤           └──────────┴──────────┘
│   Order #44     │
└─────────────────┘           Desktop (1024px - 1280px)
                              ┌──────┬──────┬──────┐
 1 column                     │ #42  │ #43  │ #44  │
                              ├──────┼──────┼──────┤
                              │ #45  │ #46  │ #47  │
                              └──────┴──────┴──────┘

                              3 columns

                              Large (> 1280px)
                              ┌────┬────┬────┬────┐
                              │#42 │#43 │#44 │#45 │
                              ├────┼────┼────┼────┤
                              │#46 │#47 │#48 │#49 │
                              └────┴────┴────┴────┘

                              4 columns
```

---

**Last Updated:** 2026-01-09

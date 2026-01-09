# Quick Start Guide

Get the Kitchen Display System running in 3 steps.

## 1. Install Dependencies

```bash
cd kitchen-display-system
npm install
```

## 2. Start Development Server

```bash
npm run dev
```

The app will open at `http://localhost:3000`

## 3. Try Demo Mode

You'll see a **yellow demo panel** at the bottom of the screen.

### Test the KDS:

1. Click **"Create Random Order"** to generate a test order
2. Watch it appear in the main grid as a blue PAID order
3. Click **the order card** to advance it to IN_PROGRESS (amber)
4. Click **the card again** to mark it READY (green)

### Test Late Orders:

1. Click **"Create Late Order"** to simulate an overdue order
2. Watch it appear with red highlighting and pulsing animation

### Test Bulk Orders:

1. Click **"+5 Orders"** to create multiple orders at once
2. Watch the grid fill up with test orders

## Order Status Flow

```
PAID → IN_PROGRESS → READY
  ↓         ↓
CANCELED (via demo panel)
```

## Late Detection

- **PAID orders** > 5 minutes = LATE
- **IN_PROGRESS orders** > 10 minutes = LATE

## Next Steps

- Read [README.md](README.md) for full documentation
- Check [src/types/order.ts](src/types/order.ts) for data structures
- Review [src/events/dispatcher.ts](src/events/dispatcher.ts) for event system
- See backend integration guide in README

## Troubleshooting

**Problem:** Dependencies won't install
- Ensure you have Node.js 18+ installed
- Try `npm cache clean --force` then `npm install`

**Problem:** Port 3000 already in use
- Edit [vite.config.ts](vite.config.ts) and change the port number

**Problem:** Demo panel not showing
- Demo panel only appears in development mode
- Run `npm run dev` (not `npm run build`)

**Problem:** TypeScript errors
- Run `npm install` to ensure all type definitions are installed
- Check that TypeScript version is 5.2+

## Production Build

```bash
npm run build
npm run preview
```

The demo panel will **not appear** in production builds.

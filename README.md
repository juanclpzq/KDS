# Kitchen Display System (KDS)

A real-time Kitchen Display System designed for coffee shops and bakeries. This frontend-only application displays kitchen orders with clear visual states, automatic late detection, and operational efficiency in mind.

## Features

- **Real-time order tracking** across multiple states (PAID, IN_PROGRESS, READY, CANCELED)
- **Automatic late detection** with visual alerts for overdue orders
- **Responsive grid layout** optimized for large kitchen displays
- **Demo mode** for testing and development without backend integration
- **Event-driven architecture** ready for WebSocket integration
- **Color-coded status indicators** for instant visual feedback
- **Touch-friendly interface** with large typography and clickable cards

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Zustand** - Lightweight state management
- **Day.js** - Time manipulation and formatting

## Project Structure

```
kitchen-display-system/
├── src/
│   ├── components/        # UI components
│   │   └── OrderCard.tsx  # Individual order card component
│   ├── demo/              # Demo mode simulation
│   │   ├── DemoPanel.tsx  # Control panel for simulation
│   │   └── orderGenerator.ts  # Random order generation
│   ├── events/            # Event system
│   │   └── dispatcher.ts  # Central event dispatcher
│   ├── screens/           # Main screens
│   │   └── KitchenDisplay.tsx  # Main KDS view
│   ├── store/             # State management
│   │   └── orderStore.ts  # Zustand store for orders
│   ├── types/             # TypeScript definitions
│   │   ├── events.ts      # Event type definitions
│   │   └── order.ts       # Order type definitions
│   ├── utils/             # Utility functions
│   │   ├── nanoid.ts      # ID generation
│   │   └── time.ts        # Time formatting and calculations
│   ├── App.tsx            # Main app component
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## Getting Started

### Installation

```bash
cd kitchen-display-system
npm install
```

### Development

```bash
npm run dev
```

The app will open at `http://localhost:3000` with the demo panel enabled.

### Production Build

```bash
npm run build
npm run preview
```

## Order States

The KDS supports four explicit order states:

1. **PAID** - Order has been paid and is waiting to be prepared (Blue)
2. **IN_PROGRESS** - Order is currently being prepared (Amber)
3. **READY** - Order is complete and ready for pickup (Green)
4. **CANCELED** - Order has been canceled (Gray)

Additionally, a derived **LATE** state is computed automatically:
- Orders in PAID status for > 5 minutes are marked LATE
- Orders in IN_PROGRESS status for > 10 minutes are marked LATE
- Late orders display with red highlighting and pulsing animation

## Demo Mode

### Overview

Demo mode is **automatically enabled in development** and provides a simulation panel for testing the KDS without a real POS system.

The demo panel appears at the bottom of the screen and includes:

### Demo Panel Features

1. **Create Random Order**
   - Generates a realistic order with 1-4 items
   - Random menu items from coffee and bakery categories
   - Random modifiers (oat milk, extra shot, etc.)
   - Optional customer names and notes
   - Status starts as PAID

2. **Bulk Order Creation**
   - "+3 Orders" button creates 3 orders with staggered timing
   - "+5 Orders" button creates 5 orders with staggered timing
   - Useful for testing grid layout and performance

3. **Create Late Order**
   - Simulates orders that are already overdue
   - Configurable delay (default: 6 minutes)
   - Triggers immediate LATE visual state

4. **Order Selection**
   - Dropdown showing all active orders
   - Displays order ID, status, and customer name
   - Shows count of active orders

5. **Advance Status**
   - Moves selected order to next state
   - PAID → IN_PROGRESS → READY
   - Simulates kitchen workflow progression

6. **Cancel Order**
   - Marks selected order as CANCELED
   - Removes from active kitchen view
   - Retained in order history

### Demo Mode Architecture

The demo mode uses the **same event system** that real WebSocket events will use:

```typescript
// Demo creates events
orderEventDispatcher.dispatch({
  type: 'ORDER_CREATED',
  order: generatedOrder,
  timestamp: Date.now()
});

// Store listens to events
// UI reacts to store changes
```

This ensures demo behavior matches real behavior exactly.

## User Interactions

### Order Cards

- **Click any PAID order** → Moves to IN_PROGRESS
- **Click any IN_PROGRESS order** → Moves to READY
- **READY orders** are non-interactive (pickup complete)

### Visual Feedback

- **Late orders** pulse with red highlighting
- **Cards scale up** on hover for clickable orders
- **Elapsed time** updates every second
- **Status badges** color-coded for instant recognition

## Integrating Real Backend

### WebSocket Integration

To connect the KDS to a real POS backend, implement a WebSocket listener that dispatches events:

```typescript
// Example: Socket.IO integration
import { io } from 'socket.io-client';
import { orderEventDispatcher } from './events/dispatcher';
import { useOrderStore } from './store/orderStore';

const socket = io('https://your-backend.com');

socket.on('order:created', (order) => {
  // Add to store
  useOrderStore.getState().addOrder(order);

  // Dispatch event
  orderEventDispatcher.dispatch({
    type: 'ORDER_CREATED',
    order,
    timestamp: Date.now()
  });
});

socket.on('order:status_changed', ({ orderId, newStatus }) => {
  useOrderStore.getState().updateOrderStatus(orderId, newStatus);
});

socket.on('order:canceled', ({ orderId }) => {
  useOrderStore.getState().cancelOrder(orderId);
});
```

### Backend Event Format

Your backend should emit events matching these TypeScript types:

```typescript
// Order Created
{
  type: 'ORDER_CREATED',
  order: {
    id: string,
    displayId: number,
    status: 'PAID',
    items: [...],
    createdAt: number,
    customerName?: string,
    notes?: string
  },
  timestamp: number
}

// Status Changed
{
  type: 'ORDER_STATUS_CHANGED',
  orderId: string,
  previousStatus: OrderStatus,
  newStatus: OrderStatus,
  timestamp: number
}

// Order Canceled
{
  type: 'ORDER_CANCELED',
  orderId: string,
  timestamp: number
}
```

### Order Item Format

```typescript
{
  id: string,
  name: string,
  quantity: number,
  modifiers: [
    { id: string, text: string }
  ],
  notes?: string
}
```

## Configuration

### Late Order Thresholds

Edit thresholds in [src/utils/time.ts](src/utils/time.ts):

```typescript
// Current defaults
PAID late threshold: 300 seconds (5 minutes)
IN_PROGRESS late threshold: 600 seconds (10 minutes)
```

### Color Scheme

Customize colors in [tailwind.config.js](tailwind.config.js):

```javascript
colors: {
  'kds-paid': '#3B82F6',      // Blue
  'kds-progress': '#F59E0B',  // Amber
  'kds-ready': '#10B981',     // Green
  'kds-canceled': '#6B7280',  // Gray
  'kds-late': '#EF4444',      // Red
  'kds-bg': '#0F172A',        // Background
  'kds-card': '#1E293B',      // Card background
}
```

### Grid Layout

Adjust responsive breakpoints in [src/screens/KitchenDisplay.tsx](src/screens/KitchenDisplay.tsx):

```jsx
// Current grid
grid-cols-1           // Mobile: 1 column
md:grid-cols-2        // Tablet: 2 columns
lg:grid-cols-3        // Desktop: 3 columns
xl:grid-cols-4        // Large: 4 columns
```

## Development Notes

### Event-Driven Architecture

All order updates flow through the event dispatcher:
1. Action occurs (demo button, WebSocket message)
2. Event dispatched to `orderEventDispatcher`
3. Store handlers update Zustand state
4. React components re-render

This ensures:
- Single source of truth
- Easy debugging (console logs all events)
- Testability
- Backend integration flexibility

### State Management

Zustand provides minimal, performant state management:
- No boilerplate
- Direct store access
- Automatic React integration
- TypeScript-first

### Performance

- Orders update at 1-second intervals for elapsed time
- Efficient re-renders with React memoization
- CSS Grid for optimal layout performance
- Tailwind for minimal CSS overhead

## Future Enhancements

Potential additions for production use:

- [ ] Sound alerts for new orders and late warnings
- [ ] Order filtering and search
- [ ] Multi-station support (bar, kitchen, bakery)
- [ ] Order history view
- [ ] Analytics dashboard
- [ ] Print receipt functionality
- [ ] Customizable alert thresholds per item type
- [ ] Dark/light theme toggle
- [ ] Fullscreen mode
- [ ] Keyboard shortcuts for faster navigation

## License

Proprietary - Internal use only

## Support

For questions or issues, contact the development team.

---

**Version:** 1.0.0
**Last Updated:** 2026-01-09

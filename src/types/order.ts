/**
 * Order Status
 * Represents the lifecycle of an order in the kitchen
 */
export type OrderStatus = 'PAID' | 'IN_PROGRESS' | 'READY' | 'CANCELED';

/**
 * Order Item Modifier
 * Represents customizations to an item (e.g., "no sugar", "extra shot")
 */
export interface ItemModifier {
  id: string;
  text: string;
}

/**
 * Order Item
 * Individual item in an order
 */
export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  modifiers: ItemModifier[];
  notes?: string;
}

/**
 * Order
 * Complete order representation
 */
export interface Order {
  id: string;
  displayId: number;          // Human-readable ID (e.g., 42)
  status: OrderStatus;
  items: OrderItem[];
  createdAt: number;          // Timestamp when order was paid
  startedAt?: number;         // Timestamp when prep started
  completedAt?: number;       // Timestamp when marked ready
  canceledAt?: number;        // Timestamp when canceled
  customerName?: string;      // Optional customer name
  notes?: string;             // Order-level notes
}

/**
 * Derived order state
 * Computed at runtime
 */
export interface OrderDisplayState {
  order: Order;
  isLate: boolean;
  elapsedTime: number;        // Seconds since creation
  preparationTime?: number;   // Seconds in preparation
}

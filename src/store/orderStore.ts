import { create } from 'zustand';
import { Order, OrderStatus } from '../types/order';
import { orderEventDispatcher } from '../events/dispatcher';

/**
 * Order Store State
 */
interface OrderStoreState {
  orders: Record<string, Order>;
  nextDisplayId: number;

  // Actions
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  cancelOrder: (orderId: string) => void;
  getOrder: (orderId: string) => Order | undefined;
  getActiveOrders: () => Order[];
  getCanceledOrders: () => Order[];
  getAllOrders: () => Order[];

  // Utilities
  generateDisplayId: () => number;
}

/**
 * Order Store
 * Manages all order state
 */
export const useOrderStore = create<OrderStoreState>((set, get) => ({
  orders: {},
  nextDisplayId: 1,

  addOrder: (order: Order) => {
    set((state) => ({
      orders: {
        ...state.orders,
        [order.id]: order,
      },
    }));
  },

  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => {
    const order = get().getOrder(orderId);
    if (!order) {
      console.warn(`Order ${orderId} not found`);
      return;
    }

    const previousStatus = order.status;
    const now = Date.now();
    const updates: Partial<Order> = { status: newStatus };

    // Track timestamps
    if (newStatus === 'IN_PROGRESS' && !order.startedAt) {
      updates.startedAt = now;
    } else if (newStatus === 'READY' && !order.completedAt) {
      updates.completedAt = now;
    } else if (newStatus === 'CANCELED' && !order.canceledAt) {
      updates.canceledAt = now;
    }

    set((state) => ({
      orders: {
        ...state.orders,
        [orderId]: {
          ...order,
          ...updates,
        },
      },
    }));

    // Dispatch event
    orderEventDispatcher.dispatch({
      type: 'ORDER_STATUS_CHANGED',
      orderId,
      previousStatus,
      newStatus,
      timestamp: now,
    });
  },

  cancelOrder: (orderId: string) => {
    const order = get().getOrder(orderId);
    if (!order) {
      console.warn(`Order ${orderId} not found`);
      return;
    }

    const now = Date.now();

    set((state) => ({
      orders: {
        ...state.orders,
        [orderId]: {
          ...order,
          status: 'CANCELED',
          canceledAt: now,
        },
      },
    }));

    // Dispatch event
    orderEventDispatcher.dispatch({
      type: 'ORDER_CANCELED',
      orderId,
      timestamp: now,
    });
  },

  getOrder: (orderId: string) => {
    return get().orders[orderId];
  },

  getActiveOrders: () => {
    return Object.values(get().orders)
      .filter(order => order.status !== 'CANCELED')
      .sort((a, b) => a.createdAt - b.createdAt);
  },

  getCanceledOrders: () => {
    return Object.values(get().orders)
      .filter(order => order.status === 'CANCELED')
      .sort((a, b) => (b.canceledAt || 0) - (a.canceledAt || 0));
  },

  getAllOrders: () => {
    return Object.values(get().orders).sort((a, b) => a.createdAt - b.createdAt);
  },

  generateDisplayId: () => {
    const currentId = get().nextDisplayId;
    set({ nextDisplayId: currentId + 1 });
    return currentId;
  },
}));

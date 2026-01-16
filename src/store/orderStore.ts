import { create } from 'zustand';
import { Order, OrderStatus } from '../types/order';
import { fetchOrders, updateOrderStatus } from '../services/api';

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pendiente',
  paid: 'Pagado',
  in_progress: 'En Preparación',
  ready: 'Listo',
  completed: 'Completado',
  cancelled: 'Cancelado',
};

interface OrderStore {
  orders: Order[];
  pendingCount: number;
  fetch: () => Promise<void>;
  setStatus: (orderId: string, status: OrderStatus) => Promise<void>;
}

export const useOrderStore = create<OrderStore>((set, get) => ({
  orders: [],
  pendingCount: 0,

  fetch: async () => {
    if (get().pendingCount > 0) return;

    const orders = await fetchOrders();

    // Si hubo un PATCH mientras esperábamos, descartar datos obsoletos
    if (get().pendingCount > 0) return;

    set({ orders });
  },

  setStatus: async (orderId: string, status: OrderStatus) => {
    const order = get().orders.find((o) => o.id === orderId);
    if (!order) return;

    set({ pendingCount: get().pendingCount + 1 });

    // Optimistic update
    set({
      orders: get().orders.map((o) =>
        o.id === orderId ? { ...o, status, status_label: STATUS_LABELS[status] } : o
      ),
    });

    try {
      await updateOrderStatus(orderId, status);
    } finally {
      set({ pendingCount: get().pendingCount - 1 });
    }
  },
}));

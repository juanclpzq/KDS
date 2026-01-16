export type OrderStatus = 'pending' | 'paid' | 'in_progress' | 'ready' | 'completed' | 'cancelled';

export interface OrderItemModifier {
  name: string;
  quantity: number;
}

export interface OrderItemExtra {
  name: string;
  quantity: number;
  price: number;
}

export interface OrderItemException {
  name: string;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  notes: string | null;
  modifiers: OrderItemModifier[];
  extras: OrderItemExtra[];
  exceptions: OrderItemException[];
}

export interface Order {
  id: string;
  public_id: string | null;
  order_number: number;
  device_id: number | null;
  status: OrderStatus;
  status_label: string;
  order_type: string | null;
  customer_name: string | null;
  note: string | null;
  created_at: string;
  started_at: string | null;
  elapsed_minutes: number;
  items: OrderItem[];
}

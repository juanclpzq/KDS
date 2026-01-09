import { Order, OrderStatus } from './order';

/**
 * Event Types
 * All possible events in the KDS system
 */
export type OrderEventType =
  | 'ORDER_CREATED'
  | 'ORDER_STATUS_CHANGED'
  | 'ORDER_CANCELED'
  | 'ORDER_UPDATED';

/**
 * Base Event
 */
export interface BaseOrderEvent {
  type: OrderEventType;
  timestamp: number;
}

/**
 * Order Created Event
 * Fired when a new order is paid and enters the kitchen
 */
export interface OrderCreatedEvent extends BaseOrderEvent {
  type: 'ORDER_CREATED';
  order: Order;
}

/**
 * Order Status Changed Event
 * Fired when order status transitions
 */
export interface OrderStatusChangedEvent extends BaseOrderEvent {
  type: 'ORDER_STATUS_CHANGED';
  orderId: string;
  previousStatus: OrderStatus;
  newStatus: OrderStatus;
}

/**
 * Order Canceled Event
 * Fired when order is canceled
 */
export interface OrderCanceledEvent extends BaseOrderEvent {
  type: 'ORDER_CANCELED';
  orderId: string;
}

/**
 * Order Updated Event
 * Fired when order details change (items, notes, etc.)
 */
export interface OrderUpdatedEvent extends BaseOrderEvent {
  type: 'ORDER_UPDATED';
  order: Order;
}

/**
 * Union type of all events
 */
export type OrderEvent =
  | OrderCreatedEvent
  | OrderStatusChangedEvent
  | OrderCanceledEvent
  | OrderUpdatedEvent;

/**
 * Event Handler
 */
export type OrderEventHandler = (event: OrderEvent) => void;

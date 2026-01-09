import { OrderEvent, OrderEventHandler } from '../types/events';

/**
 * Event Dispatcher
 * Central hub for all order events
 * This will be used by both the demo mode and real WebSocket events
 */
class OrderEventDispatcher {
  private handlers: Set<OrderEventHandler> = new Set();

  /**
   * Subscribe to order events
   */
  subscribe(handler: OrderEventHandler): () => void {
    this.handlers.add(handler);

    // Return unsubscribe function
    return () => {
      this.handlers.delete(handler);
    };
  }

  /**
   * Dispatch an event to all subscribers
   */
  dispatch(event: OrderEvent): void {
    console.log('[EventDispatcher]', event.type, event);

    this.handlers.forEach(handler => {
      try {
        handler(event);
      } catch (error) {
        console.error('[EventDispatcher] Handler error:', error);
      }
    });
  }

  /**
   * Get current number of subscribers
   */
  getSubscriberCount(): number {
    return this.handlers.size;
  }
}

// Singleton instance
export const orderEventDispatcher = new OrderEventDispatcher();

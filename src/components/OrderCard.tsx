import { useEffect, useState } from 'react';
import { Order, OrderStatus } from '../types/order';
import { formatElapsedTime, getElapsedSeconds, isOrderLate } from '../utils/time';
import { useOrderStore } from '../store/orderStore';

interface OrderCardProps {
  order: Order;
}

/**
 * Get status color classes
 */
function getStatusColor(status: OrderStatus, isLate: boolean): string {
  if (isLate) return 'bg-kds-late border-kds-late';

  switch (status) {
    case 'PAID':
      return 'bg-kds-paid border-kds-paid';
    case 'IN_PROGRESS':
      return 'bg-kds-progress border-kds-progress';
    case 'READY':
      return 'bg-kds-ready border-kds-ready';
    case 'CANCELED':
      return 'bg-kds-canceled border-kds-canceled';
    default:
      return 'bg-gray-600 border-gray-600';
  }
}

/**
 * Get status label
 */
function getStatusLabel(status: OrderStatus, isLate: boolean): string {
  if (isLate) return 'LATE';
  return status.replace('_', ' ');
}

/**
 * Order Card Component
 * Displays a single order with all details
 */
export function OrderCard({ order }: OrderCardProps) {
  const { updateOrderStatus } = useOrderStore();
  const [elapsedTime, setElapsedTime] = useState(0);
  const [late, setLate] = useState(false);

  // Update elapsed time every second (stop when READY)
  useEffect(() => {
    const updateTime = () => {
      const elapsed = getElapsedSeconds(order.createdAt);
      setElapsedTime(elapsed);
      setLate(isOrderLate(order.createdAt, order.status, order.startedAt));
    };

    updateTime();

    // Don't start interval if order is READY or CANCELED
    if (order.status === 'READY' || order.status === 'CANCELED') {
      return;
    }

    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [order.createdAt, order.status, order.startedAt]);

  /**
   * Handle status transition on click
   */
  const handleClick = () => {
    let newStatus: OrderStatus;

    switch (order.status) {
      case 'PAID':
        newStatus = 'IN_PROGRESS';
        break;
      case 'IN_PROGRESS':
        newStatus = 'READY';
        break;
      case 'READY':
        // Already ready, do nothing
        return;
      default:
        return;
    }

    updateOrderStatus(order.id, newStatus);
  };

  const statusColor = getStatusColor(order.status, late);
  const statusLabel = getStatusLabel(order.status, late);
  const isClickable = order.status !== 'READY' && order.status !== 'CANCELED';

  return (
    <div
      onClick={isClickable ? handleClick : undefined}
      className={`
        ${statusColor} bg-opacity-10 border-2 rounded-lg p-4
        transition-all duration-200
        ${isClickable ? 'cursor-pointer hover:scale-105 hover:shadow-lg' : 'cursor-default'}
        ${late ? 'animate-pulse' : ''}
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-white">
              #{order.displayId}
            </span>
            {order.customerName && (
              <span className="text-lg text-gray-300">
                {order.customerName}
              </span>
            )}
          </div>
          {order.notes && (
            <div className="mt-1 text-sm text-yellow-300 font-medium">
              {order.notes}
            </div>
          )}
        </div>

        <div className="text-right">
          <div
            className={`
              px-3 py-1 rounded-full text-sm font-bold
              ${statusColor} bg-opacity-100
              ${late ? 'text-white' : 'text-white'}
            `}
          >
            {statusLabel}
          </div>
          <div className="mt-2 text-2xl font-mono font-bold text-white">
            {formatElapsedTime(elapsedTime)}
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="space-y-2">
        {order.items.map((item) => (
          <div key={item.id} className="bg-kds-card bg-opacity-40 rounded p-2">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {item.quantity > 1 && (
                    <span className="text-lg font-bold text-white bg-gray-700 px-2 py-0.5 rounded">
                      {item.quantity}×
                    </span>
                  )}
                  <span className="text-lg font-semibold text-white">
                    {item.name}
                  </span>
                </div>

                {/* Modifiers */}
                {item.modifiers.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {item.modifiers.map((modifier) => (
                      <span
                        key={modifier.id}
                        className="text-xs bg-gray-700 text-gray-200 px-2 py-0.5 rounded"
                      >
                        {modifier.text}
                      </span>
                    ))}
                  </div>
                )}

                {/* Item notes */}
                {item.notes && (
                  <div className="mt-1 text-sm text-yellow-200">
                    {item.notes}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer hint */}
      {isClickable && (
        <div className="mt-3 text-center text-xs text-gray-400">
          Click to advance
        </div>
      )}
    </div>
  );
}

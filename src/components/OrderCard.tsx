import { useEffect, useState } from 'react';
import { Order, OrderStatus } from '../types/order';
import { useOrderStore } from '../store/orderStore';

interface Props {
  order: Order;
}

function getNextStatus(status: OrderStatus): OrderStatus | null {
  if (status === 'pending') return 'in_progress';
  if (status === 'paid') return 'in_progress';
  if (status === 'in_progress') return 'ready';
  if (status === 'ready') return 'completed';
  return null;
}

function getStatusColor(status: OrderStatus): string {
  if (status === 'pending') return 'bg-blue-500 border-blue-500';
  if (status === 'paid') return 'bg-kds-paid border-kds-paid';
  if (status === 'in_progress') return 'bg-kds-progress border-kds-progress';
  if (status === 'ready') return 'bg-kds-ready border-kds-ready';
  return 'bg-gray-600 border-gray-600';
}

function getButtonLabel(status: OrderStatus): string | null {
  if (status === 'pending') return 'Start';
  if (status === 'paid') return 'Start';
  if (status === 'in_progress') return 'Ready';
  if (status === 'ready') return 'Complete';
  return null;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function OrderCard({ order }: Props) {
  const { setStatus } = useOrderStore();
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const createdAt = new Date(order.created_at).getTime();
    const update = () => setElapsed(Math.floor((Date.now() - createdAt) / 1000));
    update();
    if (order.status !== 'ready') {
      const interval = setInterval(update, 1000);
      return () => clearInterval(interval);
    }
  }, [order.created_at, order.status]);

  const handleClick = () => {
    const next = getNextStatus(order.status);
    if (next) setStatus(order.id, next);
  };

  const statusColor = getStatusColor(order.status);
  const isLate = elapsed > 300 && (order.status === 'pending' || order.status === 'paid');

  return (
    <div className={`${statusColor} bg-opacity-10 border-2 rounded-lg p-4 transition-all duration-200 ${isLate ? 'animate-pulse' : ''}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-white">#{order.order_number}</span>
            {order.order_type && (
              <span className="text-sm bg-gray-700 text-gray-300 px-2 py-0.5 rounded">
                {order.order_type}
              </span>
            )}
          </div>
          {order.customer_name && (
            <div className="mt-1 text-lg text-gray-300">{order.customer_name}</div>
          )}
          {order.note && (
            <div className="mt-1 text-sm text-yellow-300 font-medium">{order.note}</div>
          )}
        </div>
        <div className="text-right">
          <div className={`px-3 py-1 rounded-full text-sm font-bold ${statusColor} bg-opacity-100 text-white`}>
            {order.status_label}
          </div>
          <div className="mt-2 text-2xl font-mono font-bold text-white">{formatTime(elapsed)}</div>
        </div>
      </div>

      {/* Items */}
      <div className="space-y-2">
        {order.items.map((item) => (
          <div key={item.id} className="bg-kds-card bg-opacity-40 rounded p-2">
            <div className="flex items-center gap-2">
              {item.quantity > 1 && (
                <span className="text-lg font-bold text-white bg-gray-700 px-2 py-0.5 rounded">
                  {item.quantity}x
                </span>
              )}
              <span className="text-lg font-semibold text-white">{item.name}</span>
            </div>

            {/* Modifiers */}
            {item.modifiers.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1">
                {item.modifiers.map((m, i) => (
                  <span key={i} className="text-xs bg-blue-700 text-blue-100 px-2 py-0.5 rounded">
                    {m.quantity > 1 ? `${m.quantity}x ` : ''}{m.name}
                  </span>
                ))}
              </div>
            )}

            {/* Extras */}
            {item.extras.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1">
                {item.extras.map((e, i) => (
                  <span key={i} className="text-xs bg-green-700 text-green-100 px-2 py-0.5 rounded">
                    + {e.quantity > 1 ? `${e.quantity}x ` : ''}{e.name}
                  </span>
                ))}
              </div>
            )}

            {/* Exceptions */}
            {item.exceptions.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1">
                {item.exceptions.map((ex, i) => (
                  <span key={i} className="text-xs bg-red-700 text-red-100 px-2 py-0.5 rounded">
                    SIN {ex.name}
                  </span>
                ))}
              </div>
            )}

            {/* Item notes */}
            {item.notes && <div className="mt-1 text-sm text-yellow-200">{item.notes}</div>}
          </div>
        ))}
      </div>

      {/* Action Button */}
      {getButtonLabel(order.status) && (
        <button
          onClick={handleClick}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-150"
        >
          {getButtonLabel(order.status)}
        </button>
      )}
    </div>
  );
}

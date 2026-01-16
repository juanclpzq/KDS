import { useEffect } from 'react';
import { useOrderStore } from '../store/orderStore';
import { OrderCard } from '../components/OrderCard';

export function KitchenDisplay() {
  const { orders, fetch } = useOrderStore();

  useEffect(() => {
    fetch();
    const interval = setInterval(fetch, 5000);
    return () => clearInterval(interval);
  }, [fetch]);

  const paidOrders = orders.filter((o) => o.status === 'paid');
  const inProgressOrders = orders.filter((o) => o.status === 'in_progress');
  const readyOrders = orders.filter((o) => o.status === 'ready');

  return (
    <div className="min-h-screen bg-kds-bg">
      <div className="p-6">
        {/* Header */}
        <header className="mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold text-white">Kitchen Display</h1>
            <div className="flex items-center gap-6 text-lg">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-kds-paid"></div>
                <span className="text-gray-300">Waiting: {paidOrders.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-kds-progress"></div>
                <span className="text-gray-300">Preparing: {inProgressOrders.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-kds-ready"></div>
                <span className="text-gray-300">Ready: {readyOrders.length}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Empty State */}
        {orders.length === 0 && (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="text-6xl mb-4">☕</div>
              <h2 className="text-2xl font-semibold text-gray-400 mb-2">No Active Orders</h2>
              <p className="text-gray-500">Orders will appear here when they are paid</p>
            </div>
          </div>
        )}

        {/* Orders Grid */}
        {orders.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paidOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
            {inProgressOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
            {readyOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}

        {/* Footer */}
        <footer className="fixed bottom-2 right-2 text-xs text-gray-600">
          <div className="bg-gray-900 bg-opacity-80 px-3 py-1 rounded">KDS v1.0</div>
        </footer>
      </div>
    </div>
  );
}

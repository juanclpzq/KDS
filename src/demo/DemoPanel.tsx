import { useState } from 'react';
import { useOrderStore } from '../store/orderStore';
import { generateRandomOrder, generateDelayedOrder } from './orderGenerator';
import { orderEventDispatcher } from '../events/dispatcher';
import { OrderStatus } from '../types/order';

/**
 * Demo Panel Component
 * Visible only in development mode
 * Simulates real POS events for testing
 */
export function DemoPanel() {
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [delayMinutes, setDelayMinutes] = useState(6);

  const { addOrder, updateOrderStatus, cancelOrder, getActiveOrders, generateDisplayId } =
    useOrderStore();

  const activeOrders = getActiveOrders();

  /**
   * Create a new random order
   */
  const handleCreateOrder = () => {
    const displayId = generateDisplayId();
    const order = generateRandomOrder(displayId);

    addOrder(order);

    // Dispatch event
    orderEventDispatcher.dispatch({
      type: 'ORDER_CREATED',
      order,
      timestamp: Date.now(),
    });

    console.log('Created order:', order);
  };

  /**
   * Create a delayed (late) order
   */
  const handleCreateLateOrder = () => {
    const displayId = generateDisplayId();
    const order = generateDelayedOrder(displayId, delayMinutes);

    addOrder(order);

    // Dispatch event
    orderEventDispatcher.dispatch({
      type: 'ORDER_CREATED',
      order,
      timestamp: Date.now(),
    });

    console.log('Created late order:', order);
  };

  /**
   * Advance order to next status
   */
  const handleAdvanceStatus = () => {
    if (!selectedOrderId) return;

    const order = useOrderStore.getState().getOrder(selectedOrderId);
    if (!order) return;

    let newStatus: OrderStatus;

    switch (order.status) {
      case 'PAID':
        newStatus = 'IN_PROGRESS';
        break;
      case 'IN_PROGRESS':
        newStatus = 'READY';
        break;
      case 'READY':
        console.log('Order already ready');
        return;
      default:
        return;
    }

    updateOrderStatus(selectedOrderId, newStatus);
    console.log(`Advanced order ${selectedOrderId} to ${newStatus}`);
  };

  /**
   * Cancel selected order
   */
  const handleCancelOrder = () => {
    if (!selectedOrderId) return;

    cancelOrder(selectedOrderId);
    console.log(`Canceled order ${selectedOrderId}`);
    setSelectedOrderId('');
  };

  /**
   * Bulk create orders
   */
  const handleBulkCreate = (count: number) => {
    for (let i = 0; i < count; i++) {
      setTimeout(() => handleCreateOrder(), i * 200);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-gray-900 border-2 border-yellow-500 rounded-lg p-4 shadow-2xl z-50">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-yellow-400 font-bold text-lg">
          DEMO MODE
        </h2>
        <span className="text-xs text-gray-400">Development Only</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Create Orders */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-300">Create Orders</h3>
          <button
            onClick={handleCreateOrder}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition"
          >
            Create Random Order
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => handleBulkCreate(3)}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded text-xs transition"
            >
              +3 Orders
            </button>
            <button
              onClick={() => handleBulkCreate(5)}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded text-xs transition"
            >
              +5 Orders
            </button>
          </div>
        </div>

        {/* Create Late Order */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-300">Simulate Late</h3>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={delayMinutes}
              onChange={(e) => setDelayMinutes(parseInt(e.target.value) || 6)}
              className="flex-1 bg-gray-800 text-white px-3 py-2 rounded text-sm border border-gray-700"
              min="1"
              max="30"
            />
            <span className="text-xs text-gray-400">min</span>
          </div>
          <button
            onClick={handleCreateLateOrder}
            className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium transition"
          >
            Create Late Order
          </button>
        </div>

        {/* Order Selection */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-300">Select Order</h3>
          <select
            value={selectedOrderId}
            onChange={(e) => setSelectedOrderId(e.target.value)}
            className="w-full bg-gray-800 text-white px-3 py-2 rounded text-sm border border-gray-700"
          >
            <option value="">Select order...</option>
            {activeOrders.map((order) => (
              <option key={order.id} value={order.id}>
                #{order.displayId} - {order.status}
                {order.customerName ? ` (${order.customerName})` : ''}
              </option>
            ))}
          </select>
          <div className="text-xs text-gray-400">
            {activeOrders.length} active orders
          </div>
        </div>

        {/* Order Actions */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-300">Actions</h3>
          <button
            onClick={handleAdvanceStatus}
            disabled={!selectedOrderId}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-4 py-2 rounded text-sm font-medium transition"
          >
            Advance Status
          </button>
          <button
            onClick={handleCancelOrder}
            disabled={!selectedOrderId}
            className="w-full bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 disabled:cursor-not-allowed text-white px-4 py-2 rounded text-sm font-medium transition"
          >
            Cancel Order
          </button>
        </div>
      </div>
    </div>
  );
}

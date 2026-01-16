import { Order, OrderStatus } from '../types/order';

const BASE_URL = 'http://localhost:8000';
const ngrokUrl = 'https://millie-monistical-todd.ngrok-free.dev';

const headers = {
  'Content-Type': 'application/json',
  'X-Bypass-Token': 'POS8-BYPASS-TOKEN',
  'X-Location-Id': '61b32e3f-ae5f-44f2-beb6-0eb80ef9dfe5',
};

export async function fetchOrders(): Promise<Order[]> {
  const res = await fetch(`${ngrokUrl}/api/kds/v1/`, { headers });
  const json = await res.json();
  return json.data;
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
  const res = await fetch(`${ngrokUrl}/api/kds/v1/${orderId}/status`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ status }),
  });
  const json = await res.json();
  return json.data;
}

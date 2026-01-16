#!/bin/bash

# Script para crear una orden de prueba en POS8-Cloud usando Artisan Tinker
# Uso: ./create-test-order.sh

cd /Users/juanlopez1/Documents/Repositories/POS8-Cloud

php artisan tinker << 'EOF'

// Crear una orden de prueba
$order = new \App\Models\Order();
$order->company_id = '11111111-1111-1111-1111-111111111111'; // Actualizar con tu company_id
$order->location_id = '22222222-2222-2222-2222-222222222222';
$order->device_id = 1;
$order->status = \App\Enums\OrderStatus::Paid;
$order->order_type = 'dine_in';
$order->customer_name = 'Demo Customer';
$order->note = 'Orden de prueba KDS';
$order->total = 150.00;
$order->save();

echo "✅ Orden creada: " . $order->id . "\n";
echo "Order Number: " . $order->order_number . "\n";
echo "Public ID: " . $order->public_id . "\n";

// Crear items (necesitas IDs de items reales de tu base de datos)
// Primero obtén algunos items disponibles:
$items = \App\Models\Item::limit(3)->get();

if ($items->count() > 0) {
    foreach ($items as $item) {
        $orderItem = new \App\Models\OrderItem();
        $orderItem->order_id = $order->id;
        $orderItem->item_id = $item->id;
        $orderItem->quantity = 1;
        $orderItem->price = 50.00;
        $orderItem->total = 50.00;
        $orderItem->save();
        echo "✅ Item agregado: " . $item->name . "\n";
    }
} else {
    echo "⚠️  No hay items en la base de datos. Crea items primero.\n";
}

echo "\n🎉 Orden de prueba creada exitosamente!\n";

EOF

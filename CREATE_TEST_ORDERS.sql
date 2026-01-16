-- Script para crear órdenes de prueba en POS8-Cloud
-- Ejecutar en la base de datos PostgreSQL del backend

-- Variables que necesitas actualizar:
-- company_id: ID de tu empresa
-- location_id: 22222222-2222-2222-2222-222222222222 (de tu .env.development)

-- Orden 1: Hamburguesa con papas
INSERT INTO orders (
    id,
    company_id,
    location_id,
    device_id,
    status,
    order_type,
    order_number,
    public_id,
    customer_name,
    note,
    total,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    '11111111-1111-1111-1111-111111111111', -- Actualizar con tu company_id
    '22222222-2222-2222-2222-222222222222', -- Location ID de .env.development
    1,
    'paid',
    'dine_in',
    1,
    'ORD-001',
    'Alex',
    'Sin cebolla',
    150.00,
    NOW(),
    NOW()
) RETURNING id;

-- Guarda el ID de la orden anterior para crear los items
-- Reemplaza 'ORDER_ID_AQUI' con el ID retornado

-- Items para Orden 1
INSERT INTO order_items (
    id,
    order_id,
    item_id,
    quantity,
    price,
    total,
    notes,
    created_at,
    updated_at
) VALUES
(
    gen_random_uuid(),
    'ORDER_ID_AQUI', -- Reemplazar con el ID de la orden
    '01010101-1111-2222-3333-444444444444', -- Item ID (debe existir en tu tabla items)
    1,
    100.00,
    100.00,
    NULL,
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'ORDER_ID_AQUI', -- Reemplazar con el ID de la orden
    '02020202-1111-2222-3333-444444444444', -- Item ID (debe existir en tu tabla items)
    1,
    50.00,
    50.00,
    NULL,
    NOW(),
    NOW()
);

-- ============================================
-- OPCIÓN MÁS FÁCIL: Script con una sola query
-- ============================================

WITH new_order AS (
    INSERT INTO orders (
        id,
        company_id,
        location_id,
        device_id,
        status,
        order_type,
        order_number,
        public_id,
        customer_name,
        note,
        total,
        created_at,
        updated_at
    ) VALUES (
        gen_random_uuid(),
        '11111111-1111-1111-1111-111111111111', -- ACTUALIZAR: company_id
        '22222222-2222-2222-2222-222222222222',
        1,
        'paid',
        'dine_in',
        101,
        'ORD-101',
        'Jordan',
        'Rush order',
        250.00,
        NOW(),
        NOW()
    ) RETURNING id
)
INSERT INTO order_items (
    id,
    order_id,
    item_id,
    quantity,
    price,
    total,
    notes,
    created_at,
    updated_at
)
SELECT
    gen_random_uuid(),
    new_order.id,
    '01010101-1111-2222-3333-444444444444', -- ACTUALIZAR: item_id real
    2,
    100.00,
    200.00,
    'Extra queso',
    NOW(),
    NOW()
FROM new_order;

-- Verificar las órdenes creadas
SELECT
    o.id,
    o.order_number,
    o.public_id,
    o.customer_name,
    o.status,
    o.total,
    COUNT(oi.id) as items_count
FROM orders o
LEFT JOIN order_items oi ON oi.order_id = o.id
WHERE o.location_id = '22222222-2222-2222-2222-222222222222'
GROUP BY o.id
ORDER BY o.created_at DESC
LIMIT 10;

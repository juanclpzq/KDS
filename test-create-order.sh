#!/bin/bash
curl -X POST http://localhost:8000/api/kds/v1/test/orders \
  -H "Content-Type: application/json" \
  -H "X-Location-Id: 22222222-2222-2222-2222-222222222222" \
  -H "X-Client-Type: kds" \
  -H "X-Device-Id: 1" \
  -H "X-Bypass-Token: POS8-BYPASS-TOKEN" \
  -d '{
    "customerName": "Test Customer",
    "notes": "Test order",
    "items": [
      {"name": "Cappuccino", "quantity": 1},
      {"name": "Latte", "quantity": 2}
    ]
  }' | python3 -m json.tool

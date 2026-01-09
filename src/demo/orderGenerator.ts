import { Order, OrderItem, ItemModifier } from '../types/order';
import { nanoid } from '../utils/nanoid';

/**
 * Sample menu items for a coffee & bakery
 */
const MENU_ITEMS = [
  // Coffee
  'Espresso',
  'Americano',
  'Cappuccino',
  'Latte',
  'Mocha',
  'Cold Brew',
  'Iced Latte',

  // Bakery
  'Croissant',
  'Pain au Chocolat',
  'Blueberry Muffin',
  'Banana Bread',
  'Cinnamon Roll',
  'Bagel',
  'Avocado Toast',
  'Breakfast Sandwich',
];

/**
 * Sample modifiers
 */
const MODIFIERS = [
  'Extra shot',
  'Oat milk',
  'Almond milk',
  'No sugar',
  'Extra hot',
  'Iced',
  'Decaf',
  'Extra foam',
  'Light foam',
  'Whipped cream',
  'Caramel drizzle',
  'Toasted',
  'Butter on side',
  'Gluten-free bread',
];

/**
 * Sample customer names
 */
const CUSTOMER_NAMES = [
  'Alex',
  'Jordan',
  'Sam',
  'Casey',
  'Riley',
  'Taylor',
  'Morgan',
  'Jamie',
  'Avery',
  'Quinn',
];

/**
 * Generate random integer between min and max (inclusive)
 */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Pick random element from array
 */
function randomPick<T>(array: T[]): T {
  return array[randomInt(0, array.length - 1)];
}

/**
 * Generate random modifiers for an item
 */
function generateModifiers(): ItemModifier[] {
  const count = Math.random() < 0.6 ? randomInt(0, 2) : 0; // 60% chance of modifiers
  const modifiers: ItemModifier[] = [];

  for (let i = 0; i < count; i++) {
    modifiers.push({
      id: nanoid(8),
      text: randomPick(MODIFIERS),
    });
  }

  return modifiers;
}

/**
 * Generate random order item
 */
function generateOrderItem(): OrderItem {
  return {
    id: nanoid(8),
    name: randomPick(MENU_ITEMS),
    quantity: Math.random() < 0.8 ? 1 : randomInt(2, 3), // Usually 1, sometimes 2-3
    modifiers: generateModifiers(),
    notes: Math.random() < 0.1 ? 'Please prepare carefully' : undefined,
  };
}

/**
 * Generate random order
 */
export function generateRandomOrder(displayId: number): Order {
  const itemCount = randomInt(1, 4);
  const items: OrderItem[] = [];

  for (let i = 0; i < itemCount; i++) {
    items.push(generateOrderItem());
  }

  return {
    id: nanoid(12),
    displayId,
    status: 'PAID',
    items,
    createdAt: Date.now(),
    customerName: Math.random() < 0.7 ? randomPick(CUSTOMER_NAMES) : undefined,
    notes: Math.random() < 0.05 ? 'Rush order' : undefined,
  };
}

/**
 * Generate order with artificial delay (for late simulation)
 */
export function generateDelayedOrder(displayId: number, delayMinutes: number): Order {
  const order = generateRandomOrder(displayId);
  order.createdAt = Date.now() - delayMinutes * 60 * 1000;
  return order;
}

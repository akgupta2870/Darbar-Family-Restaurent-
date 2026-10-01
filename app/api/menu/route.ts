import { INITIAL_MENU_ITEMS } from '@/src/data/mockData';

export async function GET() {
  return Response.json({
    success: true,
    restaurant: 'DARBAR Fine Dining & Family Restaurant',
    items: INITIAL_MENU_ITEMS,
    categories: [
      'Starters',
      'Main Course',
      'Breads',
      'Rice & Biryani',
      'Chinese',
      'Beverages',
      'Desserts',
    ],
  });
}

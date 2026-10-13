import { INITIAL_ORDERS } from '../../../src/data/mockData';

export async function GET() {
  return Response.json({
    success: true,
    orders: INITIAL_ORDERS,
    total: INITIAL_ORDERS.length,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newOrder = {
      ...body,
      id: `order-${Date.now()}`,
      orderId: `#DB${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      orderStatus: 'Received',
    };

    return Response.json(
      {
        success: true,
        message: 'Order created successfully at Darbar',
        order: newOrder,
      },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      { success: false, error: 'Invalid order payload' },
      { status: 400 }
    );
  }
}

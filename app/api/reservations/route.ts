export async function GET() {
  return Response.json({
    success: true,
    reservations: [
      {
        id: 'res-101',
        customerName: 'Rajesh Kapoor',
        phone: '+91 98112 44556',
        guestsCount: 6,
        date: 'Today, Oct 1',
        timeSlot: '8:00 PM - Dinner',
        seatingArea: 'Private Family Booth',
        status: 'Confirmed',
        tableAssigned: 'Booth B-4',
      },
    ],
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const reservation = {
      ...body,
      id: `res-${Date.now()}`,
      status: 'Confirmed',
      tableAssigned: body.seatingArea?.includes('Booth') ? 'Booth B-2' : 'Table R-5',
      createdAt: new Date().toISOString(),
    };

    return Response.json(
      {
        success: true,
        message: 'Table reservation confirmed at Darbar Fine Dining',
        reservation,
      },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      { success: false, error: 'Failed to process table reservation' },
      { status: 400 }
    );
  }
}

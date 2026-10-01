// Next.js Route Handler for WhatsApp Cloud API Webhook Integration
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  // Verify webhook token for Meta / WhatsApp Business API
  if (mode === 'subscribe' && token === (process.env.WHATSAPP_VERIFY_TOKEN || 'darbar_webhook_token')) {
    return new Response(challenge, { status: 200 });
  }

  return new Response('Forbidden', { status: 403 });
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    console.log('Incoming WhatsApp notification webhook payload:', JSON.stringify(payload));

    // Handle inbound WhatsApp order inquiries or status confirmation
    return Response.json({
      received: true,
      restaurant: 'DARBAR Fine Dining & Family Restaurant',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return Response.json({ error: 'Failed to process WhatsApp webhook' }, { status: 400 });
  }
}

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const authSecret = req.headers.get('x-repurpose-secret');
    const expectedSecret = process.env.REPURPOSEFLOW_WEBHOOK_SECRET;

    if (expectedSecret && authSecret !== expectedSecret) {
      return NextResponse.json({ error: 'Unauthorized webhook' }, { status: 401 });
    }

    const body = await req.json();
    const { jobId, status, geminiResponse, items } = body;

    console.log(`[n8n Webhook Received] Job: ${jobId}, status: ${status}`);

    // Process and return acknowledged
    return NextResponse.json({
      success: true,
      jobId,
      message: 'Webhook processed successfully'
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Webhook processing failed' }, { status: 500 });
  }
}

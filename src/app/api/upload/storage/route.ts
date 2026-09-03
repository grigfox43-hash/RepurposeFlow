import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key') || `uploads/${Date.now()}-media.mp3`;

    // Accept stream/blob
    const data = await req.arrayBuffer();
    const sizeBytes = data.byteLength;

    return NextResponse.json({
      success: true,
      key,
      sizeBytes,
      status: 'uploaded',
      url: `https://storage.repurposeflow.io/${key}`
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  return POST(req);
}

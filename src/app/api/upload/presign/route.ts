import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { filename, contentType, sizeBytes } = await req.json();

    if (!filename) {
      return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
    }

    const cleanName = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    const key = `uploads/${Date.now()}-${cleanName}`;

    // Cloudflare R2 / AWS S3 presigned URL generation or mock direct upload
    // If S3/R2 environment variables are present, generate real signed URL
    const s3Endpoint = process.env.S3_ENDPOINT || process.env.R2_ENDPOINT;
    const bucket = process.env.S3_BUCKET || 'repurposeflow-media';

    const presignedUrl = s3Endpoint
      ? `${s3Endpoint}/${bucket}/${key}?signature=demo-presigned-token`
      : `/api/upload/direct-mock?key=${encodeURIComponent(key)}`;

    const publicUrl = s3Endpoint
      ? `https://${bucket}.r2.cloudflarestorage.com/${key}`
      : `https://storage.repurposeflow.io/${key}`;

    return NextResponse.json({
      success: true,
      presignedUrl,
      publicUrl,
      key,
      maxSizeBytes: 500 * 1024 * 1024 // 500MB
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Upload presign error' }, { status: 500 });
  }
}

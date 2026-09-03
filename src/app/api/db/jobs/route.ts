import { NextResponse } from 'next/server';
import { dbGetJobs, dbSaveJob } from '@/lib/db';

export async function GET() {
  try {
    const jobs = await dbGetJobs();
    return NextResponse.json({ success: true, jobs });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const job = await req.json();
    if (!job || !job.id) {
      return NextResponse.json({ error: 'Invalid job object' }, { status: 400 });
    }
    const saved = await dbSaveJob(job);
    return NextResponse.json({ success: true, job: saved });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

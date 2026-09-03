import { NextResponse } from 'next/server';
import { generateContentWithGemini } from '@/lib/gemini';
import { dbSaveJob } from '@/lib/db';
import { FormatType, ToneOfVoice, MediaJob } from '@/types';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      userId = 'user-001',
      title,
      sourceType,
      fileName,
      fileUrl,
      durationSeconds = 1200,
      language = 'ru',
      tone = 'b2b_expert',
      formats = ['linkedin_thread', 'vc_article', 'reels_scripts', 'telegram_digest', 'newsletter', 'quotes'],
      workspaceId = 'ws-personal',
      apiKey: customApiKey
    } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const durationMin = Math.max(1, Math.round(durationSeconds / 60));
    const durationFormatted = `${Math.floor(durationSeconds / 60)}:${(durationSeconds % 60).toString().padStart(2, '0')}`;

    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
    const jobId = `job-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    // Optional n8n Webhook trigger
    if (n8nWebhookUrl) {
      try {
        fetch(n8nWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jobId,
            title,
            sourceType,
            fileUrl,
            durationSeconds,
            language,
            tone,
            formats
          })
        }).catch((e) => console.error('Background n8n hook error:', e));
      } catch (err) {
        console.warn('n8n hook dispatch failed:', err);
      }
    }

    // Call Gemini processor directly with default or custom key
    const { contentItems, transcript } = await generateContentWithGemini({
      title,
      tone: tone as ToneOfVoice,
      formats: formats as FormatType[],
      language,
      apiKey: customApiKey
    });

    const job: MediaJob = {
      id: jobId,
      userId,
      workspaceId,
      title,
      sourceType,
      fileName: fileName || (sourceType === 'youtube' ? 'YouTube Stream' : 'Audio Track'),
      fileUrl: fileUrl || '',
      durationSeconds,
      durationFormatted,
      status: 'completed',
      progressPercent: 100,
      language,
      tone,
      formatsRequested: formats,
      contentItems,
      transcript,
      minutesCharged: durationMin,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString()
    };

    // Save directly to real persistent database
    await dbSaveJob(job);

    return NextResponse.json({ success: true, job });
  } catch (err: any) {
    console.error('Job creation error:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

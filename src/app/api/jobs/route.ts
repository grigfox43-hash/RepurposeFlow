import { NextResponse } from 'next/server';
import { generateContentWithGemini } from '@/lib/gemini';
import { FormatType, ToneOfVoice } from '@/types';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      sourceType,
      fileName,
      fileUrl,
      durationSeconds = 1200,
      language = 'ru',
      tone = 'b2b_expert',
      formats = ['linkedin_thread', 'vc_article', 'reels_scripts', 'telegram_digest', 'newsletter', 'quotes'],
      workspaceId = 'ws-personal'
    } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const durationMin = Math.max(1, Math.round(durationSeconds / 60));
    const durationFormatted = `${Math.floor(durationSeconds / 60)}:${(durationSeconds % 60).toString().padStart(2, '0')}`;

    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
    const jobId = `job-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    // If n8n Webhook is configured, forward the job to n8n!
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

    // Call our high-speed Gemini processor directly
    const { contentItems, transcript } = await generateContentWithGemini({
      title,
      tone: tone as ToneOfVoice,
      formats: formats as FormatType[],
      language
    });

    const job = {
      id: jobId,
      workspaceId,
      title,
      sourceType,
      fileName: fileName || (sourceType === 'youtube' ? 'YouTube Stream' : 'Audio Track'),
      fileUrl: fileUrl || 'https://storage.repurposeflow.io/sample.mp3',
      durationSeconds,
      durationFormatted,
      status: 'completed' as const,
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

    return NextResponse.json({ success: true, job });
  } catch (err: any) {
    console.error('Job creation error:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

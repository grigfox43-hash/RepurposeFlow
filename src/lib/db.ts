import fs from 'fs';
import path from 'path';
import { MediaJob, UserProfile } from '@/types';

// Storage path: in local development uses project root /data/db.json;
// On Vercel / serverless environment uses /tmp/repurposeflow-db.json
const DATA_DIR = process.env.VERCEL ? '/tmp' : path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'repurposeflow-db.json');

interface DatabaseData {
  jobs: MediaJob[];
  user: {
    minutesUsed: number;
    minutesTotal: number;
  };
}

function ensureDbFile(): DatabaseData {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      const initialData: DatabaseData = {
        jobs: [],
        user: { minutesUsed: 0, minutesTotal: 360 }
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
      return initialData;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Database read error:', err);
    return { jobs: [], user: { minutesUsed: 0, minutesTotal: 360 } };
  }
}

function saveDbFile(data: DatabaseData) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Database write error:', err);
  }
}

// Get all jobs from real persistent database
export async function dbGetJobs(): Promise<MediaJob[]> {
  // If Supabase credentials are provided
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/media_jobs?select=*&order=created_at.desc`, {
        headers: {
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
        }
      });
      if (res.ok) {
        const rows = await res.json();
        if (Array.isArray(rows) && rows.length > 0) {
          return rows.map((r: any) => ({
            id: r.id,
            workspaceId: r.workspace_id || 'ws-personal',
            title: r.title,
            sourceType: r.source_type,
            fileName: r.file_name,
            fileUrl: r.file_url,
            durationSeconds: r.duration_seconds,
            durationFormatted: `${Math.floor(r.duration_seconds / 60)}:${(r.duration_seconds % 60).toString().padStart(2, '0')}`,
            status: r.status,
            progressPercent: r.progress_percent || 100,
            language: r.language || 'ru',
            tone: r.tone || 'b2b_expert',
            formatsRequested: r.formats_requested || [],
            contentItems: r.content_items || [],
            transcript: r.transcript,
            minutesCharged: r.minutes_charged || 0,
            createdAt: r.created_at
          }));
        }
      }
    } catch (err) {
      console.warn('Supabase fetch failed, using persistent file storage:', err);
    }
  }

  // Persistent file DB
  const db = ensureDbFile();
  return db.jobs;
}

// Save job into database
export async function dbSaveJob(job: MediaJob): Promise<MediaJob> {
  const db = ensureDbFile();
  const existingIdx = db.jobs.findIndex((j) => j.id === job.id);
  if (existingIdx >= 0) {
    db.jobs[existingIdx] = job;
  } else {
    db.jobs.unshift(job);
  }
  db.user.minutesUsed += job.minutesCharged || 0;
  saveDbFile(db);

  // If Supabase is active, sync to Supabase
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/media_jobs`, {
        method: 'POST',
        headers: {
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify({
          id: job.id,
          workspace_id: job.workspaceId,
          title: job.title,
          source_type: job.sourceType,
          file_name: job.fileName,
          file_url: job.fileUrl,
          duration_seconds: job.durationSeconds,
          status: job.status,
          progress_percent: job.progressPercent,
          language: job.language,
          tone: job.tone,
          formats_requested: job.formatsRequested,
          content_items: job.contentItems,
          transcript: job.transcript,
          minutes_charged: job.minutesCharged
        })
      });
    } catch (err) {
      console.warn('Supabase sync error:', err);
    }
  }

  return job;
}

// Delete job from database
export async function dbDeleteJob(jobId: string): Promise<boolean> {
  const db = ensureDbFile();
  db.jobs = db.jobs.filter((j) => j.id !== jobId);
  saveDbFile(db);

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/media_jobs?id=eq.${jobId}`, {
        method: 'DELETE',
        headers: {
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
        }
      });
    } catch (err) {
      console.warn('Supabase delete error:', err);
    }
  }

  return true;
}

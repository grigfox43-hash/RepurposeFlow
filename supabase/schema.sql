-- RepurposeFlow - Supabase PostgreSQL Schema
-- Run this in your Supabase SQL Editor

-- 1. Profiles & Credit Balances
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  plan_tier TEXT DEFAULT 'starter', -- 'starter', 'pro', 'agency'
  minutes_balance INTEGER DEFAULT 120,
  minutes_used INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Workspaces (for multi-tenant agency accounts)
CREATE TABLE IF NOT EXISTS public.workspaces (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  is_agency_client BOOLEAN DEFAULT FALSE,
  client_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Media Processing Jobs
CREATE TABLE IF NOT EXISTS public.media_jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  source_type TEXT NOT NULL, -- 'file_upload', 'youtube', 'gdrive'
  file_url TEXT,
  file_name TEXT,
  duration_seconds INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending', -- 'uploading', 'processing', 'completed', 'failed'
  progress_percent INTEGER DEFAULT 0,
  language TEXT DEFAULT 'ru',
  tone TEXT DEFAULT 'b2b_expert',
  formats_requested JSONB DEFAULT '[]'::jsonb,
  error_message TEXT,
  minutes_charged INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Transcripts
CREATE TABLE IF NOT EXISTS public.transcripts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES public.media_jobs(id) ON DELETE CASCADE UNIQUE,
  full_text TEXT NOT NULL,
  segments JSONB DEFAULT '[]'::jsonb,
  word_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Generated Content Items (15 formats)
CREATE TABLE IF NOT EXISTS public.content_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES public.media_jobs(id) ON DELETE CASCADE,
  format_type TEXT NOT NULL,
  title TEXT NOT NULL,
  platform TEXT NOT NULL,
  badge TEXT,
  content_markdown TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transcripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;

-- Simple RLS Policies
CREATE POLICY "Users can access their own profile" ON public.profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can access their workspaces" ON public.workspaces
  FOR ALL USING (auth.uid() = owner_id);

CREATE POLICY "Users can view their jobs" ON public.media_jobs
  FOR ALL USING (auth.uid() = user_id);

export type FormatType =
  | 'linkedin_thread'
  | 'linkedin_carousel'
  | 'vc_article'
  | 'medium_story'
  | 'reels_scripts'
  | 'tiktok_hooks'
  | 'telegram_digest'
  | 'telegram_case'
  | 'newsletter'
  | 'quotes'
  | 'key_takeaways'
  | 'twitter_thread'
  | 'youtube_community'
  | 'podcast_shownotes'
  | 'faq_extract';

export type ToneOfVoice =
  | 'b2b_expert'
  | 'provocative_founder'
  | 'storyteller'
  | 'punchy_viral';

export type JobStatus =
  | 'uploading'
  | 'processing'
  | 'completed'
  | 'failed';

export interface ContentItem {
  id: string;
  formatType: FormatType;
  title: string;
  subtitle?: string;
  content: string;
  badge: string;
  platform: 'LinkedIn' | 'VC.ru / Habr' | 'Reels / TikTok' | 'Telegram' | 'Email' | 'Twitter / X' | 'General';
  iconName: string;
  wordCount?: number;
  readingTimeMinutes?: number;
}

export interface TranscriptSegment {
  id: string;
  start: string; // e.g. "00:15"
  end: string;   // e.g. "01:20"
  speaker: string;
  text: string;
}

export interface MediaJob {
  id: string;
  userId?: string;
  workspaceId: string;
  title: string;
  sourceType: 'file_upload' | 'youtube' | 'gdrive';
  fileName?: string;
  fileUrl?: string;
  durationSeconds: number;
  durationFormatted: string;
  status: JobStatus;
  progressPercent: number;
  currentStepDescription?: string;
  language: 'ru' | 'en' | 'auto';
  tone: ToneOfVoice;
  formatsRequested: FormatType[];
  contentItems: ContentItem[];
  transcript?: {
    fullText: string;
    segments: TranscriptSegment[];
    wordCount: number;
  };
  minutesCharged: number;
  createdAt: string;
  completedAt?: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  isAgencyClient: boolean;
  clientName?: string;
  jobsCount: number;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  plan: 'starter' | 'pro' | 'agency';
  minutesTotal: number;
  minutesUsed: number;
  workspaces: Workspace[];
  activeWorkspaceId: string;
  isAuthenticated?: boolean;
}

export interface PlanDetails {
  id: 'starter' | 'pro' | 'agency';
  name: string;
  priceMonthly: number;
  priceAnnual: number;
  minutesPerMonth: number;
  popular?: boolean;
  features: string[];
  description: string;
}

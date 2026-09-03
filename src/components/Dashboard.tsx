'use client';

import React, { useState } from 'react';
import {
  Zap,
  Plus,
  Clock,
  CheckCircle2,
  FileText,
  Search,
  ChevronRight,
  Trash2,
  Layers,
  Sparkles,
  Radio,
  FileAudio,
  User
} from 'lucide-react';
import { MediaJob, UserProfile, Workspace } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

interface DashboardProps {
  user: UserProfile;
  activeWorkspace: Workspace;
  jobs: MediaJob[];
  onOpenUpload: () => void;
  onOpenStudio: (job: MediaJob) => void;
  onDeleteJob: (jobId: string) => void;
  onOpenCabinet: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  activeWorkspace,
  jobs,
  onOpenUpload,
  onOpenStudio,
  onDeleteJob,
  onOpenCabinet
}) => {
  const { t } = useLanguage();
  const [filterQuery, setFilterQuery] = useState('');

  // Filter jobs by user.id so each user works in their own personal cabinet!
  const userJobs = jobs.filter(
    (j) => !j.userId || j.userId === user.id
  );

  const workspaceJobs = userJobs.filter(
    (j) => !j.workspaceId || j.workspaceId === activeWorkspace.id
  );

  const filteredJobs = workspaceJobs.filter((j) =>
    j.title.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const totalContentItems = workspaceJobs.reduce(
    (acc, curr) => acc + (curr.contentItems?.length || 0),
    0
  );

  const hoursSaved = (workspaceJobs.reduce((acc, curr) => acc + (curr.durationSeconds || 0), 0) / 3600 * 3.5).toFixed(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Workspace Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#080C14] via-[#0B132B]/50 to-[#080C14] border border-white/[0.08] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <button
              onClick={onOpenCabinet}
              className="text-xs px-2.5 py-1 rounded-lg bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30 flex items-center gap-1.5 hover:bg-cyan-500/25 transition"
            >
              <User className="w-3.5 h-3.5 text-cyan-400" /> {user.name} ({t.navAccount})
            </button>
            <span className="text-xs px-2.5 py-1 rounded-lg bg-white/[0.05] text-slate-300 border border-white/[0.08] flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-slate-400" /> {activeWorkspace.name}
            </span>
            {activeWorkspace.isAgencyClient && (
              <span className="text-xs px-2.5 py-1 rounded-lg bg-purple-900/40 text-purple-300 border border-purple-700/50">
                {t.navClient}: {activeWorkspace.clientName}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {t.dashTitle}
          </h1>
          <p className="mt-1 text-sm text-slate-400 max-w-xl">
            {t.dashSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 w-full sm:w-auto">
          <button
            onClick={onOpenUpload}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>{t.dashNewProject}</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#080C14] border border-white/[0.07]">
          <div className="text-xs text-slate-400 mb-2">{t.dashMetricMinutes}</div>
          <div className="text-2xl font-extrabold text-white font-mono">
            {Math.max(0, user.minutesTotal - user.minutesUsed)} <span className="text-sm font-normal text-slate-400">/ {user.minutesTotal} мин</span>
          </div>
          <div className="mt-3 text-xs text-cyan-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Gemini AI
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#080C14] border border-white/[0.07]">
          <div className="text-xs text-slate-400 mb-2">{t.dashMetricProjects}</div>
          <div className="text-2xl font-extrabold text-white font-mono">
            {workspaceJobs.length}
          </div>
          <div className="mt-3 text-xs text-slate-500 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Все данные сохранены в БД
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#080C14] border border-white/[0.07]">
          <div className="text-xs text-slate-400 mb-2">{t.dashMetricPosts}</div>
          <div className="text-2xl font-extrabold text-white font-mono">
            {totalContentItems}
          </div>
          <div className="mt-3 text-xs text-slate-500">
            LinkedIn, Articles, Reels, Telegram
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#080C14] border border-white/[0.07]">
          <div className="text-xs text-slate-400 mb-2">{t.dashMetricHours}</div>
          <div className="text-2xl font-extrabold text-cyan-400 font-mono">
            ~{hoursSaved} ч
          </div>
          <div className="mt-3 text-xs text-slate-500">
            автоматическая дистрибуция
          </div>
        </div>
      </div>

      {/* Projects List Header & Search */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">История переработки</h2>
            <p className="text-xs text-slate-400">
              Нажмите на проект, чтобы перейти в Студию и скопировать готовые посты
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder={t.dashSearchPlaceholder}
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#080C14] border border-white/[0.08] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Jobs List */}
        {filteredJobs.length > 0 ? (
          <div className="space-y-3">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="p-5 rounded-2xl bg-[#080C14]/90 border border-white/[0.07] hover:border-cyan-500/40 hover:bg-[#0B0F19] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                <div
                  onClick={() => onOpenStudio(job)}
                  className="flex-1 cursor-pointer flex items-start gap-4"
                >
                  <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <FileAudio className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {job.title}
                      </h3>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
                        {job.status === 'completed' ? t.dashStatusCompleted : t.dashStatusProcessing}
                      </span>
                    </div>

                    <div className="mt-1 flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        {job.durationFormatted || '30:00'}
                      </span>
                      <span>•</span>
                      <span>{job.contentItems?.length || 0} готовых форматов</span>
                      <span>•</span>
                      <span className="text-slate-500">
                        {new Date(job.createdAt).toLocaleDateString(undefined, {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  <button
                    onClick={() => onOpenStudio(job)}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold transition flex items-center gap-1.5 shadow-md"
                  >
                    <span>{t.dashOpenStudio}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(t.dashDeleteConfirm)) {
                        onDeleteJob(job.id);
                      }
                    }}
                    className="p-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-white/[0.05] transition"
                    title="Delete project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-16 text-center rounded-3xl bg-[#080C14]/40 border border-dashed border-white/[0.08]">
            <Radio className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">{t.dashEmptyTitle}</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              {t.dashEmptyDesc}
            </p>
            <button
              onClick={onOpenUpload}
              className="mt-5 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold transition inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>{t.dashEmptyBtn}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

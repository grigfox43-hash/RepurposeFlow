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
  Share2,
  Flame,
  Layers,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { MediaJob, UserProfile, Workspace } from '@/types';

interface DashboardProps {
  user: UserProfile;
  activeWorkspace: Workspace;
  jobs: MediaJob[];
  onOpenUpload: () => void;
  onOpenStudio: (job: MediaJob) => void;
  onDeleteJob: (jobId: string) => void;
  onOpenBilling: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  activeWorkspace,
  jobs,
  onOpenUpload,
  onOpenStudio,
  onDeleteJob,
  onOpenBilling
}) => {
  const [filterQuery, setFilterQuery] = useState('');

  const workspaceJobs = jobs.filter(
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
      {/* Workspace Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs px-2.5 py-1 rounded-lg bg-indigo-600/30 text-indigo-300 font-semibold border border-indigo-500/40 flex items-center gap-1">
              <Layers className="w-3 h-3" /> {activeWorkspace.name}
            </span>
            {activeWorkspace.isAgencyClient && (
              <span className="text-xs px-2.5 py-1 rounded-lg bg-violet-900/40 text-violet-300 border border-violet-700/50">
                Клиент: {activeWorkspace.clientName}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Рабочее пространство проектов
          </h1>
          <p className="mt-1 text-sm text-slate-400 max-w-xl">
            Управляйте записями, перерабатывайте контент в 15 форматов и отслеживайте дистрибуцию через ИИ-комбайн.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 w-full sm:w-auto">
          <button
            onClick={onOpenUpload}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-emerald-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:scale-105 transition flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Переработать аудио / видео</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Баланс минут</span>
            <span className="text-indigo-400 font-bold uppercase">{user.plan}</span>
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">
            {user.minutesTotal - user.minutesUsed} <span className="text-sm font-normal text-slate-400">/ {user.minutesTotal} мин</span>
          </div>
          <button
            onClick={onOpenBilling}
            className="mt-3 text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
          >
            <span>Пополнить или сменить план</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
          <div className="text-xs text-slate-400 mb-2">Всего проектов</div>
          <div className="text-2xl font-extrabold text-white font-mono">
            {workspaceJobs.length}
          </div>
          <div className="mt-3 text-xs text-slate-500 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Все обработаны успешно
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
          <div className="text-xs text-slate-400 mb-2">Сгенерировано публикаций</div>
          <div className="text-2xl font-extrabold text-white font-mono">
            {totalContentItems}
          </div>
          <div className="mt-3 text-xs text-slate-500">
            LinkedIn, VC, Reels, Telegram, Email
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
          <div className="text-xs text-slate-400 mb-2">Сэкономлено времени</div>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono">
            ~{hoursSaved} часов
          </div>
          <div className="mt-3 text-xs text-slate-500">
            вместо ручной работы райтеров
          </div>
        </div>
      </div>

      {/* Projects List Header & Search */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">История переработки</h2>
            <p className="text-xs text-slate-400">
              Нажмите на проект, чтобы перейти в интерактивную Студию и экспортировать публикации
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Поиск по проектам..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Jobs Cards / Table */}
        {filteredJobs.length > 0 ? (
          <div className="space-y-3">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/40 hover:bg-slate-900 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                <div
                  onClick={() => onOpenStudio(job)}
                  className="flex-1 cursor-pointer flex items-start gap-4"
                >
                  <div className="w-11 h-11 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <FileText className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {job.title}
                      </h3>
                      <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                        {job.status === 'completed' ? 'Готово' : 'Обработка'}
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
                        {new Date(job.createdAt).toLocaleDateString('ru-RU', {
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
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-md"
                  >
                    <span>В Студию</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteJob(job.id)}
                    className="p-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-slate-800 transition"
                    title="Удалить проект"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-3xl bg-slate-900/30 border border-dashed border-slate-800">
            <Sparkles className="w-8 h-8 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">В этом воркспейсе пока нет проектов</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Загрузите вашу первую аудиозапись или ссылку на YouTube, чтобы получить 15 готовых публикаций за 3 минуты.
            </p>
            <button
              onClick={onOpenUpload}
              className="mt-4 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Загрузить первую запись</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

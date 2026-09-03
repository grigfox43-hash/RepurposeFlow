'use client';

import React, { useState } from 'react';
import {
  X,
  UploadCloud,
  Video,
  FileAudio,
  Film,
  Sparkles,
  CheckSquare,
  Square,
  AlertCircle,
  Zap,
  Globe,
  Sliders,
  Check,
  Radio
} from 'lucide-react';
import { FormatType, ToneOfVoice, MediaJob, UserProfile } from '@/types';
import { FORMAT_DEFINITIONS } from '@/lib/gemini';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  activeWorkspaceId: string;
  onJobStarted: (job: MediaJob) => void;
}

const ALL_FORMAT_KEYS = Object.keys(FORMAT_DEFINITIONS) as FormatType[];

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  user,
  activeWorkspaceId,
  onJobStarted
}) => {
  const [sourceType, setSourceType] = useState<'file' | 'youtube' | 'gdrive'>('file');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [title, setTitle] = useState('');
  const [estimatedDurationMin, setEstimatedDurationMin] = useState(30);
  const [language, setLanguage] = useState<'ru' | 'en' | 'auto'>('ru');
  const [tone, setTone] = useState<ToneOfVoice>('b2b_expert');
  const [selectedFormats, setSelectedFormats] = useState<FormatType[]>([
    'linkedin_thread',
    'vc_article',
    'reels_scripts',
    'telegram_digest',
    'newsletter',
    'quotes'
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  if (!isOpen) return null;

  const minutesLeft = Math.max(0, user.minutesTotal - user.minutesUsed);
  const hasEnoughMinutes = minutesLeft >= estimatedDurationMin;

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '));
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '));
      }
    }
  };

  const toggleFormat = (fmt: FormatType) => {
    setSelectedFormats((prev) =>
      prev.includes(fmt) ? prev.filter((f) => f !== fmt) : [...prev, fmt]
    );
  };

  const toggleAllFormats = () => {
    if (selectedFormats.length === ALL_FORMAT_KEYS.length) {
      setSelectedFormats([]);
    } else {
      setSelectedFormats([...ALL_FORMAT_KEYS]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    if (sourceType === 'file' && !selectedFile) return;
    if (sourceType === 'youtube' && !youtubeUrl.trim()) return;

    setIsSubmitting(true);

    try {
      // Step 1: Pre-sign upload (if file)
      let fileUrl = '';
      if (sourceType === 'file' && selectedFile) {
        const presignRes = await fetch('/api/upload/presign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: selectedFile.name,
            sizeBytes: selectedFile.size
          })
        });
        const presignData = await presignRes.json();
        fileUrl = presignData.publicUrl || '';
      }

      // Step 2: Create media job and run Gemini 2.0 pipeline
      const durationSeconds = estimatedDurationMin * 60;
      const jobRes = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspaceId: activeWorkspaceId,
          title: title.trim(),
          sourceType: sourceType === 'file' ? 'file_upload' : sourceType,
          fileName: selectedFile?.name || (sourceType === 'youtube' ? youtubeUrl : 'Google Drive Media'),
          fileUrl,
          durationSeconds,
          language,
          tone,
          formats: selectedFormats
        })
      });

      const jobData = await jobRes.json();

      if (!jobRes.ok || !jobData.job) {
        throw new Error(jobData.error || 'Failed to create job');
      }

      onJobStarted(jobData.job);
      onClose();
    } catch (err: any) {
      alert(`Ошибка создания задачи: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 my-8 text-left max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
              <Zap className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Новая переработка контента</h2>
              <p className="text-xs text-slate-400">
                Загрузите аудио или видеозапись для обработки в Google Gemini 2.0
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Source Tabs: File Drag&Drop vs YouTube URL */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Источник записи:
            </label>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                type="button"
                onClick={() => setSourceType('file')}
                className={`py-3 px-4 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition ${
                  sourceType === 'file'
                    ? 'bg-indigo-600/20 border-indigo-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <FileAudio className="w-4 h-4 text-indigo-400" />
                <span>Файл (MP3, WAV, MP4, MOV)</span>
              </button>
              <button
                type="button"
                onClick={() => setSourceType('youtube')}
                className={`py-3 px-4 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition ${
                  sourceType === 'youtube'
                    ? 'bg-indigo-600/20 border-indigo-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Video className="w-4 h-4 text-red-400" />
                <span>Ссылка на YouTube</span>
              </button>
            </div>

            {/* Drop Zone */}
            {sourceType === 'file' ? (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleFileDrop}
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all relative ${
                  dragActive
                    ? 'border-indigo-500 bg-indigo-950/20'
                    : selectedFile
                    ? 'border-emerald-500/50 bg-emerald-950/10'
                    : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                }`}
              >
                <input
                  type="file"
                  id="media-file-input"
                  accept="audio/*,video/*,.mp3,.wav,.m4a,.mp4,.mov"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="media-file-input"
                  className="cursor-pointer flex flex-col items-center justify-center"
                >
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center mb-3">
                    <UploadCloud className="w-6 h-6 text-indigo-400" />
                  </div>
                  {selectedFile ? (
                    <div>
                      <span className="text-sm font-bold text-emerald-400 block">
                        ✓ {selectedFile.name}
                      </span>
                      <span className="text-xs text-slate-400 mt-1 block">
                        {(selectedFile.size / (1024 * 1024)).toFixed(1)} МБ • Нажмите, чтобы выбрать другой
                      </span>
                    </div>
                  ) : (
                    <div>
                      <span className="text-sm font-semibold text-white block">
                        Перетащите файл сюда или нажмите для выбора
                      </span>
                      <span className="text-xs text-slate-400 mt-1 block">
                        MP3, WAV, M4A, MP4 или MOV до 500 МБ
                      </span>
                    </div>
                  )}
                </label>
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={youtubeUrl}
                  onChange={(e) => {
                    setYoutubeUrl(e.target.value);
                    if (!title && e.target.value) {
                      setTitle('YouTube подкаст / созвон');
                    }
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500"
                />
                <p className="text-[11px] text-slate-500">
                  Аудиодорожка будет автоматически извлечена для мультимодальной обработки
                </p>
              </div>
            )}
          </div>

          {/* Title & Estimated Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Название проекта / созвона:
              </label>
              <input
                type="text"
                placeholder="например, Эпизод 15: Разбор B2B-продаж"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Хронометраж:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={240}
                  value={estimatedDurationMin}
                  onChange={(e) => setEstimatedDurationMin(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm focus:outline-none focus:border-indigo-500"
                />
                <span className="text-xs text-slate-400">мин</span>
              </div>
            </div>
          </div>

          {/* Language & Tone of Voice */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-indigo-400" /> Язык аудио:
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="ru">Русский</option>
                <option value="en">English</option>
                <option value="auto">Автоопределение</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-emerald-400" /> Tone of Voice (Стиль автора):
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as ToneOfVoice)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="b2b_expert">B2B-эксперт / Аналитик (Факты, глубина)</option>
                <option value="provocative_founder">Провокационный фаундер (Высокий CTR)</option>
                <option value="storyteller">Storyteller (Личный опыт, факапы)</option>
                <option value="punchy_viral">Punchy Viral (Коротко, динамично)</option>
              </select>
            </div>
          </div>

          {/* Formats Checklist */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300">
                Выходные форматы публикаций ({selectedFormats.length} выбрано):
              </label>
              <button
                type="button"
                onClick={toggleAllFormats}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                {selectedFormats.length === ALL_FORMAT_KEYS.length ? 'Снять выбор' : 'Выбрать все (15)'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 bg-slate-950 rounded-2xl border border-slate-800">
              {ALL_FORMAT_KEYS.map((fmtKey) => {
                const isSelected = selectedFormats.includes(fmtKey);
                const meta = FORMAT_DEFINITIONS[fmtKey];
                return (
                  <button
                    type="button"
                    key={fmtKey}
                    onClick={() => toggleFormat(fmtKey)}
                    className={`flex items-center gap-2 p-2 rounded-xl text-left text-xs transition ${
                      isSelected
                        ? 'bg-indigo-600/20 text-white border border-indigo-500/40'
                        : 'text-slate-400 hover:bg-slate-900 border border-transparent'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center border ${
                        isSelected
                          ? 'bg-indigo-600 border-indigo-500 text-white'
                          : 'border-slate-700 bg-slate-900'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className="truncate">{meta?.title || fmtKey}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Credit Quota Meter Notice */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300">
                Будет списано: <strong className="text-white font-mono">{estimatedDurationMin} мин</strong> из вашего баланса
              </span>
            </div>
            <div className="text-slate-400">
              Остаток: <span className="font-mono font-bold text-indigo-400">{minutesLeft} мин</span>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !hasEnoughMinutes || !title.trim()}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-500 hover:from-indigo-500 hover:to-emerald-400 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              <span>{isSubmitting ? 'Обработка Gemini 2.0...' : 'Запустить комбайн'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

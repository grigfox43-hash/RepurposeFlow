'use client';

import React, { useState } from 'react';
import {
  X,
  UploadCloud,
  Video,
  FileAudio,
  Sparkles,
  Zap,
  Globe,
  Sliders,
  Check
} from 'lucide-react';
import { FormatType, ToneOfVoice, MediaJob, UserProfile } from '@/types';
import { FORMAT_DEFINITIONS } from '@/lib/gemini';
import { useLanguage } from '@/context/LanguageContext';

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
  const { t } = useLanguage();
  const [sourceType, setSourceType] = useState<'file' | 'youtube'>('file');
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

      const durationSeconds = estimatedDurationMin * 60;
      const jobRes = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          workspaceId: activeWorkspaceId,
          title: title.trim(),
          sourceType: sourceType === 'file' ? 'file_upload' : 'youtube',
          fileName: selectedFile?.name || (sourceType === 'youtube' ? youtubeUrl : 'Uploaded Media'),
          fileUrl,
          durationSeconds,
          language,
          tone,
          formats: selectedFormats,
          apiKey: typeof window !== 'undefined' ? localStorage.getItem('custom_gemini_api_key') || undefined : undefined
        })
      });

      const jobData = await jobRes.json();

      if (!jobRes.ok || !jobData.job) {
        throw new Error(jobData.error || 'Failed to process media');
      }

      onJobStarted(jobData.job);
      onClose();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-3xl rounded-3xl bg-[#080C14] border border-white/[0.1] shadow-2xl p-6 sm:p-8 my-8 text-left max-h-[90vh] overflow-y-auto animate-modal">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">{t.uploadModalTitle}</h2>
              <p className="text-xs text-slate-400">
                {t.uploadModalSubtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Source Tabs */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              {t.uploadSourceFile} / {t.uploadSourceUrl}
            </label>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                type="button"
                onClick={() => setSourceType('file')}
                className={`py-3 px-4 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition ${
                  sourceType === 'file'
                    ? 'bg-cyan-500/15 border-cyan-500/50 text-white'
                    : 'bg-[#030712] border-white/[0.07] text-slate-400 hover:border-white/[0.15]'
                }`}
              >
                <FileAudio className="w-4 h-4 text-cyan-400" />
                <span>{t.uploadSourceFile}</span>
              </button>
              <button
                type="button"
                onClick={() => setSourceType('youtube')}
                className={`py-3 px-4 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition ${
                  sourceType === 'youtube'
                    ? 'bg-cyan-500/15 border-cyan-500/50 text-white'
                    : 'bg-[#030712] border-white/[0.07] text-slate-400 hover:border-white/[0.15]'
                }`}
              >
                <Video className="w-4 h-4 text-red-400" />
                <span>{t.uploadSourceUrl}</span>
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
                    ? 'border-cyan-500 bg-cyan-950/20'
                    : selectedFile
                    ? 'border-emerald-500/50 bg-emerald-950/10'
                    : 'border-white/[0.08] bg-[#030712]/60 hover:border-white/[0.2]'
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
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-3">
                    <UploadCloud className="w-6 h-6 text-cyan-400" />
                  </div>
                  {selectedFile ? (
                    <div>
                      <span className="text-sm font-bold text-emerald-400 block">
                        ✓ {selectedFile.name}
                      </span>
                      <span className="text-xs text-slate-400 mt-1 block font-mono">
                        {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB
                      </span>
                    </div>
                  ) : (
                    <div>
                      <span className="text-sm font-semibold text-white block">
                        {t.uploadDragDropDefault}
                      </span>
                      <span className="text-xs text-slate-400 mt-1 block">
                        {t.uploadDragDropLimits}
                      </span>
                    </div>
                  )}
                </label>
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  type="url"
                  placeholder={t.uploadUrlPlaceholder}
                  value={youtubeUrl}
                  onChange={(e) => {
                    setYoutubeUrl(e.target.value);
                    if (!title && e.target.value) {
                      setTitle('YouTube Recording');
                    }
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-[#030712] border border-white/[0.08] text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500"
                />
                <p className="text-[11px] text-slate-500">
                  {t.uploadUrlHint}
                </p>
              </div>
            )}
          </div>

          {/* Title & Estimated Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {t.uploadProjectName}
              </label>
              <input
                type="text"
                placeholder={t.uploadProjectNamePlaceholder}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-[#030712] border border-white/[0.08] text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {t.uploadDuration}
              </label>
              <input
                type="number"
                min={1}
                max={240}
                value={estimatedDurationMin}
                onChange={(e) => setEstimatedDurationMin(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl bg-[#030712] border border-white/[0.08] text-white font-mono text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Language & Tone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-cyan-400" /> {t.uploadLanguage}
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#030712] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-cyan-500"
              >
                <option value="ru">{t.uploadLangRu}</option>
                <option value="en">{t.uploadLangEn}</option>
                <option value="auto">{t.uploadLangAuto}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-indigo-400" /> {t.uploadTone}
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as ToneOfVoice)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#030712] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-cyan-500"
              >
                <option value="b2b_expert">{t.uploadToneB2B}</option>
                <option value="provocative_founder">{t.uploadToneFounder}</option>
                <option value="storyteller">{t.uploadToneStory}</option>
                <option value="punchy_viral">{t.uploadToneViral}</option>
              </select>
            </div>
          </div>

          {/* Formats Checklist */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300">
                {t.featuresTitle} ({selectedFormats.length})
              </label>
              <button
                type="button"
                onClick={toggleAllFormats}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold"
              >
                {selectedFormats.length === ALL_FORMAT_KEYS.length
                  ? t.uploadFormatsDeselectAll
                  : t.uploadFormatsSelectAll}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 bg-[#030712] rounded-2xl border border-white/[0.07]">
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
                        ? 'bg-cyan-500/20 text-white border border-cyan-500/40'
                        : 'text-slate-400 hover:bg-white/[0.04] border border-transparent'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center border ${
                        isSelected
                          ? 'bg-cyan-500 border-cyan-400 text-black'
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

          {/* Processing notice */}
          <div className="p-3.5 rounded-2xl bg-[#030712] border border-white/[0.07] flex items-center gap-2.5 text-xs text-slate-400">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 animate-pulse" />
            <span>Пакетная генерация 15 форматов на базе мультимодального Gemini</span>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 text-xs font-semibold transition"
            >
              {t.uploadCancel}
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white text-xs font-bold shadow-lg shadow-cyan-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              <span>{isSubmitting ? t.uploadSubmitting : t.uploadSubmit}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

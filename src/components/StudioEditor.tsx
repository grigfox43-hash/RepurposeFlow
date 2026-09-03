'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Copy,
  Check,
  Download,
  Sparkles,
  FileText,
  ArrowLeft,
  Search,
  BookOpen,
  Wand2,
  RefreshCw,
  FileSpreadsheet
} from 'lucide-react';
import { MediaJob } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

interface StudioEditorProps {
  job: MediaJob;
  onBackToDashboard: () => void;
  onUpdateJob: (updatedJob: MediaJob) => void;
}

export const StudioEditor: React.FC<StudioEditorProps> = ({
  job,
  onBackToDashboard,
  onUpdateJob
}) => {
  const { t } = useLanguage();
  const [selectedItemId, setSelectedItemId] = useState<string>(
    job.contentItems[0]?.id || ''
  );
  const [activeViewMode, setActiveViewMode] = useState<'content' | 'transcript'>('content');
  const [searchFilter, setSearchFilter] = useState('');
  const [transcriptSearch, setTranscriptSearch] = useState('');
  const [copiedState, setCopiedState] = useState<string | null>(null);
  const [isAiRefining, setIsAiRefining] = useState(false);
  const [customAiPrompt, setCustomAiPrompt] = useState('');
  const [showAiInput, setShowAiInput] = useState(false);

  const selectedItem = job.contentItems.find((item) => item.id === selectedItemId) || job.contentItems[0];

  const handleContentChange = async (newText: string) => {
    if (!selectedItem) return;
    const updatedItems = job.contentItems.map((item) =>
      item.id === selectedItem.id
        ? {
            ...item,
            content: newText,
            wordCount: newText.split(/\s+/).filter(Boolean).length
          }
        : item
    );

    const updatedJob: MediaJob = {
      ...job,
      contentItems: updatedItems
    };

    onUpdateJob(updatedJob);

    // Save to real persistent database
    try {
      await fetch(`/api/db/jobs/${job.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentItems: updatedItems })
      });
    } catch (err) {
      console.warn('Failed to sync content edit to database:', err);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedState(type);
    confetti({
      particleCount: 25,
      spread: 45,
      origin: { y: 0.7 }
    });
    setTimeout(() => setCopiedState(null), 2000);
  };

  const downloadFile = (format: 'txt' | 'md') => {
    if (!selectedItem) return;
    const blob = new Blob([selectedItem.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedItem.platform}_${selectedItem.formatType}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToNotionFormat = () => {
    if (!selectedItem) return;
    const notionMarkdown = `# ${selectedItem.title}\n\n*Platform: ${selectedItem.platform}*\n\n---\n\n${selectedItem.content}`;
    navigator.clipboard.writeText(notionMarkdown);
    setCopiedState('notion');
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
    setTimeout(() => setCopiedState(null), 2000);
  };

  const exportToGoogleDocsFormat = () => {
    if (!selectedItem) return;
    navigator.clipboard.writeText(selectedItem.content);
    setCopiedState('gdocs');
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
    setTimeout(() => setCopiedState(null), 2000);
  };

  // AI Quick Refine / Regenerate hook
  const handleAiRefine = async (instruction: string) => {
    if (!selectedItem || isAiRefining) return;
    setIsAiRefining(true);

    try {
      const res = await fetch('/api/ai/regenerate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formatType: selectedItem.formatType,
          currentText: selectedItem.content,
          instruction,
          platform: selectedItem.platform,
          apiKey: typeof window !== 'undefined' ? localStorage.getItem('custom_gemini_api_key') || undefined : undefined
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to refine text');
      }

      if (data.result) {
        await handleContentChange(data.result);
        setShowAiInput(false);
        setCustomAiPrompt('');
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 }
        });
      }
    } catch (err: any) {
      alert(`AI Refine Error: ${err.message}`);
    } finally {
      setIsAiRefining(false);
    }
  };

  const filteredItems = job.contentItems.filter((item) =>
    item.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
    item.platform.toLowerCase().includes(searchFilter.toLowerCase()) ||
    item.formatType.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Studio Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div className="flex items-center gap-4">
          <button
            onClick={onBackToDashboard}
            className="p-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white transition"
            title={t.studioBack}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
                {t.dashStatusCompleted}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {job.durationFormatted || '30:00'} • {job.contentItems.length} {t.featuresTitle.toLowerCase()}
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-white mt-1 max-w-xl truncate font-heading">
              {job.title}
            </h1>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-2">
          <div className="inline-flex p-1 rounded-xl bg-[#12121C] border border-white/[0.08]">
            <button
              onClick={() => setActiveViewMode('content')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                activeViewMode === 'content'
                  ? 'bg-gradient-to-r from-[#4C6EF5] to-[#9B5DE5] text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.studioViewPosts} ({job.contentItems.length})</span>
            </button>
            <button
              onClick={() => setActiveViewMode('transcript')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                activeViewMode === 'transcript'
                  ? 'bg-gradient-to-r from-[#4C6EF5] to-[#9B5DE5] text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{t.studioViewTranscript}</span>
            </button>
          </div>
        </div>
      </div>

      {activeViewMode === 'content' ? (
        /* Split View */
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Formats Tree */}
          <div className="lg:col-span-4 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder={t.studioSearchFormats}
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#12121C] border border-white/[0.08] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5 max-h-[calc(100vh-250px)] overflow-y-auto pr-1">
              {filteredItems.map((item) => {
                const isSelected = item.id === selectedItem?.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedItemId(item.id)}
                    className={`w-full p-3.5 rounded-2xl text-left border transition-all ${
                      isSelected
                        ? 'bg-purple-950/30 border-purple-500/70 shadow-lg shadow-purple-500/10'
                        : 'bg-[#12121C]/70 border-white/[0.06] hover:bg-[#161622] hover:border-white/[0.15]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-white/[0.06] text-slate-300">
                        {item.platform}
                      </span>
                      {item.badge && (
                        <span className="text-[10px] text-purple-300 font-medium">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <div className={`text-xs font-bold truncate font-heading ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                      {item.title}
                    </div>
                    <div className="text-[11px] text-[#9A9AB0] mt-1 line-clamp-2">
                      {item.content.replace(/[#*`_]/g, '').slice(0, 95)}...
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                      <span>{item.wordCount || item.content.split(/\s+/).length} {t.studioWordsCount}</span>
                      <span>•</span>
                      <span>~{item.readingTimeMinutes || 2} min</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Active Item Editor */}
          <div className="lg:col-span-8 rounded-3xl bg-[#12121C]/95 border border-white/[0.08] shadow-2xl p-6 relative">
            {selectedItem ? (
              <div>
                {/* Editor Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/[0.06] gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#9B5DE5] uppercase">
                        {selectedItem.platform}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="text-xs text-slate-400">{selectedItem.badge}</span>
                    </div>
                    <h2 className="text-lg font-extrabold text-white mt-0.5 font-heading">
                      {selectedItem.title}
                    </h2>
                  </div>

                  {/* Export Buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(selectedItem.content, 'copy')}
                      className="btn-primary-effect px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#4C6EF5] to-[#9B5DE5] hover:opacity-90 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-purple-500/20"
                    >
                      {copiedState === 'copy' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedState === 'copy' ? t.studioCopied : t.studioCopy}</span>
                    </button>

                    <button
                      onClick={exportToNotionFormat}
                      className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 text-xs font-medium border border-white/[0.08] transition flex items-center gap-1.5"
                      title="Export to Notion"
                    >
                      {copiedState === 'notion' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <BookOpen className="w-3.5 h-3.5 text-[#9B5DE5]" />}
                      <span>{copiedState === 'notion' ? t.studioNotionReady : t.studioNotion}</span>
                    </button>

                    <button
                      onClick={exportToGoogleDocsFormat}
                      className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 text-xs font-medium border border-white/[0.08] transition flex items-center gap-1.5"
                      title="Google Docs"
                    >
                      {copiedState === 'gdocs' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />}
                      <span>{t.studioGDocs}</span>
                    </button>

                    <button
                      onClick={() => downloadFile('md')}
                      className="p-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 border border-white/[0.08] transition"
                      title={t.studioDownloadMd}
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* AI Tuning Bar */}
                <div className="mt-4 p-2.5 rounded-2xl bg-[#0A0A12] border border-white/[0.06] flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 px-1">
                      <Sparkles className="w-3 h-3 text-[#F15BB5]" /> {t.studioAiTools}
                    </span>
                    <button
                      disabled={isAiRefining}
                      onClick={() => handleAiRefine('Сократи текст ровно в 2 раза, сохранив главные тезисы')}
                      className="px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-[11px] text-slate-300 border border-white/[0.08] transition disabled:opacity-50"
                    >
                      {t.studioAiShorten}
                    </button>
                    <button
                      disabled={isAiRefining}
                      onClick={() => handleAiRefine('Сделай хук в первой строке максимально цепляющим и дерзким')}
                      className="px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-[11px] text-slate-300 border border-white/[0.08] transition disabled:opacity-50"
                    >
                      {t.studioAiHook}
                    </button>
                    <button
                      disabled={isAiRefining}
                      onClick={() => handleAiRefine('Добавь мощный призыв к действию (CTA)')}
                      className="px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-[11px] text-slate-300 border border-white/[0.08] transition disabled:opacity-50"
                    >
                      {t.studioAiCta}
                    </button>
                  </div>

                  <button
                    onClick={() => setShowAiInput(!showAiInput)}
                    className="text-[11px] text-[#9B5DE5] hover:text-purple-300 font-semibold px-2 py-1 flex items-center gap-1"
                  >
                    <Wand2 className="w-3 h-3" /> {t.studioAiCustomBtn}
                  </button>
                </div>

                {/* Custom AI Prompt Input */}
                {showAiInput && (
                  <div className="mt-3 flex items-center gap-2 p-2 rounded-xl bg-[#0A0A12] border border-purple-500/40">
                    <input
                      type="text"
                      placeholder={t.studioAiCustomPlaceholder}
                      value={customAiPrompt}
                      onChange={(e) => setCustomAiPrompt(e.target.value)}
                      className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none px-2"
                    />
                    <button
                      onClick={() => handleAiRefine(customAiPrompt)}
                      disabled={!customAiPrompt.trim() || isAiRefining}
                      className="px-3 py-1 rounded-lg bg-gradient-to-r from-[#4C6EF5] to-[#9B5DE5] hover:opacity-90 text-white text-xs font-bold shrink-0 disabled:opacity-50"
                    >
                      {t.studioAiApply}
                    </button>
                  </div>
                )}

                {/* Textarea */}
                <div className="mt-4 relative">
                  {isAiRefining && (
                    <div className="absolute inset-0 bg-[#0A0A12]/80 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
                      <div className="flex items-center gap-2 text-[#9B5DE5] font-semibold text-xs animate-pulse">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>{t.studioAiProcessing}</span>
                      </div>
                    </div>
                  )}

                  <textarea
                    value={selectedItem.content}
                    onChange={(e) => handleContentChange(e.target.value)}
                    rows={18}
                    className="w-full p-4 rounded-2xl bg-[#0A0A12] border border-white/[0.08] font-mono text-xs sm:text-sm text-slate-200 leading-relaxed focus:outline-none focus:border-purple-500 transition-colors resize-y"
                  />
                </div>

                {/* Footer status */}
                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-3 font-mono">
                    <span>{t.studioWordsCount}: <strong className="text-white">{selectedItem.wordCount || selectedItem.content.split(/\s+/).length}</strong></span>
                    <span>{t.studioCharsCount}: <strong className="text-white">{selectedItem.content.length}</strong></span>
                  </div>
                  <div className="text-[#B4FF39] flex items-center gap-1 font-mono">
                    <Sparkles className="w-3 h-3 text-[#B4FF39]" /> {t.studioAutoSaved}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-20 text-slate-500">Select an item to view</div>
            )}
          </div>
        </div>
      ) : (
        /* Full Transcript */
        <div className="mt-6 rounded-3xl bg-[#12121C] border border-white/[0.08] p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/[0.08] gap-4">
            <div>
              <h2 className="text-lg font-bold text-white font-heading">{t.studioViewTranscript}</h2>
              <p className="text-xs text-[#9A9AB0]">Gemini verbatim transcript</p>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder={t.studioTranscriptSearch}
                value={transcriptSearch}
                onChange={(e) => setTranscriptSearch(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-xl bg-[#0A0A12] border border-white/[0.08] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>

          <div className="mt-6 space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {job.transcript?.segments
              ?.filter((seg) => seg.text.toLowerCase().includes(transcriptSearch.toLowerCase()))
              .map((seg) => (
                <div
                  key={seg.id}
                  className="p-4 rounded-2xl bg-[#0A0A12]/70 border border-white/[0.06] flex items-start gap-4 hover:border-white/[0.15] transition"
                >
                  <div className="px-2.5 py-1 rounded-lg bg-white/[0.06] text-purple-300 font-mono text-xs font-bold shrink-0">
                    {seg.start}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-300 mb-1">{seg.speaker}</div>
                    <div className="text-xs sm:text-sm text-slate-200 leading-relaxed">{seg.text}</div>
                  </div>
                </div>
              )) || (
              <div className="text-slate-400 text-xs p-4">
                {job.transcript?.fullText || 'Processing transcript...'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

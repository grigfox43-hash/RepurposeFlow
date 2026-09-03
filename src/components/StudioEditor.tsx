'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Copy,
  Check,
  Download,
  Share2,
  Sparkles,
  FileText,
  Video,
  Send,
  Mail,
  Quote,
  Layers,
  ArrowLeft,
  Search,
  ExternalLink,
  BookOpen,
  Wand2,
  RefreshCw,
  Clock,
  Flame,
  FileCode,
  FileSpreadsheet
} from 'lucide-react';
import { MediaJob, ContentItem } from '@/types';

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

  const handleContentChange = (newText: string) => {
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
    onUpdateJob({ ...job, contentItems: updatedItems });
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedState(label);
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
      setTimeout(() => setCopiedState(null), 2500);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const exportToNotionFormat = () => {
    if (!selectedItem) return;
    const notionMarkdown = `# ${selectedItem.title}\n\n*Сгенерировано в RepurposeFlow (Gemini 2.0)*\n\n${selectedItem.content}`;
    copyToClipboard(notionMarkdown, 'notion');
  };

  const exportToGoogleDocsFormat = () => {
    if (!selectedItem) return;
    copyToClipboard(selectedItem.content, 'gdocs');
  };

  const downloadFile = (format: 'md' | 'txt') => {
    if (!selectedItem) return;
    const blob = new Blob([selectedItem.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedItem.formatType}_${Date.now()}.${format}`;
    link.click();
    URL.revokeObjectURL(url);
    confetti({ particleCount: 30, spread: 50 });
  };

  const handleAiRefine = async (instruction: string) => {
    if (!selectedItem) return;
    setIsAiRefining(true);

    try {
      const res = await fetch('/api/ai/regenerate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalContent: selectedItem.content,
          instruction,
          tone: job.tone
        })
      });
      const data = await res.json();
      if (data.success && data.updatedContent) {
        handleContentChange(data.updatedContent);
        confetti({ particleCount: 50, spread: 70 });
      }
    } catch (err) {
      alert('Ошибка перегенерации');
    } finally {
      setIsAiRefining(false);
      setShowAiInput(false);
      setCustomAiPrompt('');
    }
  };

  const filteredItems = job.contentItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.platform.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Breadcrumbs and Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToDashboard}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition"
            title="Назад к списку проектов"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800/40 font-semibold uppercase">
                Завершено
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {job.durationFormatted || '30:00'} • {job.contentItems.length} форматов
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-white mt-1 max-w-xl truncate">
              {job.title}
            </h1>
          </div>
        </div>

        {/* View mode toggle: Content items vs Full Transcript */}
        <div className="flex items-center gap-2">
          <div className="inline-flex p-1 rounded-xl bg-slate-900 border border-slate-800">
            <button
              onClick={() => setActiveViewMode('content')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                activeViewMode === 'content'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span>Публикации ({job.contentItems.length})</span>
            </button>
            <button
              onClick={() => setActiveViewMode('transcript')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                activeViewMode === 'transcript'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Транскрипт с таймкодами</span>
            </button>
          </div>
        </div>
      </div>

      {activeViewMode === 'content' ? (
        /* Split View: Left List, Right Editor */
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Formats Tree */}
          <div className="lg:col-span-4 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Поиск по форматам..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5 max-h-[calc(100vh-250px)] overflow-y-auto pr-1">
              {filteredItems.map((item) => {
                const isSelected = item.id === selectedItem?.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedItemId(item.id)}
                    className={`w-full p-3 rounded-2xl text-left border transition-all ${
                      isSelected
                        ? 'bg-indigo-950/40 border-indigo-500/70 shadow-lg shadow-indigo-600/10'
                        : 'bg-slate-900/50 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {item.platform}
                      </span>
                      {item.badge && (
                        <span className="text-[10px] text-indigo-300 font-medium">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <div className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                      {item.title}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                      {item.content.replace(/[#*`_]/g, '').slice(0, 100)}...
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                      <span>{item.wordCount || item.content.split(/\s+/).length} слов</span>
                      <span>•</span>
                      <span>~{item.readingTimeMinutes || 2} мин чтения</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Active Item Editor & Export Hub */}
          <div className="lg:col-span-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl p-6 relative">
            {selectedItem ? (
              <div>
                {/* Editor Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-indigo-400 uppercase">
                        {selectedItem.platform}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="text-xs text-slate-400">{selectedItem.badge}</span>
                    </div>
                    <h2 className="text-lg font-extrabold text-white mt-0.5">
                      {selectedItem.title}
                    </h2>
                  </div>

                  {/* Export Buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(selectedItem.content, 'copy')}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-md"
                    >
                      {copiedState === 'copy' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedState === 'copy' ? 'Скопировано!' : 'Копировать'}</span>
                    </button>

                    <button
                      onClick={exportToNotionFormat}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition flex items-center gap-1.5"
                      title="Скопировать для Notion"
                    >
                      {copiedState === 'notion' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <BookOpen className="w-3.5 h-3.5 text-indigo-400" />}
                      <span>{copiedState === 'notion' ? 'Готово для Notion!' : 'В Notion'}</span>
                    </button>

                    <button
                      onClick={exportToGoogleDocsFormat}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition flex items-center gap-1.5"
                      title="Скопировать в буфер для Google Docs"
                    >
                      {copiedState === 'gdocs' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />}
                      <span>Google Docs</span>
                    </button>

                    <button
                      onClick={() => downloadFile('md')}
                      className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
                      title="Скачать .md файл"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* AI Tuning Quick Bar */}
                <div className="mt-4 p-2.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 px-1">
                      <Sparkles className="w-3 h-3 text-emerald-400" /> Gemini Редактор:
                    </span>
                    <button
                      disabled={isAiRefining}
                      onClick={() => handleAiRefine('Сократи текст ровно в 2 раза, сохранив самые сильные тезисы')}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-[11px] text-slate-300 border border-slate-800 transition disabled:opacity-50"
                    >
                      ✂️ Сократить в 2 раза
                    </button>
                    <button
                      disabled={isAiRefining}
                      onClick={() => handleAiRefine('Сделай хук в первой строке максимально провокационным и дерзким')}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-[11px] text-slate-300 border border-slate-800 transition disabled:opacity-50"
                    >
                      🔥 Усилить хук
                    </button>
                    <button
                      disabled={isAiRefining}
                      onClick={() => handleAiRefine('Добавь мощный призыв к действию (CTA) с вопросом для комментариев')}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-[11px] text-slate-300 border border-slate-800 transition disabled:opacity-50"
                    >
                      🎯 Добавить CTA
                    </button>
                  </div>

                  <button
                    onClick={() => setShowAiInput(!showAiInput)}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold px-2 py-1 flex items-center gap-1"
                  >
                    <Wand2 className="w-3 h-3" /> Свой промпт
                  </button>
                </div>

                {/* Custom AI prompt input */}
                {showAiInput && (
                  <div className="mt-3 flex items-center gap-2 p-2 rounded-xl bg-slate-950 border border-indigo-500/40">
                    <input
                      type="text"
                      placeholder="Например: Перепиши для аудитории стартап-фаундеров..."
                      value={customAiPrompt}
                      onChange={(e) => setCustomAiPrompt(e.target.value)}
                      className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none px-2"
                    />
                    <button
                      onClick={() => handleAiRefine(customAiPrompt)}
                      disabled={!customAiPrompt.trim() || isAiRefining}
                      className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shrink-0 disabled:opacity-50"
                    >
                      Применить
                    </button>
                  </div>
                )}

                {/* Live Editable Textarea */}
                <div className="mt-4 relative">
                  {isAiRefining && (
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
                      <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs animate-pulse">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Google Gemini 2.0 полирует текст...</span>
                      </div>
                    </div>
                  )}

                  <textarea
                    value={selectedItem.content}
                    onChange={(e) => handleContentChange(e.target.value)}
                    rows={18}
                    className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs sm:text-sm text-slate-200 leading-relaxed focus:outline-none focus:border-indigo-500 resize-y"
                  />
                </div>

                {/* Footer status */}
                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-3">
                    <span>Слов: <strong className="text-white font-mono">{selectedItem.wordCount || selectedItem.content.split(/\s+/).length}</strong></span>
                    <span>Символов: <strong className="text-white font-mono">{selectedItem.content.length}</strong></span>
                  </div>
                  <div className="text-slate-500 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-400" /> Автосохранение включено
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-20 text-slate-500">Выберите публикацию для просмотра</div>
            )}
          </div>
        </div>
      ) : (
        /* Full Audio Transcript Viewer */
        <div className="mt-6 rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">Полный транскрипт записи</h2>
              <p className="text-xs text-slate-400">
                Распознано с таймкодами спикеров и сегментацией смыслов
              </p>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Поиск по транскрипту..."
                value={transcriptSearch}
                onChange={(e) => setTranscriptSearch(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="mt-6 space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {job.transcript?.segments
              ?.filter((seg) => seg.text.toLowerCase().includes(transcriptSearch.toLowerCase()))
              .map((seg) => (
                <div
                  key={seg.id}
                  className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-4 hover:border-slate-700 transition"
                >
                  <div className="px-2.5 py-1 rounded-lg bg-slate-800 text-indigo-300 font-mono text-xs font-bold shrink-0">
                    {seg.start}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-300 mb-1">{seg.speaker}</div>
                    <div className="text-xs sm:text-sm text-slate-200 leading-relaxed">{seg.text}</div>
                  </div>
                </div>
              )) || (
              <div className="text-slate-400 text-xs p-4">
                {job.transcript?.fullText || 'Транскрипт обрабатывается...'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

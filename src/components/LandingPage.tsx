'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Play,
  Pause,
  ArrowRight,
  Check,
  Zap,
  Clock,
  DollarSign,
  TrendingUp,
  Share2,
  FileText,
  Video,
  Send,
  Mail,
  Quote,
  ChevronDown,
  Volume2,
  VolumeX,
  FileAudio,
  Sliders,
  Copy,
  Activity,
  Terminal
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { audioEngine } from '@/lib/audioEngine';
import confetti from 'canvas-confetti';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const { t, language } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [activePreviewTab, setActivePreviewTab] = useState<'linkedin' | 'vc' | 'reels' | 'telegram'>('linkedin');
  const [episodesPerMonth, setEpisodesPerMonth] = useState<number>(4);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [audioSeconds, setAudioSeconds] = useState(0);
  const [copiedPreview, setCopiedPreview] = useState(false);

  const hoursSaved = episodesPerMonth * 3.5;
  const costSaved = episodesPerMonth * 220;

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      audioEngine.stop();
    };
  }, []);

  const togglePlayAudio = () => {
    if (isPlaying) {
      audioEngine.stop();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      const sampleText =
        language === 'ru'
          ? 'Анатомия B2B-контента: от нуля до ста тысяч долларов ARR без платной рекламы. Как превратить один созвон в 15 готовых публикаций.'
          : 'B2B content engine: from 0 to 100k ARR without paid ads. How to turn one founder call into 15 social posts.';

      audioEngine.start(
        sampleText,
        language,
        (seconds) => {
          setAudioSeconds(seconds);
        },
        () => {
          setIsPlaying(false);
          setAudioSeconds(0);
        }
      );
    }
  };

  const formatAudioTime = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const copySimulatorContent = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPreview(true);
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
    setTimeout(() => setCopiedPreview(false), 1500);
  };

  const getSimulatorContent = () => {
    if (language === 'ru') {
      switch (activePreviewTab) {
        case 'linkedin':
          return `🚨 Перестаньте тратить $3,000 на копирайтеров, которые не понимают ваш B2B-продукт.

Вот как мы закрыли 14 корпоративных сделок за 90 дней, используя всего 1 экспертный разговор в неделю:

1. Записывайте каждый созвон с клиентом
Когда фаундер или техлид отвечает на возражения заказчика — это чистая экспертиза без корпоративного буллшита.

2. Правило мультипликатора (1 ➔ 15):
• 1 запись = 1 лонгрид + 3 карусели + 3 рилса + рассылка.
• Ваши клиенты не слушают 40 минут аудио. Им нужна суть за 45 секунд.

3. Результат:
Конверсия из читателя блога в квалифицированный лид выросла с 1.2% до 6.8%.

💡 Вывод: лучший контент уже лежит в ваших архивах. Хватит писать посты с чистого листа.`;
        case 'vc':
          return `# Как выжать максимум из одного разговора: инструкция по запуску контент-машины

Большинство компаний совершают фатальную ошибку: они пытаются нанять копирайтера со стороны, который ничего не смыслит в их разработке. В итоге на свет появляются безликие статьи из общих фраз.

## Инсайт недели:
Настоящий экспертный маркетинг скрыт в ваших внутренних созвонах. Каждую неделю команда проговаривает десятки часов живой экспертизы. 

Мультимодальный Gemini за 3 минуты:
1. Вычленяет главную драматургию и цифры
2. Формирует структуру: Факап ➔ Решение ➔ Прикладная методика
3. Упаковывает материал в готовый лонгрид с высоким индексом вовлечения.`;
        case 'reels':
          return `🎬 СЦЕНАРИЙ ДЛЯ REELS / TIKTOK (Хронометраж: 28 сек)

[00:00 - 00:03] ХУК В КАМЕРУ (Быстрый зум, щелчок пальцами):
«Как мы слили 250 000 рублей на подкаст, который посмотрело 150 человек?»

[00:03 - 00:15] СУТЬ:
«Мы сняли красивую студию, позвали гостя, выложили на YouTube и ждали чуда. Алгоритмы нас просто проигнорировали. Почему? Потому что длинные видео без нарезки на короткие хуки в 2026 году не смотрят.»

[00:15 - 00:24] РЕШЕНИЕ:
«Мы загрузили это аудио в RepurposeFlow на базе Gemini, получили 3 готовых 30-секундных сценария с хуками, выложили их в Reels и за неделю собрали 380 000 просмотров!»

[00:24 - 00:28] CTA:
«Попробуй прямо сейчас в нашем приложении!»`;
        case 'telegram':
          return `⚡️ **Как закрывать B2B-клиентов через экспертный контент: выжимка созвона**

3 правила, которые принесли нам 6.8% конверсии в созвон без платного трафика:

1️⃣ **Забудьте про приветствия.** Первое предложение обязано ломать стереотип.
2️⃣ **Созвоны с клиентами — золотая жила.** Там живой язык и реальные боли.
3️⃣ **1 разговор = 15 постов.** Автоматизируйте дистрибуцию через Gemini.

📊 **Статистика:** время создания контент-плана сократилось с 12 часов до 3 минут.`;
      }
    } else {
      switch (activePreviewTab) {
        case 'linkedin':
          return `🚨 Stop spending $3,000 on ghostwriters who don't understand your technical B2B product.

Here is how we closed 14 enterprise deals in 90 days using just 1 recorded founder call per week:

1. Record Every Strategic Client Call:
When your tech lead explains architectures to a customer, that is pure unvarnished expertise.

2. The Multiplier Rule (1 ➔ 15):
• 1 recording = 1 long-form teardown + 3 carousels + 3 video scripts + newsletter.
• Busy decision-makers won't listen to 45 mins. They want the essence in 45 seconds.

3. The Payoff:
Reader-to-qualified lead conversion skyrocketed from 1.2% to 6.8%.

💡 The lesson: your best content is already sitting on your hard drive. Stop writing from scratch.`;
        case 'vc':
          return `# How to Turn 1 Conversation Into an Omnichannel Content Machine

Most founders make a fatal mistake: hiring junior copywriters who produce generic fluff.

## The Core Breakthrough:
Authentic B2B marketing is locked inside your private Zoom calls. Every week, your engineers explain breakthrough solutions. 

Gemini processes that raw conversation in 3 minutes:
1. Surfaces hidden drama, metrics, and quotes
2. Formats actionable framework: Mistake ➔ Solution ➔ Step-by-Step
3. Packages ready-to-publish articles.`;
        case 'reels':
          return `🎬 VIRAL REELS SCRIPT (Runtime: 28 seconds)

[00:00 - 00:03] DIRECT HOOK (Snap zoom):
"Stop hiring copywriters until you watch this 28-second breakdown!"

[00:03 - 00:15] CORE PROBLEM:
"You spend $2,000 on an agency that writes 1 generic post a week. Meanwhile, your phone has 10 hours of customer calls with all the exact objections and answers."

[00:15 - 00:24] SOLUTION:
"Upload that call to RepurposeFlow. Gemini generates 3 short-form scripts and carousels in your exact voice."

[00:24 - 00:28] CTA:
"Try it free in our app today!"`;
        case 'telegram':
          return `⚡️ **B2B Growth Masterclass: Weekly Executive Brief**

3 counter-intuitive distribution rules from our latest deep dive:

1️⃣ **No filler introductions.** The first 3 seconds must break a misconception.
2️⃣ **Customer calls are pure gold.** Live banter beats scripted copy every single time.
3️⃣ **1 Call = 15 Social Posts.** Streamline your engine with Gemini.

📊 **Result:** Content production time slashed from 12 hours to 3 minutes.`;
      }
    }
  };

  return (
    <div className="min-h-screen text-slate-100 selection:bg-cyan-500 selection:text-black">
      {/* Dynamic Ambient Background Lights */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[1200px] h-[550px] bg-gradient-to-b from-cyan-500/20 via-indigo-500/10 to-transparent blur-3xl opacity-80" />
        <div className="absolute top-[35%] -left-32 w-[500px] h-[500px] bg-cyan-600/10 blur-[120px] rounded-full" />
        <div className="absolute top-[60%] -right-32 w-[600px] h-[600px] bg-purple-600/10 blur-[130px] rounded-full" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-14 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Telemetry Engineering Badge */}
        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#080C14]/90 border border-cyan-500/30 backdrop-blur-xl text-xs font-mono text-slate-300 mb-6 shadow-lg shadow-cyan-500/10">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
          </span>
          <span className="text-cyan-300 font-bold tracking-wider uppercase text-[11px]">
            AI Audio Engine
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" /> Gemini Core
          </span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-slate-400 font-mono text-[10px] hidden sm:inline">1M CONTEXT WINDOW</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.12]">
          {t.heroTitlePart1}{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 drop-shadow-[0_0_25px_rgba(6,182,212,0.3)]">
            {t.heroTitleGradient}
          </span>{' '}
          {t.heroTitlePart2}
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-xl text-slate-300/90 max-w-3xl mx-auto leading-relaxed font-normal">
          {t.heroSubtitle}
        </p>

        {/* Studio-Grade Mastering Flow Deck (Bespoke Hardware Console Aesthetic) */}
        <div className="my-10 max-w-4xl mx-auto rounded-3xl bg-[#080C14]/90 border border-white/[0.1] shadow-2xl p-6 relative overflow-hidden backdrop-blur-2xl group hover:border-cyan-500/40 transition-all duration-300">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-5">
            {/* Input Module */}
            <div className="flex items-center gap-3 bg-[#030712] px-4 py-3.5 rounded-2xl border border-white/[0.08] w-full lg:w-auto text-left shadow-inner">
              <div className="w-11 h-11 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shrink-0">
                <FileAudio className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <span>Аудио / Видео</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">MP3 • WAV • MP4 • Zoom</div>
              </div>
            </div>

            {/* Central Gemini Transformer Rack with VU Pulse */}
            <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-[#0B0F19] to-indigo-950/60 border border-cyan-500/40 text-xs shadow-lg shadow-cyan-500/10">
              <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
              <div className="text-left">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <span className="text-cyan-300">Gemini</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    MULTIMODAL
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">180 сек транскрибация</div>
              </div>
              <ArrowRight className="w-4 h-4 text-cyan-400 animate-pulse ml-1" />
            </div>

            {/* Output Channel Chips */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 w-full lg:w-auto">
              {[
                { name: 'LinkedIn', color: 'hover:border-blue-400 hover:text-blue-300' },
                { name: 'VC.ru', color: 'hover:border-cyan-400 hover:text-cyan-300' },
                { name: 'Reels', color: 'hover:border-purple-400 hover:text-purple-300' },
                { name: 'Telegram', color: 'hover:border-sky-400 hover:text-sky-300' },
                { name: 'Email', color: 'hover:border-amber-400 hover:text-amber-300' },
                { name: 'Quotes', color: 'hover:border-pink-400 hover:text-pink-300' }
              ].map((pill, idx) => (
                <span
                  key={idx}
                  className={`text-[11px] font-bold px-3 py-1.5 rounded-xl bg-white/[0.04] text-slate-300 border border-white/[0.08] transition-all duration-200 hover:scale-105 cursor-default ${pill.color}`}
                >
                  {pill.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onStart}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white font-bold text-base shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.03] active:scale-[0.97] transition-all flex items-center justify-center gap-2.5"
          >
            <Zap className="w-5 h-5 text-white" />
            <span>{t.heroCtaPrimary}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={togglePlayAudio}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-cyan-500/30 text-slate-200 font-semibold text-base transition-all hover:scale-[1.03] active:scale-[0.97] flex items-center justify-center gap-2.5"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 text-cyan-400" />
                <span>Остановить воспроизведение</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 text-cyan-400 fill-cyan-400" />
                <span>{t.heroCtaSecondary}</span>
              </>
            )}
          </button>
        </div>

        {/* Feature Checkmarks */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-cyan-400" /> {t.heroFeature1}
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-cyan-400" /> {t.heroFeature2}
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-cyan-400" /> {t.heroFeature3}
          </div>
        </div>

        {/* Interactive Simulator Rack (Mastering Console) */}
        <div
          id="demo-section"
          className="mt-16 text-left max-w-5xl mx-auto rounded-3xl bg-[#080C14]/90 border border-white/[0.1] shadow-2xl p-6 sm:p-8 backdrop-blur-2xl relative overflow-hidden group hover:border-cyan-500/40 transition-all duration-300"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 blur-3xl pointer-events-none rounded-full" />

          {/* Top Console Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-white/[0.08] gap-4 relative z-10">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> {t.demoBadge}
              </div>
              <h3 className="text-lg font-bold text-white mt-1">
                {t.demoTitle}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">{t.demoSource}</p>
            </div>

            {/* Audio Waveform Bar with REAL Playback */}
            <div className="flex items-center gap-4 bg-[#030712] px-4 py-2.5 rounded-2xl border border-white/[0.08]">
              <button
                onClick={togglePlayAudio}
                className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-lg transition hover:scale-105 active:scale-95 ${
                  isPlaying
                    ? 'bg-red-500 hover:bg-red-400 text-white shadow-red-500/25'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-cyan-500/25'
                }`}
                title={isPlaying ? 'Пауза' : 'Включить реальный звук подкаста'}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5 fill-current" />}
              </button>
              <div>
                <div className="flex items-center gap-1 h-6">
                  {[40, 65, 25, 85, 95, 45, 75, 30, 90, 60, 95, 40, 75, 55, 35, 70, 95, 50].map((h, i) => (
                    <div
                      key={i}
                      className={`w-1 rounded-full transition-all duration-300 ${
                        isPlaying ? 'bg-cyan-400 animate-pulse' : 'bg-slate-700'
                      }`}
                      style={{
                        height: isPlaying
                          ? `${Math.min(100, Math.max(25, (h + (audioSeconds * 12) % 60)))}%`
                          : `${h}%`
                      }}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                  <span className={isPlaying ? 'text-cyan-400 font-bold' : ''}>
                    {formatAudioTime(audioSeconds)}
                  </span>
                  <span>32:00</span>
                </div>
              </div>
              <div className="pl-2 border-l border-white/[0.08]">
                {isPlaying ? (
                  <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" />
                ) : (
                  <VolumeX className="w-4 h-4 text-slate-600" />
                )}
              </div>
            </div>
          </div>

          {/* Sound playback notice */}
          {isPlaying && (
            <div className="mt-3 px-3 py-1.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-300 flex items-center gap-2 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>{t.demoAudioPlaying}</span>
            </div>
          )}

          {/* Tab buttons */}
          <div className="mt-6 relative z-10">
            <div className="flex flex-wrap gap-2 border-b border-white/[0.06] pb-3">
              <button
                onClick={() => setActivePreviewTab('linkedin')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition hover:scale-105 active:scale-95 ${
                  activePreviewTab === 'linkedin'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Share2 className="w-3.5 h-3.5 text-blue-400" /> {t.demoTabLinkedIn}
              </button>
              <button
                onClick={() => setActivePreviewTab('vc')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition hover:scale-105 active:scale-95 ${
                  activePreviewTab === 'vc'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-emerald-400" /> {t.demoTabVC}
              </button>
              <button
                onClick={() => setActivePreviewTab('reels')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition hover:scale-105 active:scale-95 ${
                  activePreviewTab === 'reels'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Video className="w-3.5 h-3.5 text-purple-400" /> {t.demoTabReels}
              </button>
              <button
                onClick={() => setActivePreviewTab('telegram')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition hover:scale-105 active:scale-95 ${
                  activePreviewTab === 'telegram'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Send className="w-3.5 h-3.5 text-sky-400" /> {t.demoTabTelegram}
              </button>
            </div>

            {/* Live Preview Text Box */}
            <div className="relative mt-4">
              <div className="p-5 rounded-2xl bg-[#030712]/95 border border-white/[0.06] font-sans text-sm text-slate-300 leading-relaxed max-h-[300px] overflow-y-auto whitespace-pre-line select-text">
                {getSimulatorContent()}
              </div>

              {/* Quick Copy Button */}
              <button
                onClick={() => copySimulatorContent(getSimulatorContent())}
                className="absolute top-3 right-3 px-2.5 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-[11px] font-semibold text-slate-300 hover:text-white transition flex items-center gap-1.5 active:scale-95"
                title="Копировать текст"
              >
                {copiedPreview ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Скопировано!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-cyan-400" />
                    <span>Копировать</span>
                  </>
                )}
              </button>
            </div>

            {/* Bottom action */}
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                ✨ {t.demoEditorPrompt}
              </span>
              <button
                onClick={onStart}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
              >
                <span>{t.demoOpenInStudio}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 15 Channels Showcase (Audio Hardware Channel Strip Style) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.08]">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-[11px] font-mono font-bold text-cyan-300 uppercase tracking-widest mb-3">
            [ MULTI-CHANNEL DISTRIBUTION RACK ]
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            {t.featuresTitle}
          </h2>
          <p className="mt-4 text-slate-400 text-base">
            {t.featuresSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              track: 'CH 01 // B2B FEED',
              icon: Share2,
              title: t.featureLinkedInTitle,
              desc: t.featureLinkedInDesc,
              tag: 'LinkedIn',
              color: 'text-blue-400',
              border: 'group-hover:border-blue-500/40'
            },
            {
              track: 'CH 02 // LONG-FORM',
              icon: FileText,
              title: t.featureVCTitle,
              desc: t.featureVCDesc,
              tag: 'VC.ru / Habr',
              color: 'text-cyan-400',
              border: 'group-hover:border-cyan-500/40'
            },
            {
              track: 'CH 03 // VIRAL VIDEO',
              icon: Video,
              title: t.featureReelsTitle,
              desc: t.featureReelsDesc,
              tag: 'Reels / Shorts',
              color: 'text-purple-400',
              border: 'group-hover:border-purple-500/40'
            },
            {
              track: 'CH 04 // COMMUNITY',
              icon: Send,
              title: t.featureTelegramTitle,
              desc: t.featureTelegramDesc,
              tag: 'Telegram',
              color: 'text-sky-400',
              border: 'group-hover:border-sky-500/40'
            },
            {
              track: 'CH 05 // RETENTION',
              icon: Mail,
              title: t.featureEmailTitle,
              desc: t.featureEmailDesc,
              tag: 'Email Newsletter',
              color: 'text-amber-400',
              border: 'group-hover:border-amber-500/40'
            },
            {
              track: 'CH 06 // KEYNOTES',
              icon: Quote,
              title: t.featureQuotesTitle,
              desc: t.featureQuotesDesc,
              tag: 'Quotes & Cards',
              color: 'text-pink-400',
              border: 'group-hover:border-pink-500/40'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-3xl bg-[#080C14]/80 border border-white/[0.08] ${item.border} hover:bg-[#0B0F19] hover:-translate-y-1.5 transition-all duration-300 group cursor-default shadow-xl shadow-black/50 relative overflow-hidden`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center group-hover:scale-110 group-hover:border-cyan-500/40 transition-all duration-300">
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-mono text-slate-500 font-semibold">{item.track}</div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/[0.05] text-slate-300 mt-1 inline-block">
                    {item.tag}
                  </span>
                </div>
              </div>
              <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                {item.title}
              </h4>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed font-normal">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ROI Calculator Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-b from-[#0B0F19] to-[#030712] border border-white/[0.08] p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
              [ {t.calcBadge} ]
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-2">
              {t.calcTitle}
            </h2>
          </div>

          <div className="mt-10 max-w-xl mx-auto">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-slate-300">
                {t.calcSliderLabel}
              </span>
              <span className="text-xl font-bold text-cyan-400 font-mono">
                {episodesPerMonth}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={12}
              value={episodesPerMonth}
              onChange={(e) => setEpisodesPerMonth(Number(e.target.value))}
              className="w-full h-2 bg-white/[0.1] rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>1</span>
              <span>6</span>
              <span>12</span>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="p-5 rounded-2xl bg-[#030712] border border-white/[0.06] hover:border-cyan-500/30 transition-all hover:-translate-y-1">
              <div className="flex items-center justify-center gap-1.5 text-slate-400 text-xs mb-1">
                <Clock className="w-4 h-4 text-cyan-400" /> {t.calcHoursSaved}
              </div>
              <div className="text-3xl font-extrabold text-white font-mono">{hoursSaved} ч</div>
              <div className="text-[11px] text-slate-500 mt-1">{t.calcHoursSub}</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#030712] border border-white/[0.06] hover:border-emerald-500/30 transition-all hover:-translate-y-1">
              <div className="flex items-center justify-center gap-1.5 text-slate-400 text-xs mb-1">
                <DollarSign className="w-4 h-4 text-emerald-400" /> {t.calcCostSaved}
              </div>
              <div className="text-3xl font-extrabold text-emerald-400 font-mono">
                ${costSaved}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">{t.calcCostSub}</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#030712] border border-white/[0.06] hover:border-purple-500/30 transition-all hover:-translate-y-1">
              <div className="flex items-center justify-center gap-1.5 text-slate-400 text-xs mb-1">
                <TrendingUp className="w-4 h-4 text-purple-400" /> {t.calcReachGrowth}
              </div>
              <div className="text-3xl font-extrabold text-purple-400 font-mono">+380%</div>
              <div className="text-[11px] text-slate-500 mt-1">{t.calcReachSub}</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-white/[0.06]">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-white">{t.faqTitle}</h2>
          <p className="text-sm text-slate-400 mt-2">{t.faqSubtitle}</p>
        </div>

        <div className="space-y-4">
          {[
            { q: t.faq1Q, a: t.faq1A },
            { q: t.faq2Q, a: t.faq2A },
            { q: t.faq3Q, a: t.faq3A },
            { q: t.faq4Q, a: t.faq4A }
          ].map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-[#080C14] border border-white/[0.06] hover:border-white/[0.15] transition-all overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full px-6 py-4.5 text-left flex items-center justify-between gap-4 focus:outline-none transition-colors"
              >
                <span className="text-sm font-semibold text-white">{item.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${
                    openFaq === idx ? 'rotate-180 text-cyan-400' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-5 text-xs sm:text-sm text-slate-300/90 leading-relaxed border-t border-white/[0.04] pt-3 animate-fade-in">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] bg-[#030712]/90 py-12 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-bold text-white">
            {t.footerTitle}
          </h3>
          <p className="mt-2 text-sm text-slate-400">
            {t.footerSubtitle}
          </p>
          <div className="mt-6 flex justify-center">
            <button
              onClick={onStart}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-500 text-white font-bold text-sm shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 active:scale-95 transition-all"
            >
              {t.footerCta}
            </button>
          </div>
          <div className="mt-12 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>© {new Date().getFullYear()} {t.footerRights}</div>
            <div className="flex items-center gap-3">
              <span>{t.footerTech}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

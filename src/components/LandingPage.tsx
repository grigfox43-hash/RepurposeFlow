'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Play,
  Pause,
  ArrowRight,
  Check,
  Zap,
  TrendingUp,
  Clock,
  DollarSign,
  Share2,
  FileText,
  Video,
  Send,
  Mail,
  Quote,
  ChevronDown,
  Layers,
  Flame,
  Bot
} from 'lucide-react';
import { PlanDetails } from '@/types';

interface LandingPageProps {
  onStart: () => void;
  onSelectPlan: (planId: 'starter' | 'pro' | 'agency') => void;
}

export const PLANS: PlanDetails[] = [
  {
    id: 'starter',
    name: 'Starter',
    priceMonthly: 29,
    priceAnnual: 23,
    minutesPerMonth: 120,
    description: 'Идеально для индивидуальных экспертов и авторов одного подкаста',
    features: [
      '120 минут аудио/видео в месяц (~4-6 эпизодов)',
      'Все 15 форматов публикаций',
      'Мультимодальный анализ Google Gemini 2.0',
      'Копирование в буфер в 1 клик',
      'Скачивание Markdown и TXT',
      'Базовая поддержка'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    popular: true,
    priceMonthly: 79,
    priceAnnual: 63,
    minutesPerMonth: 360,
    description: 'Для активных фаундеров, спикеров и растущих контент-команд',
    features: [
      '360 минут аудио/видео в месяц (~12-18 эпизодов)',
      'Все 15 форматов публикаций',
      'Автоэкспорт в Notion & Google Docs',
      'Кастомизация Tone of Voice под автора',
      'AI-редактор: сокращение, хуки, CTA в 1 клик',
      'Приоритетная очередь генерации Gemini 2.0 Flash',
      'Экспорт полного Whisper/Gemini транскрипта'
    ]
  },
  {
    id: 'agency',
    name: 'Agency',
    priceMonthly: 199,
    priceAnnual: 159,
    minutesPerMonth: 1200,
    description: 'Для маркетинговых агентств и продюсеров с пулом клиентов',
    features: [
      '1200 минут в месяц (~40-60 эпизодов)',
      'Несколько независимых воркспейсов под клиентов',
      'Кастомные промпты и гайдлайны брендов',
      'Интеграция с n8n Webhooks & API доступ',
      'Командный доступ (до 5 участников)',
      'Персональный менеджер и SLA 99.9%'
    ]
  }
];

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onSelectPlan }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activePreviewTab, setActivePreviewTab] = useState<'linkedin' | 'vc' | 'reels' | 'telegram'>('linkedin');
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [episodesPerMonth, setEpisodesPerMonth] = useState<number>(4);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // ROI Calculator derived values
  const hoursPerMonth = episodesPerMonth * 3.5; // prep, edit, distribute manually
  const copywriterCostSaved = episodesPerMonth * 220; // $220 avg cost per episode package from agency

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Background radial glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-indigo-600/15 via-violet-600/10 to-transparent blur-3xl opacity-70" />
        <div className="absolute top-[35%] -left-40 w-[600px] h-[500px] bg-emerald-500/10 blur-3xl rounded-full" />
        <div className="absolute top-[60%] -right-40 w-[600px] h-[500px] bg-indigo-500/10 blur-3xl rounded-full" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-medium text-slate-300 mb-8 shadow-inner animate-in fade-in slide-in-from-bottom-3 duration-500">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white font-semibold">RepurposeFlow 2.0</span>
          <span className="text-slate-500">•</span>
          <span className="text-indigo-300 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-400" /> Мультимодальный Google Gemini
          </span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.1]">
          Превратите <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-300 to-emerald-400">1 подкаст или созвон</span> в 15 публикаций за 3 минуты
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
          Медиа-комбайн для B2B-экспертов, фаундеров, маркетологов и подкастеров. Загрузите аудио или ссылку на YouTube — ИИ уловит интонации, выделит вирусные тезисы и упакует контент во все соцсети.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onStart}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500 text-white font-bold text-base shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Zap className="w-5 h-5 text-white" />
            <span>Попробовать бесплатно (120 минут)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <a
            href="#demo-section"
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-base transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 text-indigo-400" />
            <span>Смотреть живое демо</span>
          </a>
        </div>

        {/* Quick Social Proof */}
        <div className="mt-8 flex items-center justify-center gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-400" /> Кредитная карта не требуется
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-400" /> Загрузка MP3, WAV, MP4 и YouTube
          </div>
          <div className="flex items-center gap-1.5 hidden sm:flex">
            <Check className="w-4 h-4 text-emerald-400" /> Экспорт в Notion и Google Docs
          </div>
        </div>

        {/* Interactive Live Audio & Repurposed Demo Box */}
        <div id="demo-section" className="mt-16 text-left max-w-5xl mx-auto rounded-3xl bg-slate-900/90 border border-slate-800/90 shadow-2xl p-6 sm:p-8 backdrop-blur-xl relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                <Flame className="w-4 h-4 text-emerald-400" /> Интерактивный плеер-симулятор
              </div>
              <h3 className="text-lg font-bold text-white mt-1">
                Подкаст «Анатомия B2B-контента: от 0 до $100k ARR без рекламы»
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Исходник: аудиозапись созвона (32 минуты)</p>
            </div>

            {/* Mock Audio Waveform & Player */}
            <div className="flex items-center gap-4 bg-slate-950 px-4 py-2.5 rounded-2xl border border-slate-800">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-md transition"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>
              <div>
                <div className="flex items-center gap-1 h-6">
                  {[40, 60, 25, 80, 95, 45, 70, 30, 85, 60, 90, 40, 75, 55, 35, 70, 95, 50].map((h, i) => (
                    <div
                      key={i}
                      className={`w-1 rounded-full transition-all duration-300 ${
                        isPlaying ? 'bg-indigo-400 animate-pulse' : 'bg-slate-700'
                      }`}
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                  <span>{isPlaying ? '04:15' : '00:00'}</span>
                  <span>32:00</span>
                </div>
              </div>
            </div>
          </div>

          {/* Generated Format Switcher Tabs */}
          <div className="mt-6">
            <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
              <button
                onClick={() => setActivePreviewTab('linkedin')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
                  activePreviewTab === 'linkedin'
                    ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/50'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Share2 className="w-3.5 h-3.5 text-blue-400" /> LinkedIn тред (6 слайдов)
              </button>
              <button
                onClick={() => setActivePreviewTab('vc')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
                  activePreviewTab === 'vc'
                    ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/50'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-emerald-400" /> Статья на VC.ru (4 мин)
              </button>
              <button
                onClick={() => setActivePreviewTab('reels')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
                  activePreviewTab === 'reels'
                    ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/50'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Video className="w-3.5 h-3.5 text-violet-400" /> 3 сценария Reels с хуками
              </button>
              <button
                onClick={() => setActivePreviewTab('telegram')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
                  activePreviewTab === 'telegram'
                    ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/50'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Send className="w-3.5 h-3.5 text-sky-400" /> Telegram выжимка
              </button>
            </div>

            {/* Live Preview Text Box */}
            <div className="mt-4 p-5 rounded-2xl bg-slate-950/80 border border-slate-800 font-sans text-sm text-slate-300 leading-relaxed max-h-[300px] overflow-y-auto whitespace-pre-line select-text">
              {activePreviewTab === 'linkedin' && (
                `🚨 Перестаньте тратить $3,000 на копирайтеров, которые не понимают ваш B2B-продукт.

Вот как мы закрыли 14 корпоративных сделок за 90 дней, используя всего 1 экспертный разговор в неделю:

1. Записывайте каждый созвон с клиентом
Когда фаундер или техлид отвечает на возражения заказчика — это чистая экспертиза без корпоративного буллшита.

2. Правило мультипликатора (1 ➔ 15):
• 1 запись = 1 лонгрид + 3 карусели + 3 рилса + рассылка.
• Ваши клиенты не слушают 40 минут аудио. Им нужна суть за 45 секунд.

3. Результат:
Конверсия из читателя блога в квалифицированный лид выросла с 1.2% до 6.8%.

💡 Вывод: лучший контент уже лежит в ваших архивах. Хватит писать посты с чистого листа.`
              )}

              {activePreviewTab === 'vc' && (
                `# Как выжать максимум из одного разговора: инструкция по запуску контент-машины

Большинство компаний совершают фатальную ошибку: они пытаются нанять копирайтера со стороны, который ничего не смыслит в их разработке. В итоге на свет появляются безликие статьи из общих фраз.

## Инсайт недели:
Настоящий экспертный маркетинг скрыт в ваших внутренних созвонах. Каждую неделю команда проговаривает десятки часов живой экспертизы. 

Мультимодальный Gemini 2.0 за 3 минуты:
1. Вычленяет главную драматургию и цифры
2. Формирует структуру: Факап ➔ Решение ➔ Прикладная методика
3. Упаковывает материал в готовый лонгрид для VC.ru с высоким индексом вовлечения.`
              )}

              {activePreviewTab === 'reels' && (
                `🎬 СЦЕНАРИЙ ДЛЯ REELS / TIKTOK (Хронометраж: 28 сек)

[00:00 - 00:03] ХУК В КАМЕРУ (Быстрый зум, щелчок пальцами):
«Как мы слили 250 000 рублей на подкаст, который посмотрело 150 человек?»

[00:03 - 00:15] СУТЬ:
«Мы сняли красивую студию, позвали гостя, выложили на YouTube и ждали чуда. Алгоритмы нас просто проигнорировали. Почему? Потому что длинные видео без нарезки на короткие хуки в 2026 году не смотрят.»

[00:15 - 00:24] РЕШЕНИЕ:
«Мы загрузили это аудио в RepurposeFlow, получили 3 готовых 30-секундных сценария с хуками, выложили их в Reels и за неделю собрали 380 000 просмотров!»

[00:24 - 00:28] CTA:
«Напиши "ПОТОК" в директ, пришлю бесплатный доступ к комбайну.»`
              )}

              {activePreviewTab === 'telegram' && (
                `⚡️ **Как закрывать B2B-клиентов через экспертный контент: выжимка созвона**

3 правила, которые принесли нам 6.8% конверсии в созвон без платного трафика:

1️⃣ **Забудьте про приветствия.** Первое предложение обязано ломать стереотип.
2️⃣ **Созвоны с клиентами — золотая жила.** Там живой язык и реальные боли.
3️⃣ **1 разговор = 15 постов.** Автоматизируйте дистрибуцию через Gemini 2.0.

📊 **Статистика:** время создания контент-плана сократилось с 12 часов до 3 минут.`
              )}
            </div>

            {/* Editor CTA button */}
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                ✨ Протестируйте полноценный редактор в вашей студии
              </span>
              <button
                onClick={onStart}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition flex items-center gap-1.5"
              >
                <span>Открыть в студии</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 1 to 15 Formats Showcase */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            1 запись ➔ 15 готовых единиц контента
          </h2>
          <p className="mt-4 text-slate-400 text-base">
            Каждый формат адаптирован под алгоритмы конкретной социальной сети и платформы:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Share2,
              title: 'LinkedIn: Треды & Карусели',
              desc: 'Глубокие B2B-выводы, алгоритмическая структура слайдов, высокий индекс сохранений.',
              tag: 'LinkedIn',
              color: 'text-blue-400'
            },
            {
              icon: FileText,
              title: 'VC.ru / Habr / Medium',
              desc: 'Полноценная авторская статья с подзаголовками H1-H3, таблицами, факапами и выводами.',
              tag: 'Статьи',
              color: 'text-emerald-400'
            },
            {
              icon: Video,
              title: 'Reels / Shorts / TikTok',
              desc: '3 сценария со скриптами хуков на первые 3 секунды, таймкодами и визуальными подсказками.',
              tag: 'Видео',
              color: 'text-violet-400'
            },
            {
              icon: Send,
              title: 'Telegram-каналы',
              desc: 'Панчевые посты с эмодзи-разметкой, выжимка кейса и дайджест инсайтов.',
              tag: 'Telegram',
              color: 'text-sky-400'
            },
            {
              icon: Mail,
              title: 'Email-рассылка',
              desc: '3 цепляющих темы для А/Б теста с высоким Open Rate + готовый текст письма.',
              tag: 'Email',
              color: 'text-amber-400'
            },
            {
              icon: Quote,
              title: 'Цитаты & Панчлайны',
              desc: '5 самых ярких цитат разговора для передачи дизайнеру в визуальные сторис и карточки.',
              tag: 'Графика',
              color: 'text-pink-400'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/40 hover:bg-slate-900 transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-800/80 text-slate-300">
                  {item.tag}
                </span>
              </div>
              <h4 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                {item.title}
              </h4>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive ROI Calculator */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Калькулятор окупаемости
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-2">
              Сколько часов и денег экономит RepurposeFlow?
            </h2>
          </div>

          <div className="mt-10 max-w-xl mx-auto">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-slate-300">
                Записей / подкастов / созвонов в месяц:
              </span>
              <span className="text-xl font-bold text-indigo-400 font-mono">
                {episodesPerMonth} шт.
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={12}
              value={episodesPerMonth}
              onChange={(e) => setEpisodesPerMonth(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <div className="flex justify-between text-[11px] text-slate-500 mt-1">
              <span>1 запись</span>
              <span>6 записей</span>
              <span>12 записей</span>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-center gap-1 text-slate-400 text-xs mb-1">
                <Clock className="w-4 h-4 text-indigo-400" /> Сэкономлено часов
              </div>
              <div className="text-3xl font-extrabold text-white font-mono">{hoursPerMonth} ч</div>
              <div className="text-[11px] text-slate-500 mt-1">вместо ручного набора текстов</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-center gap-1 text-slate-400 text-xs mb-1">
                <DollarSign className="w-4 h-4 text-emerald-400" /> Экономия бюджета
              </div>
              <div className="text-3xl font-extrabold text-emerald-400 font-mono">
                ${copywriterCostSaved}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">стоимость работы контент-агентства</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-center gap-1 text-slate-400 text-xs mb-1">
                <TrendingUp className="w-4 h-4 text-violet-400" /> Рост охватов
              </div>
              <div className="text-3xl font-extrabold text-violet-400 font-mono">+380%</div>
              <div className="text-[11px] text-slate-500 mt-1">за счет мультиканальности</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
            Прозрачная монетизация
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-2">
            Кредитная система по минутам
          </h2>
          <p className="mt-4 text-slate-400 text-base">
            Платите только за минуты фактического хронометража. 1 минута аудио = все 15 форматов на выходе.
          </p>

          {/* Billing Toggle */}
          <div className="mt-8 inline-flex items-center gap-3 p-1.5 rounded-2xl bg-slate-900 border border-slate-800">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                billingPeriod === 'monthly'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Ежемесячно
            </button>
            <button
              onClick={() => setBillingPeriod('annual')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                billingPeriod === 'annual'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Годовой тариф</span>
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-800/40">
                -20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {PLANS.map((plan) => {
            const price = billingPeriod === 'annual' ? plan.priceAnnual : plan.priceMonthly;
            return (
              <div
                key={plan.id}
                className={`rounded-3xl p-8 flex flex-col justify-between transition-all relative ${
                  plan.popular
                    ? 'bg-gradient-to-b from-indigo-950/70 via-slate-900 to-slate-950 border-2 border-indigo-500 shadow-2xl shadow-indigo-600/20'
                    : 'bg-slate-900/60 border border-slate-800 hover:border-slate-700'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 text-white text-[11px] font-bold uppercase tracking-wider shadow-lg">
                    Самый популярный
                  </div>
                )}

                <div>
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-extrabold text-white">{plan.name}</h3>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-indigo-300 font-semibold font-mono">
                      {plan.minutesPerMonth} мин/мес
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-400">{plan.description}</p>

                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-4xl sm:text-5xl font-extrabold text-white font-mono">
                      ${price}
                    </span>
                    <span className="text-xs text-slate-400">/ месяц</span>
                  </div>

                  <div className="mt-8 space-y-3">
                    {plan.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-800/80">
                  <button
                    onClick={() => onSelectPlan(plan.id)}
                    className={`w-full py-3.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-indigo-600 to-emerald-500 hover:from-indigo-500 hover:to-emerald-400 text-white shadow-lg shadow-indigo-600/30'
                        : 'bg-slate-800 hover:bg-slate-700 text-white'
                    }`}
                  >
                    <span>Выбрать {plan.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-slate-900">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-white">Часто задаваемые вопросы</h2>
          <p className="text-sm text-slate-400 mt-2">Всё, что нужно знать о работе RepurposeFlow</p>
        </div>

        <div className="space-y-4">
          {[
            {
              q: 'Почему вы используете Google Gemini вместо GPT-4o?',
              a: 'Google Gemini 2.0 обладает нативной мультимодальностью и огромным окном контекста (до 1-2 млн токенов). Он способен напрямую воспринимать длинные аудио и видео файлы, слышит интонации спикеров, вычленяет эмоциональные пики и не требует сложной нарезки с потерей смысла.'
            },
            {
              q: 'Какие форматы файлов поддерживаются?',
              a: 'Вы можете загружать аудиофайлы MP3, WAV, M4A, AAC, а также видео MP4 и MOV до 500 МБ. Кроме того, поддерживается прямая вставка ссылок на YouTube и Google Drive.'
            },
            {
              q: 'Как работает списание минут?',
              a: '1 минута загруженного аудио = 1 минута из вашего баланса. Если ваш подкаст длится 32 минуты, спишется 32 минуты. При этом на выходе вы получаете полный пакет из всех 15 форматов публикаций.'
            },
            {
              q: 'Как работает мульти-воркспейс на тарифе Agency?',
              a: 'Вы можете создавать отдельные изолированные пространства под каждого вашего клиента. У каждого клиента сохраняются свои кастомные настройки Tone of Voice, история задач и готовые материалы.'
            },
            {
              q: 'Можно ли редактировать полученный результат?',
              a: 'Да! Встроенная интерактивная студия позволяет прямо в браузере править Markdown-текст, использовать AI-кнопки (сократить, усилить хук, переписать) и экспортировать результат в Notion, Google Docs или буфер в один клик.'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full px-6 py-4.5 text-left flex items-center justify-between gap-4 focus:outline-none"
              >
                <span className="text-sm font-semibold text-white">{item.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    openFaq === idx ? 'rotate-180 text-indigo-400' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-bold text-white">
            Готовы автоматизировать контент-отдел?
          </h3>
          <p className="mt-3 text-sm text-slate-400">
            Загрузите свой первый подкаст и получите 15 готовых публикаций уже через 3 минуты.
          </p>
          <div className="mt-6 flex justify-center">
            <button
              onClick={onStart}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-105 transition-all"
            >
              Запустить RepurposeFlow бесплатно
            </button>
          </div>
          <div className="mt-12 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>© {new Date().getFullYear()} RepurposeFlow. Все права защищены.</div>
            <div className="flex items-center gap-4">
              <span>Google Gemini 2.0 Powered</span>
              <span>•</span>
              <span>Next.js 15 & Vercel</span>
              <span>•</span>
              <span>Cloudflare R2</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

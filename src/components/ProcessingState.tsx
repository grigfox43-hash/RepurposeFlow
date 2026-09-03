'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles, CheckCircle2, Loader2, Zap, ArrowRight, Video, Flame } from 'lucide-react';
import { MediaJob } from '@/types';

interface ProcessingStateProps {
  job: MediaJob;
  onComplete: () => void;
}

export const ProcessingState: React.FC<ProcessingStateProps> = ({ job, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { title: 'Загрузка в защищенное хранилище S3/R2', detail: 'Проверка целостности медиапотока' },
    { title: 'Анализ аудиоряда в Google Gemini 2.0', detail: 'Определение спикеров, интонаций и смысловых пиков' },
    { title: 'Извлечение драматургии и таймкодов', detail: 'Поиск противоречий, инсайтов и вирусных хуков' },
    { title: 'Параллельная генерация 15 форматов', detail: 'Адаптация под алгоритмы LinkedIn, VC.ru, Reels, Telegram' },
    { title: 'Финализация контент-пакета', detail: 'Формирование интерактивной студии и структуры экспорта' }
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStep(1), 1000);
    const timer2 = setTimeout(() => setCurrentStep(2), 2200);
    const timer3 = setTimeout(() => setCurrentStep(3), 3500);
    const timer4 = setTimeout(() => setCurrentStep(4), 4800);
    const timer5 = setTimeout(() => {
      setCurrentStep(5);
      setTimeout(onComplete, 800);
    }, 6000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, [onComplete]);

  return (
    <div className="max-w-2xl mx-auto py-16 px-4 text-center">
      <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl mb-8">
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-emerald-400 rounded-3xl blur-xl opacity-40 animate-pulse" />
        <Flame className="w-10 h-10 text-indigo-400 relative z-10 animate-bounce" />
      </div>

      <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
        Gemini 2.0 перерабатывает запись
      </h2>
      <p className="mt-2 text-sm text-slate-400 max-w-md mx-auto">
        «{job.title}» ({job.durationFormatted || '30 мин'})
      </p>

      {/* Steps checklist */}
      <div className="mt-10 space-y-4 text-left max-w-md mx-auto">
        {steps.map((step, idx) => {
          const isDone = currentStep > idx;
          const isCurrent = currentStep === idx;

          return (
            <div
              key={idx}
              className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                isDone
                  ? 'bg-slate-900/40 border-emerald-500/30 text-slate-300'
                  : isCurrent
                  ? 'bg-indigo-950/40 border-indigo-500/60 shadow-lg shadow-indigo-500/10'
                  : 'bg-slate-950/40 border-slate-900 text-slate-600'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : isCurrent ? (
                  <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
                ) : (
                  <div className="w-5 h-5 rounded-full border border-slate-800 flex items-center justify-center text-[10px] font-mono">
                    {idx + 1}
                  </div>
                )}
              </div>
              <div>
                <div
                  className={`text-xs font-semibold ${
                    isCurrent ? 'text-white' : isDone ? 'text-slate-200' : 'text-slate-500'
                  }`}
                >
                  {step.title}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">{step.detail}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10">
        <button
          onClick={onComplete}
          className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white text-xs font-semibold transition inline-flex items-center gap-2"
        >
          <span>Перейти в студию сразу</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

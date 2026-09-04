'use client';

import React, { useState, useEffect } from 'react';
import { Cookie, Shield, Check, X, Sliders, ChevronDown, ChevronUp, Lock } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { LegalTabKey } from '@/lib/legalContent';

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  decidedAt: string;
}

interface CookieBannerProps {
  onOpenLegal: (tab: LegalTabKey) => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({ onOpenLegal }) => {
  const { language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const [marketingEnabled, setMarketingEnabled] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('repurposeflow_cookie_consent');
      if (!stored) {
        // Small delay so page loads smoothly first
        const timer = setTimeout(() => setIsVisible(true), 900);
        return () => clearTimeout(timer);
      } else {
        const parsed: CookiePreferences = JSON.parse(stored);
        setAnalyticsEnabled(Boolean(parsed.analytics));
        setMarketingEnabled(Boolean(parsed.marketing));
      }
    } catch {
      setIsVisible(true);
    }
  }, []);

  // Listen for global custom event to reopen preferences anytime from footer
  useEffect(() => {
    const handleReopen = () => {
      setIsVisible(true);
      setShowPreferences(true);
    };
    window.addEventListener('repurposeflow_open_cookie_settings', handleReopen);
    return () => window.removeEventListener('repurposeflow_open_cookie_settings', handleReopen);
  }, []);

  const savePreferences = (essential: boolean, analytics: boolean, marketing: boolean) => {
    const prefs: CookiePreferences = {
      essential: true,
      analytics,
      marketing,
      decidedAt: new Date().toISOString()
    };
    try {
      localStorage.setItem('repurposeflow_cookie_consent', JSON.stringify(prefs));
    } catch (e) {
      console.warn('Failed to save cookie consent:', e);
    }
    setAnalyticsEnabled(analytics);
    setMarketingEnabled(marketing);
    setIsVisible(false);
    setShowPreferences(false);
  };

  const handleAcceptAll = () => {
    savePreferences(true, true, true);
  };

  const handleRejectNonEssential = () => {
    savePreferences(true, false, false);
  };

  const handleSaveCustom = () => {
    savePreferences(true, analyticsEnabled, marketingEnabled);
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed bottom-0 inset-x-0 z-50 p-3 sm:p-5 pointer-events-none animate-slide-up"
      role="region"
      aria-label="Cookie consent banner"
    >
      <div className="max-w-4xl mx-auto rounded-3xl bg-[#12121C]/95 border border-white/[0.12] shadow-2xl backdrop-blur-2xl p-5 sm:p-6 pointer-events-auto text-left relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-64 h-32 bg-purple-500/10 blur-2xl pointer-events-none rounded-full" />

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex items-start gap-3.5 max-w-2xl">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center shrink-0 mt-0.5">
              <Cookie className="w-5 h-5 text-[#9B5DE5]" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-white font-heading">
                  {language === 'ru' ? 'Конфиденциальность и файлы Cookie' : 'Cookie and Privacy Notice'}
                </span>
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-purple-950/70 text-purple-300 border border-purple-800/40">
                  EU GDPR • 152-ФЗ • CCPA
                </span>
              </div>
              <p className="text-xs text-slate-300/90 leading-relaxed">
                {language === 'ru' ? (
                  <>
                    Мы используем обязательные cookies для работы личного кабинета и защиты сессий. В соответствии с 152-ФЗ, GDPR и ePrivacy, аналитические файлы используются только с вашего согласия. Мы никогда не продаем ваши данные третьим лицам.
                  </>
                ) : (
                  <>
                    We deploy essential cookies for secure login and sessions. In accordance with GDPR, ePrivacy, and CCPA, optional performance cookies are activated only with your prior consent. We do not sell personal data.
                  </>
                )}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px]">
                <button
                  type="button"
                  onClick={() => onOpenLegal('cookies')}
                  className="text-[#9B5DE5] hover:text-purple-300 underline font-medium"
                >
                  {language === 'ru' ? 'Политика Cookie' : 'Cookie Policy'}
                </button>
                <span className="text-slate-600">•</span>
                <button
                  type="button"
                  onClick={() => onOpenLegal('privacy')}
                  className="text-[#9B5DE5] hover:text-purple-300 underline font-medium"
                >
                  {language === 'ru' ? 'Конфиденциальность' : 'Privacy Policy'}
                </button>
                <span className="text-slate-600">•</span>
                <button
                  type="button"
                  onClick={() => onOpenLegal('ccpa')}
                  className="text-slate-400 hover:text-slate-200 underline font-medium flex items-center gap-1"
                >
                  <Lock className="w-3 h-3 text-slate-400" />
                  <span>{language === 'ru' ? 'Не продавать данные (CCPA)' : 'Do Not Sell (CCPA)'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap md:flex-col lg:flex-row items-center gap-2 shrink-0 self-end md:self-center">
            <button
              type="button"
              onClick={() => setShowPreferences(!showPreferences)}
              className="px-3 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-xs font-semibold text-slate-300 hover:text-white transition flex items-center gap-1.5"
            >
              <Sliders className="w-3.5 h-3.5 text-[#9B5DE5]" />
              <span>{language === 'ru' ? 'Настроить' : 'Customize'}</span>
              {showPreferences ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            <button
              type="button"
              onClick={handleRejectNonEssential}
              className="px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-xs font-semibold text-slate-200 hover:text-white transition"
            >
              {language === 'ru' ? 'Только обязательные' : 'Reject Non-Essential'}
            </button>
            <button
              type="button"
              onClick={handleAcceptAll}
              className="btn-primary-effect px-4 py-2 rounded-xl bg-gradient-to-r from-[#4C6EF5] to-[#9B5DE5] hover:opacity-95 text-white font-bold text-xs shadow-md shadow-purple-500/25 transition-all"
            >
              {language === 'ru' ? 'Принять все' : 'Accept All'}
            </button>
          </div>
        </div>

        {/* Expandable Preferences Drawer */}
        {showPreferences && (
          <div className="mt-4 pt-4 border-t border-white/[0.08] space-y-3 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {/* Essential */}
              <div className="p-3 rounded-2xl bg-[#0A0A12] border border-white/[0.06] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">
                      {language === 'ru' ? 'Обязательные' : 'Strictly Necessary'}
                    </span>
                    <span className="text-[10px] font-mono text-[#B4FF39] uppercase font-bold">
                      {language === 'ru' ? 'Всегда вкл.' : 'Always On'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {language === 'ru'
                      ? 'Авторизация, защита сессий, сохранение языковых предпочтений.'
                      : 'Security, authorization tokens, preserving system preferences.'}
                  </p>
                </div>
              </div>

              {/* Analytics */}
              <div className="p-3 rounded-2xl bg-[#0A0A12] border border-white/[0.06] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">
                      {language === 'ru' ? 'Аналитические' : 'Performance Analytics'}
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={analyticsEnabled}
                        onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3.5 after:transition-all peer-checked:bg-[#9B5DE5]" />
                    </label>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {language === 'ru'
                      ? 'Анонимная статистика ошибок и скорости работы генерации.'
                      : 'Aggregated error metrics and AI transformation latency analysis.'}
                  </p>
                </div>
              </div>

              {/* Marketing */}
              <div className="p-3 rounded-2xl bg-[#0A0A12] border border-white/[0.06] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">
                      {language === 'ru' ? 'Персонализация' : 'Personalization'}
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={marketingEnabled}
                        onChange={(e) => setMarketingEnabled(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3.5 after:transition-all peer-checked:bg-[#9B5DE5]" />
                    </label>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {language === 'ru'
                      ? 'Запоминание шаблонов и авторского стиля между сессиями.'
                      : 'Remembering custom prompt recipes and workflow configurations.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={handleSaveCustom}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#4C6EF5] to-[#9B5DE5] hover:opacity-90 text-white font-bold text-xs shadow transition"
              >
                {language === 'ru' ? 'Сохранить выбор' : 'Save Preferences'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

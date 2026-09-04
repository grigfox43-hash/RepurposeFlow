'use client';

import React, { useEffect, useState } from 'react';
import {
  X,
  Shield,
  FileText,
  Cookie,
  AlertTriangle,
  Building,
  Lock,
  Printer,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { LEGAL_DOCUMENTS, LegalTabKey } from '@/lib/legalContent';

interface LegalModalProps {
  isOpen: boolean;
  activeTab: LegalTabKey;
  onClose: () => void;
  onTabChange?: (tab: LegalTabKey) => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  activeTab: initialTab,
  onClose,
  onTabChange
}) => {
  const { language } = useLanguage();
  const [currentTab, setCurrentTab] = useState<LegalTabKey>(initialTab);

  useEffect(() => {
    setCurrentTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const doc = LEGAL_DOCUMENTS[currentTab] || LEGAL_DOCUMENTS.privacy;

  const handleSelectTab = (tab: LegalTabKey) => {
    setCurrentTab(tab);
    if (onTabChange) onTabChange(tab);
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const tabs: { key: LegalTabKey; labelRu: string; labelEn: string; icon: any }[] = [
    { key: 'privacy', labelRu: 'Конфиденциальность', labelEn: 'Privacy Policy', icon: Shield },
    { key: 'terms', labelRu: 'Оферта и соглашение', labelEn: 'Terms of Service', icon: FileText },
    { key: 'cookies', labelRu: 'Файлы Cookie', labelEn: 'Cookie Policy', icon: Cookie },
    { key: 'ads_ai', labelRu: 'ИИ и Закон о рекламе', labelEn: 'AI & Ads Disclosure', icon: AlertTriangle },
    { key: 'impressum', labelRu: 'Реквизиты и контакты', labelEn: 'Legal Notice & DSA', icon: Building },
    { key: 'ccpa', labelRu: 'Не продавать данные (CCPA)', labelEn: 'Do Not Sell (CCPA)', icon: Lock }
  ];

  const content = language === 'ru' ? doc.contentRu : doc.contentEn;
  const title = language === 'ru' ? doc.titleRu : doc.titleEn;
  const badge = language === 'ru' ? doc.badgeRu : doc.badgeEn;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in cursor-pointer"
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl rounded-3xl bg-[#12121C] border border-white/[0.12] shadow-2xl p-5 sm:p-8 my-6 text-left max-h-[92vh] flex flex-col animate-modal cursor-default"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 text-[#9B5DE5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-950/60 text-purple-300 border border-purple-800/40">
                  {badge}
                </span>
                <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
                  {language === 'ru' ? `Обновлено: ${doc.lastUpdated}` : `Updated: ${doc.lastUpdated}`}
                </span>
              </div>
              <h2 id="legal-modal-title" className="text-base sm:text-xl font-bold text-white tracking-tight mt-0.5 font-heading truncate max-w-md sm:max-w-xl">
                {title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.2] transition hidden sm:flex items-center gap-1.5 text-xs"
              title="Печать документа / Print"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition"
              aria-label="Close legal modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-3 border-b border-white/[0.06] shrink-0 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = currentTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => handleSelectTab(tab.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 flex items-center gap-1.5 transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#4C6EF5] to-[#9B5DE5] text-white shadow-md shadow-purple-500/20'
                    : 'text-slate-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{language === 'ru' ? tab.labelRu : tab.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Document Content */}
        <div className="mt-4 overflow-y-auto pr-2 space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans select-text">
          {content.split('\n\n').map((block, idx) => {
            const trimmed = block.trim();
            if (!trimmed) return null;

            if (trimmed.startsWith('### ')) {
              return (
                <h3 key={idx} className="text-sm sm:text-base font-bold text-white font-heading mt-5 mb-2 flex items-center gap-2 border-b border-white/[0.06] pb-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#B4FF39] shrink-0" />
                  <span>{trimmed.replace('### ', '')}</span>
                </h3>
              );
            }

            if (trimmed.startsWith('- ')) {
              const items = trimmed.split('\n- ');
              return (
                <ul key={idx} className="space-y-1.5 pl-2">
                  {items.map((it, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#9B5DE5] mt-1.5 shrink-0" />
                      <span dangerouslySetInnerHTML={{ __html: formatInline(it.replace(/^- /, '')) }} />
                    </li>
                  ))}
                </ul>
              );
            }

            return (
              <p
                key={idx}
                className="text-slate-300/90 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: formatInline(trimmed) }}
              />
            );
          })}
        </div>

        {/* Footer info & Contact */}
        <div className="mt-5 pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400 shrink-0 font-mono">
          <div className="flex items-center gap-2">
            <span>DPO & Legal:</span>
            <a href="mailto:privacy@repurposeflow.com" className="text-[#9B5DE5] hover:underline">
              privacy@repurposeflow.com
            </a>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-slate-500">RepurposeFlow Compliance Engine</span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white font-semibold transition"
            >
              {language === 'ru' ? 'Закрыть' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function formatInline(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="text-slate-200">$1</em>')
    .replace(/`(.*?)`/g, '<code class="px-1.5 py-0.5 rounded bg-white/[0.08] text-purple-300 font-mono text-[11px]">$1</code>');
}

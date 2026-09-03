'use client';

import React, { useState } from 'react';
import { Sparkles, Layers, Settings, ChevronDown, Plus, Radio, Zap, Globe } from 'lucide-react';
import { UserProfile, Workspace } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

interface NavbarProps {
  currentView: 'landing' | 'dashboard' | 'studio';
  onNavigate: (view: 'landing' | 'dashboard' | 'studio') => void;
  user: UserProfile;
  activeWorkspace: Workspace;
  onSelectWorkspace: (wsId: string) => void;
  onOpenUpload: () => void;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  user,
  activeWorkspace,
  onSelectWorkspace,
  onOpenUpload,
  onOpenSettings
}) => {
  const { language, setLanguage, t } = useLanguage();
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const minutesLeft = Math.max(0, user.minutesTotal - user.minutesUsed);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#030712]/85 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-3 group text-left focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-500 p-[1px] shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all duration-300">
              <div className="w-full h-full bg-[#080C14] rounded-xl flex items-center justify-center">
                <Radio className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-white font-sans">
                  Repurpose<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">Flow</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-950/60 text-cyan-300 border border-cyan-800/40 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-cyan-400" /> Google Gemini
                </span>
              </div>
            </div>
          </button>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-semibold">
            <button
              onClick={() => onNavigate('landing')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                currentView === 'landing'
                  ? 'bg-white/[0.08] text-white'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              {t.navHome}
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                currentView === 'dashboard' || currentView === 'studio'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400" /> {t.navStudio}
            </button>
          </nav>
        </div>

        {/* Right side tools: Language Flags Switcher, Workspace, Quota, CTA */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Flag Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.2] transition text-xs text-slate-200"
              title="Переключить язык / Switch Language"
            >
              <span className="text-base leading-none">
                {language === 'ru' ? '🇷🇺' : '🇺🇸'}
              </span>
              <span className="font-bold text-[11px] uppercase tracking-wider">
                {language === 'ru' ? 'RU' : 'EN'}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 mt-2 w-36 rounded-2xl bg-[#0B0F19] border border-white/[0.12] shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                <button
                  onClick={() => {
                    setLanguage('ru');
                    setLangMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-left transition ${
                    language === 'ru'
                      ? 'bg-cyan-500/20 text-cyan-300'
                      : 'text-slate-300 hover:bg-white/[0.05]'
                  }`}
                >
                  <span className="text-base">🇷🇺</span>
                  <span>Русский</span>
                </button>
                <button
                  onClick={() => {
                    setLanguage('en');
                    setLangMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-left transition ${
                    language === 'en'
                      ? 'bg-cyan-500/20 text-cyan-300'
                      : 'text-slate-300 hover:bg-white/[0.05]'
                  }`}
                >
                  <span className="text-base">🇺🇸</span>
                  <span>English</span>
                </button>
              </div>
            )}
          </div>

          {/* Workspace Switcher */}
          <div className="relative hidden lg:block">
            <button
              onClick={() => setWorkspaceMenuOpen(!workspaceMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-slate-300 hover:border-white/[0.2] transition"
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-medium max-w-[130px] truncate">{activeWorkspace.name}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {workspaceMenuOpen && (
              <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-[#0B0F19] border border-white/[0.12] shadow-2xl p-2 z-50">
                <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {t.navWorkspaces}
                </div>
                <div className="space-y-1 mt-1">
                  {user.workspaces.map((ws) => (
                    <button
                      key={ws.id}
                      onClick={() => {
                        onSelectWorkspace(ws.id);
                        setWorkspaceMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs text-left transition ${
                        ws.id === activeWorkspace.id
                          ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                          : 'text-slate-300 hover:bg-white/[0.05]'
                      }`}
                    >
                      <span className="truncate">{ws.name}</span>
                      {ws.isAgencyClient && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800/40">
                          {t.navClient}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Minute meter */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-slate-300 font-mono font-semibold">{minutesLeft} мин</span>
          </div>

          {/* Settings Trigger */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.2] transition"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Primary CTA */}
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{t.navRepurposeBtn}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  Zap,
  Settings,
  User,
  Radio,
  ChevronDown,
  Layers,
  LogIn
} from 'lucide-react';
import { UserProfile, Workspace } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { FlagRU, FlagUS } from '@/components/FlagIcons';

interface NavbarProps {
  currentView: 'landing' | 'dashboard' | 'studio';
  onNavigate: (view: 'landing' | 'dashboard' | 'studio') => void;
  user: UserProfile;
  activeWorkspace: Workspace;
  onSelectWorkspace: (id: string) => void;
  onOpenUpload: () => void;
  onOpenSettings: () => void;
  onOpenCabinet: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  user,
  activeWorkspace,
  onSelectWorkspace,
  onOpenUpload,
  onOpenSettings,
  onOpenCabinet
}) => {
  const { t, language, setLanguage } = useLanguage();
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const minutesLeft = Math.max(0, user.minutesTotal - user.minutesUsed);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#0A0A12]/80 backdrop-blur-2xl transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left side: Brand Logo + Section Nav */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-3 group text-left focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#4C6EF5] via-[#9B5DE5] to-[#F15BB5] p-[1px] shadow-lg shadow-purple-500/25 group-hover:shadow-purple-500/40 transition-all duration-300">
              <div className="w-full h-full bg-[#0E0E18] rounded-xl flex items-center justify-center">
                <Radio className="w-4 h-4 text-[#9B5DE5] group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-white font-heading">
                  Repurpose<span className="text-gradient-ai">Flow</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-950/60 text-purple-300 border border-purple-800/40 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-[#F15BB5]" /> Gemini
                </span>
              </div>
            </div>
          </button>

          {/* Navigation Links with underline animation */}
          <nav className="hidden md:flex items-center gap-2 text-xs font-semibold">
            <button
              onClick={() => onNavigate('landing')}
              className={`nav-link px-3 py-1.5 rounded-xl transition-all ${
                currentView === 'landing'
                  ? 'bg-white/[0.08] text-white'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              {t.navHome}
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className={`nav-link px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                currentView === 'dashboard' || currentView === 'studio'
                  ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-[#9B5DE5]" /> {t.navStudio}
            </button>
          </nav>
        </div>

        {/* Right side tools: Language Flags Switcher, Workspace, Personal Cabinet / Login, CTA */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Flag Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-purple-500/30 hover:bg-white/[0.07] transition text-xs text-slate-200"
              title="Переключить язык / Switch Language"
            >
              {language === 'ru' ? <FlagRU className="w-5 h-3.5" /> : <FlagUS className="w-5 h-3.5" />}
              <span className="font-bold text-[11px] tracking-wider uppercase text-slate-300">
                {language === 'ru' ? 'RU' : 'EN'}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 rounded-2xl bg-[#12121C] border border-white/[0.12] shadow-2xl p-1.5 z-50 animate-fade-in">
                <button
                  onClick={() => {
                    setLanguage('ru');
                    setLangMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-left transition ${
                    language === 'ru'
                      ? 'bg-purple-500/20 text-purple-300'
                      : 'text-slate-300 hover:bg-white/[0.05]'
                  }`}
                >
                  <FlagRU className="w-5 h-3.5 shrink-0" />
                  <span>Русский</span>
                </button>
                <button
                  onClick={() => {
                    setLanguage('en');
                    setLangMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-left transition ${
                    language === 'en'
                      ? 'bg-purple-500/20 text-purple-300'
                      : 'text-slate-300 hover:bg-white/[0.05]'
                  }`}
                >
                  <FlagUS className="w-5 h-3.5 shrink-0" />
                  <span>English</span>
                </button>
              </div>
            )}
          </div>

          {/* Workspace Switcher */}
          {user.isAuthenticated && (
            <div className="relative hidden lg:block">
              <button
                onClick={() => setWorkspaceMenuOpen(!workspaceMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-slate-300 hover:border-white/[0.2] transition"
              >
                <Layers className="w-3.5 h-3.5 text-[#9B5DE5]" />
                <span className="font-medium max-w-[130px] truncate">{activeWorkspace?.name || 'Личный'}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {workspaceMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#12121C] border border-white/[0.12] shadow-2xl p-1.5 z-50 animate-fade-in">
                  <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {t.navWorkspaces}
                  </div>
                  {user.workspaces.map((ws) => (
                    <button
                      key={ws.id}
                      onClick={() => {
                        onSelectWorkspace(ws.id);
                        setWorkspaceMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left transition ${
                        ws.id === activeWorkspace?.id
                          ? 'bg-purple-500/20 text-purple-300 font-semibold'
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
              )}
            </div>
          )}

          {/* Minute meter - only if authenticated in cabinet */}
          {user.isAuthenticated && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs">
              <div className="w-2 h-2 rounded-full bg-[#9B5DE5] animate-pulse" />
              <span className="text-slate-300 font-mono font-semibold">{minutesLeft} мин</span>
            </div>
          )}

          {/* Personal Cabinet OR Login Button */}
          {user.isAuthenticated ? (
            <button
              onClick={onOpenCabinet}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-purple-500/40 hover:bg-white/[0.07] transition text-xs text-slate-200 group"
              title="Личный кабинет"
            >
              <div className="w-6 h-6 rounded-full overflow-hidden bg-purple-500/20 flex items-center justify-center shrink-0 border border-purple-500/40">
                <span className="text-[11px] font-bold text-purple-300">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
              <span className="hidden sm:inline font-medium max-w-[100px] truncate">
                {user.name || 'Профиль'}
              </span>
            </button>
          ) : (
            <button
              onClick={onOpenCabinet}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] hover:border-purple-500/40 transition text-xs font-semibold text-slate-200 hover:text-white"
            >
              <LogIn className="w-3.5 h-3.5 text-[#9B5DE5]" />
              <span>Войти</span>
            </button>
          )}

          {/* Settings Modal Button */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.2] transition"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* CTA Button: Repurpose media */}
          <button
            onClick={onOpenUpload}
            className="btn-primary-effect btn-cta-pulse flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-[#4C6EF5] via-[#9B5DE5] to-[#F15BB5] hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-purple-500/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">{t.navRepurposeBtn}</span>
            <span className="sm:hidden">+</span>
          </button>
        </div>
      </div>
    </header>
  );
};

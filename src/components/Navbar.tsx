'use client';

import React from 'react';
import { Sparkles, Zap, Layers, Settings, ChevronDown, Plus, ExternalLink, ShieldCheck, Flame } from 'lucide-react';
import { UserProfile, Workspace } from '@/types';

interface NavbarProps {
  currentView: 'landing' | 'dashboard' | 'studio';
  onNavigate: (view: 'landing' | 'dashboard' | 'studio') => void;
  user: UserProfile;
  activeWorkspace: Workspace;
  onSelectWorkspace: (wsId: string) => void;
  onOpenUpload: () => void;
  onOpenBilling: () => void;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  user,
  activeWorkspace,
  onSelectWorkspace,
  onOpenUpload,
  onOpenBilling,
  onOpenSettings
}) => {
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = React.useState(false);
  const minutesLeft = Math.max(0, user.minutesTotal - user.minutesUsed);
  const percentUsed = Math.min(100, Math.round((user.minutesUsed / user.minutesTotal) * 100));

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2.5 group text-left focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-emerald-400 p-[1px] shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all">
              <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center">
                <Flame className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white font-sans">Repurpose<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-300 to-emerald-400">Flow</span></span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-indigo-950/80 text-indigo-300 border border-indigo-800/60 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-emerald-400" /> Gemini 2.5
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">1 запись ➔ 15 постов за 3 мин</p>
            </div>
          </button>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <button
              onClick={() => onNavigate('landing')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                currentView === 'landing'
                  ? 'bg-slate-800/80 text-white font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              Главная
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                currentView === 'dashboard' || currentView === 'studio'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-indigo-400" /> Студия проектов
            </button>
          </nav>
        </div>

        {/* Right side: Workspace, Credit Bar, CTA */}
        <div className="flex items-center gap-3">
          {/* Workspace Switcher (Agency tier feature) */}
          <div className="relative hidden lg:block">
            <button
              onClick={() => setWorkspaceMenuOpen(!workspaceMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:border-slate-700 transition"
            >
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-medium max-w-[140px] truncate">{activeWorkspace.name}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {workspaceMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-2 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Рабочие пространства
                </div>
                <div className="space-y-1">
                  {user.workspaces.map((ws) => (
                    <button
                      key={ws.id}
                      onClick={() => {
                        onSelectWorkspace(ws.id);
                        setWorkspaceMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-left transition ${
                        ws.id === activeWorkspace.id
                          ? 'bg-indigo-600/20 text-indigo-300 font-semibold'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span className="truncate">{ws.name}</span>
                      {ws.isAgencyClient && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-950 text-violet-300 border border-violet-800/40">
                          Клиент
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Credit balance badge */}
          <button
            onClick={onOpenBilling}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 transition group"
            title="Остаток минут на обработку"
          >
            <div className="text-right">
              <div className="flex items-center gap-1.5 justify-end">
                <span className="text-xs font-bold text-white">{minutesLeft} мин</span>
                <span className="text-[10px] text-slate-400">/ {user.minutesTotal}</span>
              </div>
              <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-0.5">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${100 - percentUsed}%` }}
                />
              </div>
            </div>
            <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/50">
              {user.plan.toUpperCase()}
            </span>
          </button>

          {/* Settings button */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800/60 transition"
            title="Настройки API и вебхуков"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Primary Action Button: "Создать проект" */}
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 text-white font-medium text-xs sm:text-sm shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="font-semibold">Переработать</span>
          </button>
        </div>
      </div>
    </header>
  );
};

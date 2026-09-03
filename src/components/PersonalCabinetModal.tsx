'use client';

import React, { useState } from 'react';
import {
  X,
  User,
  Mail,
  Lock,
  Shield,
  FileAudio,
  Check,
  Plus,
  Layers,
  LogOut,
  Sparkles,
  ArrowRight,
  LogIn,
  UserPlus,
  Download,
  Settings2,
  Trash2,
  Sliders,
  Key
} from 'lucide-react';
import { UserProfile, Workspace, ToneOfVoice } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { createFreshUser, loginUser, registerUser, getStoredJobs } from '@/lib/store';
import confetti from 'canvas-confetti';

interface PersonalCabinetModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
  onSwitchUser: (newUser: UserProfile) => void;
  totalUserJobs: number;
}

export const PersonalCabinetModal: React.FC<PersonalCabinetModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
  onSwitchUser,
  totalUserJobs
}) => {
  const { language } = useLanguage();

  // Auth Mode: 'signin' or 'signup'
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Cabinet active tab: 'overview' | 'preferences' | 'workspaces'
  const [cabinetTab, setCabinetTab] = useState<'overview' | 'preferences' | 'workspaces'>('overview');

  // Edit profile state
  const [editName, setEditName] = useState(user.name || '');
  const [editEmail, setEditEmail] = useState(user.email || '');
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [showAddWorkspace, setShowAddWorkspace] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Preferences state
  const [defaultTone, setDefaultTone] = useState<ToneOfVoice>(user.preferences?.defaultTone || 'b2b_expert');
  const [defaultLang, setDefaultLang] = useState<'ru' | 'en' | 'auto'>(user.preferences?.defaultLanguage || 'ru');
  const [cabinetApiKey, setCabinetApiKey] = useState(
    typeof window !== 'undefined' ? localStorage.getItem('custom_gemini_api_key') || '' : ''
  );

  if (!isOpen) return null;

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (!authEmail.trim() || !authEmail.includes('@')) {
      setAuthError(language === 'ru' ? 'Введите корректный email' : 'Please enter a valid email address');
      return;
    }

    const authenticatedUser = loginUser(authEmail.trim());
    onUpdateUser(authenticatedUser);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    onClose();
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (!authName.trim()) {
      setAuthError(language === 'ru' ? 'Введите ваше имя' : 'Please enter your name');
      return;
    }
    if (!authEmail.trim() || !authEmail.includes('@')) {
      setAuthError(language === 'ru' ? 'Введите корректный email' : 'Please enter a valid email address');
      return;
    }

    const newUser = registerUser(authName.trim(), authEmail.trim());
    onUpdateUser(newUser);
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    onClose();
  };

  const handleSignOut = () => {
    const cleanUser = createFreshUser(false);
    onSwitchUser(cleanUser);
    onClose();
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      if (cabinetApiKey.trim()) {
        localStorage.setItem('custom_gemini_api_key', cabinetApiKey.trim());
      } else {
        localStorage.removeItem('custom_gemini_api_key');
      }
    }
    const updated: UserProfile = {
      ...user,
      name: editName.trim() || user.name,
      email: editEmail.trim() || user.email,
      preferences: {
        ...user.preferences,
        defaultTone,
        defaultLanguage: defaultLang
      }
    };
    onUpdateUser(updated);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 1500);
  };

  const handleAddWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkspaceName.trim()) return;
    const newWs: Workspace = {
      id: `ws-${Date.now()}`,
      name: newWorkspaceName.trim(),
      slug: newWorkspaceName.trim().toLowerCase().replace(/\s+/g, '-'),
      isAgencyClient: true,
      clientName: newWorkspaceName.trim(),
      jobsCount: 0
    };
    const updated: UserProfile = {
      ...user,
      workspaces: [...user.workspaces, newWs],
      activeWorkspaceId: newWs.id
    };
    onUpdateUser(updated);
    setNewWorkspaceName('');
    setShowAddWorkspace(false);
  };

  const handleDeleteWorkspace = (wsId: string) => {
    if (user.workspaces.length <= 1) {
      alert(language === 'ru' ? 'Нельзя удалить единственный воркспейс' : 'Cannot delete the only workspace');
      return;
    }
    const filtered = user.workspaces.filter((w) => w.id !== wsId);
    const updated: UserProfile = {
      ...user,
      workspaces: filtered,
      activeWorkspaceId: wsId === user.activeWorkspaceId ? filtered[0].id : user.activeWorkspaceId
    };
    onUpdateUser(updated);
  };

  const handleExportAllUserData = () => {
    const jobs = getStoredJobs().filter((j) => !j.userId || j.userId === user.id);
    const exportData = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        workspaces: user.workspaces,
        preferences: user.preferences,
        exportedAt: new Date().toISOString()
      },
      jobsCount: jobs.length,
      jobs
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `repurposeflow-${user.email || 'export'}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // -------------------------------------------------------------
  // 1. IF NOT LOGGED IN: Render Standard Auth Modal (Вход / Регистрация)
  // -------------------------------------------------------------
  if (!user.isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
        <div className="relative w-full max-w-md rounded-3xl bg-[#080C14] border border-white/[0.1] shadow-2xl p-6 sm:p-8 text-left animate-modal">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="text-center mb-6 pt-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-sky-500 to-indigo-500 p-[1px] shadow-lg shadow-cyan-500/25 mx-auto mb-3">
              <div className="w-full h-full bg-[#080C14] rounded-2xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              {authMode === 'signin'
                ? (language === 'ru' ? 'Вход в личный кабинет' : 'Sign in to RepurposeFlow')
                : (language === 'ru' ? 'Регистрация аккаунта' : 'Create an Account')}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {language === 'ru'
                ? 'Все функции переработки контента доступны только после авторизации'
                : 'All repurposing features unlock inside your private account'}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex rounded-xl bg-[#030712] p-1 border border-white/[0.06] mb-5">
            <button
              onClick={() => {
                setAuthMode('signin');
                setAuthError('');
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                authMode === 'signin'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{language === 'ru' ? 'Вход' : 'Sign In'}</span>
            </button>
            <button
              onClick={() => {
                setAuthMode('signup');
                setAuthError('');
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                authMode === 'signup'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{language === 'ru' ? 'Регистрация' : 'Sign Up'}</span>
            </button>
          </div>

          {/* Error notice */}
          {authError && (
            <div className="mb-4 p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center animate-fade-in">
              {authError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={authMode === 'signin' ? handleSignIn : handleSignUp} className="space-y-3.5">
            {authMode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                  {language === 'ru' ? 'Ваше имя' : 'Your Name'}
                </label>
                <input
                  type="text"
                  placeholder={language === 'ru' ? 'Александр' : 'Alexander'}
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#030712] border border-white/[0.08] text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-500 transition"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                {language === 'ru' ? 'Электронная почта' : 'Email Address'}
              </label>
              <input
                type="email"
                placeholder="user@example.com"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#030712] border border-white/[0.08] text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-500 transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                {language === 'ru' ? 'Пароль' : 'Password'}
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#030712] border border-white/[0.08] text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-500 transition"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-3 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span>
                {authMode === 'signin'
                  ? (language === 'ru' ? 'Войти в личный кабинет' : 'Sign In')
                  : (language === 'ru' ? 'Зарегистрироваться и начать' : 'Create Free Account')}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. IF LOGGED IN: Render Full-Featured Personal Cabinet Dashboard
  // -------------------------------------------------------------
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#080C14] border border-white/[0.1] shadow-2xl p-6 sm:p-8 my-8 text-left max-h-[90vh] overflow-y-auto animate-modal">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-500 p-[1.5px] shadow-lg shadow-cyan-500/20 shrink-0">
              <div className="w-full h-full bg-[#080C14] rounded-2xl flex items-center justify-center">
                <span className="text-base font-bold text-cyan-400">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">{user.name || 'Пользователь'}</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/40 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {language === 'ru' ? 'Авторизован' : 'Active'}
                </span>
              </div>
              <p className="text-xs text-slate-400">{user.email || 'Личный аккаунт'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cabinet Navigation Tabs */}
        <div className="flex gap-2 mt-5 border-b border-white/[0.08] pb-3">
          <button
            onClick={() => setCabinetTab('overview')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              cabinetTab === 'overview'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            {language === 'ru' ? 'Обзор и статистика' : 'Overview'}
          </button>
          <button
            onClick={() => setCabinetTab('workspaces')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
              cabinetTab === 'workspaces'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{language === 'ru' ? 'Воркспейсы' : 'Workspaces'} ({user.workspaces.length})</span>
          </button>
          <button
            onClick={() => setCabinetTab('preferences')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
              cabinetTab === 'preferences'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{language === 'ru' ? 'Настройки и пресеты' : 'Preferences'}</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {cabinetTab === 'overview' && (
          <div className="mt-5 space-y-5 animate-fade-in">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-[#030712] border border-white/[0.07]">
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
                  <FileAudio className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{language === 'ru' ? 'Мои проекты' : 'My Projects'}</span>
                </div>
                <div className="text-2xl font-bold text-white font-mono">{totalUserJobs}</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#030712] border border-white/[0.07]">
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{language === 'ru' ? 'Доступные форматы' : 'Active Formats'}</span>
                </div>
                <div className="text-2xl font-bold text-cyan-400 font-mono">15</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#030712] border border-white/[0.07]">
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{language === 'ru' ? 'База данных' : 'Database'}</span>
                </div>
                <div className="text-xs font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Синхронизировано</span>
                </div>
              </div>
            </div>

            {/* Profile Info Form */}
            <form onSubmit={handleSaveProfile} className="space-y-3 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
                    {language === 'ru' ? 'Ваше имя' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#030712] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
                    {language === 'ru' ? 'Электронная почта' : 'Email Address'}
                  </label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#030712] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-500 font-mono">
                  {savedSuccess ? (
                    <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                      <Check className="w-3.5 h-3.5" /> {language === 'ru' ? 'Сохранено!' : 'Saved!'}
                    </span>
                  ) : (
                    `UID: ${user.id}`
                  )}
                </span>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold transition active:scale-95 shadow-md shadow-cyan-500/20"
                >
                  {language === 'ru' ? 'Сохранить изменения' : 'Save Profile'}
                </button>
              </div>
            </form>

            {/* Data Export Button */}
            <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-300">Резервная копия данных</div>
                <div className="text-[11px] text-slate-500">Скачать все публикации и проекты в JSON формате</div>
              </div>
              <button
                onClick={handleExportAllUserData}
                className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-xs text-slate-300 hover:text-white transition flex items-center gap-1.5 active:scale-95"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>{language === 'ru' ? 'Экспорт данных' : 'Export Data'}</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: WORKSPACES */}
        {cabinetTab === 'workspaces' && (
          <div className="mt-5 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-400">
                Создавайте отдельные воркспейсы для личного бренда, клиентов или подкастов
              </p>
              <button
                onClick={() => setShowAddWorkspace(!showAddWorkspace)}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> {language === 'ru' ? 'Новый воркспейс' : 'New'}
              </button>
            </div>

            {showAddWorkspace && (
              <form onSubmit={handleAddWorkspace} className="flex items-center gap-2 p-3 rounded-2xl bg-[#030712] border border-cyan-500/40 animate-fade-in">
                <input
                  type="text"
                  placeholder={language === 'ru' ? 'Название нового воркспейса' : 'Workspace title'}
                  value={newWorkspaceName}
                  onChange={(e) => setNewWorkspaceName(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-xl bg-transparent border border-white/[0.1] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold transition active:scale-95"
                >
                  {language === 'ru' ? 'Добавить' : 'Add'}
                </button>
              </form>
            )}

            <div className="space-y-2">
              {user.workspaces.map((ws) => {
                const isActive = ws.id === user.activeWorkspaceId;
                return (
                  <div
                    key={ws.id}
                    className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition ${
                      isActive
                        ? 'bg-cyan-950/30 border-cyan-500/60 shadow-lg shadow-cyan-500/10'
                        : 'bg-[#030712] border-white/[0.06] hover:border-white/[0.15]'
                    }`}
                  >
                    <div
                      onClick={() => onUpdateUser({ ...user, activeWorkspaceId: ws.id })}
                      className="flex items-center gap-3 cursor-pointer flex-1"
                    >
                      <div className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-cyan-400 animate-pulse' : 'bg-slate-600'}`} />
                      <div>
                        <div className="text-xs font-bold text-white">{ws.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono">slug: {ws.slug}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isActive && (
                        <span className="text-[10px] uppercase font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                          {language === 'ru' ? 'Активен' : 'Active'}
                        </span>
                      )}
                      {user.workspaces.length > 1 && (
                        <button
                          onClick={() => handleDeleteWorkspace(ws.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition"
                          title="Удалить воркспейс"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: PREFERENCES & DEFAULTS */}
        {cabinetTab === 'preferences' && (
          <form onSubmit={handleSaveProfile} className="mt-5 space-y-4 animate-fade-in">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {language === 'ru' ? 'Тон повествования по умолчанию (Tone of Voice):' : 'Default Tone of Voice:'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'b2b_expert', label: 'Экспертный', desc: 'Авторитетно, цифры и фреймворки' },
                  { id: 'provocative_founder', label: 'Провокационный', desc: 'Хуки, ломающие стереотипы' },
                  { id: 'storyteller', label: 'Сторителлинг', desc: 'Факапы и личный путь' },
                  { id: 'punchy_viral', label: 'Вирусный', desc: 'Тезисы и выжимка без воды' }
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setDefaultTone(t.id as ToneOfVoice)}
                    className={`p-2.5 rounded-xl border text-left transition ${
                      defaultTone === t.id
                        ? 'bg-cyan-500/20 border-cyan-500/50 text-white'
                        : 'bg-[#030712] border-white/[0.06] text-slate-400 hover:border-white/[0.15]'
                    }`}
                  >
                    <div className="text-xs font-bold text-white">{t.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {language === 'ru' ? 'Основной язык генерации:' : 'Default Generation Language:'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'ru', label: '🇷🇺 Русский' },
                  { id: 'en', label: '🇺🇸 English' },
                  { id: 'auto', label: '🌐 Авто (как в аудио)' }
                ].map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => setDefaultLang(l.id as any)}
                    className={`p-2.5 rounded-xl border text-center text-xs font-semibold transition ${
                      defaultLang === l.id
                        ? 'bg-cyan-500/20 border-cyan-500/50 text-white'
                        : 'bg-[#030712] border-white/[0.06] text-slate-400 hover:border-white/[0.15]'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Gemini API Key Setting */}
            <div className="pt-3 border-t border-white/[0.06]">
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Gemini API Key:</span>
                </label>
                {cabinetApiKey ? (
                  <button
                    type="button"
                    onClick={() => {
                      setCabinetApiKey('');
                      if (typeof window !== 'undefined') {
                        localStorage.removeItem('custom_gemini_api_key');
                      }
                    }}
                    className="text-[10px] text-amber-400 hover:text-amber-300"
                  >
                    Сбросить на системный
                  </button>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/40 font-mono">
                    Системный ключ по умолчанию активен
                  </span>
                )}
              </div>
              <input
                type="password"
                placeholder={cabinetApiKey ? 'Ваш персональный API ключ' : 'Используется системный ключ по умолчанию (AQ.Ab8RN6...)'}
                value={cabinetApiKey}
                onChange={(e) => setCabinetApiKey(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#030712] border border-white/[0.08] text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                {cabinetApiKey
                  ? '⚡️ Активен ваш персональный ключ Gemini. Все генерации идут через вашу квоту.'
                  : '✅ По умолчанию активен предоставленный системный Gemini API ключ. Если хотите использовать свой личный ключ из Google AI Studio — просто вставьте его сюда.'}
              </p>
            </div>

            <div className="pt-3 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold transition active:scale-95"
              >
                {savedSuccess ? 'Сохранено!' : 'Сохранить настройки'}
              </button>
            </div>
          </form>
        )}

        {/* Footer with Sign Out */}
        <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            {user.createdAt ? `Создан: ${new Date(user.createdAt).toLocaleDateString()}` : 'Активен'}
          </span>
          <button
            onClick={handleSignOut}
            className="text-xs text-red-400/80 hover:text-red-300 transition flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-red-500/10"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{language === 'ru' ? 'Выйти из аккаунта' : 'Sign Out'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

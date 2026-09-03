'use client';

import React, { useState } from 'react';
import {
  X,
  User,
  Mail,
  Lock,
  Shield,
  Clock,
  FileAudio,
  Check,
  Plus,
  Layers,
  LogOut,
  Sparkles,
  ArrowRight,
  LogIn,
  UserPlus
} from 'lucide-react';
import { UserProfile, Workspace } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { createFreshUser } from '@/lib/store';
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
  const { t, language } = useLanguage();

  // Auth Mode: 'signin' or 'signup'
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Cabinet state
  const [editName, setEditName] = useState(user.name || '');
  const [editEmail, setEditEmail] = useState(user.email || '');
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [showAddWorkspace, setShowAddWorkspace] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (!authEmail.trim() || !authEmail.includes('@')) {
      setAuthError(language === 'ru' ? 'Введите корректный email' : 'Please enter a valid email address');
      return;
    }

    const defaultName = authEmail.split('@')[0];
    const loggedUser: UserProfile = {
      ...user,
      email: authEmail.trim(),
      name: user.name || defaultName.charAt(0).toUpperCase() + defaultName.slice(1),
      isAuthenticated: true
    };

    onUpdateUser(loggedUser);
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

    const loggedUser: UserProfile = {
      ...user,
      name: authName.trim(),
      email: authEmail.trim(),
      isAuthenticated: true
    };

    onUpdateUser(loggedUser);
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    onClose();
  };

  const handleQuickDemoLogin = () => {
    const demoUser: UserProfile = {
      ...user,
      name: language === 'ru' ? 'Эксперт' : 'Expert Founder',
      email: 'founder@repurposeflow.io',
      isAuthenticated: true
    };
    onUpdateUser(demoUser);
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    onClose();
  };

  const handleSignOut = () => {
    const cleanUser = createFreshUser(false);
    onSwitchUser(cleanUser);
    onClose();
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...user,
      name: editName.trim() || user.name,
      email: editEmail.trim() || user.email
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

  const minutesLeft = Math.max(0, user.minutesTotal - user.minutesUsed);

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
                : (language === 'ru' ? 'Создать аккаунт' : 'Create an Account')}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {language === 'ru'
                ? 'Управляйте генерациями, проектами и личной историей'
                : 'Access your private workspace and generated publications'}
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
                  placeholder={language === 'ru' ? 'Иван Иванов' : 'John Doe'}
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
                {language === 'ru' ? 'Рабочий Email' : 'Email Address'}
              </label>
              <input
                type="email"
                placeholder="name@company.com"
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
              className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span>
                {authMode === 'signin'
                  ? (language === 'ru' ? 'Войти в кабинет' : 'Sign In')
                  : (language === 'ru' ? 'Зарегистрироваться' : 'Create Free Account')}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.08]" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-[#080C14] px-3 text-slate-500 font-semibold">
                {language === 'ru' ? 'или быстрый доступ' : 'or quick access'}
              </span>
            </div>
          </div>

          {/* Quick 1-Click Demo Login */}
          <button
            onClick={handleQuickDemoLogin}
            className="w-full py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-semibold text-slate-200 transition-all hover:border-cyan-500/40 hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>{language === 'ru' ? '⚡️ Демо-вход в 1 клик' : '⚡️ 1-Click Instant Demo Login'}</span>
          </button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. IF LOGGED IN: Render Sleek Personal Cabinet Dashboard
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

        {/* Stats Grid */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-[#030712] border border-white/[0.07]">
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
              <FileAudio className="w-3.5 h-3.5 text-cyan-400" />
              <span>{language === 'ru' ? 'Обработано записей' : 'Processed recordings'}</span>
            </div>
            <div className="text-2xl font-bold text-white font-mono">{totalUserJobs}</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#030712] border border-white/[0.07]">
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>{language === 'ru' ? 'Баланс минут' : 'Minutes balance'}</span>
            </div>
            <div className="text-2xl font-bold text-cyan-400 font-mono">
              {minutesLeft} <span className="text-xs text-slate-500 font-normal">мин</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#030712] border border-white/[0.07]">
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>{language === 'ru' ? 'Тарифный план' : 'Subscription'}</span>
            </div>
            <div className="text-sm font-bold text-white uppercase mt-1">
              {user.plan} <span className="text-[10px] text-emerald-400 font-normal">● Неограничен</span>
            </div>
          </div>
        </div>

        {/* Workspaces Section */}
        <div className="mt-6 pt-5 border-t border-white/[0.08]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>{language === 'ru' ? 'Рабочие пространства' : 'Workspaces'} ({user.workspaces.length})</span>
            </h3>
            <button
              onClick={() => setShowAddWorkspace(!showAddWorkspace)}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{language === 'ru' ? 'Добавить воркспейс' : 'New Workspace'}</span>
            </button>
          </div>

          {showAddWorkspace && (
            <form onSubmit={handleAddWorkspace} className="mb-3 flex items-center gap-2 animate-fade-in">
              <input
                type="text"
                placeholder={language === 'ru' ? 'Название нового проекта или клиента' : 'Workspace name'}
                value={newWorkspaceName}
                onChange={(e) => setNewWorkspaceName(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-[#030712] border border-cyan-500/40 text-xs text-white placeholder-slate-500 focus:outline-none"
                autoFocus
              />
              <button
                type="submit"
                className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold transition active:scale-95"
              >
                {language === 'ru' ? 'Создать' : 'Add'}
              </button>
            </form>
          )}

          <div className="space-y-2">
            {user.workspaces.map((ws) => {
              const isActive = ws.id === user.activeWorkspaceId;
              return (
                <div
                  key={ws.id}
                  onClick={() => onUpdateUser({ ...user, activeWorkspaceId: ws.id })}
                  className={`p-3 rounded-2xl border text-left flex items-center justify-between cursor-pointer transition ${
                    isActive
                      ? 'bg-cyan-950/30 border-cyan-500/60'
                      : 'bg-[#030712] border-white/[0.06] hover:border-white/[0.15]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-cyan-400' : 'bg-slate-600'}`} />
                    <span className="text-xs font-semibold text-white">{ws.name}</span>
                    {ws.isAgencyClient && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800/40">
                        Client
                      </span>
                    )}
                  </div>
                  {isActive && (
                    <span className="text-[10px] uppercase font-bold text-cyan-400">
                      {language === 'ru' ? 'Активен' : 'Active'}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Profile Settings */}
        <div className="mt-6 pt-5 border-t border-white/[0.08]">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
            {language === 'ru' ? 'Настройки профиля' : 'Profile Settings'}
          </h3>
          <form onSubmit={handleSaveProfile} className="space-y-3">
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
              <span className="text-[11px] text-slate-500">
                {savedSuccess ? (
                  <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                    <Check className="w-3.5 h-3.5" /> {language === 'ru' ? 'Изменения сохранены' : 'Saved'}
                  </span>
                ) : null}
              </span>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-white text-xs font-semibold transition active:scale-95"
              >
                {language === 'ru' ? 'Сохранить изменения' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Footer with Sign Out */}
        <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-mono">ID: {user.id}</span>
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

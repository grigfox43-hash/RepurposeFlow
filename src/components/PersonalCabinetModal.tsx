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
import {
  loginUser,
  registerUser,
  saveStoredUser,
  saveStoredAccount,
  createFreshUser
} from '@/lib/store';

interface PersonalCabinetModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  activeWorkspaceId?: string;
  onUpdateUser: (user: UserProfile) => void;
  onSelectWorkspace?: (id: string) => void;
  onSignOut?: () => void;
  onSwitchUser?: (newUser: UserProfile) => void;
  totalUserJobs: number;
}

export const PersonalCabinetModal: React.FC<PersonalCabinetModalProps> = ({
  isOpen,
  onClose,
  user,
  activeWorkspaceId = user.activeWorkspaceId,
  onUpdateUser,
  onSelectWorkspace,
  onSignOut,
  onSwitchUser,
  totalUserJobs
}) => {
  const { language } = useLanguage();
  const [cabinetTab, setCabinetTab] = useState<'overview' | 'workspaces' | 'preferences'>('overview');
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authEmail, setAuthEmail] = useState('');
  const [authName, setAuthName] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Edit profile state
  const [editName, setEditName] = useState(user.name);
  const [editEmail, setEditEmail] = useState(user.email);

  // New workspace state
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [newWorkspaceIsClient, setNewWorkspaceIsClient] = useState(false);
  const [newWorkspaceClientName, setNewWorkspaceClientName] = useState('');
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
    if (!authEmail.trim()) {
      setAuthError('Введите адрес электронной почты');
      return;
    }
    try {
      const loggedUser = loginUser(authEmail.trim());
      onUpdateUser(loggedUser);
      setAuthError('');
      onClose();
    } catch (err: any) {
      setAuthError(err.message || 'Ошибка входа');
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim()) {
      setAuthError('Введите адрес электронной почты');
      return;
    }
    try {
      const registeredUser = registerUser(authEmail.trim(), authName.trim());
      onUpdateUser(registeredUser);
      setAuthError('');
      onClose();
    } catch (err: any) {
      setAuthError(err.message || 'Ошибка регистрации');
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser: UserProfile = {
      ...user,
      name: editName.trim() || user.name,
      email: editEmail.trim() || user.email,
      preferences: {
        ...user.preferences,
        defaultTone,
        defaultLanguage: defaultLang
      }
    };
    onUpdateUser(updatedUser);
    saveStoredUser(updatedUser);
    saveStoredAccount(updatedUser);

    if (typeof window !== 'undefined') {
      if (cabinetApiKey.trim()) {
        localStorage.setItem('custom_gemini_api_key', cabinetApiKey.trim());
      } else {
        localStorage.removeItem('custom_gemini_api_key');
      }
    }

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleCreateWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkspaceName.trim()) return;

    const newWs: Workspace = {
      id: `ws-${Date.now()}`,
      name: newWorkspaceName.trim(),
      slug: newWorkspaceName.toLowerCase().replace(/\s+/g, '-'),
      isAgencyClient: newWorkspaceIsClient,
      clientName: newWorkspaceIsClient ? newWorkspaceClientName.trim() : undefined,
      jobsCount: 0
    };

    const updatedWorkspaces = [...user.workspaces, newWs];
    const updatedUser: UserProfile = {
      ...user,
      workspaces: updatedWorkspaces,
      activeWorkspaceId: newWs.id
    };

    onUpdateUser(updatedUser);
    saveStoredUser(updatedUser);
    saveStoredAccount(updatedUser);
    if (onSelectWorkspace) onSelectWorkspace(newWs.id);

    setNewWorkspaceName('');
    setNewWorkspaceIsClient(false);
    setNewWorkspaceClientName('');
    setShowAddWorkspace(false);
  };

  const handleDeleteWorkspace = (wsId: string) => {
    if (user.workspaces.length <= 1) {
      alert('Нельзя удалить единственный воркспейс');
      return;
    }
    if (!confirm('Вы уверены, что хотите удалить этот воркспейс?')) return;

    const filtered = user.workspaces.filter((w) => w.id !== wsId);
    const fallbackId = filtered[0].id;
    const updatedUser: UserProfile = {
      ...user,
      workspaces: filtered,
      activeWorkspaceId: user.activeWorkspaceId === wsId ? fallbackId : user.activeWorkspaceId
    };

    onUpdateUser(updatedUser);
    saveStoredUser(updatedUser);
    saveStoredAccount(updatedUser);
    if (user.activeWorkspaceId === wsId && onSelectWorkspace) {
      onSelectWorkspace(fallbackId);
    }
  };

  const handleExportData = () => {
    if (typeof window === 'undefined') return;
    const allData = {
      user,
      jobs: JSON.parse(localStorage.getItem('repurpose_flow_jobs') || '[]'),
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `repurposeflow-backup-${user.email || 'export'}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSignOut = () => {
    if (onSignOut) {
      onSignOut();
    } else {
      const guest = createFreshUser(false);
      saveStoredUser(guest);
      onUpdateUser(guest);
      if (onSwitchUser) onSwitchUser(guest);
    }
    onClose();
  };

  // -------------------------------------------------------------
  // 1. IF NOT LOGGED IN: Render Standard Auth Modal (Вход / Регистрация)
  // -------------------------------------------------------------
  if (!user.isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
        <div className="relative w-full max-w-md rounded-3xl bg-[#12121C] border border-white/[0.1] shadow-2xl p-6 sm:p-8 text-left animate-modal">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="text-center mb-6 pt-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#4C6EF5] via-[#9B5DE5] to-[#F15BB5] p-[1px] shadow-lg shadow-purple-500/25 mx-auto mb-3">
              <div className="w-full h-full bg-[#0E0E18] rounded-2xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-[#F15BB5]" />
              </div>
            </div>
            <h2 className="text-xl font-extrabold text-white tracking-tight font-heading">
              {authMode === 'signin'
                ? (language === 'ru' ? 'Вход в личный кабинет' : 'Sign in to RepurposeFlow')
                : (language === 'ru' ? 'Регистрация аккаунта' : 'Create an Account')}
            </h2>
            <p className="text-xs text-[#9A9AB0] mt-1">
              {language === 'ru'
                ? 'Все функции переработки контента доступны только после авторизации'
                : 'All repurposing features unlock inside your private account'}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex rounded-xl bg-[#0A0A12] p-1 border border-white/[0.06] mb-5">
            <button
              onClick={() => {
                setAuthMode('signin');
                setAuthError('');
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                authMode === 'signin'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
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
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
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
                  <User className="w-3.5 h-3.5 text-[#9B5DE5]" />
                  {language === 'ru' ? 'Ваше имя' : 'Your Name'}
                </label>
                <input
                  type="text"
                  placeholder={language === 'ru' ? 'Александр' : 'Alexander'}
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A12] border border-white/[0.08] text-white text-xs sm:text-sm focus:outline-none focus:border-purple-500 transition-colors"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#9B5DE5]" />
                {language === 'ru' ? 'Электронная почта' : 'Email Address'}
              </label>
              <input
                type="email"
                placeholder="user@example.com"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A12] border border-white/[0.08] text-white text-xs sm:text-sm focus:outline-none focus:border-purple-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#9B5DE5]" />
                {language === 'ru' ? 'Пароль' : 'Password'}
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A12] border border-white/[0.08] text-white text-xs sm:text-sm focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              className="btn-primary-effect btn-cta-pulse w-full mt-3 py-3 rounded-xl bg-gradient-to-r from-[#4C6EF5] via-[#9B5DE5] to-[#F15BB5] text-white font-bold text-xs sm:text-sm shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2"
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
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#12121C] border border-white/[0.1] shadow-2xl p-6 sm:p-8 my-8 text-left max-h-[90vh] overflow-y-auto animate-modal">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#4C6EF5] via-[#9B5DE5] to-[#F15BB5] p-[1.5px] shadow-lg shadow-purple-500/20 shrink-0">
              <div className="w-full h-full bg-[#0E0E18] rounded-2xl flex items-center justify-center">
                <span className="text-base font-bold text-purple-300">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight font-heading">{user.name || 'Пользователь'}</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/40 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {language === 'ru' ? 'Авторизован' : 'Active'}
                </span>
              </div>
              <p className="text-xs text-[#9A9AB0]">{user.email || 'Личный аккаунт'}</p>
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
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            {language === 'ru' ? 'Обзор и статистика' : 'Overview'}
          </button>
          <button
            onClick={() => setCabinetTab('workspaces')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
              cabinetTab === 'workspaces'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
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
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
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
              <div className="p-4 rounded-2xl bg-[#0A0A12] border border-white/[0.07]">
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
                  <FileAudio className="w-3.5 h-3.5 text-[#9B5DE5]" />
                  <span>{language === 'ru' ? 'Мои проекты' : 'My Projects'}</span>
                </div>
                <div className="text-2xl font-bold text-white font-mono">{totalUserJobs}</div>
              </div>
              <div className="p-4 rounded-2xl bg-[#0A0A12] border border-white/[0.07]">
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#F15BB5]" />
                  <span>{language === 'ru' ? 'AI Форматов' : 'AI Formats'}</span>
                </div>
                <div className="text-2xl font-bold text-purple-300 font-mono">15</div>
              </div>
              <div className="p-4 rounded-2xl bg-[#0A0A12] border border-white/[0.07]">
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
                  <Shield className="w-3.5 h-3.5 text-[#B4FF39]" />
                  <span>{language === 'ru' ? 'База данных' : 'Database'}</span>
                </div>
                <div className="text-sm font-bold text-[#B4FF39] font-mono mt-1">Синхронизирована</div>
              </div>
            </div>

            {/* Profile Info Form */}
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#9B5DE5]" />
                  {language === 'ru' ? 'Имя пользователя:' : 'Display Name:'}
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A12] border border-white/[0.08] text-white text-xs sm:text-sm focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#9B5DE5]" />
                  {language === 'ru' ? 'Email аккаунта:' : 'Account Email:'}
                </label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A12] border border-white/[0.08] text-white text-xs sm:text-sm focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleExportData}
                  className="px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-slate-300 transition flex items-center gap-1.5"
                  title="Экспорт всех данных в JSON"
                >
                  <Download className="w-3.5 h-3.5 text-[#9B5DE5]" />
                  <span>{language === 'ru' ? 'Резервная копия данных (JSON)' : 'Backup Data (JSON)'}</span>
                </button>

                <button
                  type="submit"
                  className="btn-primary-effect px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#4C6EF5] to-[#9B5DE5] hover:opacity-90 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-purple-500/20"
                >
                  {savedSuccess ? <Check className="w-3.5 h-3.5" /> : null}
                  <span>{savedSuccess ? 'Сохранено!' : 'Сохранить изменения'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 2: WORKSPACES */}
        {cabinetTab === 'workspaces' && (
          <div className="mt-5 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">
                {language === 'ru'
                  ? 'Воркспейсы позволяют разделять проекты клиентов, брендов или подкастов.'
                  : 'Workspaces help segregate content for different clients or brands.'}
              </span>
              <button
                type="button"
                onClick={() => setShowAddWorkspace(!showAddWorkspace)}
                className="px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-semibold flex items-center gap-1 transition"
              >
                <Plus className="w-3 h-3" />
                <span>{language === 'ru' ? 'Новый воркспейс' : 'New Workspace'}</span>
              </button>
            </div>

            {/* Add Workspace Form */}
            {showAddWorkspace && (
              <form
                onSubmit={handleCreateWorkspace}
                className="p-4 rounded-2xl bg-[#0A0A12] border border-white/[0.08] space-y-3 animate-fade-in"
              >
                <div className="text-xs font-bold text-white">
                  {language === 'ru' ? 'Создать новое рабочее пространство' : 'Create New Workspace'}
                </div>
                <div>
                  <input
                    type="text"
                    placeholder={language === 'ru' ? 'Название: Подкаст «Фаундеры»' : 'Workspace Name'}
                    value={newWorkspaceName}
                    onChange={(e) => setNewWorkspaceName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#12121C] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-purple-500 transition-colors"
                    required
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is-client-ws"
                    checked={newWorkspaceIsClient}
                    onChange={(e) => setNewWorkspaceIsClient(e.target.checked)}
                    className="rounded accent-purple-500"
                  />
                  <label htmlFor="is-client-ws" className="text-xs text-slate-300">
                    {language === 'ru' ? 'Воркспейс для внешнего клиента' : 'Client workspace'}
                  </label>
                </div>

                {newWorkspaceIsClient && (
                  <div>
                    <input
                      type="text"
                      placeholder={language === 'ru' ? 'Имя компании / клиента' : 'Client name'}
                      value={newWorkspaceClientName}
                      onChange={(e) => setNewWorkspaceClientName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#12121C] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddWorkspace(false)}
                    className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    className="btn-primary-effect px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#4C6EF5] to-[#9B5DE5] hover:opacity-90 text-white text-xs font-bold"
                  >
                    Создать
                  </button>
                </div>
              </form>
            )}

            {/* List of Workspaces */}
            <div className="space-y-2">
              {user.workspaces.map((ws) => {
                const isActive = ws.id === activeWorkspaceId;
                return (
                  <div
                    key={ws.id}
                    className={`p-3.5 rounded-2xl border transition flex items-center justify-between ${
                      isActive
                        ? 'bg-purple-500/15 border-purple-500/40 text-white'
                        : 'bg-[#0A0A12] border-white/[0.06] text-slate-300 hover:border-white/[0.15]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center">
                        <Layers className="w-4 h-4 text-[#9B5DE5]" />
                      </div>
                      <div>
                        <div className="text-xs font-bold flex items-center gap-2">
                          <span>{ws.name}</span>
                          {isActive && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/30 text-purple-300 border border-purple-500/40">
                              Текущий
                            </span>
                          )}
                          {ws.isAgencyClient && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-900/50 text-purple-300 border border-purple-700/40">
                              Клиент: {ws.clientName}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">/{ws.slug}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {!isActive && (
                        <button
                          type="button"
                          onClick={() => {
                            if (onSelectWorkspace) onSelectWorkspace(ws.id);
                            onClose();
                          }}
                          className="px-3 py-1 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-[11px] font-semibold text-slate-300"
                        >
                          Переключить
                        </button>
                      )}
                      {user.workspaces.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDeleteWorkspace(ws.id)}
                          className="p-1.5 text-slate-500 hover:text-red-400 transition"
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
                        ? 'bg-purple-500/20 border-purple-500/50 text-white'
                        : 'bg-[#0A0A12] border-white/[0.06] text-slate-400 hover:border-white/[0.15]'
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
                        ? 'bg-purple-500/20 border-purple-500/50 text-white'
                        : 'bg-[#0A0A12] border-white/[0.06] text-slate-400 hover:border-white/[0.15]'
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
                  <Key className="w-3.5 h-3.5 text-[#9B5DE5]" />
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
                className="w-full px-3.5 py-2 rounded-xl bg-[#0A0A12] border border-white/[0.08] text-white font-mono text-xs focus:outline-none focus:border-purple-500 transition-colors"
              />
              <p className="text-[11px] text-[#9A9AB0] mt-1">
                {cabinetApiKey
                  ? '⚡️ Активен ваш персональный ключ Gemini. Все генерации идут через вашу квоту.'
                  : '✅ По умолчанию активен предоставленный системный Gemini API ключ. Если хотите использовать свой личный ключ из Google AI Studio — просто вставьте его сюда.'}
              </p>
            </div>

            <div className="pt-3 flex justify-end">
              <button
                type="submit"
                className="btn-primary-effect px-4 py-2 rounded-xl bg-gradient-to-r from-[#4C6EF5] to-[#9B5DE5] hover:opacity-90 text-white text-xs font-bold transition"
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

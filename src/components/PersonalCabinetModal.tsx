'use client';

import React, { useState } from 'react';
import {
  X,
  User,
  Mail,
  Shield,
  Clock,
  FileAudio,
  Check,
  Plus,
  Layers,
  RotateCcw
} from 'lucide-react';
import { UserProfile, Workspace } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { createFreshUser } from '@/lib/store';

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
  const { t } = useLanguage();
  const [name, setName] = useState(user.name === 'Мой профиль' ? '' : user.name);
  const [email, setEmail] = useState(user.email);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [showAddWorkspace, setShowAddWorkspace] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...user,
      name: name.trim() || 'Мой профиль',
      email: email.trim()
    };
    onUpdateUser(updated);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
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

  const handleResetToCleanUser = () => {
    if (confirm('Сбросить данные сессии и создать чистый аккаунт?')) {
      const fresh = createFreshUser();
      onSwitchUser(fresh);
      onClose();
    }
  };

  const minutesLeft = Math.max(0, user.minutesTotal - user.minutesUsed);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-xl rounded-3xl bg-[#080C14] border border-white/[0.1] shadow-2xl p-6 sm:p-8 my-8 text-left max-h-[90vh] overflow-y-auto animate-modal">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-500 p-[1px] shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-[#080C14] rounded-2xl flex items-center justify-center">
                <User className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">{t.authTitle}</h2>
              <p className="text-xs text-slate-400">{t.authSubtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Stats Overview */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-[#030712] border border-white/[0.07]">
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
              <FileAudio className="w-3.5 h-3.5 text-cyan-400" /> {t.authStatsJobs}
            </div>
            <div className="text-2xl font-bold text-white font-mono">{totalUserJobs}</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#030712] border border-white/[0.07]">
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
              <Clock className="w-3.5 h-3.5 text-indigo-400" /> {t.dashMetricMinutes}:
            </div>
            <div className="text-2xl font-bold text-cyan-400 font-mono">
              {minutesLeft} <span className="text-xs text-slate-500 font-normal">мин</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#030712] border border-white/[0.07]">
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
              <Shield className="w-3.5 h-3.5 text-emerald-400" /> База данных:
            </div>
            <div className="text-xs font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Подключена (Real DB)
            </div>
          </div>
        </div>

        {/* Profile Edit Form */}
        <form onSubmit={handleSave} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-cyan-400" /> {t.authNameLabel}
            </label>
            <input
              type="text"
              placeholder="Введите ваше имя или название проекта"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#030712] border border-white/[0.08] text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-cyan-400" /> {t.authEmailLabel}
            </label>
            <input
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#030712] border border-white/[0.08] text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-500 font-mono">UID: {user.id}</span>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-cyan-500/20 active:scale-95"
            >
              {savedSuccess ? <Check className="w-4 h-4" /> : null}
              <span>{savedSuccess ? 'Сохранено!' : t.authSaveBtn}</span>
            </button>
          </div>
        </form>

        {/* Workspaces List & Creator */}
        <div className="mt-8 pt-6 border-t border-white/[0.08]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" /> Ваши воркспейсы ({user.workspaces.length})
            </h3>
            <button
              onClick={() => setShowAddWorkspace(!showAddWorkspace)}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Добавить воркспейс
            </button>
          </div>

          {showAddWorkspace && (
            <form onSubmit={handleAddWorkspace} className="mb-4 flex items-center gap-2">
              <input
                type="text"
                placeholder="Название нового воркспейса"
                value={newWorkspaceName}
                onChange={(e) => setNewWorkspaceName(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-[#030712] border border-cyan-500/40 text-xs text-white placeholder-slate-500 focus:outline-none"
                autoFocus
              />
              <button
                type="submit"
                className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold transition active:scale-95"
              >
                Создать
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
                        Клиент
                      </span>
                    )}
                  </div>
                  {isActive && (
                    <span className="text-[10px] uppercase font-bold text-cyan-400">Активен</span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-white/[0.06] flex justify-end">
            <button
              onClick={handleResetToCleanUser}
              className="text-xs text-slate-500 hover:text-red-400 transition flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Сбросить сессию
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

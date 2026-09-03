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
  RefreshCw,
  LogOut,
  Sparkles,
  Layers
} from 'lucide-react';
import { UserProfile } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

interface PersonalCabinetModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
  onSwitchUser: (newUser: UserProfile) => void;
  totalUserJobs: number;
}

const PRESET_USERS: UserProfile[] = [
  {
    id: 'user-001',
    name: 'Алексей Смирнов (B2B SaaS)',
    email: 'alex@growthscale.io',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    plan: 'pro',
    minutesTotal: 360,
    minutesUsed: 0,
    workspaces: [
      { id: 'ws-personal', name: 'Личный бренд', slug: 'alex-brand', isAgencyClient: false, jobsCount: 0 },
      { id: 'ws-saas', name: 'SaaS Growth', slug: 'saas-growth', isAgencyClient: true, clientName: 'SaaS Alpha', jobsCount: 0 }
    ],
    activeWorkspaceId: 'ws-personal'
  },
  {
    id: 'user-002',
    name: 'Екатерина Романова (Медиа-агентство)',
    email: 'kate@contentforge.agency',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    plan: 'agency',
    minutesTotal: 1200,
    minutesUsed: 0,
    workspaces: [
      { id: 'ws-agency-1', name: 'Подкаст "Техно-Старт"', slug: 'tech-start', isAgencyClient: true, clientName: 'Podcast Hub', jobsCount: 0 },
      { id: 'ws-agency-2', name: 'Клиент Финтех', slug: 'fintech-client', isAgencyClient: true, clientName: 'FinPay Bank', jobsCount: 0 }
    ],
    activeWorkspaceId: 'ws-agency-1'
  }
];

export const PersonalCabinetModal: React.FC<PersonalCabinetModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
  onSwitchUser,
  totalUserJobs
}) => {
  const { t } = useLanguage();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...user,
      name: name.trim() || user.name,
      email: email.trim() || user.email
    };
    onUpdateUser(updated);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  const handleSelectPreset = (preset: UserProfile) => {
    onSwitchUser(preset);
    setName(preset.name);
    setEmail(preset.email);
    onClose();
  };

  const minutesLeft = Math.max(0, user.minutesTotal - user.minutesUsed);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#080C14] border border-white/[0.1] shadow-2xl p-6 sm:p-8 my-8 text-left max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-500 p-[1px] shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-[#080C14] rounded-2xl flex items-center justify-center overflow-hidden">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-6 h-6 text-cyan-400" />
                )}
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
              <Shield className="w-3.5 h-3.5 text-purple-400" /> Статус аккаунта:
            </div>
            <div className="text-xs uppercase font-bold text-emerald-400 mt-1 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> Активен (PROD)
            </div>
          </div>
        </div>

        {/* Profile Edit Form */}
        <form onSubmit={handleSave} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-cyan-400" /> {t.authNameLabel}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#030712] border border-white/[0.08] text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-cyan-400" /> {t.authEmailLabel}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#030712] border border-white/[0.08] text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-500"
              required
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-500">ID пользователя: {user.id}</span>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold transition flex items-center gap-1.5 shadow-md"
            >
              {savedSuccess ? <Check className="w-4 h-4" /> : null}
              <span>{savedSuccess ? 'Сохранено!' : t.authSaveBtn}</span>
            </button>
          </div>
        </form>

        {/* Account Switcher Section */}
        <div className="mt-8 pt-6 border-t border-white/[0.08]">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5 text-indigo-400" /> {t.authSwitchBtn}
          </h3>
          <div className="space-y-2">
            {PRESET_USERS.map((preset) => {
              const isSelected = preset.id === user.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition ${
                    isSelected
                      ? 'bg-cyan-950/30 border-cyan-500/60'
                      : 'bg-[#030712] border-white/[0.06] hover:border-white/[0.15]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={preset.avatarUrl}
                      alt={preset.name}
                      className="w-8 h-8 rounded-full object-cover border border-white/[0.1]"
                    />
                    <div>
                      <div className="text-xs font-bold text-white">{preset.name}</div>
                      <div className="text-[11px] text-slate-400">{preset.email}</div>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                      Текущий
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

'use client';

import React from 'react';
import confetti from 'canvas-confetti';
import { X, Check, Zap, Sparkles, CreditCard, ArrowRight, ShieldCheck } from 'lucide-react';
import { UserProfile } from '@/types';
import { PLANS } from '@/components/LandingPage';

interface BillingModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
}

export const BillingModal: React.FC<BillingModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser
}) => {
  if (!isOpen) return null;

  const minutesLeft = Math.max(0, user.minutesTotal - user.minutesUsed);

  const handleSelectPlan = (planId: 'starter' | 'pro' | 'agency') => {
    const minutesMap = { starter: 120, pro: 360, agency: 1200 };
    const updated: UserProfile = {
      ...user,
      plan: planId,
      minutesTotal: minutesMap[planId]
    };
    onUpdateUser(updated);
    confetti({ particleCount: 60, spread: 80, origin: { y: 0.6 } });
    onClose();
  };

  const handleTopUp = (minutes: number) => {
    const updated: UserProfile = {
      ...user,
      minutesTotal: user.minutesTotal + minutes
    };
    onUpdateUser(updated);
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 my-8 text-left max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-white">Управление минутами и тарифом</h2>
            <p className="text-xs text-slate-400">
              Текущий тариф: <span className="font-bold text-indigo-400 uppercase">{user.plan}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Balance Status Banner */}
        <div className="mt-6 p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs text-slate-400">Остаток минут на обработку:</div>
            <div className="text-3xl font-extrabold text-white font-mono mt-0.5">
              {minutesLeft} <span className="text-sm font-normal text-slate-400">/ {user.minutesTotal} мин</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Минуты обновляются каждый месяц в дату подписки
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 mr-1">Быстрая докупка:</span>
            <button
              onClick={() => handleTopUp(60)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-white font-medium transition"
            >
              +60 мин ($15)
            </button>
            <button
              onClick={() => handleTopUp(180)}
              className="px-3 py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-xs text-indigo-300 font-medium transition"
            >
              +180 мин ($39)
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan) => {
            const isCurrent = user.plan === plan.id;

            return (
              <div
                key={plan.id}
                className={`p-6 rounded-2xl border flex flex-col justify-between transition ${
                  isCurrent
                    ? 'bg-indigo-950/30 border-indigo-500 shadow-lg shadow-indigo-500/10'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-white text-base">{plan.name}</h3>
                    {isCurrent && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                        Текущий
                      </span>
                    )}
                  </div>
                  <div className="text-2xl font-extrabold text-white font-mono">
                    ${plan.priceMonthly}
                    <span className="text-xs text-slate-400 font-normal"> /мес</span>
                  </div>
                  <div className="text-xs text-indigo-400 font-semibold mt-1">
                    {plan.minutesPerMonth} мин в месяц
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">{plan.description}</p>

                  <div className="mt-4 space-y-2">
                    {plan.features.slice(0, 4).map((f, i) => (
                      <div key={i} className="flex items-start gap-2 text-[11px] text-slate-300">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800">
                  <button
                    disabled={isCurrent}
                    onClick={() => handleSelectPlan(plan.id)}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      isCurrent
                        ? 'bg-slate-800 text-slate-500 cursor-default'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md'
                    }`}
                  >
                    {isCurrent ? 'Активен' : `Перейти на ${plan.name}`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

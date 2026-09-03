'use client';

import React, { useState, useEffect } from 'react';
import { X, Key, Sparkles, Check, Server, Shield, ExternalLink, Database } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [n8nWebhookUrl, setN8nWebhookUrl] = useState('');
  const [s3Bucket, setS3Bucket] = useState('repurposeflow-media');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setGeminiApiKey(localStorage.getItem('custom_gemini_api_key') || '');
      setN8nWebhookUrl(localStorage.getItem('custom_n8n_webhook') || '');
      setS3Bucket(localStorage.getItem('custom_s3_bucket') || 'repurposeflow-media');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      localStorage.setItem('custom_gemini_api_key', geminiApiKey.trim());
      localStorage.setItem('custom_n8n_webhook', n8nWebhookUrl.trim());
      localStorage.setItem('custom_s3_bucket', s3Bucket.trim());
    }
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl rounded-3xl bg-[#080C14] border border-white/[0.1] shadow-2xl p-6 sm:p-8 text-left animate-modal">
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center">
              <Key className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Интеграции и настройки API</h2>
              <p className="text-xs text-slate-400">Настройка Gemini, n8n и хранилища S3/R2</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-6 space-y-5">
          {/* Gemini API Key */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Gemini API Key:
              </span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                AI Studio <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </label>
            <input
              type="password"
              placeholder="AQ... или AIza..."
              value={geminiApiKey}
              onChange={(e) => setGeminiApiKey(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#030712] border border-white/[0.08] text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Ключ используется для прямых вызовов Gemini AI API с сервера или клиента.
            </p>
          </div>

          {/* n8n Webhook URL */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-purple-400" /> URL вебхука n8n:
            </label>
            <input
              type="url"
              placeholder="https://n8n.yourdomain.com/webhook/repurposeflow-job"
              value={n8nWebhookUrl}
              onChange={(e) => setN8nWebhookUrl(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#030712] border border-white/[0.08] text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Шаблон воркфлоу находится в папке <code>/n8n/workflow-repurposeflow-gemini.json</code>
            </p>
          </div>

          {/* S3/R2 Bucket */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-sky-400" /> Cloudflare R2 / S3 Bucket Name:
            </label>
            <input
              type="text"
              value={s3Bucket}
              onChange={(e) => setS3Bucket(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#030712] border border-white/[0.08] text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
            <div className="text-[11px] text-cyan-400 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" /> Ключи сохраняются безопасно
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold transition flex items-center gap-1.5 shadow-md"
            >
              {savedSuccess ? <Check className="w-4 h-4" /> : null}
              <span>{savedSuccess ? 'Сохранено!' : 'Сохранить настройки'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

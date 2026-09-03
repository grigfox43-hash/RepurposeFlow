'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { LandingPage } from '@/components/LandingPage';
import { Dashboard } from '@/components/Dashboard';
import { UploadModal } from '@/components/UploadModal';
import { ProcessingState } from '@/components/ProcessingState';
import { StudioEditor } from '@/components/StudioEditor';
import { SettingsModal } from '@/components/SettingsModal';
import { LanguageProvider } from '@/context/LanguageContext';
import {
  getStoredJobs,
  saveStoredJobs,
  getStoredUser,
  saveStoredUser
} from '@/lib/store';
import { MediaJob, UserProfile } from '@/types';

function AppContent() {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'studio'>('landing');
  const [user, setUser] = useState<UserProfile>(getStoredUser);
  const [jobs, setJobs] = useState<MediaJob[]>([]);
  const [activeJob, setActiveJob] = useState<MediaJob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Modals
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Load jobs from real database API on mount
  useEffect(() => {
    setUser(getStoredUser());
    const loadFromDb = async () => {
      try {
        const res = await fetch('/api/db/jobs');
        if (res.ok) {
          const data = await res.json();
          if (data.jobs) {
            setJobs(data.jobs);
            saveStoredJobs(data.jobs);
            if (data.jobs.length > 0) {
              setActiveJob(data.jobs[0]);
            }
            return;
          }
        }
      } catch (err) {
        console.warn('Database fetch fallback to local storage:', err);
      }

      // Fallback to local storage
      const local = getStoredJobs();
      setJobs(local);
      if (local.length > 0) {
        setActiveJob(local[0]);
      }
    };

    loadFromDb();
  }, []);

  const handleUpdateUser = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    saveStoredUser(updatedUser);
  };

  const handleUpdateJobs = (updatedJobs: MediaJob[]) => {
    setJobs(updatedJobs);
    saveStoredJobs(updatedJobs);
  };

  const activeWorkspace =
    user.workspaces.find((ws) => ws.id === user.activeWorkspaceId) ||
    user.workspaces[0];

  const handleSelectWorkspace = (wsId: string) => {
    const updated = { ...user, activeWorkspaceId: wsId };
    handleUpdateUser(updated);
  };

  const handleJobStarted = (newJob: MediaJob) => {
    const updatedJobs = [newJob, ...jobs];
    handleUpdateJobs(updatedJobs);

    const updatedUser = {
      ...user,
      minutesUsed: user.minutesUsed + (newJob.minutesCharged || 30)
    };
    handleUpdateUser(updatedUser);

    setActiveJob(newJob);
    setIsProcessing(true);
    setCurrentView('studio');
  };

  const handleJobCompleted = () => {
    setIsProcessing(false);
  };

  const handleOpenStudio = (job: MediaJob) => {
    setActiveJob(job);
    setIsProcessing(false);
    setCurrentView('studio');
  };

  const handleDeleteJob = async (jobId: string) => {
    const updated = jobs.filter((j) => j.id !== jobId);
    handleUpdateJobs(updated);
    if (activeJob?.id === jobId) {
      setActiveJob(updated[0] || null);
    }

    // Delete in real database
    try {
      await fetch(`/api/db/jobs/${jobId}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('Failed to delete job from DB:', err);
    }
  };

  const handleUpdateActiveJob = (updatedJob: MediaJob) => {
    setActiveJob(updatedJob);
    const updatedJobs = jobs.map((j) => (j.id === updatedJob.id ? updatedJob : j));
    handleUpdateJobs(updatedJobs);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans">
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          if (view === 'studio' && !activeJob && jobs.length > 0) {
            setActiveJob(jobs[0]);
          }
          setCurrentView(view);
        }}
        user={user}
        activeWorkspace={activeWorkspace}
        onSelectWorkspace={handleSelectWorkspace}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <main>
        {currentView === 'landing' && (
          <LandingPage
            onStart={() => {
              if (jobs.length > 0) {
                setActiveJob(jobs[0]);
                setCurrentView('studio');
              } else {
                setCurrentView('dashboard');
              }
            }}
          />
        )}

        {currentView === 'dashboard' && (
          <Dashboard
            user={user}
            activeWorkspace={activeWorkspace}
            jobs={jobs}
            onOpenUpload={() => setIsUploadOpen(true)}
            onOpenStudio={handleOpenStudio}
            onDeleteJob={handleDeleteJob}
          />
        )}

        {currentView === 'studio' && (
          <div>
            {isProcessing && activeJob ? (
              <ProcessingState job={activeJob} onComplete={handleJobCompleted} />
            ) : activeJob ? (
              <StudioEditor
                job={activeJob}
                onBackToDashboard={() => setCurrentView('dashboard')}
                onUpdateJob={handleUpdateActiveJob}
              />
            ) : (
              <div className="py-24 text-center text-slate-400">
                <p>Нет выбранного проекта.</p>
                <button
                  onClick={() => setIsUploadOpen(true)}
                  className="mt-4 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold transition"
                >
                  Создать новый проект
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        user={user}
        activeWorkspaceId={activeWorkspace.id}
        onJobStarted={handleJobStarted}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}

export default function Home() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

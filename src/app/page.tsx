'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { LandingPage } from '@/components/LandingPage';
import { Dashboard } from '@/components/Dashboard';
import { UploadModal } from '@/components/UploadModal';
import { ProcessingState } from '@/components/ProcessingState';
import { StudioEditor } from '@/components/StudioEditor';
import { BillingModal } from '@/components/BillingModal';
import { SettingsModal } from '@/components/SettingsModal';
import {
  getStoredJobs,
  saveStoredJobs,
  getStoredUser,
  saveStoredUser
} from '@/lib/store';
import { MediaJob, UserProfile } from '@/types';

export default function Home() {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'studio'>('landing');
  const [user, setUser] = useState<UserProfile>(getStoredUser);
  const [jobs, setJobs] = useState<MediaJob[]>(getStoredJobs);
  const [activeJob, setActiveJob] = useState<MediaJob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Modals
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isBillingOpen, setIsBillingOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    // Sync with storage on mount
    setUser(getStoredUser());
    const loadedJobs = getStoredJobs();
    setJobs(loadedJobs);
    if (loadedJobs.length > 0) {
      setActiveJob(loadedJobs[0]);
    }
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

    // Charge minutes
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

  const handleDeleteJob = (jobId: string) => {
    const updated = jobs.filter((j) => j.id !== jobId);
    handleUpdateJobs(updated);
    if (activeJob?.id === jobId) {
      setActiveJob(updated[0] || null);
    }
  };

  const handleUpdateActiveJob = (updatedJob: MediaJob) => {
    setActiveJob(updatedJob);
    const updatedJobs = jobs.map((j) => (j.id === updatedJob.id ? updatedJob : j));
    handleUpdateJobs(updatedJobs);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
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
        onOpenBilling={() => setIsBillingOpen(true)}
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
            onSelectPlan={(planId) => {
              const minutesMap = { starter: 120, pro: 360, agency: 1200 };
              handleUpdateUser({
                ...user,
                plan: planId,
                minutesTotal: minutesMap[planId]
              });
              setCurrentView('dashboard');
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
            onOpenBilling={() => setIsBillingOpen(true)}
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
              <div className="py-20 text-center text-slate-400">
                <p>Нет выбранного проекта.</p>
                <button
                  onClick={() => setIsUploadOpen(true)}
                  className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
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

      <BillingModal
        isOpen={isBillingOpen}
        onClose={() => setIsBillingOpen(false)}
        user={user}
        onUpdateUser={handleUpdateUser}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}

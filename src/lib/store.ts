'use client';

import { MediaJob, UserProfile, Workspace } from '@/types';

export const INITIAL_WORKSPACES: Workspace[] = [
  { id: 'ws-personal', name: 'Личный бренд', slug: 'founder-personal', isAgencyClient: false, jobsCount: 0 },
  { id: 'ws-client-agency', name: 'Клиентский проект', slug: 'client-project', isAgencyClient: true, clientName: 'Client Alpha', jobsCount: 0 }
];

export const INITIAL_USER: UserProfile = {
  id: 'user-001',
  email: 'founder@repurposeflow.io',
  name: 'Expert Founder',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  plan: 'pro',
  minutesTotal: 360,
  minutesUsed: 0,
  workspaces: INITIAL_WORKSPACES,
  activeWorkspaceId: 'ws-personal'
};

export function getStoredJobs(): MediaJob[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('repurposeflow_jobs');
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveStoredJobs(jobs: MediaJob[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('repurposeflow_jobs', JSON.stringify(jobs));
  } catch (err) {
    console.error('Failed to persist jobs locally:', err);
  }
}

export function getStoredUser(): UserProfile {
  if (typeof window === 'undefined') return INITIAL_USER;
  try {
    const raw = localStorage.getItem('repurposeflow_user');
    if (!raw) {
      localStorage.setItem('repurposeflow_user', JSON.stringify(INITIAL_USER));
      return INITIAL_USER;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_USER;
  }
}

export function saveStoredUser(user: UserProfile) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('repurposeflow_user', JSON.stringify(user));
  } catch (err) {
    console.error('Failed to persist user:', err);
  }
}

'use client';

import { MediaJob, UserProfile, Workspace } from '@/types';

export const INITIAL_WORKSPACES: Workspace[] = [
  { id: 'ws-main', name: 'Основной воркспейс', slug: 'main-workspace', isAgencyClient: false, jobsCount: 0 }
];

export function createFreshUser(authenticated = false): UserProfile {
  let uid = 'usr-' + Math.random().toString(36).substring(2, 9);
  if (typeof window !== 'undefined') {
    const existingUid = localStorage.getItem('repurposeflow_user_id');
    if (existingUid) {
      uid = existingUid;
    } else {
      localStorage.setItem('repurposeflow_user_id', uid);
    }
  }

  return {
    id: uid,
    email: '',
    name: authenticated ? 'Пользователь' : '',
    avatarUrl: '',
    plan: 'pro',
    minutesTotal: 360,
    minutesUsed: 0,
    isAuthenticated: authenticated,
    workspaces: [
      { id: `ws-${uid.slice(0, 6)}`, name: 'Личный воркспейс', slug: 'my-workspace', isAgencyClient: false, jobsCount: 0 }
    ],
    activeWorkspaceId: `ws-${uid.slice(0, 6)}`
  };
}

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
  if (typeof window === 'undefined') return createFreshUser(false);
  try {
    const raw = localStorage.getItem('repurposeflow_user');
    if (!raw) {
      const fresh = createFreshUser(false);
      localStorage.setItem('repurposeflow_user', JSON.stringify(fresh));
      return fresh;
    }
    return JSON.parse(raw);
  } catch {
    return createFreshUser(false);
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

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

export function getStoredAccounts(): UserProfile[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('repurposeflow_accounts');
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveStoredAccount(user: UserProfile) {
  if (typeof window === 'undefined') return;
  try {
    const accounts = getStoredAccounts();
    const idx = accounts.findIndex((a) => a.email.toLowerCase() === user.email.toLowerCase());
    if (idx >= 0) {
      accounts[idx] = user;
    } else {
      accounts.push(user);
    }
    localStorage.setItem('repurposeflow_accounts', JSON.stringify(accounts));
  } catch (err) {
    console.error('Failed to save account:', err);
  }
}

export function findAccountByEmail(email: string): UserProfile | null {
  const accounts = getStoredAccounts();
  return accounts.find((a) => a.email.toLowerCase() === email.toLowerCase().trim()) || null;
}

export function registerUser(name: string, email: string): UserProfile {
  const existing = findAccountByEmail(email);
  if (existing) {
    const updated: UserProfile = {
      ...existing,
      name: name.trim() || existing.name,
      isAuthenticated: true
    };
    saveStoredAccount(updated);
    saveStoredUser(updated);
    return updated;
  }

  const uid = 'usr-' + Math.random().toString(36).substring(2, 9);
  const newUser: UserProfile = {
    id: uid,
    email: email.trim(),
    name: name.trim() || email.split('@')[0],
    avatarUrl: '',
    plan: 'pro',
    minutesTotal: 360,
    minutesUsed: 0,
    isAuthenticated: true,
    workspaces: [
      { id: `ws-${uid.slice(0, 6)}`, name: 'Личный воркспейс', slug: 'my-workspace', isAgencyClient: false, jobsCount: 0 }
    ],
    activeWorkspaceId: `ws-${uid.slice(0, 6)}`
  };

  saveStoredAccount(newUser);
  saveStoredUser(newUser);
  return newUser;
}

export function loginUser(email: string): UserProfile {
  const existing = findAccountByEmail(email);
  if (existing) {
    const loggedIn: UserProfile = {
      ...existing,
      isAuthenticated: true
    };
    saveStoredAccount(loggedIn);
    saveStoredUser(loggedIn);
    return loggedIn;
  }

  return registerUser('', email);
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
    if (user.email) {
      saveStoredAccount(user);
    }
  } catch (err) {
    console.error('Failed to persist user:', err);
  }
}

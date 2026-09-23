// ─── API Client ───────────────────────────────────────────────────────────────
// Centralized fetch wrapper for the Feedants backend API.

import { ApiResponse, Competition, RegistrationResult } from '../types/competition';

// Dynamic API base URL: works across Expo web, local browser, and emulators
const getApiBase = (): string => {
  if (typeof window !== 'undefined' && window.location) {
    const host = window.location.hostname || 'localhost';
    return `http://${host}:5000/api`;
  }
  return 'http://localhost:5000/api';
};

const API_BASE = getApiBase();

class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
    ...options,
  });

  const json = (await res.json()) as ApiResponse<T>;

  if (!res.ok) {
    throw new ApiError(
      res.status,
      (json as any).code ?? 'UNKNOWN_ERROR',
      json.message ?? 'An unexpected error occurred.',
    );
  }

  return json.data;
}

/**
 * GET /api/competitions
 * Returns list of all competitions.
 */
export const fetchCompetitionsList = (): Promise<
  Array<{
    id: string;
    title: string;
    category: string;
    status: string;
    spots: { total: number; registered: number; remaining: number; isFull: boolean; progressPercentage: number };
  }>
> => apiFetch('/competitions');

/**
 * GET /api/competitions/:id
 * Returns full competition details with dynamic lifecycle state and user participation state.
 */
export const fetchCompetition = (
  competitionId: string,
  userId?: string | null,
): Promise<Competition> => {
  const query = userId ? `?userId=${encodeURIComponent(userId)}` : '';
  return apiFetch<Competition>(`/competitions/${competitionId}${query}`);
};

/**
 * POST /api/competitions/:id/register
 * Registers a user for a competition (atomic, concurrency-safe).
 */
export const registerForCompetition = (
  competitionId: string,
  userId: string,
): Promise<RegistrationResult> =>
  apiFetch<RegistrationResult>(`/competitions/${competitionId}/register`, {
    method: 'POST',
    body: JSON.stringify({ userId }),
  });

/**
 * DELETE /api/competitions/:id/register
 * Cancels an existing registration.
 */
export const cancelRegistration = (
  competitionId: string,
  userId: string,
): Promise<{ message: string }> =>
  apiFetch(`/competitions/${competitionId}/register`, {
    method: 'DELETE',
    body: JSON.stringify({ userId }),
  });

/**
 * GET /api/competitions/:id/participation
 * Checks a user's participation status in a competition.
 */
export const checkParticipation = (
  competitionId: string,
  userId: string,
) =>
  apiFetch(`/competitions/${competitionId}/participation?userId=${encodeURIComponent(userId)}`);

export { ApiError };

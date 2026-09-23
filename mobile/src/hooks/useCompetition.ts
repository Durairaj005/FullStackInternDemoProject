// ─── useCompetition Hook ──────────────────────────────────────────────────────
// Manages dynamic fetching of competition details, user participation state,
// real-time countdown updates, and atomic registration / cancellation.

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  fetchCompetition,
  fetchCompetitionsList,
  registerForCompetition,
  cancelRegistration,
  ApiError,
} from '../api/competitionApi';
import { Competition } from '../types/competition';

interface UseCompetitionState {
  competition: Competition | null;
  loading: boolean;
  error: string | null;
  registering: boolean;
  registrationError: string | null;
  countdownSeconds: number;
  userId: string;
  setUserId: (userId: string) => void;
  register: () => Promise<void>;
  cancel: () => Promise<void>;
  refresh: () => Promise<void>;
  clearError: () => void;
}

export const useCompetition = (
  competitionId: string = 'default',
  initialUserId: string = 'demo_user_001',
): UseCompetitionState => {
  const [userId, setUserId] = useState<string>(initialUserId);
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [registering, setRegistering] = useState(false);
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const [countdownSeconds, setCountdownSeconds] = useState(0);

  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCountdown = useCallback((seconds: number) => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    setCountdownSeconds(seconds);

    if (seconds <= 0) return;

    countdownRef.current = setInterval(() => {
      setCountdownSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const loadCompetition = useCallback(async (isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true);
      setError(null);

      let targetId = competitionId;
      if (!targetId || targetId === 'default') {
        const list = await fetchCompetitionsList();
        const activeComp = list.find((c) => c.status === 'ACTIVE' || c.category === 'Dance') || list[0];
        if (activeComp) {
          targetId = activeComp.id;
        }
      }

      if (!targetId) {
        throw new Error('No competitions found.');
      }

      const data = await fetchCompetition(targetId, userId);
      setCompetition(data);
      startCountdown(data.lifecycle.registrationClosesInSeconds);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to load competition details. Please ensure backend server is running on port 5000.');
      }
    } finally {
      if (!isRefresh) setLoading(false);
    }
  }, [competitionId, userId, startCountdown]);

  useEffect(() => {
    loadCompetition();
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [loadCompetition]);

  const register = useCallback(async () => {
    if (!competition) return;
    try {
      setRegistering(true);
      setRegistrationError(null);
      await registerForCompetition(competition.id, userId);
      // Immediately reload data to get updated spot counts and userState
      await loadCompetition(true);
    } catch (err) {
      if (err instanceof ApiError) {
        setRegistrationError(err.message);
        throw err;
      } else {
        const fallbackMsg = 'Registration failed. Please check network connection.';
        setRegistrationError(fallbackMsg);
        throw new Error(fallbackMsg);
      }
    } finally {
      setRegistering(false);
    }
  }, [competition, userId, loadCompetition]);

  const cancel = useCallback(async () => {
    if (!competition) return;
    try {
      setRegistering(true);
      setRegistrationError(null);
      await cancelRegistration(competition.id, userId);
      await loadCompetition(true);
    } catch (err) {
      if (err instanceof ApiError) {
        setRegistrationError(err.message);
        throw err;
      } else {
        const fallbackMsg = 'Cancellation failed. Please check network connection.';
        setRegistrationError(fallbackMsg);
        throw new Error(fallbackMsg);
      }
    } finally {
      setRegistering(false);
    }
  }, [competition, userId, loadCompetition]);

  const clearError = useCallback(() => {
    setRegistrationError(null);
    setError(null);
  }, []);

  return {
    competition,
    loading,
    error,
    registering,
    registrationError,
    countdownSeconds,
    userId,
    setUserId,
    register,
    cancel,
    refresh: () => loadCompetition(true),
    clearError,
  };
};

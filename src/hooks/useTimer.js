import { useState, useEffect, useRef, useCallback } from 'react';

export function useTimer(initialSeconds, { enabled = true, onComplete, onTick } = {}) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [paused, setPaused] = useState(false);
  const onCompleteRef = useRef(onComplete);
  const onTickRef = useRef(onTick);
  onCompleteRef.current = onComplete;
  onTickRef.current = onTick;

  useEffect(() => {
    setTimeLeft(initialSeconds);
    setPaused(false);
  }, [initialSeconds]);

  useEffect(() => {
    if (!enabled || paused || timeLeft <= 0) return;
    const id = setInterval(() => {
      setTimeLeft(prev => {
        const next = prev - 1;
        if (onTickRef.current) onTickRef.current(next);
        if (next <= 0) {
          clearInterval(id);
          if (onCompleteRef.current) onCompleteRef.current();
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [enabled, paused, timeLeft > 0]);

  const pause = useCallback(() => setPaused(true), []);
  const resume = useCallback(() => setPaused(false), []);
  const reset = useCallback((s) => { setTimeLeft(s ?? initialSeconds); setPaused(false); }, [initialSeconds]);

  return { timeLeft, paused, pause, resume, reset };
}

export function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

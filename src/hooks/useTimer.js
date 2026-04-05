import { useState, useEffect, useRef, useCallback } from 'react';

export function useTimer(initialSeconds, onExpire) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  const start = useCallback(() => setRunning(true), []);
  const pause = useCallback(() => setRunning(false), []);
  const reset = useCallback((newSeconds) => {
    setRunning(false);
    setSeconds(newSeconds ?? initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (!running) {
      clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setRunning(false);
          onExpireRef.current?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const formatted = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

  return { seconds, formatted, running, start, pause, reset };
}

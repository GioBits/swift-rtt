import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom Hook to manage a timer with a time limit.
 * @param {boolean} isRunning - Indicates whether the timer is active.
 * @param {function} onLimitReached - Callback triggered when the time limit is reached.
 * @param {number} timeLimit - Time limit in seconds (default: 30).
 * @returns {object} - elapsedTime and formatted time string.
 */
export const useTimer = (isRunning, onLimitReached, timeLimit = 30) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      setElapsedTime(0);
      timerRef.current = setInterval(() => {
        setElapsedTime((prevTime) => {
          const newTime = prevTime + 1;
          if (newTime >= timeLimit) {
            clearInterval(timerRef.current);
            onLimitReached();
            return timeLimit;
          }
          return newTime;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, onLimitReached, timeLimit]);

  const formatTime = useCallback((seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return { elapsedTime, formatTime };
};

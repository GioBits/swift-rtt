import { useState, useEffect, useCallback } from 'react';

/**
 * Custom Hook to manage a timer with a time limit.
 * @param {boolean} isRunning - Indicates whether the timer is active.
 * @param {function} onLimitReached - Callback triggered when the time limit is reached.
 * @param {number} timeLimit - Time limit in seconds (default: 30).
 * @returns {object} - elapsedTime and formatted time string.
 */
export const useTimer = (isRunning, onLimitReached, timeLimit = 30) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let timer;
    if (isRunning) {
      setElapsedTime(0);
      timer = setInterval(() => {
        setElapsedTime((prevTime) => {
          const newTime = prevTime + 1;
          if (newTime >= timeLimit) {
            onLimitReached();
            return timeLimit;
          }
          return newTime;
        });
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isRunning, onLimitReached, timeLimit]);

  /**
   * Formats the time in mm:ss format.
   * @param {number} seconds - Total elapsed time in seconds.
   * @returns {string} - Formatted time string.
   */
  const formatTime = useCallback((seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return { elapsedTime, formatTime };
};

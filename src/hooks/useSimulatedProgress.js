import { useState, useEffect, useRef } from 'react';

/**
 * Hook to simulate progress for better UX
 * @param {boolean} isLoading - Trigger to start/stop simulation
 * @param {number} startValue - Initial jump value (default 30)
 * @returns {number} Current simulated progress (0-100)
 */
export const useSimulatedProgress = (isLoading, startValue = 30) => {
    const [progress, setProgress] = useState(0);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (isLoading) {
            // Instant jump to start value
            setProgress(startValue);

            // Clear any existing interval
            if (intervalRef.current) clearInterval(intervalRef.current);

            // Start incrementing
            intervalRef.current = setInterval(() => {
                setProgress((prev) => {
                    // Cap at 90% to wait for actual completion
                    if (prev >= 90) {
                        return 90;
                    }
                    // Add random small increment (1-3%)
                    const increment = Math.random() * 2 + 1;
                    return Math.min(prev + increment, 90);
                });
            }, 800); // Update every 800ms
        } else {
            // When loading stops, if we were progressing, jump to 100
            if (progress > 0 && progress < 100) {
                setProgress(100);
            } else if (progress === 100) {
                // Optional: after a delay, reset to 0? 
                // For now, let the consuming component handle unmounting/resetting via new isLoading flow
            } else {
                setProgress(0);
            }

            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isLoading, startValue]);

    return Math.round(progress);
};

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
            setProgress(0);
            let currentProgress = 0;
            const targetRamp = startValue; // Usually 30

            // Clear any existing interval
            if (intervalRef.current) clearInterval(intervalRef.current);

            // Phase 1: Speed Ramp (0 to targetRamp)
            // We use a shorter interval for smooth animation
            intervalRef.current = setInterval(() => {
                if (currentProgress < targetRamp) {
                    // Acceleration logic: small steps at start, larger towards the end
                    // Between 0-10: increment ~0.5
                    // Between 10-30: increment ~1.5
                    const increment = currentProgress < 10 ? 0.4 : 1.6;
                    currentProgress = Math.min(currentProgress + increment, targetRamp);
                    setProgress(currentProgress);
                } else {
                    // Phase 2: Slow Maintenance (targetRamp to 90)
                    // Once we hit the ramp target, switch to slower random increments
                    // This happens within the same interval but at a lower effective rate
                    // (We could switch intervals but simpler to just gate it with a counter or random chance)
                    if (Math.random() > 0.9) { // Only increment roughly every 10 ticks (~500ms effective)
                        const slowIncrement = Math.random() * 1.5 + 0.5;
                        currentProgress = Math.min(currentProgress + slowIncrement, 90);
                        setProgress(currentProgress);
                    }
                }
            }, 50); // High frequency (50ms) for Phase 1 smoothness
        } else {
            // When loading stops, if we were progressing, jump to 100
            if (progress > 0 && progress < 100) {
                setProgress(100);
            } else if (progress === 100) {
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

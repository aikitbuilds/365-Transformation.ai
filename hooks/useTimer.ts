import { useState, useEffect, useRef, useCallback } from 'react';

export const useTimer = (initialSeconds: number) => {
    const [seconds, setSeconds] = useState(initialSeconds);
    const [isActive, setIsActive] = useState(false);
    // FIX: Replaced NodeJS.Timeout with `number` for browser compatibility, as `setInterval` in the browser returns a number.
    const intervalRef = useRef<number | null>(null);

    const toggle = useCallback(() => {
        setIsActive(!isActive);
    }, [isActive]);

    const reset = useCallback(() => {
        setIsActive(false);
        setSeconds(initialSeconds);
    }, [initialSeconds]);

    useEffect(() => {
        if (isActive && seconds > 0) {
            intervalRef.current = setInterval(() => {
                setSeconds(prevSeconds => prevSeconds - 1);
            }, 1000);
        } else if (!isActive || seconds === 0) {
            if(intervalRef.current) clearInterval(intervalRef.current);
            if (seconds === 0) setIsActive(false);
        }

        return () => {
            if(intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isActive, seconds]);

    const formatTime = useCallback(() => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }, [seconds]);

    return { seconds, isActive, toggle, reset, formatTime };
};

import { useState, useEffect } from 'react';

interface AnimatedCounterProps {
    target: number;
    suffix?: string;
    prefix?: string;
    duration?: number;
    decimals?: number;
    className?: string;
}

export default function AnimatedCounter({
    target,
    suffix = '',
    prefix = '',
    duration = 1500,
    decimals = 0,
    className = '',
}: AnimatedCounterProps) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime: number | null = null;
        const startValue = 0;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = startValue + (target - startValue) * eased;
            setCount(current);
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        const raf = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(raf);
    }, [target, duration]);

    const formatted = decimals > 0 ? count.toFixed(decimals) : Math.round(count).toLocaleString();

    return (
        <span className={`font-mono-data ${className}`}>
            {prefix}{formatted}{suffix}
        </span>
    );
}

import React, { useEffect, useState, useRef } from 'react';

interface AnimatedCounterProps {
  value: number;
  durationMs?: number;
  prefix?: string;
  decimals?: number;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  durationMs = 800,
  prefix = '$',
  decimals = 2,
  className = '',
}) => {
  const [displayValue, setDisplayValue] = useState<number>(value);
  const [isIncrementing, setIsIncrementing] = useState<boolean>(false);
  const prevValueRef = useRef<number>(value);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const startVal = prevValueRef.current;
    const endVal = value;

    if (startVal === endVal) {
      setDisplayValue(endVal);
      return;
    }

    if (endVal > startVal) {
      setIsIncrementing(true);
      const timer = setTimeout(() => setIsIncrementing(false), durationMs + 200);
    }

    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / durationMs);

      // Ease-out cubic curve: 1 - pow(1 - progress, 3)
      const ease = 1 - Math.pow(1 - progress, 3);
      const currentNumeric = startVal + (endVal - startVal) * ease;

      setDisplayValue(currentNumeric);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(endVal);
        prevValueRef.current = endVal;
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [value, durationMs]);

  return (
    <span
      className={`transition-colors duration-300 font-mono tabular-nums ${
        isIncrementing ? 'text-emerald-300 scale-[1.02]' : ''
      } ${className}`}
    >
      {prefix}
      {displayValue.toFixed(decimals)}
    </span>
  );
};

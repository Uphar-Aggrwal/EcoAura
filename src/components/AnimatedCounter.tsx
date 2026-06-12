'use client';

import React, { useEffect, useState } from 'react';

interface AnimatedCounterProps {
  target: number;
  duration?: number;
  color: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ target, duration = 2000, color }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Easing: ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(parseFloat((eased * target).toFixed(1)));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [target, duration]);

  return (
    <span
      className="text-6xl font-black tabular-nums"
      style={{ color, textShadow: `0 0 30px ${color}60` }}
    >
      {count}
    </span>
  );
};

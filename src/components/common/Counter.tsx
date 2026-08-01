import React, { useEffect, useRef, useState } from 'react';
import { useInView, animate } from 'framer-motion';

export interface CounterProps {
  target: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  duration?: number;
}

export const Counter: React.FC<CounterProps> = ({
  target,
  suffix = '',
  prefix = '',
  decimals = 0,
  duration = 2,
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (isInView) {
      const controls = animate(0, target, {
        duration,
        ease: 'easeOut',
        onUpdate(value) {
          setCount(value);
        },
      });
      return () => controls.stop();
    }
  }, [isInView, target, duration]);

  const formattedValue = count.toFixed(decimals);

  return (
    <span ref={ref} className="font-extrabold font-['Outfit']">
      {prefix}
      {isInView ? formattedValue : '0'}
      {suffix}
    </span>
  );
};

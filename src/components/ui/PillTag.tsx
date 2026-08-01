import React from 'react';
import { cn } from '../../utils/cn';

interface PillTagProps {
  children: React.ReactNode;
  variant?: 'light' | 'dark';
  className?: string;
}

export const PillTag: React.FC<PillTagProps> = ({ children, variant = 'light', className }) => {
  return (
    <span
      className={cn(
        "inline-block px-3.5 py-1 text-xs font-bold uppercase tracking-wider rounded-full mb-3",
        variant === 'light' ? "bg-[#e6f4ec] text-[#0D7A41]" : "bg-[#0D7A41]/20 text-emerald-400",
        className
      )}
    >
      {children}
    </span>
  );
};

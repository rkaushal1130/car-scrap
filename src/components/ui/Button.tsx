import React from 'react';
import { cn } from '../../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'green' | 'orange' | 'dark' | 'outline' | 'text';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
  block?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'green',
  size = 'md',
  children,
  icon,
  block = false,
  className,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs rounded-md",
    md: "px-5 py-2.5 text-sm rounded-md",
    lg: "px-7 py-3.5 text-base rounded-md",
  };

  const variantStyles = {
    green: "bg-[#0D7A41] hover:bg-[#07542b] text-white shadow-md hover:shadow-lg hover:-translate-y-0.5",
    orange: "bg-[#F97316] hover:bg-[#d95d03] text-white rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5",
    dark: "bg-gray-800 hover:bg-gray-900 text-white hover:-translate-y-0.5",
    outline: "border border-white/30 text-white hover:bg-white/10 hover:border-white",
    text: "text-[#0D7A41] font-semibold hover:underline p-0 bg-transparent shadow-none",
  };

  return (
    <button
      className={cn(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        block && "w-full",
        className
      )}
      {...props}
    >
      {children}
      {icon && <span>{icon}</span>}
    </button>
  );
};

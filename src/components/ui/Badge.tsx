import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'orange' | 'gray';
}

const Badge: React.FC<BadgeProps> = ({ children, className, variant = 'gray' }) => {
  const variants = {
    orange: "bg-primary-50 text-primary-800",
    gray: "bg-gray-100 text-gray-800",
  };

  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", variants[variant], className)}>
      {children}
    </span>
  );
};

export default Badge;
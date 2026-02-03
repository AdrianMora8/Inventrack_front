import React from 'react';
import clsx from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'gray';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'gray',
  size = 'md',
}) => {
  const variants = {
    success: 'bg-success-800 text-success-100 border border-success-600',
    warning: 'bg-warning-800 text-warning-100 border border-warning-600',
    danger: 'bg-danger-700 text-danger-100 border border-danger-600',
    info: 'bg-info-600 text-info-100 border border-info-500',
    gray: 'bg-dark-100 text-text-secondary border border-dark-200',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full font-medium',
        variants[variant],
        sizes[size]
      )}
    >
      {children}
    </span>
  );
};

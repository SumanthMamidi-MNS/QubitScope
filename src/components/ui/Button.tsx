import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost' | 'glow';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  variant = 'secondary',
  size = 'md',
  disabled,
  ...props
}) => {
  const baseStyle =
    'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer';

  const variants = {
    primary:
      'bg-blue-600 hover:bg-blue-500 text-white shadow-lg hover:shadow-blue-500/20 focus:ring-blue-500 border border-blue-500/10',
    secondary:
      'bg-slate-800 hover:bg-slate-700 text-slate-100 hover:text-white border border-white/5 focus:ring-slate-500',
    danger:
      'bg-rose-600 hover:bg-rose-500 text-white shadow-lg hover:shadow-rose-500/20 focus:ring-rose-500 border border-rose-500/10',
    outline:
      'bg-transparent hover:bg-white/5 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500 focus:ring-slate-500',
    ghost:
      'bg-transparent hover:bg-white/5 text-slate-400 hover:text-slate-200 focus:ring-slate-500',
    glow:
      'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] focus:ring-cyan-500 transition-shadow',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
export default Button;

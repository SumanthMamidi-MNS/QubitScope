import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  glowColor?: 'cyan' | 'blue' | 'coral' | 'purple' | 'none';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = true,
  glowColor = 'none',
  ...props
}) => {
  const glowClasses = {
    cyan: 'hover:shadow-[0_0_25px_rgba(6,182,212,0.12)]',
    blue: 'hover:shadow-[0_0_25px_rgba(59,130,246,0.12)]',
    coral: 'hover:shadow-[0_0_25px_rgba(244,63,94,0.12)]',
    purple: 'hover:shadow-[0_0_25px_rgba(139,92,246,0.12)]',
    none: '',
  };

  return (
    <div
      className={`glass-panel p-6 ${hover ? 'glass-panel-hover' : ''} ${glowClasses[glowColor]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <div className={`mb-4 flex items-center justify-between ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <h3 className={`text-lg font-medium tracking-tight text-slate-100 ${className}`} {...props}>
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <p className={`text-xs text-slate-400 ${className}`} {...props}>
    {children}
  </p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <div className={className} {...props}>
    {children}
  </div>
);

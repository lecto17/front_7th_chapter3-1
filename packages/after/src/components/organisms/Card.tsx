import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const cardVariants = cva(
  'card',
  {
    variants: {
      variant: {
        default: 'card-default',
        bordered: 'card-bordered',
        elevated: 'card-elevated',
        flat: 'card-flat',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface CardProps extends VariantProps<typeof cardVariants> {
  children?: React.ReactNode;
  title?: string;
  subtitle?: string;
  headerActions?: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  variant = 'default',
  headerActions,
  className,
}) => {
  return (
    <div className={cardVariants({ variant, className })}>
      {(title || subtitle || headerActions) && (
        <div className="card-header">
          <div>
            {title && <h3 className="card-title">{title}</h3>}
            {subtitle && <p className="card-subtitle">{subtitle}</p>}
          </div>
          {headerActions && <div>{headerActions}</div>}
        </div>
      )}
      <div className="card-body">{children}</div>
    </div>
  );
};

import React from 'react';

import { Box, styled } from '@mui/material';
import { alpha } from '@mui/material/styles';

// ============================================================================
// CARD COMPONENT - Design System Shared UI
// ============================================================================

export interface CardProps {
  children: React.ReactNode;
  variant?: 'outlined' | 'elevated' | 'filled';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

const StyledCard = styled(Box)<{
  variant: 'outlined' | 'elevated' | 'filled';
  padding: 'none' | 'sm' | 'md' | 'lg';
  hoverable: boolean;
  selected: boolean;
  clickable: boolean;
}>(({ theme, variant, padding, hoverable, selected, clickable }) => ({
  borderRadius: theme.spacing(1.5),
  transition: 'all 0.2s ease-in-out',
  position: 'relative',
  overflow: 'hidden',
  cursor: clickable ? 'pointer' : 'default',

  // Padding variants
  ...(padding === 'none' && { padding: 0 }),
  ...(padding === 'sm' && { padding: theme.spacing(1) }),
  ...(padding === 'md' && { padding: theme.spacing(2) }),
  ...(padding === 'lg' && { padding: theme.spacing(3) }),

  // Base variant styles
  ...(variant === 'outlined' && {
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
  }),

  ...(variant === 'elevated' && {
    backgroundColor: theme.palette.background.paper,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  }),

  ...(variant === 'filled' && {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  }),

  // Selected state
  ...(selected && {
    borderColor: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
    boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
  }),

  // Hover effects
  ...(hoverable && {
    '&:hover': {
      ...(variant === 'outlined' && {
        borderColor: alpha(theme.palette.primary.main, 0.5),
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      }),

      ...(variant === 'elevated' && {
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
        transform: 'translateY(-2px)',
      }),

      ...(variant === 'filled' && {
        backgroundColor: alpha(theme.palette.primary.main, 0.08),
      }),
    },
  }),

  // Click animation
  ...(clickable && {
    '&:active': {
      transform: hoverable ? 'translateY(-1px)' : 'scale(0.98)',
    },
  }),
}));

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'outlined',
  padding = 'md',
  hoverable = false,
  selected = false,
  onClick,
  className,
}) => (
  <StyledCard
    variant={variant}
    padding={padding}
    hoverable={hoverable}
    selected={selected}
    clickable={!!onClick}
    onClick={onClick}
    className={className}
  >
    {children}
  </StyledCard>
);

export default Card;

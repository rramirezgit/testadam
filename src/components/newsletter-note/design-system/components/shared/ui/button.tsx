import React from 'react';

import { alpha } from '@mui/material/styles';
import { styled, Button as MUIButton } from '@mui/material';

// ============================================================================
// BUTTON COMPONENT - Design System Shared UI
// ============================================================================

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children?: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
}

const StyledButton = styled(MUIButton)<{
  customVariant?: ButtonProps['variant'];
  customSize?: ButtonProps['size'];
}>(({ theme, customVariant, customSize }) => ({
  // Base styles
  borderRadius: theme.spacing(1),
  fontWeight: 500,
  textTransform: 'none',
  transition: 'all 0.2s ease-in-out',
  position: 'relative',

  // Size variants
  ...(customSize === 'sm' && {
    fontSize: '0.875rem',
    padding: `${theme.spacing(0.75)} ${theme.spacing(2)}`,
    minHeight: 32,
  }),
  ...(customSize === 'md' && {
    fontSize: '0.95rem',
    padding: `${theme.spacing(1)} ${theme.spacing(2.5)}`,
    minHeight: 40,
  }),
  ...(customSize === 'lg' && {
    fontSize: '1rem',
    padding: `${theme.spacing(1.25)} ${theme.spacing(3)}`,
    minHeight: 48,
  }),
  ...(customSize === 'icon' && {
    minWidth: 40,
    width: 40,
    height: 40,
    padding: theme.spacing(1),
  }),

  // Color variants
  ...(customVariant === 'primary' && {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    boxShadow: `0 2px 4px ${alpha(theme.palette.primary.main, 0.2)}`,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
      boxShadow: `0 4px 8px ${alpha(theme.palette.primary.main, 0.3)}`,
      transform: 'translateY(-1px)',
    },
    '&:active': {
      transform: 'translateY(0)',
    },
  }),

  ...(customVariant === 'secondary' && {
    backgroundColor: theme.palette.grey[100],
    color: theme.palette.text.primary,
    border: `1px solid ${theme.palette.grey[300]}`,
    '&:hover': {
      backgroundColor: theme.palette.grey[200],
      borderColor: theme.palette.grey[400],
    },
  }),

  ...(customVariant === 'ghost' && {
    backgroundColor: 'transparent',
    color: theme.palette.text.primary,
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.1),
    },
  }),

  ...(customVariant === 'destructive' && {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.error.dark,
    },
  }),

  ...(customVariant === 'outline' && {
    backgroundColor: 'transparent',
    color: theme.palette.primary.main,
    border: `1px solid ${theme.palette.primary.main}`,
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.1),
    },
  }),
}));

const LoadingSpinner = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 16,
  height: 16,
  border: '2px solid transparent',
  borderTop: `2px solid ${theme.palette.primary.contrastText}`,
  borderRadius: '50%',
  animation: 'spin 1s linear infinite',
  '@keyframes spin': {
    '0%': { transform: 'translate(-50%, -50%) rotate(0deg)' },
    '100%': { transform: 'translate(-50%, -50%) rotate(360deg)' },
  },
}));

const IconWrapper = styled('span')<{ position: 'left' | 'right' }>(({ theme, position }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  marginLeft: position === 'right' ? theme.spacing(1) : 0,
  marginRight: position === 'left' ? theme.spacing(1) : 0,
}));

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      onClick,
      className,
      type = 'button',
      fullWidth = false,
      ...props
    },
    ref
  ) => (
    <StyledButton
      ref={ref}
      customVariant={variant}
      customSize={size}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={className}
      type={type}
      fullWidth={fullWidth}
      {...props}
    >
      {isLoading && <LoadingSpinner />}

      <span style={{ opacity: isLoading ? 0 : 1, display: 'flex', alignItems: 'center' }}>
        {leftIcon && <IconWrapper position="left">{leftIcon}</IconWrapper>}
        {children}
        {rightIcon && <IconWrapper position="right">{rightIcon}</IconWrapper>}
      </span>
    </StyledButton>
  )
);

Button.displayName = 'Button';

export default Button;

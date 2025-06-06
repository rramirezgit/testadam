import React from 'react';

import { Box, styled } from '@mui/material';
import { alpha } from '@mui/material/styles';

// ============================================================================
// TABS COMPONENT - Design System Shared UI
// ============================================================================

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  value: string;
  onChange: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'standard' | 'pills' | 'underline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const TabsContainer = styled(Box)<{
  orientation: 'horizontal' | 'vertical';
}>(({ orientation }) => ({
  display: 'flex',
  flexDirection: orientation === 'horizontal' ? 'row' : 'column',
  gap: orientation === 'horizontal' ? 4 : 2,
}));

const Tab = styled('button')<{
  active: boolean;
  variant: 'standard' | 'pills' | 'underline';
  size: 'sm' | 'md' | 'lg';
  orientation: 'horizontal' | 'vertical';
}>(({ theme, active, variant, size, orientation }) => ({
  // Base styles
  display: 'flex',
  alignItems: 'center',
  justifyContent: orientation === 'vertical' ? 'flex-start' : 'center',
  gap: theme.spacing(1),
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  fontFamily: theme.typography.fontFamily,
  fontWeight: active ? 600 : 500,
  transition: 'all 0.2s ease-in-out',
  position: 'relative',

  // Size variants
  ...(size === 'sm' && {
    fontSize: '0.875rem',
    padding: `${theme.spacing(0.75)} ${theme.spacing(1.5)}`,
    minHeight: 32,
  }),
  ...(size === 'md' && {
    fontSize: '0.95rem',
    padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
    minHeight: 40,
  }),
  ...(size === 'lg' && {
    fontSize: '1rem',
    padding: `${theme.spacing(1.25)} ${theme.spacing(2.5)}`,
    minHeight: 48,
  }),

  // Variant styles
  ...(variant === 'standard' && {
    color: active ? theme.palette.primary.main : theme.palette.text.secondary,
    borderBottom: active ? `2px solid ${theme.palette.primary.main}` : '2px solid transparent',
    '&:hover': {
      color: theme.palette.primary.main,
      backgroundColor: alpha(theme.palette.primary.main, 0.05),
    },
  }),

  ...(variant === 'pills' && {
    borderRadius: theme.spacing(1),
    color: active ? theme.palette.primary.contrastText : theme.palette.text.primary,
    backgroundColor: active ? theme.palette.primary.main : 'transparent',
    '&:hover': {
      backgroundColor: active ? theme.palette.primary.dark : alpha(theme.palette.primary.main, 0.1),
    },
  }),

  ...(variant === 'underline' && {
    color: active ? theme.palette.primary.main : theme.palette.text.secondary,
    '&:after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 2,
      backgroundColor: active ? theme.palette.primary.main : 'transparent',
      transition: 'background-color 0.2s ease-in-out',
    },
    '&:hover': {
      color: theme.palette.primary.main,
      '&:after': {
        backgroundColor: alpha(theme.palette.primary.main, 0.5),
      },
    },
  }),

  // Disabled state
  '&:disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
    pointerEvents: 'none',
  },
}));

const TabIcon = styled('span')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  fontSize: '1.1em',
}));

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  value,
  onChange,
  orientation = 'horizontal',
  variant = 'standard',
  size = 'md',
  className,
}) => (
  <TabsContainer
    className={className}
    orientation={orientation}
    role="tablist"
    aria-orientation={orientation}
  >
    {tabs.map((tab) => (
      <Tab
        key={tab.id}
        active={value === tab.id}
        variant={variant}
        size={size}
        orientation={orientation}
        onClick={() => onChange(tab.id)}
        disabled={tab.disabled}
        role="tab"
        aria-selected={value === tab.id}
        aria-controls={`tabpanel-${tab.id}`}
        id={`tab-${tab.id}`}
      >
        {tab.icon && <TabIcon>{tab.icon}</TabIcon>}
        {tab.label}
      </Tab>
    ))}
  </TabsContainer>
);

export default Tabs;

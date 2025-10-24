'use client';

import type React from 'react';
import type { AIOption } from 'src/types/magic-write';

import { Icon } from '@iconify/react';

import { Box, Card, alpha, Typography, CardContent } from '@mui/material';

interface AIOptionCardProps {
  option: AIOption;
  categoryColor: string;
  onClick: (event?: React.MouseEvent<HTMLElement>) => void;
  disabled?: boolean;
}

const AIOptionCard: React.FC<AIOptionCardProps> = ({
  option,
  categoryColor,
  onClick,
  disabled = false,
}) => (
  <Card
    onClick={disabled ? undefined : (e) => onClick(e)}
    sx={{
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1,
      transition: 'all 0.2s ease-in-out',
      border: '1px solid',
      borderColor: 'divider',
      '&:hover': disabled
        ? {}
        : {
            transform: 'translateY(-4px)',
            boxShadow: 4,
            borderColor: categoryColor,
            bgcolor: alpha(categoryColor, 0.02),
          },
    }}
  >
    <CardContent sx={{ p: 2.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
        {/* Ícono */}
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: alpha(categoryColor, 0.1),
            color: categoryColor,
            flexShrink: 0,
          }}
        >
          <Icon icon={option.icon} width={28} height={28} />
        </Box>

        {/* Contenido */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 0.5 }}>
            {option.label}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
            {option.description}
          </Typography>
        </Box>
      </Box>
    </CardContent>
  </Card>
);

export default AIOptionCard;

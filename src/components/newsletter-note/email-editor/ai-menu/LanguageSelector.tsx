'use client';

import { Icon } from '@iconify/react';
import type React from 'react';

import { Menu, Box, Typography, Card, alpha } from '@mui/material';

import { SUPPORTED_LANGUAGES } from 'src/types/magic-write';

interface LanguageSelectorProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  onSelectLanguage: (language: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  anchorEl,
  open,
  onClose,
  onSelectLanguage,
}) => {
  const handleLanguageClick = (languageCode: string) => {
    onSelectLanguage(languageCode);
    onClose();
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      PaperProps={{
        sx: {
          maxHeight: 500,
          width: 360,
          p: 2,
        },
      }}
    >
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, px: 1 }}>
        Selecciona el idioma de destino
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 1.5,
        }}
      >
        {SUPPORTED_LANGUAGES.map((language) => (
          <Card
            key={language.code}
            onClick={() => handleLanguageClick(language.code)}
            onMouseDown={(e) => e.preventDefault()}
            sx={{
              p: 2,
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
              transition: 'all 0.2s ease-in-out',
              border: '1px solid',
              borderColor: 'divider',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 3,
                borderColor: 'primary.main',
                bgcolor: alpha('#06b6d4', 0.02),
              },
            }}
          >
            <Icon icon={language.icon} width={32} height={32} />
            <Typography variant="body2" fontWeight={500} textAlign="center">
              {language.label}
            </Typography>
          </Card>
        ))}
      </Box>
    </Menu>
  );
};

export default LanguageSelector;

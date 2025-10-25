'use client';

import type React from 'react';

import { Icon } from '@iconify/react';

import { Box, Card, alpha, Dialog, Typography, DialogTitle, DialogContent } from '@mui/material';

import { SUPPORTED_LANGUAGES } from 'src/types/magic-write';

interface LanguageSelectorProps {
  open: boolean;
  onClose: () => void;
  onSelectLanguage: (language: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ open, onClose, onSelectLanguage }) => {
  const handleLanguageClick = (languageCode: string) => {
    onSelectLanguage(languageCode);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        <Typography variant="h6" fontWeight={600}>
          Selecciona el idioma de destino
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ px: 3, pb: 3 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 1.5,
            mt: 1,
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
      </DialogContent>
    </Dialog>
  );
};

export default LanguageSelector;

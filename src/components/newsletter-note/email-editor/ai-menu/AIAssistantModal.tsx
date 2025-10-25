'use client';

import type React from 'react';
import type { MagicWriteAction } from 'src/types/magic-write';

import { useState } from 'react';
import { Icon } from '@iconify/react';

import {
  Box,
  Alert,
  Dialog,
  Button,
  Divider,
  Accordion,
  Typography,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogActions,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';

import useMagicWriteStore from 'src/store/MagicWriteStore';

import { AI_OPTIONS } from 'src/types/magic-write';

import AIOptionCard from './AIOptionCard';
import LanguageSelector from './LanguageSelector';
import TextComparisonView from './TextComparisonView';

interface AIAssistantModalProps {
  open: boolean;
  onClose: () => void;
  selectedText: string;
  onApply: (newText: string) => void;
}

const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  open,
  onClose,
  selectedText,
  onApply,
}) => {
  const { processMagicWrite, loading, error } = useMagicWriteStore();
  const [resultText, setResultText] = useState<string | null>(null);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  const handleOptionClick = async (action: MagicWriteAction) => {
    // Si es traducir, mostrar selector de idioma
    if (action === 'traducir') {
      setShowLanguageSelector(true);
      return;
    }

    // Procesar con IA
    setResultText(null);
    const result = await processMagicWrite(action, selectedText);
    if (result) {
      setResultText(result);
    }
  };

  const handleLanguageSelect = async (language: string) => {
    setShowLanguageSelector(false);

    // Procesar traducción
    setResultText(null);
    const result = await processMagicWrite('traducir', selectedText, language);
    if (result) {
      setResultText(result);
    }
  };

  const handleApply = () => {
    if (resultText) {
      onApply(resultText);
      handleClose();
    }
  };

  const handleClose = () => {
    setResultText(null);
    setShowLanguageSelector(false);
    onClose();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
        fullScreen={false}
        PaperProps={{
          sx: {
            height: '90vh',
            maxHeight: '900px',
          },
        }}
      >
        {/* Header */}
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pb: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Icon icon="mdi:magic-staff" width={28} height={28} color="#6366f1" />
            <Typography variant="h5" fontWeight={600}>
              Asistente de IA
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <Icon icon="mdi:close" width={24} height={24} />
          </IconButton>
        </DialogTitle>

        <Divider />

        {/* Body */}
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', gap: 3, height: '100%' }}>
            {/* Columna Izquierda - Vista de Texto */}
            <Box sx={{ flex: '1 1 58%', height: '100%', display: 'flex', flexDirection: 'column' }}>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => {}}>
                  {error}
                </Alert>
              )}
              <TextComparisonView
                originalText={selectedText}
                resultText={resultText}
                loading={loading}
              />
            </Box>

            {/* Columna Derecha - Opciones de IA */}
            <Box sx={{ flex: '1 1 42%', height: '100%' }}>
              <Box
                sx={{
                  height: '100%',
                  overflow: 'auto',
                  pl: 1,
                  '&::-webkit-scrollbar': {
                    width: '8px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    bgcolor: 'grey.300',
                    borderRadius: '4px',
                  },
                }}
              >
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                  Selecciona una acción para procesar tu texto
                </Typography>

                {AI_OPTIONS.map((category) => (
                  <Accordion
                    key={category.id}
                    elevation={0}
                    sx={{
                      mb: 1,
                      '&:before': { display: 'none' },
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1.5,
                      overflow: 'hidden',
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<Icon icon="mdi:chevron-down" />}
                      sx={{
                        bgcolor: 'grey.50',
                        '& .MuiAccordionSummary-content': {
                          my: 1,
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Icon icon={category.icon} width={20} height={20} color={category.color} />
                        <Typography variant="subtitle1" fontWeight={600}>
                          {category.label}
                        </Typography>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails
                      sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}
                    >
                      {category.options.map((option) => (
                        <AIOptionCard
                          key={option.id}
                          option={option}
                          categoryColor={category.color}
                          onClick={() => handleOptionClick(option.id)}
                          disabled={loading}
                        />
                      ))}
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            </Box>
          </Box>
        </DialogContent>

        {/* Footer */}
        {resultText && !loading && (
          <>
            <Divider />
            <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
              <Button onClick={handleClose} variant="outlined" size="large">
                Cancelar
              </Button>
              <Button
                onClick={handleApply}
                variant="contained"
                size="large"
                startIcon={<Icon icon="mdi:check" />}
              >
                Aplicar cambios
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Selector de idiomas */}
      <LanguageSelector
        open={showLanguageSelector}
        onClose={() => setShowLanguageSelector(false)}
        onSelectLanguage={handleLanguageSelect}
      />
    </>
  );
};

export default AIAssistantModal;

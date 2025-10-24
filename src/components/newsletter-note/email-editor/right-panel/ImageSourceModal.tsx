import { Icon } from '@iconify/react';

import { Box, Card, Stack, Dialog, Typography, DialogContent } from '@mui/material';

interface ImageSourceModalProps {
  open: boolean;
  onClose: () => void;
  onSelectFromPC: () => void;
  onGenerateWithAI: () => void;
}

export default function ImageSourceModal({
  open,
  onClose,
  onSelectFromPC,
  onGenerateWithAI,
}: ImageSourceModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden',
        },
      }}
    >
      <DialogContent sx={{ p: 4 }}>
        <Stack spacing={3}>
          {/* Opción: Cargar desde PC */}
          <Card
            elevation={0}
            onClick={onSelectFromPC}
            sx={{
              p: 3,
              cursor: 'pointer',
              border: '2px solid',
              borderColor: 'divider',
              borderRadius: 2,
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: 'primary.main',
                backgroundColor: 'action.hover',
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 24px rgba(102, 126, 234, 0.15)',
              },
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 2,
                  backgroundColor: 'primary.lighter',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon icon="mdi:upload" width={28} style={{ color: '#667eea' }} />
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6" fontWeight={600}>
                  Cargar desde mi PC
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Selecciona una imagen de tu computadora
                </Typography>
              </Box>
              <Icon icon="mdi:chevron-right" width={24} style={{ color: '#667eea' }} />
            </Stack>
          </Card>

          {/* Opción: Generar con IA */}
          <Card
            elevation={0}
            onClick={onGenerateWithAI}
            sx={{
              p: 3,
              cursor: 'pointer',
              border: '2px solid',
              borderColor: 'divider',
              borderRadius: 2,
              background:
                'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: '#764ba2',
                backgroundColor: 'rgba(118, 75, 162, 0.08)',
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 24px rgba(118, 75, 162, 0.2)',
              },
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon icon="mdi:sparkles" width={28} style={{ color: 'white' }} />
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="h6" fontWeight={600}>
                    Generar con IA
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  Crea imágenes únicas con inteligencia artificial
                </Typography>
              </Box>
              <Icon icon="mdi:chevron-right" width={24} style={{ color: '#764ba2' }} />
            </Stack>
          </Card>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

import React from 'react';
import { Icon } from '@iconify/react';

import {
  Box,
  Chip,
  Dialog,
  Button,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

interface UnsavedChangesDialogProps {
  open: boolean;
  onClose: () => void;
  onSaveAndExit: () => void;
  onExitWithoutSaving: () => void;
  changeCount: number;
}

export const UnsavedChangesDialog: React.FC<UnsavedChangesDialogProps> = ({
  open,
  onClose,
  onSaveAndExit,
  onExitWithoutSaving,
  changeCount,
}) => (
  <Dialog
    open={open}
    onClose={onClose}
    maxWidth="sm"
    fullWidth
    PaperProps={{
      sx: {
        borderRadius: 3,
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
      },
    }}
  >
    <DialogTitle sx={{ pb: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            backgroundColor: 'warning.light',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon icon="mdi:alert-circle" style={{ fontSize: '24px', color: '#fff' }} />
        </Box>
        <Box>
          <Typography variant="h6" fontWeight="600">
            Tienes cambios sin guardar
          </Typography>
          <Chip
            label={`${changeCount} cambio${changeCount !== 1 ? 's' : ''} pendiente${changeCount !== 1 ? 's' : ''}`}
            size="small"
            color="warning"
            variant="outlined"
            sx={{ mt: 0.5 }}
          />
        </Box>
      </Box>
    </DialogTitle>

    <DialogContent sx={{ pt: 1, pb: 3 }}>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        ¿Qué te gustaría hacer con tus cambios antes de salir?
      </Typography>
    </DialogContent>

    <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
      <Button
        onClick={onClose}
        variant="outlined"
        startIcon={<Icon icon="mdi:pencil" />}
        sx={{
          borderRadius: 2,
          textTransform: 'none',
          fontWeight: 500,
        }}
      >
        Continuar editando
      </Button>

      <Button
        onClick={onExitWithoutSaving}
        variant="outlined"
        color="error"
        startIcon={<Icon icon="mdi:close-circle" />}
        sx={{
          borderRadius: 2,
          textTransform: 'none',
          fontWeight: 500,
        }}
      >
        Salir sin guardar
      </Button>

      <Button
        onClick={onSaveAndExit}
        variant="contained"
        color="primary"
        startIcon={<Icon icon="mdi:content-save" />}
        sx={{
          borderRadius: 2,
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
          '&:hover': {
            boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
          },
        }}
      >
        Guardar y salir
      </Button>
    </DialogActions>
  </Dialog>
);

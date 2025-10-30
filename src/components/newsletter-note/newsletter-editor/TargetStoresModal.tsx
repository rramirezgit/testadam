'use client';

import React, { useState, useEffect } from 'react';

import {
  Box,
  Alert,
  Dialog,
  Button,
  Checkbox,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
} from '@mui/material';

interface TargetStoresModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (stores: string[]) => void;
  selectedStores: string[];
}

const STORE_OPTIONS = [
  { value: 'CDMX', label: 'Ciudad de México' },
  { value: 'GDL', label: 'Guadalajara' },
  { value: 'PUE', label: 'Puebla' },
];

export default function TargetStoresModal({
  open,
  onClose,
  onConfirm,
  selectedStores,
}: TargetStoresModalProps) {
  const [localSelectedStores, setLocalSelectedStores] = useState<string[]>(selectedStores);
  const [showError, setShowError] = useState(false);

  // Sincronizar con prop selectedStores cuando el modal se abre
  useEffect(() => {
    if (open) {
      setLocalSelectedStores(selectedStores);
      setShowError(false);
    }
  }, [open, selectedStores]);

  const handleToggleStore = (storeValue: string) => {
    setShowError(false);
    setLocalSelectedStores((prev) => {
      if (prev.includes(storeValue)) {
        return prev.filter((s) => s !== storeValue);
      }
      return [...prev, storeValue];
    });
  };

  const handleConfirm = () => {
    if (localSelectedStores.length === 0) {
      setShowError(true);
      return;
    }
    onConfirm(localSelectedStores);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h6" fontWeight={600}>
          Selecciona las Audiencias
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Selecciona al menos una audiencia donde se enviará este newsletter. Puedes seleccionar
            hasta las 3 audiencias disponibles.
          </Typography>

          {showError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Debes seleccionar al menos una audiencia
            </Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {STORE_OPTIONS.map((store) => (
              <FormControlLabel
                key={store.value}
                control={
                  <Checkbox
                    checked={localSelectedStores.includes(store.value)}
                    onChange={() => handleToggleStore(store.value)}
                    color="primary"
                  />
                }
                label={
                  <Box>
                    <Typography variant="body1" fontWeight={500}>
                      {store.label}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {store.value}
                    </Typography>
                  </Box>
                }
                sx={{
                  border: '1px solid',
                  borderColor: localSelectedStores.includes(store.value)
                    ? 'primary.main'
                    : 'divider',
                  borderRadius: 1,
                  p: 1.5,
                  m: 0,
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: 'action.hover',
                  },
                }}
              />
            ))}
          </Box>

          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
            Seleccionadas: {localSelectedStores.length} de {STORE_OPTIONS.length}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancelar
        </Button>
        <Button onClick={handleConfirm} variant="contained" color="primary">
          Guardar Newsletter
        </Button>
      </DialogActions>
    </Dialog>
  );
}

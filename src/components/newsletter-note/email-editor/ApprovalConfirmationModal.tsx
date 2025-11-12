'use client';

import { useState } from 'react';

import {
  Button,
  Dialog,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
  CircularProgress,
} from '@mui/material';

interface ApprovalConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  action: 'approve' | 'reject';
  newsletterId: string;
  onConfirm: () => Promise<void>;
}

export default function ApprovalConfirmationModal({
  open,
  onClose,
  action,
  newsletterId,
  onConfirm,
}: ApprovalConfirmationModalProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Error al confirmar acción:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {action === 'approve' ? '¿Aprobar Newsletter?' : '¿Rechazar Newsletter?'}
      </DialogTitle>
      <DialogContent>
        <Typography>
          {action === 'approve'
            ? '¿Estás seguro de que deseas aprobar este newsletter? Esta acción cambiará su estado a aprobado.'
            : '¿Estás seguro de que deseas rechazar este newsletter? Esta acción cambiará su estado a rechazado.'}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button onClick={onClose} disabled={loading} variant="outlined">
          Cancelar
        </Button>
        <Button
          variant="contained"
          color={action === 'approve' ? 'success' : 'error'}
          onClick={handleConfirm}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
        >
          {loading ? 'Procesando...' : action === 'approve' ? 'Aprobar' : 'Rechazar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}


'use client';

import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

import {
  Box,
  Button,
  Dialog,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
  CircularProgress,
} from '@mui/material';

import usePostStore from 'src/store/PostStore';

import NewsletterEditor from 'src/components/newsletter-note/newsletter-editor';
import ApprovalConfirmationModal from 'src/components/newsletter-note/email-editor/ApprovalConfirmationModal';

export default function EditNewsletterPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { findNewsletterById, approveNewsletter, rejectNewsletter } = usePostStore();
  const [newsletter, setNewsletter] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [showStateErrorDialog, setShowStateErrorDialog] = useState(false);
  const [stateErrorMessage, setStateErrorMessage] = useState('');

  // Función helper para obtener texto legible del estado
  const getStatusText = (status?: string): string => {
    const statusMap: Record<string, string> = {
      DRAFT: 'Borrador',
      PENDING_APPROVAL: 'Pendiente de Aprobación',
      APPROVED: 'Aprobado',
      REJECTED: 'Rechazado',
      SCHEDULED: 'Programado',
      SENDED: 'Enviado',
      DELETED: 'Eliminado',
    };
    return statusMap[status || ''] || 'Desconocido';
  };

  useEffect(() => {
    const loadNewsletter = async () => {
      const id = params.id as string;
      const data = await findNewsletterById(id);
      setNewsletter(data);
      setLoading(false);
    };
    loadNewsletter();
  }, [params.id, findNewsletterById]);

  // Detectar parámetros de acción y validar estado
  useEffect(() => {
    // No procesar acción hasta que el newsletter esté cargado
    if (loading || !newsletter) {
      console.log('EditNewsletterPage - Esperando carga del newsletter antes de validar acción');
      return;
    }

    const action = searchParams.get('action');
    if (action === 'approve' || action === 'reject') {
      console.log('EditNewsletterPage - Validando acción:', { action, status: newsletter.status });

      // Verificar estado del newsletter
      if (newsletter.status !== 'PENDING_APPROVAL') {
        const actionText = action === 'approve' ? 'aprobado' : 'rechazado';
        const statusText = getStatusText(newsletter.status);
        console.log('EditNewsletterPage - Estado incorrecto, mostrando modal de error');
        setStateErrorMessage(
          `Este newsletter ya no puede ser ${actionText} porque su estado actual es "${statusText}".`
        );
        setShowStateErrorDialog(true);
        return;
      }

      // Si está en el estado correcto, proceder normalmente
      console.log('EditNewsletterPage - Estado correcto, mostrando modal de confirmación');
      setActionType(action);
      setShowConfirmationModal(true);
    }
  }, [searchParams, newsletter, loading]);

  const handleConfirmAction = async () => {
    const id = params.id as string;
    try {
      if (actionType === 'approve') {
        await approveNewsletter(id);
      } else if (actionType === 'reject') {
        await rejectNewsletter(id);
      }
      // Recargar el newsletter después de la acción
      const updatedNewsletter = await findNewsletterById(id);
      setNewsletter(updatedNewsletter);
      // Remover el parámetro de acción de la URL
      router.replace(`/edit/newsletter/${id}`);
    } catch (error) {
      console.error('Error al ejecutar acción:', error);
    }
  };

  const handleCloseModal = () => {
    setShowConfirmationModal(false);
    setActionType(null);
    // Remover el parámetro de acción de la URL
    const id = params.id as string;
    router.replace(`/edit/newsletter/${id}`);
  };

  if (loading) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <NewsletterEditor
        onClose={() => router.push('/dashboard/newsletter')}
        initialNewsletter={newsletter}
        defaultTemplate="newsletter"
      />
      {actionType && (
        <ApprovalConfirmationModal
          open={showConfirmationModal}
          onClose={handleCloseModal}
          action={actionType}
          newsletterId={params.id as string}
          onConfirm={handleConfirmAction}
        />
      )}

      {/* Dialog de error cuando el estado no es válido */}
      <Dialog
        open={showStateErrorDialog}
        onClose={() => {
          setShowStateErrorDialog(false);
          router.replace(`/edit/newsletter/${params.id}`);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1} color="warning.main">
            <Icon icon="mdi:alert-circle" width={24} />
            Estado Incorrecto
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography>{stateErrorMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={() => {
              setShowStateErrorDialog(false);
              router.replace(`/edit/newsletter/${params.id}`);
            }}
          >
            Entendido
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

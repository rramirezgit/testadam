// src/components/newsletter-note/content-card.tsx
// Card reus able para Notas y Newsletters

'use client';

import type { Article } from 'src/store/PostStore';
import type { Newsletter } from 'src/types/newsletter';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';

import {
  Box,
  Card,
  Chip,
  Alert,
  Button,
  Snackbar,
  Typography,
  IconButton,
  CardContent,
  CardActions,
} from '@mui/material';

import usePostStore from 'src/store/PostStore';

interface ContentCardProps {
  content: Article | Newsletter;
  type: 'note' | 'newsletter';
  onOpen: (content: Article | Newsletter) => void;
  onDelete: (contentId: string) => void;
}

export default function ContentCard({ content, type, onOpen, onDelete }: ContentCardProps) {
  const [fecha, setFecha] = useState<string>('');
  const [hora, setHora] = useState<string>('');
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const { unscheduleNewsletter } = usePostStore();

  const showNotification = (
    message: string,
    severity: 'success' | 'error' | 'info' | 'warning'
  ) => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  // Función para calcular tiempo restante para newsletters programados
  const getTimeRemaining = (scheduleDate: string) => {
    const now = new Date().getTime();
    const scheduled = new Date(scheduleDate).getTime();
    const diff = scheduled - now;

    if (diff <= 0) return 'Enviando...';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `En ${days}d ${hours}h`;
    if (hours > 0) return `En ${hours}h ${minutes}m`;
    return `En ${minutes}m`;
  };

  useEffect(() => {
    if (content?.createdAt) {
      try {
        const dateCreated = content.createdAt;
        if (dateCreated) {
          setFecha(format(new Date(dateCreated), "dd 'de' MMMM yyyy", { locale: es }));
          setHora(format(new Date(dateCreated), 'hh:mm a'));
        }
      } catch (error) {
        console.error('Error parsing date:', error);
      }
    }
  }, [content?.createdAt]);

  // Obtener título según el tipo
  const getTitle = () => {
    if (type === 'newsletter') {
      return (content as Newsletter).subject || 'Newsletter sin título';
    }
    return (content as Article).title || 'Nota sin título';
  };

  // Obtener imagen de portada
  const getCoverImage = () => (content as Article).coverImageUrl;

  // Obtener badge de origen/tipo
  const getOriginBadge = () => {
    if (type === 'note') {
      const note = content as Article;
      if (note.origin === 'IA') {
        return (
          <Chip
            label="IA"
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              bgcolor: 'primary.main',
              color: 'common.white',
            }}
          />
        );
      }
    } else {
      return (
        <Chip
          label="Newsletter"
          size="small"
          icon={<Icon icon="mdi:email-newsletter" width={14} />}
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            bgcolor: 'success.main',
            color: 'common.white',
          }}
        />
      );
    }
    return null;
  };

  // Obtener status badge
  const getStatusBadge = () => {
    const status = content.status || 'DRAFT';
    const statusColors: Record<string, string> = {
      DRAFT: 'default',
      REVIEW: 'warning',
      APPROVED: 'info',
      PUBLISHED: 'success',
      REJECTED: 'error',
    };

    return (
      <Chip
        label={status}
        size="small"
        color={statusColors[status] as any}
        sx={{
          position: 'absolute',
          top: 8,
          right: 48,
          textTransform: 'capitalize',
        }}
      />
    );
  };

  const coverImage = getCoverImage();

  return (
    <Card
      onClick={() => onOpen(content)}
      sx={{
        borderRadius: 2,
        cursor: 'pointer',
        overflow: 'hidden',
        boxShadow: 3,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
        },
      }}
    >
      {/* Cabecera con imagen */}
      <Box sx={{ position: 'relative' }}>
        <Box
          sx={{
            height: 140,
            bgcolor: 'grey.300',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {coverImage ? (
            <img
              src={coverImage}
              alt="Cover"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <Icon
              icon={type === 'newsletter' ? 'mdi:email-newsletter' : 'mdi:note-outline'}
              width={48}
              height={48}
              style={{ opacity: 0.5, color: type === 'newsletter' ? 'white' : undefined }}
            />
          )}
        </Box>

        {/* Badge de origen/tipo */}
        {getOriginBadge()}

        {/* Badge de status */}
        {getStatusBadge()}

        {/* Menú de acciones */}
        <IconButton
          size="small"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            bgcolor: 'rgba(255,255,255,0.8)',
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.95)',
            },
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Icon icon="mdi:dots-vertical" />
        </IconButton>
      </Box>

      {/* Contenido */}
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle1" gutterBottom noWrap fontWeight={600}>
          {getTitle()}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: 'text.secondary',
            mt: 0.5,
            '& svg': { fontSize: 16, opacity: 0.7, mr: 0.5 },
          }}
        >
          <Icon icon="mdi:calendar" />
          <Typography variant="caption" noWrap sx={{ mr: 1 }}>
            {fecha}
          </Typography>
          <Icon icon="mdi:clock-outline" />
          <Typography variant="caption" noWrap>
            {hora}
          </Typography>
        </Box>

        {/* Información de newsletter programado */}
        {type === 'newsletter' &&
          (content as Newsletter).status === 'SCHEDULED' &&
          (content as Newsletter).scheduleDate && (
            <Box
              sx={{
                mt: 2,
                p: 1.5,
                bgcolor: 'info.lighter',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'info.light',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Icon icon="mdi:clock-outline" style={{ fontSize: 18, color: '#2196f3' }} />
                <Typography variant="caption" color="info.dark" sx={{ fontWeight: 600 }}>
                  Programado para:{' '}
                  {new Date((content as Newsletter).scheduleDate!).toLocaleString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Typography>
              </Box>
              <Typography
                variant="body2"
                color="info.dark"
                sx={{ fontWeight: 700, mb: 1, fontSize: '1.1rem' }}
              >
                {getTimeRemaining((content as Newsletter).scheduleDate!)}
              </Typography>
              <Button
                fullWidth
                size="small"
                variant="outlined"
                color="warning"
                startIcon={<Icon icon="mdi:cancel" />}
                onClick={async (e) => {
                  e.stopPropagation();
                  try {
                    const newsletter = content as Newsletter;
                    await unscheduleNewsletter(
                      newsletter.id,
                      newsletter.subject || '',
                      newsletter.content || '',
                      newsletter.objData || '',
                      newsletter.scheduleDate || ''
                    );
                    showNotification('Envío cancelado correctamente', 'success');
                    // Recargar la página después de un breve delay
                    setTimeout(() => {
                      window.location.reload();
                    }, 1500);
                  } catch (error) {
                    console.error('Error al cancelar el envío:', error);
                    showNotification('Error al cancelar el envío', 'error');
                  }
                }}
              >
                Cancelar Envío
              </Button>
            </Box>
          )}
      </CardContent>

      {/* Acciones */}
      <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
        <Button
          size="small"
          color="error"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(content.id);
          }}
          startIcon={<Icon icon="mdi:delete-outline" />}
        >
          Eliminar
        </Button>
      </CardActions>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Card>
  );
}

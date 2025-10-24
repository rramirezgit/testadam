// src/components/newsletter-note/content-card.tsx
// Card reus able para Notas y Newsletters

'use client';

import type { Article } from 'src/store/PostStore';
import type { Newsletter } from 'src/types/newsletter';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import {
  Box,
  Card,
  Chip,
  Menu,
  Alert,
  Button,
  Divider,
  Snackbar,
  MenuItem,
  Typography,
  IconButton,
  CardContent,
  ListItemIcon,
  ListItemText,
} from '@mui/material';

import usePostStore from 'src/store/PostStore';

interface ContentCardProps {
  content: Article | Newsletter;
  type: 'note' | 'newsletter';
  onOpen?: (content: Article | Newsletter) => void;
  onDelete: (contentId: string) => void;
}

export default function ContentCard({ content, type, onOpen, onDelete }: ContentCardProps) {
  const router = useRouter();
  const [fecha, setFecha] = useState<string>('');
  const [hora, setHora] = useState<string>('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);
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

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (event?: React.MouseEvent) => {
    event?.stopPropagation();
    setAnchorEl(null);
  };

  const handleDuplicate = (event: React.MouseEvent) => {
    handleMenuClose(event);
    showNotification('Función en desarrollo', 'info');
  };

  const handleRename = (event: React.MouseEvent) => {
    handleMenuClose(event);
    showNotification('Función en desarrollo', 'info');
  };

  const handleRequestApproval = (event: React.MouseEvent) => {
    handleMenuClose(event);
    showNotification('Función en desarrollo', 'info');
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
          setFecha(format(new Date(dateCreated), 'dd MMM yyyy', { locale: es }));
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

  // Obtener label de status
  const getStatusLabel = () => {
    const status = content.status || 'DRAFT';
    const statusLabels: Record<string, string> = {
      DRAFT: 'Borrador',
      REVIEW: 'Revisión',
      APPROVED: 'Aprobado',
      PUBLISHED: 'Publicado',
      REJECTED: 'Rechazado',
      SCHEDULED: 'Programado',
    };

    return statusLabels[status] || status;
  };

  const coverImage = getCoverImage();

  const handleCardClick = () => {
    if (onOpen) {
      onOpen(content);
    } else {
      // Navegación por defecto
      if (type === 'newsletter') {
        router.push(`/edit/newsletter/${content.id}`);
      } else {
        router.push(`/edit/note/${content.id}`);
      }
    }
  };

  return (
    <Card
      onClick={handleCardClick}
      sx={{
        borderRadius: '8px',
        cursor: 'pointer',
        overflow: 'hidden',
        boxShadow: 3,
        position: 'relative',
        height: '182px', // Altura fija de la card
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
    >
      {/* Imagen de fondo - ocupa toda la card */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
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

      {/* Contenido flotante sobre la imagen */}
      <CardContent
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          pt: 1,
          pb: 1,
          px: 2,
          bgcolor: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(10px)',
          borderTopLeftRadius: '12px',
          borderTopRightRadius: '12px',
        }}
      >
        {/* Primera línea: Fecha/Hora a la izquierda, Chip Estado + Menú a la derecha */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 0.5,
          }}
        >
          {/* Fecha y hora */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: 'text.secondary',
              '& svg': { fontSize: 16, opacity: 0.7, mr: 0.5 },
            }}
          >
            <Icon icon="mdi:calendar" />
            <Typography variant="caption" noWrap sx={{ mr: 2 }}>
              {fecha}
            </Typography>
            <Icon icon="mdi:clock-outline" />
            <Typography variant="caption" noWrap>
              {hora}
            </Typography>
          </Box>

          {/* Chip de estado + Menú de tres puntos */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              label={getStatusLabel()}
              size="small"
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.95)',
                color: 'text.secondary',
                fontWeight: 500,
                fontSize: '0.75rem',
                border: '1px solid',
                borderColor: 'divider',
                height: 24,
              }}
            />
            <IconButton
              size="small"
              onClick={handleMenuOpen}
              sx={{
                p: 0.5,
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <Icon icon="mdi:dots-vertical" width={20} />
            </IconButton>

            {/* Menú contextual */}
            <Menu
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              onClick={(e) => e.stopPropagation()}
            >
              <MenuItem
                onClick={(e) => {
                  handleMenuClose(e);
                  handleCardClick();
                }}
              >
                <ListItemIcon>
                  <Icon icon="mdi:eye-outline" width={20} />
                </ListItemIcon>
                <ListItemText>Ver detalles</ListItemText>
              </MenuItem>

              {type === 'newsletter' && (
                <MenuItem onClick={handleRequestApproval}>
                  <ListItemIcon>
                    <Icon icon="mdi:check-circle-outline" width={20} />
                  </ListItemIcon>
                  <ListItemText>Solicitar aprobación</ListItemText>
                </MenuItem>
              )}

              <MenuItem onClick={handleDuplicate}>
                <ListItemIcon>
                  <Icon icon="mdi:content-copy" width={20} />
                </ListItemIcon>
                <ListItemText>Duplicar</ListItemText>
              </MenuItem>

              <MenuItem onClick={handleRename}>
                <ListItemIcon>
                  <Icon icon="mdi:pencil-outline" width={20} />
                </ListItemIcon>
                <ListItemText>Renombrar</ListItemText>
              </MenuItem>

              <Divider />

              <MenuItem
                onClick={(e) => {
                  handleMenuClose(e);
                  onDelete(content.id);
                }}
              >
                <ListItemIcon>
                  <Icon icon="mdi:delete-outline" width={20} color="error" />
                </ListItemIcon>
                <ListItemText sx={{ color: 'error.main' }}>Eliminar</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* Segunda línea: Título */}
        <Typography variant="subtitle1" noWrap fontWeight={600}>
          {getTitle()}
        </Typography>

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

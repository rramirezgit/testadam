'use client';

import type { SavedEducacion } from 'src/types/saved-educacion';

import { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Icon } from '@iconify/react/dist/iconify.js';

import {
  Grid,
  Card,
  Menu,
  Button,
  MenuItem,
  Typography,
  IconButton,
  CardContent,
  CardActionArea,
} from '@mui/material';

import { Iconify } from '../iconify';

export interface EducacionGridProps {
  educaciones: SavedEducacion[];
  onOpenEducacion: (educacion: SavedEducacion) => void;
  onDeleteEducacion: (id: string) => void;
  onCreateNew: () => void;
}

export default function EducacionGrid({
  educaciones,
  onOpenEducacion,
  onDeleteEducacion,
  onCreateNew,
}: EducacionGridProps) {
  const [menuPosition, setMenuPosition] = useState<null | { id: string; x: number; y: number }>(
    null
  );

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>, id: string) => {
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    setMenuPosition({
      id,
      x: rect.right,
      y: rect.bottom,
    });
  };

  const handleCloseMenu = () => {
    setMenuPosition(null);
  };

  const handleDelete = (id: string) => {
    onDeleteEducacion(id);
    handleCloseMenu();
  };

  const handleEdit = (educacion: SavedEducacion) => {
    onOpenEducacion(educacion);
    handleCloseMenu();
  };

  // Format date to readable format
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Fecha inválida';
      }
      return format(date, 'dd MMM yyyy', { locale: es });
    } catch (error) {
      console.error('Error al formatear la fecha:', error);
      return 'Fecha inválida';
    }
  };

  // Get a preview of the first component's content
  const getPreviewText = (educacion: SavedEducacion) => {
    if (!educacion?.educacion?.content || educacion.educacion.content.length === 0) {
      return 'Sin contenido';
    }

    const textComponents = educacion.educacion.content.filter(
      (component) => component.type === 'paragraph' || component.type === 'heading'
    );

    if (textComponents.length === 0) {
      return 'Sin texto';
    }

    const content = textComponents[0].content;
    return content ? content.substring(0, 100) + (content.length > 100 ? '...' : '') : 'Sin texto';
  };

  if (educaciones.length === 0) {
    return (
      <Card sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          No hay contenido educativo disponible
        </Typography>
        <Button variant="contained" onClick={onCreateNew}>
          Crear nuevo contenido
        </Button>
      </Card>
    );
  }

  return (
    <Grid container spacing={3}>
      {educaciones.map((educacion) => (
        <Grid key={educacion.id}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card
              sx={{
                position: 'relative',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: (theme) => theme.customShadows.z24,
                },
              }}
            >
              <CardActionArea onClick={() => onOpenEducacion(educacion)} sx={{ flexGrow: 1 }}>
                <CardContent>
                  <Typography variant="h6" noWrap sx={{ mb: 1 }}>
                    {educacion.title || 'Sin título'}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      minHeight: '60px',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {educacion.description || getPreviewText(educacion)}
                  </Typography>

                  <Typography variant="caption" color="text.secondary" component="div">
                    Modificado: {formatDate(educacion.dateModified)}
                  </Typography>

                  <Typography
                    variant="caption"
                    sx={{
                      mt: 1,
                      py: 0.5,
                      px: 1,
                      borderRadius: 1,
                      display: 'inline-block',
                      bgcolor:
                        educacion.status === 'PUBLISHED'
                          ? 'success.lighter'
                          : educacion.status === 'DRAFT'
                            ? 'info.lighter'
                            : 'warning.lighter',
                      color:
                        educacion.status === 'PUBLISHED'
                          ? 'success.darker'
                          : educacion.status === 'DRAFT'
                            ? 'info.darker'
                            : 'warning.darker',
                    }}
                  >
                    {educacion.status === 'PUBLISHED'
                      ? 'Publicado'
                      : educacion.status === 'DRAFT'
                        ? 'Borrador'
                        : 'Archivado'}
                  </Typography>
                </CardContent>
              </CardActionArea>

              <IconButton
                size="small"
                onClick={(e) => handleOpenMenu(e, educacion.id)}
                sx={{ position: 'absolute', top: 8, right: 8 }}
              >
                <Iconify icon="eva:more-vertical-fill" />
              </IconButton>
            </Card>
          </Grid>
        </Grid>
      ))}

      <Menu
        open={!!menuPosition}
        onClose={handleCloseMenu}
        anchorReference="anchorPosition"
        anchorPosition={menuPosition ? { top: menuPosition.y, left: menuPosition.x } : undefined}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' },
        }}
      >
        <MenuItem
          onClick={() => {
            if (menuPosition) {
              const educacion = educaciones.find((e) => e.id === menuPosition.id);
              if (educacion) {
                handleEdit(educacion);
              }
            }
          }}
        >
          <Icon icon="eva:edit-fill" style={{ marginRight: '8px' }} />
          Editar
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (menuPosition) {
              handleDelete(menuPosition.id);
            }
          }}
          sx={{ color: 'error.main' }}
        >
          <Icon icon="eva:trash-2-outline" style={{ marginRight: '8px' }} />
          Eliminar
        </MenuItem>
      </Menu>
    </Grid>
  );
}

'use client';

import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';

import {
  Box,
  Card,
  TextField,
  IconButton,
  Pagination,
  Typography,
  CardContent,
  InputAdornment,
  CircularProgress,
} from '@mui/material';

import usePostStore from 'src/store/PostStore';

interface NotesLibraryProps {
  onInjectNote?: (noteId: string) => void;
}

export default function NotesLibrary({ onInjectNote }: NotesLibraryProps) {
  const { findAll: findAllPosts } = usePostStore();

  const [filteredNotes, setFilteredNotes] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [injecting, setInjecting] = useState(false); // Estado para loading de inyección

  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalNotes, setTotalNotes] = useState(0);
  const notesPerPage = 12; // 12 notas por página para una buena visualización

  // Cargar notas en borrador
  const loadNotes = async (page: number = 1) => {
    setLoading(true);
    try {
      const response = await findAllPosts({
        status: 'DRAFT',
        page,
        perPage: notesPerPage,
        ...(searchQuery && { title: searchQuery }),
      });

      if (response && response.data) {
        setFilteredNotes(response.data);

        // Actualizar información de paginación
        if (response.meta) {
          setTotalPages(response.meta.lastPage || 1);
          setTotalNotes(response.meta.total || 0);
          setCurrentPage(response.meta.currentPage || 1);
        }
      }
    } catch (error) {
      console.error('Error loading notes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar notas al montar
  useEffect(() => {
    loadNotes(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Recargar cuando cambia la búsqueda (con debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1); // Reset a página 1 cuando se busca
      loadNotes(1);
    }, 500); // Debounce de 500ms

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  // Manejar cambio de página
  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    loadNotes(page);
  };

  // Manejar inyección de nota con loading
  const handleInjectNote = async (noteId: string) => {
    if (injecting) return; // Evitar clicks múltiples

    setInjecting(true);
    try {
      await onInjectNote?.(noteId);
      // Dar un pequeño delay para que se vea el feedback visual
      setTimeout(() => {
        setInjecting(false);
      }, 500);
    } catch (error) {
      console.error('Error al inyectar nota:', error);
      setInjecting(false);
    }
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('es-ES', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        p: 1,
        position: 'relative', // Para el overlay de loading
      }}
    >
      {/* Buscador */}
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Buscar nota"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Icon icon="eva:search-fill" style={{ color: '#919EAB' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small" edge="end">
                  <Icon icon="solar:settings-bold" style={{ fontSize: '1.2rem' }} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              backgroundColor: 'background.neutral',
            },
          }}
        />
      </Box>

      {/* Lista de notas */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          pr: 1, // Espacio entre el scroll y las cards
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderRadius: '3px',
          },
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={32} />
          </Box>
        ) : filteredNotes.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Icon
              icon="mdi:note-outline"
              style={{ fontSize: 48, opacity: 0.3, color: '#919EAB' }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {searchQuery ? 'No se encontraron notas' : 'No hay notas en borrador'}
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 1.5,
            }}
          >
            {filteredNotes.map((note) => (
              <Card
                key={note.id}
                onClick={() => handleInjectNote(note.id)}
                sx={{
                  cursor: injecting ? 'wait' : 'pointer',
                  borderRadius: '8px',
                  transition: 'all 0.2s',
                  opacity: injecting ? 0.6 : 1,
                  pointerEvents: injecting ? 'none' : 'auto',
                  '&:hover': {
                    boxShadow: 3,
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                {/* Imagen de portada */}
                {note.coverImageUrl && (
                  <Box
                    component="img"
                    src={note.coverImageUrl}
                    alt={note.title}
                    sx={{
                      width: '100%',
                      height: 64,
                      objectFit: 'cover',
                      borderRadius: '8px 8px 0 0',
                    }}
                  />
                )}

                {/* Placeholder si no hay imagen */}
                {!note.coverImageUrl && (
                  <Box
                    sx={{
                      width: '100%',
                      height: 64,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: '8px 8px 0 0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon
                      icon="mdi:note-text-outline"
                      style={{ fontSize: 40, color: 'white', opacity: 0.5 }}
                    />
                  </Box>
                )}

                <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                  {/* Fecha */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <Icon
                      icon="solar:calendar-outline"
                      style={{ fontSize: '0.875rem', color: '#919EAB', marginRight: 4 }}
                    />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontSize: '0.7rem' }}
                    >
                      {formatDate(note.updatedAt || note.createdAt)}
                    </Typography>
                  </Box>

                  {/* Título */}
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      fontSize: '0.813rem',
                      mb: 0.5,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      lineHeight: 1.3,
                    }}
                  >
                    {note.title || 'Sin título'}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Box>

      {/* Paginador - Siempre visible en la parte inferior */}
      {!loading && totalPages > 1 && (
        <Box
          sx={{
            pt: 2,
            pb: 1,
            borderTop: '1px solid',
            borderColor: 'divider',
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
            backgroundColor: 'background.paper',
          }}
        >
          {/* Info de resultados */}
          <Typography variant="caption" color="text.secondary">
            Mostrando {filteredNotes.length} de {totalNotes} notas
          </Typography>

          {/* Paginador */}
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size="small"
            siblingCount={0}
            boundaryCount={1}
            sx={{
              '& .MuiPaginationItem-root': {
                fontSize: '0.75rem',
                minWidth: '28px',
                height: '28px',
              },
            }}
          />
        </Box>
      )}

      {/* Overlay de loading cuando se está inyectando */}
      {injecting && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(4px)',
            zIndex: 1000,
            borderRadius: '16px',
          }}
        >
          <CircularProgress size={48} />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontWeight: 500 }}>
            Agreando nota...
          </Typography>
        </Box>
      )}
    </Box>
  );
}

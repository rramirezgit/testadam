/* eslint-disable react-hooks/exhaustive-deps */

'use client';

import type { Article, PostFilters } from 'src/store/PostStore';

import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';

import {
  Box,
  Tab,
  Tabs,
  Modal,
  Paper,
  Button,
  Dialog,
  Select,
  Divider,
  Checkbox,
  MenuItem,
  TextField,
  Typography,
  InputLabel,
  Pagination,
  IconButton,
  FormControl,
  InputAdornment,
  CircularProgress,
  FormControlLabel,
} from '@mui/material';

import { usePosts } from 'src/hooks/use-posts';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import NotesGrid from 'src/components/newsletter-note/notes-grid';
import EmailEditor from 'src/components/newsletter-note/email-editor';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

type Tab = {
  label: string;
  value: string;
};

const TABS: Tab[] = [
  {
    label: 'Borradores',
    value: 'draft',
  },
  {
    label: 'Review',
    value: 'review',
  },
  {
    label: 'Aprobados',
    value: 'approved',
  },
  {
    label: 'Publicado',
    value: 'published',
  },
];

export default function NotesView() {
  const [openEditor, setOpenEditor] = useState(false);
  const [currentNote, setCurrentNote] = useState<Article | null>(null);
  const [tab, setTab] = useState('draft');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const [openFiltersModal, setOpenFiltersModal] = useState(false);

  // Estados para filtros avanzados
  const [filters, setFilters] = useState({
    origin: '',
    startDate: '',
    endDate: '',
    highlight: false,
    perPage: 20,
    page: 1,
  });

  // Configurar filtros basados en el tab actual
  const currentFilters: PostFilters = {
    status: tab.toUpperCase(),
    page: filters.page,
    perPage: filters.perPage,
    ...(searchTerm && { title: searchTerm }),
    ...(filters.origin && { origin: filters.origin }),
    ...(filters.startDate && { startDate: filters.startDate }),
    ...(filters.endDate && { endDate: filters.endDate }),
    ...(filters.highlight && { highlight: filters.highlight }),
  };

  // Use PostStore
  const { loading, posts, meta, error, removePost, refreshPosts } = usePosts(currentFilters);

  // Convertir posts de Article a SavedNote para compatibilidad
  const notes = posts;

  // Manejar búsqueda con debounce
  const handleSearch = useCallback(
    (value: string) => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }

      const newTimeout = setTimeout(() => {
        setSearchTerm(value);
        setFilters((prev) => ({ ...prev, page: 1 })); // Reset page on search
      }, 500);

      setSearchTimeout(newTimeout);
    },
    [searchTimeout]
  );

  // Limpiar timeout al desmontar
  useEffect(
    () => () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    },
    [searchTimeout]
  );

  // Refrescar cuando se cierra el editor
  useEffect(() => {
    if (!openEditor) {
      refreshPosts();
    }
  }, [openEditor, refreshPosts]);

  const handleOpenEditor = (note?: Article) => {
    if (note) {
      setCurrentNote(note);
    } else {
      setCurrentNote(null);
    }
    setOpenEditor(true);
  };

  const handleCloseEditor = () => {
    setOpenEditor(false);
    setCurrentNote(null);
  };

  const handleDeleteNote = async (noteId: string) => {
    await removePost(noteId);
  };

  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    console.log('🔄 Cambiando tab a:', newValue);
    setTab(newValue);
    setFilters((prev) => ({ ...prev, page: 1 })); // Reset page on tab change
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 })); // Reset page on filter change
  };

  const handleClearFilters = () => {
    setFilters({
      origin: '',
      startDate: '',
      endDate: '',
      highlight: false,
      perPage: 20,
      page: 1,
    });
    setSearchTerm('');
  };

  // Agregar useEffect para debug de filtros
  useEffect(() => {
    console.log('📊 Filtros actuales:', currentFilters);
  }, [currentFilters]);

  return (
    <DashboardContent>
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <CustomBreadcrumbs
          heading="Notas"
          subheading="Crea, personaliza y publica tus notas en ADAC"
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Box
          sx={{
            gap: 3,
            display: 'flex',
            mb: { xs: 3, md: 5 },
            justifyContent: 'space-between',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-end', sm: 'center' },
          }}
        >
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flex: 1 }}>
            <TextField
              placeholder="Buscar notas..."
              name="search-note"
              onChange={(e) => handleSearch(e.target.value)}
              sx={{ flex: 1 }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon="eva:search-fill" sx={{ ml: 1, color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <>
                      {loading ? (
                        <CircularProgress size={18} color="inherit" sx={{ mr: -3 }} />
                      ) : null}
                    </>
                  ),
                },
              }}
            />

            <IconButton
              onClick={() => setOpenFiltersModal(true)}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
              }}
            >
              <Iconify icon="solar:settings-bold" />
            </IconButton>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              sx={{
                height: '50px',
                background: 'linear-gradient(90deg, #4DBCFB 0%, #DD26FD 100%)',
              }}
            >
              <Image
                src="/assets/icons/apps/ic-ai.svg"
                alt="AI"
                width={24}
                height={24}
                style={{ marginRight: '8px' }}
              />
              Crear con AI
            </Button>
            <Button variant="contained" color="primary" onClick={() => handleOpenEditor()}>
              <Iconify icon="mingcute:add-line" style={{ marginRight: '8px' }} />
              Crear Nota
            </Button>
          </Box>
        </Box>

        <Tabs value={tab} onChange={handleChangeTab} sx={{ mb: { xs: 3, md: 5 } }}>
          {TABS.map((tabItem: Tab) => (
            <Tab key={tabItem.value} label={tabItem.label} value={tabItem.value} />
          ))}
        </Tabs>

        {error && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <Typography color="error">Error al cargar las notas: {error}</Typography>
          </Box>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Cargando tus notas...</Typography>
          </Box>
        ) : (
          <NotesGrid
            notes={notes}
            onOpenNote={handleOpenEditor}
            onDeleteNote={handleDeleteNote}
            onCreateNew={() => handleOpenEditor()}
          />
        )}

        {/* Paginación */}
        {meta && meta.total > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <Pagination
                count={meta.lastPage}
                page={meta.currentPage}
                onChange={handlePageChange}
                color="primary"
                showFirstButton
                showLastButton
              />
              <Typography variant="body2" color="text.secondary">
                Mostrando {notes.length} de {meta.total} notas
              </Typography>
            </Box>
          </Box>
        )}

        {/* Modal de Filtros */}
        <Modal
          open={openFiltersModal}
          onClose={() => setOpenFiltersModal(false)}
          aria-labelledby="filters-modal"
        >
          <Paper
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: '90%', sm: 600 },
              maxHeight: '80vh',
              overflow: 'auto',
              p: 3,
            }}
          >
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}
            >
              <Typography variant="h6">Filtros Avanzados</Typography>
              <IconButton onClick={() => setOpenFiltersModal(false)}>
                <Iconify icon="solar:close-circle-bold" />
              </IconButton>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Origen y Elementos por página */}
              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                <FormControl fullWidth>
                  <InputLabel>Origen</InputLabel>
                  <Select
                    value={filters.origin}
                    label="Origen"
                    onChange={(e) => handleFilterChange('origin', e.target.value)}
                  >
                    <MenuItem value="">Todos</MenuItem>
                    <MenuItem value="IA">IA</MenuItem>
                    <MenuItem value="ADAC">ADAC</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Elementos por página</InputLabel>
                  <Select
                    value={filters.perPage}
                    label="Elementos por página"
                    onChange={(e) => handleFilterChange('perPage', e.target.value)}
                  >
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Fechas */}
              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                <TextField
                  type="date"
                  label="Fecha de inicio"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />

                <TextField
                  type="date"
                  label="Fecha de fin"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Box>

              {/* Destacados */}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.highlight}
                    onChange={(e) => handleFilterChange('highlight', e.target.checked)}
                  />
                }
                label="Solo notas destacadas"
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button variant="outlined" onClick={handleClearFilters}>
                Limpiar Filtros
              </Button>
              <Button variant="contained" onClick={() => setOpenFiltersModal(false)}>
                Aplicar Filtros
              </Button>
            </Box>
          </Paper>
        </Modal>

        {/* Email Editor Dialog */}
        <Dialog fullScreen open={openEditor} onClose={handleCloseEditor}>
          <EmailEditor onClose={handleCloseEditor} initialNote={currentNote} />
        </Dialog>
      </Box>
    </DashboardContent>
  );
}

'use client';

import type { Article, PostStatus, PostFilters } from 'src/store/PostStore';

import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import {
  Box,
  Tab,
  Tabs,
  Grid,
  Card,
  Modal,
  Paper,
  Button,
  Select,
  Divider,
  Checkbox,
  MenuItem,
  Skeleton,
  TextField,
  Typography,
  InputLabel,
  Pagination,
  IconButton,
  FormControl,
  CardContent,
  InputAdornment,
  CircularProgress,
  FormControlLabel,
} from '@mui/material';

import { usePosts } from 'src/hooks/use-posts';

import { buildQueryString } from 'src/utils/url-utils';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import NotesGrid from 'src/components/newsletter-note/notes-grid';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
// Importar templates disponibles
import { emailTemplates } from 'src/components/newsletter-note/email-editor/data/email-templates';

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

// Componente Skeleton para las cards de notas
function NoteCardSkeleton() {
  return (
    <Card
      sx={{
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: 3,
        position: 'relative',
        height: '182px',
      }}
    >
      {/* Skeleton de imagen de fondo */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      >
        <Skeleton variant="rectangular" width="100%" height="100%" animation="wave" />
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
        {/* Primera línea: Fecha/Hora y Chip */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 0.5,
          }}
        >
          {/* Skeletons de fecha y hora */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Skeleton variant="text" width={90} height={20} />
            <Skeleton variant="text" width={60} height={20} />
          </Box>

          {/* Skeleton de chip y menú */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Skeleton variant="rounded" width={80} height={24} />
            <Skeleton variant="circular" width={20} height={20} />
          </Box>
        </Box>

        {/* Segunda línea: Título */}
        <Skeleton variant="text" width="80%" height={28} />
      </CardContent>
    </Card>
  );
}

// Componente que muestra la grilla de skeletons
function NotesGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <Grid container spacing={3}>
      {Array.from({ length: count }).map((_, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
          <NoteCardSkeleton />
        </Grid>
      ))}
    </Grid>
  );
}

export default function NotesView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('title') || '');
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const [openFiltersModal, setOpenFiltersModal] = useState(false);

  // Nuevo estado para filtro de templates
  const [selectedTemplate, setSelectedTemplate] = useState<string>('all');

  // Estados para filtros - Inicializar desde URL
  const [filters, setFilters] = useState<PostFilters>({
    status: (searchParams.get('status')?.toUpperCase() as PostStatus) || 'DRAFT',
    page: Number(searchParams.get('page')) || 1,
    perPage: Number(searchParams.get('perPage')) || 20,
    origin: searchParams.get('origin') || '',
    startDate: searchParams.get('startDate') || '',
    endDate: searchParams.get('endDate') || '',
    title: searchParams.get('title') || '',
    usedInNewsletter: searchParams.get('usedInNewsletter') === 'true' || undefined,
    highlight: searchParams.get('highlight') === 'true' || undefined,
    orderBy: searchParams.get('orderBy') || '',
    categoryId: searchParams.get('categoryId') || '',
    subcategoryId: searchParams.get('subcategoryId') || '',
    contentTypeId: searchParams.get('contentTypeId') || '',
    ...(selectedTemplate !== 'all' && { templateType: selectedTemplate }),
  });

  // Use PostStore
  const { loading, posts, meta, error, removePost } = usePosts(filters);

  // Convertir posts de Article a SavedNote para compatibilidad
  const notes = posts;

  // Manejar búsqueda con debounce
  const handleSearch = useCallback(
    (value: string) => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }

      const newTimeout = setTimeout(() => {
        const newFilters = { ...filters, title: value, page: 1 };
        setFilters(newFilters);
        router.push(`/dashboard/notes?${buildQueryString(newFilters)}`);
      }, 500);

      setSearchTimeout(newTimeout);
    },
    [searchTimeout, filters, router]
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

  const handleOpenEditor = (note?: Article) => {
    if (note) {
      router.push(`/edit/note/${note.id}`);
    } else {
      router.push('/new/note');
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    await removePost(noteId);
  };

  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    console.log('🔄 Cambiando tab a:', newValue);
    const newFilters = { ...filters, status: newValue.toUpperCase() as PostStatus, page: 1 };
    setFilters(newFilters);
    router.push(`/dashboard/notes?${buildQueryString(newFilters)}`);
  };

  const handleTemplateChange = (templateId: string) => {
    console.log('🔄 Cambiando template a:', templateId);
    setSelectedTemplate(templateId);
    // Aquí podrías agregar lógica para filtrar por template si es necesario
    const newFilters = { ...filters, page: 1 };
    setFilters(newFilters);
    router.push(`/dashboard/notes?${buildQueryString(newFilters)}`);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    const newFilters = { ...filters, page };
    setFilters(newFilters);
    router.push(`/dashboard/notes?${buildQueryString(newFilters)}`);
  };

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    setFilters(newFilters);
    router.push(`/dashboard/notes?${buildQueryString(newFilters)}`);
  };

  const handleClearFilters = () => {
    const newFilters: PostFilters = {
      status: filters.status,
      perPage: 20,
      page: 1,
      origin: '',
      startDate: '',
      endDate: '',
      title: '',
      usedInNewsletter: undefined,
      highlight: undefined,
      orderBy: '',
      categoryId: '',
      subcategoryId: '',
      contentTypeId: '',
    };
    setFilters(newFilters);
    setSearchTerm('');
    setSelectedTemplate('all');
    router.push(`/dashboard/notes?${buildQueryString(newFilters)}`);
  };

  // Agregar useEffect para debug de filtros
  useEffect(() => {
    console.log('📊 Filtros actuales:', filters);
  }, [filters]);

  return (
    <DashboardContent>
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <CustomBreadcrumbs
          heading="Notas"
          subheading="Crea, personaliza y publica tus notas en MICHIN"
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Box
          sx={{
            gap: 3,
            display: 'flex',
            mb: { xs: 3, md: 2 },
            justifyContent: 'space-between',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-end', sm: 'center' },
          }}
        >
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flex: 1 }}>
            <TextField
              placeholder="Buscar notas..."
              name="search-note"
              variant="filled"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                handleSearch(e.target.value);
              }}
              sx={{
                flex: 1,
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start" sx={{ mt: 0 }}>
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
                border: 'none',
                borderColor: 'none',
                height: '50px',
                width: '50px',
                borderRadius: '8px',
                background: '#F1F2FF',
              }}
            >
              <Iconify icon="solar:settings-bold" sx={{ color: '#6950E8' }} />
            </IconButton>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => router.push('/new/note?mode=ai')}
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

        {/* Filtro de Templates - Nueva sección prominente */}
        {/* <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Filtrar por Template
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
            <Chip
              label="Todos los templates"
              onClick={() => handleTemplateChange('all')}
              color={selectedTemplate === 'all' ? 'primary' : 'default'}
              variant={selectedTemplate === 'all' ? 'filled' : 'outlined'}
              sx={{ cursor: 'pointer' }}
            />

            {emailTemplates.map((template) => (
              <Chip
                key={template.id}
                label={template.name}
                onClick={() => handleTemplateChange(template.id)}
                color={selectedTemplate === template.id ? 'primary' : 'default'}
                variant={selectedTemplate === template.id ? 'filled' : 'outlined'}
                sx={{ cursor: 'pointer' }}
                // icon={}
              />
            ))}
          </Box>
        </Box> */}

        {/* Filtro de Estado - Ahora secundario */}
        <Box sx={{ mb: 3 }}>
          <Tabs
            color="primary"
            value={filters.status?.toLowerCase() || 'draft'}
            onChange={handleChangeTab}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
              },
              '& .MuiTab-root.Mui-selected': {
                color: 'primary.main',
              },
              '& .MuiTabs-indicator': {
                backgroundColor: 'primary.main',
              },
            }}
          >
            {TABS.map((tabItem: Tab) => (
              <Tab key={tabItem.value} label={tabItem.label} value={tabItem.value} />
            ))}
          </Tabs>
        </Box>
        {/* 
        {error && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <Typography color="error">Error al cargar las notas: {error}</Typography>
          </Box>
        )} */}

        {loading ? (
          <NotesGridSkeleton count={filters.perPage || 6} />
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
                {selectedTemplate !== 'all' && (
                  <span>
                    {' '}
                    del template &quot;{emailTemplates.find((t) => t.id === selectedTemplate)?.name}
                    &quot;
                  </span>
                )}
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
              {/* Template y Origen */}
              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                <FormControl fullWidth>
                  <InputLabel>Template</InputLabel>
                  <Select
                    value={selectedTemplate}
                    label="Template"
                    onChange={(e) => handleTemplateChange(e.target.value)}
                  >
                    <MenuItem value="all">Todos los templates</MenuItem>
                    {emailTemplates.map((template) => (
                      <MenuItem key={template.id} value={template.id}>
                        {template.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

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
              </Box>

              {/* Elementos por página */}
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
      </Box>
    </DashboardContent>
  );
}

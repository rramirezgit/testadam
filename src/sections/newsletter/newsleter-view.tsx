'use client';

import type { Newsletter } from 'src/types/newsletter';

import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import {
  Box,
  Tab,
  Grid,
  Tabs,
  Card,
  Modal,
  Paper,
  Button,
  Select,
  Divider,
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
} from '@mui/material';

import { buildQueryString } from 'src/utils/url-utils';

import { DashboardContent } from 'src/layouts/dashboard/content';
import usePostStore, { type NewsletterFilters } from 'src/store/PostStore';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import ContentCard from 'src/components/newsletter-note/content-card';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import AINewsletterModal from 'src/components/newsletter-note/ai-creation/AINewsletterModal';

type Tab = {
  label: string;
  value: string;
};

const TABS: Tab[] = [
  {
    label: 'Borradores',
    value: 'DRAFT',
  },
  {
    label: 'Pendiente Aprobación',
    value: 'PENDING_APPROVAL',
  },
  {
    label: 'Aprobados',
    value: 'APPROVED',
  },
  {
    label: 'Rechazados',
    value: 'REJECTED',
  },
  {
    label: 'Programados',
    value: 'SCHEDULED',
  },
  {
    label: 'Enviados',
    value: 'SENDED',
  },
  // {
  //   label: 'Eliminados',
  //   value: 'DELETED',
  // },
];

// Componente Skeleton para las cards de newsletters
function NewsletterCardSkeleton() {
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
function NewslettersGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <Grid container spacing={3}>
      {Array.from({ length: count }).map((_, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
          <NewsletterCardSkeleton />
        </Grid>
      ))}
    </Grid>
  );
}

export default function NewsletterView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const [openFiltersModal, setOpenFiltersModal] = useState(false);
  const [openAIModal, setOpenAIModal] = useState(false);

  // Estados para filtros avanzados - Usar NewsletterFilters
  const [filters, setFilters] = useState<NewsletterFilters>({
    status: searchParams.get('status') || 'DRAFT',
    perPage: Number(searchParams.get('perPage')) || 20,
    page: Number(searchParams.get('page')) || 1,
    createdStartDate: searchParams.get('createdStartDate') || '',
    createdEndDate: searchParams.get('createdEndDate') || '',
    scheduledStartDate: searchParams.get('scheduledStartDate') || '',
    scheduledEndDate: searchParams.get('scheduledEndDate') || '',
    subject: searchParams.get('subject') || '',
    orderBy: searchParams.get('orderBy') || '',
  });

  // Use PostStore directly
  const { findAllNewsletters, deleteNewsletter } = usePostStore();
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);

  // Load saved newsletters on component mount and when filters change
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        console.log('🔄 Cargando datos de newsletters con filtros:', filters);

        const newslettersData = await findAllNewsletters(filters);
        setNewsletters(newslettersData);

        console.log('✅ Datos de newsletters cargados exitosamente');
      } catch (error) {
        console.error('❌ Error cargando datos de newsletters:', error);
        setNewsletters([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Add event listener to refresh data when storage changes
    const handleStorageChange = () => {
      loadData();
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [findAllNewsletters, filters]);

  const handleOpenNewsletterEditor = (newsletter?: Newsletter) => {
    if (newsletter) {
      router.push(`/edit/newsletter/${newsletter.id}`);
    } else {
      router.push('/new/newsletter');
    }
  };

  const handleDeleteNewsletter = async (newsletterId: string) => {
    const success = await deleteNewsletter(newsletterId);
    if (success) {
      // Recargar la lista de newsletters después de eliminar
      const newslettersData = await findAllNewsletters(filters);
      setNewsletters(newslettersData);
    }
  };

  // Manejar búsqueda con debounce
  const handleSearch = useCallback(
    (value: string) => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }

      const newTimeout = setTimeout(() => {
        const newFilters = { ...filters, subject: value, page: 1 };
        setFilters(newFilters);
        router.push(`/dashboard/newsletter?${buildQueryString(newFilters)}`);
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

  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    console.log('🔄 Cambiando tab a:', newValue);
    const newFilters = { ...filters, status: newValue, page: 1 };
    setFilters(newFilters);
    router.push(`/dashboard/newsletter?${buildQueryString(newFilters)}`);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    const newFilters = { ...filters, page };
    setFilters(newFilters);
    router.push(`/dashboard/newsletter?${buildQueryString(newFilters)}`);
  };

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    setFilters(newFilters);
    router.push(`/dashboard/newsletter?${buildQueryString(newFilters)}`);
  };

  const handleClearFilters = () => {
    const newFilters: NewsletterFilters = {
      status: filters.status,
      perPage: 20,
      page: 1,
      createdStartDate: '',
      createdEndDate: '',
      scheduledStartDate: '',
      scheduledEndDate: '',
      subject: '',
      orderBy: '',
    };
    setFilters(newFilters);
    router.push(`/dashboard/newsletter?${buildQueryString(newFilters)}`);
  };

  return (
    <DashboardContent>
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <CustomBreadcrumbs
          heading="Newsletters"
          subheading="Crea, personaliza y envía tus newsletters"
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
              placeholder="Buscar newsletters..."
              name="search-newsletter"
              variant="filled"
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
                border: 'none',
                borderColor: 'none',
                height: '50px',
                width: '50px',
                borderRadius: '8px',
                background: '#F1F2FF',
              }}
            >
              <Iconify icon="solar:settings-bold" />
            </IconButton>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenAIModal(true)}
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
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleOpenNewsletterEditor()}
            >
              <Iconify icon="mingcute:add-line" style={{ marginRight: '8px' }} />
              Crear Newsletter
            </Button>
          </Box>
        </Box>

        {/* Filtro de Estado */}
        <Box sx={{ mb: 3 }}>
          <Tabs
            value={filters.status}
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

        {loading ? (
          <NewslettersGridSkeleton count={filters.perPage || 6} />
        ) : newsletters.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 8,
              textAlign: 'center',
            }}
          >
            <EmptyContent
              imgUrl="/assets/icons/empty/ic-notes.svg"
              title="Aún no tienes comunicados creados."
              description="Comienza creando una nuevo comunicado para ver tus resultados aquí."
              action={
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    marginTop: '16px',
                  }}
                  startIcon={<Iconify icon="mingcute:add-line" />}
                  onClick={() => handleOpenNewsletterEditor()}
                >
                  Crear Newsletter
                </Button>
              }
            />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {newsletters.map((newsletter) => (
              <Grid key={newsletter.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <ContentCard
                  content={newsletter}
                  type="newsletter"
                  onOpen={handleOpenNewsletterEditor}
                  onDelete={handleDeleteNewsletter}
                />
              </Grid>
            ))}
          </Grid>
        )}

        {/* Paginación */}
        {newsletters.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <Pagination
                count={Math.ceil(newsletters.length / filters.perPage)}
                page={filters.page}
                onChange={handlePageChange}
                color="primary"
                showFirstButton
                showLastButton
              />
              <Typography variant="body2" color="text.secondary">
                Mostrando {Math.min(filters.perPage, newsletters.length)} de {newsletters.length}{' '}
                newsletters
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

              {/* Fechas de Creación */}
              <Typography variant="subtitle2" sx={{ mt: 1 }}>
                Fecha de Creación
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                <TextField
                  type="date"
                  label="Desde"
                  value={filters.createdStartDate}
                  onChange={(e) => handleFilterChange('createdStartDate', e.target.value)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />

                <TextField
                  type="date"
                  label="Hasta"
                  value={filters.createdEndDate}
                  onChange={(e) => handleFilterChange('createdEndDate', e.target.value)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Box>

              {/* Fechas de Programación */}
              <Typography variant="subtitle2" sx={{ mt: 1 }}>
                Fecha de Programación
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                <TextField
                  type="date"
                  label="Desde"
                  value={filters.scheduledStartDate}
                  onChange={(e) => handleFilterChange('scheduledStartDate', e.target.value)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />

                <TextField
                  type="date"
                  label="Hasta"
                  value={filters.scheduledEndDate}
                  onChange={(e) => handleFilterChange('scheduledEndDate', e.target.value)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Box>

              {/* Orden */}
              <FormControl fullWidth>
                <InputLabel>Ordenar por</InputLabel>
                <Select
                  value={filters.orderBy}
                  label="Ordenar por"
                  onChange={(e) => handleFilterChange('orderBy', e.target.value)}
                >
                  <MenuItem value="">Por defecto</MenuItem>
                  <MenuItem value="subject">Asunto</MenuItem>
                  <MenuItem value="createdAt">Fecha de creación</MenuItem>
                  <MenuItem value="scheduledAt">Fecha programada</MenuItem>
                </Select>
              </FormControl>
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

        {/* Modal de IA para crear newsletter */}
        <AINewsletterModal open={openAIModal} onClose={() => setOpenAIModal(false)} />
      </Box>
    </DashboardContent>
  );
}

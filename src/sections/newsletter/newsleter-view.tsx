/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

import type { Newsletter } from 'src/types/newsletter';

import Image from 'next/image';
import { Icon } from '@iconify/react';
import { useState, useEffect, useCallback } from 'react';

import {
  Box,
  Tab,
  Grid,
  Tabs,
  Chip,
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

import usePostStore from 'src/store/PostStore';
import { DashboardContent } from 'src/layouts/dashboard/content';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import NewsletterCard from 'src/components/newsletter-note/newsletter-card';
import NewsletterEditor from 'src/components/newsletter-note/newsletter-editor';
import { emailTemplates } from 'src/components/newsletter-note/email-editor/data/email-templates';

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
    label: 'Review',
    value: 'REVIEW',
  },
  {
    label: 'Aprobados',
    value: 'APPROVED',
  },
  {
    label: 'ADAC',
    value: 'PUBLISHED',
  },
];

export default function NewsletterView() {
  const [openNewsletterEditor, setOpenNewsletterEditor] = useState(false);
  const [currentNewsletter, setCurrentNewsletter] = useState<Newsletter | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('DRAFT');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const [openFiltersModal, setOpenFiltersModal] = useState(false);

  // Nuevo estado para filtro de templates
  const [selectedTemplate, setSelectedTemplate] = useState<string>('all');

  // Estados para filtros avanzados
  const [filters, setFilters] = useState({
    origin: '',
    startDate: '',
    endDate: '',
    highlight: false,
    perPage: 20,
    page: 1,
  });

  // Use PostStore directly
  const { findAllNewsletters, delete: deleteNewsletter } = usePostStore();
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);

  // Load saved newsletters on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        console.log('🔄 Cargando datos de newsletters...');

        const newslettersData = await findAllNewsletters();
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
  }, [findAllNewsletters]);

  // Refresh data when editors are closed
  useEffect(() => {
    const refreshData = async () => {
      if (!openNewsletterEditor) {
        try {
          console.log('🔄 Refrescando datos después de cerrar editor...');
          const newslettersData = await findAllNewsletters();
          setNewsletters(newslettersData);
          console.log('✅ Datos refrescados exitosamente');
        } catch (error) {
          console.error('❌ Error refrescando datos:', error);
        }
      }
    };

    refreshData();
  }, [openNewsletterEditor, findAllNewsletters]);

  const handleOpenNewsletterEditor = (newsletter?: Newsletter) => {
    if (newsletter) {
      setCurrentNewsletter(newsletter);
    } else {
      setCurrentNewsletter(null);
    }
    setOpenNewsletterEditor(true);
  };

  const handleCloseNewsletterEditor = () => {
    setOpenNewsletterEditor(false);
    setCurrentNewsletter(null);
  };

  const handleDeleteNewsletter = (newsletterId: string) => {
    deleteNewsletter(newsletterId);
  };

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

  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    console.log('🔄 Cambiando tab a:', newValue);
    setTab(newValue);
    setFilters((prev) => ({ ...prev, page: 1 })); // Reset page on tab change
  };

  const handleTemplateChange = (templateId: string) => {
    console.log('🔄 Cambiando template a:', templateId);
    setSelectedTemplate(templateId);
    setFilters((prev) => ({ ...prev, page: 1 })); // Reset page on template change
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
    setSelectedTemplate('all');
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
            mb: { xs: 3, md: 5 },
            justifyContent: 'space-between',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-end', sm: 'center' },
          }}
        >
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flex: 1 }}>
            <TextField
              placeholder="Buscar newsletters..."
              name="search-newsletter"
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

        {/* Filtro de Templates - Nueva sección prominente */}
        <Box sx={{ mb: 3 }}>
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
              />
            ))}
          </Box>
        </Box>

        {/* Filtro de Estado - Ahora secundario */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
            Estado de los newsletters
          </Typography>
          <Tabs
            value={tab}
            onChange={handleChangeTab}
            sx={{
              '& .MuiTab-root': {
                minHeight: '40px',
                fontSize: '0.875rem',
                textTransform: 'none',
              },
            }}
          >
            {TABS.map((tabItem: Tab) => (
              <Tab key={tabItem.value} label={tabItem.label} value={tabItem.value} />
            ))}
          </Tabs>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <Typography>Loading your newsletters...</Typography>
          </Box>
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
            <Icon
              icon="mdi:email-newsletter"
              style={{ fontSize: 64, marginBottom: 16, opacity: 0.5 }}
            />
            <Typography variant="h5" gutterBottom>
              No newsletters yet
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 500 }}>
              Create your first newsletter by combining your email templates.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Icon icon="mdi:plus" />}
              onClick={() => handleOpenNewsletterEditor()}
            >
              Create New Newsletter
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {newsletters
              .filter((newsletter) => {
                // Filtrar newsletters según el tab activo
                switch (tab) {
                  case 'DRAFT':
                    return newsletter.status === 'DRAFT' || !newsletter.status;
                  case 'REVIEW':
                    return newsletter.status === 'REVIEW';
                  case 'APPROVED':
                    return newsletter.status === 'APPROVED';
                  case 'PUBLISHED':
                    return newsletter.status === 'PUBLISHED';
                  default:
                    return true;
                }
              })
              .map((newsletter) => (
                <Grid key={newsletter.id} component="div">
                  <NewsletterCard
                    newsletter={newsletter}
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
                label="Solo newsletters destacados"
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

        {/* Newsletter Editor Dialog */}
        <Dialog fullScreen open={openNewsletterEditor} onClose={handleCloseNewsletterEditor}>
          <NewsletterEditor
            onClose={handleCloseNewsletterEditor}
            initialNewsletter={currentNewsletter}
          />
        </Dialog>
      </Box>
    </DashboardContent>
  );
}

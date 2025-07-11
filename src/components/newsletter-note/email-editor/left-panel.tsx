'use client';

import React from 'react';
import { Icon } from '@iconify/react';

import {
  Box,
  Grid,
  Chip,
  Card,
  Alert,
  Button,
  Avatar,
  Dialog,
  TextField,
  Accordion,
  Typography,
  CardContent,
  DialogTitle,
  ToggleButton,
  DialogContent,
  DialogActions,
  InputAdornment,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  ToggleButtonGroup,
} from '@mui/material';

import ContentLibrary from './content-library';

import type { ComponentType, NewsletterNote } from './types';

// Nueva interfaz para controlar qué componentes están habilitados
interface EnabledComponents {
  // Componentes de Texto
  heading?: boolean;
  paragraph?: boolean;
  bulletList?: boolean;
  textWithIcon?: boolean;

  // Componentes de Multimedia
  image?: boolean;
  gallery?: boolean;
  imageText?: boolean;
  twoColumns?: boolean;
  chart?: boolean;

  // Componentes de Diseño
  button?: boolean;
  divider?: boolean;
  spacer?: boolean;

  // Componentes de Noticias
  category?: boolean;
  author?: boolean;
  summary?: boolean;
  tituloConIcono?: boolean;
  herramientas?: boolean;
  respaldadoPor?: boolean;
  // newsletterHeader?: boolean; // ELIMINADO: Solo usaremos header global
  newsletterHeaderReusable?: boolean;
  newsletterFooterReusable?: boolean;
}

interface LeftPanelProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  expandedCategories: Record<string, boolean>;
  setExpandedCategories: (categories: Record<string, boolean>) => void;
  addComponent: (type: ComponentType) => void;
  emailTemplates: {
    id: string;
    name: string;
    description: string;
    image: string;
    icon?: string;
  }[];
  activeTemplate: string;
  setActiveTemplate: (template: string) => void;
  generatingEmail: boolean;
  handleGenerateEmailHtml: () => void;
  setOpenSaveDialog: (open: boolean) => void;
  activeVersion: string;
  setActiveVersion: (version: 'web' | 'newsletter') => void;
  // Nuevas props para newsletter
  isNewsletterMode?: boolean;
  newsletterNotes?: NewsletterNote[];
  onAddNewsletterNote?: (note: NewsletterNote) => void;
  onEditNote?: (note: any) => void;
  // Nueva prop para controlar componentes habilitados
  enabledComponents?: EnabledComponents;
  // Nuevas props para notas disponibles
  availableNotes?: any[];
  loadingNotes?: boolean;
  onInjectNote?: (noteId: string) => void;
  onRefreshNotes?: () => void;
}

export default function LeftPanel({
  searchQuery,
  setSearchQuery,
  expandedCategories,
  setExpandedCategories,
  addComponent,
  emailTemplates,
  activeTemplate,
  setActiveTemplate,
  generatingEmail,
  handleGenerateEmailHtml,
  setOpenSaveDialog,
  activeVersion,
  setActiveVersion,
  // Nuevas props para newsletter
  isNewsletterMode = false,
  newsletterNotes = [],
  onAddNewsletterNote = () => {},
  onEditNote = () => {},
  // Configuración por defecto: solo títulos habilitados
  enabledComponents = {
    heading: true,
    paragraph: true,
    bulletList: true,
    textWithIcon: true,
    image: true,
    gallery: true,
    imageText: true,
    twoColumns: true,
    chart: true,
    button: false,
    divider: true,
    spacer: false,
    category: true,
    author: false,
    summary: true,
    tituloConIcono: true,
    herramientas: false,
    respaldadoPor: true,
    // newsletterHeader: true, // ELIMINADO: Solo usaremos header global
    newsletterHeaderReusable: true,
    newsletterFooterReusable: true,
  },
  // Nuevas props para notas disponibles
  availableNotes = [],
  loadingNotes = false,
  onInjectNote = () => {},
  onRefreshNotes = () => {},
}: LeftPanelProps) {
  const [activeTab, setActiveTab] = React.useState<'content' | 'library'>('content');
  const [openNotesModal, setOpenNotesModal] = React.useState(false);
  const [notesFilter, setNotesFilter] = React.useState('');
  const [openTemplateModal, setOpenTemplateModal] = React.useState(true);

  const handleTabChange = (
    event: React.MouseEvent<HTMLElement>,
    newValue: 'content' | 'library' | null
  ) => {
    if (newValue !== null) {
      setActiveTab(newValue);
    }
  };

  // Función para verificar si al menos un componente de una categoría está habilitado
  const hasCategoryComponents = (
    category: 'texto' | 'multimedia' | 'diseño' | 'noticias' | 'newsletter'
  ) => {
    switch (category) {
      case 'texto':
        return (
          enabledComponents.heading ||
          enabledComponents.paragraph ||
          enabledComponents.bulletList ||
          enabledComponents.textWithIcon
        );
      case 'multimedia':
        return (
          enabledComponents.image ||
          enabledComponents.gallery ||
          enabledComponents.imageText ||
          enabledComponents.twoColumns ||
          enabledComponents.chart
        );
      case 'diseño':
        return enabledComponents.button || enabledComponents.divider || enabledComponents.spacer;
      case 'noticias':
        return (
          enabledComponents.category ||
          enabledComponents.author ||
          enabledComponents.summary ||
          enabledComponents.tituloConIcono ||
          enabledComponents.herramientas ||
          enabledComponents.respaldadoPor
        );
      case 'newsletter':
        return (
          enabledComponents.newsletterHeaderReusable || enabledComponents.newsletterFooterReusable
        );
      default:
        return false;
    }
  };

  // Filtrar notas por título
  const filteredNotes = availableNotes.filter((note) =>
    note.title?.toLowerCase().includes(notesFilter.toLowerCase())
  );

  // Función para manejar la inyección de nota y cerrar el modal
  const handleInjectNote = (noteId: string) => {
    onInjectNote(noteId);
    setOpenNotesModal(false);
    setNotesFilter('');
  };

  // Función para manejar la selección de plantilla
  const handleTemplateSelect = (templateId: string) => {
    setActiveTemplate(templateId);
    setOpenTemplateModal(false);
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', p: 1, flexShrink: 0 }}>
        <ToggleButtonGroup
          value={activeTab}
          exclusive
          onChange={handleTabChange}
          aria-label="Opciones de panel"
          size="small"
          color="primary"
          sx={{
            mb: 1,
            width: '100%',
            border: 'none',
            '& .MuiToggleButton-root': {
              flex: 1,
              fontSize: { xs: '0.65rem', sm: '0.75rem' },
              padding: { xs: '4px 6px', sm: '6px 8px' },
            },
          }}
        >
          <ToggleButton value="content" aria-label="content">
            Contenido
          </ToggleButton>
          {isNewsletterMode && (
            <ToggleButton value="library" aria-label="library">
              Biblioteca
            </ToggleButton>
          )}
        </ToggleButtonGroup>
      </Box>

      {activeTab === 'content' && (
        <>
          {/* Búsqueda de componentes */}
          <Box sx={{ px: 1, pb: 1, flexShrink: 0 }}>
            <TextField
              label="Buscar componentes"
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              fullWidth
            />
          </Box>

          {/* Lista de componentes */}
          <Box sx={{ flexGrow: 1, overflow: 'auto', px: 1 }}>
            {/* Categoría de Texto - Solo mostrar si tiene componentes habilitados */}
            {hasCategoryComponents('texto') && (
              <Accordion
                expanded={expandedCategories.texto}
                onChange={() =>
                  setExpandedCategories({ ...expandedCategories, texto: !expandedCategories.texto })
                }
              >
                <AccordionSummary expandIcon={<Icon icon="mdi:chevron-down" />}>
                  <Chip label="Texto" variant="filled" size="small" />
                </AccordionSummary>
                <AccordionDetails sx={{ p: 1 }}>
                  <Grid container spacing={1}>
                    {enabledComponents.heading && (
                      <Grid size={4}>
                        <Button
                          onClick={() => addComponent('heading')}
                          fullWidth
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            p: 1,
                            minHeight: '60px',
                          }}
                        >
                          <Icon icon="mdi:format-header-1" style={{ fontSize: '1.5rem' }} />
                          <Typography variant="caption" sx={{ fontSize: '0.7rem', mt: 0.5 }}>
                            Títulos
                          </Typography>
                        </Button>
                      </Grid>
                    )}
                    {enabledComponents.paragraph && (
                      <Grid size={4}>
                        <Button
                          onClick={() => addComponent('paragraph')}
                          fullWidth
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            p: 1,
                            minHeight: '60px',
                          }}
                        >
                          <Icon icon="mdi:format-paragraph" style={{ fontSize: '1.5rem' }} />
                          <Typography variant="caption" sx={{ fontSize: '0.7rem', mt: 0.5 }}>
                            Textos
                          </Typography>
                        </Button>
                      </Grid>
                    )}
                    {enabledComponents.bulletList && (
                      <Grid size={4}>
                        <Button
                          onClick={() => addComponent('bulletList')}
                          fullWidth
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            p: 1,
                            minHeight: '60px',
                          }}
                        >
                          <Icon icon="mdi:format-list-bulleted" style={{ fontSize: '1.5rem' }} />
                          <Typography variant="caption" sx={{ fontSize: '0.7rem', mt: 0.5 }}>
                            Listas
                          </Typography>
                        </Button>
                      </Grid>
                    )}
                    {enabledComponents.textWithIcon && (
                      <Grid size={4}>
                        <Button
                          onClick={() => addComponent('textWithIcon')}
                          fullWidth
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            p: 1,
                            minHeight: '60px',
                          }}
                        >
                          <Icon icon="mdi:text-box-outline" style={{ fontSize: '1.5rem' }} />
                          <Typography variant="caption" sx={{ fontSize: '0.7rem', mt: 0.5 }}>
                            Texto+Icono
                          </Typography>
                        </Button>
                      </Grid>
                    )}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            )}

            {/* Categoría de Multimedia - Solo mostrar si tiene componentes habilitados */}
            {hasCategoryComponents('multimedia') && (
              <Accordion
                expanded={expandedCategories.multimedia}
                onChange={() =>
                  setExpandedCategories({
                    ...expandedCategories,
                    multimedia: !expandedCategories.multimedia,
                  })
                }
              >
                <AccordionSummary expandIcon={<Icon icon="mdi:chevron-down" />}>
                  <Chip label="Multimedia" variant="filled" size="small" />
                </AccordionSummary>
                <AccordionDetails sx={{ p: 1 }}>
                  <Grid container spacing={1}>
                    {enabledComponents.image && (
                      <Grid size={6}>
                        <Button
                          onClick={() => addComponent('image' as ComponentType)}
                          fullWidth
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            p: 1,
                            minHeight: '60px',
                          }}
                        >
                          <Icon icon="mdi:image" style={{ fontSize: '1.5rem' }} />
                          <Typography variant="caption" sx={{ fontSize: '0.7rem', mt: 0.5 }}>
                            Imagen
                          </Typography>
                        </Button>
                      </Grid>
                    )}
                    {enabledComponents.gallery && (
                      <Grid size={6}>
                        <Button
                          onClick={() => addComponent('gallery')}
                          fullWidth
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            p: 1,
                            minHeight: '60px',
                          }}
                        >
                          <Icon icon="mdi:image-multiple" style={{ fontSize: '1.5rem' }} />
                          <Typography variant="caption" sx={{ fontSize: '0.7rem', mt: 0.5 }}>
                            Galería
                          </Typography>
                        </Button>
                      </Grid>
                    )}
                    {enabledComponents.imageText && (
                      <Grid size={6}>
                        <Button
                          onClick={() => addComponent('imageText')}
                          fullWidth
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            p: 1,
                            minHeight: '60px',
                          }}
                        >
                          <Icon icon="mdi:image-text" style={{ fontSize: '1.5rem' }} />
                          <Typography variant="caption" sx={{ fontSize: '0.7rem', mt: 0.5 }}>
                            Imagen+Texto
                          </Typography>
                        </Button>
                      </Grid>
                    )}
                    {enabledComponents.twoColumns && (
                      <Grid size={6}>
                        <Button
                          onClick={() => addComponent('twoColumns')}
                          fullWidth
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            p: 1,
                            minHeight: '60px',
                          }}
                        >
                          <Icon icon="mdi:view-column" style={{ fontSize: '1.5rem' }} />
                          <Typography variant="caption" sx={{ fontSize: '0.7rem', mt: 0.5 }}>
                            Dos Columnas
                          </Typography>
                        </Button>
                      </Grid>
                    )}
                    {enabledComponents.chart && (
                      <Grid size={6}>
                        <Button
                          onClick={() => addComponent('chart')}
                          fullWidth
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            p: 1,
                            minHeight: '60px',
                          }}
                        >
                          <Icon icon="mdi:chart-bar" style={{ fontSize: '1.5rem' }} />
                          <Typography variant="caption" sx={{ fontSize: '0.7rem', mt: 0.5 }}>
                            Gráficas
                          </Typography>
                        </Button>
                      </Grid>
                    )}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            )}

            {/* Categoría de Diseño - Solo mostrar si tiene componentes habilitados */}
            {hasCategoryComponents('diseño') && (
              <Accordion
                expanded={expandedCategories.diseño}
                onChange={() =>
                  setExpandedCategories({
                    ...expandedCategories,
                    diseño: !expandedCategories.diseño,
                  })
                }
              >
                <AccordionSummary expandIcon={<Icon icon="mdi:chevron-down" />}>
                  <Chip label="Diseño" variant="filled" size="small" />
                </AccordionSummary>
                <AccordionDetails>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-around',
                      mb: 2,
                      flexWrap: 'wrap',
                      gap: 1,
                    }}
                  >
                    {enabledComponents.button && (
                      <Button
                        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                        onClick={() => addComponent('button')}
                      >
                        <Icon icon="mdi:button-cursor" />
                        Añadir Botón
                      </Button>
                    )}
                    {enabledComponents.divider && (
                      <Button
                        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                        onClick={() => addComponent('divider')}
                      >
                        <Icon icon="mdi:minus" />
                        Añadir Separador
                      </Button>
                    )}
                    {enabledComponents.spacer && (
                      <Button
                        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                        onClick={() => addComponent('spacer')}
                      >
                        <Icon icon="mdi:arrow-expand-vertical" />
                        Añadir Espaciador
                      </Button>
                    )}
                  </Box>
                </AccordionDetails>
              </Accordion>
            )}

            {/* Categoría de Noticias - Solo mostrar si tiene componentes habilitados */}
            {hasCategoryComponents('noticias') && (
              <Accordion>
                <AccordionSummary expandIcon={<Icon icon="mdi:chevron-down" />}>
                  <Chip label="Componentes de Noticias" variant="filled" size="small" />
                </AccordionSummary>
                <AccordionDetails>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-around',
                      mb: 2,
                      flexWrap: 'wrap',
                      gap: 1,
                    }}
                  >
                    {enabledComponents.category && (
                      <Button
                        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                        onClick={() => addComponent('category')}
                      >
                        <Icon icon="mdi:tag" />
                        Añadir Categoría
                      </Button>
                    )}
                    {enabledComponents.author && (
                      <Button
                        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                        onClick={() => addComponent('author')}
                      >
                        <Icon icon="mdi:account" />
                        Añadir Autor
                      </Button>
                    )}
                    {enabledComponents.summary && (
                      <Button
                        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                        onClick={() => addComponent('summary')}
                      >
                        <Icon icon="mdi:text-box-outline" />
                        Añadir Resumen
                      </Button>
                    )}
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-around',
                      mb: 2,
                      flexWrap: 'wrap',
                      gap: 1,
                    }}
                  >
                    {enabledComponents.tituloConIcono && (
                      <Button
                        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                        onClick={() => addComponent('tituloConIcono')}
                      >
                        <Icon icon="mdi:format-title" />
                        Título con Icono
                      </Button>
                    )}
                    {enabledComponents.herramientas && (
                      <Button
                        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                        onClick={() => addComponent('herramientas')}
                      >
                        <Icon icon="mdi:hammer-wrench" />
                        Herramientas
                      </Button>
                    )}
                    {enabledComponents.respaldadoPor && (
                      <Button
                        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                        onClick={() => addComponent('respaldadoPor')}
                      >
                        <Icon icon="mdi:shield-check" />
                        Respaldado Por
                      </Button>
                    )}
                  </Box>
                </AccordionDetails>
              </Accordion>
            )}

            {/* Categoría de Newsletter - Solo mostrar si tiene componentes habilitados */}
            {hasCategoryComponents('newsletter') && (
              <Accordion
                expanded={expandedCategories.newsletter}
                onChange={() =>
                  setExpandedCategories({
                    ...expandedCategories,
                    newsletter: !expandedCategories.newsletter,
                  })
                }
              >
                <AccordionSummary expandIcon={<Icon icon="mdi:chevron-down" />}>
                  <Chip label="Newsletter" variant="filled" size="small" />
                </AccordionSummary>
                <AccordionDetails sx={{ p: 1 }}>
                  <Grid container spacing={1}>
                    {enabledComponents.newsletterHeaderReusable && (
                      <Grid size={4}>
                        <Button
                          onClick={() => addComponent('newsletterHeaderReusable')}
                          fullWidth
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            p: 1,
                            minHeight: '60px',
                          }}
                        >
                          <Icon icon="mdi:header" style={{ fontSize: '1.5rem' }} />
                          <Typography variant="caption" sx={{ fontSize: '0.7rem', mt: 0.5 }}>
                            Header Reusable
                          </Typography>
                        </Button>
                      </Grid>
                    )}
                    {enabledComponents.newsletterFooterReusable && (
                      <Grid size={4}>
                        <Button
                          onClick={() => addComponent('newsletterFooterReusable')}
                          fullWidth
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            p: 1,
                            minHeight: '60px',
                          }}
                        >
                          <Icon icon="mdi:footer" style={{ fontSize: '1.5rem' }} />
                          <Typography variant="caption" sx={{ fontSize: '0.7rem', mt: 0.5 }}>
                            Footer Reusable
                          </Typography>
                        </Button>
                      </Grid>
                    )}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            )}

            {/* BOTÓN PARA ABRIR MODAL DE NOTAS - Solo mostrar si es template newsletter */}
            {activeTemplate === 'newsletter' && activeVersion === 'newsletter' && (
              <Box sx={{ mt: 2, px: 1 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Icon icon="mdi:plus-circle" style={{ fontSize: '1.2rem' }} />}
                  onClick={() => setOpenNotesModal(true)}
                  sx={{
                    py: 1.5,
                    fontSize: '0.875rem',
                    fontWeight: 600,
                  }}
                >
                  Inyectar Notas Disponibles
                </Button>
              </Box>
            )}
          </Box>
        </>
      )}

      {/* Tab de Biblioteca para Newsletter */}
      {activeTab === 'library' && isNewsletterMode && (
        <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
          <ContentLibrary
            selectedNotes={newsletterNotes}
            onAddNote={onAddNewsletterNote}
            onEditNote={onEditNote}
          />
        </Box>
      )}

      {/* MODAL DE SELECCIÓN DE PLANTILLAS */}
      <Dialog
        open={openTemplateModal}
        onClose={() => setOpenTemplateModal(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            maxHeight: '90vh',
          },
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Icon icon="mdi:file-document-multiple" style={{ fontSize: '1.5rem' }} />
            <Typography variant="h5">Selecciona una Plantilla</Typography>
          </Box>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Elige la plantilla que mejor se adapte a tu contenido
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Grid container spacing={3}>
            {emailTemplates.map((template) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={template.id}>
                <Card
                  onClick={() => handleTemplateSelect(template.id)}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                    border:
                      activeTemplate === template.id ? '2px solid #1976d2' : '1px solid #e0e0e0',
                  }}
                >
                  <Box
                    sx={{
                      height: 200,
                      background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {template.icon && (
                      <Icon
                        icon={template.icon}
                        style={{
                          fontSize: '3rem',
                          color: 'white',
                          opacity: 0.8,
                        }}
                      />
                    )}
                    {template.image && template.image.startsWith('/') && (
                      <Box
                        component="img"
                        src={template.image}
                        alt={template.name}
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          opacity: 0.3,
                        }}
                      />
                    )}
                  </Box>
                  <CardContent sx={{ flexGrow: 1, p: 2 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        mb: 1,
                        textAlign: 'center',
                      }}
                    >
                      {template.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontSize: '0.875rem',
                        textAlign: 'center',
                        lineHeight: 1.4,
                      }}
                    >
                      {template.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenTemplateModal(false)} variant="outlined">
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>

      {/* MODAL DE NOTAS DISPONIBLES */}
      <Dialog
        open={openNotesModal}
        onClose={() => {
          setOpenNotesModal(false);
          setNotesFilter('');
        }}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            maxHeight: '80vh',
          },
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Icon icon="mdi:file-document-multiple" style={{ fontSize: '1.5rem' }} />
            <Typography variant="h6">Notas Disponibles</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Selecciona notas para inyectar en el template de newsletter
          </Typography>
        </DialogTitle>

        <DialogContent>
          {/* Filtro de búsqueda */}
          <TextField
            fullWidth
            placeholder="Buscar por título..."
            value={notesFilter}
            onChange={(e) => setNotesFilter(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Icon icon="mdi:magnify" />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          {/* Lista de notas */}
          {loadingNotes ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : availableNotes.length === 0 ? (
            <Alert severity="info">No hay notas disponibles para inyectar</Alert>
          ) : filteredNotes.length === 0 ? (
            <Alert severity="warning">No se encontraron notas que coincidan con la búsqueda</Alert>
          ) : (
            <Box sx={{ maxHeight: '60vh', overflow: 'auto' }}>
              <Grid container spacing={2}>
                {filteredNotes.map((note) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={note.id}>
                    <Card
                      onClick={() => handleInjectNote(note.id)}
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        '&:hover': {
                          boxShadow: 3,
                        },
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1, p: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                          {note.coverImageUrl && (
                            <Avatar
                              src={note.coverImageUrl}
                              variant="rounded"
                              sx={{ width: 60, height: 60, flexShrink: 0 }}
                            />
                          )}
                          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                            <Typography
                              variant="h6"
                              sx={{
                                fontSize: '1rem',
                                fontWeight: 600,
                                lineHeight: 1.3,
                                mb: 1,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                              }}
                            >
                              {note.title}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                              <Chip
                                label={note.status}
                                size="small"
                                color={note.status === 'DRAFT' ? 'default' : 'primary'}
                              />
                              {note.highlight && (
                                <Chip label="Destacado" size="small" color="warning" />
                              )}
                            </Box>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontSize: '0.75rem' }}
                            >
                              {new Date(note.createdAt).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => {
              setOpenNotesModal(false);
              setNotesFilter('');
            }}
          >
            Cerrar
          </Button>
          <Button
            variant="outlined"
            startIcon={<Icon icon="mdi:refresh" />}
            onClick={onRefreshNotes}
            disabled={loadingNotes}
          >
            Actualizar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

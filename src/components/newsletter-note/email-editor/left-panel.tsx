'use client';

import React from 'react';
import { Icon } from '@iconify/react';

import {
  Box,
  Grid,
  Chip,
  Button,
  TextField,
  Accordion,
  Typography,
  ToggleButton,
  AccordionSummary,
  AccordionDetails,
  ToggleButtonGroup,
} from '@mui/material';

import TemplateCard from './TemplateCard';
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
    button: false,
    divider: true,
    spacer: false,
    category: true,
    author: false,
    summary: true,
    tituloConIcono: true,
    herramientas: false,
    respaldadoPor: true,
  },
}: LeftPanelProps) {
  const [activeTab, setActiveTab] = React.useState('templates');

  const handleTabChange = (event: React.MouseEvent<HTMLElement>, newValue: string) => {
    if (newValue !== null) {
      setActiveTab(newValue);
    }
  };

  // Función para verificar si al menos un componente de una categoría está habilitado
  const hasCategoryComponents = (category: 'texto' | 'multimedia' | 'diseño' | 'noticias') => {
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
          enabledComponents.twoColumns
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
      default:
        return false;
    }
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
          <ToggleButton value="templates" aria-label="templates">
            Plantillas
          </ToggleButton>
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

      {activeTab === 'templates' && (
        <Box sx={{ flexGrow: 1, overflow: 'auto', px: 1 }}>
          {/* Acordeón de Noticias */}
          <Accordion>
            <AccordionSummary expandIcon={<Icon icon="mdi:chevron-down" />}>
              <Chip label="Noticias" variant="filled" size="small" />
            </AccordionSummary>
            <AccordionDetails sx={{ p: 1 }}>
              <Grid container spacing={1}>
                {emailTemplates
                  .filter(
                    (template) =>
                      template.id === 'news' ||
                      template.id === 'market' ||
                      template.id === 'feature'
                  )
                  .map((template) => (
                    <Grid size={12} key={template.id}>
                      <TemplateCard
                        template={template}
                        activeTemplate={activeTemplate}
                        setActiveTemplate={setActiveTemplate}
                      />
                    </Grid>
                  ))}
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Acordeón de Otras Plantillas */}
          {/* <Accordion>
            <AccordionSummary expandIcon={<Icon icon="mdi:chevron-down" />}>
              <Chip label="Otras Plantillas" variant="filled" size="small" />
            </AccordionSummary>
            <AccordionDetails sx={{ p: 1 }}>
              <Grid container spacing={1}>
                {emailTemplates
                  .filter((template) => template.id !== 'news' && template.id !== 'market' && template.id !== 'feature')
                  .map((template) => (
                    <Grid size={{ xs: 12, sm: 6 }} key={template.id}>
                      <TemplateCard
                        template={template}
                        activeTemplate={activeTemplate}
                        setActiveTemplate={setActiveTemplate}
                      />
                    </Grid>
                  ))}
              </Grid>
            </AccordionDetails>
          </Accordion> */}
        </Box>
      )}

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

      {/* Botones de acción - Solo mostrar en modo normal o tabs de plantillas/contenido */}
      {/* {(!isNewsletterMode || activeTab !== 'library') && (
        <Box sx={{ p: 1, borderTop: '1px solid #e0e0e0', flexShrink: 0 }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleGenerateEmailHtml}
            disabled={generatingEmail}
            startIcon={<Icon icon="mdi:email-outline" />}
            sx={{
              mb: 1,
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              py: { xs: 0.5, sm: 1 },
            }}
          >
            {generatingEmail ? <CircularProgress size={16} color="inherit" /> : 'Generar HTML'}
          </Button>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => setOpenSaveDialog(true)}
            startIcon={<Icon icon="mdi:content-save" />}
            sx={{
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              py: { xs: 0.5, sm: 1 },
            }}
          >
            Guardar
          </Button>
        </Box>
      )} */}
    </Box>
  );
}

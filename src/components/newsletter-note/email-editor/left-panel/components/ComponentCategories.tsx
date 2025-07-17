'use client';

import React from 'react';
import { Icon } from '@iconify/react';

import {
  Box,
  Grid,
  Chip,
  Button,
  Accordion,
  Typography,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';

import type { ComponentType } from '../../types';
import type { EnabledComponents } from '../types';

interface ComponentCategoriesProps {
  expandedCategories: Record<string, boolean>;
  setExpandedCategories: (categories: Record<string, boolean>) => void;
  addComponent: (type: ComponentType) => void;
  enabledComponents: EnabledComponents;
}

// Función para verificar si al menos un componente de una categoría está habilitado
const hasCategoryComponents = (
  category: 'texto' | 'multimedia' | 'diseño' | 'noticias' | 'newsletter',
  enabledComponents: EnabledComponents
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

export default function ComponentCategories({
  expandedCategories,
  setExpandedCategories,
  addComponent,
  enabledComponents,
}: ComponentCategoriesProps) {
  return (
    <>
      {/* Categoría de Texto - Solo mostrar si tiene componentes habilitados */}
      {hasCategoryComponents('texto', enabledComponents) && (
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
      {hasCategoryComponents('multimedia', enabledComponents) && (
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
      {hasCategoryComponents('diseño', enabledComponents) && (
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
      {hasCategoryComponents('noticias', enabledComponents) && (
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
      {hasCategoryComponents('newsletter', enabledComponents) && (
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
    </>
  );
}

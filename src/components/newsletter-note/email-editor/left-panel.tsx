'use client';

import React from 'react';
import { Icon } from '@iconify/react';

import {
  Box,
  Grid,
  List,
  Chip,
  Button,
  TextField,
  Accordion,
  Typography,
  ToggleButton,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  ToggleButtonGroup,
} from '@mui/material';

import TemplateCard from './TemplateCard';

import type { ComponentType } from './types';

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
}: LeftPanelProps) {
  const [activeTab, setActiveTab] = React.useState('templates');

  const handleTabChange = (event: React.MouseEvent<HTMLElement>, newValue: string) => {
    if (newValue !== null) {
      setActiveTab(newValue);
    }
  };

  return (
    <Box
      sx={{
        minWidth: 280,
        maxWidth: 280,
        borderRight: '1px solid #e0e0e0',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <ToggleButtonGroup
          value={activeTab}
          exclusive
          onChange={handleTabChange}
          aria-label="Opciones de panel"
          size="small"
          color="primary"
          sx={{ mb: 2, width: '100%', border: 'none' }}
        >
          <ToggleButton value="templates" aria-label="templates" sx={{ width: '50%' }}>
            Plantillas
          </ToggleButton>
          <ToggleButton value="content" aria-label="content" sx={{ width: '50%' }}>
            Contenido
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {activeTab === 'templates' && (
        <List sx={{ flexGrow: 1, overflow: 'auto' }}>
          {/* Acordeón de Noticias */}
          <Accordion>
            <AccordionSummary expandIcon={<Icon icon="mdi:chevron-down" />}>
              <Chip label="Noticias" variant="filled" size="small" />
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                {emailTemplates
                  .filter((template) => template.id === 'news')
                  .map((template) => (
                    <Grid size={6} key={template.id}>
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
          <Accordion>
            <AccordionSummary expandIcon={<Icon icon="mdi:chevron-down" />}>
              <Chip label="Otras Plantillas" variant="filled" size="small" />
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                {emailTemplates
                  .filter((template) => template.id !== 'news')
                  .map((template) => (
                    <Grid size={6} key={template.id}>
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
        </List>
      )}

      {activeTab === 'content' && (
        <>
          {/* Búsqueda de componentes */}
          <TextField
            label="Buscar componentes"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ m: 2 }}
          />

          {/* Lista de componentes */}
          <List sx={{ flexGrow: 1, overflow: 'auto' }}>
            {/* Categoría de Texto */}
            <Accordion
              expanded={expandedCategories.texto}
              onChange={() =>
                setExpandedCategories({ ...expandedCategories, texto: !expandedCategories.texto })
              }
            >
              <AccordionSummary expandIcon={<Icon icon="mdi:chevron-down" />}>
                <Chip label="Texto" variant="filled" size="small" />
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 2 }}>
                  <Button
                    onClick={() => addComponent('heading')}
                    sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                  >
                    <Icon icon="mdi:format-header-1" fontSize="large" />
                    <Typography variant="caption">Títulos</Typography>
                  </Button>
                  <Button
                    onClick={() => addComponent('paragraph')}
                    sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                  >
                    <Icon icon="mdi:format-paragraph" fontSize="large" />
                    <Typography variant="caption">Textos</Typography>
                  </Button>
                  <Button
                    onClick={() => addComponent('bulletList')}
                    sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                  >
                    <Icon icon="mdi:format-list-bulleted" fontSize="large" />
                    <Typography variant="caption">Listas</Typography>
                  </Button>
                </Box>
              </AccordionDetails>
            </Accordion>

            {/* Categoría de Multimedia */}
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
              <AccordionDetails>
                <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 2 }}>
                  <Button
                    onClick={() => addComponent('image')}
                    sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                  >
                    <Icon icon="mdi:image" fontSize="large" />
                    <Typography variant="caption">Imagen</Typography>
                  </Button>
                  <Button
                    onClick={() => addComponent('gallery')}
                    sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                  >
                    <Icon icon="mdi:image-multiple" fontSize="large" />
                    <Typography variant="caption">Galería</Typography>
                  </Button>
                </Box>
              </AccordionDetails>
            </Accordion>

            {/* Categoría de Diseño */}
            <Accordion
              expanded={expandedCategories.diseño}
              onChange={() =>
                setExpandedCategories({ ...expandedCategories, diseño: !expandedCategories.diseño })
              }
            >
              <AccordionSummary expandIcon={<Icon icon="mdi:chevron-down" />}>
                <Chip label="Diseño" variant="filled" size="small" />
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 2 }}>
                  <Button
                    sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                    onClick={() => addComponent('button')}
                  >
                    <Icon icon="mdi:button-cursor" />
                    Añadir Botón
                  </Button>

                  <Button
                    sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                    onClick={() => addComponent('divider')}
                  >
                    <Icon icon="mdi:minus" />
                    Añadir Separador
                  </Button>
                  <Button
                    sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                    onClick={() => addComponent('spacer')}
                  >
                    <Icon icon="mdi:arrow-expand-vertical" />
                    Añadir Espaciador
                  </Button>
                </Box>
              </AccordionDetails>
            </Accordion>

            {/* Categoría de Noticias */}
            <Accordion>
              <AccordionSummary expandIcon={<Icon icon="mdi:chevron-down" />}>
                <Chip label="Componentes de Noticias" variant="filled" size="small" />
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 2 }}>
                  <Button
                    sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                    onClick={() => addComponent('category')}
                  >
                    <Icon icon="mdi:tag" />
                    Añadir Categoría
                  </Button>
                  <Button
                    sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                    onClick={() => addComponent('author')}
                  >
                    <Icon icon="mdi:account" />
                    Añadir Autor
                  </Button>
                  <Button
                    sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                    onClick={() => addComponent('summary')}
                  >
                    <Icon icon="mdi:text-box-outline" />
                    Añadir Resumen
                  </Button>
                </Box>
              </AccordionDetails>
            </Accordion>
          </List>
        </>
      )}

      {/* Botones de acción */}
      <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleGenerateEmailHtml}
          disabled={generatingEmail}
          startIcon={<Icon icon="mdi:email-outline" />}
          sx={{ mb: 1 }}
        >
          {generatingEmail ? <CircularProgress size={24} color="inherit" /> : 'Generar HTML'}
        </Button>
        <Button
          variant="outlined"
          fullWidth
          onClick={() => setOpenSaveDialog(true)}
          startIcon={<Icon icon="mdi:content-save" />}
        >
          Guardar
        </Button>
      </Box>
    </Box>
  );
}

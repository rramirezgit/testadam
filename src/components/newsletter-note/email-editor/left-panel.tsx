'use client';

import React from 'react';
import { Icon } from '@iconify/react';

import {
  Box,
  Tab,
  List,
  Chip,
  Tabs,
  Button,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
} from '@mui/material';

import type { ComponentType } from './types';

interface LeftPanelProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  expandedCategories: Record<string, boolean>;
  setExpandedCategories: (categories: Record<string, boolean>) => void;
  addComponent: (type: ComponentType) => void;
  emailTemplates: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    image: string;
  }>;
  activeTemplate: string;
  setActiveTemplate: (template: string) => void;
  generatingEmail: boolean;
  handleGenerateEmailHtml: () => void;
  setOpenSaveDialog: (open: boolean) => void;
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
}: LeftPanelProps) {
  const [activeTab, setActiveTab] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box
      sx={{
        width: 280,
        borderRight: '1px solid #e0e0e0',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth">
        <Tab label="Templates" />
        <Tab label="Contenido" />
      </Tabs>

      {activeTab === 0 && (
        <List sx={{ flexGrow: 1, overflow: 'auto' }}>
          {/* Plantillas de email */}
          <Accordion>
            <AccordionSummary expandIcon={<Icon icon="mdi:chevron-down" />}>
              <Chip label="Plantillas" variant="filled" size="small" />
            </AccordionSummary>
            <AccordionDetails>
              {emailTemplates.map((template) => (
                <Button
                  key={template.id}
                  variant={activeTemplate === template.id ? 'contained' : 'outlined'}
                  fullWidth
                  startIcon={<Icon icon={template.icon} />}
                  sx={{ mb: 1, justifyContent: 'flex-start' }}
                  onClick={() => setActiveTemplate(template.id)}
                >
                  {template.name}
                </Button>
              ))}
            </AccordionDetails>
          </Accordion>
        </List>
      )}

      {activeTab === 1 && (
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
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Icon icon="mdi:format-header-1" />}
                  sx={{ mb: 1, justifyContent: 'flex-start' }}
                  onClick={() => addComponent('heading')}
                >
                  Añadir Título
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Icon icon="mdi:format-paragraph" />}
                  sx={{ mb: 1, justifyContent: 'flex-start' }}
                  onClick={() => addComponent('paragraph')}
                >
                  Añadir Párrafo
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Icon icon="mdi:format-list-bulleted" />}
                  sx={{ mb: 1, justifyContent: 'flex-start' }}
                  onClick={() => addComponent('bulletList')}
                >
                  Añadir Lista
                </Button>
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
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Icon icon="mdi:image" />}
                  sx={{ mb: 1, justifyContent: 'flex-start' }}
                  onClick={() => addComponent('image')}
                >
                  Añadir Imagen
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Icon icon="mdi:image-multiple" />}
                  sx={{ mb: 1, justifyContent: 'flex-start' }}
                  onClick={() => addComponent('gallery')}
                >
                  Añadir Galería
                </Button>
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
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Icon icon="mdi:button-cursor" />}
                  sx={{ mb: 1, justifyContent: 'flex-start' }}
                  onClick={() => addComponent('button')}
                >
                  Añadir Botón
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Icon icon="mdi:minus" />}
                  sx={{ mb: 1, justifyContent: 'flex-start' }}
                  onClick={() => addComponent('divider')}
                >
                  Añadir Separador
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Icon icon="mdi:arrow-expand-vertical" />}
                  sx={{ mb: 1, justifyContent: 'flex-start' }}
                  onClick={() => addComponent('spacer')}
                >
                  Añadir Espaciador
                </Button>
              </AccordionDetails>
            </Accordion>

            {/* Categoría de Noticias */}
            <Accordion>
              <AccordionSummary expandIcon={<Icon icon="mdi:chevron-down" />}>
                <Chip label="Componentes de Noticias" variant="filled" size="small" />
              </AccordionSummary>
              <AccordionDetails>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Icon icon="mdi:tag" />}
                  sx={{ mb: 1, justifyContent: 'flex-start' }}
                  onClick={() => addComponent('category')}
                >
                  Añadir Categoría
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Icon icon="mdi:account" />}
                  sx={{ mb: 1, justifyContent: 'flex-start' }}
                  onClick={() => addComponent('author')}
                >
                  Añadir Autor
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Icon icon="mdi:text-box-outline" />}
                  sx={{ mb: 1, justifyContent: 'flex-start' }}
                  onClick={() => addComponent('summary')}
                >
                  Añadir Resumen
                </Button>
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

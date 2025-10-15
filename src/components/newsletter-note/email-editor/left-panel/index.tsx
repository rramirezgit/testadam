'use client';

import React from 'react';
import { Icon } from '@iconify/react';

import { Box, Button, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';

import ContentLibrary from '../content-library';
import NotesModal from './components/NotesModal';
import TemplateModal from './components/TemplateModal';
import ComponentCategories from './components/ComponentCategories';

import type { LeftPanelProps } from './types';

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
            <ComponentCategories
              isNewsletterMode={isNewsletterMode}
              expandedCategories={expandedCategories}
              setExpandedCategories={setExpandedCategories}
              addComponent={addComponent}
              enabledComponents={enabledComponents}
            />

            {/* BOTÓN PARA ABRIR MODAL DE NOTAS - Solo mostrar si es template newsletter */}
            {/* {isNewsletterMode && ( */}
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
            {/* )} */}
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
      <TemplateModal
        open={openTemplateModal}
        onClose={() => setOpenTemplateModal(false)}
        emailTemplates={emailTemplates}
        activeTemplate={activeTemplate}
        onTemplateSelect={handleTemplateSelect}
      />

      {/* MODAL DE NOTAS DISPONIBLES */}
      <NotesModal
        open={openNotesModal}
        onClose={() => setOpenNotesModal(false)}
        notesFilter={notesFilter}
        setNotesFilter={setNotesFilter}
        availableNotes={availableNotes}
        loadingNotes={loadingNotes}
        onInjectNote={onInjectNote}
        onRefreshNotes={onRefreshNotes}
      />
    </Box>
  );
}

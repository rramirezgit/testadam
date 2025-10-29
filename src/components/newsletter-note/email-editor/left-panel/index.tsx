'use client';

import React from 'react';

import { Box, TextField, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';

import NotesLibrary from './components/NotesLibrary';
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
  defaultTemplate,
  excludeTemplates = [],
  initialNote,
  generatingEmail,
  handleGenerateEmailHtml,
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
  // Prop para modo view-only
  isViewOnly = false,
  // Prop para modo creación con IA
  isAICreation = false,
  onInjectAIData = () => {},
}: LeftPanelProps) {
  const [activeTab, setActiveTab] = React.useState<'content' | 'notes'>('content');
  // Si hay defaultTemplate, initialNote, o ya hay un template activo (no 'blank'), no mostrar el modal
  const [openTemplateModal, setOpenTemplateModal] = React.useState(
    !defaultTemplate && !initialNote && activeTemplate === 'blank'
  );

  const handleTabChange = (
    event: React.MouseEvent<HTMLElement>,
    newValue: 'content' | 'notes' | null
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

  // Si hay defaultTemplate y el modal está cerrado, establecer el template automáticamente
  React.useEffect(() => {
    if (defaultTemplate && !openTemplateModal) {
      setActiveTemplate(defaultTemplate);
    }
  }, [defaultTemplate, openTemplateModal, setActiveTemplate]);

  return (
    <Box
      sx={(theme) => ({
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        // Borde con gradiente estático
        background: theme.palette.background.paper,
        borderRadius: '16px',
        '&::before': theme.mixins.borderGradient({
          padding: '2px',
          color: `linear-gradient(to bottom right, #FFFFFF, #C6C6FF61)`,
        }),
      })}
    >
      {/* Mostrar mensaje de solo lectura si está en modo view-only */}
      {isViewOnly ? (
        <Box
          sx={{
            p: 3,
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
          }}
        >
          <Typography variant="h6" gutterBottom>
            Solo Lectura
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: '250px' }}>
            Este newsletter ha sido enviado y no puede ser editado. Para realizar cambios, crea una
            copia en borrador.
          </Typography>
        </Box>
      ) : (
        <>
          <Box
            sx={{ width: '100%', display: 'flex', justifyContent: 'center', p: 1, flexShrink: 0 }}
          >
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
                Elementos
              </ToggleButton>
              {isNewsletterMode && (
                <ToggleButton value="notes" aria-label="notes">
                  Notas
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
              </Box>
            </>
          )}

          {/* Tab de Notas para Newsletter */}
          {activeTab === 'notes' && isNewsletterMode && (
            <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
              <NotesLibrary onInjectNote={onInjectNote} />
            </Box>
          )}
        </>
      )}

      {/* MODAL DE SELECCIÓN DE PLANTILLAS */}
      <TemplateModal
        open={openTemplateModal}
        onClose={() => setOpenTemplateModal(false)}
        emailTemplates={emailTemplates}
        activeTemplate={activeTemplate}
        onTemplateSelect={handleTemplateSelect}
        excludeTemplates={excludeTemplates}
        isAICreation={isAICreation}
        onInjectAIData={onInjectAIData}
      />
    </Box>
  );
}

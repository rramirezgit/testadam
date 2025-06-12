import React, { useState } from 'react';

import { Box, Fab, Chip, Paper, Button, Typography } from '@mui/material';

import { DesignPanel } from './design-system/components/design-panel';

// ============================================================================
// NEWSLETTER EDITOR CON DESIGN SYSTEM - DEMO INTEGRADO
// ============================================================================

interface Newsletter {
  id: string;
  title: string;
  content: string[];
  hasDesignApplied: boolean;
  designSettings?: {
    template?: string;
    colors?: string;
    typography?: string;
    layout?: string;
  };
}

export const NewsletterEditorWithDesignSystem: React.FC = () => {
  const [isDesignPanelOpen, setIsDesignPanelOpen] = useState(false);
  const [newsletter, setNewsletter] = useState<Newsletter>({
    id: 'demo-newsletter',
    title: 'Mi Newsletter Demo',
    content: ['Párrafo 1: Contenido del newsletter...', 'Párrafo 2: Más contenido...'],
    hasDesignApplied: false,
  });

  // Simular agregar contenido al newsletter
  const handleAddContent = () => {
    const newParagraph = `Párrafo ${newsletter.content.length + 1}: Nuevo contenido agregado`;
    setNewsletter((prev) => ({
      ...prev,
      content: [...prev.content, newParagraph],
    }));

    // ✅ ACTIVAR DESIGN PANEL automáticamente cuando se agrega contenido
    if (newsletter.content.length >= 2 && !newsletter.hasDesignApplied) {
      setTimeout(() => {
        setIsDesignPanelOpen(true);
      }, 500);
    }
  };

  // Función para actualizar newsletter desde Design System
  const handleUpdateNewsletter = (updates: any) => {
    setNewsletter((prev) => ({
      ...prev,
      hasDesignApplied: true,
      designSettings: {
        ...prev.designSettings,
        ...updates,
      },
    }));
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          bgcolor: 'background.paper',
        }}
      >
        <Box>
          <Typography variant="h5">📰 Newsletter Editor</Typography>
          <Typography variant="caption" color="text.secondary">
            Demo con Design System integrado
          </Typography>
        </Box>

        <Box display="flex" gap={1} alignItems="center">
          {newsletter.hasDesignApplied && (
            <Chip label="🎨 Design Applied" color="primary" variant="outlined" size="small" />
          )}
          <Button
            variant="outlined"
            onClick={() => setIsDesignPanelOpen(true)}
            startIcon={<span>🎨</span>}
          >
            Design System
          </Button>
          <Button variant="contained" color="primary">
            Publicar
          </Button>
        </Box>
      </Box>

      {/* Content Area */}
      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        {/* Left Panel - Content Editor */}
        <Box sx={{ flex: 1, p: 3, overflow: 'auto' }}>
          <Box sx={{ maxWidth: 600, mx: 'auto' }}>
            <Typography variant="h6" gutterBottom>
              {newsletter.title}
            </Typography>

            {/* Newsletter Content */}
            {newsletter.content.map((paragraph, index) => (
              <Paper
                key={index}
                sx={{
                  p: 2,
                  mb: 2,
                  border: '1px solid #e0e0e0',
                  '&:hover': {
                    bgcolor: 'grey.50',
                  },
                }}
              >
                <Typography variant="body1">{paragraph}</Typography>
              </Paper>
            ))}

            {/* Add Content Button */}
            <Button variant="outlined" fullWidth onClick={handleAddContent} sx={{ mt: 2, py: 2 }}>
              ➕ Agregar Párrafo
            </Button>

            {/* Design System Trigger Message */}
            {newsletter.content.length >= 2 && !newsletter.hasDesignApplied && (
              <Paper
                sx={{
                  p: 2,
                  mt: 3,
                  bgcolor: 'primary.lighter',
                  border: '2px dashed',
                  borderColor: 'primary.main',
                  textAlign: 'center',
                }}
              >
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  🎨 ¡Personaliza tu newsletter!
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Ya tienes contenido. Usa el Design System para aplicar templates, colores y
                  tipografía profesional.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setIsDesignPanelOpen(true)}
                >
                  Abrir Design System
                </Button>
              </Paper>
            )}

            {/* Design Applied Preview */}
            {newsletter.hasDesignApplied && (
              <Paper
                sx={{
                  p: 2,
                  mt: 3,
                  bgcolor: 'success.lighter',
                  border: '1px solid',
                  borderColor: 'success.main',
                }}
              >
                <Typography variant="subtitle2" color="success.dark" gutterBottom>
                  ✅ Design System Aplicado
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tu newsletter ahora tiene un diseño profesional personalizado.
                </Typography>
                {newsletter.designSettings && (
                  <Box sx={{ mt: 1 }}>
                    {Object.entries(newsletter.designSettings).map(([key, value]) => (
                      <Chip
                        key={key}
                        label={`${key}: ${value || 'default'}`}
                        size="small"
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    ))}
                  </Box>
                )}
              </Paper>
            )}
          </Box>
        </Box>

        {/* Right Panel - Preview */}
        <Box
          sx={{
            width: 300,
            borderLeft: '1px solid #e0e0e0',
            p: 2,
            bgcolor: 'grey.50',
            overflow: 'auto',
          }}
        >
          <Typography variant="subtitle2" gutterBottom>
            📱 Vista Previa
          </Typography>
          <Paper sx={{ p: 2, minHeight: 200 }}>
            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
              Newsletter Preview
            </Typography>
            <Box sx={{ fontSize: '0.75rem', lineHeight: 1.2 }}>
              {newsletter.content.map((paragraph, index) => (
                <Typography key={index} variant="caption" display="block" sx={{ mb: 1 }}>
                  {paragraph.substring(0, 50)}...
                </Typography>
              ))}
            </Box>
          </Paper>

          {/* Stats */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary" display="block">
              📊 Estadísticas
            </Typography>
            <Typography variant="body2">Párrafos: {newsletter.content.length}</Typography>
            <Typography variant="body2">
              Estado: {newsletter.hasDesignApplied ? '🎨 Con diseño' : '📝 Sin diseño'}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Floating Action Button - Design System */}
      <Fab
        color="primary"
        onClick={() => setIsDesignPanelOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
          '&:hover': {
            transform: 'scale(1.1)',
          },
        }}
      >
        🎨
      </Fab>

      {/* Design Panel */}
      <DesignPanel
        isOpen={isDesignPanelOpen}
        onClose={() => setIsDesignPanelOpen(false)}
        newsletter={newsletter as any}
        onUpdateNewsletter={handleUpdateNewsletter}
      />

      {/* Tutorial Overlay */}
      {newsletter.content.length === 0 && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            zIndex: 100,
          }}
        >
          <Typography variant="h6" gutterBottom>
            👋 ¡Bienvenido al Editor con Design System!
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            1. Agrega contenido con el botón &quot;Agregar Párrafo&quot;
            <br />
            2. El Design System se activará automáticamente
            <br />
            3. Personaliza templates, colores, tipografía y layout
          </Typography>
          <Button variant="contained" onClick={handleAddContent}>
            🚀 Comenzar
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default NewsletterEditorWithDesignSystem;

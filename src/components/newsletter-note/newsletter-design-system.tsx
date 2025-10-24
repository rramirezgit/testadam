'use client';

import type { NewsletterNote } from 'src/types/newsletter';

import { Icon } from '@iconify/react';
import React, { useState } from 'react';

import {
  Box,
  Fab,
  Grid,
  Card,
  Chip,
  Paper,
  Stack,
  Button,
  Dialog,
  Switch,
  Slider,
  Divider,
  Tooltip,
  TextField,
  Typography,
  IconButton,
  CardHeader,
  CardContent,
  ToggleButton,
  FormControlLabel,
  ToggleButtonGroup,
} from '@mui/material';

// Interfaces para el Design System
interface DesignTemplate {
  id: string;
  name: string;
  description: string;
  preview: string;
  headerSettings: {
    backgroundColor: string;
    textColor: string;
    alignment: string;
    useGradient: boolean;
    gradientColors: string[];
    gradientDirection: number;
  };
  footerSettings: {
    backgroundColor: string;
    textColor: string;
    useGradient: boolean;
    gradientColors: string[];
    gradientDirection: number;
  };
}

interface GradientConfig {
  colors: string[];
  direction: number;
  type: 'linear' | 'radial';
  stops: number[];
}

interface NewsletterDesignSystemProps {
  header: any;
  footer: any;
  selectedNotes: NewsletterNote[];
  onHeaderUpdate: (header: any) => void;
  onFooterUpdate: (footer: any) => void;
  onNotesReorder: (notes: NewsletterNote[]) => void;
  onTemplateApply: (template: DesignTemplate) => void;
}

// Templates predefinidos
const designTemplates: DesignTemplate[] = [
  {
    id: 'professional',
    name: 'Profesional',
    description: 'Diseño limpio y corporativo',
    preview: '/templates/professional.png',
    headerSettings: {
      backgroundColor: '#1565c0',
      textColor: '#ffffff',
      alignment: 'center',
      useGradient: true,
      gradientColors: ['#1565c0', '#0d47a1'],
      gradientDirection: 45,
    },
    footerSettings: {
      backgroundColor: '#f5f5f5',
      textColor: '#666666',
      useGradient: false,
      gradientColors: ['#287FA9', '#1E2B62'], // ['#f5f5f5', '#e0e0e0'],
      gradientDirection: 0,
    },
  },
  {
    id: 'modern',
    name: 'Moderno',
    description: 'Gradientes vibrantes y diseño actual',
    preview: '/templates/modern.png',
    headerSettings: {
      backgroundColor: '#667eea',
      textColor: '#ffffff',
      alignment: 'center',
      useGradient: true,
      gradientColors: ['#667eea', '#764ba2'],
      gradientDirection: 135,
    },
    footerSettings: {
      backgroundColor: '#2c3e50',
      textColor: '#ecf0f1',
      useGradient: true,
      gradientColors: ['#2c3e50', '#34495e'],
      gradientDirection: 180,
    },
  },
  {
    id: 'minimal',
    name: 'Minimalista',
    description: 'Diseño simple y elegante',
    preview: '/templates/minimal.png',
    headerSettings: {
      backgroundColor: '#ffffff',
      textColor: '#333333',
      alignment: 'left',
      useGradient: false,
      gradientColors: ['#ffffff', '#f8f9fa'],
      gradientDirection: 0,
    },
    footerSettings: {
      backgroundColor: '#f8f9fa',
      textColor: '#666666',
      useGradient: false,
      gradientColors: ['#f8f9fa', '#e9ecef'],
      gradientDirection: 0,
    },
  },
  {
    id: 'tech',
    name: 'Tecnología',
    description: 'Para newsletters de tech y startups',
    preview: '/templates/tech.png',
    headerSettings: {
      backgroundColor: '#0f172a',
      textColor: '#f1f5f9',
      alignment: 'center',
      useGradient: true,
      gradientColors: ['#0f172a', '#1e293b'],
      gradientDirection: 45,
    },
    footerSettings: {
      backgroundColor: '#1e293b',
      textColor: '#94a3b8',
      useGradient: true,
      gradientColors: ['#1e293b', '#334155'],
      gradientDirection: 180,
    },
  },
];

// Componente del Editor de Gradientes
const GradientEditor = ({
  gradient,
  onChange,
}: {
  gradient: GradientConfig;
  onChange: (gradient: GradientConfig) => void;
}) => {
  const handleColorChange = (index: number, color: string) => {
    const newColors = [...gradient.colors];
    newColors[index] = color;
    onChange({ ...gradient, colors: newColors });
  };

  const addColorStop = () => {
    if (gradient.colors.length < 5) {
      onChange({
        ...gradient,
        colors: [...gradient.colors, '#ffffff'],
        stops: [...gradient.stops, gradient.stops.length * 25],
      });
    }
  };

  const removeColorStop = (index: number) => {
    if (gradient.colors.length > 2) {
      const newColors = gradient.colors.filter((_, i) => i !== index);
      const newStops = gradient.stops.filter((_, i) => i !== index);
      onChange({ ...gradient, colors: newColors, stops: newStops });
    }
  };

  const gradientPreview = `${gradient.type}-gradient(${
    gradient.type === 'linear' ? `${gradient.direction}deg, ` : ''
  }${gradient.colors.join(', ')})`;

  return (
    <Box>
      <Box
        sx={{
          height: 60,
          borderRadius: 2,
          background: gradientPreview,
          border: '1px solid',
          borderColor: 'grey.300',
          mb: 2,
        }}
      />

      <Stack spacing={2}>
        <Box>
          <Typography variant="caption" display="block" gutterBottom>
            Tipo de Gradiente
          </Typography>
          <ToggleButtonGroup
            value={gradient.type}
            exclusive
            onChange={(e, value) => value && onChange({ ...gradient, type: value })}
            size="small"
          >
            <ToggleButton value="linear">
              <Icon icon="mdi:gradient-horizontal" style={{ marginRight: 4 }} />
              Lineal
            </ToggleButton>
            <ToggleButton value="radial">
              <Icon icon="mdi:gradient-radial" style={{ marginRight: 4 }} />
              Radial
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {gradient.type === 'linear' && (
          <Box>
            <Typography variant="caption" display="block" gutterBottom>
              Dirección: {gradient.direction}°
            </Typography>
            <Slider
              value={gradient.direction}
              onChange={(e, value) => onChange({ ...gradient, direction: value as number })}
              min={0}
              max={360}
              step={15}
              marks={[
                { value: 0, label: '0°' },
                { value: 90, label: '90°' },
                { value: 180, label: '180°' },
                { value: 270, label: '270°' },
              ]}
            />
          </Box>
        )}

        <Box>
          <Typography variant="caption" display="block" gutterBottom>
            Colores del Gradiente
          </Typography>
          <Stack spacing={1}>
            {gradient.colors.map((color, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => handleColorChange(index, e.target.value)}
                  style={{ width: 40, height: 30, border: 'none', borderRadius: 4 }}
                />
                <TextField
                  value={color}
                  onChange={(e) => handleColorChange(index, e.target.value)}
                  size="small"
                  sx={{ flexGrow: 1 }}
                />
                {gradient.colors.length > 2 && (
                  <IconButton size="small" onClick={() => removeColorStop(index)} color="error">
                    <Icon icon="mdi:delete" />
                  </IconButton>
                )}
              </Box>
            ))}
          </Stack>
          {gradient.colors.length < 5 && (
            <Button
              size="small"
              onClick={addColorStop}
              startIcon={<Icon icon="mdi:plus" />}
              sx={{ mt: 1 }}
            >
              Agregar Color
            </Button>
          )}
        </Box>
      </Stack>
    </Box>
  );
};

// Componente principal del Design System
export default function NewsletterDesignSystem({
  header,
  footer,
  selectedNotes,
  onHeaderUpdate,
  onFooterUpdate,
  onNotesReorder,
  onTemplateApply,
}: NewsletterDesignSystemProps) {
  const [activeSection, setActiveSection] = useState('templates');
  const [openGradientEditor, setOpenGradientEditor] = useState(false);
  const [editingGradient, setEditingGradient] = useState<'header' | 'footer'>('header');
  const [gradientConfig, setGradientConfig] = useState<GradientConfig>({
    colors: ['#667eea', '#764ba2'],
    direction: 135,
    type: 'linear',
    stops: [0, 100],
  });
  const [livePreview, setLivePreview] = useState(true);

  // Función para reordenar notas
  const moveNote = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === selectedNotes.length - 1)
    ) {
      return;
    }

    const newNotes = [...selectedNotes];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    // Intercambiar elementos
    [newNotes[index], newNotes[targetIndex]] = [newNotes[targetIndex], newNotes[index]];

    // Actualizar orden
    const reorderedNotes = newNotes.map((note, i) => ({
      ...note,
      order: i,
    }));

    onNotesReorder(reorderedNotes);
  };

  const handleTemplateSelect = (template: DesignTemplate) => {
    onHeaderUpdate({
      ...header,
      ...template.headerSettings,
    });
    onFooterUpdate({
      ...footer,
      ...template.footerSettings,
    });
    onTemplateApply(template);
  };

  const openGradientEditorFor = (section: 'header' | 'footer') => {
    setEditingGradient(section);
    const settings = section === 'header' ? header : footer;
    setGradientConfig({
      colors: settings.gradientColors || ['#667eea', '#764ba2'],
      direction: settings.gradientDirection || 135,
      type: 'linear',
      stops: [0, 100],
    });
    setOpenGradientEditor(true);
  };

  const applyGradient = () => {
    const update = {
      gradientColors: gradientConfig.colors,
      gradientDirection: gradientConfig.direction,
      useGradient: true,
    };

    if (editingGradient === 'header') {
      onHeaderUpdate({ ...header, ...update });
    } else {
      onFooterUpdate({ ...footer, ...update });
    }

    setOpenGradientEditor(false);
  };

  const exportConfig = () => {
    const config = {
      header,
      footer,
      version: '1.0',
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'newsletter-config.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const config = JSON.parse(e.target?.result as string);
        if (config.header) onHeaderUpdate(config.header);
        if (config.footer) onFooterUpdate(config.footer);
      } catch (error) {
        console.error('Error importing config:', error);
      }
    };
    reader.readAsText(file);
  };

  const sections = [
    { id: 'templates', label: 'Templates', icon: 'mdi:palette' },
    { id: 'header', label: 'Header', icon: 'mdi:format-header-1' },
    { id: 'footer', label: 'Footer', icon: 'mdi:page-layout-footer' },
    { id: 'content', label: 'Contenido', icon: 'mdi:file-document' },
    { id: 'advanced', label: 'Avanzado', icon: 'mdi:cog' },
  ];

  return (
    <Box>
      {/* Navegación del Design System */}
      <Paper elevation={1} sx={{ mb: 3 }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6" gutterBottom>
            Newsletter Design System
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {sections.map((section) => (
              <Chip
                key={section.id}
                icon={<Icon icon={section.icon} />}
                label={section.label}
                onClick={() => setActiveSection(section.id)}
                color={activeSection === section.id ? 'primary' : 'default'}
                variant={activeSection === section.id ? 'filled' : 'outlined'}
              />
            ))}
          </Stack>
        </Box>

        {/* Live Preview Toggle */}
        <Box sx={{ p: 2, bgcolor: 'grey.50' }}>
          <FormControlLabel
            control={
              <Switch checked={livePreview} onChange={(e) => setLivePreview(e.target.checked)} />
            }
            label="Vista previa en tiempo real"
          />
        </Box>
      </Paper>

      {/* Contenido de las secciones */}
      {activeSection === 'templates' && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <Typography variant="h6" gutterBottom>
              Templates Predefinidos
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Selecciona un template base para tu newsletter
            </Typography>
          </Grid>
          {designTemplates.map((template) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={template.id}>
              <Card
                elevation={1}
                sx={{
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    elevation: 4,
                    transform: 'translateY(-2px)',
                  },
                }}
                onClick={() => handleTemplateSelect(template)}
              >
                <Box
                  sx={{
                    height: 120,
                    background: `linear-gradient(${template.headerSettings.gradientDirection}deg, ${template.headerSettings.gradientColors.join(', ')})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: template.headerSettings.textColor,
                  }}
                >
                  <Typography variant="h6">{template.name}</Typography>
                </Box>
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {template.description}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTemplateSelect(template);
                    }}
                  >
                    Aplicar Template
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {activeSection === 'header' && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card elevation={2}>
              <CardHeader title="Configuración del Header" />
              <CardContent>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Título del Header"
                    value={header.title}
                    onChange={(e) => onHeaderUpdate({ ...header, title: e.target.value })}
                  />

                  <TextField
                    fullWidth
                    label="Subtítulo"
                    value={header.subtitle}
                    onChange={(e) => onHeaderUpdate({ ...header, subtitle: e.target.value })}
                  />

                  <Box>
                    <Typography variant="caption" display="block" gutterBottom>
                      Color de Fondo
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <input
                        type="color"
                        value={header.backgroundColor}
                        onChange={(e) =>
                          onHeaderUpdate({ ...header, backgroundColor: e.target.value })
                        }
                        style={{ width: 50, height: 40, border: 'none', borderRadius: 4 }}
                      />
                      <TextField
                        value={header.backgroundColor}
                        onChange={(e) =>
                          onHeaderUpdate({ ...header, backgroundColor: e.target.value })
                        }
                        size="small"
                        sx={{ flexGrow: 1 }}
                      />
                    </Box>
                  </Box>

                  <FormControlLabel
                    control={
                      <Switch
                        checked={header.useGradient || false}
                        onChange={(e) =>
                          onHeaderUpdate({ ...header, useGradient: e.target.checked })
                        }
                      />
                    }
                    label="Usar Gradiente"
                  />

                  {header.useGradient && (
                    <Button
                      variant="outlined"
                      onClick={() => openGradientEditorFor('header')}
                      startIcon={<Icon icon="mdi:gradient-horizontal" />}
                    >
                      Editor Avanzado de Gradientes
                    </Button>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Card elevation={1}>
              <CardHeader title="Vista Previa del Header" />
              <CardContent sx={{ p: 0 }}>
                <Box
                  sx={{
                    backgroundColor: header.backgroundColor,
                    background: header.useGradient
                      ? `linear-gradient(${header.gradientDirection || 135}deg, ${(header.gradientColors || ['#667eea', '#764ba2']).join(', ')})`
                      : header.backgroundColor,
                    color: header.textColor,
                    textAlign: header.alignment as 'left' | 'center' | 'right',
                    p: 3,
                    minHeight: 120,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h5" gutterBottom>
                    {header.title || 'Título del Newsletter'}
                  </Typography>
                  {header.subtitle && (
                    <Typography variant="subtitle1">{header.subtitle}</Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeSection === 'footer' && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card elevation={2}>
              <CardHeader title="Configuración del Footer" />
              <CardContent>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Nombre de la Compañía"
                    value={footer.companyName}
                    onChange={(e) => onFooterUpdate({ ...footer, companyName: e.target.value })}
                  />

                  <TextField
                    fullWidth
                    label="Dirección"
                    value={footer.address}
                    onChange={(e) => onFooterUpdate({ ...footer, address: e.target.value })}
                  />

                  <TextField
                    fullWidth
                    label="Email de Contacto"
                    value={footer.contactEmail}
                    onChange={(e) => onFooterUpdate({ ...footer, contactEmail: e.target.value })}
                  />

                  <Box>
                    <Typography variant="caption" display="block" gutterBottom>
                      Color de Fondo
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <input
                        type="color"
                        value={footer.backgroundColor}
                        onChange={(e) =>
                          onFooterUpdate({ ...footer, backgroundColor: e.target.value })
                        }
                        style={{ width: 50, height: 40, border: 'none', borderRadius: 4 }}
                      />
                      <TextField
                        value={footer.backgroundColor}
                        onChange={(e) =>
                          onFooterUpdate({ ...footer, backgroundColor: e.target.value })
                        }
                        size="small"
                        sx={{ flexGrow: 1 }}
                      />
                    </Box>
                  </Box>

                  <FormControlLabel
                    control={
                      <Switch
                        checked={footer.useGradient || false}
                        onChange={(e) =>
                          onFooterUpdate({ ...footer, useGradient: e.target.checked })
                        }
                      />
                    }
                    label="Usar Gradiente"
                  />

                  {footer.useGradient && (
                    <Button
                      variant="outlined"
                      onClick={() => openGradientEditorFor('footer')}
                      startIcon={<Icon icon="mdi:gradient-horizontal" />}
                    >
                      Editor Avanzado de Gradientes
                    </Button>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Card elevation={1}>
              <CardHeader title="Vista Previa del Footer" />
              <CardContent sx={{ p: 0 }}>
                <Box
                  sx={{
                    backgroundColor: footer.backgroundColor,
                    background: footer.useGradient
                      ? `linear-gradient(${footer.gradientDirection || 180}deg, ${(footer.gradientColors || ['#287FA9', '#1E2B62']).join(', ')})`
                      : footer.backgroundColor,
                    color: footer.textColor,
                    textAlign: 'center',
                    p: 3,
                    fontSize: '0.875rem',
                  }}
                >
                  <Typography variant="subtitle2" gutterBottom>
                    {footer.companyName}
                  </Typography>
                  {footer.address && <Typography variant="body2">{footer.address}</Typography>}
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    © {new Date().getFullYear()} {footer.companyName}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeSection === 'content' && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Reordenar Contenido
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Usa los botones para cambiar el orden de las notas en el newsletter
          </Typography>

          {selectedNotes.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Icon icon="mdi:reorder-horizontal" style={{ fontSize: 64, opacity: 0.3 }} />
              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                No hay notas para reordenar
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Agrega notas en la pestaña Contenido para poder reordenarlas aquí
              </Typography>
            </Paper>
          ) : (
            <Stack spacing={2}>
              {selectedNotes.map((note, index) => (
                <Card key={note.noteId} elevation={1}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Chip label={`#${index + 1}`} size="small" color="primary" />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1">{note.noteData.title}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {note.noteData.objdata.length} componentes
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Subir">
                          <IconButton
                            size="small"
                            onClick={() => moveNote(index, 'up')}
                            disabled={index === 0}
                            color="primary"
                          >
                            <Icon icon="mdi:arrow-up" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Bajar">
                          <IconButton
                            size="small"
                            onClick={() => moveNote(index, 'down')}
                            disabled={index === selectedNotes.length - 1}
                            color="primary"
                          >
                            <Icon icon="mdi:arrow-down" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}
        </Box>
      )}

      {activeSection === 'advanced' && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card elevation={2}>
              <CardHeader title="Importar/Exportar Configuración" />
              <CardContent>
                <Stack spacing={2}>
                  <Button
                    variant="outlined"
                    onClick={exportConfig}
                    startIcon={<Icon icon="mdi:download" />}
                    fullWidth
                  >
                    Exportar Configuración
                  </Button>

                  <Box>
                    <input
                      type="file"
                      accept=".json"
                      onChange={importConfig}
                      style={{ display: 'none' }}
                      id="import-config"
                    />
                    <label htmlFor="import-config">
                      <Button
                        variant="outlined"
                        component="span"
                        startIcon={<Icon icon="mdi:upload" />}
                        fullWidth
                      >
                        Importar Configuración
                      </Button>
                    </label>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Card elevation={2}>
              <CardHeader title="Configuraciones Avanzadas" />
              <CardContent>
                <Stack spacing={2}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={livePreview}
                        onChange={(e) => setLivePreview(e.target.checked)}
                      />
                    }
                    label="Vista previa en tiempo real"
                  />

                  <Divider />

                  <Typography variant="caption" color="text.secondary">
                    Vista previa en tiempo real del HTML, mejores opciones de tipografía y más
                    funcionalidades próximamente
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Dialog del Editor de Gradientes */}
      <Dialog
        open={openGradientEditor}
        onClose={() => setOpenGradientEditor(false)}
        maxWidth="sm"
        fullWidth
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Editor Avanzado de Gradientes - {editingGradient === 'header' ? 'Header' : 'Footer'}
          </Typography>

          <GradientEditor gradient={gradientConfig} onChange={setGradientConfig} />

          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button onClick={() => setOpenGradientEditor(false)} sx={{ flexGrow: 1 }}>
              Cancelar
            </Button>
            <Button onClick={applyGradient} variant="contained" sx={{ flexGrow: 1 }}>
              Aplicar Gradiente
            </Button>
          </Box>
        </Box>
      </Dialog>

      {/* FAB para acceso rápido */}
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 80,
          right: 24,
          zIndex: 1000,
        }}
        onClick={() => setActiveSection('templates')}
      >
        <Icon icon="mdi:palette" />
      </Fab>
    </Box>
  );
}

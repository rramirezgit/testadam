import { useState } from 'react';
import { Icon } from '@iconify/react';

import {
  Box,
  Tab,
  Tabs,
  Paper,
  Button,
  Slider,
  Select,
  MenuItem,
  TextField,
  Typography,
  IconButton,
  InputLabel,
  FormControl,
} from '@mui/material';

import GeneralColorPicker from 'src/components/newsletter-note/general-color-picker';

import type { SummaryOptionsProps } from './types';

interface Herramienta {
  id: string;
  nombre: string;
  icono: string;
  colorFondo: string;
  colorTexto: string;
  colorIcono: string;
}

// Iconos populares para herramientas
const ICONOS_POPULARES = [
  'mdi:hammer-wrench',
  'mdi:cog',
  'mdi:tools',
  'mdi:screwdriver',
  'mdi:wrench',
  'mdi:calculator',
  'mdi:chart-line',
  'mdi:file-document',
  'mdi:lightbulb',
  'mdi:rocket',
  'mdi:shield-check',
  'mdi:heart',
  'mdi:star',
  'mdi:bookmark',
  'mdi:download',
  'mdi:upload',
  'mdi:email',
  'mdi:phone',
  'mdi:map-marker',
  'mdi:calendar',
];

export default function HerramientasOptions({
  selectedComponentId,
  getActiveComponents,
  updateComponentProps,
  setShowIconPicker,
}: SummaryOptionsProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedHerramientaId, setSelectedHerramientaId] = useState<string | null>(null);

  if (!selectedComponentId) return null;

  const component = getActiveComponents().find((comp) => comp.id === selectedComponentId);
  if (!component || component.type !== 'herramientas') return null;

  // Opciones con valores por defecto
  const herramientas: Herramienta[] = component.props?.herramientas || [
    {
      id: '1',
      nombre: 'Herramienta',
      icono: 'mdi:hammer-wrench',
      colorFondo: '#f3f4f6',
      colorTexto: '#374151',
      colorIcono: '#6b7280',
    },
  ];

  const backgroundColor = component.props?.backgroundColor || '#ffffff';
  const borderRadius = component.props?.borderRadius || 12;
  const opacity = component.props?.opacity || 100;

  const selectedHerramienta =
    herramientas.find((h) => h.id === selectedHerramientaId) || herramientas[0];

  // Función para actualizar una herramienta específica
  const updateHerramienta = (herramientaId: string, updates: Partial<Herramienta>) => {
    const updatedHerramientas = herramientas.map((h) =>
      h.id === herramientaId ? { ...h, ...updates } : h
    );
    updateComponentProps(selectedComponentId, { herramientas: updatedHerramientas });
  };

  // Función para agregar nueva herramienta
  const handleAddHerramienta = () => {
    const newHerramienta: Herramienta = {
      id: Date.now().toString(),
      nombre: 'Nueva Herramienta',
      icono: 'mdi:plus',
      colorFondo: '#f3f4f6',
      colorTexto: '#374151',
      colorIcono: '#6b7280',
    };

    const updatedHerramientas = [...herramientas, newHerramienta];
    updateComponentProps(selectedComponentId, { herramientas: updatedHerramientas });
    setSelectedHerramientaId(newHerramienta.id);
  };

  // Función para remover herramienta
  const handleRemoveHerramienta = (herramientaId: string) => {
    if (herramientas.length > 1) {
      const updatedHerramientas = herramientas.filter((h) => h.id !== herramientaId);
      updateComponentProps(selectedComponentId, { herramientas: updatedHerramientas });

      if (selectedHerramientaId === herramientaId) {
        setSelectedHerramientaId(updatedHerramientas[0]?.id || null);
      }
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
        🔧 Configuración de Herramientas
      </Typography>

      {/* Tabs */}
      <Paper elevation={1} sx={{ mb: 2 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          variant="fullWidth"
          sx={{
            minHeight: 'auto',
            '& .MuiTab-root': {
              minHeight: 'auto',
              py: 1,
              fontSize: '0.875rem',
            },
          }}
        >
          <Tab label="Diseño" />
          <Tab label="Configuración" />
        </Tabs>
      </Paper>

      {/* Pestaña Diseño */}
      {activeTab === 0 && (
        <Box>
          {/* Fondo */}
          <Paper elevation={1} sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 2 }}>
              Fondo
            </Typography>

            <Box sx={{ mb: 2 }}>
              <GeneralColorPicker
                selectedColor={backgroundColor}
                onChange={(color) =>
                  updateComponentProps(selectedComponentId, { backgroundColor: color })
                }
                label="Color de fondo"
                size="small"
              />
            </Box>

            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
              Opacidad
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Slider
                value={opacity}
                onChange={(_, value) =>
                  updateComponentProps(selectedComponentId, { opacity: value })
                }
                min={0}
                max={100}
                step={5}
                marks={[
                  { value: 0, label: '0' },
                  { value: 100, label: '100' },
                ]}
                sx={{ flex: 1 }}
              />
              <TextField
                type="number"
                size="small"
                value={opacity}
                onChange={(e) =>
                  updateComponentProps(selectedComponentId, {
                    opacity: parseInt(e.target.value) || 0,
                  })
                }
                inputProps={{ min: 0, max: 100 }}
                sx={{ width: 60 }}
              />
            </Box>
          </Paper>

          {/* Icono del header */}
          <Paper elevation={1} sx={{ p: 2, bgcolor: 'grey.50' }}>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 2 }}>
              Icono
            </Typography>

            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel>Select</InputLabel>
              <Select value="hammer-wrench" label="Select" disabled>
                <MenuItem value="hammer-wrench">Herramientas</MenuItem>
              </Select>
            </FormControl>

            <GeneralColorPicker
              selectedColor="#fbbf24"
              onChange={() => {}} // Por ahora estático
              label="Color del icono"
              size="small"
              allowReset={false}
            />
          </Paper>
        </Box>
      )}

      {/* Pestaña Configuración */}
      {activeTab === 1 && (
        <Box>
          {/* Selector de herramienta */}
          <Paper elevation={1} sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
            <Box
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Herramientas ({herramientas.length})
              </Typography>
              <Button
                size="small"
                startIcon={<Icon icon="mdi:plus" />}
                onClick={handleAddHerramienta}
              >
                Agregar
              </Button>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {herramientas.map((herramienta) => (
                <Box
                  key={herramienta.id}
                  onClick={() => setSelectedHerramientaId(herramienta.id)}
                  sx={{
                    position: 'relative',
                    cursor: 'pointer',
                    p: 1,
                    border:
                      selectedHerramienta.id === herramienta.id
                        ? '2px solid #1976d2'
                        : '1px solid #ddd',
                    borderRadius: 1,
                    bgcolor: 'white',
                    transition: 'all 0.2s',
                    '&:hover': {
                      borderColor: '#1976d2',
                    },
                    '&:hover .remove-btn': {
                      opacity: 1,
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Icon
                      icon={herramienta.icono}
                      style={{ fontSize: 16, color: herramienta.colorIcono }}
                    />
                    <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                      {herramienta.nombre}
                    </Typography>
                  </Box>

                  {herramientas.length > 1 && (
                    <IconButton
                      className="remove-btn"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveHerramienta(herramienta.id);
                      }}
                      sx={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        width: 16,
                        height: 16,
                        backgroundColor: '#ef4444',
                        color: 'white',
                        opacity: 0,
                        transition: 'opacity 0.2s',
                        '&:hover': {
                          backgroundColor: '#dc2626',
                        },
                      }}
                    >
                      <Icon icon="mdi:close" style={{ fontSize: 10 }} />
                    </IconButton>
                  )}
                </Box>
              ))}
            </Box>
          </Paper>

          {/* Configuración de herramienta seleccionada */}
          {selectedHerramienta && (
            <Paper elevation={1} sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 2 }}>
                Editar: {selectedHerramienta.nombre}
              </Typography>

              {/* Nombre */}
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', mb: 1 }}
                >
                  Nombre
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={selectedHerramienta.nombre}
                  onChange={(e) =>
                    updateHerramienta(selectedHerramienta.id, { nombre: e.target.value })
                  }
                  placeholder="Nombre de la herramienta"
                />
              </Box>

              {/* Icono */}
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', mb: 1 }}
                >
                  Icono
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {ICONOS_POPULARES.slice(0, 12).map((icono) => (
                    <IconButton
                      key={icono}
                      size="small"
                      onClick={() => updateHerramienta(selectedHerramienta.id, { icono })}
                      sx={{
                        width: 32,
                        height: 32,
                        border:
                          selectedHerramienta.icono === icono
                            ? '2px solid #1976d2'
                            : '1px solid #ddd',
                        borderRadius: 1,
                        bgcolor: 'white',
                      }}
                    >
                      <Icon icon={icono} style={{ fontSize: 16 }} />
                    </IconButton>
                  ))}
                </Box>
              </Box>

              {/* Colores */}
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <GeneralColorPicker
                    selectedColor={selectedHerramienta.colorFondo}
                    onChange={(color) =>
                      updateHerramienta(selectedHerramienta.id, { colorFondo: color })
                    }
                    label="Fondo"
                    size="small"
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <GeneralColorPicker
                    selectedColor={selectedHerramienta.colorTexto}
                    onChange={(color) =>
                      updateHerramienta(selectedHerramienta.id, { colorTexto: color })
                    }
                    label="Texto"
                    size="small"
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <GeneralColorPicker
                    selectedColor={selectedHerramienta.colorIcono}
                    onChange={(color) =>
                      updateHerramienta(selectedHerramienta.id, { colorIcono: color })
                    }
                    label="Icono"
                    size="small"
                  />
                </Box>
              </Box>
            </Paper>
          )}

          {/* Vista previa */}
          <Paper elevation={2} sx={{ p: 2, bgcolor: 'grey.100' }}>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 2 }}>
              👁️ Vista Previa
            </Typography>

            <Box
              sx={{
                backgroundColor: (() => {
                  // Aplicar opacidad solo al color de fondo
                  if (backgroundColor.startsWith('#')) {
                    const hex = backgroundColor.replace('#', '');
                    const r = parseInt(hex.substring(0, 2), 16);
                    const g = parseInt(hex.substring(2, 4), 16);
                    const b = parseInt(hex.substring(4, 6), 16);
                    return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
                  }
                  return backgroundColor.includes('rgba')
                    ? backgroundColor.replace(/[\d.]+\)$/g, `${opacity / 100})`)
                    : backgroundColor;
                })(),
                borderRadius: `${borderRadius}px`,
                border: '1px solid rgba(0,0,0,0.08)',
                padding: '16px',
              }}
            >
              {/* Header preview */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '8px',
                    backgroundColor: '#fbbf24',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon icon="mdi:hammer-wrench" style={{ fontSize: 16, color: '#ffffff' }} />
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Herramientas
                </Typography>
              </Box>

              {/* Herramientas preview */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {herramientas.map((herramienta) => (
                  <Box
                    key={herramienta.id}
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.5,
                      backgroundColor: herramienta.colorFondo,
                      color: herramienta.colorTexto,
                      px: 1,
                      py: 0.5,
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      border: '1px solid rgba(0,0,0,0.08)',
                    }}
                  >
                    <Icon
                      icon={herramienta.icono}
                      style={{ fontSize: 12, color: herramienta.colorIcono }}
                    />
                    {herramienta.nombre}
                  </Box>
                ))}
              </Box>
            </Box>
          </Paper>
        </Box>
      )}
    </Box>
  );
}

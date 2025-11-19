import React from 'react';
import { Icon } from '@iconify/react';

import {
  Box,
  Chip,
  Button,
  Accordion,
  Typography,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';

interface SmartDesignOptionsProps {
  selectedComponentId: string;
  selectedComponent: any;
  updateComponentStyle: (id: string, style: React.CSSProperties) => void;
  updateComponentProps: (id: string, props: Record<string, any>, options?: { content?: string }) => void;
}

const SmartDesignOptions: React.FC<SmartDesignOptionsProps> = ({
  selectedComponentId,
  selectedComponent,
  updateComponentStyle,
  updateComponentProps,
}) => {
  const componentType = selectedComponent?.type;

  // Smart suggestions based on component type
  const getSmartSuggestions = () => {
    switch (componentType) {
      case 'heading':
        return [
          {
            label: '💡 Título Principal',
            description: 'Tamaño grande, color accent',
            action: () => {
              updateComponentStyle(selectedComponentId, {
                fontSize: '28px',
                fontWeight: 'bold',
                color: '#3B82F6',
                marginBottom: '16px',
              });
            },
          },
          {
            label: '📰 Título de Sección',
            description: 'Moderno y legible',
            action: () => {
              updateComponentStyle(selectedComponentId, {
                fontSize: '20px',
                fontWeight: '600',
                color: '#1F2937',
                borderBottom: '2px solid #E5E7EB',
                paddingBottom: '8px',
              });
            },
          },
        ];

      case 'paragraph':
        return [
          {
            label: '📖 Párrafo Legible',
            description: 'Espaciado óptimo para lectura',
            action: () => {
              updateComponentStyle(selectedComponentId, {
                fontSize: '16px',
                lineHeight: '1.6',
                color: '#374151',
                marginBottom: '16px',
              });
            },
          },
          {
            label: '💬 Texto Destacado',
            description: 'Para citas o puntos importantes',
            action: () => {
              updateComponentStyle(selectedComponentId, {
                fontSize: '18px',
                fontStyle: 'italic',
                color: '#6366F1',
                borderLeft: '4px solid #6366F1',
                paddingLeft: '16px',
                backgroundColor: '#F8FAFC',
                padding: '16px',
                borderRadius: '8px',
              });
            },
          },
        ];

      case 'button':
        return [
          {
            label: '🎯 CTA Principal',
            description: 'Botón llamativo y profesional',
            action: () => {
              updateComponentStyle(selectedComponentId, {
                backgroundColor: '#3B82F6',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '16px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
              });
            },
          },
          {
            label: '📧 Botón Newsletter',
            description: 'Estilo especializado para emails',
            action: () => {
              updateComponentStyle(selectedComponentId, {
                backgroundColor: '#10B981',
                color: 'white',
                padding: '14px 28px',
                borderRadius: '6px',
                fontWeight: '500',
                fontSize: '15px',
                border: '2px solid #10B981',
                textDecoration: 'none',
              });
            },
          },
        ];

      default:
        return [
          {
            label: '✨ Mejorar Automáticamente',
            description: 'Aplicar mejores prácticas de diseño',
            action: () => {
              updateComponentStyle(selectedComponentId, {
                margin: '8px 0',
                padding: '8px',
                borderRadius: '4px',
              });
            },
          },
        ];
    }
  };

  const suggestions = getSmartSuggestions();

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        🎨 Diseño Inteligente
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Sugerencias personalizadas para tu{' '}
        {componentType === 'heading'
          ? 'título'
          : componentType === 'paragraph'
            ? 'párrafo'
            : componentType === 'button'
              ? 'botón'
              : 'componente'}
      </Typography>

      {/* Smart Suggestions */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<Icon icon="mdi:chevron-down" />}>
          <Chip label="💡 Sugerencias Smart" variant="filled" size="small" />
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outlined"
                fullWidth
                size="small"
                onClick={suggestion.action}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  textAlign: 'left',
                  py: 1.5,
                }}
              >
                <Typography variant="subtitle2" fontSize="0.85rem">
                  {suggestion.label}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {suggestion.description}
                </Typography>
              </Button>
            ))}
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Color Harmony */}
      <Accordion>
        <AccordionSummary expandIcon={<Icon icon="mdi:chevron-down" />}>
          <Chip label="🌈 Armonía de Color" variant="filled" size="small" />
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1 }}>
            {[
              { color: '#3B82F6', name: 'Azul' },
              { color: '#10B981', name: 'Verde' },
              { color: '#F59E0B', name: 'Naranja' },
              { color: '#EF4444', name: 'Rojo' },
              { color: '#8B5CF6', name: 'Morado' },
              { color: '#64748B', name: 'Gris' },
              { color: '#1F2937', name: 'Oscuro' },
              { color: '#F3F4F6', name: 'Claro' },
            ].map((colorOption) => (
              <Button
                key={colorOption.color}
                variant="outlined"
                size="small"
                sx={{
                  minWidth: 0,
                  bgcolor: colorOption.color,
                  color: colorOption.color === '#F3F4F6' ? '#1F2937' : 'white',
                  '&:hover': { opacity: 0.8 },
                  fontSize: '0.7rem',
                  p: 0.5,
                }}
                onClick={() => {
                  updateComponentStyle(selectedComponentId, {
                    color: colorOption.color,
                  });
                }}
              >
                {colorOption.name}
              </Button>
            ))}
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Quick Actions */}
      <Accordion>
        <AccordionSummary expandIcon={<Icon icon="mdi:chevron-down" />}>
          <Chip label="⚡ Acciones Rápidas" variant="filled" size="small" />
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Icon icon="mdi:auto-fix" />}
              onClick={() => {
                // Auto-optimize component
                updateComponentStyle(selectedComponentId, {
                  fontFamily: 'Inter, sans-serif',
                  lineHeight: '1.5',
                  margin: '16px 0',
                });
              }}
            >
              Auto-optimizar
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Icon icon="mdi:content-copy" />}
              onClick={() => {
                // Copy styles from this component
                console.log('Estilos copiados');
              }}
            >
              Copiar estilos
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Icon icon="mdi:restore" />}
              onClick={() => {
                // Reset to default styles
                updateComponentStyle(selectedComponentId, {});
              }}
            >
              Resetear estilos
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Preview */}
      <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
        <Typography variant="caption" color="text.secondary" gutterBottom display="block">
          🔍 Vista Previa del Componente
        </Typography>
        <Box
          sx={{
            p: 1,
            bgcolor: 'white',
            borderRadius: 1,
            border: '1px solid #E5E7EB',
            minHeight: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="caption" color="text.secondary">
            {componentType === 'heading'
              ? '📰 Título de ejemplo'
              : componentType === 'paragraph'
                ? '📖 Texto de ejemplo aquí...'
                : componentType === 'button'
                  ? '🔗 Botón'
                  : '✨ Componente'}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default SmartDesignOptions;

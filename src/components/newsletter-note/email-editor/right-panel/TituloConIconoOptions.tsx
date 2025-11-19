import { useEffect } from 'react';
import { Icon } from '@iconify/react';

import {
  Box,
  Paper,
  Alert,
  Button,
  Select,
  Divider,
  MenuItem,
  Accordion,
  InputLabel,
  Typography,
  FormControl,
  AccordionDetails,
  AccordionSummary,
  CircularProgress,
} from '@mui/material';

import { findComponentById } from '../utils/componentHelpers';
import { generateTituloConIconoPropsFromCategory } from '../constants/category-icons';

import type { TituloConIconoOptionsProps } from './types';

export default function TituloConIconoOptions({
  selectedComponentId,
  getActiveComponents,
  updateComponentProps,
  setShowIconPicker,
  contentTypeId,
  setContentTypeId,
  categoryId,
  setCategoryId,
  contentTypes,
  categories,
  loadingMetadata,
  loadCategories,
}: TituloConIconoOptionsProps) {
  // Cargar categorías cuando cambia el tipo de contenido
  useEffect(() => {
    if (contentTypeId) {
      loadCategories(contentTypeId);
    }
  }, [contentTypeId, loadCategories]);

  if (!selectedComponentId) return null;

  const component = findComponentById(getActiveComponents(), selectedComponentId);
  if (!component || component.type !== 'tituloConIcono') return null;

  // Valores por defecto si no existen
  const textColor = component.props?.textColor || '#E67E22';

  // Función para aplicar una categoría como estilo del componente
  const handleCategorySelect = (category: { id: string; name: string; imageUrl?: string }) => {
    console.log('🎯 [TituloConIconoOptions] handleCategorySelect START:', {
      categoryId: category.id,
      categoryName: category.name,
      selectedComponentId,
    });

    const categoryProps = generateTituloConIconoPropsFromCategory(category);
    console.log('📦 [TituloConIconoOptions] Generated props:', categoryProps);

    // Sincronizar con la configuración de la nota PRIMERO
    console.log('1️⃣ [TituloConIconoOptions] Setting category ID in note config');
    setCategoryId(category.id);

    // Actualizar las PROPS del componente (icono, colores, etc.) y el contenido en una única llamada
    console.log('2️⃣ [TituloConIconoOptions] Calling updateComponentProps with content snapshot');
    updateComponentProps(selectedComponentId, categoryProps, { content: category.name });

    console.log('✅ [TituloConIconoOptions] handleCategorySelect COMPLETE');
  };

  return (
    <Box>
      {/* Selector de Tipo de Contenido */}
      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
        Seleccionar Categoría
      </Typography>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Tipo de contenido</InputLabel>
        <Select
          value={contentTypeId}
          label="Tipo de contenido"
          onChange={(e) => setContentTypeId(e.target.value)}
          disabled={loadingMetadata}
          size="small"
        >
          <MenuItem value="">
            <em>Seleccionar tipo</em>
          </MenuItem>
          {contentTypes.map((type) => (
            <MenuItem key={type.id} value={type.id}>
              {type.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Mostrar loading cuando se cargan categorías */}
      {loadingMetadata && contentTypeId && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}

      {/* Sección de Categorías como Estilos Preestablecidos */}
      {!loadingMetadata && contentTypeId && categories.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
            Selecciona una categoría para aplicar su estilo
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 0.75,
            }}
          >
            {categories.map((category) => {
              const categoryProps = generateTituloConIconoPropsFromCategory(category);
              const isSelected = component.props?.categoryId === category.id;

              return (
                <Box
                  key={category.id}
                  onClick={() => handleCategorySelect(category)}
                  sx={{
                    height: 40,
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    px: 1.5,
                    cursor: 'pointer',
                    border: '2px solid',
                    borderColor: isSelected ? 'primary.main' : 'grey.200',
                    transition: 'all 0.15s',
                    bgcolor: 'grey.50',
                    '&:hover': {
                      borderColor: 'primary.main',
                      transform: 'translateX(2px)',
                      bgcolor: 'grey.100',
                    },
                  }}
                >
                  <img
                    src={categoryProps.icon}
                    alt={category.name}
                    style={{
                      width: 18,
                      height: 18,
                      objectFit: 'contain',
                      display: 'block',
                      flexShrink: 0,
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      color: categoryProps.textColor,
                      fontWeight: isSelected ? 700 : 600,
                      fontSize: '0.875rem',
                    }}
                  >
                    {category.name}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>
      )}

      {/* Mensaje cuando no hay tipo de contenido seleccionado */}
      {!contentTypeId && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Selecciona un tipo de contenido para ver las categorías disponibles
        </Alert>
      )}

      {/* Mensaje cuando no hay categorías */}
      {!loadingMetadata && contentTypeId && categories.length === 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          No hay categorías disponibles para este tipo de contenido
        </Alert>
      )}

      <Divider sx={{ my: 2 }} />

      {/* Configuración Avanzada en Acordeón */}
      <Accordion defaultExpanded={false} elevation={0} sx={{ '&:before': { display: 'none' } }}>
        <AccordionSummary
          expandIcon={<Icon icon="mdi:chevron-down" />}
          sx={{
            px: 0,
            minHeight: 'auto',
            '&.Mui-expanded': { minHeight: 'auto' },
            '& .MuiAccordionSummary-content': { my: 1 },
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
            Configuración Avanzada
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 0, pt: 1 }}>
          {/* Sección: Apariencia Visual */}
          <Paper elevation={0} sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                Apariencia Visual
              </Typography>
            </Box>

            {/* Icono */}
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                Icono
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 48,
                    height: 48,
                    bgcolor: 'white',
                    border: '2px solid',
                    borderColor: 'grey.200',
                  }}
                >
                  {/* Renderizado condicional para PNG URLs vs iconos legacy */}
                  {component.props?.icon && component.props.icon.startsWith('http') ? (
                    <img
                      src={component.props.icon}
                      alt="Icono seleccionado"
                      style={{
                        width: 24,
                        height: 24,
                        objectFit: 'contain',
                        display: 'block',
                      }}
                    />
                  ) : (
                    <Icon
                      icon={component.props?.icon || 'mdi:chart-line'}
                      style={{ fontSize: 24, color: textColor }}
                    />
                  )}
                </Paper>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setShowIconPicker(true)}
                  startIcon={<Icon icon="mdi:swap-horizontal" />}
                  sx={{ height: 'fit-content' }}
                >
                  Cambiar
                </Button>
              </Box>
            </Box>
          </Paper>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}

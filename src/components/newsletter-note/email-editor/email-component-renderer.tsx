'use client';

import { Box, Typography, Button, IconButton, TextField, Divider, Chip } from '@mui/material';
import { Icon } from '@iconify/react';
import type { EmailComponent } from 'src/types/saved-note';
import type { Editor } from '@tiptap/react';
import SimpleTipTapEditor from 'src/components/newsletter-note/simple-tiptap-editor';
import type React from 'react';

interface EmailComponentRendererProps {
  component: EmailComponent;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  updateComponentContent: (id: string, content: string) => void;
  updateComponentProps: (id: string, props: Record<string, any>) => void;
  handleSelectionUpdate: (editor: Editor) => void;
  moveComponent: (id: string, direction: 'up' | 'down') => void;
  removeComponent: (id: string) => void;
  totalComponents: number;
}

export default function EmailComponentRenderer({
  component,
  index,
  isSelected,
  onSelect,
  updateComponentContent,
  updateComponentProps,
  handleSelectionUpdate,
  moveComponent,
  removeComponent,
  totalComponents,
}: EmailComponentRendererProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
  };

  const componentStyle = {
    position: 'relative',
    padding: '8px',
    margin: '4px 0',
    border: isSelected ? '2px solid #3f51b5' : '1px solid transparent',
    borderRadius: '8px',
    transition: 'all 0.2s',
    '&:hover': {
      border: '1px solid #e0e0e0',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    },
  };

  // Función para manejar la actualización del contenido
  const handleContentChange = (newContent: string) => {
    updateComponentContent(component.id, newContent);
  };

  // Component toolbar that appears when selected
  const ComponentToolbar = () => (
    <Box
      sx={{
        position: 'absolute',
        top: '-36px',
        right: '0',
        display: 'flex',
        gap: '4px',
        background: 'white',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        padding: '4px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        zIndex: 10,
      }}
    >
      <IconButton
        size="small"
        onClick={() => moveComponent(component.id, 'up')}
        disabled={index === 0}
        sx={{
          width: '28px',
          height: '28px',
          color: index === 0 ? 'rgba(0,0,0,0.26)' : 'rgba(0,0,0,0.54)',
        }}
      >
        <Icon icon="mdi:arrow-up" width={16} />
      </IconButton>
      <IconButton
        size="small"
        onClick={() => moveComponent(component.id, 'down')}
        disabled={index === totalComponents - 1}
        sx={{
          width: '28px',
          height: '28px',
          color: index === totalComponents - 1 ? 'rgba(0,0,0,0.26)' : 'rgba(0,0,0,0.54)',
        }}
      >
        <Icon icon="mdi:arrow-down" width={16} />
      </IconButton>
      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
      <IconButton
        size="small"
        color="error"
        onClick={() => removeComponent(component.id)}
        sx={{ width: '28px', height: '28px' }}
      >
        <Icon icon="mdi:delete" width={16} />
      </IconButton>
    </Box>
  );

  switch (component.type) {
    case 'category':
      const categoryColor = component.props?.color || '#4caf50';
      const categoryItems = component.props?.items || [component.content];

      return (
        <Box sx={componentStyle} onClick={handleClick} key={component.id}>
          {isSelected && <ComponentToolbar />}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {categoryItems.map((item, index) => (
              <Chip
                key={index}
                label={item}
                sx={{
                  backgroundColor:
                    typeof categoryColor === 'string'
                      ? categoryColor
                      : categoryColor[index % categoryColor.length],
                  color: 'white',
                  fontWeight: 'bold',
                  '& .MuiChip-label': { px: 2 },
                }}
              />
            ))}

            {isSelected && categoryItems.length < 4 && (
              <Button
                variant="outlined"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  const newItems = [...categoryItems, 'Nueva categoría'];
                  const newColors = Array.isArray(categoryColor)
                    ? [...categoryColor, '#2196f3']
                    : [categoryColor, '#2196f3', '#f44336', '#ff9800'].slice(
                        0,
                        categoryItems.length + 1
                      );

                  updateComponentProps(component.id, {
                    items: newItems,
                    color: newColors,
                  });
                }}
                sx={{
                  minWidth: 'auto',
                  height: 32,
                  padding: '0 8px',
                  borderRadius: '16px',
                }}
              >
                <Icon icon="mdi:plus" />
              </Button>
            )}
          </Box>
        </Box>
      );

    case 'author':
      return (
        <Box sx={componentStyle} onClick={handleClick} key={component.id}>
          {isSelected && <ComponentToolbar />}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ display: 'flex', alignItems: 'center', mb: 2, ...(component.style || {}) }}
          >
            <Icon icon="mdi:account" style={{ marginRight: 8 }} />
            {component.props?.author || component.content}
            {component.props?.date && ` • ${component.props.date}`}
          </Typography>
          {isSelected && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" display="block" gutterBottom>
                Autor
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={component.props?.author || ''}
                onChange={(e) => updateComponentProps(component.id, { author: e.target.value })}
                sx={{ mb: 2 }}
              />
              <Typography variant="caption" display="block" gutterBottom>
                Fecha
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={component.props?.date || ''}
                onChange={(e) => updateComponentProps(component.id, { date: e.target.value })}
              />
            </Box>
          )}
        </Box>
      );

    case 'summary':
      return (
        <Box sx={componentStyle} onClick={handleClick} key={component.id}>
          {isSelected && <ComponentToolbar />}
          <Box
            sx={{
              backgroundColor: '#f5f7fa',
              padding: '16px',
              borderLeft: '4px solid #4caf50',
              borderRadius: '4px',
              mb: 3,
              ...(component.style || {}),
            }}
          >
            <Typography
              variant="subtitle2"
              gutterBottom
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <Icon
                icon={component.props?.icon || 'mdi:text-box-outline'}
                style={{ marginRight: 8 }}
              />
              {component.props?.label || 'Resumen'}
            </Typography>
            <Typography variant="body2">
              <SimpleTipTapEditor
                content={component.content}
                onChange={handleContentChange}
                onSelectionUpdate={handleSelectionUpdate}
                style={{ outline: 'none' }}
              />
            </Typography>
          </Box>
          {isSelected && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" display="block" gutterBottom>
                Etiqueta
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={component.props?.label || 'Resumen'}
                onChange={(e) => updateComponentProps(component.id, { label: e.target.value })}
                sx={{ mb: 2 }}
              />
            </Box>
          )}
        </Box>
      );

    case 'heading':
      const HeadingTag = `h${component.props?.level || 2}` as keyof JSX.IntrinsicElements;
      return (
        <Box sx={componentStyle} onClick={handleClick} key={component.id}>
          {isSelected && <ComponentToolbar />}
          <HeadingTag style={component.style || {}}>
            <SimpleTipTapEditor
              content={component.content}
              onChange={handleContentChange}
              onSelectionUpdate={handleSelectionUpdate}
              style={{ outline: 'none' }}
            />
          </HeadingTag>
        </Box>
      );

    case 'paragraph':
      return (
        <Box sx={componentStyle} onClick={handleClick} key={component.id}>
          {isSelected && <ComponentToolbar />}
          <Typography
            variant="body1"
            component="p"
            style={{
              ...(component.props?.isCode && {
                backgroundColor: '#f5f5f5',
                padding: '12px',
                fontFamily: 'monospace',
                textAlign: 'center',
                borderRadius: '8px',
              }),
              ...(component.style || {}),
            }}
          >
            <SimpleTipTapEditor
              content={component.content}
              onChange={handleContentChange}
              onSelectionUpdate={handleSelectionUpdate}
              style={{ outline: 'none' }}
            />
          </Typography>
        </Box>
      );

    case 'button':
      return (
        <Box sx={componentStyle} onClick={handleClick} key={component.id}>
          {isSelected && <ComponentToolbar />}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              mb: 2,
              textTransform: 'none',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              ...(component.style || {}),
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <SimpleTipTapEditor
              content={component.content}
              onChange={handleContentChange}
              onSelectionUpdate={handleSelectionUpdate}
              style={{ color: 'white', width: '100%', outline: 'none' }}
            />
          </Button>
        </Box>
      );

    case 'divider':
      return (
        <Box sx={componentStyle} onClick={handleClick} key={component.id}>
          {isSelected && <ComponentToolbar />}
          <Divider sx={{ my: 2, ...(component.style || {}) }} />
        </Box>
      );

    case 'bulletList':
      const items = component.props?.items || ['Item 1', 'Item 2', 'Item 3'];
      return (
        <Box sx={componentStyle} onClick={handleClick} key={component.id}>
          {isSelected && <ComponentToolbar />}
          <ul style={{ paddingLeft: '20px', marginBottom: '16px', ...(component.style || {}) }}>
            {items.map((item, i) => (
              <li key={i} style={{ marginBottom: '8px' }}>
                <Typography variant="body1" component="span">
                  <SimpleTipTapEditor
                    content={item}
                    onChange={(newContent) => {
                      const newItems = [...items];
                      newItems[i] = newContent;
                      updateComponentProps(component.id, { items: newItems });
                    }}
                    onSelectionUpdate={handleSelectionUpdate}
                    style={{ outline: 'none' }}
                  />
                </Typography>
              </li>
            ))}
          </ul>
          {isSelected && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<Icon icon="mdi:plus" />}
              onClick={() => {
                const newItems = [...items, 'New item'];
                updateComponentProps(component.id, { items: newItems });
              }}
              sx={{
                mt: 1,
                borderRadius: '8px',
                textTransform: 'none',
              }}
            >
              Añadir elemento
            </Button>
          )}
        </Box>
      );

    case 'spacer':
      return (
        <Box sx={componentStyle} onClick={handleClick} key={component.id}>
          {isSelected && <ComponentToolbar />}
          <Box
            sx={{
              height: '32px',
              mb: 2,
              ...(component.style || {}),
              border: isSelected ? '1px dashed rgba(0,0,0,0.1)' : 'none',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isSelected && (
              <Typography variant="caption" color="text.secondary">
                Espacio
              </Typography>
            )}
          </Box>
        </Box>
      );

    case 'image':
      return (
        <Box sx={componentStyle} onClick={handleClick} key={component.id}>
          {isSelected && <ComponentToolbar />}
          <Box sx={{ textAlign: 'center', mb: 2, ...(component.style || {}) }}>
            <img
              src={component.props?.src || '/placeholder.svg'}
              alt={component.props?.alt || 'Image'}
              style={{
                maxWidth: '100%',
                height: 'auto',
                margin: '0 auto',
                borderRadius: '8px',
              }}
            />
            {isSelected && (
              <TextField
                size="small"
                placeholder="URL de la imagen"
                value={component.props?.src || ''}
                onChange={(e) => updateComponentProps(component.id, { src: e.target.value })}
                fullWidth
                margin="normal"
                sx={{
                  mt: 1,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                  },
                }}
              />
            )}
          </Box>
        </Box>
      );

    case 'gallery':
      return (
        <Box sx={componentStyle} onClick={handleClick} key={component.id}>
          {isSelected && <ComponentToolbar />}
          <Box sx={{ textAlign: 'center', mb: 2, ...(component.style || {}) }}>
            <Typography variant="subtitle2" gutterBottom>
              Galería de imágenes -{' '}
              {component.props?.layout === 'single'
                ? 'Una imagen'
                : component.props?.layout === 'double'
                  ? 'Dos imágenes'
                  : component.props?.layout === 'feature'
                    ? 'Tres imágenes (Destacada)'
                    : component.props?.layout === 'masonry'
                      ? 'Tres imágenes (Mosaico)'
                      : component.props?.layout === 'hero'
                        ? 'Tres imágenes (Hero)'
                        : 'Cuadrícula (4 imágenes)'}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
                justifyContent: 'center',
              }}
            >
              {(component.props?.images || [])
                .slice(
                  0,
                  component.props?.layout === 'single'
                    ? 1
                    : component.props?.layout === 'double'
                      ? 2
                      : component.props?.layout === 'grid'
                        ? 4
                        : 3
                )
                .map((img, idx) => (
                  <img
                    key={idx}
                    src={img?.src || '/placeholder.svg'}
                    alt={img?.alt || `Gallery image ${idx + 1}`}
                    style={{
                      maxWidth:
                        component.props?.layout === 'single'
                          ? '100%'
                          : component.props?.layout === 'double'
                            ? '48%'
                            : component.props?.layout === 'grid'
                              ? '48%'
                              : component.props?.layout === 'feature' && idx < 2
                                ? '30%'
                                : component.props?.layout === 'feature' && idx === 2
                                  ? '65%'
                                  : component.props?.layout === 'masonry' && idx === 0
                                    ? '65%'
                                    : component.props?.layout === 'masonry' && idx > 0
                                      ? '30%'
                                      : component.props?.layout === 'hero' && idx === 0
                                        ? '100%'
                                        : '48%',
                      height: 'auto',
                      margin: '0 auto',
                      borderRadius: '8px',
                    }}
                  />
                ))}
            </Box>
            {isSelected && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" display="block" gutterBottom>
                  Tipo de layout
                </Typography>
                <TextField
                  select
                  fullWidth
                  size="small"
                  value={component.props?.layout || 'single'}
                  onChange={(e) => updateComponentProps(component.id, { layout: e.target.value })}
                  sx={{ mb: 2 }}
                >
                  <option value="single">Una imagen</option>
                  <option value="double">Dos imágenes</option>
                  <option value="grid">Cuadrícula (4 imágenes)</option>
                  <option value="feature">Tres imágenes (Destacada)</option>
                  <option value="masonry">Tres imágenes (Mosaico)</option>
                  <option value="hero">Tres imágenes (Hero)</option>
                </TextField>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Icon icon="mdi:pencil" />}
                  onClick={(e) => {
                    e.stopPropagation();
                    // Aquí iría la lógica para editar las imágenes de la galería
                    // Asegurarnos de que esta función se esté llamando correctamente
                  }}
                >
                  Editar imágenes
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      );

    default:
      return null;
  }
}

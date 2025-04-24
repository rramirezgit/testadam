'use client';

import type React from 'react';
import type { Editor } from '@tiptap/react';
import type { EmailComponent } from 'src/types/saved-note';

import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';

import { Box, Chip, Button, Divider, TextField, Typography, IconButton } from '@mui/material';

import SimpleTipTapEditor from 'src/components/newsletter-note/simple-tiptap-editor';

import IconPicker from './icon-picker';

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
  renderCustomContent?: (component: EmailComponent) => React.ReactNode;
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
  renderCustomContent,
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

  // Función auxiliar para generar el marcador de lista ordenada
  const getOrderedListMarker = (index: number, listStyle: string): string => {
    switch (listStyle) {
      case 'decimal':
        return `${index}`;
      case 'lower-alpha':
        return `${String.fromCharCode(96 + index)}`;
      case 'upper-alpha':
        return `${String.fromCharCode(64 + index)}`;
      case 'lower-roman':
        return `${toRoman(index).toLowerCase()}`;
      case 'upper-roman':
        return `${toRoman(index)}`;
      default:
        return `${index}`;
    }
  };

  // Función para convertir números a numerales romanos
  const toRoman = (num: number): string => {
    const romanNumerals = [
      { value: 1000, numeral: 'M' },
      { value: 900, numeral: 'CM' },
      { value: 500, numeral: 'D' },
      { value: 400, numeral: 'CD' },
      { value: 100, numeral: 'C' },
      { value: 90, numeral: 'XC' },
      { value: 50, numeral: 'L' },
      { value: 40, numeral: 'XL' },
      { value: 10, numeral: 'X' },
      { value: 9, numeral: 'IX' },
      { value: 5, numeral: 'V' },
      { value: 4, numeral: 'IV' },
      { value: 1, numeral: 'I' },
    ];

    let result = '';
    let remaining = num;

    for (const { value, numeral } of romanNumerals) {
      while (remaining >= value) {
        result += numeral;
        remaining -= value;
      }
    }

    return result;
  };

  const ImageComponent = ({ data, onUpdate }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageClick = () => {
      fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Verificar el tipo de archivo
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        alert(
          'Tipo de archivo no válido. Por favor selecciona una imagen PNG, JPG, JPEG, WEBP o GIF.'
        );
        return;
      }

      // Convertir a base64
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        onUpdate(component.id, { src: base64String, alt: file.name });
      };
      reader.readAsDataURL(file);
    };

    return (
      <div className="image-component-wrapper">
        {data.src ? (
          <img
            src={data.src}
            alt={data.alt || 'Newsletter image'}
            style={{ maxWidth: '100%', cursor: 'pointer' }}
            onClick={handleImageClick}
          />
        ) : (
          <div
            className="image-placeholder"
            onClick={handleImageClick}
            style={{
              border: '2px dashed #ccc',
              borderRadius: '4px',
              padding: '20px',
              textAlign: 'center',
              cursor: 'pointer',
            }}
          >
            Haz clic para seleccionar una imagen
          </div>
        )}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
          onChange={handleFileChange}
        />
      </div>
    );
  };

  switch (component.type) {
    case 'category':
      const categoryColor = component.props?.color || '#4caf50';
      const categoryItems = component.props?.items || [component.content];
      // Obtener las propiedades de estilo
      const borderRadius = component.props?.borderRadius || 16;
      const padding = component.props?.padding || 4;
      const textColor = component.props?.textColor || 'white';
      const fontWeight = component.props?.fontWeight || 'bold';
      const fontSize = component.props?.fontSize || 14;

      return (
        <Box
          sx={{
            position: 'relative',
            mb: 2,
            border: isSelected ? '2px solid #3f51b5' : '2px solid transparent',
            borderRadius: '4px',
            '&:hover': {
              border: isSelected ? '2px solid #3f51b5' : '2px dashed #ccc',
            },
          }}
          onClick={onSelect}
        >
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
                  color: textColor,
                  fontWeight,
                  fontSize: `${fontSize}px`,
                  borderRadius: `${borderRadius}px`,
                  '& .MuiChip-label': { px: padding * 3, py: padding },
                  position: 'relative',
                  cursor: isSelected ? 'pointer' : 'default',
                  '&:hover': isSelected
                    ? {
                        opacity: 0.9,
                        '&::after': {
                          content: '"✎"',
                          position: 'absolute',
                          right: '8px',
                          fontSize: '12px',
                        },
                      }
                    : {},
                }}
                onClick={(e) => {
                  if (isSelected) {
                    e.stopPropagation();
                    // No necesitamos hacer nada aquí, solo evitar que se propague el evento
                    // para que el usuario pueda editar en el panel derecho
                  }
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

          {isSelected && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block', textAlign: 'center', mb: 1 }}
            >
              Edita el texto y los colores en el panel derecho →
            </Typography>
          )}
        </Box>
      );

    case 'author':
      return (
        <Box
          sx={{
            position: 'relative',
            mb: 2,
            border: isSelected ? '2px solid #3f51b5' : '2px solid transparent',
            borderRadius: '4px',
            '&:hover': {
              border: isSelected ? '2px solid #3f51b5' : '2px dashed #ccc',
            },
          }}
          onClick={onSelect}
        >
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
      const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
      const iconRef = useRef<HTMLDivElement>(null);

      const handleSelectIcon = (iconName: string) => {
        updateComponentProps(component.id, { icon: iconName });
      };

      const iconColor = component.props?.iconColor || '#000000';
      const iconSize = component.props?.iconSize || 24;
      const titleColor = component.props?.titleColor || '#000000';
      const titleFontWeight = component.props?.titleFontWeight || 'normal';
      const titleFontFamily = component.props?.titleFontFamily || 'inherit';

      // Configuración del gradiente
      const useGradient = component.props?.useGradient || false;
      const gradientType = component.props?.gradientType || 'linear';
      const gradientDirection = component.props?.gradientDirection || 'to right';
      const gradientColor1 = component.props?.gradientColor1 || '#f5f7fa';
      const gradientColor2 = component.props?.gradientColor2 || '#c3cfe2';

      const backgroundStyle = useGradient
        ? {
            background:
              gradientType === 'linear'
                ? `linear-gradient(${gradientDirection}, ${gradientColor1}, ${gradientColor2})`
                : `radial-gradient(circle, ${gradientColor1}, ${gradientColor2})`,
          }
        : { backgroundColor: component.props?.backgroundColor || '#f5f7fa' };

      return (
        <Box
          sx={{
            position: 'relative',
            mb: 2,
            border: isSelected ? '2px solid #3f51b5' : '2px solid transparent',
            borderRadius: '4px',
            '&:hover': {
              border: isSelected ? '2px solid #3f51b5' : '2px dashed #ccc',
            },
          }}
          onClick={onSelect}
        >
          {isSelected && <ComponentToolbar />}
          <Box
            sx={{
              padding: '16px',
              borderLeft: `4px solid ${component.props?.borderColor || '#4caf50'}`,
              borderRadius: '4px',
              mb: 3,
              ...backgroundStyle,
              ...(component.style || {}),
            }}
          >
            <Typography
              variant="subtitle2"
              gutterBottom
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: titleColor,
                fontWeight: titleFontWeight,
                fontFamily: titleFontFamily,
              }}
            >
              <Box
                ref={iconRef}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 1,
                }}
              >
                <Icon
                  icon={component.props?.icon || 'mdi:text-box-outline'}
                  style={{
                    color: iconColor,
                    width: iconSize,
                    height: iconSize,
                  }}
                />
              </Box>
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

          <IconPicker
            open={isIconPickerOpen}
            onClose={() => setIsIconPickerOpen(false)}
            onSelectIcon={handleSelectIcon}
            currentIcon={component.props?.icon || 'mdi:text-box-outline'}
          />
        </Box>
      );

    case 'heading':
      const HeadingTag = `h${component.props?.level || 2}` as keyof JSX.IntrinsicElements;
      return (
        <Box
          sx={{
            position: 'relative',
            mb: 2,
            border: isSelected ? '2px solid #3f51b5' : '2px solid transparent',
            borderRadius: '4px',
            '&:hover': {
              border: isSelected ? '2px solid #3f51b5' : '2px dashed #ccc',
            },
          }}
          onClick={onSelect}
        >
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
        <Box
          sx={{
            position: 'relative',
            mb: 2,
            border: isSelected ? '2px solid #3f51b5' : '2px solid transparent',
            borderRadius: '4px',
            '&:hover': {
              border: isSelected ? '2px solid #3f51b5' : '2px dashed #ccc',
            },
          }}
          onClick={onSelect}
        >
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
        <Box
          sx={{
            position: 'relative',
            mb: 2,
            border: isSelected ? '2px solid #3f51b5' : '2px solid transparent',
            borderRadius: '4px',
            '&:hover': {
              border: isSelected ? '2px solid #3f51b5' : '2px dashed #ccc',
            },
          }}
          onClick={onSelect}
        >
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
        <Box
          sx={{
            position: 'relative',
            mb: 2,
            border: isSelected ? '2px solid #3f51b5' : '2px solid transparent',
            borderRadius: '4px',
            '&:hover': {
              border: isSelected ? '2px solid #3f51b5' : '2px dashed #ccc',
            },
          }}
          onClick={onSelect}
        >
          {isSelected && <ComponentToolbar />}
          <Divider sx={{ my: 2, ...(component.style || {}) }} />
        </Box>
      );

    case 'bulletList':
      if (renderCustomContent) {
        return (
          <Box
            sx={{
              position: 'relative',
              mb: 2,
              border: isSelected ? '2px solid #3f51b5' : '2px solid transparent',
              borderRadius: '4px',
              '&:hover': {
                border: isSelected ? '2px solid #3f51b5' : '2px dashed #ccc',
              },
            }}
            onClick={onSelect}
          >
            {isSelected && <ComponentToolbar />}
            {renderCustomContent(component)}
          </Box>
        );
      }

      const items = component.props?.items || ['Item 1', 'Item 2', 'Item 3'];
      const listStyle = component.props?.listStyle || 'disc';
      const listColor = component.props?.listColor || '#000000';

      // Determinar si es una lista ordenada
      const isOrderedList =
        listStyle === 'decimal' ||
        listStyle === 'lower-alpha' ||
        listStyle === 'upper-alpha' ||
        listStyle === 'lower-roman' ||
        listStyle === 'upper-roman';

      return (
        <Box
          sx={{
            position: 'relative',
            mb: 2,
            border: isSelected ? '2px solid #3f51b5' : '2px solid transparent',
            borderRadius: '4px',
            '&:hover': {
              border: isSelected ? '2px solid #3f51b5' : '2px dashed #ccc',
            },
          }}
          onClick={onSelect}
        >
          {isSelected && <ComponentToolbar />}
          <Box sx={{ pl: 2 }}>
            {items.map((item, i) => (
              <Box
                key={i}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  mb: 1,
                }}
              >
                {isOrderedList ? (
                  // Marcador para listas ordenadas - Estilo unificado con círculo y número
                  <Box
                    sx={{
                      minWidth: '24px',
                      mr: 2,
                      backgroundColor: listColor,
                      borderRadius: '50%',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      height: '24px',
                      width: '24px',
                      lineHeight: '24px',
                      textAlign: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {getOrderedListMarker(i + 1, listStyle)}
                  </Box>
                ) : (
                  // Marcador para listas no ordenadas - Estilo unificado
                  <Box
                    sx={{
                      minWidth: '24px',
                      mr: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {listStyle === 'disc' && (
                      <Box
                        sx={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: listColor,
                        }}
                      />
                    )}
                    {listStyle === 'circle' && (
                      <Box
                        sx={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          border: `1px solid ${listColor}`,
                          backgroundColor: 'transparent',
                        }}
                      />
                    )}
                    {listStyle === 'square' && (
                      <Box
                        sx={{
                          width: '8px',
                          height: '8px',
                          backgroundColor: listColor,
                        }}
                      />
                    )}
                  </Box>
                )}
                <Box sx={{ flexGrow: 1 }}>{item}</Box>
              </Box>
            ))}
          </Box>
        </Box>
      );

    case 'spacer':
      return (
        <Box
          sx={{
            position: 'relative',
            mb: 2,
            border: isSelected ? '2px solid #3f51b5' : '2px solid transparent',
            borderRadius: '4px',
            '&:hover': {
              border: isSelected ? '2px solid #3f51b5' : '2px dashed #ccc',
            },
          }}
          onClick={onSelect}
        >
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
        <Box
          sx={{
            position: 'relative',
            mb: 2,
            border: isSelected ? '2px solid #3f51b5' : '2px solid transparent',
            borderRadius: '4px',
            '&:hover': {
              border: isSelected ? '2px solid #3f51b5' : '2px dashed #ccc',
            },
          }}
          onClick={onSelect}
        >
          {isSelected && <ComponentToolbar />}
          <Box sx={{ textAlign: 'center', mb: 2, ...(component.style || {}) }}>
            <ImageComponent
              data={component.props || {}}
              onUpdate={(id, props) => updateComponentProps(id, props)}
            />
          </Box>
        </Box>
      );

    case 'gallery':
      return (
        <Box
          sx={{
            position: 'relative',
            mb: 2,
            border: isSelected ? '2px solid #3f51b5' : '2px solid transparent',
            borderRadius: '4px',
            '&:hover': {
              border: isSelected ? '2px solid #3f51b5' : '2px dashed #ccc',
            },
          }}
          onClick={onSelect}
        >
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

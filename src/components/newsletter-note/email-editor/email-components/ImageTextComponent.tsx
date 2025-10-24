import { memo, useRef, useMemo, useState, useCallback } from 'react';

import { Box, TextField, Typography } from '@mui/material';

import ComponentWithToolbar from './ComponentWithToolbar';
import SimpleTipTapEditor from '../../simple-tiptap-editor';
import { useImageUpload } from '../right-panel/useImageUpload';

import type { EmailComponentProps } from './types';

// ⚡ ULTRA-OPTIMIZACIÓN: Componente interno memoizado para descripción
const MemoizedDescriptionEditor = memo(
  ({
    content,
    onContentChange,
    onSelectionUpdate,
    editorStyle,
  }: {
    content: string;
    onContentChange?: (content: string) => void;
    onSelectionUpdate?: (editor: any) => void;
    editorStyle: React.CSSProperties;
  }) => (
    <SimpleTipTapEditor
      content={content}
      onChange={onContentChange || (() => {})}
      onSelectionUpdate={onSelectionUpdate}
      showToolbar={false}
      style={editorStyle}
      showAIButton={false}
    />
  ),
  (prevProps, nextProps) =>
    prevProps.content === nextProps.content &&
    prevProps.onContentChange === nextProps.onContentChange &&
    prevProps.onSelectionUpdate === nextProps.onSelectionUpdate &&
    JSON.stringify(prevProps.editorStyle) === JSON.stringify(nextProps.editorStyle)
);

MemoizedDescriptionEditor.displayName = 'MemoizedDescriptionEditor';

const ImageTextComponent = memo(
  ({
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
  }: EmailComponentProps) => {
    const imageFileInputRef = useRef<HTMLInputElement>(null);
    const { uploadImageToS3 } = useImageUpload();
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [tempTitle, setTempTitle] = useState('');

    const imageUrl = component.props?.imageUrl || '';
    const imageAlt = component.props?.imageAlt || 'Imagen';
    const title = component.props?.title || 'Título';
    const imageWidth = component.props?.imageWidth || 40; // Porcentaje de ancho de la imagen
    const spacing = component.props?.spacing || 16;
    const borderRadius = component.props?.borderRadius || 8;
    const backgroundColor = component.props?.backgroundColor || '#ffffff';
    const textColor = component.props?.textColor || '#333333';
    const titleColor = component.props?.titleColor || '#000000';
    const fontSize = component.props?.fontSize || 14;
    const titleSize = component.props?.titleSize || 20;

    const handleClick = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        console.log('🔵 ImageTextComponent clicked:', component.id, { onSelect: !!onSelect });
        if (onSelect) {
          onSelect();
          console.log('🟢 ImageTextComponent onSelect called for:', component.id);
        }
      },
      [onSelect, component.id]
    );

    const handleImageClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!isSelected) {
        onSelect();
      }
      imageFileInputRef.current?.click();
    };

    const handleImageFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const base64 = e.target?.result as string;

          // Primero actualizar con la imagen base64 para mostrar preview
          updateComponentProps(component.id, { imageUrl: base64 });

          // Luego subir automáticamente a S3
          try {
            const s3Url = await uploadImageToS3(base64, `imagetext_${Date.now()}`);
            updateComponentProps(component.id, { imageUrl: s3Url });
          } catch (error) {
            console.error('Error al subir la imagen a S3:', error);
            // Mantener la imagen base64 si falla la subida
          }
        };
        reader.readAsDataURL(file);
      }
    };

    // Manejadores para el título editable
    const handleTitleClick = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        setTempTitle(title);
        setIsEditingTitle(true);
      },
      [title]
    );

    const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      setTempTitle(e.target.value);
    }, []);

    const handleTitleSubmit = useCallback(() => {
      if (updateComponentProps && tempTitle.trim() !== title) {
        updateComponentProps(component.id, { title: tempTitle.trim() });
      }
      setIsEditingTitle(false);
    }, [updateComponentProps, component.id, tempTitle, title]);

    const handleTitleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleTitleSubmit();
        } else if (e.key === 'Escape') {
          setIsEditingTitle(false);
          setTempTitle(title);
        }
      },
      [handleTitleSubmit, title]
    );

    const handleTitleBlur = useCallback(() => {
      handleTitleSubmit();
    }, [handleTitleSubmit]);

    // Manejador para cambios en la descripción
    const handleDescriptionChange = useCallback(
      (newContent: string) => {
        if (updateComponentContent && newContent !== component.content) {
          if ('scheduler' in window && 'postTask' in (window as any).scheduler) {
            (window as any).scheduler.postTask(
              () => {
                updateComponentContent(component.id, newContent);
              },
              { priority: 'user-blocking' }
            );
          } else {
            const channel = new MessageChannel();
            channel.port2.onmessage = () => updateComponentContent(component.id, newContent);
            channel.port1.postMessage(null);
          }
        }
      },
      [updateComponentContent, component.id, component.content]
    );

    const handleSelectionUpdateMemo = useCallback(
      (editor: any) => {
        if (isSelected && handleSelectionUpdate) {
          requestAnimationFrame(() => {
            handleSelectionUpdate(editor);
          });
        }
      },
      [isSelected, handleSelectionUpdate]
    );

    // Estilos memoizados para el editor
    const editorStyle = useMemo(
      () => ({
        outline: 'none',
        fontDisplay: 'swap' as const,
        textSizeAdjust: 'none',
        WebkitFontSmoothing: 'antialiased' as const,
        MozOsxFontSmoothing: 'grayscale' as const,
      }),
      []
    );

    const descriptionBoxStyles = useMemo(
      () => ({
        color: textColor,
        fontSize: `${fontSize}px`,
        lineHeight: 1.5,
        '& p': {
          margin: 0,
          color: textColor,
        },
        '& p:empty::before': {
          content: '"Escribe la descripción aquí..."',
          color: '#adb5bd',
          fontStyle: 'italic',
        },
      }),
      [textColor, fontSize]
    );

    return (
      <ComponentWithToolbar
        isSelected={isSelected}
        index={index}
        totalComponents={totalComponents}
        componentId={component.id}
        moveComponent={moveComponent}
        removeComponent={removeComponent}
        onClick={handleClick}
      >
        <Box
          sx={{
            backgroundColor,
            borderRadius: `${borderRadius}px`,
            overflow: 'hidden',
            ...(component.style || {}),
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: `${spacing}px`,
              alignItems: 'center',
              p: 2,
            }}
          >
            {/* Imagen */}
            <Box
              sx={{
                width: { xs: '100%', sm: `${imageWidth}%` },
                flexShrink: 0,
              }}
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={imageAlt}
                  onClick={handleImageClick}
                  style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: `${borderRadius}px`,
                    objectFit: 'cover',
                    display: 'block',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              ) : (
                <Box
                  onClick={handleImageClick}
                  sx={{
                    width: '100%',
                    height: 150,
                    backgroundColor: '#f5f5f5',
                    borderRadius: `${borderRadius}px`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #e0e0e0',
                    color: '#9e9e9e',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: '#eeeeee',
                      borderColor: '#2196f3',
                      color: '#2196f3',
                      transform: 'scale(1.02)',
                    },
                  }}
                >
                  <Typography variant="body2">📷 Click para subir imagen</Typography>
                </Box>
              )}
            </Box>

            {/* Input oculto para archivos */}
            <input
              type="file"
              ref={imageFileInputRef}
              style={{ display: 'none' }}
              accept="image/*"
              onChange={handleImageFileChange}
            />

            {/* Contenido de texto */}
            <Box
              sx={{
                flex: 1,
                textAlign: { xs: 'center', sm: 'left' },
              }}
            >
              {/* Título editable */}
              {isEditingTitle ? (
                <TextField
                  value={tempTitle}
                  onChange={handleTitleChange}
                  onKeyDown={handleTitleKeyDown}
                  onBlur={handleTitleBlur}
                  autoFocus
                  variant="standard"
                  size="small"
                  fullWidth
                  sx={{
                    mb: 1,
                    '& .MuiInput-root': {
                      color: titleColor,
                      fontSize: `${titleSize}px`,
                      fontWeight: 'bold',
                      '&:before': {
                        borderBottom: 'none',
                      },
                      '&:after': {
                        borderBottom: `2px solid ${titleColor}`,
                      },
                      '&:hover:not(.Mui-disabled):before': {
                        borderBottom: 'none',
                      },
                    },
                    '& .MuiInput-input': {
                      padding: 0,
                    },
                  }}
                />
              ) : (
                <Typography
                  variant="h6"
                  onClick={handleTitleClick}
                  sx={{
                    color: titleColor,
                    fontSize: `${titleSize}px`,
                    fontWeight: 'bold',
                    mb: 1,
                    lineHeight: 1.2,
                    cursor: 'pointer',
                    '&:hover': {
                      opacity: 0.8,
                    },
                  }}
                >
                  {title}
                </Typography>
              )}

              {/* Descripción editable con SimpleTipTapEditor */}
              <Box sx={descriptionBoxStyles}>
                <MemoizedDescriptionEditor
                  content={component.content || '<p>Escribe la descripción aquí...</p>'}
                  onContentChange={handleDescriptionChange}
                  onSelectionUpdate={handleSelectionUpdateMemo}
                  editorStyle={editorStyle}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </ComponentWithToolbar>
    );
  },
  (prevProps, nextProps) => {
    if (prevProps.component.id !== nextProps.component.id) return false;
    if (prevProps.component.content !== nextProps.component.content) return false;
    if (prevProps.isSelected !== nextProps.isSelected) return false;
    if (prevProps.index !== nextProps.index) return false;

    if (JSON.stringify(prevProps.component.style) !== JSON.stringify(nextProps.component.style))
      return false;
    if (JSON.stringify(prevProps.component.props) !== JSON.stringify(nextProps.component.props))
      return false;

    return true;
  }
);

ImageTextComponent.displayName = 'ImageTextComponent';

export default ImageTextComponent;

import { Icon } from '@iconify/react';
import { memo, useRef, useMemo, useCallback } from 'react';

import { Box, Chip } from '@mui/material';

import { CONFIG } from 'src/global-config';

import { isBase64Image } from '../utils/imageValidation';
import ComponentWithToolbar from './ComponentWithToolbar';
import SimpleTipTapEditor from '../../simple-tiptap-editor';
import { useImageUpload } from '../right-panel/useImageUpload';
import { getVariantConfig } from '../constants/image-text-variants';
import { DEFAULT_PLACEHOLDER_COLOR, shouldUsePlaceholderColor } from './utils';

import type { EmailComponentProps } from './types';

// ⚡ Sub-componente: ImageUploader con todas las capacidades de ImageComponent
interface ImageUploaderProps {
  imageUrl: string;
  imageAlt: string;
  height: string;
  objectFit: string;
  backgroundColor: string;
  containerBackgroundColor: string;
  borderRadius: number;
  width?: string;
  imageBorderRadius?: string;
  onImageClick: (e: React.MouseEvent) => void;
}

const ImageUploader = memo(
  ({
    imageUrl,
    imageAlt,
    height,
    objectFit,
    backgroundColor,
    containerBackgroundColor,
    borderRadius,
    width,
    imageBorderRadius,
    onImageClick,
  }: ImageUploaderProps) => {
    // Determinar el radio de borde a usar (específico de la imagen o del contenedor)
    const effectiveImageBorderRadius = imageBorderRadius || `${borderRadius}px`;

    return (
      <div
        className="image-component-wrapper"
        style={{
          position: 'relative',
          height,
          overflow: 'hidden',
          backgroundColor:
            height !== 'auto' && containerBackgroundColor
              ? containerBackgroundColor
              : 'transparent',
          borderRadius: effectiveImageBorderRadius,
          display: 'inline-block',
          cursor: 'pointer',
          width: width || '100%',
          flexShrink: 0,
        }}
        onClick={onImageClick}
      >
        {imageUrl ? (
          <Box
            sx={{
              position: 'relative',
              backgroundColor: containerBackgroundColor ? 'transparent' : backgroundColor,
              borderRadius: effectiveImageBorderRadius,
              overflow: 'hidden',
              display: 'block',
              height: '100%',
              width: '100%',
            }}
          >
            <img
              src={imageUrl}
              alt={imageAlt}
              style={{
                width: '100%',
                height: '100%',
                objectFit: objectFit as React.CSSProperties['objectFit'],
                borderRadius: effectiveImageBorderRadius,
                display: 'block',
                margin: 0,
              }}
            />

            {/* Chip indicador para imágenes base64 */}
            {isBase64Image(imageUrl) && (
              <Chip
                icon={<Icon icon="mdi:cloud-upload-outline" />}
                label="Subir a S3"
                color="warning"
                size="small"
                sx={{
                  position: 'absolute',
                  top: 8,
                  left: 8,
                  fontSize: '0.75rem',
                  height: '24px',
                  backgroundColor: 'rgba(255, 152, 0, 0.9)',
                  color: 'white',
                  '& .MuiChip-icon': {
                    color: 'white',
                    fontSize: '16px',
                  },
                  '& .MuiChip-label': {
                    padding: '0 6px',
                  },
                  zIndex: 2,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                }}
              />
            )}
          </Box>
        ) : (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              minHeight: 150,
              backgroundColor: '#f5f5f5',
              borderRadius: `${borderRadius}px`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #e0e0e0',
              color: '#9e9e9e',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: '#eeeeee',
                borderColor: '#2196f3',
                color: '#2196f3',
              },
            }}
          >
            <img src={CONFIG.emptyImageUrl} alt="Imagen vacía" style={{ maxWidth: '80px' }} />
          </Box>
        )}
      </div>
    );
  }
);

ImageUploader.displayName = 'ImageUploader';

// ⚡ Sub-componente: Editor de título con TipTap
const MemoizedTitleEditor = memo(
  ({
    content,
    onContentChange,
    onSelectionUpdate,
    editorStyle,
    isPlaceholder,
    placeholderColor,
  }: {
    content: string;
    onContentChange?: (content: string) => void;
    onSelectionUpdate?: (editor: any) => void;
    editorStyle: React.CSSProperties;
    isPlaceholder?: boolean;
    placeholderColor?: string;
  }) => (
    <SimpleTipTapEditor
      content={content}
      onChange={onContentChange || (() => {})}
      onSelectionUpdate={onSelectionUpdate}
      showToolbar={false}
      style={editorStyle}
      showAIButton={false}
      isPlaceholder={isPlaceholder}
      placeholderColor={placeholderColor}
      placeholder="Título"
    />
  ),
  (prevProps, nextProps) =>
    prevProps.content === nextProps.content &&
    prevProps.onContentChange === nextProps.onContentChange &&
    prevProps.onSelectionUpdate === nextProps.onSelectionUpdate &&
    JSON.stringify(prevProps.editorStyle) === JSON.stringify(nextProps.editorStyle) &&
    prevProps.isPlaceholder === nextProps.isPlaceholder &&
    prevProps.placeholderColor === nextProps.placeholderColor
);

MemoizedTitleEditor.displayName = 'MemoizedTitleEditor';

// ⚡ Sub-componente: Editor de descripción con TipTap
const MemoizedDescriptionEditor = memo(
  ({
    content,
    onContentChange,
    onSelectionUpdate,
    editorStyle,
    isPlaceholder,
    placeholderColor,
  }: {
    content: string;
    onContentChange?: (content: string) => void;
    onSelectionUpdate?: (editor: any) => void;
    editorStyle: React.CSSProperties;
    isPlaceholder?: boolean;
    placeholderColor?: string;
  }) => (
    <SimpleTipTapEditor
      content={content}
      onChange={onContentChange || (() => {})}
      onSelectionUpdate={onSelectionUpdate}
      showToolbar={false}
      style={editorStyle}
      showAIButton={false}
      isPlaceholder={isPlaceholder}
      placeholderColor={placeholderColor}
      placeholder="Escribe la descripción aquí..."
    />
  ),
  (prevProps, nextProps) =>
    prevProps.content === nextProps.content &&
    prevProps.onContentChange === nextProps.onContentChange &&
    prevProps.onSelectionUpdate === nextProps.onSelectionUpdate &&
    JSON.stringify(prevProps.editorStyle) === JSON.stringify(nextProps.editorStyle) &&
    prevProps.isPlaceholder === nextProps.isPlaceholder &&
    prevProps.placeholderColor === nextProps.placeholderColor
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

    // Obtener configuración de la variante seleccionada
    const variant = component.props?.variant || 'default';
    const variantConfig = getVariantConfig(variant);

    // Props del componente (con fallback a valores de la variante)
    const imageUrl = component.props?.imageUrl || variantConfig.defaultImageUrl || '';
    const imageAlt = component.props?.imageAlt || 'Imagen';
    const imageWidth = component.props?.imageWidth || 40; // Porcentaje de ancho de la imagen
    const spacing = component.props?.spacing ?? variantConfig.spacing;
    const borderRadius = component.props?.borderRadius ?? variantConfig.borderRadius;
    const backgroundColor = component.props?.backgroundColor ?? variantConfig.backgroundColor;
    const baseTextColor = component.props?.textColor ?? variantConfig.textColor;
    const baseTitleColor = component.props?.titleColor ?? variantConfig.titleColor;
    const fontSize = component.props?.fontSize || 14;
    const titleSize = component.props?.titleSize || 20;
    const padding = component.props?.padding ?? variantConfig.padding;

    // Props específicos de variante
    const borderColor = component.props?.borderColor ?? variantConfig.borderColor;
    const borderWidth = component.props?.borderWidth ?? variantConfig.borderWidth;

    // Props de imagen (nuevas)
    const imageHeight = component.props?.imageHeight ?? variantConfig.imageHeight ?? 'auto';
    const imageFixedWidth = component.props?.imageFixedWidth ?? variantConfig.imageFixedWidth;
    const imageObjectFit =
      component.props?.imageObjectFit ?? (variantConfig.imageObjectFit || 'contain');
    const imageBackgroundColor = component.props?.imageBackgroundColor || 'transparent';
    const imageContainerBackgroundColor = component.props?.imageContainerBackgroundColor || '';
    const imageBorderRadius = component.props?.imageBorderRadius ?? variantConfig.imageBorderRadius;

    // Props de fondo con imagen
    const backgroundImageUrl =
      component.props?.backgroundImageUrl ?? variantConfig.backgroundImageUrl;
    const backgroundSize = component.props?.backgroundSize ?? variantConfig.backgroundSize;
    const backgroundPosition =
      component.props?.backgroundPosition ?? variantConfig.backgroundPosition;
    const backgroundRepeat = component.props?.backgroundRepeat ?? variantConfig.backgroundRepeat;

    // Props de contenedor
    const minHeight = component.props?.minHeight ?? variantConfig.minHeight;
    const alignItems = component.props?.alignItems ?? variantConfig.alignItems;

    // Layout prop (nuevo)
    const layout = component.props?.layout || 'image-left'; // 'image-left', 'image-right', 'image-top', 'image-bottom'

    // Título y descripción como HTML
    const titleContent = component.props?.titleContent || '<p>Título</p>';

    const placeholderActive = shouldUsePlaceholderColor(
      component,
      (component.style?.color as string | undefined) || baseTextColor || baseTitleColor
    );
    const displayTextColor = placeholderActive ? DEFAULT_PLACEHOLDER_COLOR : baseTextColor;
    const displayTitleColor = placeholderActive ? DEFAULT_PLACEHOLDER_COLOR : baseTitleColor;

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

    const handleImageClick = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isSelected) {
          onSelect();
        }
        imageFileInputRef.current?.click();
      },
      [isSelected, onSelect]
    );

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

    // Manejador para cambios en el título (TipTap)
    const handleTitleChange = useCallback(
      (newContent: string) => {
        if (updateComponentProps && newContent !== titleContent) {
          if ('scheduler' in window && 'postTask' in (window as any).scheduler) {
            (window as any).scheduler.postTask(
              () => {
                updateComponentProps(component.id, { titleContent: newContent });
              },
              { priority: 'user-blocking' }
            );
          } else {
            const channel = new MessageChannel();
            channel.port2.onmessage = () =>
              updateComponentProps(component.id, { titleContent: newContent });
            channel.port1.postMessage(null);
          }
        }
      },
      [updateComponentProps, component.id, titleContent]
    );

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

    // Estilos memoizados para los editores
    const titleEditorStyle = useMemo(
      () => ({
        outline: 'none',
        fontDisplay: 'swap' as const,
        textSizeAdjust: 'none',
        WebkitFontSmoothing: 'antialiased' as const,
        MozOsxFontSmoothing: 'grayscale' as const,
        fontSize: `${titleSize}px`,
        fontWeight: 'bold',
        color: displayTitleColor,
      }),
      [titleSize, displayTitleColor]
    );

    const descriptionEditorStyle = useMemo(
      () => ({
        outline: 'none',
        fontDisplay: 'swap' as const,
        textSizeAdjust: 'none',
        WebkitFontSmoothing: 'antialiased' as const,
        MozOsxFontSmoothing: 'grayscale' as const,
        fontSize: `${fontSize}px`,
        color: displayTextColor,
      }),
      [fontSize, displayTextColor]
    );

    const titleBoxStyles = useMemo(
      () => ({
        mb: 1,
        '& p': {
          margin: 0,
          color: displayTitleColor,
          fontSize: `${titleSize}px`,
          fontWeight: 'bold',
        },
      }),
      [displayTitleColor, titleSize]
    );

    const descriptionBoxStyles = useMemo(
      () => ({
        '& p': {
          margin: 0,
          color: displayTextColor,
          fontSize: `${fontSize}px`,
          lineHeight: 1.5,
        },
      }),
      [displayTextColor, fontSize]
    );

    // Determinar la dirección del layout
    const isHorizontal = layout === 'image-left' || layout === 'image-right';
    const isImageFirst = layout === 'image-left' || layout === 'image-top';

    // Renderizar imagen
    const imageElement = (
      <Box
        sx={{
          width: imageFixedWidth || (isHorizontal ? { xs: '100%', sm: `${imageWidth}%` } : '100%'),
          flexShrink: 0,
          ...(imageFixedWidth
            ? {
                maxWidth: imageFixedWidth,
                display: 'flex',
                justifyContent: 'center',
                mx: isHorizontal ? 0 : 'auto',
              }
            : {}),
        }}
      >
        <ImageUploader
          imageUrl={imageUrl}
          imageAlt={imageAlt}
          height={imageHeight}
          objectFit={imageObjectFit}
          backgroundColor={imageBackgroundColor}
          containerBackgroundColor={imageContainerBackgroundColor}
          borderRadius={borderRadius}
          width={imageFixedWidth}
          imageBorderRadius={imageBorderRadius}
          onImageClick={handleImageClick}
        />
      </Box>
    );

    // Renderizar contenido de texto
    const textElement = (
      <Box
        sx={{
          flex: 1,
        }}
      >
        {/* Título editable con TipTap */}
        <Box sx={titleBoxStyles}>
          <MemoizedTitleEditor
            content={titleContent}
            onContentChange={handleTitleChange}
            onSelectionUpdate={handleSelectionUpdateMemo}
            editorStyle={titleEditorStyle}
            isPlaceholder={placeholderActive}
            placeholderColor={DEFAULT_PLACEHOLDER_COLOR}
          />
        </Box>

        {/* Descripción editable con TipTap */}
        <Box sx={descriptionBoxStyles}>
          <MemoizedDescriptionEditor
            content={component.content || '<p>Escribe la descripción aquí...</p>'}
            onContentChange={handleDescriptionChange}
            onSelectionUpdate={handleSelectionUpdateMemo}
            editorStyle={descriptionEditorStyle}
            isPlaceholder={placeholderActive}
            placeholderColor={DEFAULT_PLACEHOLDER_COLOR}
          />
        </Box>
      </Box>
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
            p: `${padding}px`,
            border: borderWidth > 0 ? `${borderWidth}px solid ${borderColor}` : 'none',
            ...(backgroundImageUrl && {
              backgroundImage: `url(${backgroundImageUrl})`,
              backgroundSize: backgroundSize || 'cover',
              backgroundPosition: backgroundPosition || 'center',
              backgroundRepeat: backgroundRepeat || 'no-repeat',
            }),
            ...(minHeight && {
              minHeight,
              display: 'flex',
              flexDirection: 'column',
            }),
            ...(component.style || {}),
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: isHorizontal ? { xs: 'column', sm: 'row' } : 'column',
              gap: `${spacing}px`,
              alignItems: alignItems || (isHorizontal ? 'flex-start' : 'stretch'),
              ...(minHeight && {
                flex: 1,
                justifyContent: alignItems === 'center' ? 'center' : 'flex-start',
              }),
            }}
          >
            {/* Renderizar imagen y texto según el layout */}
            {isImageFirst ? (
              <>
                {imageElement}
                {textElement}
              </>
            ) : (
              <>
                {textElement}
                {imageElement}
              </>
            )}
          </Box>
        </Box>

        {/* Input oculto para archivos */}
        <input
          type="file"
          ref={imageFileInputRef}
          style={{ display: 'none' }}
          accept="image/*"
          onChange={handleImageFileChange}
        />
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

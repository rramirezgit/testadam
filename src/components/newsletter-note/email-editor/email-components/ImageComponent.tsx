import { Icon } from '@iconify/react';

import { Box, Chip } from '@mui/material';

import { CONFIG } from 'src/global-config';

import { isBase64Image } from '../utils/imageValidation';
import ComponentWithToolbar from './ComponentWithToolbar';

import type { EmailComponentProps } from './types';

interface ImageComponentData {
  src?: string;
  alt?: string;
  style?: {
    height?: string;
    backgroundColor?: string;
    objectFit?: string;
  };
}

interface ImageUploaderProps {
  data: ImageComponentData;
  onUpdate: (id: string, props: Record<string, any>) => void;
  componentId: string;
  componentStyle?: React.CSSProperties; // 🚀 NUEVO: Recibir estilos del componente
}

const ImageUploader = ({ data, componentStyle }: ImageUploaderProps) => {
  // 🚀 NUEVO: Extraer estilos del componente
  const backgroundColor =
    componentStyle?.backgroundColor || data?.style?.backgroundColor || 'transparent';
  const objectFit = componentStyle?.objectFit || data?.style?.objectFit || 'contain';
  const height = componentStyle?.height || data?.style?.height || 'auto';
  const containerBackgroundColor =
    (componentStyle as any)?.containerBackgroundColor ||
    (data?.style as any)?.containerBackgroundColor ||
    '';

  console.log('🎨 ImageComponent - Estilos:', {
    height,
    containerBackgroundColor,
    backgroundColor,
    willApplyContainerBg: height !== 'auto' && !!containerBackgroundColor,
  });

  return (
    <div
      className="image-component-wrapper"
      style={{
        position: 'relative',
        height, // ✅ Aplicar height al contenedor padre
        overflow: 'hidden',
        backgroundColor:
          height !== 'auto' && containerBackgroundColor ? containerBackgroundColor : 'transparent', // ✅ Color de fondo del contenedor
        borderRadius: '8px', // ✅ Border radius para mejor visualización
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1, // ✅ Z-index bajo para no interferir con BubbleMenu
      }}
    >
      {data.src ? (
        <Box
          sx={{
            position: 'relative',
            backgroundColor: containerBackgroundColor ? 'transparent' : backgroundColor, // ✅ No aplicar backgroundColor si hay containerBackgroundColor
            borderRadius: '8px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%', // ✅ Llenar el contenedor padre
          }}
        >
          <img
            src={data.src}
            alt={data.alt || 'Newsletter image'}
            style={{
              maxWidth: '100%',
              width: '100%',
              height: '100%', // ✅ Llenar el contenedor
              objectFit: objectFit as React.CSSProperties['objectFit'], // Se adapta según objectFit (contain/cover)
              borderRadius: '8px',
              cursor: 'pointer', // Cambiar a pointer para indicar que es clickeable
              display: 'block',
            }}
          />

          {/* Chip indicador para imágenes base64 */}
          {isBase64Image(data.src) && (
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
        <div
          style={{
            borderRadius: '8px',
            textAlign: 'center',
            cursor: 'pointer', // Cambiar a pointer para indicar que es clickeable
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <img src={CONFIG.emptyImageUrl} alt="Imagen" />
        </div>
      )}
    </div>
  );
};

const ImageComponent = ({
  component,
  index,
  isSelected,
  onSelect,
  onComponentSelect,
  updateComponentProps,
  moveComponent,
  removeComponent,
  totalComponents,
}: EmailComponentProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Usar onComponentSelect si está disponible (para componentes dentro de notas)
    if (onComponentSelect) {
      onComponentSelect(component.id);
    } else {
      // Usar onSelect para componentes normales
      onSelect();
    }
  };

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
      <ImageUploader
        data={component.props || {}}
        onUpdate={updateComponentProps}
        componentId={component.id}
        componentStyle={
          {
            ...component.style,
            ...(component.props?.style || {}),
          } as React.CSSProperties
        } // 🚀 NUEVO: Combinar estilos del componente y props
      />
    </ComponentWithToolbar>
  );
};

export default ImageComponent;

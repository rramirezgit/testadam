import Image from 'next/image';
import { Icon } from '@iconify/react';

import { Box, Chip } from '@mui/material';

import { isBase64Image } from '../utils/imageValidation';
import ComponentWithToolbar from './ComponentWithToolbar';

import type { EmailComponentProps } from './types';

interface ImageComponentData {
  src?: string;
  alt?: string;
}

interface ImageUploaderProps {
  data: ImageComponentData;
  onUpdate: (id: string, props: Record<string, any>) => void;
  componentId: string;
}

const ImageUploader = ({ data }: ImageUploaderProps) => (
  <div className="image-component-wrapper" style={{ position: 'relative' }}>
    {data.src ? (
      <Box sx={{ position: 'relative' }}>
        <img
          src={data.src}
          alt={data.alt || 'Newsletter image'}
          style={{
            maxWidth: '100%',
            borderRadius: '8px',
            cursor: 'default',
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
              zIndex: 10,
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}
          />
        )}
      </Box>
    ) : (
      <div
        style={{
          height: '270px',
          borderRadius: '8px',
          backgroundColor: 'rgba(145, 158, 171, 0.12)',
          textAlign: 'center',
          cursor: 'default',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 2,
          color: 'rgba(145, 158, 171, 0.94)',
        }}
      >
        <Image src="/assets/icons/apps/ic-empty.svg" alt="Imagen" width={40} height={40} />
        <p>Selecciona la imagen desde el panel de opciones</p>
      </div>
    )}
  </div>
);

const ImageComponent = ({
  component,
  index,
  isSelected,
  onSelect,
  updateComponentProps,
  moveComponent,
  removeComponent,
  totalComponents,
}: EmailComponentProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
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
      />
    </ComponentWithToolbar>
  );
};

export default ImageComponent;

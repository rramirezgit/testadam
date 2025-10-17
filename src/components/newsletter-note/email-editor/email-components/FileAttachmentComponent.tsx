import { Icon } from '@iconify/react';

import { Box, Chip, Typography, IconButton } from '@mui/material';

import { isBase64Image } from '../utils/imageValidation';
import ComponentWithToolbar from './ComponentWithToolbar';

import type { EmailComponentProps } from './types';

interface FileAttachmentData {
  fileUrl?: string;
  fileName?: string;
  fileType?: string; // video, audio, pdf, image, document, other
  fileSize?: string;
  description?: string;
}

interface FileDisplayProps {
  data: FileAttachmentData;
  onUpdate: (id: string, props: Record<string, any>) => void;
  componentId: string;
}

// Función para determinar el icono según el tipo de archivo
const getFileIcon = (fileType?: string): string => {
  switch (fileType) {
    case 'video':
      return 'mdi:video-box';
    case 'audio':
      return 'mdi:music-box';
    case 'pdf':
      return 'mdi:file-pdf-box';
    case 'image':
      return 'mdi:image-box';
    case 'document':
      return 'mdi:file-document';
    default:
      return 'mdi:file-box';
  }
};

// Función para determinar el color según el tipo de archivo
const getFileColor = (fileType?: string): string => {
  switch (fileType) {
    case 'video':
      return '#FF6B6B';
    case 'audio':
      return '#4ECDC4';
    case 'pdf':
      return '#FF3860';
    case 'image':
      return '#6C5CE7';
    case 'document':
      return '#0984E3';
    default:
      return '#95A5A6';
  }
};

const FileDisplay = ({ data, onUpdate, componentId }: FileDisplayProps) => (
  <Box
    sx={{
      border: '2px dashed #e0e0e0',
      borderRadius: '12px',
      padding: 3,
      backgroundColor: '#fafafa',
      transition: 'all 0.3s ease',
      '&:hover': {
        borderColor: getFileColor(data.fileType),
        backgroundColor: '#f5f5f5',
      },
    }}
  >
    {data.fileUrl ? (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        {/* Icono del tipo de archivo */}
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: '12px',
            backgroundColor: getFileColor(data.fileType),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon icon={getFileIcon(data.fileType)} style={{ fontSize: '32px', color: 'white' }} />
        </Box>

        {/* Información del archivo */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              color: '#2c3e50',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {data.fileName || 'Archivo sin nombre'}
          </Typography>

          {data.description && (
            <Typography
              variant="body2"
              sx={{
                color: '#7f8c8d',
                mt: 0.5,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {data.description}
            </Typography>
          )}

          <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
            {data.fileType && (
              <Chip
                label={data.fileType.toUpperCase()}
                size="small"
                sx={{
                  backgroundColor: getFileColor(data.fileType),
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.7rem',
                }}
              />
            )}
            {data.fileSize && (
              <Chip
                label={data.fileSize}
                size="small"
                variant="outlined"
                sx={{
                  fontSize: '0.7rem',
                }}
              />
            )}
            {/* Indicador si es base64 (temporal) */}
            {isBase64Image(data.fileUrl) && (
              <Chip
                icon={<Icon icon="mdi:cloud-upload-outline" />}
                label="Subir a S3"
                color="warning"
                size="small"
                sx={{
                  fontSize: '0.7rem',
                  backgroundColor: 'rgba(255, 152, 0, 0.9)',
                  color: 'white',
                }}
              />
            )}
          </Box>
        </Box>

        {/* Botón de descarga/visualización */}
        <IconButton
          href={data.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            backgroundColor: getFileColor(data.fileType),
            color: 'white',
            '&:hover': {
              backgroundColor: getFileColor(data.fileType),
              opacity: 0.8,
            },
          }}
        >
          <Icon icon="mdi:download" />
        </IconButton>
      </Box>
    ) : (
      <Box
        sx={{
          textAlign: 'center',
          py: 4,
        }}
      >
        <Icon
          icon="mdi:file-upload-outline"
          style={{ fontSize: '48px', color: '#bdc3c7', marginBottom: '16px' }}
        />
        <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
          Adjuntar archivo
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Sube videos, audios, PDFs, imágenes o documentos para tu storyboard
        </Typography>
      </Box>
    )}
  </Box>
);

const FileAttachmentComponent = ({ component, ...props }: EmailComponentProps) => {
  const data = (component.data as FileAttachmentData) || {};

  return (
    <ComponentWithToolbar
      component={component}
      componentType="fileAttachment"
      data={data}
      {...props}
    >
      <FileDisplay data={data} onUpdate={props.onUpdate} componentId={component.id} />
    </ComponentWithToolbar>
  );
};

export default FileAttachmentComponent;

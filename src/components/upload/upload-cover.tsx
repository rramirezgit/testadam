import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { varAlpha, mergeClasses } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { Image } from '../image';
import { Iconify } from '../iconify';
import { uploadClasses } from './classes';
import { RejectionFiles } from './components/rejection-files';

import type { UploadProps } from './types';

// ----------------------------------------------------------------------

const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="35" height="34" viewBox="0 0 35 34" fill="none">
    <path
      d="M18.6126 4.24919H11.9543C9.57407 4.24919 8.38396 4.24919 7.47484 4.71241C6.67515 5.11987 6.02498 5.77004 5.61752 6.56973C5.1543 7.47885 5.1543 8.66896 5.1543 11.0492V22.9492C5.1543 25.3294 5.1543 26.5195 5.61752 27.4286C6.02498 28.2283 6.67515 28.8785 7.47484 29.286C8.38396 29.7492 9.57407 29.7492 11.9543 29.7492H24.9876C26.3051 29.7492 26.9638 29.7492 27.5043 29.6044C28.9709 29.2114 30.1165 28.0658 30.5095 26.5992C30.6543 26.0587 30.6543 25.4 30.6543 24.0825M27.821 11.3325V2.83252M23.571 7.08252H32.071M15.7793 12.0409C15.7793 13.6057 14.5108 14.8742 12.946 14.8742C11.3812 14.8742 10.1126 13.6057 10.1126 12.0409C10.1126 10.476 11.3812 9.20752 12.946 9.20752C14.5108 9.20752 15.7793 10.476 15.7793 12.0409ZM22.1402 16.8832L10.1568 27.7773C9.48273 28.39 9.14571 28.6964 9.1159 28.9618C9.09006 29.1918 9.17827 29.42 9.35214 29.5729C9.55273 29.7492 10.0082 29.7492 10.9191 29.7492H24.2169C26.2558 29.7492 27.2752 29.7492 28.0758 29.4067C29.081 28.9767 29.8818 28.1759 30.3118 27.1707C30.6543 26.3701 30.6543 25.3506 30.6543 23.3118C30.6543 22.6258 30.6543 22.2828 30.5793 21.9634C30.4851 21.562 30.3043 21.1859 30.0497 20.8616C29.8472 20.6035 29.5793 20.3892 29.0436 19.9607L25.0809 16.7905C24.5448 16.3616 24.2767 16.1471 23.9815 16.0714C23.7213 16.0047 23.4475 16.0134 23.1921 16.0963C22.9022 16.1905 22.6482 16.4214 22.1402 16.8832Z"
      stroke="#919EAB"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export function UploadCover({
  sx,
  error,
  value,
  disabled,
  helperText,
  className,
  onRemove,
  ...other
}: UploadProps) {
  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    multiple: false,
    disabled,
    accept: { 'image/*': [] },
    ...other,
  });

  const hasFile = !!value;

  const hasError = isDragReject || !!error;

  const [preview, setPreview] = useState('');

  useEffect(() => {
    if (!value) {
      setPreview('');
    } else if (typeof value === 'string') {
      setPreview(value);
    } else if (value instanceof File) {
      const objectUrl = URL.createObjectURL(value);
      setPreview(objectUrl);

      // Cleanup object URL cuando el componente se desmonte o value cambie
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }
    return undefined;
  }, [value]);

  const handleRemove = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (onRemove && value) {
      onRemove(value as File | string);
    }
  };

  const renderPreview = () =>
    hasFile && (
      <Box sx={{ position: 'relative', width: 1, height: 1 }}>
        <Image
          alt="Cover preview"
          src={preview}
          sx={{
            width: 1,
            height: 1,
            borderRadius: '8px',
            objectFit: 'cover',
          }}
        />
        {onRemove && (
          <IconButton
            onClick={handleRemove}
            sx={{
              position: 'absolute',
              top: 4,
              right: 4,
              width: 24,
              height: 24,
              bgcolor: 'background.paper',
              boxShadow: (theme) => theme.shadows[8],
              '&:hover': {
                bgcolor: 'error.main',
                color: 'error.contrastText',
              },
            }}
          >
            <Iconify icon="mingcute:close-line" width={16} />
          </IconButton>
        )}
      </Box>
    );

  const renderPlaceholder = () => (
    <Box
      className="upload-placeholder"
      sx={(theme) => ({
        width: 1,
        height: 1,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 2,
        color: 'text.secondary',
      })}
    >
      <UploadIcon />

      <Typography variant="body2" sx={{ color: '#919EAB', textAlign: 'center' }}>
        Suelta o haz clic aquí para subir tu imagen
      </Typography>
    </Box>
  );

  const renderContent = () => (
    <Box
      sx={{
        width: 1,
        height: 1,
        overflow: 'hidden',
        borderRadius: '8px',
        position: 'relative',
      }}
    >
      {hasFile ? renderPreview() : renderPlaceholder()}
    </Box>
  );

  return (
    <>
      <Box
        {...getRootProps()}
        className={mergeClasses([uploadClasses.uploadBox, className])}
        sx={[
          (theme) => ({
            width: '100%',
            minHeight: 58,
            cursor: 'pointer',
            p: '5px 16px',
            overflow: 'hidden',
            borderRadius: '8px',
            border: `1px dashed ${varAlpha(theme.vars.palette.grey['500Channel'], 0.32)}`,
            bgcolor: varAlpha(theme.vars.palette.grey['500Channel'], 0.04),
            ...(isDragActive && {
              opacity: 0.72,
              borderColor: 'primary.main',
              bgcolor: varAlpha(theme.vars.palette.primary.mainChannel, 0.08),
            }),
            ...(disabled && { opacity: 0.48, pointerEvents: 'none' }),
            ...(hasError && {
              borderColor: 'error.main',
              bgcolor: varAlpha(theme.vars.palette.error.mainChannel, 0.08),
            }),
            '&:hover': {
              opacity: 0.88,
              borderColor: 'primary.main',
            },
          }),
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
      >
        <input {...getInputProps()} />

        {renderContent()}
      </Box>

      {helperText && helperText}

      {!!fileRejections.length && <RejectionFiles files={fileRejections} />}
    </>
  );
}

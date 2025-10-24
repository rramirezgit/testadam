'use client';

import type React from 'react';

import { Box, Typography, Chip, Paper, Skeleton } from '@mui/material';

interface TextComparisonViewProps {
  originalText: string;
  resultText: string | null;
  loading: boolean;
}

const TextComparisonView: React.FC<TextComparisonViewProps> = ({
  originalText,
  resultText,
  loading,
}) => (
  <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
    {/* Texto Original */}
    <Paper
      elevation={0}
      sx={{
        flex: resultText ? '0 0 auto' : 1,
        p: 3,
        bgcolor: 'grey.50',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        overflow: 'auto',
        maxHeight: resultText ? '200px' : 'none',
      }}
    >
      <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Chip label="Original" size="small" color="default" />
      </Box>
      <Typography
        variant="body1"
        component="div"
        sx={{
          '& p': { margin: 0, marginBottom: 1 },
          '& p:last-child': { marginBottom: 0 },
          lineHeight: 1.7,
        }}
        dangerouslySetInnerHTML={{ __html: originalText }}
      />
    </Paper>

    {/* Loading State */}
    {loading && (
      <Paper
        elevation={0}
        sx={{
          flex: 1,
          p: 3,
          bgcolor: 'background.paper',
          border: '2px solid',
          borderColor: 'primary.main',
          borderRadius: 2,
          overflow: 'auto',
        }}
      >
        <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip label="Generando..." size="small" color="primary" />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Skeleton variant="text" width="100%" height={24} animation="wave" />
          <Skeleton variant="text" width="95%" height={24} animation="wave" />
          <Skeleton variant="text" width="98%" height={24} animation="wave" />
          <Skeleton variant="text" width="92%" height={24} animation="wave" />
          <Skeleton variant="text" width="97%" height={24} animation="wave" />
          <Skeleton variant="text" width="88%" height={24} animation="wave" />
        </Box>
      </Paper>
    )}

    {/* Resultado */}
    {resultText && !loading && (
      <Paper
        elevation={0}
        sx={{
          flex: 1,
          p: 3,
          bgcolor: 'background.paper',
          border: '2px solid',
          borderColor: 'success.main',
          borderRadius: 2,
          overflow: 'auto',
          animation: 'fadeIn 0.4s ease-in',
          '@keyframes fadeIn': {
            from: { opacity: 0, transform: 'translateY(-10px)' },
            to: { opacity: 1, transform: 'translateY(0)' },
          },
        }}
      >
        <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip label="Resultado de IA" size="small" color="success" />
        </Box>
        <Typography
          variant="body1"
          component="div"
          sx={{
            '& p': { margin: 0, marginBottom: 1 },
            '& p:last-child': { marginBottom: 0 },
            lineHeight: 1.7,
          }}
          dangerouslySetInnerHTML={{ __html: resultText }}
        />
      </Paper>
    )}
  </Box>
);

export default TextComparisonView;

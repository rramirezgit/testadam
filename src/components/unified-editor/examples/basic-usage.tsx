'use client';

import React, { useState } from 'react';

import { Box, Chip, Paper, Stack, Typography } from '@mui/material';

import { UnifiedEditor, type EditorMetadata } from '../index';

// Ejemplo básico de uso
export function BasicUsageExample() {
  const [content, setContent] = useState('<p>¡Escribe algo increíble aquí!</p>');
  const [metadata, setMetadata] = useState<EditorMetadata | null>(null);

  const handleChange = (output: string, meta?: EditorMetadata) => {
    setContent(output);
    if (meta) {
      setMetadata(meta);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Editor Unificado - Ejemplo Básico
      </Typography>

      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <UnifiedEditor
          variant="standard"
          value={content}
          onChange={handleChange}
          placeholder="Escribe tu contenido aquí..."
          minHeight={300}
        />
      </Paper>

      {metadata && (
        <Paper elevation={1} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Estadísticas del Contenido
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Chip label={`${metadata.wordCount} palabras`} color="primary" />
            <Chip label={`${metadata.characterCount} caracteres`} color="secondary" />
            <Chip label={`${metadata.readingTime} min lectura`} color="info" />
            {metadata.hasImages && <Chip label="Tiene imágenes" color="success" />}
            {metadata.hasLinks && <Chip label="Tiene enlaces" color="warning" />}
          </Stack>
        </Paper>
      )}
    </Box>
  );
}

// Ejemplo para Newsletter
export function NewsletterExample() {
  const [content, setContent] = useState('');

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Editor de Newsletter
      </Typography>

      <UnifiedEditor
        variant="newsletter"
        value={content}
        onChange={(output) => setContent(output)}
        placeholder="Crea tu newsletter..."
        toolbar={{
          enabled: true,
          groups: ['format', 'color', 'align', 'insert', 'history'],
        }}
        extensions={{
          image: true,
          link: true,
          table: false,
          youtube: false,
        }}
        minHeight={400}
      />
    </Box>
  );
}

// Ejemplo para Educación
export function EducationExample() {
  const [content, setContent] = useState('');

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Editor Educativo
      </Typography>

      <UnifiedEditor
        variant="education"
        value={content}
        onChange={(output) => setContent(output)}
        placeholder="Crea contenido educativo..."
        autoSave
        autoSaveInterval={3000}
        extensions={{
          table: true,
          codeBlock: true,
          codeHighlight: true,
          youtube: true,
        }}
        minHeight={500}
      />
    </Box>
  );
}

// Ejemplo minimalista
export function MinimalExample() {
  const [content, setContent] = useState('');

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Editor Mínimo
      </Typography>

      <UnifiedEditor
        variant="minimal"
        value={content}
        onChange={(output) => setContent(output)}
        placeholder="Solo texto..."
        minHeight={150}
      />
    </Box>
  );
}

// Ejemplo de componente específico
export function ComponentExample() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Editores de Componentes
      </Typography>

      <Stack spacing={2}>
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Título (H1)
          </Typography>
          <UnifiedEditor
            variant="component"
            componentType="heading"
            headingLevel={1}
            value={title}
            onChange={(output) => setTitle(output)}
            placeholder="Escribe el título..."
            minHeight={80}
          />
        </Box>

        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Descripción
          </Typography>
          <UnifiedEditor
            variant="simple"
            value={description}
            onChange={(output) => setDescription(output)}
            placeholder="Descripción del contenido..."
            minHeight={150}
          />
        </Box>
      </Stack>
    </Box>
  );
}

// Ejemplo con configuración completa
export function AdvancedExample() {
  const [content, setContent] = useState('');
  const [metadata, setMetadata] = useState<EditorMetadata | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Editor Avanzado
      </Typography>

      <UnifiedEditor
        variant="full"
        value={content}
        onChange={(output, meta) => {
          setContent(output);
          setMetadata(meta || null);
        }}
        placeholder="Editor con todas las funcionalidades..."
        fullScreen={isFullScreen}
        autoSave
        autoSaveInterval={5000}
        outputFormat="both"
        extensions={{
          // Todas las extensiones habilitadas
          bold: true,
          italic: true,
          underline: true,
          strike: true,
          textColor: true,
          backgroundColor: true,
          fontFamily: true,
          textAlign: true,
          bulletList: true,
          orderedList: true,
          link: true,
          image: true,
          youtube: true,
          codeBlock: true,
          codeHighlight: true,
          table: true,
          blockquote: true,
          horizontalRule: true,
        }}
        toolbar={{
          enabled: true,
          position: 'top',
          sticky: true,
          groups: [
            'format',
            'color',
            'align',
            'list',
            'insert',
            'structure',
            'table',
            'code',
            'history',
            'view',
          ],
        }}
        minHeight={400}
      />

      {metadata && (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            Análisis del Contenido
          </Typography>
          <Typography variant="body2">
            📊 {metadata.wordCount} palabras • {metadata.characterCount} caracteres • ⏱️{' '}
            {metadata.readingTime} min lectura •
            {metadata.hasImages ? '🖼️ Con imágenes' : '📝 Solo texto'} •
            {metadata.hasLinks ? '🔗 Con enlaces' : '📄 Sin enlaces'}
          </Typography>
        </Box>
      )}
    </Box>
  );
}

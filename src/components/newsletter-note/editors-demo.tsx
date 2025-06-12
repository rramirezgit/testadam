'use client';

import React, { useState } from 'react';

import {
  Box,
  Grid,
  Card,
  Chip,
  Stack,
  Button,
  Switch,
  Divider,
  Typography,
  CardContent,
  FormControlLabel,
} from '@mui/material';

// Editores originales
import TiptapEditor from './tiptap-editor';
import SimpleTipTapEditor from './simple-tiptap-editor';
// Editores migrados
import TiptapEditorUnified from './tiptap-editor-unified';
import TipTapEditorComponent from './tiptap-editor-component';
import SimpleTipTapEditorUnified from './simple-tiptap-editor-unified';
import TipTapEditorComponentUnified from './tiptap-editor-component-unified';

/**
 * Componente de demostración para validar la migración de editores
 *
 * Muestra los editores originales vs migrados lado a lado
 * para validar compatibilidad y funcionalidad
 */
export default function EditorsDemo() {
  const [useUnified, setUseUnified] = useState(true);
  const [content1, setContent1] = useState('<p>Contenido del <strong>TiptapEditor</strong></p>');
  const [content2, setContent2] = useState('<p>Contenido del <em>SimpleTipTapEditor</em></p>');
  const [content3, setContent3] = useState('Título del componente');

  const [metadata, setMetadata] = useState<any>(null);

  const handleTiptapChange = (html: string, text: string) => {
    setContent1(html);
    console.log('TiptapEditor:', { html, text });
  };

  const handleSimpleChange = (html: string) => {
    setContent2(html);
    console.log('SimpleTipTapEditor:', { html });
  };

  const handleComponentChange = (text: string) => {
    setContent3(text);
    console.log('TipTapEditorComponent:', { text });
  };

  const handleUnifiedChange = (output: string, meta?: any) => {
    setContent1(output);
    setMetadata(meta);
    console.log('UnifiedEditor:', { output, meta });
  };

  const resetContent = () => {
    setContent1('<p>Contenido reseteado</p>');
    setContent2('<p>Contenido reseteado</p>');
    setContent3('Título reseteado');
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1400, mx: 'auto' }}>
      <Stack spacing={3}>
        {/* Header */}
        <Box>
          <Typography variant="h4" gutterBottom>
            🔄 Demo de Migración - Editores Newsletter
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Comparación lado a lado de editores originales vs migrados
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center">
            <FormControlLabel
              control={
                <Switch checked={useUnified} onChange={(e) => setUseUnified(e.target.checked)} />
              }
              label={useUnified ? '✅ Editores Unificados' : '⚠️ Editores Originales'}
            />
            <Button variant="outlined" onClick={resetContent} size="small">
              🔄 Reset Contenido
            </Button>
          </Stack>
        </Box>

        <Divider />

        {/* Demos de Editores */}
        <Grid container spacing={3}>
          {/* TiptapEditor */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Stack spacing={2}>
                  <Typography variant="h6">
                    📝 TiptapEditor
                    <Chip
                      label={useUnified ? 'Unified' : 'Original'}
                      color={useUnified ? 'success' : 'warning'}
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  </Typography>

                  <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 1 }}>
                    {useUnified ? (
                      <TiptapEditorUnified content={content1} onChange={handleUnifiedChange} />
                    ) : (
                      <TiptapEditor content={content1} onChange={handleTiptapChange} />
                    )}
                  </Box>

                  <Typography variant="caption" color="text.secondary">
                    Características: HTML + texto, callback onSelectionUpdate
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* SimpleTipTapEditor */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Stack spacing={2}>
                  <Typography variant="h6">
                    ✏️ SimpleTipTapEditor
                    <Chip
                      label={useUnified ? 'Unified' : 'Original'}
                      color={useUnified ? 'success' : 'warning'}
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  </Typography>

                  <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1 }}>
                    {useUnified ? (
                      <SimpleTipTapEditorUnified
                        content={content2}
                        onChange={handleSimpleChange}
                        placeholder="Placeholder unificado..."
                      />
                    ) : (
                      <SimpleTipTapEditor
                        content={content2}
                        onChange={handleSimpleChange}
                        placeholder="Placeholder original..."
                      />
                    )}
                  </Box>

                  <Typography variant="caption" color="text.secondary">
                    Características: Simple, placeholder, Material-UI Box
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* TipTapEditorComponent */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Stack spacing={2}>
                  <Typography variant="h6">
                    🎨 TipTapEditorComponent
                    <Chip
                      label={useUnified ? 'Unified' : 'Original'}
                      color={useUnified ? 'success' : 'warning'}
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  </Typography>

                  <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 1 }}>
                    {useUnified ? (
                      <TipTapEditorComponentUnified
                        content={content3}
                        onChange={handleComponentChange}
                        editorType="heading"
                        headingLevel={2}
                        showToolbar
                      />
                    ) : (
                      <TipTapEditorComponent
                        content={content3}
                        onChange={handleComponentChange}
                        editorType="heading"
                        headingLevel={2}
                        showToolbar
                      />
                    )}
                  </Box>

                  <Typography variant="caption" color="text.secondary">
                    Características: Tipos de componente, toolbar configurable
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Metadata Display (solo para unified) */}
        {useUnified && metadata && (
          <Card sx={{ bgcolor: 'success.light', color: 'success.contrastText' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📊 Metadata Automática (Nueva Funcionalidad)
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6, md: 3 }}>
                  <Typography variant="caption">Palabras</Typography>
                  <Typography variant="h6">{metadata.wordCount}</Typography>
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                  <Typography variant="caption">Caracteres</Typography>
                  <Typography variant="h6">{metadata.characterCount}</Typography>
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                  <Typography variant="caption">Tiempo lectura</Typography>
                  <Typography variant="h6">{metadata.readingTime} min</Typography>
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                  <Typography variant="caption">Estado</Typography>
                  <Typography variant="h6">
                    {metadata.isEmpty ? '🆕 Vacío' : '✅ Con contenido'}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Comparison Table */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              📋 Comparación de Funcionalidades
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <Typography variant="subtitle2" color="warning.main">
                  🔧 Editores Originales
                </Typography>
                <Stack spacing={1}>
                  <Typography variant="body2">• 3 archivos separados (~250 líneas)</Typography>
                  <Typography variant="body2">• Configuración manual de extensiones</Typography>
                  <Typography variant="body2">• Sin metadata automática</Typography>
                  <Typography variant="body2">• Toolbars básicas</Typography>
                  <Typography variant="body2">• Estilos inconsistentes</Typography>
                </Stack>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="subtitle2" color="success.main">
                  ✨ Editores Unificados
                </Typography>
                <Stack spacing={1}>
                  <Typography variant="body2">• 3 archivos migrados (~100 líneas)</Typography>
                  <Typography variant="body2">• Configuración automática por variante</Typography>
                  <Typography variant="body2">
                    • Metadata automática (palabras, tiempo, etc.)
                  </Typography>
                  <Typography variant="body2">• Toolbars mejoradas y consistentes</Typography>
                  <Typography variant="body2">• Estilos Material-UI unificados</Typography>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              🚀 Próximos Pasos
            </Typography>
            <Typography variant="body2">
              1. ✅ <strong>Newsletter completada</strong> - Editores migrados con éxito
              <br />
              2. ⏳ <strong>Educación</strong> - Migrar ExtendedTipTapEditor
              <br />
              3. ⏳ <strong>General</strong> - Migrar Editor principal
              <br />
              4. ⏳ <strong>Optimización</strong> - Bundle analysis y limpieza
            </Typography>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}

'use client';

import React, { useState } from 'react';

import { Box, Card, Chip, Alert, Divider, Typography, CardContent } from '@mui/material';

import { useFeatureFlags } from '../../hooks/use-feature-flags';
// Editor migrado con feature flags
import ExtendedTipTapEditorWithFlags from './extended-tiptap-editor-with-flags';

export default function EducacionFeatureFlagsDemo() {
  const flags = useFeatureFlags();
  const [content1, setContent1] = useState(
    '<h2>🎓 Demo Educación - Feature Flags</h2><p>Este editor educativo usa <strong>feature flags</strong> para decidir automáticamente entre la versión original y la unificada.</p><p>Incluye <em>funcionalidades avanzadas</em> como headings, colores, y alineación.</p>'
  );
  const [content2, setContent2] = useState(
    '<h3 style="color: #1976d2;">Contenido de Heading</h3><p>Este es un ejemplo de heading con color personalizado.</p>'
  );

  return (
    <Box sx={{ p: 3, maxWidth: 1400, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        🎓 Demo: Educación Feature Flags - ExtendedTiptapEditor
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Demo en vivo del sistema de feature flags implementado para el módulo de Educación. El
        ExtendedTiptapEditor cambia automáticamente entre versión original y unificada según la
        configuración.
      </Typography>

      {/* Estado actual de feature flags para educación */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            📊 Estado Feature Flags - Educación
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
            <Chip label={`Ambiente: ${process.env.NODE_ENV}`} color="primary" variant="outlined" />
            <Chip
              label={`ExtendedTiptapEditor: ${flags.useUnifiedExtendedTiptapEditor ? 'Unificado' : 'Original'}`}
              color={flags.useUnifiedExtendedTiptapEditor ? 'success' : 'default'}
              variant={flags.useUnifiedExtendedTiptapEditor ? 'filled' : 'outlined'}
            />
            <Chip
              label={`Metadata: ${flags.enableEditorMetadata ? 'ON' : 'OFF'}`}
              color={flags.enableEditorMetadata ? 'info' : 'default'}
              variant="outlined"
            />
            <Chip
              label={`AutoSave: ${flags.enableAutoSave ? 'ON' : 'OFF'}`}
              color={flags.enableAutoSave ? 'warning' : 'default'}
              variant="outlined"
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Editores Educación:
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Chip
                  size="small"
                  label={`ExtendedTiptapEditor: ${flags.useUnifiedExtendedTiptapEditor ? 'Unificado' : 'Original'}`}
                  color={flags.useUnifiedExtendedTiptapEditor ? 'success' : 'default'}
                />
                <Chip
                  size="small"
                  label={`EducacionEditor: ${flags.useUnifiedEducacionEditor ? 'Unificado' : 'Original'}`}
                  color={flags.useUnifiedEducacionEditor ? 'success' : 'default'}
                />
              </Box>
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Funcionalidades:
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Chip
                  size="small"
                  label={`A/B Testing: ${flags.enableABTesting ? 'ON' : 'OFF'}`}
                  color={flags.enableABTesting ? 'info' : 'default'}
                />
                <Chip size="small" label="Rollback < 5min" color="warning" variant="outlined" />
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Alert de migración en progreso */}
      <Alert severity="success" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>✅ Fase 2 - Educación:</strong> ExtendedTiptapEditor ha sido migrado exitosamente
          con feature flags. La migración de educacion-editor.tsx (5 instancias) está completa y
          funcionando en producción.
        </Typography>
      </Alert>

      {/* Demo de editores */}
      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', lg: 'row' } }}>
        {/* ExtendedTiptapEditor Modo Párrafo */}
        <Box sx={{ flex: 1 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  color: flags.useUnifiedExtendedTiptapEditor ? 'success.main' : 'text.primary',
                }}
              >
                📝 ExtendedTiptapEditor - Modo Párrafo
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Estado: {flags.useUnifiedExtendedTiptapEditor ? '✅ Unificado' : '❌ Original'}
                {flags.enableEditorMetadata && ' | 📊 Metadata ON'}
              </Typography>

              <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 1 }}>
                <ExtendedTipTapEditorWithFlags
                  content={content1}
                  onChange={(newContent) => setContent1(newContent)}
                  placeholder="Escribe contenido educativo..."
                  showDebugInfo
                  isHeading={false}
                />
              </Box>

              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Editor usado en componentes de párrafo del módulo educativo
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* ExtendedTiptapEditor Modo Heading */}
        <Box sx={{ flex: 1 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  color: flags.useUnifiedExtendedTiptapEditor ? 'success.main' : 'text.primary',
                }}
              >
                🎯 ExtendedTiptapEditor - Modo Heading
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Estado: {flags.useUnifiedExtendedTiptapEditor ? '✅ Unificado' : '❌ Original'}
                {flags.enableEditorMetadata && ' | 📊 Metadata ON'}
              </Typography>

              <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 1 }}>
                <ExtendedTipTapEditorWithFlags
                  content={content2}
                  onChange={(newContent) => setContent2(newContent)}
                  placeholder="Escribe un título..."
                  showDebugInfo
                  isHeading
                  headingLevel={3}
                />
              </Box>

              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Editor usado en componentes de heading del módulo educativo (H3)
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Componentes migrados */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            ✅ Migración Fase 2 - Educación Completada
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Los siguientes componentes del módulo de Educación han sido migrados con feature flags:
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                ✅ Archivo Principal:
              </Typography>
              <ul>
                <li>educacion-editor.tsx (5 instancias migradas)</li>
                <li>ExtendedTipTapEditorWithFlags</li>
              </ul>
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                ✅ Características:
              </Typography>
              <ul>
                <li>Modo párrafo y heading</li>
                <li>Colores y estilos avanzados</li>
                <li>Metadata automática</li>
                <li>Debug mode visual</li>
              </ul>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="body2" color="text.secondary">
            <strong>Siguiente paso:</strong> Continuar con Fase 3: Editor Principal para completar
            la migración de todos los módulos de Adam-Pro.
          </Typography>
        </CardContent>
      </Card>

      {/* Instrucciones para testing */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            🧪 Testing Educación
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Para testear diferentes configuraciones en el módulo de Educación:
          </Typography>

          <Box
            component="pre"
            sx={{
              p: 2,
              backgroundColor: 'grey.100',
              borderRadius: 1,
              fontSize: '0.875rem',
              overflow: 'auto',
            }}
          >
            {`// Variables de entorno específicas:
NEXT_PUBLIC_USE_UNIFIED_EXTENDED_TIPTAP_EDITOR=true/false
NEXT_PUBLIC_USE_UNIFIED_EDUCACION_EDITOR=true/false
NEXT_PUBLIC_ENABLE_AUTO_SAVE=true/false

// Demo de educación:
/educacion/feature-flags-demo

// Editor educativo:
/educacion-editor

// Dashboard administrativo:
/admin/feature-flags`}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

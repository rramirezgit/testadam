'use client';

import React, { useState } from 'react';

import { Box, Card, Chip, Alert, Divider, Typography, CardContent } from '@mui/material';

// Editores migrados con feature flags
import TiptapEditorWithFlags from './tiptap-editor-with-flags';
import { useFeatureFlags } from '../../hooks/use-feature-flags';
import SimpleTipTapEditorWithFlags from './simple-tiptap-editor-with-flags';

export default function FeatureFlagsDemo() {
  const flags = useFeatureFlags();
  const [content1, setContent1] = useState(
    '<h2>🚀 Demo Feature Flags</h2><p>Este editor usa <strong>feature flags</strong> para decidir automáticamente qué versión mostrar.</p>'
  );
  const [content2, setContent2] = useState(
    '<p>Editor simple con <em>funcionalidad básica</em> y feature flags.</p>'
  );

  return (
    <Box sx={{ p: 3, maxWidth: 1400, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        🎛️ Demo: Sistema de Feature Flags - Newsletter Editores
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Demo en vivo del sistema de feature flags implementado. Los editores cambian automáticamente
        entre versión original y unificada según la configuración.
      </Typography>

      {/* Estado actual de feature flags */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            📊 Estado Actual de Feature Flags
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
            <Chip label={`Ambiente: ${process.env.NODE_ENV}`} color="primary" variant="outlined" />
            <Chip
              label={`A/B Testing: ${flags.enableABTesting ? 'ON' : 'OFF'}`}
              color={flags.enableABTesting ? 'success' : 'default'}
              variant="outlined"
            />
            <Chip
              label={`Metadata: ${flags.enableEditorMetadata ? 'ON' : 'OFF'}`}
              color={flags.enableEditorMetadata ? 'info' : 'default'}
              variant="outlined"
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Newsletter Editores:
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Chip
                  size="small"
                  label={`TiptapEditor: ${flags.useUnifiedTiptapEditor ? 'Unificado' : 'Original'}`}
                  color={flags.useUnifiedTiptapEditor ? 'success' : 'default'}
                />
                <Chip
                  size="small"
                  label={`SimpleTiptapEditor: ${flags.useUnifiedSimpleTiptapEditor ? 'Unificado' : 'Original'}`}
                  color={flags.useUnifiedSimpleTiptapEditor ? 'success' : 'default'}
                />
                <Chip
                  size="small"
                  label={`TiptapEditorComponent: ${flags.useUnifiedTiptapEditorComponent ? 'Unificado' : 'Original'}`}
                  color={flags.useUnifiedTiptapEditorComponent ? 'success' : 'default'}
                />
              </Box>
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Otros Módulos:
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Chip
                  size="small"
                  label={`Educación: ${flags.useUnifiedExtendedTiptapEditor ? 'Unificado' : 'Original'}`}
                  color={flags.useUnifiedExtendedTiptapEditor ? 'success' : 'default'}
                />
                <Chip
                  size="small"
                  label={`Editor Principal: ${flags.useUnifiedMainEditor ? 'Unificado' : 'Original'}`}
                  color={flags.useUnifiedMainEditor ? 'success' : 'default'}
                />
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Alert de configuración actual */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Configuración actual:</strong> En desarrollo, los feature flags están configurados
          para usar versiones unificadas por defecto. En producción, comenzarían con versiones
          originales y rollout gradual.
        </Typography>
      </Alert>

      {/* Demo de editores */}
      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', lg: 'row' } }}>
        {/* TiptapEditor con Feature Flags */}
        <Box sx={{ flex: 1 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  color: flags.useUnifiedTiptapEditor ? 'success.main' : 'text.primary',
                }}
              >
                📝 TiptapEditor con Feature Flags
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Estado: {flags.useUnifiedTiptapEditor ? '✅ Unificado' : '❌ Original'}
              </Typography>

              <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                <TiptapEditorWithFlags
                  content={content1}
                  onChange={(newContent) => setContent1(newContent)}
                  showDebugInfo
                />
              </Box>

              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Este editor usa TiptapEditorWithFlags que decide automáticamente qué versión mostrar
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* SimpleTipTapEditor con Feature Flags */}
        <Box sx={{ flex: 1 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  color: flags.useUnifiedSimpleTiptapEditor ? 'success.main' : 'text.primary',
                }}
              >
                ✨ SimpleTipTapEditor con Feature Flags
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Estado: {flags.useUnifiedSimpleTiptapEditor ? '✅ Unificado' : '❌ Original'}
              </Typography>

              <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                <SimpleTipTapEditorWithFlags
                  content={content2}
                  onChange={(newContent) => setContent2(newContent)}
                  placeholder="Escribe contenido simple..."
                  showDebugInfo
                />
              </Box>

              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Este editor usa SimpleTipTapEditorWithFlags - usado en componentes Newsletter
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Migración completada */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            ✅ Fase 1 - Newsletter: Migración Completada
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Los siguientes componentes Newsletter han sido migrados con feature flags:
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                ✅ Componentes Email:
              </Typography>
              <ul>
                <li>HeadingComponent.tsx</li>
                <li>ButtonComponent.tsx</li>
                <li>ParagraphComponent.tsx</li>
                <li>SummaryComponent.tsx</li>
              </ul>
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                ✅ Editores Core:
              </Typography>
              <ul>
                <li>TiptapEditorWithFlags</li>
                <li>SimpleTipTapEditorWithFlags</li>
                <li>newsletter-content-editor.tsx</li>
              </ul>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="body2" color="text.secondary">
            <strong>Próximo paso:</strong> Deploy a staging con A/B testing al 25% y monitoreo de
            métricas. Rollout gradual en producción: 10% → 25% → 50%.
          </Typography>
        </CardContent>
      </Card>

      {/* Instrucciones para testing */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            🧪 Testing del Sistema
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Para testear diferentes configuraciones de feature flags:
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
            {`// Variables de entorno para testing:
NEXT_PUBLIC_USE_UNIFIED_TIPTAP_EDITOR=true/false
NEXT_PUBLIC_USE_UNIFIED_SIMPLE_TIPTAP_EDITOR=true/false
NEXT_PUBLIC_ENABLE_EDITOR_METADATA=true/false

// Dashboard administrativo:
/admin/feature-flags

// En desarrollo: Modificar flags en:
src/config/feature-flags.ts > developmentFlags`}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

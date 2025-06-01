'use client';

import React, { useState } from 'react';

import {
  Box,
  Card,
  Chip,
  Alert,
  Switch,
  Divider,
  Typography,
  CardContent,
  FormControlLabel,
} from '@mui/material';

// Editor migrado con feature flags
import { EditorWithFlags } from './editor-with-flags';
import { useFeatureFlags } from '../../hooks/use-feature-flags';

const defaultContent = `
<h2>🚀 Demo Editor Principal - Feature Flags</h2>
<p>Este es el <strong>editor principal</strong> del proyecto Adam-Pro con todas las funcionalidades:</p>
<ul>
  <li><em>Formato completo</em> (bold, italic, underline, strike)</li>
  <li><u>Headings</u> H1-H6</li>
  <li>Listas ordenadas y desordenadas</li>
  <li>Alineación de texto</li>
  <li><code>Código inline</code> y bloques de código</li>
</ul>
<blockquote>
  <p>Comparando editor original vs unificado para validar funcionalidad idéntica</p>
</blockquote>
<pre><code class="language-javascript">// Ejemplo de código con syntax highlighting
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));</code></pre>
`;

export default function MainEditorFeatureFlagsDemo() {
  const flags = useFeatureFlags();
  const [content1, setContent1] = useState(defaultContent);
  const [content2, setContent2] = useState(defaultContent);
  const [fullItem, setFullItem] = useState(true);
  const [editable, setEditable] = useState(true);

  return (
    <Box sx={{ p: 3, maxWidth: 1400, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        📝 Demo: Editor Principal Feature Flags
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Demo en vivo del sistema de feature flags implementado para el Editor Principal del sistema.
        Este editor incluye todas las funcionalidades avanzadas: fullscreen, syntax highlighting,
        toolbar completa, y más.
      </Typography>

      {/* Estado actual de feature flags para Editor Principal */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            📊 Estado Feature Flags - Editor Principal
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
            <Chip label={`Ambiente: ${process.env.NODE_ENV}`} color="primary" variant="outlined" />
            <Chip
              label={`MainEditor: ${flags.useUnifiedMainEditor ? 'Unificado' : 'Original'}`}
              color={flags.useUnifiedMainEditor ? 'success' : 'default'}
              variant={flags.useUnifiedMainEditor ? 'filled' : 'outlined'}
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
            <Chip
              label={`Advanced Toolbar: ${flags.enableAdvancedToolbar ? 'ON' : 'OFF'}`}
              color={flags.enableAdvancedToolbar ? 'secondary' : 'default'}
              variant="outlined"
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Editores Principales:
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Chip
                  size="small"
                  label={`MainEditor: ${flags.useUnifiedMainEditor ? 'Unificado' : 'Original'}`}
                  color={flags.useUnifiedMainEditor ? 'success' : 'default'}
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
                Funcionalidades:
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Chip
                  size="small"
                  label={`Fullscreen Mode: ${fullItem ? 'ON' : 'OFF'}`}
                  color={fullItem ? 'info' : 'default'}
                />
                <Chip size="small" label="Syntax Highlighting" color="warning" variant="outlined" />
                <Chip size="small" label="Rollback < 5min" color="error" variant="outlined" />
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Alert de migración en progreso */}
      <Alert severity="success" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>✅ Fase 3 - Editor Principal:</strong> EditorWithFlags ha sido migrado
          exitosamente con feature flags. La migración de los componentes principales (mail-compose,
          mail-details, examples) está completa y funcionando en producción.
        </Typography>
      </Alert>

      {/* Controles del demo */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            🎛️ Controles del Demo
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            <FormControlLabel
              control={
                <Switch checked={fullItem} onChange={(e) => setFullItem(e.target.checked)} />
              }
              label="Full Item (toolbar completa)"
            />
            <FormControlLabel
              control={
                <Switch checked={editable} onChange={(e) => setEditable(e.target.checked)} />
              }
              label="Editable"
            />
          </Box>
        </CardContent>
      </Card>

      {/* Demo de editores */}
      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', lg: 'row' } }}>
        {/* Editor Principal Modo Normal */}
        <Box sx={{ flex: 1 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  color: flags.useUnifiedMainEditor ? 'success.main' : 'text.primary',
                }}
              >
                📝 Editor Principal - Modo Normal
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Estado: {flags.useUnifiedMainEditor ? '✅ Unificado' : '❌ Original'} | FullItem:{' '}
                {fullItem ? 'ON' : 'OFF'} |{flags.enableEditorMetadata && ' 📊 Metadata ON |'}
                {flags.enableAdvancedToolbar && ' 🔧 Advanced Toolbar'}
              </Typography>

              <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                <EditorWithFlags
                  value={content1}
                  onChange={(value) => setContent1(value)}
                  placeholder="Escribe contenido con todas las funcionalidades..."
                  showDebugInfo
                  fullItem={fullItem}
                  editable={editable}
                  sx={{ maxHeight: 400 }}
                />
              </Box>

              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Editor usado en aplicaciones principales del sistema
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Editor Principal Modo Compacto */}
        <Box sx={{ flex: 1 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  color: flags.useUnifiedMainEditor ? 'success.main' : 'text.primary',
                }}
              >
                🎯 Editor Principal - Modo Compacto
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Estado: {flags.useUnifiedMainEditor ? '✅ Unificado' : '❌ Original'} | FullItem:
                OFF |{flags.enableEditorMetadata && ' 📊 Metadata ON |'}
                Compacto para emails/replies
              </Typography>

              <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                <EditorWithFlags
                  value={content2}
                  onChange={(value) => setContent2(value)}
                  placeholder="Respuesta rápida..."
                  showDebugInfo
                  fullItem={false}
                  editable={editable}
                  sx={{ maxHeight: 300 }}
                />
              </Box>

              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Editor usado en mail-compose, replies, y forms compactos
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Componentes migrados */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            ✅ Migración Fase 3 - Editor Principal Completada
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Los siguientes componentes del Editor Principal han sido migrados con feature flags:
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                ✅ Archivos Migrados:
              </Typography>
              <ul>
                <li>mail-compose.tsx</li>
                <li>mail-details.tsx</li>
                <li>examples/editor-view.tsx</li>
                <li>EditorWithFlags wrapper</li>
              </ul>
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                ✅ Funcionalidades Preservadas:
              </Typography>
              <ul>
                <li>Fullscreen mode + backdrop</li>
                <li>Syntax highlighting</li>
                <li>Toolbar completa/compacta</li>
                <li>Material-UI theming</li>
                <li>Portal management</li>
                <li>Error states</li>
              </ul>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="body2" color="text.secondary">
            <strong>Logro importante:</strong> El Editor Principal es el más complejo del sistema
            con fullscreen, syntax highlighting, y todas las funcionalidades avanzadas. Su migración
            exitosa demuestra la robustez del sistema de feature flags.
          </Typography>
        </CardContent>
      </Card>

      {/* Instrucciones para testing */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            🧪 Testing Editor Principal
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Para testear diferentes configuraciones del Editor Principal:
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
NEXT_PUBLIC_USE_UNIFIED_MAIN_EDITOR=true/false
NEXT_PUBLIC_USE_UNIFIED_TIPTAP_EDITOR_COMPONENT=true/false
NEXT_PUBLIC_ENABLE_ADVANCED_TOOLBAR=true/false
NEXT_PUBLIC_ENABLE_AUTO_SAVE=true/false

// Rutas de testing:
/editor/main-editor-feature-flags-demo   // Demo específico
/examples/extra/editor                   // Editor examples
/mail/compose                            // Mail compose
/mail/details                            // Mail details

// Dashboard administrativo:
/admin/feature-flags`}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

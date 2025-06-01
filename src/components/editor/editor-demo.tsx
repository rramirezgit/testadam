'use client';

import React, { useState } from 'react';

import { Box, Card, Switch, Typography, CardContent, FormControlLabel } from '@mui/material';

import { Editor } from './editor';
import { EditorUnified } from './editor-unified';

export default function EditorDemo() {
  const [content1, setContent1] = useState(`
    <h2>🚀 Demo del Editor Principal</h2>
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
  `);

  const [content2, setContent2] = useState(content1);
  const [fullItem, setFullItem] = useState(true);
  const [editable, setEditable] = useState(true);

  return (
    <Box sx={{ p: 3, maxWidth: 1400, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        📝 Demo: Editor Principal - Original vs Unificado
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Compara el editor principal original con la versión unificada. Ambos editores deben
        comportarse de manera idéntica con todas las funcionalidades avanzadas.
      </Typography>

      {/* Controles */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Configuración de Demo
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

      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', lg: 'row' } }}>
        {/* Editor Original */}
        <Box sx={{ flex: 1 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: 'error.main' }}>
                📝 Editor Original
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Editor principal actual del proyecto con todas las extensiones
              </Typography>
              <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                <Editor
                  value={content1}
                  onChange={(value) => setContent1(value)}
                  placeholder="Escribe contenido increíble..."
                  editable={editable}
                  fullItem={fullItem}
                  sx={{
                    minHeight: 400,
                    '& .tiptap': {
                      minHeight: 350,
                    },
                  }}
                />
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Palabras:{' '}
                {
                  content1
                    .replace(/<[^>]*>/g, '')
                    .split(' ')
                    .filter(Boolean).length
                }
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Editor Unificado */}
        <Box sx={{ flex: 1 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: 'success.main' }}>
                ✨ Editor Unificado
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                EditorUnified con arquitectura unificada y metadata automática
              </Typography>
              <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                <EditorUnified
                  value={content2}
                  onChange={(value) => setContent2(value)}
                  placeholder="Escribe contenido increíble..."
                  editable={editable}
                  fullItem={fullItem}
                  sx={{
                    minHeight: 400,
                    '& .ProseMirror': {
                      minHeight: '350px !important',
                    },
                  }}
                />
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Palabras:{' '}
                {
                  content2
                    .replace(/<[^>]*>/g, '')
                    .split(' ')
                    .filter(Boolean).length
                }
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Comparación de Output */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            🔍 Comparación de Output HTML
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', lg: 'row' } }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ color: 'error.main' }}>
                HTML Original:
              </Typography>
              <Box
                component="pre"
                sx={{
                  p: 2,
                  backgroundColor: 'grey.100',
                  borderRadius: 1,
                  fontSize: '0.75rem',
                  overflow: 'auto',
                  maxHeight: 200,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {content1}
              </Box>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ color: 'success.main' }}>
                HTML Unificado:
              </Typography>
              <Box
                component="pre"
                sx={{
                  p: 2,
                  backgroundColor: 'grey.100',
                  borderRadius: 1,
                  fontSize: '0.75rem',
                  overflow: 'auto',
                  maxHeight: 200,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {content2}
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              mt: 2,
              p: 2,
              backgroundColor: content1 === content2 ? 'success.light' : 'warning.light',
              borderRadius: 1,
            }}
          >
            <Typography variant="body2" sx={{ color: 'text.primary' }}>
              <strong>Estado:</strong>{' '}
              {content1 === content2 ? '✅ Contenidos idénticos' : '⚠️ Contenidos diferentes'}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Funcionalidades del Editor Principal */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            🎯 Funcionalidades del Editor Principal
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Formato Avanzado
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Negrita, cursiva, subrayado, tachado
                <br />
                • Headings H1-H6 dinámicos
                <br />
                • Alineación completa (left, center, right, justify)
                <br />• Listas ordenadas y desordenadas
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Contenido Multimedia
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Links con autolink
                <br />
                • Imágenes con upload
                <br />
                • Blockquotes estilizadas
                <br />• Líneas horizontales (HR)
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Código y Avanzado
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Código inline resaltado
                <br />
                • Code blocks con syntax highlighting
                <br />
                • Modo fullscreen
                <br />• Undo/Redo completo
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Ventajas del Editor Unificado */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            🚀 Ventajas del Editor Unificado
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" gutterBottom color="success.main">
                Performance
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Memoización automática
                <br />
                • Render optimizado
                <br />
                • Menos re-renders
                <br />• Bundle size reducido
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" gutterBottom color="success.main">
                Funcionalidad
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Metadata automática
                <br />
                • Análisis de contenido
                <br />
                • Auto-save configurable
                <br />• APIs consistentes
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" gutterBottom color="success.main">
                Mantenimiento
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Configuración centralizada
                <br />
                • TypeScript completo
                <br />
                • Testing simplificado
                <br />• Escalabilidad futura
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

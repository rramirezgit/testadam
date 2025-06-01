'use client';

import React, { useState } from 'react';

import { Box, Card, Switch, Typography, CardContent, FormControlLabel } from '@mui/material';

import ExtendedTipTapEditor from './extended-tiptap-editor';
import ExtendedTipTapEditorUnified from './extended-tiptap-editor-unified';

export default function ExtendedEditorDemo() {
  const [content1, setContent1] = useState(
    '<h2>Introducción a la Programación</h2><p>La programación es el <strong>arte</strong> y la <em>ciencia</em> de crear instrucciones para que las computadoras ejecuten tareas específicas.</p>'
  );
  const [content2, setContent2] = useState(content1);
  const [useUnified, setUseUnified] = useState(false);
  const [isHeading, setIsHeading] = useState(false);
  const [headingLevel, setHeadingLevel] = useState(2);

  const handleSelectionUpdate = (editor: any, version: string) => {
    console.log(`Selection updated in ${version}:`, {
      isEmpty: editor.isEmpty,
      isFocused: editor.isFocused,
      selection: editor.state.selection,
    });
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        🎓 Demo: ExtendedTipTapEditor - Original vs Unificado
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Compara el editor original de educación con la versión unificada. Ambos editores deben
        comportarse de manera idéntica.
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
                <Switch checked={useUnified} onChange={(e) => setUseUnified(e.target.checked)} />
              }
              label="Usar Editor Unificado"
            />
            <FormControlLabel
              control={
                <Switch checked={isHeading} onChange={(e) => setIsHeading(e.target.checked)} />
              }
              label="Modo Heading"
            />
            {isHeading && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2">Nivel:</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {[1, 2, 3, 4, 5, 6].map((level) => (
                    <Box
                      key={level}
                      component="button"
                      onClick={() => setHeadingLevel(level)}
                      sx={{
                        px: 1,
                        py: 0.5,
                        border: '1px solid',
                        borderColor: headingLevel === level ? 'primary.main' : 'divider',
                        backgroundColor: headingLevel === level ? 'primary.main' : 'transparent',
                        color: headingLevel === level ? 'white' : 'text.primary',
                        borderRadius: 1,
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        '&:hover': {
                          backgroundColor: headingLevel === level ? 'primary.dark' : 'action.hover',
                        },
                      }}
                    >
                      H{level}
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
        {/* Editor Original */}
        <Box sx={{ flex: 1 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: 'error.main' }}>
                📝 Editor Original
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                ExtendedTipTapEditor actual del proyecto
              </Typography>
              <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                <ExtendedTipTapEditor
                  content={content1}
                  onChange={setContent1}
                  placeholder="Escribe contenido educativo..."
                  onSelectionUpdate={(editor) => handleSelectionUpdate(editor, 'original')}
                  isHeading={isHeading}
                  headingLevel={headingLevel}
                  style={{ minHeight: 200 }}
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
                ExtendedTipTapEditorUnified con metadata automática
              </Typography>
              <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                <ExtendedTipTapEditorUnified
                  content={content2}
                  onChange={setContent2}
                  placeholder="Escribe contenido educativo..."
                  onSelectionUpdate={(editor) => handleSelectionUpdate(editor, 'unified')}
                  isHeading={isHeading}
                  headingLevel={headingLevel}
                  style={{ minHeight: 200 }}
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
            🔍 Comparación de Output
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
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

      {/* Funcionalidades Específicas de Educación */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            🎓 Funcionalidades de Educación
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Formato de Texto
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Negrita, cursiva, subrayado
                <br />
                • Colores personalizados
                <br />
                • Familias de fuentes
                <br />• Alineación de texto
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Estructura
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Headings automáticos
                <br />
                • Listas ordenadas/desordenadas
                <br />
                • Enlaces educativos
                <br />• Citas y referencias
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Mejoras Unificadas
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Metadata automática
                <br />
                • Análisis de legibilidad
                <br />
                • Toolbar optimizada
                <br />• Mejor performance
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

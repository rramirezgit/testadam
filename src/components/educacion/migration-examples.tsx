'use client';

import React, { useState } from 'react';

import { Box, Card, Chip, Typography, CardContent } from '@mui/material';

import ExtendedTipTapEditor from './extended-tiptap-editor';
import ExtendedTipTapEditorUnified from './extended-tiptap-editor-unified';

// Ejemplo para componente heading
export function HeadingMigrationExample() {
  const [content, setContent] = useState('Título de ejemplo para educación');
  const [level, setLevel] = useState(2);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          🏷️ Migración: Componente Heading
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Selecciona nivel de heading:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            {[1, 2, 3, 4, 5, 6].map((h) => (
              <Chip
                key={h}
                label={`H${h}`}
                variant={level === h ? 'filled' : 'outlined'}
                onClick={() => setLevel(h)}
                color="primary"
                size="small"
              />
            ))}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" gutterBottom color="error">
              ❌ Original
            </Typography>
            <Box sx={{ border: '1px solid #ddd', borderRadius: 1 }}>
              <ExtendedTipTapEditor
                content={content}
                onChange={setContent}
                isHeading
                headingLevel={level}
                placeholder="Escribe un título..."
              />
            </Box>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" gutterBottom color="success.main">
              ✅ Unificado
            </Typography>
            <Box sx={{ border: '1px solid #ddd', borderRadius: 1 }}>
              <ExtendedTipTapEditorUnified
                content={content}
                onChange={setContent}
                isHeading
                headingLevel={level}
                placeholder="Escribe un título..."
              />
            </Box>
          </Box>
        </Box>

        <Box sx={{ mt: 2, p: 2, backgroundColor: 'grey.100', borderRadius: 1 }}>
          <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
            {`<ExtendedTipTapEditor isHeading={true} headingLevel={${level}} />`}
            <br />
            {`<ExtendedTipTapEditorUnified isHeading={true} headingLevel={${level}} />`}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

// Ejemplo para componente paragraph
export function ParagraphMigrationExample() {
  const [content, setContent] = useState(
    '<p>Este es un <strong>párrafo de contenido educativo</strong> con formato <em>rico</em> y <u>texto subrayado</u>.</p>'
  );

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          📝 Migración: Componente Paragraph
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" gutterBottom color="error">
              ❌ Original
            </Typography>
            <Box sx={{ border: '1px solid #ddd', borderRadius: 1 }}>
              <ExtendedTipTapEditor
                content={content}
                onChange={setContent}
                placeholder="Escribe contenido educativo..."
              />
            </Box>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" gutterBottom color="success.main">
              ✅ Unificado
            </Typography>
            <Box sx={{ border: '1px solid #ddd', borderRadius: 1 }}>
              <ExtendedTipTapEditorUnified
                content={content}
                onChange={setContent}
                placeholder="Escribe contenido educativo..."
              />
            </Box>
          </Box>
        </Box>

        <Box sx={{ mt: 2, p: 2, backgroundColor: 'grey.100', borderRadius: 1 }}>
          <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
            {`<ExtendedTipTapEditor content={content} onChange={setContent} />`}
            <br />
            {`<ExtendedTipTapEditorUnified content={content} onChange={setContent} />`}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

// Ejemplo para InfoCard con estilos personalizados
export function InfoCardMigrationExample() {
  const [content, setContent] = useState('Información destacada para estudiantes');
  const [textColor, setTextColor] = useState('#006064');

  const customStyle = { color: textColor };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          ℹ️ Migración: InfoCard con Estilos
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Color del texto:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            {['#006064', '#1976d2', '#388e3c', '#f57c00'].map((color) => (
              <Box
                key={color}
                onClick={() => setTextColor(color)}
                sx={{
                  width: 30,
                  height: 30,
                  backgroundColor: color,
                  borderRadius: 1,
                  cursor: 'pointer',
                  border: textColor === color ? '3px solid #000' : '1px solid #ddd',
                }}
              />
            ))}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" gutterBottom color="error">
              ❌ Original
            </Typography>
            <Box
              sx={{
                border: '1px solid #00bcd4',
                borderRadius: 1,
                backgroundColor: '#e0f7fa',
                p: 2,
                display: 'flex',
                gap: 2,
                alignItems: 'flex-start',
              }}
            >
              <Box sx={{ fontSize: '24px' }}>ℹ️</Box>
              <Box sx={{ flex: 1 }}>
                <ExtendedTipTapEditor
                  content={content}
                  onChange={setContent}
                  style={customStyle}
                  placeholder="Información importante..."
                />
              </Box>
            </Box>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" gutterBottom color="success.main">
              ✅ Unificado
            </Typography>
            <Box
              sx={{
                border: '1px solid #00bcd4',
                borderRadius: 1,
                backgroundColor: '#e0f7fa',
                p: 2,
                display: 'flex',
                gap: 2,
                alignItems: 'flex-start',
              }}
            >
              <Box sx={{ fontSize: '24px' }}>ℹ️</Box>
              <Box sx={{ flex: 1 }}>
                <ExtendedTipTapEditorUnified
                  content={content}
                  onChange={setContent}
                  style={customStyle}
                  placeholder="Información importante..."
                />
              </Box>
            </Box>
          </Box>
        </Box>

        <Box sx={{ mt: 2, p: 2, backgroundColor: 'grey.100', borderRadius: 1 }}>
          <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
            {`<ExtendedTipTapEditor style={{ color: '${textColor}' }} />`}
            <br />
            {`<ExtendedTipTapEditorUnified style={{ color: '${textColor}' }} />`}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

// Ejemplo para HighlightBox
export function HighlightBoxMigrationExample() {
  const [content, setContent] = useState(
    'Contenido destacado que requiere atención especial del estudiante.'
  );

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          🎯 Migración: HighlightBox
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" gutterBottom color="error">
              ❌ Original
            </Typography>
            <Box
              sx={{
                backgroundColor: '#fff3e0',
                borderRadius: 1,
                borderLeft: '4px solid #ff9800',
                p: 3,
              }}
            >
              <ExtendedTipTapEditor
                content={content}
                onChange={setContent}
                placeholder="Contenido destacado..."
              />
            </Box>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" gutterBottom color="success.main">
              ✅ Unificado
            </Typography>
            <Box
              sx={{
                backgroundColor: '#fff3e0',
                borderRadius: 1,
                borderLeft: '4px solid #ff9800',
                p: 3,
              }}
            >
              <ExtendedTipTapEditorUnified
                content={content}
                onChange={setContent}
                placeholder="Contenido destacado..."
              />
            </Box>
          </Box>
        </Box>

        <Box sx={{ mt: 2, p: 2, backgroundColor: 'grey.100', borderRadius: 1 }}>
          <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
            Usado en: highlightBox component del EducacionEditor
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

// Ejemplo para ExampleBox
export function ExampleBoxMigrationExample() {
  const [content, setContent] = useState(
    'Este es un ejemplo práctico de cómo aplicar los conceptos aprendidos.'
  );
  const [boxTitle, setBoxTitle] = useState('Ejemplo práctico');

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          💡 Migración: ExampleBox
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" gutterBottom color="error">
              ❌ Original
            </Typography>
            <Box
              sx={{
                backgroundColor: '#f3e5f5',
                borderRadius: 1,
                p: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                <Box sx={{ color: '#9c27b0', fontSize: '24px' }}>💡</Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  {boxTitle}
                </Typography>
              </Box>
              <ExtendedTipTapEditor
                content={content}
                onChange={setContent}
                placeholder="Describe el ejemplo..."
              />
            </Box>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" gutterBottom color="success.main">
              ✅ Unificado
            </Typography>
            <Box
              sx={{
                backgroundColor: '#f3e5f5',
                borderRadius: 1,
                p: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                <Box sx={{ color: '#9c27b0', fontSize: '24px' }}>💡</Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  {boxTitle}
                </Typography>
              </Box>
              <ExtendedTipTapEditorUnified
                content={content}
                onChange={setContent}
                placeholder="Describe el ejemplo..."
              />
            </Box>
          </Box>
        </Box>

        <Box sx={{ mt: 2, p: 2, backgroundColor: 'grey.100', borderRadius: 1 }}>
          <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
            Usado en: exampleBox component del EducacionEditor
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

// Componente principal que agrupa todos los ejemplos
export default function MigrationExamples() {
  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        🎓 Ejemplos de Migración - Educación
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Estos ejemplos muestran cómo migrar cada caso de uso específico del ExtendedTipTapEditor en
        el sistema de educación al nuevo UnifiedEditor.
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <HeadingMigrationExample />
        <ParagraphMigrationExample />
        <InfoCardMigrationExample />
        <HighlightBoxMigrationExample />
        <ExampleBoxMigrationExample />
      </Box>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            🚀 Próximos Pasos
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Una vez validados estos ejemplos, el siguiente paso es implementar feature flags en el
            EducacionEditor para migración gradual:
          </Typography>
          <Box sx={{ mt: 2, p: 2, backgroundColor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
              const USE_UNIFIED = process.env.NEXT_PUBLIC_USE_UNIFIED_EDUCATION_EDITOR;
              <br />
              {`{USE_UNIFIED ? <ExtendedTipTapEditorUnified /> : <ExtendedTipTapEditor />}`}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

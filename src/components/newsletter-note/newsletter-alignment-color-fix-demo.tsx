'use client';

import { Icon } from '@iconify/react';
import React, { useState } from 'react';

import { Box, Card, Chip, Grid, Alert, Button, Typography, CardContent } from '@mui/material';

// Editor para demostración
import SimpleTipTapEditorWithFlags from './simple-tiptap-editor-with-flags';

export default function NewsletterAlignmentColorFixDemo() {
  const [selectedEditor, setSelectedEditor] = useState<string | null>(null);
  const [activeEditor, setActiveEditor] = useState<any>(null);
  const [selectedAlignment, setSelectedAlignment] = useState<string>('left');
  const [selectedColor, setSelectedColor] = useState<string>('#000000');
  const [textFormat, setTextFormat] = useState<string[]>([]);

  // Contenido de los editores
  const [content1, setContent1] = useState(
    '<h2>🎯 Editor 1 - Título Principal</h2><p>Este es el primer editor. Selecciona este texto y cambia su alineación y color desde el panel lateral.</p>'
  );
  const [content2, setContent2] = useState(
    '<p>📝 Editor 2 - Párrafo de Contenido</p><p>Este es el segundo editor. Las opciones de formato deben aplicarse únicamente a este editor cuando esté seleccionado.</p>'
  );
  const [content3, setContent3] = useState(
    '<p><strong>🎨 Editor 3 - Texto con Formato</strong></p><p>Este es el tercer editor. Prueba cambiar la alineación y el color solo de este editor.</p>'
  );

  // Crear handler de selección específico para cada editor
  const createSelectionHandler = (editorId: string) => (editor: any) => {
    if (!editor) return;
    setSelectedEditor(editorId);
    setActiveEditor(editor);

    // Actualizar los controles de formato basados en el estado del editor
    if (editor) {
      const newFormats = [];
      if (editor.isActive('bold')) newFormats.push('bold');
      if (editor.isActive('italic')) newFormats.push('italic');
      if (editor.isActive('underline')) newFormats.push('underlined');

      setTextFormat(newFormats);

      // Actualizar alineación
      let newAlignment = 'left';
      if (editor.isActive({ textAlign: 'center' })) newAlignment = 'center';
      else if (editor.isActive({ textAlign: 'right' })) newAlignment = 'right';
      else if (editor.isActive({ textAlign: 'justify' })) newAlignment = 'justify';

      setSelectedAlignment(newAlignment);

      // Actualizar color si está disponible
      const marks = editor.getAttributes('textStyle');
      if (marks.color) {
        setSelectedColor(marks.color);
      }
    }
  };

  // Aplicar alineación al texto seleccionado
  const applyTextAlignment = (alignment: string) => {
    if (!activeEditor || !selectedEditor) return;
    activeEditor.chain().focus().setTextAlign(alignment).run();
    setSelectedAlignment(alignment);
  };

  // Aplicar color al texto seleccionado
  const applyTextColor = (color: string) => {
    if (!activeEditor || !selectedEditor) return;
    activeEditor.chain().focus().setColor(color).run();
    setSelectedColor(color);
  };

  // Aplicar formato al texto seleccionado
  const applyTextFormat = (format: string) => {
    if (!activeEditor || !selectedEditor) return;

    switch (format) {
      case 'bold':
        activeEditor.chain().focus().toggleBold().run();
        break;
      case 'italic':
        activeEditor.chain().focus().toggleItalic().run();
        break;
      case 'underlined':
        activeEditor.chain().focus().toggleUnderline().run();
        break;
      default:
        break;
    }

    // Actualizar el estado después de aplicar el formato
    setTimeout(() => {
      if (activeEditor) {
        const newFormats = [];
        if (activeEditor.isActive('bold')) newFormats.push('bold');
        if (activeEditor.isActive('italic')) newFormats.push('italic');
        if (activeEditor.isActive('underline')) newFormats.push('underlined');
        setTextFormat(newFormats);
      }
    }, 10);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1400, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        ✅ Demo: Fix de Alineación y Color - Newsletter Editor
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Demostración del problema resuelto: las opciones de alineación de texto y cambio de color
        ahora funcionan correctamente con múltiples editores en el Newsletter Editor.
      </Typography>

      {/* Alert explicativo */}
      <Alert severity="success" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>🎯 Problema Corregido:</strong> El Newsletter Editor ahora incluye las funciones{' '}
          <code>applyTextAlignment()</code> y <code>applyTextColor()</code> que faltaban. Los
          cambios se aplican únicamente al editor seleccionado.
        </Typography>
      </Alert>

      {/* Layout principal */}
      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', lg: 'row' } }}>
        {/* Panel de Editores */}
        <Box sx={{ flex: 2 }}>
          <Typography variant="h6" gutterBottom>
            📝 Editores de Newsletter
          </Typography>

          {/* Editor 1 */}
          <Card
            sx={{
              mb: 2,
              border: selectedEditor === 'editor-1' ? '2px solid' : '1px solid',
              borderColor: selectedEditor === 'editor-1' ? 'primary.main' : 'divider',
              cursor: 'pointer',
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography variant="subtitle2" color="text.secondary">
                  Editor 1 - Título Principal
                </Typography>
                {selectedEditor === 'editor-1' && (
                  <Chip size="small" label="SELECCIONADO" color="primary" />
                )}
              </Box>

              <SimpleTipTapEditorWithFlags
                content={content1}
                onChange={setContent1}
                onSelectionUpdate={createSelectionHandler('editor-1')}
                showToolbar={false}
                placeholder="Edita el título aquí..."
              />
            </CardContent>
          </Card>

          {/* Editor 2 */}
          <Card
            sx={{
              mb: 2,
              border: selectedEditor === 'editor-2' ? '2px solid' : '1px solid',
              borderColor: selectedEditor === 'editor-2' ? 'primary.main' : 'divider',
              cursor: 'pointer',
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography variant="subtitle2" color="text.secondary">
                  Editor 2 - Párrafo de Contenido
                </Typography>
                {selectedEditor === 'editor-2' && (
                  <Chip size="small" label="SELECCIONADO" color="primary" />
                )}
              </Box>

              <SimpleTipTapEditorWithFlags
                content={content2}
                onChange={setContent2}
                onSelectionUpdate={createSelectionHandler('editor-2')}
                showToolbar={false}
                placeholder="Edita el párrafo aquí..."
              />
            </CardContent>
          </Card>

          {/* Editor 3 */}
          <Card
            sx={{
              mb: 2,
              border: selectedEditor === 'editor-3' ? '2px solid' : '1px solid',
              borderColor: selectedEditor === 'editor-3' ? 'primary.main' : 'divider',
              cursor: 'pointer',
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography variant="subtitle2" color="text.secondary">
                  Editor 3 - Texto con Formato
                </Typography>
                {selectedEditor === 'editor-3' && (
                  <Chip size="small" label="SELECCIONADO" color="primary" />
                )}
              </Box>

              <SimpleTipTapEditorWithFlags
                content={content3}
                onChange={setContent3}
                onSelectionUpdate={createSelectionHandler('editor-3')}
                showToolbar={false}
                placeholder="Edita el texto aquí..."
              />
            </CardContent>
          </Card>
        </Box>

        {/* Panel Lateral */}
        <Box sx={{ flex: 1 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🎨 Panel Lateral de Formato
              </Typography>

              {selectedEditor && activeEditor ? (
                <Box>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      <strong>🎯 Editor Activo:</strong>
                      <br />
                      {selectedEditor}
                    </Typography>
                  </Alert>

                  {/* Formato de texto */}
                  <Typography variant="subtitle2" gutterBottom>
                    Formato de Texto:
                  </Typography>
                  <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Button
                      variant={textFormat.includes('bold') ? 'contained' : 'outlined'}
                      size="small"
                      onClick={() => applyTextFormat('bold')}
                      sx={{ minWidth: 'auto', px: 1 }}
                    >
                      <Icon icon="mdi:format-bold" />
                    </Button>
                    <Button
                      variant={textFormat.includes('italic') ? 'contained' : 'outlined'}
                      size="small"
                      onClick={() => applyTextFormat('italic')}
                      sx={{ minWidth: 'auto', px: 1 }}
                    >
                      <Icon icon="mdi:format-italic" />
                    </Button>
                    <Button
                      variant={textFormat.includes('underlined') ? 'contained' : 'outlined'}
                      size="small"
                      onClick={() => applyTextFormat('underlined')}
                      sx={{ minWidth: 'auto', px: 1 }}
                    >
                      <Icon icon="mdi:format-underline" />
                    </Button>
                  </Box>

                  {/* Alineación */}
                  <Typography variant="subtitle2" gutterBottom>
                    Alineación de Texto:
                  </Typography>
                  <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
                    <Button
                      variant={selectedAlignment === 'left' ? 'contained' : 'outlined'}
                      size="small"
                      onClick={() => applyTextAlignment('left')}
                      sx={{ minWidth: 'auto', px: 1 }}
                    >
                      <Icon icon="mdi:format-align-left" />
                    </Button>
                    <Button
                      variant={selectedAlignment === 'center' ? 'contained' : 'outlined'}
                      size="small"
                      onClick={() => applyTextAlignment('center')}
                      sx={{ minWidth: 'auto', px: 1 }}
                    >
                      <Icon icon="mdi:format-align-center" />
                    </Button>
                    <Button
                      variant={selectedAlignment === 'right' ? 'contained' : 'outlined'}
                      size="small"
                      onClick={() => applyTextAlignment('right')}
                      sx={{ minWidth: 'auto', px: 1 }}
                    >
                      <Icon icon="mdi:format-align-right" />
                    </Button>
                    <Button
                      variant={selectedAlignment === 'justify' ? 'contained' : 'outlined'}
                      size="small"
                      onClick={() => applyTextAlignment('justify')}
                      sx={{ minWidth: 'auto', px: 1 }}
                    >
                      <Icon icon="mdi:format-align-justify" />
                    </Button>
                  </Box>

                  {/* Color */}
                  <Typography variant="subtitle2" gutterBottom>
                    Color de Texto:
                  </Typography>
                  <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <input
                      type="color"
                      value={selectedColor}
                      onChange={(e) => applyTextColor(e.target.value)}
                      style={{
                        width: 40,
                        height: 40,
                        padding: 0,
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {selectedColor}
                    </Typography>
                  </Box>

                  <Typography variant="caption" color="success.main">
                    ✅ Los cambios se aplicarán SOLO al {selectedEditor}
                  </Typography>
                </Box>
              ) : (
                <Alert severity="warning">
                  <Typography variant="body2">
                    <strong>⚠️ Selecciona un editor</strong>
                    <br />
                    Haz clic en cualquiera de los editores de la izquierda para seleccionarlo y
                    poder usar las opciones de formato.
                  </Typography>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Información técnica */}
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" gutterBottom>
                🔧 Fix Técnico Implementado
              </Typography>

              <Typography variant="caption" color="text.secondary" component="div">
                <strong>❌ Antes:</strong>
                <br />
                - Newsletter Editor no tenía applyTextAlignment()
                <br />
                - Newsletter Editor no tenía applyTextColor()
                <br />
                - Panel lateral solo tenía opciones básicas
                <br />
                - Alineación y color no funcionaban
                <br />
                <br />
                <strong>✅ Después:</strong>
                <br />
                - Funciones applyTextAlignment() agregadas
                <br />
                - Funciones applyTextColor() agregadas
                <br />
                - Panel lateral completo con todas las opciones
                <br />- Funciona correctamente con múltiples editores
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Instrucciones de testing */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            🧪 Cómo Probar el Fix
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Sigue estos pasos para verificar que el problema está resuelto:
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                🎯 Prueba de Alineación:
              </Typography>
              <Box component="ol" sx={{ pl: 2, mb: 2 }}>
                <li>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Selecciona el Editor 1 (haz clic en él)
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Usa los botones de alineación en el panel lateral
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Verifica que SOLO el Editor 1 cambia su alineación
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">Repite con Editor 2 y Editor 3</Typography>
                </li>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                🎨 Prueba de Color:
              </Typography>
              <Box component="ol" sx={{ pl: 2, mb: 2 }}>
                <li>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Selecciona texto en el Editor 2
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Cambia el color usando el selector en el panel lateral
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Verifica que SOLO el texto del Editor 2 cambia
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    Los otros editores mantienen su color original
                  </Typography>
                </li>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}

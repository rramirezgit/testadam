'use client';

import { Icon } from '@iconify/react';
import React, { useState } from 'react';

import { Box, Card, Chip, Alert, Button, Typography, CardContent } from '@mui/material';

// Editor para demostración
import SimpleTipTapEditorWithFlags from './simple-tiptap-editor-with-flags';

export default function NewsletterHeaderFixDemo() {
  const [selectedEditor, setSelectedEditor] = useState<string | null>(null);
  const [activeEditor, setActiveEditor] = useState<any>(null);
  const [selectedAlignment, setSelectedAlignment] = useState<string>('left');
  const [selectedColor, setSelectedColor] = useState<string>('#ffffff');
  const [textFormat, setTextFormat] = useState<string[]>([]);

  // Contenido del header
  const [headerTitle, setHeaderTitle] = useState('<h1>📰 Noticias Newsletter</h1>');
  const [headerSubtitle, setHeaderSubtitle] = useState('<p>Tu fuente de noticias diarias</p>');

  // Simular el header style
  const headerStyle = {
    background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
    color: '#ffffff',
    padding: '20px',
    textAlign: 'center' as const,
    borderRadius: '8px',
    marginBottom: '16px',
    position: 'relative' as const,
  };

  // Crear handler de selección específico para cada editor del header
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
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        ✅ Demo: Fix del Header Editable - Newsletter
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Demostración del problema resuelto: el título y subtítulo del header del newsletter ahora
        son editables y se conectan correctamente al sistema de formato.
      </Typography>

      {/* Alert explicativo */}
      <Alert severity="success" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>🎯 Problema Corregido:</strong> El título del header ya no usa Typography
          estático. Ahora usa SimpleTipTapEditorWithFlags conectado al sistema de formato lateral.
        </Typography>
      </Alert>

      {/* Layout principal */}
      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', lg: 'row' } }}>
        {/* Header del Newsletter */}
        <Box sx={{ flex: 2 }}>
          <Typography variant="h6" gutterBottom>
            📝 Header del Newsletter (Template Noticias)
          </Typography>

          {/* Header simulado */}
          <Box sx={headerStyle}>
            {/* Título del Header */}
            <Box
              sx={{
                cursor: 'text',
                mb: 1,
                border: selectedEditor === 'header-title' ? '2px solid #ffeb3b' : 'none',
                borderRadius: '4px',
                p: selectedEditor === 'header-title' ? '4px' : 0,
                '& h1': {
                  margin: 0,
                  fontSize: '2.125rem',
                  fontWeight: 400,
                  lineHeight: 1.235,
                },
              }}
            >
              <SimpleTipTapEditorWithFlags
                content={headerTitle}
                onChange={setHeaderTitle}
                onSelectionUpdate={createSelectionHandler('header-title')}
                showToolbar={false}
                placeholder="Newsletter Title"
                style={{
                  color: '#ffffff',
                  fontSize: '2.125rem',
                  fontWeight: 400,
                  lineHeight: 1.235,
                  outline: 'none',
                }}
              />
              {selectedEditor === 'header-title' && (
                <Chip
                  size="small"
                  label="TÍTULO SELECCIONADO"
                  color="warning"
                  sx={{ position: 'absolute', top: '5px', right: '5px' }}
                />
              )}
            </Box>

            {/* Subtítulo del Header */}
            <Box
              sx={{
                cursor: 'text',
                border: selectedEditor === 'header-subtitle' ? '2px solid #ffeb3b' : 'none',
                borderRadius: '4px',
                p: selectedEditor === 'header-subtitle' ? '4px' : 0,
                '& p': {
                  margin: 0,
                  fontSize: '1rem',
                  fontWeight: 400,
                  lineHeight: 1.5,
                },
              }}
            >
              <SimpleTipTapEditorWithFlags
                content={headerSubtitle}
                onChange={setHeaderSubtitle}
                onSelectionUpdate={createSelectionHandler('header-subtitle')}
                showToolbar={false}
                placeholder="Newsletter Subtitle"
                style={{
                  color: '#ffffff',
                  fontSize: '1rem',
                  fontWeight: 400,
                  lineHeight: 1.5,
                  outline: 'none',
                }}
              />
              {selectedEditor === 'header-subtitle' && (
                <Chip
                  size="small"
                  label="SUBTÍTULO SELECCIONADO"
                  color="warning"
                  sx={{ position: 'absolute', top: '5px', left: '5px' }}
                />
              )}
            </Box>
          </Box>

          {/* Estado del sistema */}
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" gutterBottom>
                📊 Estado del Sistema
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Editor seleccionado:</strong> {selectedEditor || 'Ninguno'}
                <br />
                <strong>Alineación activa:</strong> {selectedAlignment}
                <br />
                <strong>Color activo:</strong> {selectedColor}
                <br />
                <strong>Formato activo:</strong> {textFormat.join(', ') || 'Ninguno'}
              </Typography>
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
                      {selectedEditor === 'header-title'
                        ? '📰 Título del Header'
                        : '📝 Subtítulo del Header'}
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
                    ✅ Los cambios se aplicarán SOLO al{' '}
                    {selectedEditor === 'header-title' ? 'título' : 'subtítulo'} del header
                  </Typography>
                </Box>
              ) : (
                <Alert severity="warning">
                  <Typography variant="body2">
                    <strong>⚠️ Selecciona un elemento del header</strong>
                    <br />
                    Haz clic en el título o subtítulo del header para seleccionarlo y poder usar las
                    opciones de formato.
                  </Typography>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Fix técnico */}
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" gutterBottom>
                🔧 Fix Implementado
              </Typography>

              <Typography variant="caption" color="text.secondary" component="div">
                <strong>❌ Antes:</strong>
                <br />
                • Header usaba Typography estático
                <br />
                • No se conectaba al sistema de formato
                <br />
                • Cambios se aplicaban al último editor
                <br />
                <br />
                <strong>✅ Después:</strong>
                <br />
                • Header usa SimpleTipTapEditorWithFlags
                <br />
                • createSelectionHandler('header-title')
                <br />
                • createSelectionHandler('header-subtitle')
                <br />• Formato se aplica al elemento correcto
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Instrucciones */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            🧪 Cómo Probar el Fix
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Para verificar que el problema del header está resuelto:
          </Typography>

          <Box component="ol" sx={{ pl: 2 }}>
            <li>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Haz clic en el **título del header** (📰 Noticias Newsletter)
              </Typography>
            </li>
            <li>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Verifica que aparece "TÍTULO SELECCIONADO" y se muestra en el panel lateral
              </Typography>
            </li>
            <li>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Cambia la alineación → debe aplicarse SOLO al título
              </Typography>
            </li>
            <li>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Haz clic en el **subtítulo** (Tu fuente de noticias diarias)
              </Typography>
            </li>
            <li>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Cambia el color → debe aplicarse SOLO al subtítulo
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                Los cambios **NO** deben afectar otros editores del template
              </Typography>
            </li>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

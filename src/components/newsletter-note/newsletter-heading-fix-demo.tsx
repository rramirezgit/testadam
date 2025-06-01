'use client';

import { Icon } from '@iconify/react';
import React, { useState } from 'react';

import { Box, Card, Chip, Alert, Button, Typography, CardContent } from '@mui/material';

// Editor para demostración
import SimpleTipTapEditorWithFlags from './simple-tiptap-editor-with-flags';

export default function NewsletterHeadingFixDemo() {
  const [selectedEditor, setSelectedEditor] = useState<string | null>(null);
  const [activeEditor, setActiveEditor] = useState<any>(null);
  const [selectedAlignment, setSelectedAlignment] = useState<string>('left');
  const [selectedColor, setSelectedColor] = useState<string>('#000000');
  const [textFormat, setTextFormat] = useState<string[]>([]);

  // Contenido de los editores
  const [headingContent, setHeadingContent] = useState('<h2>📰 Titular de la Noticia</h2>');
  const [paragraphContent, setParagraphContent] = useState(
    '<p>Este es un párrafo de ejemplo que debería funcionar correctamente con el sistema de formato.</p>'
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

  // Simulación del estilo de heading corregido
  const HeadingComponentFixed = ({ content, onChange, onSelectionUpdate, componentId }: any) => (
    <Box
      sx={{
        border: selectedEditor === componentId ? '2px solid #2196f3' : '1px solid #e0e0e0',
        borderRadius: '4px',
        p: 1,
        mb: 2,
        position: 'relative',
        cursor: 'text',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <Box
        sx={{
          // ✅ Estilos CSS que permiten que TipTap funcione correctamente
          '& h1, & h2, & h3, & h4, & h5, & h6': {
            margin: 0,
            padding: 0,
            fontWeight: 'inherit',
            fontSize: 'inherit',
            lineHeight: 'inherit',
            color: 'inherit',
            textAlign: 'inherit',
          },
        }}
      >
        <h2>
          <SimpleTipTapEditorWithFlags
            content={content}
            onChange={onChange}
            onSelectionUpdate={onSelectionUpdate}
            style={{
              outline: 'none',
              width: '100%',
              minHeight: '1.5em',
            }}
            showToolbar={false}
          />
        </h2>
      </Box>
      {selectedEditor === componentId && (
        <Chip
          size="small"
          label="HEADING SELECCIONADO"
          color="primary"
          sx={{ position: 'absolute', top: '5px', right: '5px' }}
        />
      )}
    </Box>
  );

  // Simulación del estilo de párrafo (que siempre funcionó)
  const ParagraphComponent = ({ content, onChange, onSelectionUpdate, componentId }: any) => (
    <Box
      sx={{
        border: selectedEditor === componentId ? '2px solid #4caf50' : '1px solid #e0e0e0',
        borderRadius: '4px',
        p: 1,
        mb: 2,
        position: 'relative',
        cursor: 'text',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <Typography variant="body1" component="p">
        <SimpleTipTapEditorWithFlags
          content={content}
          onChange={onChange}
          onSelectionUpdate={onSelectionUpdate}
          style={{ outline: 'none' }}
          showToolbar={false}
        />
      </Typography>
      {selectedEditor === componentId && (
        <Chip
          size="small"
          label="PÁRRAFO SELECCIONADO"
          color="success"
          sx={{ position: 'absolute', top: '5px', right: '5px' }}
        />
      )}
    </Box>
  );

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        ✅ Demo: Fix de Headings - Newsletter Editor
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Demostración del problema resuelto: los headings ahora responden correctamente a los
        controles de formato del panel lateral.
      </Typography>

      {/* Alert explicativo */}
      <Alert severity="success" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>🎯 Problema Corregido:</strong> Los headings ya no tienen conflictos de CSS. Ahora
          los estilos de TipTap se aplican correctamente.
        </Typography>
      </Alert>

      {/* Problema vs Solución */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" color="error" gutterBottom>
              ❌ Problema Anterior
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Headings:</strong>
              <br />• Envueltos directamente en {'<HeadingTag>'}
              <br />
              • CSS nativo sobreescribía TipTap
              <br />
              • Alineación y color no funcionaban
              <br />
              <br />
              <strong>Párrafos:</strong>
              <br />
              • Funcionaban correctamente
              <br />• Typography era contenedor neutro
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" color="success.main" gutterBottom>
              ✅ Solución Implementada
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Fix Aplicado:</strong>
              <br />
              • Box contenedor con CSS reset
              <br />
              • CSS: margin: 0, color: inherit
              <br />
              • textAlign: inherit, etc.
              <br />
              • TipTap ahora controla los estilos
              <br />• Alineación y color funcionan
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Layout principal */}
      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', lg: 'row' } }}>
        {/* Editores */}
        <Box sx={{ flex: 2 }}>
          <Typography variant="h6" gutterBottom>
            📝 Editores del Newsletter
          </Typography>

          {/* Heading Corregido */}
          <HeadingComponentFixed
            content={headingContent}
            onChange={setHeadingContent}
            onSelectionUpdate={createSelectionHandler('heading-1')}
            componentId="heading-1"
          />

          {/* Párrafo (para comparación) */}
          <ParagraphComponent
            content={paragraphContent}
            onChange={setParagraphContent}
            onSelectionUpdate={createSelectionHandler('paragraph-1')}
            componentId="paragraph-1"
          />

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
                      {selectedEditor === 'heading-1' ? '📰 Heading (Título)' : '📝 Párrafo'}
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

                  <Typography
                    variant="caption"
                    color={selectedEditor === 'heading-1' ? 'primary.main' : 'success.main'}
                  >
                    ✅ Los cambios se aplicarán al{' '}
                    {selectedEditor === 'heading-1' ? 'HEADING' : 'PÁRRAFO'} seleccionado
                  </Typography>
                </Box>
              ) : (
                <Alert severity="warning">
                  <Typography variant="body2">
                    <strong>⚠️ Selecciona un elemento</strong>
                    <br />
                    Haz clic en el heading o párrafo para seleccionarlo y poder usar las opciones de
                    formato.
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
                <br />• {'<HeadingTag style={component.style}>'}
                <br />
                • CSS nativo sobreescribía TipTap
                <br />
                • Alineación y color no funcionaban
                <br />
                <br />
                <strong>✅ Después:</strong>
                <br />
                • Box contenedor con CSS reset
                <br />
                • fontWeight: inherit, color: inherit
                <br />
                • textAlign: inherit
                <br />• TipTap controla completamente los estilos
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
            Para verificar que el problema de los headings está resuelto:
          </Typography>

          <Box component="ol" sx={{ pl: 2 }}>
            <li>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Haz clic en el **heading** (📰 Titular de la Noticia)
              </Typography>
            </li>
            <li>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Cambia la alineación → debe aplicarse correctamente al heading
              </Typography>
            </li>
            <li>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Cambia el color → debe aplicarse correctamente al heading
              </Typography>
            </li>
            <li>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Aplica formato bold/italic → debe funcionar en el heading
              </Typography>
            </li>
            <li>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Haz clic en el **párrafo** y verifica que también funciona
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                Compara: ambos elementos ahora tienen **comportamiento idéntico**
              </Typography>
            </li>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

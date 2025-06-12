'use client';

import { Icon } from '@iconify/react';
import React, { useState } from 'react';

import {
  Box,
  Card,
  Chip,
  Alert,
  Table,
  Paper,
  Button,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  CardContent,
  TableContainer,
} from '@mui/material';

// Componentes para demostración
import SimpleTipTapEditorWithFlags from './simple-tiptap-editor-with-flags';

export default function NewsletterTemplateHeadingFixDemo() {
  const [selectedEditor, setSelectedEditor] = useState<string | null>(null);
  const [activeEditor, setActiveEditor] = useState<any>(null);
  const [selectedAlignment, setSelectedAlignment] = useState<string>('left');
  const [selectedColor, setSelectedColor] = useState<string>('#000000');
  const [textFormat, setTextFormat] = useState<string[]>([]);

  // Contenido del template de noticias (simulando la data real)
  const [templateHeading, setTemplateHeading] = useState('Título de la noticia');

  // Crear handler de selección específico
  const createSelectionHandler = (editorId: string) => (editor: any) => {
    if (!editor) return;
    setSelectedEditor(editorId);
    setActiveEditor(editor);

    // Actualizar controles de formato
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

      // Actualizar color
      const marks = editor.getAttributes('textStyle');
      if (marks.color) {
        setSelectedColor(marks.color);
      }
    }
  };

  // Aplicar alineación
  const applyTextAlignment = (alignment: string) => {
    if (!activeEditor || !selectedEditor) return;
    activeEditor.chain().focus().setTextAlign(alignment).run();
    setSelectedAlignment(alignment);
  };

  // Aplicar color
  const applyTextColor = (color: string) => {
    if (!activeEditor || !selectedEditor) return;
    activeEditor.chain().focus().setColor(color).run();
    setSelectedColor(color);
  };

  // Aplicar formato
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

    // Actualizar estado
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

  // Simulación del HeadingComponent CORREGIDO
  const HeadingComponentFixed = ({ content, onChange, onSelectionUpdate, componentId }: any) => (
    <Box
      sx={{
        border: selectedEditor === componentId ? '2px solid #ff9800' : '1px solid #e0e0e0',
        borderRadius: '4px',
        p: 1,
        mb: 2,
        position: 'relative',
        cursor: 'text',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* ✅ Box contenedor con CSS reset (igual que en newsletter-content-editor.tsx) */}
      <Box
        sx={{
          '& h1, & h2, & h3, & h4, & h5, & h6': {
            margin: 0,
            padding: 0,
            fontWeight: 'inherit',
            fontSize: 'inherit',
            lineHeight: 'inherit',
            color: 'inherit',
            textAlign: 'inherit',
          },
          // ✅ Estilos base para que se vea como título por defecto
          fontSize: '2.125rem', // H1 grande
          fontWeight: 'bold',
          lineHeight: 1.2,
          marginBottom: '0.5rem',
        }}
      >
        <h1>
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
        </h1>
      </Box>
      {selectedEditor === componentId && (
        <Chip
          size="small"
          label="TEMPLATE HEADING"
          color="warning"
          sx={{ position: 'absolute', top: '5px', right: '5px' }}
        />
      )}
    </Box>
  );

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        ✅ Demo: Fix Headings Template Noticias
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Demostración del problema resuelto en los headings específicos del template de noticias que
        vienen con data preexistente.
      </Typography>

      {/* Alert explicativo */}
      <Alert severity="success" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>🎯 Problema Específico Resuelto:</strong> Los headings con{' '}
          <code>
            {
              '{ id: "heading-1", type: "heading", content: "Título de la noticia", props: { level: 1 } }'
            }
          </code>{' '}
          ahora funcionan correctamente con el panel de formato.
        </Typography>
      </Alert>

      {/* Tabla comparativa */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            📊 Comparación: Archivos Afectados
          </Typography>

          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Archivo</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Uso</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Estado Fix</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <code>newsletter-content-editor.tsx</code>
                  </TableCell>
                  <TableCell>Editor general de newsletter</TableCell>
                  <TableCell>
                    <Chip label="✅ Corregido previamente" color="success" size="small" />
                  </TableCell>
                </TableRow>
                <TableRow sx={{ backgroundColor: 'warning.light' }}>
                  <TableCell>
                    <code>HeadingComponent.tsx</code>
                  </TableCell>
                  <TableCell>
                    <strong>Template de noticias</strong>
                  </TableCell>
                  <TableCell>
                    <Chip label="🔧 Corregido AHORA" color="warning" size="small" />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Problema vs Solución */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" color="error" gutterBottom>
              ❌ Problema en Template
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>HeadingComponent.tsx ANTES:</strong>
              <br />• `{'<HeadingTag style={component.style || {}}>'}`
              <br />• CSS nativo sobreescribía TipTap
              <br />• Template noticias no funcionaba
              <br />• Alineación y color se ignoraban
              <br />
              <br />
              <strong>Data problemática:</strong>
              <br />• `{`{ id: 'heading-1', type: 'heading' }`}`
              <br />• `{`props: { level: 1 }`}`
              <br />• Venía preexistente del template
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" color="success.main" gutterBottom>
              ✅ Solución Aplicada
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>HeadingComponent.tsx DESPUÉS:</strong>
              <br />• Box contenedor agregado
              <br />• CSS reset: `color: inherit`
              <br />• CSS reset: `textAlign: inherit`
              <br />• TipTap controla estilos
              <br />
              <br />
              <strong>Fix técnico:</strong>
              <br />• Mismo patrón que funcionaba
              <br />• CSS reset en `& h1, & h2, & h3`
              <br />• Consistencia total entre editores
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Layout principal */}
      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', lg: 'row' } }}>
        {/* Editor Template */}
        <Box sx={{ flex: 2 }}>
          <Typography variant="h6" gutterBottom>
            📰 Template de Noticias (Corregido)
          </Typography>

          {/* Simulación del componente del template */}
          <Card sx={{ mb: 2, backgroundColor: 'warning.light' }}>
            <CardContent>
              <Typography variant="subtitle2" gutterBottom>
                🏷️ Componente de Template:
              </Typography>
              <Typography variant="caption" sx={{ fontFamily: 'monospace', display: 'block' }}>
                {`{ id: 'heading-1', type: 'heading', content: 'Título de la noticia', props: { level: 1 } }`}
              </Typography>
            </CardContent>
          </Card>

          {/* Heading del template corregido */}
          <HeadingComponentFixed
            content={templateHeading}
            onChange={setTemplateHeading}
            onSelectionUpdate={createSelectionHandler('template-heading')}
            componentId="template-heading"
          />

          {/* Estado del sistema */}
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" gutterBottom>
                📊 Estado del Sistema
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Heading seleccionado:</strong> {selectedEditor || 'Ninguno'}
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
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      <strong>🎯 Template Heading Activo:</strong>
                      <br />
                      Heading del template de noticias con props.level = 1
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

                  <Typography variant="caption" color="warning.main">
                    ✅ Los cambios se aplicarán al HEADING del TEMPLATE
                  </Typography>
                </Box>
              ) : (
                <Alert severity="info">
                  <Typography variant="body2">
                    <strong>📰 Selecciona el heading del template</strong>
                    <br />
                    Haz clic en &quot;Título de la noticia&quot; para seleccionarlo y poder usar las
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
                🔧 Fix Técnico Aplicado
              </Typography>

              <Typography variant="caption" color="text.secondary" component="div">
                <strong>❌ HeadingComponent.tsx ANTES:</strong>
                <br />
                <code>&lt;HeadingTag style=&#123;component.style || &#123;&#125;&#125;&gt;</code>
                <br />
                <code>{'  <SimpleTipTapEditorWithFlags />'}</code>
                <br />
                <code>{'</HeadingTag>'}</code>
                <br />
                <br />
                <strong>✅ HeadingComponent.tsx DESPUÉS:</strong>
                <br />
                <code>{'<Box sx={{ "& h1, h2, h3": { color: "inherit" } }}>'}</code>
                <br />
                <code>{'  <HeadingTag>'}</code>
                <br />
                <code>{'    <SimpleTipTapEditorWithFlags />'}</code>
                <br />
                <code>{'  </HeadingTag>'}</code>
                <br />
                <code>{'</Box>'}</code>
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Instrucciones */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            🧪 Cómo Probar el Fix del Template
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Para verificar que el problema específico del template está resuelto:
          </Typography>

          <Box component="ol" sx={{ pl: 2 }}>
            <li>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Haz clic en el **heading del template** &quot;Título de la noticia&quot;
              </Typography>
            </li>
            <li>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Cambia la alineación → debe aplicarse al heading del template
              </Typography>
            </li>
            <li>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Cambia el color → debe aplicarse al heading del template
              </Typography>
            </li>
            <li>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Aplica formato bold/italic → debe funcionar en el heading del template
              </Typography>
            </li>
            <li>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Verifica que el comportamiento es **idéntico** al editor normal
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                Confirma: **template de noticias ahora funciona perfectamente**
              </Typography>
            </li>
          </Box>
        </CardContent>
      </Card>

      {/* Resultado final */}
      <Alert severity="success" sx={{ mt: 3 }}>
        <Typography variant="body2">
          <strong>🎉 Resultado Final:</strong> Tanto los headings nuevos
          (newsletter-content-editor.tsx) como los headings de templates preexistentes
          (HeadingComponent.tsx) ahora tienen comportamiento idéntico y consistente con el panel
          lateral de formato.
        </Typography>
      </Alert>
    </Box>
  );
}

'use client';

import React, { useState } from 'react';

import { Box, Card, Chip, Alert, Button, Divider, Typography, CardContent } from '@mui/material';

// Editores para demostración
import SimpleTipTapEditorWithFlags from './simple-tiptap-editor-with-flags';

export default function SelectionFixDemo() {
  const [selectedEditor, setSelectedEditor] = useState<string | null>(null);
  const [content1, setContent1] = useState(
    '<h2>📝 Editor 1 - Título</h2><p>Este es el primer editor. Cuando hagas clic aquí para editarlo, debe seleccionarse y las opciones del panel lateral deben aplicarse a este editor.</p>'
  );
  const [content2, setContent2] = useState(
    '<p>📄 Editor 2 - Párrafo</p><p>Este es el segundo editor. Cuando hagas clic aquí, debe seleccionarse y las opciones del panel lateral deben aplicarse a este editor, NO al primero.</p>'
  );
  const [content3, setContent3] = useState(
    '<h3>🎯 Editor 3 - Subtítulo</h3><p>Este es el tercer editor. Prueba seleccionar diferentes editores y verificar que las opciones del panel lateral se aplican al editor correcto.</p>'
  );

  // Simular handler de selección como en el sistema real
  const createSelectionHandler = (editorId: string) => (editor: any) => {
    if (!editor) return;
    setSelectedEditor(editorId);
    console.log(`✅ Editor seleccionado: ${editorId}`);
  };

  const handleEditorClick = (editorId: string) => {
    setSelectedEditor(editorId);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        🎯 Demo: Fix de Selección de Componentes
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Demostración del problema corregido: cuando seleccionas un editor específico, los cambios
        del panel lateral se aplican únicamente a ese editor y no al último.
      </Typography>

      {/* Alert explicativo */}
      <Alert severity="success" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>✅ Problema Corregido:</strong> El sistema ahora usa{' '}
          <code>createSelectionHandler(component.id)</code> para asociar correctamente cada editor
          con su ID. Los cambios del panel lateral se aplican al editor seleccionado.
        </Typography>
      </Alert>

      {/* Indicador de selección */}
      <Card sx={{ mb: 3, p: 2, bgcolor: 'primary.50' }}>
        <Typography variant="h6" gutterBottom>
          📊 Estado de Selección
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Typography variant="body2">
            <strong>Editor Seleccionado:</strong>
          </Typography>
          {selectedEditor ? (
            <Chip label={selectedEditor} color="primary" variant="filled" />
          ) : (
            <Chip label="Ninguno" color="default" variant="outlined" />
          )}
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Haz clic en cualquier editor abajo para seleccionarlo. Observa cómo cambia este indicador.
        </Typography>
      </Card>

      {/* Simulación del panel lateral */}
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
            onClick={() => handleEditorClick('editor-1')}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Editor 1 (Título)
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
            onClick={() => handleEditorClick('editor-2')}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Editor 2 (Párrafo)
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
            onClick={() => handleEditorClick('editor-3')}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Editor 3 (Subtítulo)
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
                placeholder="Edita el subtítulo aquí..."
              />
            </CardContent>
          </Card>
        </Box>

        {/* Panel Lateral Simulado */}
        <Box sx={{ flex: 1 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🎨 Panel Lateral (Simulado)
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                En el sistema real, aquí aparecerían las opciones de formato (Bold, Italic, colores,
                etc.) que se aplicarían al editor seleccionado.
              </Typography>

              <Divider sx={{ my: 2 }} />

              {selectedEditor ? (
                <Box>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      <strong>🎯 Aplicando cambios a:</strong>
                      <br />
                      {selectedEditor}
                    </Typography>
                  </Alert>

                  <Typography variant="subtitle2" gutterBottom>
                    Opciones de Formato:
                  </Typography>

                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mb: 2 }}>
                    <Button variant="outlined" size="small">
                      Bold
                    </Button>
                    <Button variant="outlined" size="small">
                      Italic
                    </Button>
                    <Button variant="outlined" size="small">
                      Underline
                    </Button>
                    <Button variant="outlined" size="small">
                      Color
                    </Button>
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
                    Haz clic en cualquiera de los editores de la izquierda para seleccionarlo.
                  </Typography>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Información técnica */}
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" gutterBottom>
                🔧 Fix Técnico Aplicado
              </Typography>

              <Typography variant="caption" color="text.secondary" component="div">
                <strong>Antes:</strong>
                <br />
                - handleSelectionUpdate genérico
                <br />
                - selectedComponentId no se actualizaba
                <br />
                - Cambios se aplicaban al último editor
                <br />
                <br />
                <strong>Después:</strong>
                <br />
                - createSelectionHandler(componentId)
                <br />
                - selectedComponentId se actualiza correctamente
                <br />- Cambios se aplican al editor seleccionado
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

          <Box component="ol" sx={{ pl: 2 }}>
            <li>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Selecciona el Editor 1</strong> (haz clic en el primer editor)
              </Typography>
            </li>
            <li>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Observa el indicador de selección</strong> - debe mostrar
                &quot;editor-1&quot;
              </Typography>
            </li>
            <li>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Cambia al Editor 2</strong> (haz clic en el segundo editor)
              </Typography>
            </li>
            <li>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Verifica que el indicador cambia</strong> a &quot;editor-2&quot;
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                <strong>En el sistema real:</strong> Los cambios de formato del panel lateral se
                aplicarían únicamente al editor seleccionado
              </Typography>
            </li>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

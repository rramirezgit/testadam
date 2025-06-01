'use client';

import React, { useState } from 'react';

import {
  Box,
  Card,
  Chip,
  Alert,
  Table,
  Paper,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  CardContent,
  TableContainer,
} from '@mui/material';

import SimpleTipTapEditorWithFlags from './simple-tiptap-editor-with-flags';

export default function NewsletterBorderlessEditorDemo() {
  const [content1, setContent1] = useState(
    'Este texto NO tiene borde ni padding - ideal para newsletter'
  );
  const [content2, setContent2] = useState(
    'Este texto SÍ tiene borde y padding - como editor normal'
  );

  return (
    <Box sx={{ p: 3, maxWidth: 1000, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        ✅ Demo: Editores Sin Borde
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Demostración de editores TipTap sin recuadro ni borde para que se vean como texto natural.
      </Typography>

      {/* Alert explicativo */}
      <Alert severity="success" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>🎯 Problema Resuelto:</strong> Los editores TipTap ahora pueden funcionar como
          texto puro sin recuadros visibles cuando `showToolbar={false}`.
        </Typography>
      </Alert>

      {/* Tabla comparativa */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            📊 Comparación: Con y Sin Borde
          </Typography>

          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Configuración</strong>
                  </TableCell>
                  <TableCell>
                    <strong>showToolbar</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Apariencia</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Uso</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow sx={{ backgroundColor: 'success.light' }}>
                  <TableCell>
                    <strong>Sin Borde</strong>
                  </TableCell>
                  <TableCell>
                    <Chip label="false" color="success" size="small" />
                  </TableCell>
                  <TableCell>Como texto normal</TableCell>
                  <TableCell>Newsletter, inline editing</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Con Borde</strong>
                  </TableCell>
                  <TableCell>
                    <Chip label="true" color="default" size="small" />
                  </TableCell>
                  <TableCell>Como editor formal</TableCell>
                  <TableCell>Editor principal, forms</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Demostración visual */}
      <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
        {/* Editor sin borde */}
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" color="success.main" gutterBottom>
              ✅ Editor Sin Borde (showToolbar=false)
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Este es el estilo usado en el newsletter. El texto se ve natural, sin recuadro:
            </Typography>

            <Box
              sx={{
                p: 2,
                backgroundColor: 'grey.50',
                borderRadius: 1,
                border: '1px dashed #ddd',
              }}
            >
              <Typography variant="subtitle2" gutterBottom>
                Ejemplo en contexto:
              </Typography>
              <Typography variant="body1" component="div">
                En el newsletter puedes tener un párrafo como: "
                <SimpleTipTapEditorWithFlags
                  content={content1}
                  onChange={setContent1}
                  showToolbar={false}
                  style={{ display: 'inline' }}
                />
                " y se ve completamente natural.
              </Typography>
            </Box>

            <Box sx={{ mt: 2, p: 1, backgroundColor: 'success.light', borderRadius: 1 }}>
              <Typography variant="caption" color="success.dark">
                <strong>✅ Características:</strong>
                <br />
                • Sin borde visible
                <br />
                • Sin padding interno
                <br />
                • Altura automática
                <br />• Se integra como texto normal
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Editor con borde */}
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" color="primary.main" gutterBottom>
              📝 Editor Con Borde (showToolbar=true)
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Este es el estilo tradicional con borde y toolbar visible:
            </Typography>

            <SimpleTipTapEditorWithFlags content={content2} onChange={setContent2} showToolbar />

            <Box sx={{ mt: 2, p: 1, backgroundColor: 'primary.light', borderRadius: 1 }}>
              <Typography variant="caption" color="primary.dark">
                <strong>📝 Características:</strong>
                <br />
                • Borde visible
                <br />
                • Padding interno
                <br />
                • Altura mínima
                <br />• Toolbar disponible
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Casos de uso */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            🎯 Casos de Uso
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" color="success.main" gutterBottom>
                ✅ showToolbar={false} - Sin Borde
              </Typography>
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                <li>Títulos de newsletter</li>
                <li>Párrafos inline</li>
                <li>Texto de botones</li>
                <li>Subtítulos del header</li>
                <li>Elementos de lista</li>
                <li>Cualquier texto que debe verse natural</li>
              </ul>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" color="primary.main" gutterBottom>
                📝 showToolbar={true} - Con Borde
              </Typography>
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                <li>Editor principal del newsletter</li>
                <li>Editor de contenido largo</li>
                <li>Formularios de texto</li>
                <li>Campos de descripción</li>
                <li>Editores independientes</li>
                <li>Cuando se necesita toolbar</li>
              </ul>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Solución técnica */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            🔧 Solución Técnica Implementada
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Los cambios aplicados para eliminar el borde:
          </Typography>

          <Box sx={{ fontFamily: 'monospace', fontSize: '0.8rem', mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              SimpleTipTapEditorUnified:
            </Typography>
            <pre
              style={{ margin: 0, padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}
            >
              {`sx={{
  border: showToolbar ? '1px solid' : 'none',
  borderColor: showToolbar ? 'divider' : 'transparent',
  borderRadius: showToolbar ? 1 : 0,
  '& .ProseMirror': {
    padding: showToolbar ? '16px' : '0 !important',
    minHeight: showToolbar ? 'inherit' : 'auto',
  },
}}`}
            </pre>
          </Box>

          <Box sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
            <Typography variant="subtitle2" gutterBottom>
              SimpleTipTapEditor:
            </Typography>
            <pre
              style={{ margin: 0, padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}
            >
              {`sx={{
  '& .tiptap-editor': {
    padding: showToolbar ? '8px' : '0 !important',
    border: showToolbar ? undefined : 'none !important',
  },
  '& .ProseMirror': {
    padding: showToolbar ? undefined : '0 !important',
  },
}}`}
            </pre>
          </Box>
        </CardContent>
      </Card>

      {/* Instrucciones de testing */}
      <Alert severity="info">
        <Typography variant="body2">
          <strong>🧪 Cómo Probarlo:</strong>
          <br />
          1. Ve al Newsletter Editor
          <br />
          2. Observa que los títulos, párrafos y botones NO tienen recuadro
          <br />
          3. El texto se ve natural e integrado
          <br />
          4. El formato (bold, color, alineación) sigue funcionando
          <br />
          5. Solo se ve texto puro, sin bordes de editor
        </Typography>
      </Alert>
    </Box>
  );
}

'use client';

import jsPDF from 'jspdf';
import { Icon } from '@iconify/react';
import html2canvas from 'html2canvas';
import { useRef, useState, useEffect } from 'react';

import {
  Box,
  Card,
  Chip,
  Stack,
  Button,
  Dialog,
  Divider,
  IconButton,
  Typography,
  CardContent,
  DialogTitle,
  DialogActions,
  DialogContent,
  LinearProgress,
  CircularProgress,
} from '@mui/material';

import { endpoints, createAxiosInstance } from 'src/utils/axiosInstance';

import type { EditorialAnalysisError, EditorialAnalysisResponse } from '../types';

interface EditorialAnalysisModalProps {
  open: boolean;
  onClose: () => void;
  newsletterTitle: string;
  newsletterHtmlContent: string;
}

const getScoreColor = (score: number) => {
  if (score >= 90) return '#4caf50'; // Verde
  if (score >= 75) return '#ff9800'; // Naranja
  return '#f44336'; // Rojo
};

export default function EditorialAnalysisModal({
  open,
  onClose,
  newsletterTitle,
  newsletterHtmlContent,
}: EditorialAnalysisModalProps) {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<EditorialAnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleAnalyze = async () => {
    // Validar que existe título
    if (!newsletterTitle || newsletterTitle.trim() === '') {
      setError('Por favor, agrega un título al newsletter antes de realizar el análisis');
      return;
    }

    // Validar que existe contenido
    if (!newsletterHtmlContent || newsletterHtmlContent.trim() === '') {
      setError('No hay contenido HTML para analizar');
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const axiosInstance = createAxiosInstance({ isIA: true });
      const response = await axiosInstance.post<EditorialAnalysisResponse>(
        endpoints.seo.analyzeEditorial,
        {
          title: newsletterTitle,
          content: newsletterHtmlContent,
        }
      );

      setAnalysis(response.data);
    } catch (err: any) {
      console.error('Error en análisis editorial:', err);
      setError(
        err.response?.data?.message ||
          err.message ||
          'Error al realizar el análisis. Por favor, intenta nuevamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    if (!contentRef.current || !analysis) return;

    setExporting(true);
    try {
      const element = contentRef.current;

      // Capturar el contenido como canvas
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      // Crear PDF
      const pdf = new jsPDF('p', 'mm', 'a4');

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      // Calcular el ancho de la imagen en el PDF (con márgenes)
      const margin = 10; // márgenes en mm
      const availableWidth = pdfWidth - 2 * margin;
      const availableHeight = pdfHeight - 2 * margin;

      // Calcular la escala para que la imagen encaje en el ancho disponible
      const scale = availableWidth / (imgWidth / 2); // dividir por 2 porque usamos scale: 2 en html2canvas

      // Calcular las dimensiones de la imagen en el PDF
      const imgWidthInPDF = availableWidth;
      const imgHeightInPDF = (imgHeight / 2) * scale; // dividir por 2 porque usamos scale: 2

      // Calcular cuántas páginas se necesitan
      const totalPages = Math.ceil(imgHeightInPDF / availableHeight);

      // Dividir la imagen en múltiples páginas si es necesario
      for (let page = 0; page < totalPages; page += 1) {
        if (page > 0) {
          pdf.addPage();
        }

        // Calcular la posición Y de la porción de la imagen a mostrar
        const sourceY = (page * availableHeight) / scale;
        const sourceHeight = Math.min((availableHeight / scale) * 2, imgHeight - sourceY * 2);

        // Crear un canvas temporal para esta porción
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width;
        pageCanvas.height = sourceHeight;

        const ctx = pageCanvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
          ctx.drawImage(
            canvas,
            0,
            sourceY * 2, // multiplicar por 2 porque usamos scale: 2
            canvas.width,
            sourceHeight,
            0,
            0,
            canvas.width,
            sourceHeight
          );

          const pageImgData = pageCanvas.toDataURL('image/png');
          const pageHeight = Math.min(availableHeight, imgHeightInPDF - page * availableHeight);

          pdf.addImage(pageImgData, 'PNG', margin, margin, imgWidthInPDF, pageHeight);
        }
      }

      // Descargar PDF
      const fileName = `revision-editorial-${newsletterTitle.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
    } catch (err) {
      console.error('Error exportando PDF:', err);
      setError('Error al exportar PDF. Por favor, intenta nuevamente.');
    } finally {
      setExporting(false);
    }
  };

  // Agrupar errores por severidad
  const errorsBySeverity = analysis?.opinion.errores.reduce(
    (acc, errorItem) => {
      acc[errorItem.severidad].push(errorItem);
      return acc;
    },
    { CRÍTICO: [], MODERADO: [], MENOR: [] } as Record<string, EditorialAnalysisError[]>
  ) || { CRÍTICO: [], MODERADO: [], MENOR: [] };

  // Limpiar estado cuando se cierra el modal
  useEffect(() => {
    if (!open) {
      setAnalysis(null);
      setError(null);
      setLoading(false);
    }
  }, [open]);

  // Auto-analizar al abrir el modal si hay título
  useEffect(() => {
    if (open && !analysis && !loading && newsletterTitle && newsletterTitle.trim() !== '') {
      handleAnalyze();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ borderBottom: 1, borderColor: 'divider', pb: 2 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1.5}>
            <Typography variant="h6" fontWeight={600}>
              Análisis Editorial
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary' }}>
            <Icon icon="solar:close-circle-linear" width={24} />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {/* Título del Newsletter */}
        <Box
          sx={{
            mt: 2,
            mb: 2,
            p: 2,
            bgcolor: 'grey.50',
            borderRadius: 1,
            border: 1,
            borderColor: 'divider',
          }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            textTransform="uppercase"
            letterSpacing={0.5}
          >
            Titulo
          </Typography>
          <Typography variant="body1" fontWeight={500} sx={{ mt: 0.5 }}>
            {newsletterTitle || 'Sin título'}
          </Typography>
        </Box>

        {/* Estado de carga */}
        {loading && (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <CircularProgress size={50} thickness={3} />
            <Typography variant="h6" fontWeight={500} sx={{ mt: 3 }}>
              Analizando contenido
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Este proceso puede tardar entre 20-30 segundos
            </Typography>
          </Box>
        )}

        {/* Error */}
        {error && (
          <Card sx={{ border: 1, borderColor: 'error.main', bgcolor: 'error.lighter', mb: 2 }}>
            <CardContent>
              <Stack direction="row" spacing={1.5} alignItems="flex-start">
                <Icon icon="solar:danger-circle-bold" width={24} color="#d32f2f" />
                <Box>
                  <Typography variant="subtitle2" fontWeight={600} color="error.main">
                    Error en el análisis
                  </Typography>
                  <Typography variant="body2" color="error.dark" sx={{ mt: 0.5 }}>
                    {error}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        )}

        {/* Resultados del análisis */}
        {analysis && !loading && (
          <Box ref={contentRef}>
            {/* Score general */}
            <Card sx={{ mb: 3, border: 1, borderColor: 'divider' }}>
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      textTransform="uppercase"
                      letterSpacing={0.5}
                    >
                      Puntuación de calidad
                    </Typography>
                    <Typography variant="h4" fontWeight={700} sx={{ mt: 0.5 }}>
                      {analysis.score}
                      <Typography component="span" variant="h5" color="text.secondary">
                        /100
                      </Typography>
                    </Typography>
                  </Box>
                  <Chip
                    label={
                      analysis.puede_publicar ? 'Aprobado para publicar' : 'Requiere correcciones'
                    }
                    color={analysis.puede_publicar ? 'success' : 'warning'}
                    sx={{
                      fontWeight: 600,
                      px: 2,
                      height: 36,
                    }}
                  />
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={analysis.score}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: getScoreColor(analysis.score),
                      borderRadius: 4,
                    },
                  }}
                />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 1.5, display: 'block' }}
                >
                  Estado: {analysis.estado}
                </Typography>
              </CardContent>
            </Card>

            {/* Resumen de errores */}
            <Card sx={{ mb: 3, border: 1, borderColor: 'divider' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Resumen de hallazgos
                </Typography>
                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                  <Box
                    sx={{
                      flex: 1,
                      textAlign: 'center',
                      p: 2,
                      bgcolor: 'error.lighter',
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="h4" fontWeight={700} color="error.main">
                      {analysis.opinion.resumen.errores_criticos}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="error.dark"
                      textTransform="uppercase"
                      letterSpacing={0.5}
                    >
                      Críticos
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      flex: 1,
                      textAlign: 'center',
                      p: 2,
                      bgcolor: 'warning.lighter',
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="h4" fontWeight={700} color="warning.main">
                      {analysis.opinion.resumen.errores_moderados}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="warning.dark"
                      textTransform="uppercase"
                      letterSpacing={0.5}
                    >
                      Moderados
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      flex: 1,
                      textAlign: 'center',
                      p: 2,
                      bgcolor: 'info.lighter',
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="h4" fontWeight={700} color="info.main">
                      {analysis.opinion.resumen.errores_menores}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="info.dark"
                      textTransform="uppercase"
                      letterSpacing={0.5}
                    >
                      Menores
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* Evaluación y recomendaciones */}
            <Card sx={{ mb: 3, border: 1, borderColor: 'divider' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Evaluación
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 2 }}>
                  {analysis.opinion.resumen.evaluacion}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Recomendaciones
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {analysis.opinion.resumen.recomendaciones}
                </Typography>
              </CardContent>
            </Card>

            {/* Errores por severidad */}
            {['CRÍTICO', 'MODERADO', 'MENOR'].map(
              (severidad) =>
                errorsBySeverity[severidad].length > 0 && (
                  <Box key={severidad} sx={{ mb: 3 }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor:
                            severidad === 'CRÍTICO'
                              ? 'error.main'
                              : severidad === 'MODERADO'
                                ? 'warning.main'
                                : 'info.main',
                        }}
                      />
                      Errores {severidad.toLowerCase()}s ({errorsBySeverity[severidad].length})
                    </Typography>
                    <Stack spacing={2}>
                      {errorsBySeverity[severidad].map((errorItem) => (
                        <Card
                          key={errorItem.numero}
                          sx={{
                            border: 1,
                            borderColor:
                              severidad === 'CRÍTICO'
                                ? 'error.light'
                                : severidad === 'MODERADO'
                                  ? 'warning.light'
                                  : 'info.light',
                            borderLeftWidth: 4,
                          }}
                        >
                          <CardContent sx={{ p: 2.5 }}>
                            <Stack direction="row" spacing={2} alignItems="flex-start">
                              <Box
                                sx={{
                                  minWidth: 32,
                                  height: 32,
                                  borderRadius: 1,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  bgcolor:
                                    severidad === 'CRÍTICO'
                                      ? 'error.lighter'
                                      : severidad === 'MODERADO'
                                        ? 'warning.lighter'
                                        : 'info.lighter',
                                  color:
                                    severidad === 'CRÍTICO'
                                      ? 'error.main'
                                      : severidad === 'MODERADO'
                                        ? 'warning.main'
                                        : 'info.main',
                                  fontWeight: 700,
                                  fontSize: '0.875rem',
                                }}
                              >
                                {errorItem.numero}
                              </Box>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                  {errorItem.tipo}
                                </Typography>
                                <Stack spacing={1.5} sx={{ mt: 1.5 }}>
                                  <Box>
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                      fontWeight={600}
                                      textTransform="uppercase"
                                      letterSpacing={0.5}
                                    >
                                      Problema
                                    </Typography>
                                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                                      {errorItem.problema}
                                    </Typography>
                                  </Box>
                                  <Box>
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                      fontWeight={600}
                                      textTransform="uppercase"
                                      letterSpacing={0.5}
                                    >
                                      Corrección sugerida
                                    </Typography>
                                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                                      {errorItem.correccion}
                                    </Typography>
                                  </Box>
                                  <Box>
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                      fontWeight={600}
                                      textTransform="uppercase"
                                      letterSpacing={0.5}
                                    >
                                      Ubicación
                                    </Typography>
                                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                                      {errorItem.ubicacion}
                                    </Typography>
                                  </Box>
                                  <Box>
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                      fontWeight={600}
                                      textTransform="uppercase"
                                      letterSpacing={0.5}
                                    >
                                      Explicación
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                      sx={{ mt: 0.5 }}
                                    >
                                      {errorItem.explicacion}
                                    </Typography>
                                  </Box>
                                  <Chip
                                    label={errorItem.categoria}
                                    size="small"
                                    variant="outlined"
                                    sx={{ alignSelf: 'flex-start', fontSize: '0.75rem' }}
                                  />
                                </Stack>
                              </Box>
                            </Stack>
                          </CardContent>
                        </Card>
                      ))}
                    </Stack>
                  </Box>
                )
            )}

            {/* Estadísticas */}
            <Card sx={{ border: 1, borderColor: 'divider' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Estadísticas del análisis
                </Typography>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: 3,
                    mt: 2,
                  }}
                >
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      textTransform="uppercase"
                      letterSpacing={0.5}
                    >
                      Tiempo de análisis
                    </Typography>
                    <Typography variant="h6" fontWeight={600} sx={{ mt: 0.5 }}>
                      {analysis.opinion.estadisticas.tiempo_analisis}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      textTransform="uppercase"
                      letterSpacing={0.5}
                    >
                      Palabras analizadas
                    </Typography>
                    <Typography variant="h6" fontWeight={600} sx={{ mt: 0.5 }}>
                      {analysis.opinion.estadisticas.palabras_analizadas}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      textTransform="uppercase"
                      letterSpacing={0.5}
                    >
                      Párrafos revisados
                    </Typography>
                    <Typography variant="h6" fontWeight={600} sx={{ mt: 0.5 }}>
                      {analysis.opinion.estadisticas.parrafos_revisados}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      textTransform="uppercase"
                      letterSpacing={0.5}
                    >
                      Fecha de análisis
                    </Typography>
                    <Typography variant="h6" fontWeight={600} sx={{ mt: 0.5 }}>
                      {new Date(analysis.opinion.estadisticas.timestamp).toLocaleDateString(
                        'es-ES',
                        {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        }
                      )}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, borderTop: 1, borderColor: 'divider' }}>
        <Button onClick={onClose} disabled={loading} sx={{ minWidth: 100 }}>
          Cerrar
        </Button>
        {analysis && !loading && (
          <Button
            variant="contained"
            startIcon={
              exporting ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                <Icon icon="solar:file-download-bold" />
              )
            }
            onClick={handleExportPDF}
            disabled={exporting}
            sx={{ minWidth: 140 }}
          >
            {exporting ? 'Exportando...' : 'Exportar PDF'}
          </Button>
        )}
        {!analysis && !loading && error && (
          <Button
            variant="contained"
            startIcon={<Icon icon="solar:restart-bold" />}
            onClick={handleAnalyze}
            sx={{ minWidth: 140 }}
          >
            Reintentar
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { Box, Card, Alert, Button, Container, Typography, CircularProgress } from '@mui/material';

import { createAxiosInstance } from 'src/utils/axiosInstance';

export default function UnsubscribePage() {
  const params = useParams();
  const router = useRouter();
  const subscriberId = params?.subscriberId as string;

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUnsubscribe = async () => {
    if (!subscriberId) {
      setError('ID de suscriptor no válido');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const axiosInstance = createAxiosInstance();
      await axiosInstance.delete(`/api/v1/subscribers/${subscriberId}`);

      setSuccess(true);
      setError(null);
    } catch (err: any) {
      console.error('Error al cancelar suscripción:', err);
      setError(
        err.response?.data?.message ||
          'Hubo un error al procesar tu solicitud. Por favor intenta nuevamente más tarde.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeepSubscription = () => {
    router.push('/');
  };

  if (success) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Card sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
              ✓ Suscripción Cancelada
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Tu suscripción ha sido cancelada exitosamente. Ya no recibirás más correos
              electrónicos de nuestra parte.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Lamentamos verte partir. Si cambias de opinión, siempre puedes volver a suscribirte.
            </Typography>
            <Button variant="contained" onClick={() => router.push('/')} fullWidth>
              Volver al inicio
            </Button>
          </Card>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Card sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom textAlign="center">
            Cancelar Suscripción
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
            ¿Estás seguro de que deseas cancelar tu suscripción a nuestros correos electrónicos?
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
            Si cancelas tu suscripción, dejarás de recibir actualizaciones, noticias y contenido
            exclusivo de MICHIN.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              variant="contained"
              color="error"
              onClick={handleUnsubscribe}
              disabled={loading}
              fullWidth
              startIcon={loading && <CircularProgress size={20} color="inherit" />}
            >
              {loading ? 'Procesando...' : 'Sí, cancelar suscripción'}
            </Button>

            <Button
              variant="outlined"
              onClick={handleKeepSubscription}
              disabled={loading}
              fullWidth
            >
              No, conservar mi suscripción
            </Button>
          </Box>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 3, display: 'block', textAlign: 'center' }}
          >
            Si tienes alguna pregunta, contáctanos en contactocdmx.michin@gmail.com
          </Typography>
        </Card>
      </Box>
    </Container>
  );
}

'use client';

import React, { useState } from 'react';

import {
  Box,
  Card,
  Chip,
  Grid,
  Switch,
  Button,
  Typography,
  CardContent,
  FormControlLabel,
} from '@mui/material';

import { ROLLOUT_PHASES } from '../../config/feature-flags';
import { useFeatureFlags } from '../../hooks/use-feature-flags';

export default function FeatureFlagsDashboard() {
  const flags = useFeatureFlags();
  const [localOverrides, setLocalOverrides] = useState<Record<string, boolean>>({});

  const handleFlagToggle = (flagName: string, value: boolean) => {
    setLocalOverrides((prev) => ({
      ...prev,
      [flagName]: value,
    }));
    flags.logUsage(flagName as any, value);
  };

  const resetOverrides = () => {
    setLocalOverrides({});
  };

  const applyOverrides = () => {
    // En una implementación real, esto se conectaría a una API para persistir los cambios
    console.log('Aplicando overrides:', localOverrides);
    alert('Feature flags actualizados (solo para esta sesión en desarrollo)');
  };

  const getFlagValue = (flagName: string): boolean =>
    localOverrides[flagName] !== undefined ? localOverrides[flagName] : (flags as any)[flagName];

  const renderFlagCard = (
    title: string,
    description: string,
    flagName: string,
    riskLevel: 'low' | 'medium' | 'high'
  ) => {
    const value = getFlagValue(flagName);
    const isOverridden = localOverrides[flagName] !== undefined;

    const riskColors = {
      low: 'success',
      medium: 'warning',
      high: 'error',
    } as const;

    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              mb: 2,
            }}
          >
            <Typography variant="h6" component="h2">
              {title}
            </Typography>
            <Chip
              size="small"
              label={`Riesgo ${riskLevel}`}
              color={riskColors[riskLevel]}
              variant="outlined"
            />
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {description}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormControlLabel
              control={
                <Switch
                  checked={value}
                  onChange={(e) => handleFlagToggle(flagName, e.target.checked)}
                  color={value ? 'success' : 'default'}
                />
              }
              label={value ? 'Activado' : 'Desactivado'}
            />
            {isOverridden && <Chip size="small" label="Override" color="info" variant="filled" />}
          </Box>

          <Typography variant="caption" color="text.secondary">
            Flag: <code>{flagName}</code>
          </Typography>
        </CardContent>
      </Card>
    );
  };

  const renderRolloutPhase = (phase: any, index: number) => (
    <Card key={index} sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {phase.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Duración: {phase.duration} | Target: {phase.targetPercentage}% usuarios
        </Typography>

        <Typography variant="subtitle2" gutterBottom>
          Flags involucrados:
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          {phase.flags.map((flag: string) => (
            <Chip
              key={flag}
              size="small"
              label={flag}
              variant="outlined"
              color={getFlagValue(flag) ? 'success' : 'default'}
            />
          ))}
        </Box>

        <Typography variant="subtitle2" gutterBottom>
          Criterios de éxito:
        </Typography>
        <ul>
          {phase.successCriteria.map((criteria: string, i: number) => (
            <li key={i}>
              <Typography variant="body2" color="text.secondary">
                {criteria}
              </Typography>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        🎛️ Feature Flags Dashboard - Adam-Pro Editor
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Panel de control para gestionar la migración gradual de editores al sistema unificado. Los
        cambios aquí son solo para desarrollo/testing.
      </Typography>

      {/* Controles generales */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box
            sx={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'space-between' }}
          >
            <Box>
              <Typography variant="h6">Ambiente: {process.env.NODE_ENV}</Typography>
              <Typography variant="body2" color="text.secondary">
                A/B Testing: {flags.enableABTesting ? 'Activo' : 'Inactivo'}
                {flags.enableABTesting && ` (${flags.abTestingPercentage}%)`}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="outlined" onClick={resetOverrides}>
                Reset
              </Button>
              <Button variant="contained" onClick={applyOverrides}>
                Aplicar Cambios
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Feature Flags por categoría */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        📧 Editores Newsletter
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          {renderFlagCard(
            'TiptapEditor Unificado',
            'Editor básico de newsletter con funcionalidad esencial',
            'useUnifiedTiptapEditor',
            'low'
          )}
        </Grid>
        <Grid item xs={12} md={4}>
          {renderFlagCard(
            'SimpleTiptapEditor Unificado',
            'Editor simple con funcionalidad mínima',
            'useUnifiedSimpleTiptapEditor',
            'low'
          )}
        </Grid>
        <Grid item xs={12} md={4}>
          {renderFlagCard(
            'TiptapEditorComponent Unificado',
            'Editor especializado para componentes (heading, button)',
            'useUnifiedTiptapEditorComponent',
            'medium'
          )}
        </Grid>
      </Grid>

      <Typography variant="h5" gutterBottom>
        🎓 Editores Educación
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          {renderFlagCard(
            'ExtendedTiptapEditor Unificado',
            'Editor base para contenido educativo con auto-heading',
            'useUnifiedExtendedTiptapEditor',
            'medium'
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          {renderFlagCard(
            'EducacionEditor Completo',
            'Sistema completo de educación con múltiples componentes',
            'useUnifiedEducacionEditor',
            'high'
          )}
        </Grid>
      </Grid>

      <Typography variant="h5" gutterBottom>
        📝 Editor Principal
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          {renderFlagCard(
            'Editor Principal Unificado',
            'Editor principal con todas las funcionalidades avanzadas (fullscreen, syntax highlighting)',
            'useUnifiedMainEditor',
            'high'
          )}
        </Grid>
      </Grid>

      <Typography variant="h5" gutterBottom>
        ⚙️ Funcionalidades Adicionales
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          {renderFlagCard(
            'Metadata Automática',
            'Análisis automático de contenido (palabras, tiempo lectura)',
            'enableEditorMetadata',
            'low'
          )}
        </Grid>
        <Grid item xs={12} md={4}>
          {renderFlagCard(
            'Auto-save',
            'Guardado automático de contenido',
            'enableAutoSave',
            'medium'
          )}
        </Grid>
        <Grid item xs={12} md={4}>
          {renderFlagCard(
            'Toolbar Avanzada',
            'Toolbar con herramientas adicionales',
            'enableAdvancedToolbar',
            'low'
          )}
        </Grid>
      </Grid>

      {/* Plan de Rollout */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        📈 Plan de Rollout por Fases
      </Typography>

      {Object.values(ROLLOUT_PHASES).map((phase, index) => renderRolloutPhase(phase, index))}

      {/* Información adicional */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            ℹ️ Información de Uso
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • En <strong>desarrollo</strong>: Los feature flags se pueden modificar libremente para
            testing
            <br />• En <strong>staging</strong>: A/B testing activo con porcentaje controlado de
            usuarios
            <br />• En <strong>producción</strong>: Rollout conservador con monitoreo de métricas
            <br />
            • Los overrides locales solo afectan esta sesión de desarrollo
            <br />• Los cambios en producción requieren deploy de configuración
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

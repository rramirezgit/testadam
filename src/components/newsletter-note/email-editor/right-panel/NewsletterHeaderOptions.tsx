'use client';

import React from 'react';
import { Icon } from '@iconify/react';

import {
  Box,
  TextField,
  Accordion,
  Typography,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';

import { getHeaderConfig } from '../constants/newsletter-header-variants';

interface NewsletterHeaderOptionsProps {
  selectedComponentId: string;
  selectedComponent: any;
  updateComponentProps: (
    id: string,
    props: Record<string, any>,
    options?: { content?: string }
  ) => void;
  updateComponentStyle: (id: string, style: React.CSSProperties) => void;
}

export default function NewsletterHeaderOptions({
  selectedComponentId,
  selectedComponent,
  updateComponentProps,
}: NewsletterHeaderOptionsProps) {
  const props = selectedComponent?.props || {};
  const config = getHeaderConfig();

  const handlePropChange = (key: string, value: any) => {
    updateComponentProps(selectedComponentId, { [key]: value });
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Configuración del Header
      </Typography>

      {/* Contenido Básico */}
      <Accordion defaultExpanded disableGutters sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<Icon icon="mdi:chevron-down" />}>
          <Typography variant="subtitle2">Contenido</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TextField
            fullWidth
            label="Título"
            value={props.title || ''}
            onChange={(e) => handlePropChange('title', e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Subtítulo"
            value={props.subtitle || ''}
            onChange={(e) => handlePropChange('subtitle', e.target.value)}
          />
        </AccordionDetails>
      </Accordion>

      {/* Estilos */}
      <Accordion disableGutters sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<Icon icon="mdi:chevron-down" />}>
          <Typography variant="subtitle2">Estilos</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TextField
            fullWidth
            label="Color de Texto"
            value={props.textColor || config.textColor}
            onChange={(e) => handlePropChange('textColor', e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            type="number"
            label="Padding"
            value={props.padding || config.padding}
            onChange={(e) => handlePropChange('padding', Number(e.target.value))}
          />
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}

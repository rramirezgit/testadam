'use client';

import React, { useState } from 'react';

import {
  Box,
  Grid,
  Card,
  Button,
  Dialog,
  Typography,
  CardContent,
  DialogContent,
  DialogActions,
} from '@mui/material';

interface TemplateModalProps {
  open: boolean;
  onClose: () => void;
  emailTemplates: {
    id: string;
    name: string;
    description: string;
    image?: string;
    icon?: React.ReactNode;
  }[];
  activeTemplate: string;
  onTemplateSelect: (templateId: string) => void;
  excludeTemplates?: string[]; // Templates a excluir del modal
}

export default function TemplateModal({
  open,
  onClose,
  emailTemplates,
  activeTemplate,
  onTemplateSelect,
  excludeTemplates = [],
}: TemplateModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  // Filtrar templates excluidos
  const filteredTemplates = emailTemplates.filter(
    (template) => !excludeTemplates.includes(template.id)
  );

  const handleTemplateClick = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const handleAccept = () => {
    if (selectedTemplate) {
      onTemplateSelect(selectedTemplate);
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedTemplate(''); // Reset selection
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          maxHeight: '90vh',
          borderRadius: 3,
        },
      }}
    >
      <Box sx={{ pt: 3, px: 3, pb: 1 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 500,
            color: '#2c3e50',
          }}
        >
          Elige una plantilla para empezar
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            fontSize: '14px',
            lineHeight: 1.5,
            color: '#7f8c8d',
            mb: 1,
          }}
        >
          Encuentra el diseño que mejor se adapta al contenido de tu web o newsletter.
        </Typography>
      </Box>

      <DialogContent sx={{ pt: 2, pb: 2 }}>
        <Grid container spacing={3}>
          {filteredTemplates.map((template) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={template.id}>
              <Card
                onClick={() => handleTemplateClick(template.id)}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  borderRadius: 2,
                  border: selectedTemplate === template.id ? '1px solid #667eea' : 'none',
                  '&:hover': {
                    boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                  },
                  backgroundColor: 'white',
                }}
              >
                <Box
                  sx={{
                    height: 103,
                    background:
                      'linear-gradient(135deg, rgba(163, 0, 255, 0.10) 0%, rgba(44, 0, 255, 0.10) 51.14%, rgba(0, 175, 255, 0.10) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: '8px 8px 0 0',
                  }}
                >
                  {template.icon && (
                    <Box
                      sx={(theme) => ({
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        '& svg': {
                          stroke: theme.palette.primary.main,
                          strokeWidth: selectedTemplate === template.id ? 2 : 1,
                        },
                      })}
                    >
                      {template.icon}
                    </Box>
                  )}
                  {template.image && template.image.startsWith('/') && (
                    <Box
                      component="img"
                      src={template.image}
                      alt={template.name}
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        opacity: 0.2,
                      }}
                    />
                  )}
                </Box>
                <CardContent sx={{ p: 2.5, textAlign: 'start' }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      color: selectedTemplate === template.id ? 'primary.main' : 'text.primary',
                    }}
                  >
                    {template.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      fontSize: '0.875rem',
                      lineHeight: 1.5,
                      color: '#7f8c8d',
                    }}
                  >
                    {template.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          color="primary"
          sx={{
            width: '120px',
            height: '50px',
          }}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAccept}
          disabled={!selectedTemplate}
          sx={{
            width: '120px',
            height: '50px',

            '&:disabled': {
              backgroundColor: '#ccc',
              color: '#666',
            },
          }}
        >
          Aceptar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

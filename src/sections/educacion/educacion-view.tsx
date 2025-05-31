'use client';

import type { SavedEducacion } from 'src/types/saved-educacion';

import Image from 'next/image';
import { useState, useEffect } from 'react';

import {
  Box,
  Tab,
  Tabs,
  Button,
  Dialog,
  TextField,
  Typography,
  InputAdornment,
  CircularProgress,
} from '@mui/material';

import { useStore } from 'src/lib/store';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { EducacionGrid, EducacionEditor } from 'src/components/educacion';

type Tab = {
  label: string;
  value: string;
};

const TABS: Tab[] = [
  {
    label: 'Borrador',
    value: 'DRAFT',
  },
  {
    label: 'Publicado',
    value: 'PUBLISHED',
  },
  {
    label: 'Archivado',
    value: 'ARCHIVED',
  },
];

export default function EducacionView() {
  const [openEditor, setOpenEditor] = useState(false);
  const [currentEducacion, setCurrentEducacion] = useState<SavedEducacion | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('DRAFT');

  // Use global state from Zustand
  const { educaciones, loadEducaciones, deleteEducacion } = useStore();

  // Load saved educaciones on component mount
  useEffect(() => {
    const loadData = () => {
      loadEducaciones();
      setLoading(false);
    };

    loadData();

    // Add event listener to refresh data when storage changes
    window.addEventListener('storage', loadData);

    return () => {
      window.removeEventListener('storage', loadData);
    };
  }, [loadEducaciones]);

  // Refresh data when editor is closed
  useEffect(() => {
    if (!openEditor) {
      loadEducaciones();
    }
  }, [openEditor, loadEducaciones]);

  const handleOpenEditor = (educacion?: SavedEducacion) => {
    if (educacion) {
      setCurrentEducacion(educacion);
    } else {
      setCurrentEducacion(null);
    }
    setOpenEditor(true);
  };

  const handleCloseEditor = () => {
    setOpenEditor(false);
    setCurrentEducacion(null);
  };

  const handleDeleteEducacion = (educacionId: string) => {
    deleteEducacion(educacionId);
  };

  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue);
  };

  return (
    <DashboardContent>
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <CustomBreadcrumbs
          heading="Educación"
          subheading="Crea, personaliza y publica tu contenido educativo"
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <Box
          sx={{
            gap: 3,
            display: 'flex',
            mb: { xs: 3, md: 5 },
            justifyContent: 'space-between',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-end', sm: 'center' },
          }}
        >
          <TextField
            placeholder="Buscar contenido de educación..."
            name="search-educacion"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="eva:search-fill" sx={{ ml: 1, color: 'text.disabled' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <>
                    {loading ? (
                      <CircularProgress size={18} color="inherit" sx={{ mr: -3 }} />
                    ) : null}
                  </>
                ),
              },
            }}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              sx={{
                height: '50px',
                background: 'linear-gradient(90deg, #4DBCFB 0%, #DD26FD 100%)',
              }}
            >
              <Image
                src="/assets/icons/apps/ic-ai.svg"
                alt="AI"
                width={24}
                height={24}
                style={{ marginRight: '8px' }}
              />
              Crear con AI
            </Button>
            <Button variant="contained" color="primary" onClick={() => handleOpenEditor()}>
              <Iconify icon="mingcute:add-line" style={{ marginRight: '8px' }} />
              Crear nota de educación
            </Button>
          </Box>
        </Box>

        <Tabs value={tab} onChange={handleChangeTab} sx={{ mb: { xs: 3, md: 5 } }}>
          {TABS.map((tabItem: Tab) => (
            <Tab key={tabItem.value} label={tabItem.label} value={tabItem.value} />
          ))}
        </Tabs>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <Typography>Cargando contenido educativo...</Typography>
          </Box>
        ) : (
          <EducacionGrid
            educaciones={educaciones || []}
            onOpenEducacion={handleOpenEditor}
            onDeleteEducacion={handleDeleteEducacion}
            onCreateNew={() => handleOpenEditor()}
          />
        )}

        {/* Educacion Editor Dialog */}
        <Dialog fullScreen open={openEditor} onClose={handleCloseEditor}>
          <EducacionEditor onClose={handleCloseEditor} initialEducacion={currentEducacion} />
        </Dialog>
      </Box>
    </DashboardContent>
  );
}

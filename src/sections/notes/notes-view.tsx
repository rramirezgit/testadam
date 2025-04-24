'use client';

// import type { SavedNote } from 'src/types/saved-note';
// import type { Newsletter } from 'src/types/newsletter';

import type { SavedNote } from 'src/types/saved-note';

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
import NotesGrid from 'src/components/newsletter-note/notes-grid';
import EmailEditor from 'src/components/newsletter-note/email-editor';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

type Tab = {
  label: string;
  value: string;
};

const TABS: Tab[] = [
  {
    label: 'Borradores',
    value: 'DRAFT',
  },
  {
    label: 'Review',
    value: 'REVIEW',
  },
  {
    label: 'Aprobados',
    value: 'APPROVED',
  },
  {
    label: 'ADAC',
    value: 'PUBLISHED',
  },
];

export default function NotesView() {
  const [openEditor, setOpenEditor] = useState(false);
  const [currentNote, setCurrentNote] = useState<SavedNote | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('DRAFT');

  // Use global state from Zustand
  const { notes, loadNotes, deleteNote } = useStore();

  // Load saved notes on component mount
  useEffect(() => {
    const loadData = () => {
      loadNotes();
      setLoading(false);
    };

    loadData();

    // Add event listener to refresh data when storage changes
    window.addEventListener('storage', loadData);

    return () => {
      window.removeEventListener('storage', loadData);
    };
  }, [loadNotes]);

  // Refresh data when editor is closed
  useEffect(() => {
    if (!openEditor) {
      loadNotes();
    }
  }, [openEditor, loadNotes]);

  const handleOpenEditor = (note?: SavedNote) => {
    if (note) {
      setCurrentNote(note);
    } else {
      setCurrentNote(null);
    }
    setOpenEditor(true);
  };

  const handleCloseEditor = () => {
    setOpenEditor(false);
    setCurrentNote(null);
  };

  const handleDeleteNote = (noteId: string) => {
    deleteNote(noteId);
  };

  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue);
  };

  return (
    <DashboardContent>
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <CustomBreadcrumbs
          heading="Notas"
          subheading="Crea, personaliza y publica tus notas en ADAC"
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
            placeholder="Search..."
            name="search-note"
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
              Crear Nota
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
            <Typography>Loading your templates...</Typography>
          </Box>
        ) : (
          <NotesGrid
            notes={notes}
            onOpenNote={handleOpenEditor}
            onDeleteNote={handleDeleteNote}
            onCreateNew={() => handleOpenEditor()}
          />
        )}

        {/* Email Editor Dialog */}
        <Dialog fullScreen open={openEditor} onClose={handleCloseEditor}>
          <EmailEditor onClose={handleCloseEditor} initialNote={currentNote} />
        </Dialog>
      </Box>
    </DashboardContent>
  );
}

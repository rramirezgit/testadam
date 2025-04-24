'use client';

// import type { SavedNote } from 'src/types/saved-note';
// import type { Newsletter } from 'src/types/newsletter';

import type { SavedNote } from 'src/types/saved-note';
import type { Newsletter } from 'src/types/newsletter';

import Image from 'next/image';
import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';

import {
  Box,
  Tab,
  Grid,
  Tabs,
  Button,
  Dialog,
  TextField,
  Typography,
  InputAdornment,
  CircularProgress,
} from '@mui/material';

import { useStore } from 'src/lib/store';
import { DashboardContent } from 'src/layouts/dashboard/content';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import NewsletterCard from 'src/components/newsletter-note/newsletter-card';
import NewsletterEditor from 'src/components/newsletter-note/newsletter-editor';

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

export default function NewsletterView() {
  const [openEditor, setOpenEditor] = useState(false);
  const [openNewsletterEditor, setOpenNewsletterEditor] = useState(false);
  const [currentNote, setCurrentNote] = useState<SavedNote | null>(null);
  const [currentNewsletter, setCurrentNewsletter] = useState<Newsletter | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [tab, setTab] = useState('DRAFT');

  // Use global state from Zustand
  const { notes, newsletters, loadNotes, loadNewsletters, deleteNote, deleteNewsletter } =
    useStore();

  // Load saved notes and newsletters on component mount
  useEffect(() => {
    const loadData = () => {
      loadNotes();
      loadNewsletters();
      setLoading(false);
    };

    loadData();

    // Add event listener to refresh data when storage changes
    window.addEventListener('storage', loadData);

    return () => {
      window.removeEventListener('storage', loadData);
    };
  }, [loadNotes, loadNewsletters]);

  // Refresh data when editors are closed
  useEffect(() => {
    if (!openEditor && !openNewsletterEditor) {
      loadNotes();
      loadNewsletters();
    }
  }, [openEditor, openNewsletterEditor, loadNotes, loadNewsletters]);

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

  const handleOpenNewsletterEditor = (newsletter?: Newsletter) => {
    if (newsletter) {
      setCurrentNewsletter(newsletter);
    } else {
      setCurrentNewsletter(null);
    }
    setOpenNewsletterEditor(true);
  };

  const handleCloseNewsletterEditor = () => {
    setOpenNewsletterEditor(false);
    setCurrentNewsletter(null);
  };

  const handleDeleteNote = (noteId: string) => {
    deleteNote(noteId);
  };

  const handleDeleteNewsletter = (newsletterId: string) => {
    deleteNewsletter(newsletterId);
  };

  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue);
  };

  return (
    <DashboardContent>
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <CustomBreadcrumbs
          heading="Newsletters"
          subheading="Crea, personaliza y envía tus newsletters"
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
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleOpenNewsletterEditor()}
            >
              <Iconify icon="mingcute:add-line" style={{ marginRight: '8px' }} />
              Crear Newsletter
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
            <Typography>Loading your newsletters...</Typography>
          </Box>
        ) : newsletters.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 8,
              textAlign: 'center',
            }}
          >
            <Icon
              icon="mdi:email-newsletter"
              style={{ fontSize: 64, marginBottom: 16, opacity: 0.5 }}
            />
            <Typography variant="h5" gutterBottom>
              No newsletters yet
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 500 }}>
              Create your first newsletter by combining your email templates.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Icon icon="mdi:plus" />}
              onClick={() => handleOpenNewsletterEditor()}
            >
              Create New Newsletter
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {newsletters.map((newsletter) => (
              <Grid key={newsletter.id} component="div">
                <NewsletterCard
                  newsletter={newsletter}
                  onOpen={handleOpenNewsletterEditor}
                  onDelete={handleDeleteNewsletter}
                />
              </Grid>
            ))}
          </Grid>
        )}

        {/* Newsletter Editor Dialog */}
        <Dialog fullScreen open={openNewsletterEditor} onClose={handleCloseNewsletterEditor}>
          <NewsletterEditor
            onClose={handleCloseNewsletterEditor}
            initialNewsletter={currentNewsletter}
          />
        </Dialog>
      </Box>
    </DashboardContent>
  );
}

'use client';

// import type { SavedNote } from 'src/types/saved-note';
// import type { Newsletter } from 'src/types/newsletter';

import type { SavedNote } from 'src/types/saved-note';
import type { Newsletter } from 'src/types/newsletter';

import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';

import { createTheme } from '@mui/material/styles';
import { Box, Grid, Button, Dialog, AppBar, Toolbar, Container, Typography } from '@mui/material';

import { useStore } from 'src/lib/store';

import NotesGrid from 'src/components/newsletter-note/notes-grid';
import EmailEditor from 'src/components/newsletter-note/email-editor';
import NewsletterCard from 'src/components/newsletter-note/newsletter-card';
import NewsletterEditor from 'src/components/newsletter-note/newsletter-editor';

// Crear tema personalizado
const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
  },
  typography: {
    fontFamily: '"Public Sans", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

export default function Home() {
  const [openEditor, setOpenEditor] = useState(false);
  const [openNewsletterEditor, setOpenNewsletterEditor] = useState(false);
  const [currentNote, setCurrentNote] = useState<SavedNote | null>(null);
  const [currentNewsletter, setCurrentNewsletter] = useState<Newsletter | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

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

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Email Template Editor
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<Icon icon="mdi:email-newsletter" />}
            onClick={() => handleOpenNewsletterEditor()}
            sx={{ mr: 2 }}
          >
            New Newsletter
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Icon icon="mdi:plus" />}
            onClick={() => handleOpenEditor()}
          >
            New Template
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4, flexGrow: 1 }}>
        <Box sx={{ display: 'flex', mb: 4, width: '100%' }}>
          <Button
            variant={activeTab === 0 ? 'contained' : 'outlined'}
            onClick={() => setActiveTab(0)}
            sx={{
              flex: 1,
              py: 1.5,
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
            }}
            startIcon={<Icon icon="mdi:note-multiple" />}
          >
            Email Templates
          </Button>
          <Button
            variant={activeTab === 1 ? 'contained' : 'outlined'}
            onClick={() => setActiveTab(1)}
            sx={{
              flex: 1,
              py: 1.5,
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
            }}
            startIcon={<Icon icon="mdi:email-newsletter" />}
          >
            Newsletters
          </Button>
        </Box>

        {activeTab === 0 && (
          <>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                Your Email Templates
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Create, edit and manage your email templates. Click on a template to edit it or
                create a new one.
              </Typography>
            </Box>

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
          </>
        )}

        {activeTab === 1 && (
          <>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                Your Newsletters
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Create newsletters by combining your email templates. Click on a newsletter to edit
                it or create a new one.
              </Typography>
            </Box>

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
          </>
        )}
      </Container>

      {/* Email Editor Dialog */}
      <Dialog fullScreen open={openEditor} onClose={handleCloseEditor}>
        <EmailEditor onClose={handleCloseEditor} initialNote={currentNote} />
      </Dialog>

      {/* Newsletter Editor Dialog */}
      <Dialog fullScreen open={openNewsletterEditor} onClose={handleCloseNewsletterEditor}>
        <NewsletterEditor
          onClose={handleCloseNewsletterEditor}
          initialNewsletter={currentNewsletter}
        />
      </Dialog>
    </Box>
  );
}

'use client';

import type { SavedNote } from 'src/types/saved-note';
import type { Newsletter, NewsletterNote } from 'src/types/newsletter';

import { v4 as uuidv4 } from 'uuid';
import { Icon } from '@iconify/react';
import React, { useState, useEffect } from 'react';

import {
  Box,
  Chip,
  Grid,
  Paper,
  AppBar,
  Button,
  Dialog,
  Toolbar,
  Divider,
  TextField,
  Typography,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';

import { useStore } from 'src/lib/store';

import EmailEditor from 'src/components/newsletter-note/email-editor';

// Custom Snackbar component
const CustomSnackbar = ({
  open,
  message,
  severity,
  onClose,
}: {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'info' | 'warning';
  onClose: () => void;
}) => {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        onClose();
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [open, onClose]);

  if (!open) return null;

  const bgColor =
    severity === 'success'
      ? '#4caf50'
      : severity === 'error'
        ? '#f44336'
        : severity === 'warning'
          ? '#ff9800'
          : '#2196f3';

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: bgColor,
        color: 'white',
        padding: '8px 16px',
        borderRadius: '4px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
        zIndex: 1400,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <span>{message}</span>
      <IconButton size="small" style={{ marginLeft: '8px', color: 'white' }} onClick={onClose}>
        <Icon icon="mdi:close" />
      </IconButton>
    </div>
  );
};

interface NewsletterEditorProps {
  onClose: () => void;
  initialNewsletter?: Newsletter | null;
}

export default function NewsletterEditor({ onClose, initialNewsletter }: NewsletterEditorProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedNotes, setSelectedNotes] = useState<NewsletterNote[]>([]);
  const [editingNote, setEditingNote] = useState<SavedNote | null>(null);
  const [openNoteEditor, setOpenNoteEditor] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditingExisting, setIsEditingExisting] = useState(false);
  const [newsletterId, setNewsletterId] = useState<string>('');
  const [activeTab, setActiveTab] = useState('content');
  const [sidebarTab, setSidebarTab] = useState('notes');
  const [isCreatingNewNote, setIsCreatingNewNote] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    'success' | 'error' | 'info' | 'warning'
  >('success');
  const [generatedHtml, setGeneratedHtml] = useState('');
  const [openHtmlPreview, setOpenHtmlPreview] = useState(false);
  const [generating, setGenerating] = useState(false);

  const [header, setHeader] = useState({
    title: '',
    subtitle: 'Your weekly newsletter',
    logo: '',
    bannerImage: '',
    backgroundColor: '#3f51b5',
    textColor: '#ffffff',
    alignment: 'center',
  });

  const [footer, setFooter] = useState({
    companyName: 'Your Company',
    address: '123 Main St, City, Country',
    contactEmail: 'contact@example.com',
    socialLinks: [
      { platform: 'twitter', url: 'https://twitter.com' },
      { platform: 'facebook', url: 'https://facebook.com' },
      { platform: 'instagram', url: 'https://instagram.com' },
    ],
    unsubscribeLink: '#unsubscribe',
    backgroundColor: '#f5f5f5',
    textColor: '#666666',
  });

  const [openHeaderDialog, setOpenHeaderDialog] = useState(false);
  const [openFooterDialog, setOpenFooterDialog] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');
  const [bannerImageUrl, setBannerImageUrl] = useState('');
  const [openLogoDialog, setOpenLogoDialog] = useState(false);
  const [openBannerDialog, setOpenBannerDialog] = useState(false);

  // Use Zustand store
  const {
    addNewsletter,
    updateNewsletter,
    selectedNotes: storeSelectedNotes,
    setSelectedNotes: setStoreSelectedNotes,
    notes,
    loadNotes,
  } = useStore();

  // Load notes on component mount
  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  // Load initial newsletter if provided
  useEffect(() => {
    if (initialNewsletter) {
      setTitle(initialNewsletter.title);
      setDescription(initialNewsletter.description || '');
      setSelectedNotes(initialNewsletter.notes);
      setIsEditingExisting(true);
      setNewsletterId(initialNewsletter.id);

      // Load header and footer if available
      if (initialNewsletter.header) {
        setHeader(initialNewsletter.header);
      }

      if (initialNewsletter.footer) {
        setFooter(initialNewsletter.footer);
      }
    } else {
      // If creating a new newsletter, use the selected notes from the store
      if (storeSelectedNotes.length > 0) {
        setSelectedNotes(storeSelectedNotes);
      }
      setNewsletterId(uuidv4());
    }
  }, [initialNewsletter, storeSelectedNotes]);

  const handleAddNote = (note: NewsletterNote) => {
    setSelectedNotes((prev) => [...prev, note]);
    showSnackbar('Note added to newsletter', 'success');
  };

  const handleRemoveNote = (noteId: string) => {
    setSelectedNotes((prev) => prev.filter((note) => note.noteId !== noteId));
    showSnackbar('Note removed from newsletter', 'info');
  };

  const handleMoveNote = (noteId: string, direction: 'up' | 'down') => {
    const noteIndex = selectedNotes.findIndex((note) => note.noteId === noteId);
    if (noteIndex === -1) return;

    const newNotes = [...selectedNotes];
    const noteToMove = newNotes[noteIndex];

    if (direction === 'up' && noteIndex > 0) {
      newNotes[noteIndex] = newNotes[noteIndex - 1];
      newNotes[noteIndex - 1] = noteToMove;
    } else if (direction === 'down' && noteIndex < newNotes.length - 1) {
      newNotes[noteIndex] = newNotes[noteIndex + 1];
      newNotes[noteIndex + 1] = noteToMove;
    }

    // Update order property
    const updatedNotes = newNotes.map((note, index) => ({
      ...note,
      order: index,
    }));

    setSelectedNotes(updatedNotes);
  };

  const handleEditNote = (note: SavedNote) => {
    setEditingNote(note);
    setIsCreatingNewNote(false);
    setOpenNoteEditor(true);
  };

  const handleCreateNewNote = () => {
    setEditingNote(null);
    setIsCreatingNewNote(true);
    setOpenNoteEditor(true);
  };

  const handleSaveNote = (updatedNote: SavedNote) => {
    if (isCreatingNewNote) {
      // Add the new note to the newsletter
      const newNewsletterNote: NewsletterNote = {
        noteId: updatedNote.id,
        order: selectedNotes.length,
        noteData: updatedNote,
      };
      setSelectedNotes((prev) => [...prev, newNewsletterNote]);
      showSnackbar('New note created and added to newsletter', 'success');
    } else {
      // Update the existing note in the selected notes array
      setSelectedNotes((prev) =>
        prev.map((note) =>
          note.noteId === updatedNote.id
            ? {
                ...note,
                noteData: updatedNote,
              }
            : note
        )
      );
      showSnackbar('Note updated successfully', 'success');
    }

    setOpenNoteEditor(false);
    setEditingNote(null);
    setIsCreatingNewNote(false);

    // Refresh notes
    loadNotes();
  };

  const handleSaveNewsletter = () => {
    if (!title.trim()) {
      showSnackbar('Please enter a newsletter title', 'error');
      return;
    }

    if (selectedNotes.length === 0) {
      showSnackbar('Please add at least one note to the newsletter', 'error');
      return;
    }

    setIsSaving(true);

    try {
      // Use the notes-based newsletter
      const newsletter: Newsletter = {
        id: isEditingExisting ? newsletterId : uuidv4(),
        title: title.trim(),
        description: description.trim(),
        notes: selectedNotes,
        dateCreated: isEditingExisting
          ? initialNewsletter?.dateCreated || new Date().toISOString()
          : new Date().toISOString(),
        dateModified: new Date().toISOString(),
        // Include header and footer
        header,
        footer,
        // Preserve any content and design from the initial newsletter
        content: initialNewsletter?.content,
        design: initialNewsletter?.design,
      };

      if (isEditingExisting) {
        updateNewsletter(newsletter);
      } else {
        addNewsletter(newsletter);
        // Clear selected notes in the store after saving
        setStoreSelectedNotes([]);
      }

      showSnackbar('Newsletter saved successfully', 'success');

      // Close after a short delay to allow the snackbar to be seen
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.error('Error saving newsletter:', error);
      showSnackbar('An error occurred while saving the newsletter', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  // Función para generar el HTML de una nota individual
  const generateNoteHtml = (note: SavedNote) => {
    let noteHtml = '';

    // Determinar el estilo de fondo para esta nota
    let backgroundStyle = '';
    let textColorStyle = '';

    if (note.selectedBanner) {
      // Para imágenes de fondo
      backgroundStyle = `background-image: url('${note.selectedBanner}'); background-size: cover; background-position: center;`;
      textColorStyle = 'color: #ffffff; text-shadow: 0 1px 3px rgba(0,0,0,0.5);';
    } else if (note.showGradient && note.gradientColors && note.gradientColors.length >= 2) {
      // Para gradientes
      backgroundStyle = `background: linear-gradient(to bottom, ${note.gradientColors[0]}, ${note.gradientColors[1]});`;
      // Determinar si el gradiente es oscuro para usar texto claro
      const isFirstColorDark = isColorDark(note.gradientColors[0]);
      const isSecondColorDark = isColorDark(note.gradientColors[1]);
      if (isFirstColorDark || isSecondColorDark) {
        textColorStyle = 'color: #ffffff;';
      }
    } else if (note.emailBackground) {
      // Para colores sólidos
      backgroundStyle = `background-color: ${note.emailBackground};`;
      // Determinar si el color es oscuro para usar texto claro
      if (isColorDark(note.emailBackground)) {
        textColorStyle = 'color: #ffffff;';
      }
    } else {
      backgroundStyle = 'background-color: #ffffff;';
    }

    // Abrir el contenedor de la nota con su estilo de fondo
    noteHtml += `<div class="note-container" style="${backgroundStyle} ${textColorStyle} padding: 20px; margin-bottom: 30px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">`;
    noteHtml += `<div class="note-title" style="font-size: 20px; font-weight: bold; margin-bottom: 15px;">${note.title || 'Untitled Note'}</div>`;

    // Procesar cada componente en la nota
    note.objdata.forEach((component) => {
      switch (component.type) {
        case 'category':
          const categoryColors = Array.isArray(component.props?.color)
            ? component.props.color
            : [component.props?.color || '#4caf50'];
          const categoryItems = component.props?.items || [component.content];

          noteHtml += `<div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px;">\n`;
          categoryItems.forEach((item, index) => {
            const itemColor = categoryColors[index % categoryColors.length] || '#4caf50';
            noteHtml += `<div style="display: inline-block; background-color: ${itemColor}; color: white; padding: 4px 12px; border-radius: 16px; font-size: 14px;">${item}</div>\n`;
          });
          noteHtml += `</div>\n`;
          break;
        case 'heading':
          const level = component.props?.level || 2;
          noteHtml += `<h${level} style="margin: 15px 0; font-size: ${24 - level * 2}px;">${component.content}</h${level}>\n`;
          break;
        case 'paragraph':
          if (component.props?.isCode) {
            noteHtml += `<div style="background-color: rgba(244, 244, 244, 0.8); padding: 16px; border-radius: 5px; border: 1px solid #eee; color: #333; font-family: monospace;">${component.content}</div>\n`;
          } else {
            noteHtml += `<p style="margin: 10px 0;">${component.content}</p>\n`;
          }
          break;
        case 'button':
          noteHtml += `<a href="#" style="display: inline-block; background-color: #3f51b5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin: 10px 0;">${component.content}</a>\n`;
          break;
        case 'divider':
          noteHtml += `<hr style="border: 0; border-top: 1px solid rgba(238, 238, 238, 0.4); margin: 20px 0;">\n`;
          break;
        case 'bulletList':
          const items = component.props?.items || [];
          noteHtml += `<ul style="padding-left: 20px; margin: 15px 0;">\n`;
          items.forEach((item) => {
            noteHtml += `<li style="margin-bottom: 8px;">${item}</li>\n`;
          });
          noteHtml += `</ul>\n`;
          break;
        case 'image':
          noteHtml += `<div style="text-align: center; margin: 15px 0;"><img src="${component.props?.src || '/placeholder.svg'}" alt="${component.props?.alt || 'Image'}" style="max-width: 100%; height: auto;"></div>\n`;
          break;
        case 'spacer':
          noteHtml += `<div style="height: 32px;"></div>\n`;
          break;

        case 'gallery':
          const galleryLayout = component.props?.layout || 'single';
          const galleryImages = component.props?.images || [];

          if (galleryLayout === 'single' && galleryImages.length > 0) {
            noteHtml += `<div style="text-align: center; margin: 15px 0;"><img src="${galleryImages[0]?.src || '/placeholder.svg'}" alt="${galleryImages[0]?.alt || 'Gallery image'}" style="max-width: 100%; height: auto; border-radius: 8px;"></div>\n`;
          } else if (galleryLayout === 'double' && galleryImages.length > 0) {
            noteHtml += `<table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 15px 0;"><tr>`;
            for (let i = 0; i < Math.min(2, galleryImages.length); i++) {
              noteHtml += `<td width="50%" style="padding: 0 4px;"><img src="${galleryImages[i]?.src || '/placeholder.svg'}" alt="${galleryImages[i]?.alt || `Gallery image ${i + 1}`}" style="width: 100%; height: auto; border-radius: 8px;"></td>`;
            }
            noteHtml += `</tr></table>\n`;
          } else if (galleryLayout === 'grid' && galleryImages.length > 0) {
            noteHtml += `<table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 15px 0;">`;
            for (let row = 0; row < 2; row++) {
              noteHtml += `<tr>`;
              for (let col = 0; col < 2; col++) {
                const idx = row * 2 + col;
                if (idx < galleryImages.length) {
                  noteHtml += `<td width="50%" style="padding: 4px;"><img src="${galleryImages[idx]?.src || '/placeholder.svg'}" alt="${galleryImages[idx]?.alt || `Gallery image ${idx + 1}`}" style="width: 100%; height: auto; border-radius: 8px;"></td>`;
                } else {
                  noteHtml += `<td width="50%" style="padding: 4px;"></td>`;
                }
              }
              noteHtml += `</tr>`;
            }
            noteHtml += `</table>\n`;
          }
          break;
      }
    });

    // Cerrar el contenedor de la nota
    noteHtml += `</div>\n`;

    return noteHtml;
  };

  // Función auxiliar para determinar si un color es oscuro
  const isColorDark = (color: string): boolean => {
    // Si el color es en formato hex (#RRGGBB)
    if (color.startsWith('#')) {
      const r = Number.parseInt(color.slice(1, 3), 16);
      const g = Number.parseInt(color.slice(3, 5), 16);
      const b = Number.parseInt(color.slice(5, 7), 16);
      // Fórmula para calcular la luminosidad percibida
      return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.5;
    }
    // Si el color es en formato rgb o rgba
    else if (color.startsWith('rgb')) {
      const match = color.match(/(\d+)/g);
      if (match && match.length >= 3) {
        const r = Number.parseInt(match[0]);
        const g = Number.parseInt(match[1]);
        const b = Number.parseInt(match[2]);
        return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.5;
      }
    }
    return false;
  };

  const handleGenerateHtml = () => {
    setGenerating(true);

    try {
      // Start with basic HTML structure
      let html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title || 'Newsletter'}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f9f9f9;
    }
    .content-wrapper {
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 0 10px rgba(0,0,0,0.05);
    }
    .newsletter-header {
      text-align: ${header.alignment};
      margin-bottom: 0;
      background-color: ${header.backgroundColor};
      color: ${header.textColor};
      padding: 20px;
      border-radius: 8px 8px 0 0;
    }
    .newsletter-title {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .newsletter-subtitle {
      font-size: 16px;
      margin-bottom: 20px;
    }
    .newsletter-description {
      font-size: 16px;
      color: #666;
      margin: 20px;
    }
    .notes-container {
      padding: 20px;
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: ${footer.textColor};
      padding: 20px;
      background-color: ${footer.backgroundColor};
      border-radius: 0 0 8px 8px;
    }
    .social-links {
      margin: 10px 0;
    }
    .social-link {
      display: inline-block;
      margin: 0 5px;
      color: ${footer.textColor};
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="content-wrapper">
    <div class="newsletter-header">
      ${header.logo ? `<img src="${header.logo}" alt="Logo" style="max-height: 50px; margin-bottom: 10px;"><br>` : ''}
      <div class="newsletter-title">${header.title || title || 'Newsletter'}</div>
      ${header.subtitle ? `<div class="newsletter-subtitle">${header.subtitle}</div>` : ''}
      ${header.bannerImage ? `<img src="${header.bannerImage}" alt="Banner" style="width: 100%; margin-top: 10px;">` : ''}
    </div>
    
    ${description ? `<div class="newsletter-description">${description}</div>` : ''}
    
    <div class="notes-container">`;

      // Add each note's content using the dedicated function
      selectedNotes.forEach((newsletterNote) => {
        html += generateNoteHtml(newsletterNote.noteData);
      });

      // Close notes container and add footer
      html += `</div>
    
    <div class="footer">
      <p style="margin: 5px 0;"><strong>${footer.companyName}</strong></p>
      ${footer.address ? `<p style="margin: 5px 0;">${footer.address}</p>` : ''}
      ${footer.contactEmail ? `<p style="margin: 5px 0;">Contact: <a href="mailto:${footer.contactEmail}" style="color: ${footer.textColor}">${footer.contactEmail}</a></p>` : ''}
      <div class="social-links">
        ${
          footer.socialLinks
            ?.map(
              (link) =>
                `<a href="${link.url}" class="social-link" target="_blank" style="color: ${footer.textColor};">${link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}</a>`
            )
            .join(' | ') || ''
        }
      </div>
      <p style="margin-top: 10px;">
        <a href="${footer.unsubscribeLink || '#'}" style="color: ${footer.textColor}">Unsubscribe</a> |
        <a href="#" style="color: ${footer.textColor}">View in browser</a>
      </p>
      <p style="margin: 5px 0;">© ${new Date().getFullYear()} ${footer.companyName}. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;

      setGeneratedHtml(html);
      setOpenHtmlPreview(true);
      showSnackbar('HTML generated successfully', 'success');
    } catch (error) {
      console.error('Error generating HTML:', error);
      showSnackbar('Error generating HTML', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyHtml = () => {
    navigator.clipboard
      .writeText(generatedHtml)
      .then(() => {
        showSnackbar('HTML copied to clipboard', 'success');
      })
      .catch(() => {
        showSnackbar('Failed to copy HTML', 'error');
      });
  };

  const toggleSidebar = () => {
    setOpenSidebar(!openSidebar);
  };

  return (
    <>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Button startIcon={<Icon icon="mdi:chevron-left" />} sx={{ mr: 2 }} onClick={onClose}>
            Back
          </Button>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Newsletter Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ width: 300, mr: 2 }}
          />
          <Box sx={{ flexGrow: 1 }} />

          <Button variant="outlined" color="primary" sx={{ mr: 1 }}>
            Notes Mode
          </Button>
          <Button variant="outlined" sx={{ mr: 2 }}>
            Content Editor
          </Button>

          <Button
            variant="outlined"
            startIcon={
              openSidebar ? <Icon icon="mdi:chevron-left" /> : <Icon icon="mdi:chevron-right" />
            }
            onClick={toggleSidebar}
            sx={{ mr: 2 }}
          >
            {openSidebar ? 'Hide Sidebar' : 'Show Sidebar'}
          </Button>
          <Button
            variant="outlined"
            startIcon={<Icon icon="mdi:code-tags" />}
            onClick={handleGenerateHtml}
            disabled={generating || selectedNotes.length === 0}
            sx={{ mr: 2 }}
          >
            {generating ? <CircularProgress size={24} color="inherit" /> : 'Generate HTML'}
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Icon icon="mdi:content-save" />}
            onClick={handleSaveNewsletter}
            disabled={isSaving}
          >
            {isSaving ? <CircularProgress size={24} color="inherit" /> : 'Save Newsletter'}
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
        {/* Left Sidebar */}
        {openSidebar && (
          <Box sx={{ width: 280, borderRight: '1px solid rgba(0, 0, 0, 0.12)' }}>
            <Box sx={{ display: 'flex', borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
              <Button
                variant={sidebarTab === 'notes' ? 'contained' : 'text'}
                onClick={() => setSidebarTab('notes')}
                sx={{ flex: 1, borderRadius: 0, py: 1 }}
              >
                NOTES
              </Button>
              <Button
                variant={sidebarTab === 'create' ? 'contained' : 'text'}
                onClick={() => setSidebarTab('create')}
                sx={{ flex: 1, borderRadius: 0, py: 1 }}
              >
                CREATE
              </Button>
            </Box>

            {sidebarTab === 'notes' && (
              <Box sx={{ p: 2, height: 'calc(100% - 48px)', overflow: 'auto' }}>
                <Typography variant="subtitle1" gutterBottom>
                  Selected Notes ({selectedNotes.length})
                </Typography>
                {selectedNotes.length > 0 ? (
                  <Box sx={{ mb: 3 }}>
                    {selectedNotes.map((note, index) => (
                      <Paper
                        key={note.noteId}
                        variant="outlined"
                        sx={{ mb: 1, p: 1.5, position: 'relative' }}
                      >
                        <Box sx={{ pr: 6 }}>
                          <Typography variant="body2" fontWeight="medium" noWrap>
                            {note.noteData.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" display="block">
                            {new Date(
                              note.noteData.dateModified || note.noteData.dateCreated
                            ).toLocaleDateString()}
                          </Typography>
                        </Box>
                        <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                          <IconButton size="small" onClick={() => handleEditNote(note.noteData)}>
                            <Icon icon="mdi:pencil" width={16} />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleRemoveNote(note.noteId)}>
                            <Icon icon="mdi:close" width={16} />
                          </IconButton>
                        </Box>
                      </Paper>
                    ))}
                  </Box>
                ) : (
                  <Paper sx={{ p: 2, textAlign: 'center', mb: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      No notes selected yet
                    </Typography>
                  </Paper>
                )}

                <Divider sx={{ my: 2 }} />

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Typography variant="subtitle1">Available Notes</Typography>
                  <Button
                    size="small"
                    startIcon={<Icon icon="mdi:plus" />}
                    onClick={handleCreateNewNote}
                  >
                    New
                  </Button>
                </Box>

                {notes.length > 0 ? (
                  <Box>
                    {notes
                      .filter(
                        (note) => !selectedNotes.some((selected) => selected.noteId === note.id)
                      )
                      .map((note) => (
                        <Paper
                          key={note.id}
                          variant="outlined"
                          sx={{ mb: 1, p: 1.5, position: 'relative', cursor: 'pointer' }}
                          onClick={() => {
                            const newNote: NewsletterNote = {
                              noteId: note.id,
                              order: selectedNotes.length,
                              noteData: note,
                            };
                            handleAddNote(newNote);
                          }}
                        >
                          <Box>
                            <Typography variant="body2" fontWeight="medium" noWrap>
                              {note.title}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="caption" color="text.secondary">
                                {new Date(
                                  note.dateModified || note.dateCreated
                                ).toLocaleDateString()}
                              </Typography>
                              <Chip
                                size="small"
                                label={note.templateType}
                                sx={{ height: 18, fontSize: '0.625rem' }}
                              />
                            </Box>
                          </Box>
                        </Paper>
                      ))}
                  </Box>
                ) : (
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      No notes available
                    </Typography>
                  </Paper>
                )}
              </Box>
            )}

            {sidebarTab === 'create' && (
              <Box sx={{ p: 2, height: 'calc(100% - 48px)', overflow: 'auto' }}>
                <Typography variant="h6" gutterBottom>
                  Create New Note
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<Icon icon="mdi:plus" />}
                  onClick={handleCreateNewNote}
                  sx={{ mb: 2 }}
                >
                  Create Note
                </Button>
                <Typography variant="body2" color="text.secondary">
                  Create a new note to add to your newsletter. You can use any of the available
                  templates or start from scratch.
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {/* Main Content */}
        <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Box sx={{ display: 'flex' }}>
              <Button
                variant={activeTab === 'content' ? 'contained' : 'text'}
                onClick={() => setActiveTab('content')}
                sx={{ flex: 1, borderRadius: 0, py: 1 }}
              >
                CONTENT
              </Button>
              <Button
                variant={activeTab === 'design' ? 'contained' : 'text'}
                onClick={() => setActiveTab('design')}
                sx={{ flex: 1, borderRadius: 0, py: 1 }}
              >
                DESIGN
              </Button>
              <Button
                variant={activeTab === 'preview' ? 'contained' : 'text'}
                onClick={() => setActiveTab('preview')}
                sx={{ flex: 1, borderRadius: 0, py: 1 }}
              >
                PREVIEW
              </Button>
            </Box>
          </Box>

          <Box sx={{ p: 3, height: 'calc(100% - 48px)', overflow: 'auto' }}>
            {activeTab === 'content' && (
              <Box>
                <Paper sx={{ p: 3, mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Newsletter Details
                  </Typography>
                  <TextField
                    fullWidth
                    label="Title"
                    variant="outlined"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Description"
                    variant="outlined"
                    multiline
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Paper>

                <Paper sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 3,
                    }}
                  >
                    <Typography variant="h6">Newsletter Content</Typography>
                    <Button
                      variant="outlined"
                      startIcon={<Icon icon="mdi:plus" />}
                      onClick={handleCreateNewNote}
                    >
                      Add New Note
                    </Button>
                  </Box>

                  {selectedNotes.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Icon icon="mdi:email-outline" style={{ fontSize: 48, opacity: 0.5 }} />
                      <Typography variant="h6" sx={{ mt: 2 }}>
                        No notes added yet
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Select notes from the sidebar or create a new note to add to your newsletter
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<Icon icon="mdi:plus" />}
                        onClick={handleCreateNewNote}
                      >
                        Create New Note
                      </Button>
                    </Box>
                  ) : (
                    <Box>
                      {selectedNotes.map((note, index) => (
                        <Paper
                          key={note.noteId}
                          variant="outlined"
                          sx={{ mb: 2, position: 'relative', overflow: 'hidden' }}
                        >
                          <Box
                            sx={{
                              p: 2,
                              borderBottom: '1px solid rgba(0,0,0,0.08)',
                              bgcolor: 'rgba(0,0,0,0.03)',
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Box
                                sx={{
                                  width: 28,
                                  height: 28,
                                  borderRadius: '50%',
                                  bgcolor: 'primary.main',
                                  color: 'white',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '0.875rem',
                                  mr: 2,
                                }}
                              >
                                {index + 1}
                              </Box>
                              <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                                {note.noteData.title}
                              </Typography>
                              <Box>
                                <IconButton
                                  size="small"
                                  onClick={() => handleEditNote(note.noteData)}
                                >
                                  <Icon icon="mdi:pencil" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() => handleMoveNote(note.noteId, 'up')}
                                  disabled={index === 0}
                                >
                                  <Icon icon="mdi:arrow-up" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() => handleMoveNote(note.noteId, 'down')}
                                  disabled={index === selectedNotes.length - 1}
                                >
                                  <Icon icon="mdi:arrow-down" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() => handleRemoveNote(note.noteId)}
                                >
                                  <Icon icon="mdi:delete" />
                                </IconButton>
                              </Box>
                            </Box>
                          </Box>
                          <Box
                            sx={{
                              p: 2,
                              backgroundColor: note.noteData.emailBackground || '#ffffff',
                              backgroundImage: note.noteData.selectedBanner
                                ? `url(${note.noteData.selectedBanner})`
                                : 'none',
                              backgroundSize: note.noteData.selectedBanner ? 'cover' : 'auto',
                              background:
                                note.noteData.showGradient && note.noteData.gradientColors
                                  ? `linear-gradient(to bottom, ${note.noteData.gradientColors[0]}, ${note.noteData.gradientColors[1]})`
                                  : undefined,
                            }}
                          >
                            <Box sx={{ maxHeight: 200, overflow: 'hidden', position: 'relative' }}>
                              {note.noteData.objdata.slice(0, 3).map((component, compIndex) => {
                                switch (component.type) {
                                  case 'category':
                                    return null;
                                  case 'heading':
                                    return (
                                      <Typography
                                        key={compIndex}
                                        variant={component.props?.level === 1 ? 'h5' : 'h6'}
                                        gutterBottom
                                      >
                                        {component.content}
                                      </Typography>
                                    );
                                  case 'paragraph':
                                    return (
                                      <Typography key={compIndex} variant="body2" gutterBottom>
                                        {component.content}
                                      </Typography>
                                    );
                                  case 'button':
                                    return (
                                      <Button
                                        key={compIndex}
                                        variant="contained"
                                        size="small"
                                        sx={{ mt: 1, mb: 1 }}
                                        disabled
                                      >
                                        {component.content}
                                      </Button>
                                    );
                                  case 'divider':
                                    return <Divider key={compIndex} sx={{ my: 1 }} />;
                                  default:
                                    return null;
                                }
                              })}
                              {note.noteData.objdata.length > 3 && (
                                <Box
                                  sx={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    height: 60,
                                    background:
                                      'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1))',
                                  }}
                                />
                              )}
                            </Box>
                            {note.noteData.objdata.length > 3 && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ display: 'block', mt: 1 }}
                              >
                                + {note.noteData.objdata.length - 3} more components
                              </Typography>
                            )}
                          </Box>
                        </Paper>
                      ))}
                    </Box>
                  )}
                </Paper>
              </Box>
            )}

            {activeTab === 'design' && (
              <Box>
                <Paper sx={{ p: 3, mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Header Design
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mb: 2,
                    }}
                  >
                    <Typography variant="body1">Customize the newsletter header</Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<Icon icon="mdi:pencil" />}
                      onClick={() => setOpenHeaderDialog(true)}
                    >
                      Edit Header
                    </Button>
                  </Box>

                  {/* Header Preview */}
                  <Box
                    sx={{
                      mt: 2,
                      p: 2,
                      backgroundColor: header.backgroundColor,
                      color: header.textColor,
                      textAlign: header.alignment as 'left' | 'center' | 'right',
                      borderRadius: 1,
                    }}
                  >
                    {header.logo && (
                      <Box sx={{ mb: 1 }}>
                        <img
                          src={header.logo || '/placeholder.svg'}
                          alt="Logo"
                          style={{ maxHeight: '40px' }}
                        />
                      </Box>
                    )}
                    <Typography variant="h5" component="div" gutterBottom>
                      {header.title || title || 'Newsletter Title'}
                    </Typography>
                    {header.subtitle && (
                      <Typography variant="subtitle1" gutterBottom>
                        {header.subtitle}
                      </Typography>
                    )}
                    {header.bannerImage && (
                      <Box sx={{ mt: 1 }}>
                        <img
                          src={header.bannerImage || '/placeholder.svg'}
                          alt="Banner"
                          style={{ maxWidth: '100%' }}
                        />
                      </Box>
                    )}
                  </Box>
                </Paper>

                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Footer Design
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mb: 2,
                    }}
                  >
                    <Typography variant="body1">Customize the newsletter footer</Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<Icon icon="mdi:pencil" />}
                      onClick={() => setOpenFooterDialog(true)}
                    >
                      Edit Footer
                    </Button>
                  </Box>

                  {/* Footer Preview */}
                  <Box
                    sx={{
                      mt: 2,
                      p: 2,
                      backgroundColor: footer.backgroundColor,
                      color: footer.textColor,
                      textAlign: 'center',
                      borderRadius: 1,
                      fontSize: '0.875rem',
                    }}
                  >
                    <Typography variant="subtitle1" component="div" fontWeight="bold">
                      {footer.companyName}
                    </Typography>
                    {footer.address && <Typography variant="body2">{footer.address}</Typography>}
                    {footer.contactEmail && (
                      <Typography variant="body2">
                        Contact:{' '}
                        <Box component="span" sx={{ textDecoration: 'underline' }}>
                          {footer.contactEmail}
                        </Box>
                      </Typography>
                    )}

                    <Box sx={{ mt: 1, mb: 1 }}>
                      {footer.socialLinks?.map((link, index) => (
                        <React.Fragment key={link.platform}>
                          <Box component="span" sx={{ textDecoration: 'underline' }}>
                            {link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}
                          </Box>
                          {index < (footer.socialLinks?.length || 0) - 1 && <span> | </span>}
                        </React.Fragment>
                      ))}
                    </Box>

                    <Typography variant="body2" sx={{ mt: 1 }}>
                      <Box component="span" sx={{ textDecoration: 'underline' }}>
                        Unsubscribe
                      </Box>{' '}
                      |{' '}
                      <Box component="span" sx={{ textDecoration: 'underline' }}>
                        View in browser
                      </Box>
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      © {new Date().getFullYear()} {footer.companyName}. All rights reserved.
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            )}

            {activeTab === 'preview' && (
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Newsletter Preview
                </Typography>
                {selectedNotes.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body1">Add notes to preview your newsletter</Typography>
                  </Box>
                ) : (
                  <Box>
                    {/* Header Preview */}
                    <Box
                      sx={{
                        backgroundColor: header.backgroundColor,
                        color: header.textColor,
                        textAlign: header.alignment as 'left' | 'center' | 'right',
                        p: 3,
                        mb: 4,
                        borderRadius: '4px 4px 0 0',
                      }}
                    >
                      {header.logo && (
                        <Box sx={{ mb: 2 }}>
                          <img
                            src={header.logo || '/placeholder.svg'}
                            alt="Logo"
                            style={{ maxHeight: '50px' }}
                          />
                        </Box>
                      )}
                      <Typography variant="h5" gutterBottom>
                        {header.title || title || 'Untitled Newsletter'}
                      </Typography>
                      {header.subtitle && (
                        <Typography variant="subtitle1" gutterBottom>
                          {header.subtitle}
                        </Typography>
                      )}
                      {header.bannerImage && (
                        <Box sx={{ mt: 2 }}>
                          <img
                            src={header.bannerImage || '/placeholder.svg'}
                            alt="Banner"
                            style={{ maxWidth: '100%' }}
                          />
                        </Box>
                      )}
                    </Box>

                    {description && (
                      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                        {description}
                      </Typography>
                    )}

                    {selectedNotes.map((newsletterNote, index) => {
                      const note = newsletterNote.noteData;

                      // Determinar el estilo de fondo para esta nota
                      const getNoteBackgroundStyle = () => {
                        if (note.selectedBanner) {
                          return {
                            backgroundColor: '#f8f9fa',
                            backgroundImage: `url(${note.selectedBanner})`,
                            backgroundSize: 'cover',
                          };
                        } else if (
                          note.showGradient &&
                          note.gradientColors &&
                          note.gradientColors.length >= 2
                        ) {
                          return {
                            background: `linear-gradient(to bottom, ${note.gradientColors[0]}, ${note.gradientColors[1]})`,
                          };
                        } else if (note.emailBackground) {
                          return { backgroundColor: note.emailBackground };
                        }
                        return { backgroundColor: '#ffffff' }; // Fondo predeterminado
                      };

                      return (
                        <Box
                          key={newsletterNote.noteId}
                          sx={{
                            mb: 4,
                            pb: 4,
                            borderRadius: '4px',
                            overflow: 'hidden',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                          }}
                        >
                          <Box
                            sx={{
                              p: 3,
                              ...getNoteBackgroundStyle(),
                            }}
                          >
                            <Typography variant="h6" gutterBottom>
                              {note.title || `Note ${index + 1}`}
                            </Typography>

                            {note.objdata.map((component, compIndex) => {
                              switch (component.type) {
                                case 'category':
                                  const categoryColors = Array.isArray(component.props?.color)
                                    ? component.props.color
                                    : [component.props?.color || '#4caf50'];
                                  const categoryItems = component.props?.items || [
                                    component.content,
                                  ];

                                  return (
                                    <Box
                                      key={compIndex}
                                      sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}
                                    >
                                      {categoryItems.map((item, idx) => (
                                        <Chip
                                          key={idx}
                                          label={item}
                                          sx={{
                                            backgroundColor:
                                              typeof categoryColors === 'string'
                                                ? categoryColors
                                                : categoryColors[idx % categoryColors.length],
                                            color: 'white',
                                            fontWeight: 'bold',
                                          }}
                                        />
                                      ))}
                                    </Box>
                                  );
                                case 'heading':
                                  const HeadingTag =
                                    `h${component.props?.level || 2}` as keyof JSX.IntrinsicElements;
                                  return (
                                    <HeadingTag key={compIndex} style={{ margin: '16px 0' }}>
                                      {component.content}
                                    </HeadingTag>
                                  );
                                case 'paragraph':
                                  if (component.props?.isCode) {
                                    return (
                                      <Box
                                        key={compIndex}
                                        sx={{
                                          backgroundColor: '#f5f5f5',
                                          p: 2,
                                          borderRadius: 1,
                                          fontFamily: 'monospace',
                                          my: 2,
                                        }}
                                      >
                                        {component.content}
                                      </Box>
                                    );
                                  }
                                  return (
                                    <Typography key={compIndex} variant="body1" paragraph>
                                      {component.content}
                                    </Typography>
                                  );
                                case 'button':
                                  return (
                                    <Button key={compIndex} variant="contained" sx={{ my: 1 }}>
                                      {component.content}
                                    </Button>
                                  );
                                case 'divider':
                                  return <Divider key={compIndex} sx={{ my: 2 }} />;
                                case 'bulletList':
                                  const items = component.props?.items || [];
                                  return (
                                    <Box key={compIndex} component="ul" sx={{ pl: 2 }}>
                                      {items.map((item, i) => (
                                        <Typography
                                          key={i}
                                          component="li"
                                          variant="body1"
                                          sx={{ mb: 1 }}
                                        >
                                          {item}
                                        </Typography>
                                      ))}
                                    </Box>
                                  );
                                case 'image':
                                  return (
                                    <Box key={compIndex} sx={{ textAlign: 'center', my: 2 }}>
                                      <img
                                        src={component.props?.src || '/placeholder.svg'}
                                        alt={component.props?.alt || 'Image'}
                                        style={{ maxWidth: '100%' }}
                                      />
                                    </Box>
                                  );
                                case 'gallery':
                                  const galleryLayout = component.props?.layout || 'single';
                                  const galleryImages = component.props?.images || [];

                                  if (galleryLayout === 'single' && galleryImages.length > 0) {
                                    return (
                                      <Box key={compIndex} sx={{ textAlign: 'center', my: 2 }}>
                                        <img
                                          src={galleryImages[0]?.src || '/placeholder.svg'}
                                          alt={galleryImages[0]?.alt || 'Gallery image'}
                                          style={{ maxWidth: '100%', borderRadius: '8px' }}
                                        />
                                      </Box>
                                    );
                                  } else if (
                                    galleryLayout === 'double' &&
                                    galleryImages.length > 0
                                  ) {
                                    return (
                                      <Grid key={compIndex} container spacing={1} sx={{ my: 2 }}>
                                        <Grid item xs={6}>
                                          <img
                                            src={galleryImages[0]?.src || '/placeholder.svg'}
                                            alt={galleryImages[0]?.alt || 'Gallery image'}
                                            style={{ width: '100%', borderRadius: '8px' }}
                                          />
                                        </Grid>
                                        <Grid item xs={6}>
                                          <img
                                            src={galleryImages[1]?.src || '/placeholder.svg'}
                                            alt={galleryImages[1]?.alt || 'Gallery image'}
                                            style={{ width: '100%', borderRadius: '8px' }}
                                          />
                                        </Grid>
                                      </Grid>
                                    );
                                  } else if (galleryLayout === 'grid' && galleryImages.length > 0) {
                                    return (
                                      <Grid key={compIndex} container spacing={1} sx={{ my: 2 }}>
                                        <Grid item xs={6}>
                                          <img
                                            src={galleryImages[0]?.src || '/placeholder.svg'}
                                            alt={galleryImages[0]?.alt || 'Gallery image'}
                                            style={{
                                              width: '100%',
                                              borderRadius: '8px',
                                              marginBottom: '8px',
                                            }}
                                          />
                                        </Grid>
                                        <Grid item xs={6}>
                                          <img
                                            src={galleryImages[1]?.src || '/placeholder.svg'}
                                            alt={galleryImages[1]?.alt || 'Gallery image'}
                                            style={{
                                              width: '100%',
                                              borderRadius: '8px',
                                              marginBottom: '8px',
                                            }}
                                          />
                                        </Grid>
                                        <Grid item xs={6}>
                                          <img
                                            src={galleryImages[2]?.src || '/placeholder.svg'}
                                            alt={galleryImages[2]?.alt || 'Gallery image'}
                                            style={{ width: '100%', borderRadius: '8px' }}
                                          />
                                        </Grid>
                                        <Grid item xs={6}>
                                          <img
                                            src={galleryImages[3]?.src || '/placeholder.svg'}
                                            alt={galleryImages[3]?.alt || 'Gallery image'}
                                            style={{ width: '100%', borderRadius: '8px' }}
                                          />
                                        </Grid>
                                      </Grid>
                                    );
                                  }
                                  return null;
                                case 'spacer':
                                  return <Box key={compIndex} sx={{ height: 32 }} />;
                                default:
                                  return null;
                              }
                            })}
                          </Box>
                        </Box>
                      );
                    })}

                    <Box
                      sx={{
                        backgroundColor: footer.backgroundColor,
                        color: footer.textColor,
                        textAlign: 'center',
                        p: 3,
                        mt: 4,
                        borderRadius: '0 0 4px 4px',
                      }}
                    >
                      <Typography variant="subtitle1" component="div" fontWeight="bold">
                        {footer.companyName}
                      </Typography>
                      {footer.address && <Typography variant="body2">{footer.address}</Typography>}
                      {footer.contactEmail && (
                        <Typography variant="body2">
                          Contact:{' '}
                          <Box component="span" sx={{ textDecoration: 'underline' }}>
                            {footer.contactEmail}
                          </Box>
                        </Typography>
                      )}

                      <Box sx={{ mt: 1, mb: 1 }}>
                        {footer.socialLinks?.map((link, index) => (
                          <React.Fragment key={link.platform}>
                            <Box component="span" sx={{ textDecoration: 'underline' }}>
                              {link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}
                            </Box>
                            {index < (footer.socialLinks?.length || 0) - 1 && <span> | </span>}
                          </React.Fragment>
                        ))}
                      </Box>

                      <Typography variant="body2" sx={{ mt: 1 }}>
                        <Box component="span" sx={{ textDecoration: 'underline' }}>
                          Unsubscribe
                        </Box>{' '}
                        |{' '}
                        <Box component="span" sx={{ textDecoration: 'underline' }}>
                          View in browser
                        </Box>
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        © {new Date().getFullYear()} {footer.companyName}. All rights reserved.
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Paper>
            )}
          </Box>
        </Box>
      </Box>

      {/* Note Editor Dialog */}
      <Dialog fullScreen open={openNoteEditor} onClose={() => setOpenNoteEditor(false)}>
        <EmailEditor
          onClose={() => setOpenNoteEditor(false)}
          initialNote={editingNote}
          isNewsletterMode
          onSave={handleSaveNote}
        />
      </Dialog>

      {/* HTML Preview Dialog */}
      <Dialog
        open={openHtmlPreview}
        onClose={() => setOpenHtmlPreview(false)}
        maxWidth="md"
        fullWidth
      >
        <AppBar position="static" color="default" elevation={0}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Generated HTML
            </Typography>
            <IconButton edge="end" color="inherit" onClick={() => setOpenHtmlPreview(false)}>
              <Icon icon="mdi:close" />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box sx={{ p: 2 }}>
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              maxHeight: '400px',
              overflow: 'auto',
              fontFamily: 'monospace',
              fontSize: '12px',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {generatedHtml}
          </Paper>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={() => setOpenHtmlPreview(false)} sx={{ mr: 1 }}>
              Close
            </Button>
            <Button onClick={handleCopyHtml} variant="contained" color="primary">
              Copy HTML
            </Button>
          </Box>
        </Box>
      </Dialog>

      {/* Snackbar for notifications */}
      <CustomSnackbar
        open={openSnackbar}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={() => setOpenSnackbar(false)}
      />

      {/* Header Edit Dialog */}
      <Dialog
        open={openHeaderDialog}
        onClose={() => setOpenHeaderDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Newsletter Header</DialogTitle>
        <Box sx={{ px: 3, pb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Header Title"
                value={header.title}
                onChange={(e) => setHeader({ ...header, title: e.target.value })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Subtitle"
                value={header.subtitle}
                onChange={(e) => setHeader({ ...header, subtitle: e.target.value })}
                margin="normal"
              />
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Text Alignment
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={4}>
                    <Button
                      variant={header.alignment === 'left' ? 'contained' : 'outlined'}
                      fullWidth
                      onClick={() => setHeader({ ...header, alignment: 'left' })}
                    >
                      <Icon icon="mdi:format-align-left" />
                    </Button>
                  </Grid>
                  <Grid item xs={4}>
                    <Button
                      variant={header.alignment === 'center' ? 'contained' : 'outlined'}
                      fullWidth
                      onClick={() => setHeader({ ...header, alignment: 'center' })}
                    >
                      <Icon icon="mdi:format-align-center" />
                    </Button>
                  </Grid>
                  <Grid item xs={4}>
                    <Button
                      variant={header.alignment === 'right' ? 'contained' : 'outlined'}
                      fullWidth
                      onClick={() => setHeader({ ...header, alignment: 'right' })}
                    >
                      <Icon icon="mdi:format-align-right" />
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="caption" display="block" gutterBottom>
                    Background
                  </Typography>
                  <input
                    type="color"
                    value={header.backgroundColor}
                    onChange={(e) => setHeader({ ...header, backgroundColor: e.target.value })}
                    style={{ width: 40, height: 40, padding: 0, border: 'none' }}
                  />
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="caption" display="block" gutterBottom>
                    Text Color
                  </Typography>
                  <input
                    type="color"
                    value={header.textColor}
                    onChange={(e) => setHeader({ ...header, textColor: e.target.value })}
                    style={{ width: 40, height: 40, padding: 0, border: 'none' }}
                  />
                </Box>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Logo
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Logo URL"
                    value={header.logo || ''}
                    onChange={(e) => setHeader({ ...header, logo: e.target.value })}
                  />
                  <Button
                    variant="outlined"
                    sx={{ ml: 1, minWidth: 'auto' }}
                    onClick={() => setOpenLogoDialog(true)}
                  >
                    <Icon icon="mdi:upload" />
                  </Button>
                </Box>
                {header.logo && (
                  <Box sx={{ mt: 1, textAlign: 'center' }}>
                    <img
                      src={header.logo || '/placeholder.svg'}
                      alt="Logo"
                      style={{ maxHeight: '50px' }}
                    />
                  </Box>
                )}
              </Box>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Banner Image
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Banner Image URL"
                    value={header.bannerImage || ''}
                    onChange={(e) => setHeader({ ...header, bannerImage: e.target.value })}
                  />
                  <Button
                    variant="outlined"
                    sx={{ ml: 1, minWidth: 'auto' }}
                    onClick={() => setOpenBannerDialog(true)}
                  >
                    <Icon icon="mdi:upload" />
                  </Button>
                </Box>
                {header.bannerImage && (
                  <Box sx={{ mt: 1, textAlign: 'center' }}>
                    <img
                      src={header.bannerImage || '/placeholder.svg'}
                      alt="Banner"
                      style={{ maxWidth: '100%' }}
                    />
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button onClick={() => setOpenHeaderDialog(false)} sx={{ mr: 1 }}>
              Cancel
            </Button>
            <Button variant="contained" onClick={() => setOpenHeaderDialog(false)}>
              Apply
            </Button>
          </Box>
        </Box>
      </Dialog>

      {/* Footer Edit Dialog */}
      <Dialog
        open={openFooterDialog}
        onClose={() => setOpenFooterDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Newsletter Footer</DialogTitle>
        <Box sx={{ px: 3, pb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Company Name"
                value={footer.companyName}
                onChange={(e) => setFooter({ ...footer, companyName: e.target.value })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Address"
                value={footer.address || ''}
                onChange={(e) => setFooter({ ...footer, address: e.target.value })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Contact Email"
                value={footer.contactEmail || ''}
                onChange={(e) => setFooter({ ...footer, contactEmail: e.target.value })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Unsubscribe Link"
                value={footer.unsubscribeLink || '#'}
                onChange={(e) => setFooter({ ...footer, unsubscribeLink: e.target.value })}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="caption" display="block" gutterBottom>
                    Background
                  </Typography>
                  <input
                    type="color"
                    value={footer.backgroundColor}
                    onChange={(e) => setFooter({ ...footer, backgroundColor: e.target.value })}
                    style={{ width: 40, height: 40, padding: 0, border: 'none' }}
                  />
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="caption" display="block" gutterBottom>
                    Text Color
                  </Typography>
                  <input
                    type="color"
                    value={footer.textColor}
                    onChange={(e) => setFooter({ ...footer, textColor: e.target.value })}
                    style={{ width: 40, height: 40, padding: 0, border: 'none' }}
                  />
                </Box>
              </Box>
              <Typography variant="subtitle2" gutterBottom>
                Social Links
              </Typography>
              {footer.socialLinks?.map((link, index) => (
                <Box key={index} sx={{ display: 'flex', mb: 1 }}>
                  <TextField
                    size="small"
                    label="Platform"
                    value={link.platform}
                    onChange={(e) => {
                      const newLinks = [...(footer.socialLinks || [])];
                      newLinks[index] = { ...newLinks[index], platform: e.target.value };
                      setFooter({ ...footer, socialLinks: newLinks });
                    }}
                    sx={{ width: '40%' }}
                  />
                  <TextField
                    size="small"
                    label="URL"
                    value={link.url}
                    onChange={(e) => {
                      const newLinks = [...(footer.socialLinks || [])];
                      newLinks[index] = { ...newLinks[index], url: e.target.value };
                      setFooter({ ...footer, socialLinks: newLinks });
                    }}
                    sx={{ width: '60%', ml: 1 }}
                  />
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => {
                      const newLinks = [...(footer.socialLinks || [])];
                      newLinks.splice(index, 1);
                      setFooter({ ...footer, socialLinks: newLinks });
                    }}
                  >
                    <Icon icon="mdi:delete" />
                  </IconButton>
                </Box>
              ))}
              <Button
                variant="outlined"
                size="small"
                startIcon={<Icon icon="mdi:plus" />}
                onClick={() => {
                  const newLinks = [...(footer.socialLinks || [])];
                  newLinks.push({ platform: 'new', url: '#' });
                  setFooter({ ...footer, socialLinks: newLinks });
                }}
                sx={{ mt: 1 }}
              >
                Add Social Link
              </Button>
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button onClick={() => setOpenFooterDialog(false)} sx={{ mr: 1 }}>
              Cancel
            </Button>
            <Button variant="contained" onClick={() => setOpenFooterDialog(false)}>
              Apply
            </Button>
          </Box>
        </Box>
      </Dialog>

      {/* Logo Upload Dialog */}
      <Dialog open={openLogoDialog} onClose={() => setOpenLogoDialog(false)}>
        <DialogTitle>Add Logo</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Logo URL"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            margin="normal"
          />
          <Typography variant="caption" color="text.secondary">
            Enter a URL for your logo image
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLogoDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              if (logoUrl) {
                setHeader({ ...header, logo: logoUrl });
              }
              setOpenLogoDialog(false);
            }}
          >
            Add Logo
          </Button>
        </DialogActions>
      </Dialog>

      {/* Banner Upload Dialog */}
      <Dialog open={openBannerDialog} onClose={() => setOpenBannerDialog(false)}>
        <DialogTitle>Add Banner Image</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Banner Image URL"
            value={bannerImageUrl}
            onChange={(e) => setBannerImageUrl(e.target.value)}
            margin="normal"
          />
          <Typography variant="caption" color="text.secondary">
            Enter a URL for your banner image
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBannerDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              if (bannerImageUrl) {
                setHeader({ ...header, bannerImage: bannerImageUrl });
              }
              setOpenBannerDialog(false);
            }}
          >
            Add Banner
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type {
  Newsletter,
  NewsletterNote,
  NewsletterHeader,
  NewsletterFooter,
} from 'src/types/newsletter';
import type { SavedNote } from 'src/types/saved-note';
import { useStore } from 'src/lib/store';
import { generateNewsletterHtml, isColorDark } from '../utils';

export default function useNewsletterEditor(onClose: () => void, initialNewsletter?: Newsletter) {
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

  const [header, setHeader] = useState<NewsletterHeader>({
    title: '',
    subtitle: 'Your weekly newsletter',
    logo: '',
    bannerImage: '',
    backgroundColor: '#3f51b5',
    textColor: '#ffffff',
    alignment: 'center',
  });

  const [footer, setFooter] = useState<NewsletterFooter>({
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

  // Regenerate HTML when relevant data changes
  useEffect(() => {
    if (activeTab === 'preview') {
      handleGenerateHtml(false);
    }
  }, [activeTab, title, description, header, footer, selectedNotes]);

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
      // Generate final HTML before saving
      const finalHtml = generateNewsletterHtml(
        title,
        description,
        header,
        footer,
        selectedNotes,
        isColorDark
      );

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
        // Store the generated HTML
        generatedHtml: finalHtml,
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

  const handleGenerateHtml = (showPreviewDialog = true) => {
    setGenerating(true);

    try {
      const html = generateNewsletterHtml(
        title,
        description,
        header,
        footer,
        selectedNotes,
        isColorDark
      );
      setGeneratedHtml(html);

      if (showPreviewDialog) {
        setOpenHtmlPreview(true);
        showSnackbar('HTML generated successfully', 'success');
      }
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

  return {
    // State
    title,
    setTitle,
    description,
    setDescription,
    selectedNotes,
    editingNote,
    openNoteEditor,
    isSaving,
    activeTab,
    setActiveTab,
    sidebarTab,
    setSidebarTab,
    openSidebar,
    openSnackbar,
    snackbarMessage,
    snackbarSeverity,
    generatedHtml,
    openHtmlPreview,
    generating,
    header,
    setHeader,
    footer,
    setFooter,
    openHeaderDialog,
    openFooterDialog,
    notes,

    // Actions
    handleAddNote,
    handleRemoveNote,
    handleMoveNote,
    handleEditNote,
    handleCreateNewNote,
    handleSaveNote,
    handleSaveNewsletter,
    showSnackbar,
    handleGenerateHtml,
    handleCopyHtml,
    toggleSidebar,
    setOpenNoteEditor,
    setOpenSnackbar,
    setOpenHtmlPreview,
    setOpenHeaderDialog,
    setOpenFooterDialog,
  };
}

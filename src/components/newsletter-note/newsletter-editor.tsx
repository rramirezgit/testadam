'use client';

import type { SavedNote } from 'src/types/saved-note';
import type { Newsletter, NewsletterNote } from 'src/types/newsletter';

import { v4 as uuidv4 } from 'uuid';
import { Icon } from '@iconify/react';
import React, { useState, useEffect } from 'react';

import {
  Box,
  Tab,
  Chip,
  Grid,
  Tabs,
  Paper,
  Avatar,
  Switch,
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
  FormControlLabel,
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
  const [activeHtmlTab, setActiveHtmlTab] = useState('preview');
  const [escapedHtml, setEscapedHtml] = useState('');

  const [header, setHeader] = useState({
    title: '',
    subtitle: 'Your weekly newsletter',
    logo: '',
    bannerImage: '',
    backgroundColor: '#3f51b5',
    textColor: '#ffffff',
    alignment: 'center',
    useGradient: false,
    gradientColors: ['#3f51b5', '#2196f3'],
    gradientDirection: 180,
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
    useGradient: false,
    gradientColors: ['#f5f5f5', '#e0e0e0'],
    gradientDirection: 180,
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
        case 'category': {
          const categorias = component.props?.categorias || [];

          if (categorias.length > 0) {
            noteHtml += `<div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px;">\n`;

            categorias.forEach((categoria) => {
              noteHtml += `<span style="display: inline-block; background-color: ${categoria.colorFondo}; color: ${categoria.colorTexto}; padding: 4px 12px; border-radius: 16px; font-size: 14px; font-weight: bold;">${categoria.texto}</span>\n`;
            });

            noteHtml += `</div>\n`;
          } else {
            // Formato antiguo como fallback
            const categoryColor = component.props?.color || '#4caf50';
            const categoryItems = component.props?.items || [component.content];
            // Obtener las propiedades de estilo
            const borderRadius = component.props?.borderRadius || 16;
            const padding = component.props?.padding || 4;
            const textColor = component.props?.textColor || 'white';
            const fontWeight = component.props?.fontWeight || 'bold';
            const fontSize = component.props?.fontSize || 14;

            noteHtml += `<div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px;">\n`;

            if (Array.isArray(categoryItems)) {
              categoryItems.forEach((item, index) => {
                const itemColor = Array.isArray(categoryColor)
                  ? categoryColor[index % categoryColor.length]
                  : categoryColor;

                noteHtml += `<span style="display: inline-block; background-color: ${itemColor}; color: ${textColor}; padding: ${padding}px ${padding * 3}px; border-radius: ${borderRadius}px; font-size: ${fontSize}px; font-weight: ${fontWeight};">${item}</span>\n`;
              });
            } else {
              noteHtml += `<span style="display: inline-block; background-color: ${categoryColor}; color: ${textColor}; padding: ${padding}px ${padding * 3}px; border-radius: ${borderRadius}px; font-size: ${fontSize}px; font-weight: ${fontWeight};">${component.content}</span>\n`;
            }

            noteHtml += `</div>\n`;
          }

          break;
        }
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
          const listStyle = component.props?.listStyle || 'disc';
          const listColor = component.props?.listColor || '#000000';

          // Determinar si es una lista ordenada
          const isOrderedList =
            listStyle === 'decimal' ||
            listStyle === 'lower-alpha' ||
            listStyle === 'upper-alpha' ||
            listStyle === 'lower-roman' ||
            listStyle === 'upper-roman';

          // Para listas compatibles con email, usamos tablas
          let listHtml = '';

          items.forEach((item, index) => {
            if (isOrderedList) {
              // Estilo para listas ordenadas con números/letras
              const marker = getOrderedListMarker(index + 1, listStyle);

              // Usar un formato altamente compatible con clientes de email
              listHtml += `
                <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:12px;">
                  <tbody>
                    <tr>
                      <td width="30" valign="top" style="padding-right:10px;">
                        <div style="background-color:${listColor};border-radius:50%;color:white;font-size:12px;font-weight:bold;height:24px;width:24px;line-height:24px;text-align:center;">${marker}</div>
                      </td>
                      <td valign="top">
                        <div style="font-size:14px;line-height:24px;margin:0;">${item}</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              `;
            } else {
              // Estilo para listas no ordenadas con diferentes tipos de viñetas
              let bulletHtml = '';

              // Usar formatos simples y altamente compatibles
              if (listStyle === 'disc' || listStyle === 'circle') {
                // Círculo sólido o hueco
                bulletHtml = `<div style="background-color:${listStyle === 'disc' ? listColor : 'transparent'};border:${listStyle === 'circle' ? `1px solid ${listColor}` : '0'};border-radius:50%;height:8px;width:8px;margin-top:8px;"></div>`;
              } else if (listStyle === 'square') {
                // Cuadrado
                bulletHtml = `<div style="background-color:${listColor};height:8px;width:8px;margin-top:8px;"></div>`;
              } else {
                // Bullet estándar como fallback
                bulletHtml = `<div style="font-size:18px;line-height:18px;color:${listColor};">&bull;</div>`;
              }

              // Usar un formato altamente compatible con clientes de email
              listHtml += `
                <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:12px;">
                  <tbody>
                    <tr>
                      <td width="30" valign="top" style="padding-right:10px;">
                        <div style="text-align:center;">${bulletHtml}</div>
                      </td>
                      <td valign="top">
                        <div style="font-size:14px;line-height:24px;margin:0;">${item}</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              `;
            }
          });

          noteHtml += listHtml;
          break;
        case 'image':
          noteHtml += `<div style="text-align: center; margin: 15px 0;"><img src="${component.props?.src || '/placeholder.svg'}" alt="${component.props?.alt || 'Image'}" style="max-width: 100%; height: auto;"></div>\n`;
          break;
        case 'spacer':
          noteHtml += `<div style="height: 32px;"></div>\n`;
          break;
        case 'summary': {
          const summaryBgStyle = component.props?.useGradient
            ? `background: ${
                component.props?.gradientType === 'linear'
                  ? `linear-gradient(${component.props?.gradientDirection || 'to right'}, ${component.props?.gradientColor1 || '#f5f7fa'}, ${component.props?.gradientColor2 || '#c3cfe2'})`
                  : `radial-gradient(circle, ${component.props?.gradientColor1 || '#f5f7fa'}, ${component.props?.gradientColor2 || '#c3cfe2'})`
              }`
            : `background-color: ${component.props?.backgroundColor || '#f5f7fa'}`;

          const iconColor = component.props?.iconColor || '#000000';
          const iconSize = component.props?.iconSize || '24px';
          const titleColor = component.props?.titleColor || '#000000';
          const titleFontWeight = component.props?.titleFontWeight || 'normal';
          const titleFontFamily = component.props?.titleFontFamily || 'inherit';
          const borderColor = component.props?.borderColor || '#4caf50';

          noteHtml += `<div style="${summaryBgStyle}; padding: 16px; border-left: 4px solid ${borderColor}; margin-bottom: 24px; border-radius: 4px;">
            <div style="font-weight: ${titleFontWeight}; margin-bottom: 8px; display: flex; align-items: center; color: ${titleColor}; font-family: ${titleFontFamily};">
              <img src="https://api.iconify.design/${(component.props?.icon || 'mdi:text-box-outline').replace(':', '/')}.svg?color=${encodeURIComponent(iconColor)}&height=${iconSize}" style="margin-right: 8px;" width="${iconSize}" height="${iconSize}" />
              ${component.props?.label || 'Resumen'}
            </div>
            <div style="color: #444; font-size: 15px;">${component.content}</div>
          </div>\n`;
          break;
        }
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
        case 'tituloConIcono': {
          const icon = component.props?.icon || 'mdi:newspaper-variant-outline';
          const gradientType = component.props?.gradientType || 'linear';
          const gradientColor1 = component.props?.gradientColor1 || '#4facfe';
          const gradientColor2 = component.props?.gradientColor2 || '#00f2fe';
          const textColor = component.props?.textColor || '#ffffff';

          const gradientStyle =
            gradientType === 'linear'
              ? `linear-gradient(to right, ${gradientColor1}, ${gradientColor2})`
              : `radial-gradient(circle, ${gradientColor1}, ${gradientColor2})`;

          noteHtml += `<div style="background: ${gradientStyle}; padding: 12px 16px; border-radius: 8px 8px 0 0; margin-bottom: 0; display: flex; align-items: center;">
            <img src="https://api.iconify.design/${icon.replace(':', '/')}.svg?color=${encodeURIComponent(textColor)}" style="margin-right: 12px; width: 24px; height: 24px;" />
            <h2 style="margin: 0; color: ${textColor}; font-weight: bold; font-size: 20px;">${component.content}</h2>
          </div>\n`;
          break;
        }
        case 'respaldadoPor': {
          const texto = component.props?.texto || 'Respaldado por';
          const nombre = component.props?.nombre || 'Redacción';
          const avatarUrl = component.props?.avatarUrl || '/default-avatar.png';
          const avatarTamano = component.props?.avatarTamano || 36;

          noteHtml += `<div style="display: flex; align-items: center; gap: 8px; margin: 16px 0;">
            <span style="color: #666; font-size: 14px;">${texto}</span>
            <img src="${avatarUrl}" alt="${nombre}" style="width: ${avatarTamano}px; height: ${avatarTamano}px; border-radius: 50%;" />
            <span style="font-weight: 500;">${nombre}</span>
          </div>\n`;
          break;
        }
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

  // Función para escapar el HTML para AWS SES
  const escapeHtmlForSES = (html: string) =>
    html.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');

  // Modificar la función que genera el HTML para también generar la versión escapada
  const generateNewsletterHtml = () => {
    setGenerating(true);
    try {
      // Configurar el estilo del fondo del encabezado según si usa gradiente o color sólido
      let headerBackgroundStyle = `background-color: ${header.backgroundColor};`;
      if (header.useGradient && header.gradientColors && header.gradientColors.length >= 2) {
        headerBackgroundStyle = `background: linear-gradient(${header.gradientDirection || 180}deg, ${header.gradientColors[0]}, ${header.gradientColors[1]});`;
      }

      // Configurar el estilo del fondo del footer según si usa gradiente o color sólido
      let footerBackgroundStyle = `background-color: ${footer.backgroundColor};`;
      if (footer.useGradient && footer.gradientColors && footer.gradientColors.length >= 2) {
        footerBackgroundStyle = `background: linear-gradient(${footer.gradientDirection || 180}deg, ${footer.gradientColors[0]}, ${footer.gradientColors[1]});`;
      }

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
      ${headerBackgroundStyle}
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
      ${footerBackgroundStyle}
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

      // Después de generar el HTML normal
      setGeneratedHtml(html);

      // Generar la versión escapada para AWS SES
      const escaped = escapeHtmlForSES(html);
      setEscapedHtml(escaped);

      setOpenHtmlPreview(true);
    } catch (error) {
      console.error('Error generating HTML:', error);
      showSnackbar('Error al generar el HTML', 'error');
    } finally {
      setGenerating(false);
    }
  };

  // Modificar la función para copiar el HTML para manejar ambas versiones
  const handleCopyHtml = (useEscaped = false) => {
    const htmlToCopy = useEscaped ? escapedHtml : generatedHtml;
    navigator.clipboard
      .writeText(htmlToCopy)
      .then(() => {
        showSnackbar('HTML copiado al portapapeles', 'success');
      })
      .catch((err) => {
        console.error('Error al copiar HTML:', err);
        showSnackbar('Error al copiar HTML', 'error');
      });
  };

  const toggleSidebar = () => {
    setOpenSidebar(!openSidebar);
  };

  // Función auxiliar para generar el marcador de lista ordenada
  const getOrderedListMarker = (index: number, listStyle: string): string => {
    switch (listStyle) {
      case 'decimal':
        return `${index}`;
      case 'lower-alpha':
        // Letras minúsculas (a, b, c...)
        return `${String.fromCharCode(96 + index)}`;
      case 'upper-alpha':
        // Letras mayúsculas (A, B, C...)
        return `${String.fromCharCode(64 + index)}`;
      case 'lower-roman':
        // Números romanos minúsculos (i, ii, iii...)
        return `${toRoman(index).toLowerCase()}`;
      case 'upper-roman':
        // Números romanos mayúsculos (I, II, III...)
        return `${toRoman(index)}`;
      default:
        return `${index}`;
    }
  };

  // Función para convertir números a numerales romanos
  const toRoman = (num: number): string => {
    const romanNumerals = [
      { value: 1000, numeral: 'M' },
      { value: 900, numeral: 'CM' },
      { value: 500, numeral: 'D' },
      { value: 400, numeral: 'CD' },
      { value: 100, numeral: 'C' },
      { value: 90, numeral: 'XC' },
      { value: 50, numeral: 'L' },
      { value: 40, numeral: 'XL' },
      { value: 10, numeral: 'X' },
      { value: 9, numeral: 'IX' },
      { value: 5, numeral: 'V' },
      { value: 4, numeral: 'IV' },
      { value: 1, numeral: 'I' },
    ];

    let result = '';
    let remaining = num;

    for (const { value, numeral } of romanNumerals) {
      while (remaining >= value) {
        result += numeral;
        remaining -= value;
      }
    }

    return result;
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
            onClick={generateNewsletterHtml}
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
                                    const categorias = component.props?.categorias || [];

                                    if (categorias.length > 0) {
                                      return (
                                        <Box
                                          key={compIndex}
                                          sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}
                                        >
                                          {categorias.map((categoria) => (
                                            <Chip
                                              key={categoria.id}
                                              label={categoria.texto}
                                              sx={{
                                                backgroundColor: categoria.colorFondo,
                                                color: categoria.colorTexto,
                                                fontWeight: 'bold',
                                              }}
                                            />
                                          ))}
                                        </Box>
                                      );
                                    } else {
                                      // Formato antiguo como fallback
                                      const categoryColor = component.props?.color || '#4caf50';
                                      const categoryItems = component.props?.items || [
                                        component.content,
                                      ];
                                      // Obtener las propiedades de estilo
                                      const borderRadius = component.props?.borderRadius || 16;
                                      const padding = component.props?.padding || 4;
                                      const textColor = component.props?.textColor || 'white';
                                      const fontWeight = component.props?.fontWeight || 'bold';
                                      const fontSize = component.props?.fontSize || 14;

                                      return (
                                        <Box
                                          key={compIndex}
                                          sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}
                                        >
                                          {Array.isArray(categoryItems) ? (
                                            categoryItems.map((item, index) => (
                                              <Chip
                                                key={index}
                                                label={item}
                                                sx={{
                                                  backgroundColor: Array.isArray(categoryColor)
                                                    ? categoryColor[index % categoryColor.length]
                                                    : categoryColor,
                                                  color: textColor,
                                                  fontWeight,
                                                  padding: `${padding}px ${padding * 3}px`,
                                                  borderRadius,
                                                  fontSize,
                                                }}
                                              />
                                            ))
                                          ) : (
                                            <Chip
                                              label={categoryItems[0]}
                                              sx={{
                                                backgroundColor: categoryColor,
                                                color: textColor,
                                                fontWeight,
                                                padding: `${padding}px ${padding * 3}px`,
                                                borderRadius,
                                                fontSize,
                                              }}
                                            />
                                          )}
                                        </Box>
                                      );
                                    }
                                    break;
                                  case 'heading':
                                    const HeadingTag =
                                      `h${component.props?.level || 2}` as keyof JSX.IntrinsicElements;
                                    return (
                                      <HeadingTag key={compIndex} style={{ margin: '16px 0' }}>
                                        {component.content}
                                      </HeadingTag>
                                    );
                                    break;
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
                                    break;
                                  case 'button':
                                    return (
                                      <Button key={compIndex} variant="contained" sx={{ my: 1 }}>
                                        {component.content}
                                      </Button>
                                    );
                                    break;
                                  case 'divider':
                                    return <Divider key={compIndex} sx={{ my: 2 }} />;
                                    break;
                                  case 'bulletList':
                                    {
                                      const listItems = component.props?.items || [];
                                      const listStyle = component.props?.listStyle || 'disc';
                                      const listColor = component.props?.listColor || '#000000';

                                      // Determinar si es una lista ordenada
                                      const isOrderedList =
                                        listStyle === 'decimal' ||
                                        listStyle === 'lower-alpha' ||
                                        listStyle === 'upper-alpha' ||
                                        listStyle === 'lower-roman' ||
                                        listStyle === 'upper-roman';

                                      return (
                                        <Box key={compIndex} sx={{ mb: 2 }}>
                                          {listItems.map((item, itemIndex) => (
                                            <Box
                                              key={itemIndex}
                                              sx={{
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                mb: 1,
                                              }}
                                            >
                                              {isOrderedList ? (
                                                <Box
                                                  sx={{
                                                    minWidth: '24px',
                                                    mr: 2,
                                                    backgroundColor: listColor,
                                                    borderRadius: '50%',
                                                    color: 'white',
                                                    fontSize: '12px',
                                                    fontWeight: 'bold',
                                                    height: '24px',
                                                    width: '24px',
                                                    lineHeight: '24px',
                                                    textAlign: 'center',
                                                  }}
                                                >
                                                  {getOrderedListMarker(itemIndex + 1, listStyle)}
                                                </Box>
                                              ) : (
                                                <Box
                                                  sx={{
                                                    minWidth: '24px',
                                                    mr: 2,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                  }}
                                                >
                                                  {listStyle === 'disc' && (
                                                    <Box
                                                      sx={{
                                                        width: '8px',
                                                        height: '8px',
                                                        borderRadius: '50%',
                                                        backgroundColor: listColor,
                                                      }}
                                                    />
                                                  )}
                                                  {listStyle === 'circle' && (
                                                    <Box
                                                      sx={{
                                                        width: '8px',
                                                        height: '8px',
                                                        borderRadius: '50%',
                                                        border: `1px solid ${listColor}`,
                                                        backgroundColor: 'transparent',
                                                      }}
                                                    />
                                                  )}
                                                  {listStyle === 'square' && (
                                                    <Box
                                                      sx={{
                                                        width: '8px',
                                                        height: '8px',
                                                        backgroundColor: listColor,
                                                      }}
                                                    />
                                                  )}
                                                </Box>
                                              )}
                                              <Typography variant="body1">{item}</Typography>
                                            </Box>
                                          ))}
                                        </Box>
                                      );
                                    }
                                    break;
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
                                    } else if (
                                      galleryLayout === 'grid' &&
                                      galleryImages.length > 0
                                    ) {
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
                                  case 'summary': {
                                    const summaryBgStyle = component.props?.useGradient
                                      ? {
                                          background:
                                            component.props?.gradientType === 'linear'
                                              ? `linear-gradient(${component.props?.gradientDirection || 'to right'}, ${component.props?.gradientColor1 || '#f5f7fa'}, ${component.props?.gradientColor2 || '#c3cfe2'})`
                                              : `radial-gradient(circle, ${component.props?.gradientColor1 || '#f5f7fa'}, ${component.props?.gradientColor2 || '#c3cfe2'})`,
                                        }
                                      : {
                                          backgroundColor:
                                            component.props?.backgroundColor || '#f5f7fa',
                                        };

                                    const iconColor = component.props?.iconColor || '#000000';
                                    const iconSize = component.props?.iconSize || 24;
                                    const titleColor = component.props?.titleColor || '#000000';
                                    const titleFontWeight =
                                      component.props?.titleFontWeight || 'normal';
                                    const titleFontFamily =
                                      component.props?.titleFontFamily || 'inherit';
                                    const borderColor = component.props?.borderColor || '#4caf50';

                                    return (
                                      <Box
                                        key={compIndex}
                                        sx={{
                                          ...summaryBgStyle,
                                          p: 2,
                                          borderLeft: `4px solid ${borderColor}`,
                                          mb: 3,
                                          borderRadius: 1,
                                        }}
                                      >
                                        <Box
                                          sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            mb: 1,
                                            fontWeight: titleFontWeight,
                                            color: titleColor,
                                            fontFamily: titleFontFamily,
                                          }}
                                        >
                                          <Icon
                                            icon={component.props?.icon || 'mdi:text-box-outline'}
                                            style={{
                                              color: iconColor,
                                              fontSize: iconSize,
                                              marginRight: 8,
                                            }}
                                          />
                                          {component.props?.label || 'Resumen'}
                                        </Box>
                                        <Typography variant="body2" sx={{ color: '#444' }}>
                                          {component.content}
                                        </Typography>
                                      </Box>
                                    );
                                  }
                                  case 'tituloConIcono': {
                                    const icon =
                                      component.props?.icon || 'mdi:newspaper-variant-outline';
                                    const gradientType = component.props?.gradientType || 'linear';
                                    const gradientColor1 =
                                      component.props?.gradientColor1 || '#4facfe';
                                    const gradientColor2 =
                                      component.props?.gradientColor2 || '#00f2fe';
                                    const textColor = component.props?.textColor || '#ffffff';

                                    const gradientStyle =
                                      gradientType === 'linear'
                                        ? `linear-gradient(to right, ${gradientColor1}, ${gradientColor2})`
                                        : `radial-gradient(circle, ${gradientColor1}, ${gradientColor2})`;

                                    return (
                                      <Box
                                        key={compIndex}
                                        sx={{
                                          background: gradientStyle,
                                          display: 'flex',
                                          alignItems: 'center',
                                          padding: '12px 16px',
                                          borderRadius: '8px 8px 0 0',
                                          mb: 0,
                                        }}
                                      >
                                        <Icon
                                          icon={icon}
                                          style={{
                                            color: textColor,
                                            fontSize: 24,
                                            marginRight: 12,
                                          }}
                                        />
                                        <Typography
                                          variant="h6"
                                          sx={{
                                            margin: 0,
                                            color: textColor,
                                            fontWeight: 'bold',
                                          }}
                                        >
                                          {component.content}
                                        </Typography>
                                      </Box>
                                    );
                                  }
                                  case 'respaldadoPor': {
                                    const texto = component.props?.texto || 'Respaldado por';
                                    const nombre = component.props?.nombre || 'Redacción';
                                    const avatarUrl =
                                      component.props?.avatarUrl || '/default-avatar.png';
                                    const avatarTamano = component.props?.avatarTamano || 36;

                                    return (
                                      <Box
                                        key={compIndex}
                                        sx={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '8px',
                                          my: 2,
                                        }}
                                      >
                                        <Typography
                                          variant="body2"
                                          sx={{
                                            color: '#666',
                                            fontSize: '14px',
                                          }}
                                        >
                                          {texto}
                                        </Typography>
                                        <Avatar
                                          src={avatarUrl}
                                          alt={nombre}
                                          sx={{
                                            width: avatarTamano,
                                            height: avatarTamano,
                                          }}
                                        />
                                        <Typography
                                          variant="body2"
                                          sx={{
                                            fontWeight: 500,
                                          }}
                                        >
                                          {nombre}
                                        </Typography>
                                      </Box>
                                    );
                                  }
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
                      ...(header.useGradient &&
                      header.gradientColors &&
                      header.gradientColors.length >= 2
                        ? {
                            background: `linear-gradient(${header.gradientDirection || 180}deg, ${header.gradientColors[0]}, ${header.gradientColors[1]})`,
                          }
                        : { backgroundColor: header.backgroundColor }),
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
                      ...(footer.useGradient &&
                      footer.gradientColors &&
                      footer.gradientColors.length >= 2
                        ? {
                            background: `linear-gradient(${footer.gradientDirection || 180}deg, ${footer.gradientColors[0]}, ${footer.gradientColors[1]})`,
                          }
                        : { backgroundColor: footer.backgroundColor }),
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
                        ...(header.useGradient &&
                        header.gradientColors &&
                        header.gradientColors.length >= 2
                          ? {
                              background: `linear-gradient(${header.gradientDirection || 180}deg, ${header.gradientColors[0]}, ${header.gradientColors[1]})`,
                            }
                          : {}),
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
                                  const categorias = component.props?.categorias || [];

                                  if (categorias.length > 0) {
                                    return (
                                      <Box
                                        key={compIndex}
                                        sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}
                                      >
                                        {categorias.map((categoria) => (
                                          <Chip
                                            key={categoria.id}
                                            label={categoria.texto}
                                            sx={{
                                              backgroundColor: categoria.colorFondo,
                                              color: categoria.colorTexto,
                                              fontWeight: 'bold',
                                            }}
                                          />
                                        ))}
                                      </Box>
                                    );
                                  } else {
                                    // Formato antiguo como fallback
                                    const categoryColor = component.props?.color || '#4caf50';
                                    const categoryItems = component.props?.items || [
                                      component.content,
                                    ];
                                    // Obtener las propiedades de estilo
                                    const borderRadius = component.props?.borderRadius || 16;
                                    const padding = component.props?.padding || 4;
                                    const textColor = component.props?.textColor || 'white';
                                    const fontWeight = component.props?.fontWeight || 'bold';
                                    const fontSize = component.props?.fontSize || 14;

                                    return (
                                      <Box
                                        key={compIndex}
                                        sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}
                                      >
                                        {Array.isArray(categoryItems) ? (
                                          categoryItems.map((item, index) => (
                                            <Chip
                                              key={index}
                                              label={item}
                                              sx={{
                                                backgroundColor: Array.isArray(categoryColor)
                                                  ? categoryColor[index % categoryColor.length]
                                                  : categoryColor,
                                                color: textColor,
                                                fontWeight,
                                                padding: `${padding}px ${padding * 3}px`,
                                                borderRadius,
                                                fontSize,
                                              }}
                                            />
                                          ))
                                        ) : (
                                          <Chip
                                            label={categoryItems[0]}
                                            sx={{
                                              backgroundColor: categoryColor,
                                              color: textColor,
                                              fontWeight,
                                              padding: `${padding}px ${padding * 3}px`,
                                              borderRadius,
                                              fontSize,
                                            }}
                                          />
                                        )}
                                      </Box>
                                    );
                                  }
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
                                  const listItems = component.props?.items || [];
                                  const listStyle = component.props?.listStyle || 'disc';
                                  const listColor = component.props?.listColor || '#000000';

                                  // Determinar si es una lista ordenada
                                  const isOrderedList =
                                    listStyle === 'decimal' ||
                                    listStyle === 'lower-alpha' ||
                                    listStyle === 'upper-alpha' ||
                                    listStyle === 'lower-roman' ||
                                    listStyle === 'upper-roman';

                                  return (
                                    <Box key={compIndex} sx={{ mb: 2 }}>
                                      {listItems.map((item, itemIndex) => (
                                        <Box
                                          key={itemIndex}
                                          sx={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            mb: 1,
                                          }}
                                        >
                                          {isOrderedList ? (
                                            <Box
                                              sx={{
                                                minWidth: '24px',
                                                mr: 2,
                                                backgroundColor: listColor,
                                                borderRadius: '50%',
                                                color: 'white',
                                                fontSize: '12px',
                                                fontWeight: 'bold',
                                                height: '24px',
                                                width: '24px',
                                                lineHeight: '24px',
                                                textAlign: 'center',
                                              }}
                                            >
                                              {getOrderedListMarker(itemIndex + 1, listStyle)}
                                            </Box>
                                          ) : (
                                            <Box
                                              sx={{
                                                minWidth: '24px',
                                                mr: 2,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                              }}
                                            >
                                              {listStyle === 'disc' && (
                                                <Box
                                                  sx={{
                                                    width: '8px',
                                                    height: '8px',
                                                    borderRadius: '50%',
                                                    backgroundColor: listColor,
                                                  }}
                                                />
                                              )}
                                              {listStyle === 'circle' && (
                                                <Box
                                                  sx={{
                                                    width: '8px',
                                                    height: '8px',
                                                    borderRadius: '50%',
                                                    border: `1px solid ${listColor}`,
                                                    backgroundColor: 'transparent',
                                                  }}
                                                />
                                              )}
                                              {listStyle === 'square' && (
                                                <Box
                                                  sx={{
                                                    width: '8px',
                                                    height: '8px',
                                                    backgroundColor: listColor,
                                                  }}
                                                />
                                              )}
                                            </Box>
                                          )}
                                          <Typography variant="body1">{item}</Typography>
                                        </Box>
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
                                case 'summary': {
                                  const summaryBgStyle = component.props?.useGradient
                                    ? {
                                        background:
                                          component.props?.gradientType === 'linear'
                                            ? `linear-gradient(${component.props?.gradientDirection || 'to right'}, ${component.props?.gradientColor1 || '#f5f7fa'}, ${component.props?.gradientColor2 || '#c3cfe2'})`
                                            : `radial-gradient(circle, ${component.props?.gradientColor1 || '#f5f7fa'}, ${component.props?.gradientColor2 || '#c3cfe2'})`,
                                      }
                                    : {
                                        backgroundColor:
                                          component.props?.backgroundColor || '#f5f7fa',
                                      };

                                  const iconColor = component.props?.iconColor || '#000000';
                                  const iconSize = component.props?.iconSize || 24;
                                  const titleColor = component.props?.titleColor || '#000000';
                                  const titleFontWeight =
                                    component.props?.titleFontWeight || 'normal';
                                  const titleFontFamily =
                                    component.props?.titleFontFamily || 'inherit';
                                  const borderColor = component.props?.borderColor || '#4caf50';

                                  return (
                                    <Box
                                      key={compIndex}
                                      sx={{
                                        ...summaryBgStyle,
                                        p: 2,
                                        borderLeft: `4px solid ${borderColor}`,
                                        mb: 3,
                                        borderRadius: 1,
                                      }}
                                    >
                                      <Box
                                        sx={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          mb: 1,
                                          fontWeight: titleFontWeight,
                                          color: titleColor,
                                          fontFamily: titleFontFamily,
                                        }}
                                      >
                                        <Icon
                                          icon={component.props?.icon || 'mdi:text-box-outline'}
                                          style={{
                                            color: iconColor,
                                            fontSize: iconSize,
                                            marginRight: 8,
                                          }}
                                        />
                                        {component.props?.label || 'Resumen'}
                                      </Box>
                                      <Typography variant="body2" sx={{ color: '#444' }}>
                                        {component.content}
                                      </Typography>
                                    </Box>
                                  );
                                }
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
                        ...(footer.useGradient &&
                        footer.gradientColors &&
                        footer.gradientColors.length >= 2
                          ? {
                              background: `linear-gradient(${footer.gradientDirection || 180}deg, ${footer.gradientColors[0]}, ${footer.gradientColors[1]})`,
                            }
                          : {}),
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
          <Tabs
            value={activeHtmlTab || 'preview'}
            onChange={(e, newValue) => setActiveHtmlTab(newValue)}
          >
            <Tab value="preview" label="Vista Previa" />
            <Tab value="escaped" label="HTML Escapado (AWS SES)" />
          </Tabs>

          {activeHtmlTab === 'preview' && (
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                mt: 2,
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
          )}

          {activeHtmlTab === 'escaped' && (
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                mt: 2,
                maxHeight: '400px',
                overflow: 'auto',
                fontFamily: 'monospace',
                fontSize: '12px',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {escapedHtml}
            </Paper>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={() => setOpenHtmlPreview(false)} sx={{ mr: 1 }}>
              Cerrar
            </Button>
            <Button
              onClick={() => handleCopyHtml(activeHtmlTab === 'escaped')}
              variant="contained"
              color="primary"
            >
              Copiar HTML {activeHtmlTab === 'escaped' ? 'Escapado' : ''}
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
                  Gradient Background
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={header.useGradient || false}
                      onChange={(e) => setHeader({ ...header, useGradient: e.target.checked })}
                    />
                  }
                  label="Enable Gradient"
                />

                {header.useGradient && (
                  <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="caption" display="block" gutterBottom>
                          Start Color
                        </Typography>
                        <input
                          type="color"
                          value={header.gradientColors?.[0] || '#3f51b5'}
                          onChange={(e) => {
                            const newColors = [
                              ...(header.gradientColors || ['#3f51b5', '#2196f3']),
                            ];
                            newColors[0] = e.target.value;
                            setHeader({ ...header, gradientColors: newColors });
                          }}
                          style={{ width: 40, height: 40, padding: 0, border: 'none' }}
                        />
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="caption" display="block" gutterBottom>
                          End Color
                        </Typography>
                        <input
                          type="color"
                          value={header.gradientColors?.[1] || '#2196f3'}
                          onChange={(e) => {
                            const newColors = [
                              ...(header.gradientColors || ['#3f51b5', '#2196f3']),
                            ];
                            newColors[1] = e.target.value;
                            setHeader({ ...header, gradientColors: newColors });
                          }}
                          style={{ width: 40, height: 40, padding: 0, border: 'none' }}
                        />
                      </Box>
                    </Box>

                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Gradient Direction (degrees)
                      </Typography>
                      <Box sx={{ px: 1 }}>
                        <input
                          type="range"
                          min="0"
                          max="360"
                          step="45"
                          value={header.gradientDirection || 180}
                          onChange={(e) =>
                            setHeader({ ...header, gradientDirection: Number(e.target.value) })
                          }
                          style={{ width: '100%' }}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                          <Typography variant="caption">0°</Typography>
                          <Typography variant="caption">90°</Typography>
                          <Typography variant="caption">180°</Typography>
                          <Typography variant="caption">270°</Typography>
                          <Typography variant="caption">360°</Typography>
                        </Box>
                      </Box>
                    </Box>
                  </>
                )}
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

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Gradient Background
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={footer.useGradient || false}
                      onChange={(e) => setFooter({ ...footer, useGradient: e.target.checked })}
                    />
                  }
                  label="Enable Gradient"
                />

                {footer.useGradient && (
                  <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="caption" display="block" gutterBottom>
                          Start Color
                        </Typography>
                        <input
                          type="color"
                          value={footer.gradientColors?.[0] || '#f5f5f5'}
                          onChange={(e) => {
                            const newColors = [
                              ...(footer.gradientColors || ['#f5f5f5', '#e0e0e0']),
                            ];
                            newColors[0] = e.target.value;
                            setFooter({ ...footer, gradientColors: newColors });
                          }}
                          style={{ width: 40, height: 40, padding: 0, border: 'none' }}
                        />
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="caption" display="block" gutterBottom>
                          End Color
                        </Typography>
                        <input
                          type="color"
                          value={footer.gradientColors?.[1] || '#e0e0e0'}
                          onChange={(e) => {
                            const newColors = [
                              ...(footer.gradientColors || ['#f5f5f5', '#e0e0e0']),
                            ];
                            newColors[1] = e.target.value;
                            setFooter({ ...footer, gradientColors: newColors });
                          }}
                          style={{ width: 40, height: 40, padding: 0, border: 'none' }}
                        />
                      </Box>
                    </Box>

                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Gradient Direction (degrees)
                      </Typography>
                      <Box sx={{ px: 1 }}>
                        <input
                          type="range"
                          min="0"
                          max="360"
                          step="45"
                          value={footer.gradientDirection || 180}
                          onChange={(e) =>
                            setFooter({ ...footer, gradientDirection: Number(e.target.value) })
                          }
                          style={{ width: '100%' }}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                          <Typography variant="caption">0°</Typography>
                          <Typography variant="caption">90°</Typography>
                          <Typography variant="caption">180°</Typography>
                          <Typography variant="caption">270°</Typography>
                          <Typography variant="caption">360°</Typography>
                        </Box>
                      </Box>
                    </Box>
                  </>
                )}
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

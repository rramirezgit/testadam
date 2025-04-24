'use client';

import type { SavedNote, EmailComponent } from 'src/types/saved-note';
import type { Newsletter, NewsletterNote } from 'src/types/newsletter';

import { v4 as uuidv4 } from 'uuid';
import { Icon } from '@iconify/react';
import React, { useState, useEffect } from 'react';

import {
  Box,
  Chip,
  Grid,
  Card,
  Paper,
  Switch,
  AppBar,
  Button,
  Dialog,
  Toolbar,
  Divider,
  TextField,
  CardMedia,
  Typography,
  IconButton,
  DialogTitle,
  CardContent,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';

import { useStore } from 'src/lib/store';

import EmailEditor from 'src/components/newsletter-note/email-editor';
import { generateEmailHtml } from 'src/components/newsletter-note/email-editor/utils/generate-html';

import Sidebar from './newsletter-editor/sidebar';
import DesignTab from './newsletter-editor/tabs/design-tab';

import type { HeaderTemplate, FooterTemplate } from './newsletter-editor/types';

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
    showGradient: false,
    gradientColors: ['#4158D0', '#C850C0'],
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
    showGradient: false,
    gradientColors: ['#4158D0', '#C850C0'],
  });

  const [openHeaderDialog, setOpenHeaderDialog] = useState(false);
  const [openFooterDialog, setOpenFooterDialog] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');
  const [bannerImageUrl, setBannerImageUrl] = useState('');
  const [openLogoDialog, setOpenLogoDialog] = useState(false);
  const [openBannerDialog, setOpenBannerDialog] = useState(false);

  const [currentHeaderTemplate, setCurrentHeaderTemplate] = useState<HeaderTemplate | undefined>(
    undefined
  );
  const [currentFooterTemplate, setCurrentFooterTemplate] = useState<FooterTemplate | undefined>(
    undefined
  );

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

  // Añadir un efecto para depurar cambios en header y footer
  useEffect(() => {
    console.log('Header actualizado:', header);
  }, [header]);

  useEffect(() => {
    console.log('Footer actualizado:', footer);
  }, [footer]);

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

  // Actualizar la función handleGenerateHtml para pasar correctamente el header y footer
  const handleGenerateHtml = async () => {
    setGenerating(true);
    try {
      // Crear componentes de email a partir de las notas seleccionadas
      const emailComponents: EmailComponent[] = [];

      // Procesar cada nota seleccionada
      selectedNotes.forEach((note) => {
        // Convertir los componentes de la nota a componentes de email
        note.noteData.objdata.forEach((component) => {
          emailComponents.push({
            id: uuidv4(),
            type: component.type,
            content: component.content,
            props: component.props || {},
            style: component.style || {},
          });
        });

        // Añadir un divisor entre notas
        emailComponents.push({
          id: uuidv4(),
          type: 'divider',
          content: '',
          props: {},
          style: {},
        });
      });

      console.log('Header antes de generar HTML:', header);
      console.log('Footer antes de generar HTML:', footer);

      // Generar el HTML del email
      const html = await generateEmailHtml(
        emailComponents,
        'news', // Template activo
        null, // Banner seleccionado
        [], // Opciones de banner
        '#ffffff', // Fondo del email
        header, // Pasar el header completo
        footer // Pasar el footer completo
      );

      setGeneratedHtml(html);
      setOpenHtmlPreview(true);
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

  // Función para manejar la selección de un header template
  const handleSelectHeader = (headerTemplate: HeaderTemplate) => {
    setCurrentHeaderTemplate(headerTemplate);
    // Aplicar el template al header actual
    const newHeader = {
      ...headerTemplate.template,
      // Asegurarse de que las propiedades opcionales estén definidas
      showGradient: headerTemplate.template.showGradient || false,
      gradientColors: headerTemplate.template.gradientColors || ['#4158D0', '#C850C0'],
    };
    console.log('Nuevo header seleccionado:', newHeader);
    setHeader(newHeader);
  };

  // Función para manejar la selección de un footer template
  const handleSelectFooter = (footerTemplate: FooterTemplate) => {
    setCurrentFooterTemplate(footerTemplate);
    // Aplicar el template al footer actual
    const newFooter = {
      ...footerTemplate.template,
      // Asegurarse de que las propiedades opcionales estén definidas
      showGradient: footerTemplate.template.showGradient || false,
      gradientColors: footerTemplate.template.gradientColors || ['#4158D0', '#C850C0'],
    };
    setFooter(newFooter);
    console.log('Footer actualizado:', newFooter); // Para depuración
  };

  // Actualizar el componente HeaderDialog para incluir opciones de templates y gradiente
  const HeaderDialog = ({
    open,
    onClose,
    header,
    setHeader,
    availableHeaders,
    currentHeaderTemplate,
    setCurrentHeaderTemplate,
  }: {
    open: boolean;
    onClose: () => void;
    header: any;
    setHeader: (header: any) => void;
    availableHeaders: HeaderTemplate[];
    currentHeaderTemplate: HeaderTemplate | undefined;
    setCurrentHeaderTemplate: (template: HeaderTemplate | undefined) => void;
  }) => {
    const [localHeader, setLocalHeader] = useState({ ...header });
    const [gradientColor1, setGradientColor1] = useState(header.gradientColors?.[0] || '#4158D0');
    const [gradientColor2, setGradientColor2] = useState(header.gradientColors?.[1] || '#C850C0');

    useEffect(() => {
      setLocalHeader({ ...header });
      setGradientColor1(header.gradientColors?.[0] || '#4158D0');
      setGradientColor2(header.gradientColors?.[1] || '#C850C0');
    }, [header]);

    const handleApply = () => {
      // Actualizar los colores del gradiente si está habilitado
      const updatedHeader = {
        ...localHeader,
        gradientColors: localHeader.showGradient
          ? [gradientColor1, gradientColor2]
          : ['#4158D0', '#C850C0'],
      };
      console.log('Header actualizado en diálogo:', updatedHeader);
      setHeader(updatedHeader);
      onClose();
    };

    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Header Design</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Header Templates
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {availableHeaders.map((headerTemplate) => (
                <Grid item xs={6} sm={4} key={headerTemplate.id}>
                  <Card
                    variant="outlined"
                    sx={{
                      border:
                        currentHeaderTemplate?.id === headerTemplate.id
                          ? '2px solid #3f51b5'
                          : '1px solid rgba(0, 0, 0, 0.12)',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      setCurrentHeaderTemplate(headerTemplate);
                      setLocalHeader(headerTemplate.template);
                      if (headerTemplate.template.gradientColors) {
                        setGradientColor1(headerTemplate.template.gradientColors[0]);
                        setGradientColor2(headerTemplate.template.gradientColors[1]);
                      }
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="80"
                      image={headerTemplate.preview}
                      alt={headerTemplate.name}
                    />
                    <CardContent sx={{ p: 1 }}>
                      <Typography variant="subtitle2">{headerTemplate.name}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography variant="subtitle1" gutterBottom>
              Header Settings
            </Typography>

            <Box sx={{ px: 3, pb: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Header Title"
                    value={localHeader.title}
                    onChange={(e) => setLocalHeader({ ...localHeader, title: e.target.value })}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Subtitle"
                    value={localHeader.subtitle}
                    onChange={(e) => setLocalHeader({ ...localHeader, subtitle: e.target.value })}
                    margin="normal"
                  />
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Text Alignment
                    </Typography>
                    <Grid container spacing={1}>
                      <Grid item xs={4}>
                        <Button
                          variant={localHeader.alignment === 'left' ? 'contained' : 'outlined'}
                          fullWidth
                          onClick={() => setLocalHeader({ ...localHeader, alignment: 'left' })}
                          startIcon={<Icon icon="mdi:format-align-left" />}
                        >
                          Left
                        </Button>
                      </Grid>
                      <Grid item xs={4}>
                        <Button
                          variant={localHeader.alignment === 'center' ? 'contained' : 'outlined'}
                          fullWidth
                          onClick={() => setLocalHeader({ ...localHeader, alignment: 'center' })}
                          startIcon={<Icon icon="mdi:format-align-center" />}
                        >
                          Center
                        </Button>
                      </Grid>
                      <Grid item xs={4}>
                        <Button
                          variant={localHeader.alignment === 'right' ? 'contained' : 'outlined'}
                          fullWidth
                          onClick={() => setLocalHeader({ ...localHeader, alignment: 'right' })}
                          startIcon={<Icon icon="mdi:format-align-right" />}
                        >
                          Right
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Background
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2" sx={{ mr: 2 }}>
                        Use Gradient:
                      </Typography>
                      <Switch
                        checked={localHeader.showGradient || false}
                        onChange={(e) => {
                          setLocalHeader({
                            ...localHeader,
                            showGradient: e.target.checked,
                          });
                        }}
                      />
                    </Box>

                    {localHeader.showGradient ? (
                      <Box sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Typography variant="body2" sx={{ width: 100 }}>
                            Color 1:
                          </Typography>
                          <Box
                            sx={{
                              width: 36,
                              height: 36,
                              borderRadius: 1,
                              bgcolor: gradientColor1,
                              mr: 1,
                              border: '1px solid #ddd',
                            }}
                          />
                          <TextField
                            size="small"
                            value={gradientColor1}
                            onChange={(e) => setGradientColor1(e.target.value)}
                            sx={{ width: 120 }}
                          />
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ width: 100 }}>
                            Color 2:
                          </Typography>
                          <Box
                            sx={{
                              width: 36,
                              height: 36,
                              borderRadius: 1,
                              bgcolor: gradientColor2,
                              mr: 1,
                              border: '1px solid #ddd',
                            }}
                          />
                          <TextField
                            size="small"
                            value={gradientColor2}
                            onChange={(e) => setGradientColor2(e.target.value)}
                            sx={{ width: 120 }}
                          />
                        </Box>
                        <Box
                          sx={{
                            mt: 2,
                            height: 40,
                            borderRadius: 1,
                            background: `linear-gradient(to right, ${gradientColor1}, ${gradientColor2})`,
                          }}
                        />
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ width: 100 }}>
                          Background:
                        </Typography>
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: 1,
                            bgcolor: localHeader.backgroundColor,
                            mr: 1,
                            border: '1px solid #ddd',
                          }}
                        />
                        <TextField
                          size="small"
                          value={localHeader.backgroundColor}
                          onChange={(e) =>
                            setLocalHeader({ ...localHeader, backgroundColor: e.target.value })
                          }
                          sx={{ width: 120 }}
                        />
                      </Box>
                    )}
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Text Color
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: 1,
                          bgcolor: localHeader.textColor,
                          mr: 1,
                          border: '1px solid #ddd',
                        }}
                      />
                      <TextField
                        size="small"
                        value={localHeader.textColor}
                        onChange={(e) =>
                          setLocalHeader({ ...localHeader, textColor: e.target.value })
                        }
                        sx={{ width: 120 }}
                      />
                    </Box>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Logo
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {localHeader.logo ? (
                        <Box sx={{ mr: 1 }}>
                          <img
                            src={localHeader.logo}
                            alt="Logo"
                            style={{ maxWidth: 100, maxHeight: 40 }}
                          />
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                          No logo
                        </Typography>
                      )}
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setOpenLogoDialog(true)}
                      >
                        Change
                      </Button>
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Banner Image
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {localHeader.bannerImage ? (
                        <Box sx={{ mr: 1 }}>
                          <img
                            src={localHeader.bannerImage}
                            alt="Banner"
                            style={{ maxWidth: 100, maxHeight: 40 }}
                          />
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                          No banner
                        </Typography>
                      )}
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setOpenBannerDialog(true)}
                      >
                        Change
                      </Button>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" onClick={handleApply}>
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  // Definir los headers disponibles
  const availableHeaders = [
    {
      id: 'gradient-logo',
      name: 'Gradient con Logo',
      preview: '/assets/headers/gradient-logo-preview.jpg',
      description: 'Header con gradiente, logo superior y logo inferior',
      template: {
        title: 'Newsletter Title',
        subtitle: 'Your weekly newsletter',
        logo: '/assets/logo.png',
        bannerImage: '/assets/banner.jpg',
        backgroundColor: '#ffffff',
        gradientColors: ['#4158D0', '#C850C0'],
        showGradient: true,
        textColor: '#ffffff',
        alignment: 'center',
      },
    },
    // ... otros headers
  ];

  // Definir los footers disponibles
  const availableFooters = [
    {
      id: 'standard',
      name: 'Estándar',
      preview: '/assets/footers/standard-preview.jpg',
      description: 'Footer estándar con información de contacto y redes sociales',
      template: {
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
      },
    },
    // ... otros footers
  ];

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
        <Sidebar
          sidebarTab={sidebarTab}
          setSidebarTab={setSidebarTab}
          selectedNotes={selectedNotes}
          notes={notes}
          handleAddNote={handleAddNote}
          handleRemoveNote={handleRemoveNote}
          handleEditNote={handleEditNote}
          handleCreateNewNote={handleCreateNewNote}
          activeTab={activeTab}
          onSelectHeader={handleSelectHeader}
          onSelectFooter={handleSelectFooter}
          currentHeader={currentHeaderTemplate}
          currentFooter={currentFooterTemplate}
        />

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
              <DesignTab
                header={header}
                footer={footer}
                setHeader={setHeader}
                setFooter={setFooter}
                setOpenHeaderDialog={setOpenHeaderDialog}
                setOpenFooterDialog={setOpenFooterDialog}
                availableHeaders={availableHeaders}
                availableFooters={availableFooters}
                currentHeaderTemplate={currentHeaderTemplate}
                setCurrentHeaderTemplate={setCurrentHeaderTemplate}
                currentFooterTemplate={currentFooterTemplate}
                setCurrentFooterTemplate={setCurrentFooterTemplate}
              />
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
          initialComponents={[]}
          onSave={(components) => {
            // Manejar guardado de componentes
          }}
          header={header}
          footer={footer}
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
        <HeaderDialog
          open={openHeaderDialog}
          onClose={() => setOpenHeaderDialog(false)}
          header={header}
          setHeader={setHeader}
          availableHeaders={availableHeaders}
          currentHeaderTemplate={currentHeaderTemplate}
          setCurrentHeaderTemplate={setCurrentHeaderTemplate}
        />
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
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Background
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" sx={{ mr: 2 }}>
                    Use Gradient:
                  </Typography>
                  <Switch
                    checked={footer.showGradient || false}
                    onChange={(e) => setFooter({ ...footer, showGradient: e.target.checked })}
                  />
                </Box>

                {footer.showGradient ? (
                  <Box sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2" sx={{ width: 100 }}>
                        Color 1:
                      </Typography>
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: 1,
                          bgcolor: footer.gradientColors?.[0] || '#4158D0',
                          mr: 1,
                          border: '1px solid #ddd',
                        }}
                      />
                      <TextField
                        size="small"
                        value={footer.gradientColors?.[0] || '#4158D0'}
                        onChange={(e) =>
                          setFooter({
                            ...footer,
                            gradientColors: [
                              e.target.value,
                              footer.gradientColors?.[1] || '#C850C0',
                            ],
                          })
                        }
                        sx={{ width: 120 }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ width: 100 }}>
                        Color 2:
                      </Typography>
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: 1,
                          bgcolor: footer.gradientColors?.[1] || '#C850C0',
                          mr: 1,
                          border: '1px solid #ddd',
                        }}
                      />
                      <TextField
                        size="small"
                        value={footer.gradientColors?.[1] || '#C850C0'}
                        onChange={(e) =>
                          setFooter({
                            ...footer,
                            gradientColors: [
                              footer.gradientColors?.[0] || '#4158D0',
                              e.target.value,
                            ],
                          })
                        }
                        sx={{ width: 120 }}
                      />
                    </Box>
                    <Box
                      sx={{
                        mt: 2,
                        height: 40,
                        borderRadius: 1,
                        background: `linear-gradient(to right, ${
                          footer.gradientColors?.[0] || '#4158D0'
                        }, ${footer.gradientColors?.[1] || '#C850C0'})`,
                      }}
                    />
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ width: 100 }}>
                      Background:
                    </Typography>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 1,
                        bgcolor: footer.backgroundColor,
                        mr: 1,
                        border: '1px solid #ddd',
                      }}
                    />
                    <TextField
                      size="small"
                      value={footer.backgroundColor}
                      onChange={(e) => setFooter({ ...footer, backgroundColor: e.target.value })}
                      sx={{ width: 120 }}
                    />
                  </Box>
                )}
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Text Color
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: 1,
                      bgcolor: footer.textColor,
                      mr: 1,
                      border: '1px solid #ddd',
                    }}
                  />
                  <TextField
                    size="small"
                    value={footer.textColor}
                    onChange={(e) => setFooter({ ...footer, textColor: e.target.value })}
                    sx={{ width: 120 }}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <DialogActions>
          <Button onClick={() => setOpenFooterDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setOpenFooterDialog(false)}>
            Apply
          </Button>
        </DialogActions>
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

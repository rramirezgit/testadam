'use client';

import type { Editor } from '@tiptap/react';
import type { Newsletter } from 'src/types/newsletter';
import type { NewsletterComponent } from 'src/types/newsletter-component';

import { v4 as uuidv4 } from 'uuid';
import { Icon } from '@iconify/react';
import React, { useRef, useState, useEffect } from 'react';

import {
  Box,
  Grid,
  Menu,
  Paper,
  Button,
  Dialog,
  Switch,
  Slider,
  Divider,
  MenuItem,
  TextField,
  Accordion,
  Typography,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogActions,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  FormControlLabel,
} from '@mui/material';

import ColorPicker from 'src/components/newsletter-note/color-picker';
import GalleryEditorDialog from 'src/components/newsletter-note/gallery-editor-dialog';
import BannerSelector, { type BannerOption } from 'src/components/newsletter-note/banner-selector';
import SimpleTipTapEditorWithFlags from 'src/components/newsletter-note/simple-tiptap-editor-with-flags';

// Define types for newsletter components
interface NewsletterHeader {
  title: string;
  subtitle?: string;
  logo?: string;
  bannerImage?: string;
  backgroundColor: string;
  textColor?: string;
  alignment: 'left' | 'center' | 'right';
  useGradient?: boolean;
  gradientColors?: string[];
  gradientDirection?: number;
}

interface NewsletterFooter {
  companyName: string;
  address?: string;
  contactEmail?: string;
  socialLinks?: { platform: string; url: string }[];
  unsubscribeLink?: string;
  backgroundColor: string;
  textColor?: string;
}

interface NewsletterContentEditorProps {
  onClose: () => void;
  initialNewsletter?: Newsletter | null;
  onSave: (newsletter: Newsletter) => void;
}

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
    return undefined;
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

// Banner options for the newsletter
const bannerOptions: BannerOption[] = [
  {
    id: 'solid-white',
    name: 'White Background',
    color: '#ffffff',
    preview: '/blank-canvas.png',
  },
  {
    id: 'solid-light',
    name: 'Light Gray',
    color: '#f5f5f5',
    preview: '/light-gray-canvas.png',
  },
  {
    id: 'gradient-blue',
    name: 'Blue Gradient',
    color: '#e9f2ff',
    gradient: ['#e9f2ff', '#c7d8f2'],
    preview: '/calming-blue-gradient.png',
  },
  {
    id: 'gradient-warm',
    name: 'Warm Gradient',
    color: '#fff9e9',
    gradient: ['#fff9e9', '#ffefd5'],
    preview: '/sunset-glow.png',
  },
  {
    id: 'pattern-dots',
    name: 'Dot Pattern',
    color: '#f8f9fa',
    pattern: 'dots',
    preview: '/abstract-geometric-dots.png',
  },
  {
    id: 'pattern-lines',
    name: 'Line Pattern',
    color: '#f8f9fa',
    pattern: 'lines',
    preview: '/abstract-lined-pattern.png',
  },
];

export default function NewsletterContentEditor({
  onClose,
  initialNewsletter,
  onSave,
}: NewsletterContentEditorProps) {
  // Basic newsletter info
  const [newsletterId, setNewsletterId] = useState<string>(initialNewsletter?.id || uuidv4());
  const [title, setTitle] = useState<string>(initialNewsletter?.title || '');
  const [description, setDescription] = useState<string>(initialNewsletter?.description || '');

  // Editor state
  const [activeTab, setActiveTab] = useState<string>('content');
  const [editMode, setEditMode] = useState<boolean>(true);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [activeEditor, setActiveEditor] = useState<Editor | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  // Estados para el formato de texto
  const [selectedAlignment, setSelectedAlignment] = useState<string>('left');
  const [selectedColor, setSelectedColor] = useState<string>('#000000');
  const [textFormat, setTextFormat] = useState<string[]>([]);

  // Content components
  const [components, setComponents] = useState<NewsletterComponent[]>([]);

  // Header and footer
  const [header, setHeader] = useState<NewsletterHeader>({
    title: initialNewsletter?.title || 'Newsletter Title',
    subtitle: 'Your weekly newsletter',
    alignment: 'center',
    backgroundColor: '#3f51b5',
    textColor: '#ffffff',
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

  // Design settings
  const [selectedBanner, setSelectedBanner] = useState<string | null>(null);
  const [emailBackground, setEmailBackground] = useState<string>('#ffffff');
  const [showGradient, setShowGradient] = useState<boolean>(false);
  const [gradientColors, setGradientColors] = useState<string[]>(['#f6f9fc', '#e9f2ff']);

  // UI state
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    'success' | 'error' | 'info' | 'warning'
  >('success');
  const [openPreviewDialog, setOpenPreviewDialog] = useState<boolean>(false);
  const [generatingEmail, setGeneratingEmail] = useState<boolean>(false);
  const [emailHtml, setEmailHtml] = useState<string>('');
  const [openHeaderDialog, setOpenHeaderDialog] = useState<boolean>(false);
  const [openFooterDialog, setOpenFooterDialog] = useState<boolean>(false);
  const [openLogoDialog, setOpenLogoDialog] = useState<boolean>(false);
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [bannerImageUrl, setBannerImageUrl] = useState<string>('');
  const [openBannerDialog, setOpenBannerDialog] = useState<boolean>(false);
  const [openGalleryDialog, setOpenGalleryDialog] = useState<boolean>(false);
  const [editingGalleryId, setEditingGalleryId] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Load initial newsletter if provided
  useEffect(() => {
    if (initialNewsletter) {
      setTitle(initialNewsletter.title);
      setDescription(initialNewsletter.description || '');

      // If the newsletter has content components, load them
      if (initialNewsletter.content) {
        setComponents(initialNewsletter.content);
      }

      // If the newsletter has header/footer settings, load them
      if (initialNewsletter.header) {
        setHeader(initialNewsletter.header as any);
      }

      if (initialNewsletter.footer) {
        setFooter(initialNewsletter.footer);
      }

      // Load design settings
      if (initialNewsletter.design) {
        if (initialNewsletter.design.backgroundColor) {
          setEmailBackground(initialNewsletter.design.backgroundColor);
        }

        if (initialNewsletter.design.selectedBanner) {
          setSelectedBanner(initialNewsletter.design.selectedBanner);
        }

        if (initialNewsletter.design.showGradient) {
          setShowGradient(initialNewsletter.design.showGradient);
        }

        if (initialNewsletter.design.gradientColors) {
          setGradientColors(initialNewsletter.design.gradientColors);
        }
      }
    }
  }, [initialNewsletter]);

  // Update component content
  const updateComponentContent = (id: string, content: string) => {
    setComponents((prevComponents) =>
      prevComponents.map((component) =>
        component.id === id ? { ...component, content } : component
      )
    );
  };

  // Update component props
  const updateComponentProps = (id: string, props: Record<string, any>) => {
    setComponents((prevComponents) =>
      prevComponents.map((component) =>
        component.id === id ? { ...component, props: { ...component.props, ...props } } : component
      )
    );
  };

  // Update component style
  const updateComponentStyle = (id: string, style: React.CSSProperties) => {
    setComponents((prevComponents) =>
      prevComponents.map((component) =>
        component.id === id ? { ...component, style: { ...component.style, ...style } } : component
      )
    );
  };

  // Add a new component
  const addComponent = (
    type:
      | 'heading'
      | 'paragraph'
      | 'bulletList'
      | 'button'
      | 'divider'
      | 'spacer'
      | 'image'
      | 'category'
      | 'gallery',
    galleryLayout?: 'single' | 'double' | 'grid'
  ) => {
    const newComponent: NewsletterComponent = {
      id: `${type}-${Date.now()}`,
      type,
      content:
        type === 'heading'
          ? 'New Heading'
          : type === 'paragraph'
            ? 'New paragraph text'
            : type === 'button'
              ? 'Button Text'
              : type === 'bulletList'
                ? 'List item'
                : '',
      props:
        type === 'heading'
          ? { level: 2 }
          : type === 'bulletList'
            ? { items: ['Item 1', 'Item 2', 'Item 3'] }
            : type === 'image'
              ? { src: '/assets/images/templates/news.svg', alt: 'Imagen por defecto' }
              : type === 'gallery'
                ? {
                    layout: galleryLayout || 'single',
                    images:
                      galleryLayout === 'single'
                        ? [{ src: '/placeholder.svg?key=sc2jv', alt: 'Image 1' }]
                        : galleryLayout === 'double'
                          ? [
                              { src: '/placeholder.svg?key=sc2jv', alt: 'Image 1' },
                              { src: '/placeholder.svg?key=sc2jw', alt: 'Image 2' },
                            ]
                          : [
                              { src: '/placeholder.svg?key=sc2jv', alt: 'Image 1' },
                              { src: '/placeholder.svg?key=sc2jw', alt: 'Image 2' },
                              { src: '/placeholder.svg?key=sc2jx', alt: 'Image 3' },
                              { src: '/placeholder.svg?key=sc2jy', alt: 'Image 4' },
                            ],
                  }
                : {},
      style: {},
    };

    setComponents((prevComponents) => [...prevComponents, newComponent]);
    setSelectedComponentId(newComponent.id);

    // Si es una galería, abrir el editor de galería inmediatamente
    if (type === 'gallery') {
      setEditingGalleryId(newComponent.id);
      setOpenGalleryDialog(true);
    }

    // Scroll to the new component
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.scrollTop = editorRef.current.scrollHeight;
      }
    }, 100);
  };

  // Remove a component
  const removeComponent = (id: string) => {
    setComponents((prevComponents) => prevComponents.filter((component) => component.id !== id));
    setSelectedComponentId(null);
  };

  // Move a component up or down
  const moveComponent = (id: string, direction: 'up' | 'down') => {
    const index = components.findIndex((component) => component.id === id);

    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === components.length - 1) return;

    const newComponents = [...components];
    const component = newComponents[index];

    if (direction === 'up') {
      newComponents[index] = newComponents[index - 1];
      newComponents[index - 1] = component;
    } else {
      newComponents[index] = newComponents[index + 1];
      newComponents[index + 1] = component;
    }

    setComponents(newComponents);
  };

  // Handle selection update in the editor
  const handleSelectionUpdate = (editor: Editor) => {
    if (!editor) return;
    setActiveEditor(editor);
  };

  // Crear una función específica para manejar la selección de cada componente
  const createSelectionHandler = (componentId: string) => (editor: Editor) => {
    if (!editor) return;
    setActiveEditor(editor);
    setSelectedComponentId(componentId);

    // Actualizar los controles de formato basados en el estado del editor
    if (editor) {
      const newFormats = [];
      if (editor.isActive('bold')) newFormats.push('bold');
      if (editor.isActive('italic')) newFormats.push('italic');
      if (editor.isActive('underline')) newFormats.push('underlined');
      if (editor.isActive('strike')) newFormats.push('strikethrough');

      setTextFormat(newFormats);

      // Actualizar alineación
      let newAlignment = 'left';
      if (editor.isActive({ textAlign: 'center' })) newAlignment = 'center';
      else if (editor.isActive({ textAlign: 'right' })) newAlignment = 'right';
      else if (editor.isActive({ textAlign: 'justify' })) newAlignment = 'justify';

      setSelectedAlignment(newAlignment);

      // Actualizar color si está disponible
      const marks = editor.getAttributes('textStyle');
      if (marks.color) {
        setSelectedColor(marks.color);
      }
    }
  };

  // Aplicar formato al texto seleccionado
  const applyTextFormat = (format: string) => {
    if (!activeEditor) return;

    switch (format) {
      case 'bold':
        activeEditor.chain().focus().toggleBold().run();
        break;
      case 'italic':
        activeEditor.chain().focus().toggleItalic().run();
        break;
      case 'underlined':
        activeEditor.chain().focus().toggleUnderline().run();
        break;
      case 'strikethrough':
        activeEditor.chain().focus().toggleStrike().run();
        break;
      default:
        break;
    }

    // Actualizar el estado después de aplicar el formato
    setTimeout(() => {
      if (activeEditor) {
        const newFormats = [];
        if (activeEditor.isActive('bold')) newFormats.push('bold');
        if (activeEditor.isActive('italic')) newFormats.push('italic');
        if (activeEditor.isActive('underline')) newFormats.push('underlined');
        if (activeEditor.isActive('strike')) newFormats.push('strikethrough');
        setTextFormat(newFormats);
      }
    }, 10);
  };

  // Aplicar alineación al texto seleccionado
  const applyTextAlignment = (alignment: string) => {
    if (!activeEditor) return;
    activeEditor.chain().focus().setTextAlign(alignment).run();
    setSelectedAlignment(alignment);
  };

  // Aplicar color al texto seleccionado
  const applyTextColor = (color: string) => {
    if (!activeEditor) return;
    activeEditor.chain().focus().setColor(color).run();
    setSelectedColor(color);
  };

  // Save the newsletter
  const handleSaveNewsletter = () => {
    if (!title.trim()) {
      showSnackbar('Please enter a newsletter title', 'error');
      return;
    }

    setIsSaving(true);

    try {
      const newsletter: Newsletter = {
        id: newsletterId,
        title: title.trim(),
        description: description.trim(),
        dateCreated: initialNewsletter?.dateCreated || new Date().toISOString(),
        dateModified: new Date().toISOString(),
        content: components,
        header: header as any,
        footer: footer as any,
        design: {
          backgroundColor: emailBackground,
          selectedBanner,
          showGradient,
          gradientColors,
        },
        notes: initialNewsletter?.notes || [],
      };

      onSave(newsletter);
      showSnackbar('Newsletter saved successfully', 'success');
    } catch (error) {
      console.error('Error saving newsletter:', error);
      showSnackbar('An error occurred while saving the newsletter', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Show a snackbar message
  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  // Handle gallery editor save
  const handleGallerySave = (images: any[], layout: string) => {
    if (editingGalleryId) {
      // Asegurarnos de que cada imagen tenga una URL válida
      const validatedImages = images.map((img) => ({
        ...img,
        src: img.src || '/placeholder.svg',
      }));

      updateComponentProps(editingGalleryId, {
        images: validatedImages,
        layout,
      });

      // Cerrar el diálogo después de guardar
      setOpenGalleryDialog(false);
      setEditingGalleryId(null);

      // Mostrar confirmación
      showSnackbar('Galería actualizada correctamente', 'success');
    }
  };

  // Generate HTML for the newsletter
  const generateEmailHtml = async () => {
    setGeneratingEmail(true);
    try {
      // Determinar el estilo de fondo del encabezado
      let headerBackgroundStyle = '';
      if (header.useGradient && header.gradientColors && header.gradientColors.length >= 2) {
        headerBackgroundStyle = `background: linear-gradient(${header.gradientDirection || 180}deg, ${header.gradientColors[0]}, ${header.gradientColors[1]});`;
      } else {
        headerBackgroundStyle = `background-color: ${header.backgroundColor};`;
      }

      // Crear estructura HTML básica con el estilo de fondo actualizado
      let html =
        '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>' +
        title +
        '</title><style>body{font-family:Arial,Helvetica,sans-serif;line-height:1.6;margin:0;padding:0;background-color:#f9f9f9}.container{max-width:600px;margin:0 auto;background-color:#ffffff}.header{padding:20px;text-align:' +
        header.alignment +
        ';' +
        headerBackgroundStyle +
        'color:' +
        header.textColor +
        '}.content{padding:20px}.footer{padding:20px;text-align:center;font-size:12px;background-color:' +
        footer.backgroundColor +
        ';color:' +
        footer.textColor +
        '}h1,h2,h3,h4,h5,h6{margin-top:0}img{max-width:100%;height:auto}.button{display:inline-block;padding:10px 20px;background-color:#3f51b5;color:white;text-decoration:none;border-radius:4px}.social-links{margin-top:10px}.social-link{display:inline-block;margin:0 5px}</style></head><body><div class="container"><div class="header">';

      // Add header content
      if (header.logo) {
        html +=
          '<img src="' +
          header.logo +
          '" alt="Logo" style="max-height: 50px; margin-bottom: 10px;"><br>';
      }

      html += '<h1>' + header.title + '</h1>';

      if (header.subtitle) {
        html += '<p>' + header.subtitle + '</p>';
      }

      if (header.bannerImage) {
        html +=
          '<img src="' +
          header.bannerImage +
          '" alt="Banner" style="width: 100%; margin-top: 10px;">';
      }

      html += '</div><div class="content">';

      // Add content components
      components.forEach((component) => {
        switch (component.type) {
          case 'category':
            const categoryColors = Array.isArray(component.props?.color)
              ? component.props.color
              : [component.props?.color || '#4caf50'];
            const categoryItems = component.props?.items || [component.content];

            html += `<div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px;">\n`;
            categoryItems.forEach((item: string, index: number) => {
              const itemColor = categoryColors[index % categoryColors.length] || '#4caf50';
              html += `<div style="display: inline-block; background-color: ${itemColor}; color: white; padding: 4px 12px; border-radius: 16px; font-size: 14px;">${item}</div>\n`;
            });
            html += `</div>\n`;
            break;
          case 'gallery':
            const layout = component.props?.layout || 'single';
            const images = component.props?.images || [];

            if (layout === 'single') {
              html += `<div style="margin: 20px 0;"><img src="${images[0]?.src || '/placeholder.svg'}" alt="${images[0]?.alt || ''}" style="width: 100%; border-radius: 8px;"></div>`;
            } else if (layout === 'double') {
              html += `<table cellpadding="0" cellspacing="8" border="0" width="100%" style="margin: 20px 0;">
                <tr>
                  <td width="50%"><img src="${images[0]?.src || '/placeholder.svg'}" alt="${images[0]?.alt || ''}" style="width: 100%; border-radius: 8px;"></td>
                  <td width="50%"><img src="${images[1]?.src || '/placeholder.svg'}" alt="${images[1]?.alt || ''}" style="width: 100%; border-radius: 8px;"></td>
                </tr>
              </table>`;
            } else if (layout === 'grid') {
              html += `<table cellpadding="0" cellspacing="8" border="0" width="100%" style="margin: 20px 0;">
                <tr>
                  <td width="50%"><img src="${images[0]?.src || '/placeholder.svg'}" alt="${images[0]?.alt || ''}" style="width: 100%; border-radius: 8px;"></td>
                  <td width="50%"><img src="${images[1]?.src || '/placeholder.svg'}" alt="${images[1]?.alt || ''}" style="width: 100%; border-radius: 8px;"></td>
                </tr>
                <tr>
                  <td width="50%"><img src="${images[2]?.src || '/placeholder.svg'}" alt="${images[2]?.alt || ''}" style="width: 100%; border-radius: 8px;"></td>
                  <td width="50%"><img src="${images[3]?.src || '/placeholder.svg'}" alt="${images[3]?.alt || ''}" style="width: 100%; border-radius: 8px;"></td>
                </tr>
              </table>`;
            }
            break;
          case 'heading':
            const level = component.props?.level || 2;
            html += '<h' + level + '>' + component.content + '</h' + level + '>';
            break;
          case 'paragraph':
            if (component.props?.isCode) {
              html +=
                '<div style="background-color: #f4f4f4; padding: 16px; border-radius: 5px; border: 1px solid #eee; color: #333; font-family: monospace;">' +
                component.content +
                '</div>';
            } else {
              html += '<p>' + component.content + '</p>';
            }
            break;
          case 'button':
            html += '<a href="#" class="button">' + component.content + '</a>';
            break;
          case 'divider':
            html += '<hr style="border: 0; border-top: 1px solid #eaeaea; margin: 20px 0;">';
            break;
          case 'bulletList':
            const items = component.props?.items || [];
            html += '<ul>';
            items.forEach((item) => {
              html += '<li>' + item + '</li>';
            });
            html += '</ul>';
            break;
          case 'image':
            html +=
              '<div style="text-align: center; margin: 20px 0;"><img src="' +
              (component.props?.src || '/placeholder.svg') +
              '" alt="' +
              (component.props?.alt || 'Image') +
              '" style="max-width: 100%;"></div>';
            break;
          case 'spacer':
            html += '<div style="height: 32px;"></div>';
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

            html += `<div style="${summaryBgStyle}; padding: 16px; border-left: 4px solid ${borderColor}; margin-bottom: 24px; border-radius: 4px;">
              <div style="font-weight: ${titleFontWeight}; margin-bottom: 8px; display: flex; align-items: center; color: ${titleColor}; font-family: ${titleFontFamily};">
                <img src="https://api.iconify.design/${(component.props?.icon || 'mdi:text-box-outline').replace(':', '/')}.svg?color=${encodeURIComponent(iconColor)}&height=${iconSize}" style="margin-right: 8px;" width="${iconSize}" height="${iconSize}" />
                ${component.props?.label || 'Resumen'}
              </div>
              <div style="color: #444; font-size: 15px;">${component.content}</div>
            </div>`;
            break;
          }
          default:
            break;
        }
      });

      // Add footer
      html += '</div><div class="footer"><p><strong>' + footer.companyName + '</strong></p>';

      if (footer.address) {
        html += '<p>' + footer.address + '</p>';
      }

      if (footer.contactEmail) {
        html +=
          '<p>Contact: <a href="mailto:' +
          footer.contactEmail +
          '">' +
          footer.contactEmail +
          '</a></p>';
      }

      html += '<div class="social-links">';

      if (footer.socialLinks && footer.socialLinks.length > 0) {
        const links = footer.socialLinks
          .map(
            (link) =>
              '<a href="' +
              link.url +
              '" class="social-link" target="_blank">' +
              link.platform.charAt(0).toUpperCase() +
              link.platform.slice(1) +
              '</a>'
          )
          .join(' | ');

        html += links;
      }

      html +=
        '</div><p style="margin-top: 15px;"><a href="' +
        (footer.unsubscribeLink || '#') +
        '">Unsubscribe</a> | <a href="#">View in browser</a></p><p>&copy; ' +
        new Date().getFullYear() +
        ' ' +
        footer.companyName +
        '. All rights reserved.</p></div></div></body></html>';

      setEmailHtml(html);
      setOpenPreviewDialog(true);
      showSnackbar('Email HTML generated successfully', 'success');
    } catch (error) {
      console.error('Error generating HTML:', error);
      showSnackbar('Error generating HTML', 'error');
    } finally {
      setGeneratingEmail(false);
    }
  };

  // Copy HTML to clipboard
  const copyHtmlToClipboard = () => {
    navigator.clipboard
      .writeText(emailHtml)
      .then(() => {
        showSnackbar('HTML copied to clipboard', 'success');
      })
      .catch(() => {
        showSnackbar('Failed to copy HTML', 'error');
      });
  };

  // Render a component
  const renderComponent = (component: NewsletterComponent, index: number) => {
    const isSelected = component.id === selectedComponentId;

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      setSelectedComponentId(component.id);
    };

    const componentStyle = {
      position: 'relative',
      padding: '8px',
      margin: '4px 0',
      border: isSelected ? '2px solid #3f51b5' : '1px solid transparent',
      borderRadius: '4px',
      transition: 'all 0.2s',
      '&:hover': {
        border: '1px solid #e0e0e0',
      },
    };

    // Handle content change
    const handleContentChange = (newContent: string) => {
      updateComponentContent(component.id, newContent);
    };

    switch (component.type) {
      case 'category':
        const categoryColors = Array.isArray(component.props?.color)
          ? component.props.color
          : [component.props?.color || '#4caf50'];
        const categoryItems = component.props?.items || [component.content];

        return (
          <Box sx={componentStyle} onClick={handleClick} key={component.id}>
            <Box sx={{ mb: 2, ...(component.style || {}) }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {categoryItems.map((item: string, categoryIndex: number) => (
                  <div
                    key={categoryIndex}
                    style={{
                      display: 'inline-block',
                      backgroundColor:
                        categoryColors[categoryIndex % categoryColors.length] || '#4caf50',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '16px',
                      fontSize: '14px',
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </Box>
            {isSelected && (
              <Box
                sx={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  display: 'flex',
                  gap: '4px',
                  background: 'white',
                  border: '1px solid #e0e0e0',
                  borderRadius: '4px',
                  padding: '2px',
                }}
              >
                <IconButton
                  size="small"
                  onClick={() => {
                    const newItems = [...categoryItems, 'New item'];
                    updateComponentProps(component.id, { items: newItems });
                  }}
                >
                  <Icon icon="mdi:plus" width={16} />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => moveComponent(component.id, 'up')}
                  disabled={index === 0}
                >
                  <Icon icon="mdi:arrow-up" width={16} />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => moveComponent(component.id, 'down')}
                  disabled={index === components.length - 1}
                >
                  <Icon icon="mdi:arrow-down" width={16} />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => removeComponent(component.id)}
                >
                  <Icon icon="mdi:delete" width={16} />
                </IconButton>
              </Box>
            )}
          </Box>
        );

      case 'gallery':
        const layout = component.props?.layout || 'single';
        const images = component.props?.images || [];

        return (
          <Box sx={componentStyle} onClick={handleClick} key={component.id}>
            <Box sx={{ mb: 2, ...(component.style || {}) }}>
              {layout === 'single' && (
                <img
                  src={images[0]?.src || '/placeholder.svg'}
                  alt={images[0]?.alt || 'Gallery image'}
                  style={{ width: '100%', borderRadius: '8px' }}
                />
              )}

              {layout === 'double' && (
                <Grid container spacing={1}>
                  <Grid component="div" size={{ xs: 6 }}>
                    <img
                      src={images[0]?.src || '/placeholder.svg'}
                      alt={images[0]?.alt || 'Gallery image'}
                      style={{ width: '100%', borderRadius: '8px' }}
                    />
                  </Grid>
                  <Grid component="div" size={{ xs: 6 }}>
                    <img
                      src={images[1]?.src || '/placeholder.svg'}
                      alt={images[1]?.alt || 'Gallery image'}
                      style={{ width: '100%', borderRadius: '8px' }}
                    />
                  </Grid>
                </Grid>
              )}

              {layout === 'grid' && (
                <Grid container spacing={1}>
                  <Grid component="div" size={{ xs: 6 }}>
                    <img
                      src={images[0]?.src || '/placeholder.svg'}
                      alt={images[0]?.alt || 'Gallery image'}
                      style={{ width: '100%', borderRadius: '8px', marginBottom: '8px' }}
                    />
                  </Grid>
                  <Grid component="div" size={{ xs: 6 }}>
                    <img
                      src={images[1]?.src || '/placeholder.svg'}
                      alt={images[1]?.alt || 'Gallery image'}
                      style={{ width: '100%', borderRadius: '8px', marginBottom: '8px' }}
                    />
                  </Grid>
                  <Grid component="div" size={{ xs: 6 }}>
                    <img
                      src={images[2]?.src || '/placeholder.svg'}
                      alt={images[2]?.alt || 'Gallery image'}
                      style={{ width: '100%', borderRadius: '8px' }}
                    />
                  </Grid>
                  <Grid component="div" size={{ xs: 6 }}>
                    <img
                      src={images[3]?.src || '/placeholder.svg'}
                      alt={images[3]?.alt || 'Gallery image'}
                      style={{ width: '100%', borderRadius: '8px' }}
                    />
                  </Grid>
                </Grid>
              )}
            </Box>

            {isSelected && (
              <Box
                sx={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  display: 'flex',
                  gap: '4px',
                  background: 'white',
                  border: '1px solid #e0e0e0',
                  borderRadius: '4px',
                  padding: '2px',
                }}
              >
                <IconButton
                  size="small"
                  color="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingGalleryId(component.id);
                    setOpenGalleryDialog(true);
                  }}
                >
                  <Icon icon="mdi:pencil" width={16} />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => moveComponent(component.id, 'up')}
                  disabled={index === 0}
                >
                  <Icon icon="mdi:arrow-up" width={16} />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => moveComponent(component.id, 'down')}
                  disabled={index === components.length - 1}
                >
                  <Icon icon="mdi:arrow-down" width={16} />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => removeComponent(component.id)}
                >
                  <Icon icon="mdi:delete" width={16} />
                </IconButton>
              </Box>
            )}
          </Box>
        );

      case 'heading':
        const HeadingTag = `h${component.props?.level || 2}` as React.ElementType;
        return (
          <Box sx={componentStyle} onClick={handleClick} key={component.id}>
            <Box
              sx={{
                // Permitir que los estilos del editor se apliquen correctamente
                '& h1, & h2, & h3, & h4, & h5, & h6': {
                  margin: 0,
                  padding: 0,
                  fontWeight: 'inherit',
                  fontSize: 'inherit',
                  lineHeight: 'inherit',
                  color: 'inherit',
                  textAlign: 'inherit',
                },
                // ✅ Estilos base para que se vea como título por defecto
                fontSize:
                  component.props?.level === 1
                    ? '2.125rem'
                    : component.props?.level === 2
                      ? '1.875rem'
                      : component.props?.level === 3
                        ? '1.5rem'
                        : '1.25rem',
                fontWeight: 'bold',
                lineHeight: 1.2,
                marginBottom: '0.5rem',
                ...(component.style || {}),
              }}
            >
              <HeadingTag>
                <SimpleTipTapEditorWithFlags
                  content={component.content}
                  onChange={handleContentChange}
                  onSelectionUpdate={createSelectionHandler(component.id)}
                  style={{
                    outline: 'none',
                    width: '100%',
                    minHeight: '1.5em',
                  }}
                  showToolbar={false}
                />
              </HeadingTag>
            </Box>
            {isSelected && (
              <Box
                sx={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  display: 'flex',
                  gap: '4px',
                  background: 'white',
                  border: '1px solid #e0e0e0',
                  borderRadius: '4px',
                  padding: '2px',
                }}
              >
                <IconButton
                  size="small"
                  onClick={() => moveComponent(component.id, 'up')}
                  disabled={index === 0}
                >
                  <Icon icon="mdi:arrow-up" width={16} />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => moveComponent(component.id, 'down')}
                  disabled={index === components.length - 1}
                >
                  <Icon icon="mdi:arrow-down" width={16} />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => removeComponent(component.id)}
                >
                  <Icon icon="mdi:delete" width={16} />
                </IconButton>
              </Box>
            )}
          </Box>
        );

      case 'paragraph':
        return (
          <Box sx={componentStyle} onClick={handleClick} key={component.id}>
            <Typography
              variant="body1"
              component="p"
              style={{
                ...(component.props?.isCode && {
                  backgroundColor: '#f5f5f5',
                  padding: '12px',
                  fontFamily: 'monospace',
                  textAlign: 'center',
                  borderRadius: '4px',
                }),
                ...(component.style || {}),
              }}
            >
              <SimpleTipTapEditorWithFlags
                content={component.content}
                onChange={handleContentChange}
                onSelectionUpdate={createSelectionHandler(component.id)}
                style={{ outline: 'none' }}
                showToolbar={false}
              />
            </Typography>
            {isSelected && (
              <Box
                sx={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  display: 'flex',
                  gap: '4px',
                  background: 'white',
                  border: '1px solid #e0e0e0',
                  borderRadius: '4px',
                  padding: '2px',
                }}
              >
                <IconButton
                  size="small"
                  onClick={() => moveComponent(component.id, 'up')}
                  disabled={index === 0}
                >
                  <Icon icon="mdi:arrow-up" width={16} />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => moveComponent(component.id, 'down')}
                  disabled={index === components.length - 1}
                >
                  <Icon icon="mdi:arrow-down" width={16} />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => removeComponent(component.id)}
                >
                  <Icon icon="mdi:delete" width={16} />
                </IconButton>
              </Box>
            )}
          </Box>
        );

      case 'button':
        return (
          <Box sx={componentStyle} onClick={handleClick} key={component.id}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mb: 2, textTransform: 'none', ...(component.style || {}) }}
              onClick={(e) => e.stopPropagation()}
            >
              <SimpleTipTapEditorWithFlags
                content={component.content}
                onChange={handleContentChange}
                onSelectionUpdate={createSelectionHandler(component.id)}
                style={{ color: 'white', width: '100%', outline: 'none' }}
                showToolbar={false}
              />
            </Button>
            {isSelected && (
              <Box
                sx={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  display: 'flex',
                  gap: '4px',
                  background: 'white',
                  border: '1px solid #e0e0e0',
                  borderRadius: '4px',
                  padding: '2px',
                }}
              >
                <IconButton
                  size="small"
                  onClick={() => moveComponent(component.id, 'up')}
                  disabled={index === 0}
                >
                  <Icon icon="mdi:arrow-up" width={16} />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => moveComponent(component.id, 'down')}
                  disabled={index === components.length - 1}
                >
                  <Icon icon="mdi:arrow-down" width={16} />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => removeComponent(component.id)}
                >
                  <Icon icon="mdi:delete" width={16} />
                </IconButton>
              </Box>
            )}
          </Box>
        );

      case 'divider':
        return (
          <Box sx={componentStyle} onClick={handleClick} key={component.id}>
            <Divider sx={{ my: 2, ...(component.style || {}) }} />
            {isSelected && (
              <Box
                sx={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  display: 'flex',
                  gap: '4px',
                  background: 'white',
                  border: '1px solid #e0e0e0',
                  borderRadius: '4px',
                  padding: '2px',
                }}
              >
                <IconButton
                  size="small"
                  onClick={() => moveComponent(component.id, 'up')}
                  disabled={index === 0}
                >
                  <Icon icon="mdi:arrow-up" width={16} />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => moveComponent(component.id, 'down')}
                  disabled={index === components.length - 1}
                >
                  <Icon icon="mdi:arrow-down" width={16} />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => removeComponent(component.id)}
                >
                  <Icon icon="mdi:delete" width={16} />
                </IconButton>
              </Box>
            )}
          </Box>
        );

      case 'bulletList':
        const items = component.props?.items || ['Item 1', 'Item 2', 'Item 3'];
        return (
          <Box sx={componentStyle} onClick={handleClick} key={component.id}>
            <ul style={{ paddingLeft: '20px', marginBottom: '16px', ...(component.style || {}) }}>
              {items.map((item, i) => (
                <li key={i} style={{ marginBottom: '4px' }}>
                  <Typography variant="body1" component="span">
                    <SimpleTipTapEditorWithFlags
                      content={item}
                      onChange={(newContent) => {
                        const newItems = [...items];
                        newItems[i] = newContent;
                        updateComponentProps(component.id, { items: newItems });
                      }}
                      onSelectionUpdate={createSelectionHandler(component.id)}
                      style={{ outline: 'none' }}
                      showToolbar={false}
                    />
                  </Typography>
                </li>
              ))}
            </ul>
            {isSelected && (
              <Box
                sx={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  display: 'flex',
                  gap: '4px',
                  background: 'white',
                  border: '1px solid #e0e0e0',
                  borderRadius: '4px',
                  padding: '2px',
                }}
              >
                <IconButton
                  size="small"
                  onClick={() => {
                    const newItems = [...items, 'New item'];
                    updateComponentProps(component.id, { items: newItems });
                  }}
                >
                  <Icon icon="mdi:plus" width={16} />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => moveComponent(component.id, 'up')}
                  disabled={index === 0}
                >
                  <Icon icon="mdi:arrow-up" width={16} />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => moveComponent(component.id, 'down')}
                  disabled={index === components.length - 1}
                >
                  <Icon icon="mdi:arrow-down" width={16} />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => removeComponent(component.id)}
                >
                  <Icon icon="mdi:delete" width={16} />
                </IconButton>
              </Box>
            )}
          </Box>
        );

      case 'image':
        return (
          <Box sx={componentStyle} onClick={handleClick} key={component.id}>
            <Box sx={{ textAlign: 'center', mb: 2, ...(component.style || {}) }}>
              <img
                src={component.props?.src || '/placeholder.svg'}
                alt={component.props?.alt || 'Image'}
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  margin: '0 auto',
                  backgroundColor: component.style?.backgroundColor || 'transparent',
                  objectFit: component.style?.objectFit || 'contain',
                  borderRadius: '8px',
                  display: 'block',
                }}
              />
            </Box>
            {isSelected && (
              <Box
                sx={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  display: 'flex',
                  gap: '4px',
                  background: 'white',
                  border: '1px solid #e0e0e0',
                  borderRadius: '4px',
                  padding: '2px',
                }}
              >
                <IconButton
                  size="small"
                  onClick={() => moveComponent(component.id, 'up')}
                  disabled={index === 0}
                >
                  <Icon icon="mdi:arrow-up" width={16} />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => moveComponent(component.id, 'down')}
                  disabled={index === components.length - 1}
                >
                  <Icon icon="mdi:arrow-down" width={16} />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => removeComponent(component.id)}
                >
                  <Icon icon="mdi:delete" width={16} />
                </IconButton>
              </Box>
            )}
          </Box>
        );

      case 'spacer':
        return (
          <Box sx={componentStyle} onClick={handleClick} key={component.id}>
            <Box sx={{ height: '32px', mb: 2, ...(component.style || {}) }} />
            {isSelected && (
              <Box
                sx={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  display: 'flex',
                  gap: '4px',
                  background: 'white',
                  border: '1px solid #e0e0e0',
                  borderRadius: '4px',
                  padding: '2px',
                }}
              >
                <IconButton
                  size="small"
                  onClick={() => moveComponent(component.id, 'up')}
                  disabled={index === 0}
                >
                  <Icon icon="mdi:arrow-up" width={16} />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => moveComponent(component.id, 'down')}
                  disabled={index === components.length - 1}
                >
                  <Icon icon="mdi:arrow-down" width={16} />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => removeComponent(component.id)}
                >
                  <Icon icon="mdi:delete" width={16} />
                </IconButton>
              </Box>
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  // Handle editor click to deselect components
  const handleEditorClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedComponentId(null);
      setActiveEditor(null);
    }
  };

  // Render the newsletter header
  const renderHeader = () => {
    let backgroundStyle = {};

    if (header.useGradient && header.gradientColors && header.gradientColors.length >= 2) {
      backgroundStyle = {
        background: `linear-gradient(${header.gradientDirection || 180}deg, ${header.gradientColors[0]}, ${header.gradientColors[1]})`,
      };
    } else {
      backgroundStyle = {
        backgroundColor: header.backgroundColor,
      };
    }

    return (
      <Box
        sx={{
          ...backgroundStyle,
          color: header.textColor,
          padding: '20px',
          textAlign: header.alignment as 'left' | 'center' | 'right',
          position: 'relative',
        }}
      >
        {header.logo && (
          <Box sx={{ marginBottom: '10px' }}>
            <img src={header.logo || '/placeholder.svg'} alt="Logo" style={{ maxHeight: '50px' }} />
          </Box>
        )}

        {/* Título del header ahora editable */}
        <Box
          sx={{
            cursor: 'text',
            '& p': {
              margin: 0,
              marginBottom: '16px',
              fontSize: '2.125rem',
              fontWeight: 400,
              lineHeight: 1.235,
              letterSpacing: '0.00735em',
            },
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <SimpleTipTapEditorWithFlags
            content={header.title}
            onChange={(newTitle) => setHeader({ ...header, title: newTitle })}
            onSelectionUpdate={createSelectionHandler('header-title')}
            showToolbar={false}
            placeholder="Newsletter Title"
            style={{
              color: header.textColor,
              fontSize: '2.125rem',
              fontWeight: 400,
              lineHeight: 1.235,
              outline: 'none',
            }}
          />
        </Box>

        {header.subtitle && (
          <Box
            sx={{
              cursor: 'text',
              '& p': {
                margin: 0,
                fontSize: '1rem',
                fontWeight: 400,
                lineHeight: 1.5,
                letterSpacing: '0.00938em',
              },
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <SimpleTipTapEditorWithFlags
              content={header.subtitle}
              onChange={(newSubtitle) => setHeader({ ...header, subtitle: newSubtitle })}
              onSelectionUpdate={createSelectionHandler('header-subtitle')}
              showToolbar={false}
              placeholder="Newsletter Subtitle"
              style={{
                color: header.textColor,
                fontSize: '1rem',
                fontWeight: 400,
                lineHeight: 1.5,
                outline: 'none',
              }}
            />
          </Box>
        )}
        {header.bannerImage && (
          <Box sx={{ marginTop: '10px' }}>
            <img
              src={header.bannerImage || '/placeholder.svg'}
              alt="Banner"
              style={{ width: '100%' }}
            />
          </Box>
        )}
        <IconButton
          sx={{ position: 'absolute', top: '8px', right: '8px', color: 'white' }}
          onClick={() => setOpenHeaderDialog(true)}
        >
          <Icon icon="mdi:pencil" />
        </IconButton>
      </Box>
    );
  };

  // Render the newsletter footer
  const renderFooter = () => (
    <Box
      sx={{
        backgroundColor: footer.backgroundColor,
        color: footer.textColor,
        padding: '20px',
        textAlign: 'center',
        fontSize: '12px',
        position: 'relative',
      }}
    >
      <Typography variant="subtitle1" component="p" fontWeight="bold">
        {footer.companyName}
      </Typography>
      {footer.address && <Typography variant="body2">{footer.address}</Typography>}
      {footer.contactEmail && (
        <Typography variant="body2">
          Contact: <a href={`mailto:${footer.contactEmail}`}>{footer.contactEmail}</a>
        </Typography>
      )}

      <Box sx={{ marginTop: '10px' }}>
        {footer.socialLinks?.map((link, linkIndex) => (
          <React.Fragment key={link.platform}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: footer.textColor }}
            >
              {link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}
            </a>
            {linkIndex < (footer.socialLinks?.length || 0) - 1 && <span> | </span>}
          </React.Fragment>
        ))}
      </Box>

      <Box sx={{ marginTop: '15px' }}>
        <a href={footer.unsubscribeLink || '#'} style={{ color: footer.textColor }}>
          Unsubscribe
        </a>{' '}
        |{' '}
        <a href="#" style={{ color: footer.textColor }}>
          View in browser
        </a>
      </Box>

      <Typography variant="body2" sx={{ marginTop: '10px' }}>
        &copy; {new Date().getFullYear()} {footer.companyName}. All rights reserved.
      </Typography>

      <IconButton
        sx={{ position: 'absolute', top: '8px', right: '8px', color: footer.textColor }}
        onClick={() => setOpenFooterDialog(true)}
      >
        <Icon icon="mdi:pencil" />
      </IconButton>
    </Box>
  );

  // Determine the background style based on the selected options
  const getBackgroundStyle = () => {
    if (selectedBanner) {
      const banner = bannerOptions.find((b) => b.id === selectedBanner);
      if (banner) {
        if (banner.gradient) {
          return {
            background: `linear-gradient(to bottom, ${banner.gradient[0]}, ${banner.gradient[1]})`,
          };
        } else if (banner.pattern) {
          if (banner.pattern === 'dots') {
            return {
              backgroundColor: banner.color,
              backgroundImage: 'radial-gradient(#00000010 1px, transparent 1px)',
              backgroundSize: '10px 10px',
            };
          } else if (banner.pattern === 'lines') {
            return {
              backgroundColor: banner.color,
              backgroundImage: 'linear-gradient(#00000010 1px, transparent 1px)',
              backgroundSize: '100% 10px',
            };
          }
        }
        return { backgroundColor: banner.color };
      }
    } else if (showGradient) {
      return {
        background: `linear-gradient(to bottom, ${gradientColors[0]}, ${gradientColors[1]})`,
      };
    }
    return { backgroundColor: emailBackground };
  };

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        {/* Toolbar */}
        <Box
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            p: 1,
            display: 'flex',
            alignItems: 'center',
          }}
        >
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
          <Button
            variant="outlined"
            startIcon={<Icon icon="mdi:eye" />}
            onClick={() => setEditMode(!editMode)}
            sx={{ mr: 2 }}
          >
            {editMode ? 'Preview' : 'Edit'}
          </Button>
          <Button
            variant="outlined"
            startIcon={<Icon icon="mdi:code-tags" />}
            onClick={generateEmailHtml}
            disabled={generatingEmail}
            sx={{ mr: 2 }}
          >
            {generatingEmail ? <CircularProgress size={24} color="inherit" /> : 'Generate HTML'}
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
        </Box>

        {/* Main content */}
        <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
          {/* Left sidebar */}
          <Paper
            elevation={0}
            sx={{
              width: 280,
              borderRight: 1,
              borderColor: 'divider',
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Tabs */}
            <Box sx={{ display: 'flex', borderBottom: 1, borderColor: 'divider' }}>
              <Button
                variant={activeTab === 'content' ? 'contained' : 'text'}
                onClick={() => setActiveTab('content')}
                sx={{ flex: 1, borderRadius: 0, py: 1 }}
              >
                Content
              </Button>
              <Button
                variant={activeTab === 'design' ? 'contained' : 'text'}
                onClick={() => setActiveTab('design')}
                sx={{ flex: 1, borderRadius: 0, py: 1 }}
              >
                Design
              </Button>
            </Box>

            {/* Tab content */}
            <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
              {activeTab === 'content' && (
                <>
                  <Typography variant="h6" gutterBottom>
                    Add Content
                  </Typography>
                  <Grid container spacing={1} sx={{ mb: 2 }}>
                    <Grid size={{ xs: 6 }}>
                      <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<Icon icon="mdi:format-header-1" />}
                        onClick={() => addComponent('heading')}
                        sx={{ height: '100%' }}
                      >
                        Heading
                      </Button>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<Icon icon="mdi:format-paragraph" />}
                        onClick={() => addComponent('paragraph')}
                        sx={{ height: '100%' }}
                      >
                        Paragraph
                      </Button>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<Icon icon="mdi:format-list-bulleted" />}
                        onClick={() => addComponent('bulletList')}
                        sx={{ height: '100%' }}
                      >
                        List
                      </Button>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<Icon icon="mdi:button-cursor" />}
                        onClick={() => addComponent('button')}
                        sx={{ height: '100%' }}
                      >
                        Button
                      </Button>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<Icon icon="mdi:image" />}
                        onClick={() => addComponent('image')}
                        sx={{ height: '100%' }}
                      >
                        Image
                      </Button>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<Icon icon="mdi:view-gallery" />}
                        onClick={(e) => {
                          setAnchorEl(e.currentTarget);
                        }}
                        sx={{ height: '100%' }}
                      >
                        Gallery
                      </Button>
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={() => setAnchorEl(null)}
                      >
                        <MenuItem
                          onClick={() => {
                            addComponent('gallery', 'single');
                            setAnchorEl(null);
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Icon icon="mdi:image" style={{ marginRight: '8px' }} />
                            Single Image
                          </Box>
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            addComponent('gallery', 'double');
                            setAnchorEl(null);
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Icon icon="mdi:image-multiple" style={{ marginRight: '8px' }} />
                            Two Images
                          </Box>
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            addComponent('gallery', 'grid');
                            setAnchorEl(null);
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Icon icon="mdi:grid" style={{ marginRight: '8px' }} />
                            Image Grid (4)
                          </Box>
                        </MenuItem>
                      </Menu>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<Icon icon="mdi:minus" />}
                        onClick={() => addComponent('divider')}
                        sx={{ height: '100%' }}
                      >
                        Divider
                      </Button>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<Icon icon="mdi:arrow-expand-vertical" />}
                        onClick={() => addComponent('spacer')}
                      >
                        Spacer
                      </Button>
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 2 }} />

                  {/* Opciones de formato de texto */}
                  {selectedComponentId && activeEditor && (
                    <>
                      <Typography variant="h6" gutterBottom>
                        Text Format
                      </Typography>

                      {/* Botones de formato */}
                      <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Button
                          variant={textFormat.includes('bold') ? 'contained' : 'outlined'}
                          size="small"
                          onClick={() => applyTextFormat('bold')}
                          sx={{ minWidth: 'auto', px: 1 }}
                        >
                          <Icon icon="mdi:format-bold" />
                        </Button>
                        <Button
                          variant={textFormat.includes('italic') ? 'contained' : 'outlined'}
                          size="small"
                          onClick={() => applyTextFormat('italic')}
                          sx={{ minWidth: 'auto', px: 1 }}
                        >
                          <Icon icon="mdi:format-italic" />
                        </Button>
                        <Button
                          variant={textFormat.includes('underlined') ? 'contained' : 'outlined'}
                          size="small"
                          onClick={() => applyTextFormat('underlined')}
                          sx={{ minWidth: 'auto', px: 1 }}
                        >
                          <Icon icon="mdi:format-underline" />
                        </Button>
                      </Box>

                      {/* Alineación de texto */}
                      <Typography variant="subtitle2" gutterBottom>
                        Text Alignment
                      </Typography>
                      <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
                        <Button
                          variant={selectedAlignment === 'left' ? 'contained' : 'outlined'}
                          size="small"
                          onClick={() => applyTextAlignment('left')}
                          sx={{ minWidth: 'auto', px: 1 }}
                        >
                          <Icon icon="mdi:format-align-left" />
                        </Button>
                        <Button
                          variant={selectedAlignment === 'center' ? 'contained' : 'outlined'}
                          size="small"
                          onClick={() => applyTextAlignment('center')}
                          sx={{ minWidth: 'auto', px: 1 }}
                        >
                          <Icon icon="mdi:format-align-center" />
                        </Button>
                        <Button
                          variant={selectedAlignment === 'right' ? 'contained' : 'outlined'}
                          size="small"
                          onClick={() => applyTextAlignment('right')}
                          sx={{ minWidth: 'auto', px: 1 }}
                        >
                          <Icon icon="mdi:format-align-right" />
                        </Button>
                        <Button
                          variant={selectedAlignment === 'justify' ? 'contained' : 'outlined'}
                          size="small"
                          onClick={() => applyTextAlignment('justify')}
                          sx={{ minWidth: 'auto', px: 1 }}
                        >
                          <Icon icon="mdi:format-align-justify" />
                        </Button>
                      </Box>

                      {/* Selector de color */}
                      <Typography variant="subtitle2" gutterBottom>
                        Text Color
                      </Typography>
                      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <input
                          type="color"
                          value={selectedColor}
                          onChange={(e) => applyTextColor(e.target.value)}
                          style={{
                            width: 40,
                            height: 40,
                            padding: 0,
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                          }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {selectedColor}
                        </Typography>
                      </Box>

                      <Divider sx={{ my: 2 }} />
                    </>
                  )}

                  <Typography variant="h6" gutterBottom>
                    Header & Footer
                  </Typography>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<Icon icon="mdi:card-heading-outline" />}
                    onClick={() => setOpenHeaderDialog(true)}
                    sx={{ mb: 1 }}
                  >
                    Edit Header
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<Icon icon="mdi:card-text-outline" />}
                    onClick={() => setOpenFooterDialog(true)}
                  >
                    Edit Footer
                  </Button>
                </>
              )}

              {activeTab === 'design' && (
                <>
                  <Typography variant="h6" gutterBottom>
                    🎨 Newsletter Design System
                  </Typography>

                  {/* Quick Templates */}
                  <Typography variant="subtitle2" gutterBottom>
                    📋 Templates Rápidos
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
                    <Button
                      variant="outlined"
                      fullWidth
                      size="small"
                      startIcon={<Icon icon="mdi:newspaper" />}
                      onClick={() => {
                        setHeader({
                          ...header,
                          backgroundColor: '#3f51b5',
                          textColor: '#ffffff',
                        });
                        setEmailBackground('#ffffff');
                        showSnackbar('Modern & Clean template applied', 'success');
                      }}
                    >
                      Modern & Clean
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      size="small"
                      startIcon={<Icon icon="mdi:book-open" />}
                      onClick={() => {
                        setHeader({
                          ...header,
                          backgroundColor: '#8B4513',
                          textColor: '#ffffff',
                        });
                        setEmailBackground('#f8f9fa');
                        showSnackbar('Classic Editorial template applied', 'success');
                      }}
                    >
                      Classic Editorial
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      size="small"
                      startIcon={<Icon icon="mdi:rocket" />}
                      onClick={() => {
                        setHeader({
                          ...header,
                          backgroundColor: '#6366f1',
                          textColor: '#ffffff',
                        });
                        setEmailBackground('#111827');
                        showSnackbar('Tech & Startup template applied', 'success');
                      }}
                    >
                      Tech & Startup
                    </Button>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Color Palettes */}
                  <Typography variant="subtitle2" gutterBottom>
                    🌈 Paletas de Color
                  </Typography>
                  <Box
                    sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, mb: 3 }}
                  >
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{
                        bgcolor: '#3B82F6',
                        color: 'white',
                        '&:hover': { bgcolor: '#2563EB' },
                        minHeight: 40,
                      }}
                      onClick={() => {
                        setHeader({ ...header, backgroundColor: '#3B82F6' });
                        showSnackbar('Blue Professional applied', 'success');
                      }}
                    >
                      Azul
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{
                        bgcolor: '#10B981',
                        color: 'white',
                        '&:hover': { bgcolor: '#059669' },
                        minHeight: 40,
                      }}
                      onClick={() => {
                        setHeader({ ...header, backgroundColor: '#10B981' });
                        showSnackbar('Green Nature applied', 'success');
                      }}
                    >
                      Verde
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{
                        bgcolor: '#F59E0B',
                        color: 'white',
                        '&:hover': { bgcolor: '#D97706' },
                        minHeight: 40,
                      }}
                      onClick={() => {
                        setHeader({ ...header, backgroundColor: '#F59E0B' });
                        showSnackbar('Orange Energetic applied', 'success');
                      }}
                    >
                      Naranja
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{
                        bgcolor: '#EF4444',
                        color: 'white',
                        '&:hover': { bgcolor: '#DC2626' },
                        minHeight: 40,
                      }}
                      onClick={() => {
                        setHeader({ ...header, backgroundColor: '#EF4444' });
                        showSnackbar('Red Bold applied', 'success');
                      }}
                    >
                      Rojo
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{
                        bgcolor: '#8B5CF6',
                        color: 'white',
                        '&:hover': { bgcolor: '#7C3AED' },
                        minHeight: 40,
                      }}
                      onClick={() => {
                        setHeader({ ...header, backgroundColor: '#8B5CF6' });
                        showSnackbar('Purple Creative applied', 'success');
                      }}
                    >
                      Morado
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{
                        bgcolor: '#64748B',
                        color: 'white',
                        '&:hover': { bgcolor: '#475569' },
                        minHeight: 40,
                      }}
                      onClick={() => {
                        setHeader({ ...header, backgroundColor: '#64748B' });
                        showSnackbar('Gray Minimal applied', 'success');
                      }}
                    >
                      Gris
                    </Button>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Original Background Options */}
                  <Typography variant="h6" gutterBottom>
                    Opciones de Fondo
                  </Typography>
                  <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<Icon icon="mdi:chevron-down" />}>
                      <Typography>Banner Style</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <BannerSelector
                        options={bannerOptions}
                        selectedBanner={selectedBanner}
                        onSelect={(bannerId) => {
                          setSelectedBanner(bannerId);
                          setShowGradient(false);
                        }}
                      />
                    </AccordionDetails>
                  </Accordion>

                  <Accordion>
                    <AccordionSummary expandIcon={<Icon icon="mdi:chevron-down" />}>
                      <Typography>Color Sólido</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                        <ColorPicker
                          color={emailBackground}
                          onChange={(color) => {
                            setEmailBackground(color);
                            setSelectedBanner(null);
                            setShowGradient(false);
                          }}
                          label="Background Color"
                        />
                      </Box>
                    </AccordionDetails>
                  </Accordion>

                  <Accordion>
                    <AccordionSummary expandIcon={<Icon icon="mdi:chevron-down" />}>
                      <Typography>Gradiente</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid size={6}>
                          <ColorPicker
                            color={gradientColors[0]}
                            onChange={(color) => {
                              setGradientColors([color, gradientColors[1]]);
                              setSelectedBanner(null);
                            }}
                            label="Start Color"
                          />
                        </Grid>
                        <Grid size={6}>
                          <ColorPicker
                            color={gradientColors[1]}
                            onChange={(color) => {
                              setGradientColors([gradientColors[0], color]);
                              setSelectedBanner(null);
                            }}
                            label="End Color"
                          />
                        </Grid>
                      </Grid>
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => {
                          setShowGradient(!showGradient);
                          setSelectedBanner(null);
                        }}
                      >
                        {showGradient ? 'Disable Gradient' : 'Enable Gradient'}
                      </Button>
                    </AccordionDetails>
                  </Accordion>
                </>
              )}
            </Box>
          </Paper>

          {/* Main editor */}
          <Box
            ref={editorRef}
            sx={{
              flexGrow: 1,
              p: 4,
              bgcolor: 'background.default',
              overflow: 'auto',
            }}
            onClick={handleEditorClick}
          >
            <Paper
              elevation={0}
              sx={{
                maxWidth: 800,
                mx: 'auto',
                bgcolor: 'white',
                overflow: 'hidden',
              }}
            >
              {/* Newsletter header */}
              {renderHeader()}

              {/* Newsletter content */}
              <Box sx={{ p: 4, ...getBackgroundStyle() }}>
                {components.map((component, index) => renderComponent(component, index))}
                {editMode && components.length === 0 && (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body1" color="text.secondary" gutterBottom>
                      Your newsletter is empty. Add some content from the sidebar.
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<Icon icon="mdi:plus" />}
                      onClick={() => addComponent('paragraph')}
                    >
                      Add Content
                    </Button>
                  </Box>
                )}
              </Box>

              {/* Newsletter footer */}
              {renderFooter()}
            </Paper>
          </Box>
        </Box>
      </Box>

      {/* Header Edit Dialog */}
      <Dialog
        open={openHeaderDialog}
        onClose={() => setOpenHeaderDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Newsletter Header</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid component="div" size={{ xs: 12, md: 6 }}>
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
                  <Grid size={{ xs: 4 }}>
                    <Button
                      variant={header.alignment === 'left' ? 'contained' : 'outlined'}
                      fullWidth
                      onClick={() => setHeader({ ...header, alignment: 'left' })}
                    >
                      <Icon icon="mdi:format-align-left" />
                    </Button>
                  </Grid>
                  <Grid size={{ xs: 4 }}>
                    <Button
                      variant={header.alignment === 'center' ? 'contained' : 'outlined'}
                      fullWidth
                      onClick={() => setHeader({ ...header, alignment: 'center' })}
                    >
                      <Icon icon="mdi:format-align-center" />
                    </Button>
                  </Grid>
                  <Grid size={{ xs: 4 }}>
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
            <Grid component="div" size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <ColorPicker
                  color={header.backgroundColor || '#3f51b5'}
                  onChange={(color) => setHeader({ ...header, backgroundColor: color })}
                  label="Background"
                />
                <ColorPicker
                  color={header.textColor || '#ffffff'}
                  onChange={(color) => setHeader({ ...header, textColor: color })}
                  label="Text Color"
                />
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
                    <Grid component="div" container spacing={2} sx={{ mt: 1 }}>
                      <Grid component="div" size={{ xs: 6 }}>
                        <ColorPicker
                          color={(header.gradientColors && header.gradientColors[0]) || '#3f51b5'}
                          onChange={(color) => {
                            const newColors = [
                              ...(header.gradientColors || ['#3f51b5', '#757de8']),
                            ];
                            newColors[0] = color;
                            setHeader({ ...header, gradientColors: newColors });
                          }}
                          label="Start Color"
                        />
                      </Grid>
                      <Grid component="div" size={{ xs: 6 }}>
                        <ColorPicker
                          color={(header.gradientColors && header.gradientColors[1]) || '#757de8'}
                          onChange={(color) => {
                            const newColors = [
                              ...(header.gradientColors || ['#3f51b5', '#757de8']),
                            ];
                            newColors[1] = color;
                            setHeader({ ...header, gradientColors: newColors });
                          }}
                          label="End Color"
                        />
                      </Grid>
                    </Grid>

                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Gradient Direction
                      </Typography>
                      <Slider
                        value={header.gradientDirection || 180}
                        min={0}
                        max={360}
                        step={45}
                        marks={[
                          { value: 0, label: '0°' },
                          { value: 90, label: '90°' },
                          { value: 180, label: '180°' },
                          { value: 270, label: '270°' },
                          { value: 360, label: '360°' },
                        ]}
                        onChange={(_, value) =>
                          setHeader({ ...header, gradientDirection: value as number })
                        }
                      />
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
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenHeaderDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setOpenHeaderDialog(false)}>
            Apply
          </Button>
        </DialogActions>
      </Dialog>

      {/* Footer Edit Dialog */}
      <Dialog
        open={openFooterDialog}
        onClose={() => setOpenFooterDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Newsletter Footer</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12, md: 6 }}>
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
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <ColorPicker
                  color={footer.backgroundColor || '#f5f5f5'}
                  onChange={(color) => setFooter({ ...footer, backgroundColor: color })}
                  label="Background"
                />
                <ColorPicker
                  color={footer.textColor || '#666666'}
                  onChange={(color) => setFooter({ ...footer, textColor: color })}
                  label="Text Color"
                />
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
        </DialogContent>
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
          <TextField fullWidth label="Logo URL" value={logoUrl} margin="normal" />
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
          <TextField fullWidth label="Banner Image URL" value={bannerImageUrl} margin="normal" />
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

      {/* Gallery Editor Dialog */}
      <GalleryEditorDialog
        open={Boolean(openGalleryDialog)}
        onClose={() => {
          setOpenGalleryDialog(false);
          setEditingGalleryId(null);
        }}
        initialImages={
          editingGalleryId
            ? components.find((c) => c.id === editingGalleryId)?.props?.images || []
            : []
        }
        initialLayout={
          editingGalleryId
            ? components.find((c) => c.id === editingGalleryId)?.props?.layout || 'single'
            : 'single'
        }
        onSave={handleGallerySave}
      />

      {/* HTML Preview Dialog */}
      <Dialog
        open={openPreviewDialog}
        onClose={() => setOpenPreviewDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Email HTML Preview
          <IconButton
            aria-label="close"
            onClick={() => setOpenPreviewDialog(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Icon icon="mdi:close" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ overflow: 'auto', maxHeight: '70vh' }}>
            <Typography
              variant="body2"
              component="div"
              dangerouslySetInnerHTML={{ __html: emailHtml }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPreviewDialog(false)}>Close</Button>
          <Button variant="contained" onClick={copyHtmlToClipboard}>
            Copy HTML
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <CustomSnackbar
        open={openSnackbar}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={() => setOpenSnackbar(false)}
      />
    </>
  );
}

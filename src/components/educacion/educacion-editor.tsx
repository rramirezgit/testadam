/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

import type { Editor } from '@tiptap/react';
import type { Educacion } from 'src/types/educacion';
import type { SavedEducacion } from 'src/types/saved-educacion';
import type { EducacionComponent } from 'src/types/educacion-component';

import { v4 as uuidv4 } from 'uuid';
import { Icon } from '@iconify/react';
import React, { useRef, useState, useEffect } from 'react';

import {
  Box,
  Grid,
  Paper,
  Button,
  Tooltip,
  MenuItem,
  TextField,
  Typography,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';

import { useStore } from 'src/lib/store';

// Componentes necesarios para el editor
import ExtendedTipTapEditorWithFlags from './extended-tiptap-editor-with-flags';

// Definir interfaces para el editor de educación
interface EducacionHeader {
  title: string;
  subtitle?: string;
  logo?: string;
  bannerImage?: string;
  backgroundColor: string;
  textColor: string;
  alignment: 'left' | 'center' | 'right';
  useGradient?: boolean;
  gradientColors?: string[];
  gradientDirection?: number;
}

interface EducacionFooter {
  companyName: string;
  address?: string;
  contactEmail?: string;
  socialLinks?: { platform: string; url: string }[];
  unsubscribeLink?: string;
  backgroundColor: string;
  textColor: string;
}

interface EducacionContentEditorProps {
  onClose: () => void;
  initialEducacion?: SavedEducacion | null;
  onSave?: (educacion: SavedEducacion) => void;
}

// Componente personalizado de Snackbar
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

export default function EducacionEditor({
  onClose,
  initialEducacion,
  onSave,
}: EducacionContentEditorProps) {
  // Usar el store para guardar el contenido
  const { addEducacion, updateEducacion } = useStore();

  // Información básica del contenido educativo
  const [educacionId, setEducacionId] = useState<string>(initialEducacion?.id || uuidv4());
  const [title, setTitle] = useState<string>(initialEducacion?.title || '');
  const [description, setDescription] = useState<string>(initialEducacion?.description || '');

  // Estado del editor
  const [activeTab, setActiveTab] = useState<string>('content');
  const [editMode, setEditMode] = useState<boolean>(true);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [activeEditor, setActiveEditor] = useState<Editor | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  // Componentes de contenido
  const [components, setComponents] = useState<EducacionComponent[]>([]);

  // Encabezado y pie de página
  const [header, setHeader] = useState<EducacionHeader>({
    title: initialEducacion?.title || 'Título del Contenido Educativo',
    subtitle: 'Subtítulo del contenido',
    alignment: 'center',
    backgroundColor: '#3f51b5',
    textColor: '#ffffff',
  });

  const [footer, setFooter] = useState<EducacionFooter>({
    companyName: 'Nombre de la Compañía',
    contactEmail: 'contacto@example.com',
    backgroundColor: '#f5f5f5',
    textColor: '#757575',
  });

  // Diseño del contenido
  const [emailBackground, setEmailBackground] = useState<string>('#ffffff');
  const [selectedBanner, setSelectedBanner] = useState<string | null>(null);

  // Estados de UI
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    'success' | 'error' | 'info' | 'warning'
  >('success');

  // Estados para el panel de edición lateral
  const [color, setColor] = useState<string>('#000000');
  const [linkUrl, setLinkUrl] = useState<string>('https://');

  // Estado del generador de HTML
  const [openHtmlPreview, setOpenHtmlPreview] = useState<boolean>(false);
  const [generatedHtml, setGeneratedHtml] = useState<string>('');
  const [isGeneratingHtml, setIsGeneratingHtml] = useState<boolean>(false);

  // Estados para diálogos
  const [openHeaderDialog, setOpenHeaderDialog] = useState<boolean>(false);
  const [openFooterDialog, setOpenFooterDialog] = useState<boolean>(false);
  const [openBackgroundDialog, setOpenBackgroundDialog] = useState<boolean>(false);
  const [openGalleryDialog, setOpenGalleryDialog] = useState<boolean>(false);
  const [editingGalleryId, setEditingGalleryId] = useState<string | null>(null);

  // Opciones adicionales para el contenido web
  const [seoTitle, setSeoTitle] = useState<string>(initialEducacion?.educacion?.seoTitle || '');
  const [seoDescription, setSeoDescription] = useState<string>(
    initialEducacion?.educacion?.seoDescription || ''
  );
  const [isResponsive, setIsResponsive] = useState<boolean>(
    initialEducacion?.educacion?.isResponsive !== false
  );
  const [pageLayout, setPageLayout] = useState<'fixed' | 'fluid'>(
    initialEducacion?.educacion?.pageLayout || 'fluid'
  );

  // Menús de componentes
  const [addComponentMenuAnchor, setAddComponentMenuAnchor] = useState<null | HTMLElement>(null);

  // Cargar datos iniciales si se proporciona un contenido existente
  useEffect(() => {
    if (initialEducacion && initialEducacion.educacion) {
      setTitle(initialEducacion.title || '');
      setDescription(initialEducacion.description || '');
      setComponents(initialEducacion.educacion.content || []);

      // Si el contenido educativo tiene configuración de encabezado/pie de página, cargarla
      if (initialEducacion.educacion.header) {
        setHeader(initialEducacion.educacion.header);
      }

      if (initialEducacion.educacion.footer) {
        setFooter(initialEducacion.educacion.footer);
      }

      if (initialEducacion.educacion.design) {
        setEmailBackground(initialEducacion.educacion.design.backgroundColor || '#ffffff');
        setSelectedBanner(initialEducacion.educacion.design.selectedBanner || null);
      }

      // Cargar opciones específicas de web
      if (initialEducacion.educacion.seoTitle) {
        setSeoTitle(initialEducacion.educacion.seoTitle);
      }

      if (initialEducacion.educacion.seoDescription) {
        setSeoDescription(initialEducacion.educacion.seoDescription);
      }

      setIsResponsive(initialEducacion.educacion.isResponsive !== false);
      setPageLayout(initialEducacion.educacion.pageLayout || 'fluid');
    }
  }, [initialEducacion]);

  // Función para actualizar el contenido de un componente
  const updateComponentContent = (id: string, content: string) => {
    setComponents((prevComponents) =>
      prevComponents.map((component) =>
        component.id === id ? { ...component, content } : component
      )
    );
  };

  // Función para actualizar las propiedades de un componente
  const updateComponentProps = (id: string, props: Record<string, any>) => {
    setComponents((prevComponents) =>
      prevComponents.map((component) =>
        component.id === id ? { ...component, props: { ...component.props, ...props } } : component
      )
    );
  };

  // Función para actualizar el estilo de un componente
  const updateComponentStyle = (id: string, style: React.CSSProperties) => {
    setComponents((prevComponents) =>
      prevComponents.map((component) =>
        component.id === id ? { ...component, style: { ...component.style, ...style } } : component
      )
    );
  };

  // Función para añadir un nuevo componente
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
      | 'gallery'
      | 'video'
      | 'audio'
      | 'quiz'
      | 'codeSnippet'
      | 'table'
      | 'timeline'
      | 'accordion'
      | 'infoCard'
      | 'highlightBox'
      | 'iconList'
      | 'stepProcess'
      | 'exampleBox',
    galleryLayout?: 'single' | 'double' | 'grid'
  ) => {
    const newComponent: EducacionComponent = {
      id: uuidv4(),
      type,
      content: '',
    };

    // Configurar propiedades predeterminadas según el tipo de componente
    switch (type) {
      case 'heading':
        newComponent.content = 'Título de ejemplo';
        newComponent.props = { level: 2 };
        break;
      case 'paragraph':
        newComponent.content = 'Escribe tu contenido aquí...';
        break;
      case 'bulletList':
        newComponent.props = { items: ['Elemento 1', 'Elemento 2', 'Elemento 3'] };
        break;
      case 'button':
        newComponent.content = 'Botón de Acción';
        newComponent.props = {
          url: '#',
          align: 'center',
          buttonColor: '#3f51b5',
          textColor: '#ffffff',
        };
        break;
      case 'image':
        newComponent.props = { src: '/placeholder.svg', alt: 'Imagen', align: 'center' };
        break;
      case 'gallery':
        newComponent.props = { layout: galleryLayout || 'single', images: [] };
        break;
      case 'video':
        newComponent.props = { src: '', videoTitle: 'Video educativo', autoplay: false };
        break;
      case 'audio':
        newComponent.props = { src: '', audioTitle: 'Audio educativo', controls: true };
        break;
      case 'quiz':
        newComponent.props = {
          question: '¿Pregunta de ejemplo?',
          options: ['Opción 1', 'Opción 2', 'Opción 3'],
          correctAnswer: 0,
        };
        break;
      case 'codeSnippet':
        newComponent.content = '// Código de ejemplo\nconsole.log("Hola mundo");';
        newComponent.props = { language: 'javascript', theme: 'light' };
        break;
      case 'table':
        newComponent.props = {
          headers: ['Columna 1', 'Columna 2', 'Columna 3'],
          rows: [
            ['Dato 1', 'Dato 2', 'Dato 3'],
            ['Dato 4', 'Dato 5', 'Dato 6'],
          ],
        };
        break;
      case 'timeline':
        newComponent.props = {
          events: [
            { title: 'Evento 1', date: '2023', description: 'Descripción del evento 1' },
            { title: 'Evento 2', date: '2024', description: 'Descripción del evento 2' },
          ],
        };
        break;
      case 'accordion':
        newComponent.props = {
          items: [
            { title: 'Tema 1', content: 'Contenido del tema 1' },
            { title: 'Tema 2', content: 'Contenido del tema 2' },
          ],
        };
        break;
      case 'infoCard':
        newComponent.content = 'Información destacada';
        newComponent.props = {
          icon: 'mdi:information',
          bgColor: '#e0f7fa',
          textColor: '#006064',
          borderColor: '#00bcd4',
        };
        break;
      case 'highlightBox':
        newComponent.content = 'Contenido destacado que requiere atención especial';
        newComponent.props = {
          bgColor: '#fff3e0',
          borderColor: '#ff9800',
          borderStyle: 'solid',
        };
        break;
      case 'iconList':
        newComponent.props = {
          items: [
            { icon: 'mdi:check-circle', text: 'Punto importante 1' },
            { icon: 'mdi:check-circle', text: 'Punto importante 2' },
            { icon: 'mdi:check-circle', text: 'Punto importante 3' },
          ],
          iconColor: '#4caf50',
        };
        break;
      case 'stepProcess':
        newComponent.props = {
          steps: [
            {
              number: 1,
              title: 'Identificación de riesgos',
              description: 'Detectar posibles riesgos en el proyecto',
            },
            { number: 2, title: 'Clasificación', description: 'Evaluar el impacto y probabilidad' },
            {
              number: 3,
              title: 'Mitigación',
              description: 'Implementar estrategias para reducir riesgos',
            },
            { number: 4, title: 'Monitoreo', description: 'Seguimiento continuo de los riesgos' },
          ],
          orientation: 'vertical',
        };
        break;
      case 'exampleBox':
        newComponent.content = 'Este es un ejemplo práctico';
        newComponent.props = {
          boxTitle: 'Ejemplo práctico',
          bgColor: '#f3e5f5',
          icon: 'mdi:lightbulb-on',
          iconColor: '#9c27b0',
        };
        break;
      default:
        // Configuración predeterminada si el tipo no coincide con ninguno de los casos anteriores
        newComponent.content = 'Contenido por defecto';
        break;
    }

    setComponents((prev) => [...prev, newComponent]);
  };

  // Función para eliminar un componente
  const removeComponent = (id: string) => {
    setComponents((prevComponents) => prevComponents.filter((component) => component.id !== id));
  };

  // Función para mover un componente hacia arriba o hacia abajo
  const moveComponent = (id: string, direction: 'up' | 'down') => {
    setComponents((prevComponents) => {
      const index = prevComponents.findIndex((component) => component.id === id);
      if (index === -1) return prevComponents;

      const newComponents = [...prevComponents];
      const component = newComponents[index];

      if (direction === 'up' && index > 0) {
        newComponents.splice(index, 1);
        newComponents.splice(index - 1, 0, component);
      } else if (direction === 'down' && index < newComponents.length - 1) {
        newComponents.splice(index, 1);
        newComponents.splice(index + 1, 0, component);
      }

      return newComponents;
    });
  };

  // Actualizar el editor activo cuando cambia la selección
  const handleSelectionUpdate = (editor: Editor) => {
    setActiveEditor(editor);
  };

  // Función para guardar el contenido educativo
  const handleSaveEducacion = () => {
    if (!title) {
      showSnackbar('Por favor, añade un título a tu contenido educativo', 'error');
      return;
    }

    const educacion: Educacion = {
      id: educacionId,
      title,
      description,
      dateCreated: initialEducacion?.dateCreated || new Date().toISOString(),
      dateModified: new Date().toISOString(),
      content: components,
      header,
      footer,
      design: {
        backgroundColor: emailBackground,
        selectedBanner: selectedBanner || undefined,
      },
      // Propiedades específicas web
      seoTitle: seoTitle || title,
      seoDescription: seoDescription || description,
      isResponsive,
      pageLayout,
    };

    const savedEducacion: SavedEducacion = {
      id: educacionId,
      title,
      description,
      status: initialEducacion?.status || 'DRAFT',
      dateCreated: initialEducacion?.dateCreated || new Date().toISOString(),
      dateModified: new Date().toISOString(),
      educacion,
    };

    // Si hay función onSave, llamarla
    if (onSave) {
      onSave(savedEducacion);
    } else {
      // Guardar usando la store
      if (initialEducacion) {
        updateEducacion(savedEducacion);
      } else {
        addEducacion(savedEducacion);
      }
    }

    showSnackbar('Contenido educativo guardado exitosamente', 'success');

    // Cerrar el editor después de guardar
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  // Mostrar mensajes de snackbar
  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Función para manejar el guardado de galerías
  const handleGallerySave = (images: any[], layout: string) => {
    if (editingGalleryId) {
      updateComponentProps(editingGalleryId, { images, layout });
    } else {
      const newComponent: EducacionComponent = {
        id: uuidv4(),
        type: 'gallery',
        content: '',
        props: { images, layout },
      };
      setComponents((prev) => [...prev, newComponent]);
    }
    setOpenGalleryDialog(false);
    setEditingGalleryId(null);
  };

  // Renderizar un componente según su tipo
  const renderComponent = (component: EducacionComponent, index: number) => {
    // Estilo base para los componentes
    const componentStyle = {
      position: 'relative',
      mb: 2,
      p: 2,
      border: selectedComponentId === component.id ? '2px solid #4DBCFB' : '2px solid transparent',
      borderRadius: '4px',
      transition: 'border-color 0.2s ease',
      '&:hover': {
        outline: selectedComponentId !== component.id ? '1px dashed #ccc' : 'none',
      },
    };

    // Manejar el clic en un componente para seleccionarlo
    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      setSelectedComponentId(component.id);
    };

    // Manejar cambios en el contenido del componente
    const handleContentChange = (newContent: string) => {
      updateComponentContent(component.id, newContent);
    };

    // Botones de control comunes para todos los componentes
    const ControlButtons = () => (
      <Box sx={{ position: 'absolute', top: -40, right: 0, zIndex: 1 }}>
        <IconButton
          size="small"
          onClick={() => moveComponent(component.id, 'up')}
          disabled={index === 0}
        >
          <Icon icon="mdi:arrow-up" />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => moveComponent(component.id, 'down')}
          disabled={index === components.length - 1}
        >
          <Icon icon="mdi:arrow-down" />
        </IconButton>
        <IconButton size="small" onClick={() => removeComponent(component.id)}>
          <Icon icon="mdi:delete" />
        </IconButton>
      </Box>
    );

    // Renderizar diferentes tipos de componentes
    switch (component.type) {
      case 'heading':
        return (
          <Box sx={componentStyle} onClick={handleClick} key={component.id}>
            {selectedComponentId === component.id && <ControlButtons />}
            <ExtendedTipTapEditorWithFlags
              content={component.content}
              onChange={handleContentChange}
              onSelectionUpdate={handleSelectionUpdate}
              isHeading
              headingLevel={component.props?.level || 2}
            />
          </Box>
        );

      case 'paragraph':
        return (
          <Box sx={componentStyle} onClick={handleClick} key={component.id}>
            {selectedComponentId === component.id && <ControlButtons />}
            <ExtendedTipTapEditorWithFlags
              content={component.content}
              onChange={handleContentChange}
              onSelectionUpdate={handleSelectionUpdate}
            />
          </Box>
        );

      case 'bulletList': {
        const items = component.props?.items || ['Elemento 1', 'Elemento 2', 'Elemento 3'];
        return (
          <Box sx={componentStyle} onClick={handleClick} key={component.id}>
            {selectedComponentId === component.id && <ControlButtons />}
            <Box sx={{ pl: 2 }}>
              <ul>
                {items.map((item: string, idx: number) => (
                  <li key={idx}>
                    <TextField
                      fullWidth
                      variant="standard"
                      value={item}
                      onChange={(e) => {
                        const newItems = [...items];
                        newItems[idx] = e.target.value;
                        updateComponentProps(component.id, { items: newItems });
                      }}
                      InputProps={{
                        endAdornment: (
                          <IconButton
                            size="small"
                            onClick={() => {
                              const newItems = items.filter((_: string, i: number) => i !== idx);
                              updateComponentProps(component.id, { items: newItems });
                            }}
                          >
                            <Icon icon="mdi:delete" fontSize="small" />
                          </IconButton>
                        ),
                      }}
                    />
                  </li>
                ))}
              </ul>
              <Button
                startIcon={<Icon icon="mdi:plus" />}
                onClick={() => {
                  const newItems = [...items, 'Nuevo elemento'];
                  updateComponentProps(component.id, { items: newItems });
                }}
                size="small"
                sx={{ mt: 1 }}
              >
                Añadir ítem
              </Button>
            </Box>
          </Box>
        );
      }

      case 'button': {
        const {
          url = '#',
          align = 'center',
          buttonColor = '#3f51b5',
          textColor = '#ffffff',
        } = component.props || {};
        return (
          <Box sx={componentStyle} onClick={handleClick} key={component.id}>
            {selectedComponentId === component.id && <ControlButtons />}
            <Box
              sx={{
                display: 'flex',
                justifyContent:
                  align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start',
                mb: 2,
              }}
            >
              <Button
                variant="contained"
                sx={{
                  backgroundColor: buttonColor,
                  color: textColor,
                  '&:hover': {
                    backgroundColor: buttonColor,
                    opacity: 0.9,
                  },
                }}
              >
                {component.content || 'Botón de Acción'}
              </Button>
            </Box>
          </Box>
        );
      }

      case 'divider':
        return (
          <Box sx={componentStyle} onClick={handleClick} key={component.id}>
            {selectedComponentId === component.id && <ControlButtons />}
            <Box sx={{ py: 1 }}>
              <hr
                style={{
                  border: 'none',
                  height: '1px',
                  backgroundColor: '#e0e0e0',
                  margin: 0,
                }}
              />
            </Box>
          </Box>
        );

      case 'spacer': {
        const height = component.props?.height || 50;
        return (
          <Box sx={componentStyle} onClick={handleClick} key={component.id}>
            {selectedComponentId === component.id && <ControlButtons />}
            <Box sx={{ height: `${height}px` }} />
          </Box>
        );
      }

      case 'image': {
        console.log(component.props);
        const {
          src = '/placeholder.svg',
          alt = 'Imagen',
          align = 'center',
          width = '100%',
        } = component.props || {};
        return (
          <Box sx={componentStyle} onClick={handleClick} key={component.id}>
            {selectedComponentId === component.id && <ControlButtons />}
            <Box
              sx={{
                display: 'flex',
                backgroundColor: 'red',
                justifyContent:
                  align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start',
              }}
            >
              <Box
                component="img"
                src={src}
                alt={alt}
                sx={{
                  maxWidth: width,
                  height: 'auto',
                }}
              />
            </Box>
          </Box>
        );
      }

      case 'gallery': {
        const { images = [], layout = 'single' } = component.props || {};
        return (
          <Box sx={componentStyle} onClick={handleClick} key={component.id}>
            {selectedComponentId === component.id && <ControlButtons />}
            <Box sx={{ textAlign: 'center', p: 2 }}>
              {images.length > 0 ? (
                <Grid container spacing={2}>
                  {images.map((img: { src?: string; alt?: string }, idx: number) => (
                    <Grid key={idx}>
                      <Box
                        component="img"
                        src={img.src || '/placeholder.svg'}
                        alt={img.alt || `Imagen ${idx + 1}`}
                        sx={{ width: '100%', height: 'auto', borderRadius: '4px' }}
                      />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box
                  sx={{
                    border: '2px dashed #ccc',
                    borderRadius: '4px',
                    p: 4,
                    textAlign: 'center',
                  }}
                >
                  <Icon icon="mdi:image" style={{ fontSize: '48px', color: '#ccc' }} />
                  <Typography color="text.secondary">
                    Haz clic para añadir imágenes a la galería
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        );
      }

      case 'video': {
        const {
          src = '',
          videoTitle = 'Video educativo',
          autoplay = false,
        } = component.props || {};
        return (
          <Box sx={componentStyle} onClick={handleClick} key={component.id}>
            {selectedComponentId === component.id && <ControlButtons />}
            {src ? (
              <Box
                sx={{
                  position: 'relative',
                  paddingBottom: '56.25%',
                  height: 0,
                  overflow: 'hidden',
                }}
              >
                <iframe
                  src={src}
                  title={videoTitle}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none',
                  }}
                  allow={autoplay ? 'autoplay; encrypted-media' : 'encrypted-media'}
                  allowFullScreen
                />
              </Box>
            ) : (
              <Box
                sx={{
                  border: '2px dashed #ccc',
                  borderRadius: '4px',
                  p: 4,
                  textAlign: 'center',
                }}
              >
                <Icon icon="mdi:video" style={{ fontSize: '48px', color: '#ccc' }} />
                <Typography color="text.secondary">Añade la URL de un video</Typography>
              </Box>
            )}
          </Box>
        );
      }

      case 'audio': {
        const { src = '', audioTitle = 'Audio educativo', controls = true } = component.props || {};
        return (
          <Box sx={componentStyle} onClick={handleClick} key={component.id}>
            {selectedComponentId === component.id && <ControlButtons />}
            {src ? (
              <Box sx={{ width: '100%' }}>
                <audio controls={controls} style={{ width: '100%' }}>
                  <source src={src} type="audio/mp3" />
                  Tu navegador no soporta el elemento de audio.
                </audio>
                <Typography variant="caption" color="text.secondary">
                  {audioTitle}
                </Typography>
              </Box>
            ) : (
              <Box
                sx={{
                  border: '2px dashed #ccc',
                  borderRadius: '4px',
                  p: 4,
                  textAlign: 'center',
                }}
              >
                <Icon icon="mdi:music" style={{ fontSize: '48px', color: '#ccc' }} />
                <Typography color="text.secondary">Añade la URL de un archivo de audio</Typography>
              </Box>
            )}
          </Box>
        );
      }

      case 'quiz': {
        const {
          question = '¿Pregunta de ejemplo?',
          options = ['Opción 1', 'Opción 2', 'Opción 3'],
          correctAnswer = 0,
        } = component.props || {};
        return (
          <Box sx={componentStyle} onClick={handleClick} key={component.id}>
            {selectedComponentId === component.id && <ControlButtons />}
            <Box sx={{ p: 2, bgcolor: '#f9f9f9', borderRadius: '4px' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {question}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {options.map((option: any, idx: number) => (
                  <Box
                    key={idx}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      p: 1,
                      borderRadius: '4px',
                      bgcolor: correctAnswer === idx ? 'success.lighter' : 'background.paper',
                      border: '1px solid',
                      borderColor: correctAnswer === idx ? 'success.main' : 'divider',
                    }}
                  >
                    <Typography sx={{ ml: 1 }}>{option}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        );
      }

      case 'codeSnippet': {
        const { language = 'javascript', theme = 'light' } = component.props || {};
        return (
          <Box sx={componentStyle} onClick={handleClick} key={component.id}>
            {selectedComponentId === component.id && <ControlButtons />}
            <Box
              sx={{
                bgcolor: theme === 'dark' ? '#1e1e1e' : '#f5f5f5',
                color: theme === 'dark' ? '#fff' : '#000',
                p: 2,
                borderRadius: '4px',
                fontFamily: 'monospace',
                overflowX: 'auto',
              }}
            >
              <Typography variant="caption" color={theme === 'dark' ? 'grey.400' : 'grey.700'}>
                {language}
              </Typography>
              <pre style={{ margin: 0 }}>
                <code>
                  {component.content || '// Código de ejemplo\nconsole.log("Hola mundo");'}
                </code>
              </pre>
            </Box>
          </Box>
        );
      }

      case 'table': {
        const {
          headers = ['Columna 1', 'Columna 2', 'Columna 3'],
          rows = [
            ['Dato 1', 'Dato 2', 'Dato 3'],
            ['Dato 4', 'Dato 5', 'Dato 6'],
          ],
        } = component.props || {};
        return (
          <Box sx={componentStyle} onClick={handleClick} key={component.id}>
            {selectedComponentId === component.id && <ControlButtons />}
            <Box sx={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {headers.map((headerItem: any, idx: number) => (
                      <th
                        key={idx}
                        style={{
                          border: '1px solid #ddd',
                          padding: '8px',
                          textAlign: 'left',
                          backgroundColor: '#f5f5f5',
                        }}
                      >
                        {headerItem}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row: any[], rowIdx: number) => (
                    <tr key={rowIdx}>
                      {row.map((cell: any, cellIdx: number) => (
                        <td
                          key={cellIdx}
                          style={{
                            border: '1px solid #ddd',
                            padding: '8px',
                            textAlign: 'left',
                          }}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          </Box>
        );
      }

      case 'timeline': {
        const {
          events = [
            { title: 'Evento 1', date: '2023', description: 'Descripción del evento 1' },
            { title: 'Evento 2', date: '2024', description: 'Descripción del evento 2' },
          ],
        } = component.props || {};
        return (
          <Box sx={componentStyle} onClick={handleClick} key={component.id}>
            {selectedComponentId === component.id && <ControlButtons />}
            <Box sx={{ position: 'relative', py: 2 }}>
              {/* Línea vertical */}
              <Box
                sx={{
                  position: 'absolute',
                  left: '20px',
                  top: 0,
                  bottom: 0,
                  width: '2px',
                  bgcolor: 'primary.light',
                  zIndex: 0,
                }}
              />

              {/* Eventos */}
              {events.map((event: any, idx: number) => (
                <Box
                  key={idx}
                  sx={{
                    display: 'flex',
                    mb: 3,
                    position: 'relative',
                  }}
                >
                  {/* Marcador */}
                  <Box
                    sx={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      border: '2px solid white',
                      position: 'absolute',
                      left: '15px',
                      top: '5px',
                      zIndex: 1,
                    }}
                  />

                  {/* Contenido del evento */}
                  <Box sx={{ ml: 5, flex: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {event.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {event.date}
                    </Typography>
                    <Typography variant="body2">{event.description}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        );
      }

      case 'accordion': {
        const {
          items = [
            { title: 'Tema 1', content: 'Contenido del tema 1' },
            { title: 'Tema 2', content: 'Contenido del tema 2' },
          ],
        } = component.props || {};

        return (
          <Box sx={componentStyle} onClick={handleClick} key={component.id}>
            {selectedComponentId === component.id && <ControlButtons />}
            <Box>
              {items.map((item: { title: string; content: string }, idx: number) => (
                <Box
                  key={idx}
                  sx={{
                    mb: 1,
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: '#f5f5f5',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <Typography variant="subtitle1">{item.title}</Typography>
                    <Icon icon="mdi:chevron-down" />
                  </Box>
                  <Box sx={{ p: 2 }}>
                    <Typography variant="body2">{item.content}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        );
      }

      case 'infoCard': {
        const {
          icon = 'mdi:information',
          bgColor = '#e0f7fa',
          textColor = '#006064',
          borderColor = '#00bcd4',
        } = component.props || {};

        return (
          <Box sx={componentStyle} onClick={handleClick} key={component.id}>
            {selectedComponentId === component.id && <ControlButtons />}
            <Box
              sx={{
                p: 2,
                bgcolor: bgColor,
                borderRadius: '4px',
                border: `1px solid ${borderColor}`,
                color: textColor,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 2,
              }}
            >
              <Icon icon={icon} style={{ fontSize: '24px' }} />
              <Box>
                <ExtendedTipTapEditorWithFlags
                  content={component.content}
                  onChange={handleContentChange}
                  onSelectionUpdate={handleSelectionUpdate}
                  style={{ color: textColor }}
                />
              </Box>
            </Box>
          </Box>
        );
      }

      case 'highlightBox': {
        const {
          bgColor = '#fff3e0',
          borderColor = '#ff9800',
          borderStyle = 'solid',
        } = component.props || {};

        return (
          <Box sx={componentStyle} onClick={handleClick} key={component.id}>
            {selectedComponentId === component.id && <ControlButtons />}
            <Box
              sx={{
                p: 3,
                bgcolor: bgColor,
                borderRadius: '4px',
                borderLeft: `4px ${borderStyle} ${borderColor}`,
              }}
            >
              <ExtendedTipTapEditorWithFlags
                content={component.content}
                onChange={handleContentChange}
                onSelectionUpdate={handleSelectionUpdate}
              />
            </Box>
          </Box>
        );
      }

      case 'iconList': {
        const {
          items = [
            { icon: 'mdi:check-circle', text: 'Punto importante 1' },
            { icon: 'mdi:check-circle', text: 'Punto importante 2' },
            { icon: 'mdi:check-circle', text: 'Punto importante 3' },
          ],
          iconColor = '#4caf50',
        } = component.props || {};

        return (
          <Box sx={componentStyle} onClick={handleClick} key={component.id}>
            {selectedComponentId === component.id && <ControlButtons />}
            <Box>
              {items.map((item: { icon: string; text: string }, idx: number) => (
                <Box
                  key={idx}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    mb: 2,
                    gap: 1.5,
                  }}
                >
                  <Icon icon={item.icon} style={{ color: iconColor, fontSize: '24px' }} />
                  <Typography>{item.text}</Typography>
                </Box>
              ))}
              {selectedComponentId === component.id && (
                <Button
                  startIcon={<Icon icon="mdi:plus" />}
                  onClick={() => {
                    const newItems = [...items, { icon: 'mdi:check-circle', text: 'Nuevo punto' }];
                    updateComponentProps(component.id, { items: newItems });
                  }}
                  size="small"
                  sx={{ mt: 1 }}
                >
                  Añadir elemento
                </Button>
              )}
            </Box>
          </Box>
        );
      }

      case 'stepProcess': {
        const {
          steps = [
            {
              number: 1,
              title: 'Identificación de riesgos',
              description: 'Detectar posibles riesgos en el proyecto',
            },
            { number: 2, title: 'Clasificación', description: 'Evaluar el impacto y probabilidad' },
            {
              number: 3,
              title: 'Mitigación',
              description: 'Implementar estrategias para reducir riesgos',
            },
            { number: 4, title: 'Monitoreo', description: 'Seguimiento continuo de los riesgos' },
          ],
          orientation = 'vertical',
        } = component.props || {};

        return (
          <Box sx={componentStyle} onClick={handleClick} key={component.id}>
            {selectedComponentId === component.id && <ControlButtons />}
            <Box sx={{ position: 'relative', py: 2 }}>
              {orientation === 'vertical' && (
                <Box
                  sx={{
                    position: 'absolute',
                    left: '20px',
                    top: 0,
                    bottom: 0,
                    width: '2px',
                    bgcolor: 'primary.light',
                    zIndex: 0,
                  }}
                />
              )}

              {steps.map(
                (step: { number: number; title: string; description: string }, idx: number) => (
                  <Box
                    key={idx}
                    sx={{
                      display: 'flex',
                      mb: 3,
                      position: 'relative',
                    }}
                  >
                    <Box
                      sx={{
                        minWidth: '35px',
                        height: '35px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                        color: 'white',
                        fontWeight: 'bold',
                        zIndex: 1,
                      }}
                    >
                      {step.number}
                    </Box>

                    <Box sx={{ ml: 2, flex: 1 }}>
                      <Typography variant="h6" fontWeight="bold">
                        {step.title}
                      </Typography>
                      <Typography variant="body2">{step.description}</Typography>
                    </Box>
                  </Box>
                )
              )}
            </Box>
          </Box>
        );
      }

      case 'exampleBox': {
        const {
          boxTitle = 'Ejemplo práctico',
          bgColor = '#f3e5f5',
          icon = 'mdi:lightbulb-on',
          iconColor = '#9c27b0',
        } = component.props || {};

        return (
          <Box sx={componentStyle} onClick={handleClick} key={component.id}>
            {selectedComponentId === component.id && <ControlButtons />}
            <Box
              sx={{
                p: 2,
                bgcolor: bgColor,
                borderRadius: '4px',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                <Icon icon={icon} style={{ color: iconColor, fontSize: '24px' }} />
                <Typography variant="subtitle1" fontWeight="bold">
                  {boxTitle}
                </Typography>
              </Box>
              <ExtendedTipTapEditorWithFlags
                content={component.content}
                onChange={handleContentChange}
                onSelectionUpdate={handleSelectionUpdate}
              />
            </Box>
          </Box>
        );
      }

      default:
        return (
          <Box sx={componentStyle} onClick={handleClick} key={component.id}>
            <Typography>Componente no compatible: {component.type}</Typography>
          </Box>
        );
    }
  };

  // Función para manejar clics en el editor
  const handleEditorClick = (e: React.MouseEvent) => {
    if (e.target === editorRef.current) {
      setSelectedComponentId(null);
    }
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Barra de herramientas superior */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          borderBottom: '1px solid #e0e0e0',
          backgroundColor: '#f5f5f5',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={onClose} sx={{ mr: 1 }}>
            <Icon icon="mdi:arrow-left" />
          </IconButton>
          <TextField
            placeholder="Título del contenido"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            variant="standard"
            sx={{ minWidth: 300 }}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            onClick={handleSaveEducacion}
            startIcon={<Icon icon="mdi:plus" />}
          >
            Guardar
          </Button>
        </Box>
      </Box>

      {/* Área principal del editor */}
      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        {/* Panel lateral izquierdo - Selección de elementos */}
        <Box
          sx={{
            width: 250,
            p: 2,
            borderRight: '1px solid #e0e0e0',
            backgroundColor: '#f5f5f5',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
            Elementos
          </Typography>

          <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
            Textos
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button
              startIcon={<Icon icon="mdi:format-header-1" />}
              variant="outlined"
              size="small"
              onClick={() => addComponent('heading')}
              sx={{ justifyContent: 'flex-start' }}
            >
              Título
            </Button>
            <Button
              startIcon={<Icon icon="mdi:format-paragraph" />}
              variant="outlined"
              size="small"
              onClick={() => addComponent('paragraph')}
              sx={{ justifyContent: 'flex-start' }}
            >
              Párrafo
            </Button>
            <Button
              startIcon={<Icon icon="mdi:format-list-bulleted" />}
              variant="outlined"
              size="small"
              onClick={() => addComponent('bulletList')}
              sx={{ justifyContent: 'flex-start' }}
            >
              Lista con viñetas
            </Button>
          </Box>

          <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
            Medios
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button
              startIcon={<Icon icon="mdi:image" />}
              variant="outlined"
              size="small"
              onClick={() => addComponent('image')}
              sx={{ justifyContent: 'flex-start' }}
            >
              Imagen
            </Button>
            <Button
              startIcon={<Icon icon="mdi:video" />}
              variant="outlined"
              size="small"
              onClick={() => addComponent('video')}
              sx={{ justifyContent: 'flex-start' }}
            >
              Video
            </Button>
            <Button
              startIcon={<Icon icon="mdi:music" />}
              variant="outlined"
              size="small"
              onClick={() => addComponent('audio')}
              sx={{ justifyContent: 'flex-start' }}
            >
              Audio
            </Button>
            <Button
              startIcon={<Icon icon="mdi:image-multiple" />}
              variant="outlined"
              size="small"
              onClick={() => addComponent('gallery')}
              sx={{ justifyContent: 'flex-start' }}
            >
              Galería
            </Button>
          </Box>

          <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
            Interactivos
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button
              startIcon={<Icon icon="mdi:gesture-tap-button" />}
              variant="outlined"
              size="small"
              onClick={() => addComponent('button')}
              sx={{ justifyContent: 'flex-start' }}
            >
              Botón
            </Button>
            <Button
              startIcon={<Icon icon="mdi:help-circle" />}
              variant="outlined"
              size="small"
              onClick={() => addComponent('quiz')}
              sx={{ justifyContent: 'flex-start' }}
            >
              Cuestionario
            </Button>
            <Button
              startIcon={<Icon icon="mdi:arrow-expand-vertical" />}
              variant="outlined"
              size="small"
              onClick={() => addComponent('accordion')}
              sx={{ justifyContent: 'flex-start' }}
            >
              Acordeón
            </Button>
          </Box>

          <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
            Elementos estructurados
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button
              startIcon={<Icon icon="mdi:lightbulb-on" />}
              variant="outlined"
              size="small"
              onClick={() => addComponent('exampleBox')}
              sx={{ justifyContent: 'flex-start' }}
            >
              Ejemplo práctico
            </Button>
            <Button
              startIcon={<Icon icon="mdi:information" />}
              variant="outlined"
              size="small"
              onClick={() => addComponent('infoCard')}
              sx={{ justifyContent: 'flex-start' }}
            >
              Tarjeta de información
            </Button>
            <Button
              startIcon={<Icon icon="mdi:text-box-outline" />}
              variant="outlined"
              size="small"
              onClick={() => addComponent('highlightBox')}
              sx={{ justifyContent: 'flex-start' }}
            >
              Bloque destacado
            </Button>
            <Button
              startIcon={<Icon icon="mdi:format-list-checks" />}
              variant="outlined"
              size="small"
              onClick={() => addComponent('iconList')}
              sx={{ justifyContent: 'flex-start' }}
            >
              Lista con iconos
            </Button>
            <Button
              startIcon={<Icon icon="mdi:progress-check" />}
              variant="outlined"
              size="small"
              onClick={() => addComponent('stepProcess')}
              sx={{ justifyContent: 'flex-start' }}
            >
              Proceso por pasos
            </Button>
          </Box>

          <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
            Avanzado
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button
              startIcon={<Icon icon="mdi:code-tags" />}
              variant="outlined"
              size="small"
              onClick={() => addComponent('codeSnippet')}
              sx={{ justifyContent: 'flex-start' }}
            >
              Código
            </Button>
            <Button
              startIcon={<Icon icon="mdi:table" />}
              variant="outlined"
              size="small"
              onClick={() => addComponent('table')}
              sx={{ justifyContent: 'flex-start' }}
            >
              Tabla
            </Button>
            <Button
              startIcon={<Icon icon="mdi:timeline" />}
              variant="outlined"
              size="small"
              onClick={() => addComponent('timeline')}
              sx={{ justifyContent: 'flex-start' }}
            >
              Línea de tiempo
            </Button>
            <Button
              startIcon={<Icon icon="mdi:minus" />}
              variant="outlined"
              size="small"
              onClick={() => addComponent('divider')}
              sx={{ justifyContent: 'flex-start' }}
            >
              Separador
            </Button>
            <Button
              startIcon={<Icon icon="mdi:space-invaders" />}
              variant="outlined"
              size="small"
              onClick={() => addComponent('spacer')}
              sx={{ justifyContent: 'flex-start' }}
            >
              Espaciador
            </Button>
          </Box>
        </Box>

        {/* Editor de contenido */}
        <Box
          ref={editorRef}
          onClick={handleEditorClick}
          sx={{
            flexGrow: 1,
            p: 3,
            overflowY: 'auto',
            backgroundColor: emailBackground,
          }}
        >
          <Paper
            elevation={1}
            sx={{
              width: pageLayout === 'fixed' ? '800px' : '100%',
              margin: '0 auto',
              p: 2,
              backgroundColor: '#fff',
              minHeight: 'calc(100% - 40px)',
            }}
          >
            {components.map((component, index) => renderComponent(component, index))}

            {components.length === 0 && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '300px',
                  border: '2px dashed #ccc',
                  borderRadius: '4px',
                  p: 3,
                }}
              >
                <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                  Tu contenido educativo está vacío
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => addComponent('heading')}
                  startIcon={<Icon icon="mdi:plus" />}
                >
                  Agregar Elemento
                </Button>
              </Box>
            )}
          </Paper>
        </Box>

        {/* Panel lateral de propiedades */}
        {selectedComponentId && (
          <Box
            sx={{
              width: 300,
              p: 2,
              borderLeft: '1px solid #e0e0e0',
              backgroundColor: '#f9f9f9',
              overflowY: 'auto',
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Propiedades
            </Typography>

            {activeEditor && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Formato de texto
                </Typography>

                {/* Estilos de texto */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  <Tooltip title="Negrita">
                    <IconButton
                      size="small"
                      onClick={() => activeEditor.chain().focus().toggleBold().run()}
                      color={activeEditor.isActive('bold') ? 'primary' : 'default'}
                    >
                      <Icon icon="mdi:format-bold" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Cursiva">
                    <IconButton
                      size="small"
                      onClick={() => activeEditor.chain().focus().toggleItalic().run()}
                      color={activeEditor.isActive('italic') ? 'primary' : 'default'}
                    >
                      <Icon icon="mdi:format-italic" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Subrayado">
                    <IconButton
                      size="small"
                      onClick={() => activeEditor.chain().focus().toggleUnderline().run()}
                      color={activeEditor.isActive('underline') ? 'primary' : 'default'}
                    >
                      <Icon icon="mdi:format-underline" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Tachado">
                    <IconButton
                      size="small"
                      onClick={() => activeEditor.chain().focus().toggleStrike().run()}
                      color={activeEditor.isActive('strike') ? 'primary' : 'default'}
                    >
                      <Icon icon="mdi:format-strikethrough" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Código">
                    <IconButton
                      size="small"
                      onClick={() => activeEditor.chain().focus().toggleCode().run()}
                      color={activeEditor.isActive('code') ? 'primary' : 'default'}
                    >
                      <Icon icon="mdi:code-tags" />
                    </IconButton>
                  </Tooltip>
                </Box>

                {/* Encabezados */}
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Encabezados
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  <Tooltip title="Párrafo">
                    <IconButton
                      size="small"
                      onClick={() => activeEditor.chain().focus().setParagraph().run()}
                      color={activeEditor.isActive('paragraph') ? 'primary' : 'default'}
                    >
                      <Icon icon="mdi:format-pilcrow" />
                    </IconButton>
                  </Tooltip>

                  {[1, 2, 3, 4, 5, 6].map((level) => (
                    <Tooltip key={level} title={`Encabezado ${level}`}>
                      <IconButton
                        size="small"
                        onClick={() =>
                          activeEditor
                            .chain()
                            .focus()
                            .toggleHeading({
                              level: level as 1 | 2 | 3 | 4 | 5 | 6,
                            })
                            .run()
                        }
                        color={activeEditor.isActive('heading', { level }) ? 'primary' : 'default'}
                      >
                        <Icon icon={`mdi:format-header-${level}`} />
                      </IconButton>
                    </Tooltip>
                  ))}
                </Box>

                {/* Alineación */}
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Alineación
                </Typography>
                <ToggleButtonGroup
                  size="small"
                  exclusive
                  value={
                    activeEditor.isActive({ textAlign: 'left' })
                      ? 'left'
                      : activeEditor.isActive({ textAlign: 'center' })
                        ? 'center'
                        : activeEditor.isActive({ textAlign: 'right' })
                          ? 'right'
                          : activeEditor.isActive({ textAlign: 'justify' })
                            ? 'justify'
                            : 'left'
                  }
                  onChange={(_, value) => {
                    if (value) {
                      activeEditor.chain().focus().setTextAlign(value).run();
                    }
                  }}
                  sx={{ mb: 2 }}
                >
                  <ToggleButton value="left">
                    <Icon icon="mdi:format-align-left" />
                  </ToggleButton>
                  <ToggleButton value="center">
                    <Icon icon="mdi:format-align-center" />
                  </ToggleButton>
                  <ToggleButton value="right">
                    <Icon icon="mdi:format-align-right" />
                  </ToggleButton>
                  <ToggleButton value="justify">
                    <Icon icon="mdi:format-align-justify" />
                  </ToggleButton>
                </ToggleButtonGroup>

                {/* Listas */}
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Listas
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  <Tooltip title="Lista con viñetas">
                    <IconButton
                      size="small"
                      onClick={() => activeEditor.chain().focus().toggleBulletList().run()}
                      color={activeEditor.isActive('bulletList') ? 'primary' : 'default'}
                    >
                      <Icon icon="mdi:format-list-bulleted" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Lista numerada">
                    <IconButton
                      size="small"
                      onClick={() => activeEditor.chain().focus().toggleOrderedList().run()}
                      color={activeEditor.isActive('orderedList') ? 'primary' : 'default'}
                    >
                      <Icon icon="mdi:format-list-numbered" />
                    </IconButton>
                  </Tooltip>

                  {/* Estos botones requieren extensiones adicionales para Tiptap */}
                  <Tooltip title="Aumentar nivel de lista">
                    <IconButton
                      size="small"
                      onClick={() => {
                        // Aquí se podría implementar lógica personalizada para niveles de lista
                        // o agregar extensiones específicas para esto
                      }}
                    >
                      <Icon icon="mdi:format-indent-increase" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Disminuir nivel de lista">
                    <IconButton
                      size="small"
                      onClick={() => {
                        // Aquí se podría implementar lógica personalizada para niveles de lista
                        // o agregar extensiones específicas para esto
                      }}
                    >
                      <Icon icon="mdi:format-indent-decrease" />
                    </IconButton>
                  </Tooltip>
                </Box>

                {/* Color y Enlaces */}
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Color y enlaces
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  <TextField
                    size="small"
                    label="Color de texto"
                    type="color"
                    value={color}
                    onChange={(e) => {
                      setColor(e.target.value);
                      activeEditor.chain().focus().setColor(e.target.value).run();
                    }}
                    sx={{ width: '100%', mb: 1 }}
                  />

                  <TextField
                    size="small"
                    label="URL del enlace"
                    fullWidth
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://"
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          size="small"
                          onClick={() => {
                            if (linkUrl) {
                              activeEditor.chain().focus().setLink({ href: linkUrl }).run();
                            } else {
                              activeEditor.chain().focus().unsetLink().run();
                            }
                          }}
                          color="primary"
                        >
                          <Icon
                            icon={activeEditor.isActive('link') ? 'mdi:link-off' : 'mdi:link'}
                          />
                        </IconButton>
                      ),
                    }}
                  />
                </Box>

                {/* Citas y bloques */}
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Bloques de contenido
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  <Tooltip title="Cita">
                    <IconButton
                      size="small"
                      onClick={() => activeEditor.chain().focus().toggleBlockquote().run()}
                      color={activeEditor.isActive('blockquote') ? 'primary' : 'default'}
                    >
                      <Icon icon="mdi:format-quote-close" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Bloque de código">
                    <IconButton
                      size="small"
                      onClick={() => activeEditor.chain().focus().toggleCodeBlock().run()}
                      color={activeEditor.isActive('codeBlock') ? 'primary' : 'default'}
                    >
                      <Icon icon="mdi:code-braces" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Línea horizontal">
                    <IconButton
                      size="small"
                      onClick={() => activeEditor.chain().focus().setHorizontalRule().run()}
                    >
                      <Icon icon="mdi:minus" />
                    </IconButton>
                  </Tooltip>
                </Box>

                {/* Acciones de documento */}
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Acciones
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  <Tooltip title="Deshacer">
                    <IconButton
                      size="small"
                      onClick={() => activeEditor.chain().focus().undo().run()}
                      disabled={!activeEditor.can().undo()}
                    >
                      <Icon icon="mdi:undo" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Rehacer">
                    <IconButton
                      size="small"
                      onClick={() => activeEditor.chain().focus().redo().run()}
                      disabled={!activeEditor.can().redo()}
                    >
                      <Icon icon="mdi:redo" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Limpiar formato">
                    <IconButton
                      size="small"
                      onClick={() =>
                        activeEditor.chain().focus().clearNodes().unsetAllMarks().run()
                      }
                    >
                      <Icon icon="mdi:format-clear" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            )}

            {/* Propiedades específicas del componente seleccionado */}
            {selectedComponentId && (
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Propiedades del componente
                </Typography>

                {/* Renderizar propiedades específicas según el tipo de componente */}
                {(() => {
                  const component = components.find((c) => c.id === selectedComponentId);
                  if (!component) return null;

                  // Declarar constantes fuera de los bloques case
                  const iconListItems =
                    component.type === 'iconList'
                      ? ((component.props?.items || [
                          { icon: 'mdi:check-circle', text: 'Punto importante 1' },
                          { icon: 'mdi:check-circle', text: 'Punto importante 2' },
                          { icon: 'mdi:check-circle', text: 'Punto importante 3' },
                        ]) as Array<{ icon: string; text: string }>)
                      : [];

                  const processSteps =
                    component.type === 'stepProcess'
                      ? ((component.props?.steps || [
                          {
                            number: 1,
                            title: 'Identificación de riesgos',
                            description: 'Detectar posibles riesgos en el proyecto',
                          },
                          {
                            number: 2,
                            title: 'Clasificación',
                            description: 'Evaluar el impacto y probabilidad',
                          },
                          {
                            number: 3,
                            title: 'Mitigación',
                            description: 'Implementar estrategias para reducir riesgos',
                          },
                          {
                            number: 4,
                            title: 'Monitoreo',
                            description: 'Seguimiento continuo de los riesgos',
                          },
                        ]) as Array<{ number: number; title: string; description: string }>)
                      : [];

                  switch (component.type) {
                    case 'heading':
                      return (
                        <TextField
                          size="small"
                          select
                          label="Nivel de encabezado"
                          value={component.props?.level || 2}
                          onChange={(e) =>
                            updateComponentProps(component.id, { level: Number(e.target.value) })
                          }
                          fullWidth
                          sx={{ mb: 2 }}
                        >
                          {[1, 2, 3, 4, 5, 6].map((level) => (
                            <MenuItem key={level} value={level}>
                              H{level}
                            </MenuItem>
                          ))}
                        </TextField>
                      );

                    case 'infoCard':
                      return (
                        <>
                          <TextField
                            size="small"
                            label="Icono"
                            value={component.props?.icon || 'mdi:information'}
                            onChange={(e) =>
                              updateComponentProps(component.id, { icon: e.target.value })
                            }
                            fullWidth
                            sx={{ mb: 2 }}
                            helperText="Nombre del icono de Iconify (ej: mdi:information, mdi:alert, etc.)"
                          />
                          <TextField
                            size="small"
                            label="Color de fondo"
                            type="color"
                            value={component.props?.bgColor || '#e0f7fa'}
                            onChange={(e) =>
                              updateComponentProps(component.id, { bgColor: e.target.value })
                            }
                            fullWidth
                            sx={{ mb: 2 }}
                          />
                          <TextField
                            size="small"
                            label="Color del texto"
                            type="color"
                            value={component.props?.textColor || '#006064'}
                            onChange={(e) =>
                              updateComponentProps(component.id, { textColor: e.target.value })
                            }
                            fullWidth
                            sx={{ mb: 2 }}
                          />
                          <TextField
                            size="small"
                            label="Color del borde"
                            type="color"
                            value={component.props?.borderColor || '#00bcd4'}
                            onChange={(e) =>
                              updateComponentProps(component.id, { borderColor: e.target.value })
                            }
                            fullWidth
                            sx={{ mb: 2 }}
                          />
                        </>
                      );

                    case 'highlightBox':
                      return (
                        <>
                          <TextField
                            size="small"
                            label="Color de fondo"
                            type="color"
                            value={component.props?.bgColor || '#fff3e0'}
                            onChange={(e) =>
                              updateComponentProps(component.id, { bgColor: e.target.value })
                            }
                            fullWidth
                            sx={{ mb: 2 }}
                          />
                          <TextField
                            size="small"
                            label="Color del borde"
                            type="color"
                            value={component.props?.borderColor || '#ff9800'}
                            onChange={(e) =>
                              updateComponentProps(component.id, { borderColor: e.target.value })
                            }
                            fullWidth
                            sx={{ mb: 2 }}
                          />
                          <TextField
                            size="small"
                            select
                            label="Estilo del borde"
                            value={component.props?.borderStyle || 'solid'}
                            onChange={(e) =>
                              updateComponentProps(component.id, { borderStyle: e.target.value })
                            }
                            fullWidth
                            sx={{ mb: 2 }}
                          >
                            {['solid', 'dashed', 'dotted', 'double'].map((style) => (
                              <MenuItem key={style} value={style}>
                                {style.charAt(0).toUpperCase() + style.slice(1)}
                              </MenuItem>
                            ))}
                          </TextField>
                        </>
                      );

                    case 'iconList':
                      return (
                        <>
                          <TextField
                            size="small"
                            label="Color de iconos"
                            type="color"
                            value={component.props?.iconColor || '#4caf50'}
                            onChange={(e) =>
                              updateComponentProps(component.id, { iconColor: e.target.value })
                            }
                            fullWidth
                            sx={{ mb: 2 }}
                          />

                          <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>
                            Elementos de la lista
                          </Typography>

                          {iconListItems.map((item, index) => (
                            <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                              <TextField
                                size="small"
                                label="Icono"
                                value={item.icon}
                                onChange={(e) => {
                                  const newItems = [...iconListItems];
                                  newItems[index].icon = e.target.value;
                                  updateComponentProps(component.id, { items: newItems });
                                }}
                                sx={{ width: '40%' }}
                              />
                              <TextField
                                size="small"
                                label="Texto"
                                value={item.text}
                                onChange={(e) => {
                                  const newItems = [...iconListItems];
                                  newItems[index].text = e.target.value;
                                  updateComponentProps(component.id, { items: newItems });
                                }}
                                sx={{ width: '60%' }}
                              />
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => {
                                  const newItems = iconListItems.filter((_, i) => i !== index);
                                  updateComponentProps(component.id, { items: newItems });
                                }}
                              >
                                <Icon icon="mdi:delete" />
                              </IconButton>
                            </Box>
                          ))}

                          <Button
                            size="small"
                            startIcon={<Icon icon="mdi:plus" />}
                            onClick={() => {
                              const newItems = [
                                ...iconListItems,
                                { icon: 'mdi:check-circle', text: 'Nuevo punto' },
                              ];
                              updateComponentProps(component.id, { items: newItems });
                            }}
                            sx={{ mt: 1 }}
                          >
                            Añadir elemento
                          </Button>
                        </>
                      );

                    case 'stepProcess':
                      return (
                        <>
                          <TextField
                            size="small"
                            select
                            label="Orientación"
                            value={component.props?.orientation || 'vertical'}
                            onChange={(e) =>
                              updateComponentProps(component.id, { orientation: e.target.value })
                            }
                            fullWidth
                            sx={{ mb: 2 }}
                          >
                            <MenuItem value="vertical">Vertical</MenuItem>
                            <MenuItem value="horizontal">Horizontal</MenuItem>
                          </TextField>

                          <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>
                            Pasos del proceso
                          </Typography>

                          {processSteps.map((step, index) => (
                            <Box
                              key={index}
                              sx={{ mb: 2, p: 1, bgcolor: 'background.paper', borderRadius: 1 }}
                            >
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="subtitle2">Paso {index + 1}</Typography>
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => {
                                    const newSteps = processSteps.filter((_, i) => i !== index);
                                    // Actualizar los números
                                    const updatedSteps = newSteps.map((s, i) => ({
                                      ...s,
                                      number: i + 1,
                                    }));
                                    updateComponentProps(component.id, { steps: updatedSteps });
                                  }}
                                >
                                  <Icon icon="mdi:delete" />
                                </IconButton>
                              </Box>

                              <TextField
                                size="small"
                                label="Título"
                                value={step.title}
                                onChange={(e) => {
                                  const newSteps = [...processSteps];
                                  newSteps[index].title = e.target.value;
                                  updateComponentProps(component.id, { steps: newSteps });
                                }}
                                fullWidth
                                sx={{ mb: 1 }}
                              />

                              <TextField
                                size="small"
                                label="Descripción"
                                value={step.description}
                                onChange={(e) => {
                                  const newSteps = [...processSteps];
                                  newSteps[index].description = e.target.value;
                                  updateComponentProps(component.id, { steps: newSteps });
                                }}
                                fullWidth
                                multiline
                                rows={2}
                              />
                            </Box>
                          ))}

                          <Button
                            size="small"
                            startIcon={<Icon icon="mdi:plus" />}
                            onClick={() => {
                              const newStep = {
                                number: processSteps.length + 1,
                                title: `Paso ${processSteps.length + 1}`,
                                description: 'Descripción del paso',
                              };
                              updateComponentProps(component.id, {
                                steps: [...processSteps, newStep],
                              });
                            }}
                          >
                            Añadir paso
                          </Button>
                        </>
                      );

                    case 'exampleBox':
                      return (
                        <>
                          <TextField
                            size="small"
                            label="Título"
                            value={component.props?.boxTitle || 'Ejemplo práctico'}
                            onChange={(e) =>
                              updateComponentProps(component.id, { boxTitle: e.target.value })
                            }
                            fullWidth
                            sx={{ mb: 2 }}
                          />
                          <TextField
                            size="small"
                            label="Color de fondo"
                            type="color"
                            value={component.props?.bgColor || '#f3e5f5'}
                            onChange={(e) =>
                              updateComponentProps(component.id, { bgColor: e.target.value })
                            }
                            fullWidth
                            sx={{ mb: 2 }}
                          />
                          <TextField
                            size="small"
                            label="Icono"
                            value={component.props?.icon || 'mdi:lightbulb-on'}
                            onChange={(e) =>
                              updateComponentProps(component.id, { icon: e.target.value })
                            }
                            fullWidth
                            sx={{ mb: 2 }}
                            helperText="Nombre del icono de Iconify (ej: mdi:lightbulb-on, mdi:school, etc.)"
                          />
                          <TextField
                            size="small"
                            label="Color del icono"
                            type="color"
                            value={component.props?.iconColor || '#9c27b0'}
                            onChange={(e) =>
                              updateComponentProps(component.id, { iconColor: e.target.value })
                            }
                            fullWidth
                            sx={{ mb: 2 }}
                          />
                        </>
                      );

                    // Otras propiedades específicas por tipo se pueden agregar aquí
                    default:
                      return null;
                  }
                })()}
              </Box>
            )}
          </Box>
        )}
      </Box>

      {/* Snackbar para mensajes */}
      <CustomSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={() => setSnackbarOpen(false)}
      />
    </Box>
  );
}

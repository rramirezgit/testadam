'use client';

// ⚡ ULTRA-OPTIMIZACIÓN: Importar CSS optimizado
import './tiptap-optimizations.css';

import type React from 'react';
import type { Editor } from '@tiptap/core';

import { Icon } from '@iconify/react';
import Link from '@tiptap/extension-link';
import Color from '@tiptap/extension-color';
import StarterKit from '@tiptap/starter-kit';
import { DOMSerializer } from '@tiptap/pm/model';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import TextAlign from '@tiptap/extension-text-align';
import FontFamily from '@tiptap/extension-font-family';
import { useEditor, BubbleMenu, EditorContent } from '@tiptap/react';
import { useRef, useMemo, useState, useEffect, useCallback } from 'react';

import {
  Box,
  Paper,
  Dialog,
  Button,
  Tooltip,
  Popover,
  TextField,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import AIAssistantModal from './email-editor/ai-menu/AIAssistantModal';
import TextColorPicker from './email-editor/color-picker/TextColorPicker';
import { DEFAULT_PLACEHOLDER_COLOR } from './email-editor/email-components/utils';

interface SimpleTipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
  style?: React.CSSProperties;
  className?: string;
  placeholder?: string;
  onSelectionUpdate?: (editor: any) => void;
  showToolbar?: boolean;
  onBlur?: () => void;
  // Props opcionales para bubble menu customizado (usado en categorías)
  showBackgroundColorPicker?: boolean;
  backgroundColor?: string;
  onBackgroundColorChange?: (color: string) => void;
  onTextColorChange?: (color: string) => void;
  // Nueva prop para controlar si se muestra el botón de IA
  showAIButton?: boolean;
  isPlaceholder?: boolean;
  placeholderColor?: string;
  onEditorReady?: (editor: Editor | null) => void;
}

// ⚡ ULTRA-OPTIMIZACIÓN: Cache global de extensiones
let cachedExtensions: any[] | null = null;
const getExtensions = () => {
  if (!cachedExtensions) {
    cachedExtensions = [
      StarterKit.configure({
        // Deshabilitar funciones no esenciales para mejor rendimiento
        history: {
          depth: 10, // Reducir historial
        },
        dropcursor: false, // Deshabilitar si no se usa
        // ⚡ PREVENIR PROBLEMAS DE HIDRATACIÓN: Configurar elementos de párrafo
        paragraph: {
          HTMLAttributes: {
            class: 'tiptap-paragraph',
          },
        },
        // ⚡ PREVENIR PROBLEMAS DE HIDRATACIÓN: Configurar elementos de heading
        heading: {
          HTMLAttributes: {
            class: 'tiptap-heading',
          },
        },
      }),
      TextStyle,
      Color,
      FontFamily,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer',
          style: 'color: inherit; text-decoration: underline;',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ];
  }
  return cachedExtensions;
};

// ⚡ ULTRA-OPTIMIZACIÓN: Debouncer avanzado con diferentes niveles
class AdvancedDebouncer {
  private timeouts: Map<string, NodeJS.Timeout> = new Map();

  debounce<T extends (...args: any[]) => void>(
    key: string,
    func: T,
    delay: number,
    immediate = false
  ): (...args: Parameters<T>) => void {
    return (...args: Parameters<T>) => {
      const existing = this.timeouts.get(key);
      if (existing) {
        clearTimeout(existing);
      }

      if (immediate && !existing) {
        func(...args);
      }

      const timeout = setTimeout(() => {
        this.timeouts.delete(key);
        if (!immediate) {
          func(...args);
        }
      }, delay);

      this.timeouts.set(key, timeout);
    };
  }

  clear(key?: string) {
    if (key) {
      const timeout = this.timeouts.get(key);
      if (timeout) {
        clearTimeout(timeout);
        this.timeouts.delete(key);
      }
    } else {
      this.timeouts.forEach((timeout) => clearTimeout(timeout));
      this.timeouts.clear();
    }
  }
}

// ⚡ ULTRA-OPTIMIZACIÓN: Instancia global de debouncer
const globalDebouncer = new AdvancedDebouncer();

export default function SimpleTipTapEditor({
  content,
  onChange,
  style,
  className,
  placeholder = 'Escribe aquí...',
  onSelectionUpdate,
  showToolbar = true,
  onBlur,
  showBackgroundColorPicker = false,
  backgroundColor = '#e3f2fd',
  onBackgroundColorChange,
  onTextColorChange,
  showAIButton = true, // Por defecto true para mantener compatibilidad
  isPlaceholder = false,
  placeholderColor = DEFAULT_PLACEHOLDER_COLOR,
  onEditorReady,
}: SimpleTipTapEditorProps) {
  const editorRef = useRef<any>(null);
  const isUpdatingContent = useRef(false);
  const lastContent = useRef(content);

  // Estados para el BubbleMenu de enlaces
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  // Estados para el color picker en BubbleMenu
  const [colorAnchorEl, setColorAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTextColor, setSelectedTextColor] = useState('#000000');

  // Estados para el color de fondo (usado en categorías)
  const [bgColorAnchorEl, setBgColorAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedBgColor, setSelectedBgColor] = useState(backgroundColor);

  // Estados para IA Modal
  const [showAIModal, setShowAIModal] = useState(false);
  const [selectedTextHTML, setSelectedTextHTML] = useState<string>('');
  const [selectedRange, setSelectedRange] = useState<{ from: number; to: number } | null>(null);

  // Funciones para el BubbleMenu
  const handleCreateLink = () => {
    setLinkUrl('');
    setShowLinkDialog(true);
  };

  const handleEditLink = () => {
    if (editor) {
      const { href } = editor.getAttributes('link');
      setLinkUrl(href || '');
      setShowLinkDialog(true);
    }
  };

  const handleApplyLink = () => {
    if (!linkUrl.trim() || !editor) return;

    let validUrl = linkUrl.trim();
    if (
      !validUrl.startsWith('http://') &&
      !validUrl.startsWith('https://') &&
      !validUrl.startsWith('mailto:')
    ) {
      validUrl = 'https://' + validUrl;
    }

    editor.chain().focus().setLink({ href: validUrl, target: '_blank' }).run();
    setShowLinkDialog(false);
    setLinkUrl('');
  };

  const handleRemoveLink = () => {
    if (editor) {
      editor.chain().focus().unsetLink().run();
    }
  };

  // Funciones para el color picker de texto
  const handleColorClick = (event: React.MouseEvent<HTMLElement>) => {
    setColorAnchorEl(event.currentTarget);
  };

  const handleColorClose = () => {
    setColorAnchorEl(null);
  };

  const handleApplyTextColor = (color: string) => {
    // Si hay un callback personalizado (para categorías), usarlo
    if (onTextColorChange) {
      onTextColorChange(color);
      setSelectedTextColor(color);
      return;
    }

    // Comportamiento normal: aplicar color al texto seleccionado
    if (editor) {
      if (color) {
        editor.chain().focus().setColor(color).run();
      } else {
        editor.chain().focus().unsetColor().run();
      }
      setSelectedTextColor(color);
    }
  };

  // Funciones para el color de fondo (categorías)
  const handleBgColorClick = (event: React.MouseEvent<HTMLElement>) => {
    setBgColorAnchorEl(event.currentTarget);
  };

  const handleBgColorClose = () => {
    setBgColorAnchorEl(null);
  };

  const handleApplyBgColor = (color: string) => {
    setSelectedBgColor(color);
    if (onBackgroundColorChange) {
      onBackgroundColorChange(color);
    }
  };

  // Funciones para IA Modal
  const handleAIClick = () => {
    if (!editor) return;

    // Obtener el rango de selección actual
    const { from, to } = editor.state.selection;
    if (from === to) {
      // No hay texto seleccionado
      return;
    }

    // Guardar el rango
    setSelectedRange({ from, to });

    // Obtener el HTML del fragmento seleccionado
    const fragment = editor.state.doc.cut(from, to);
    const serializer = DOMSerializer.fromSchema(editor.schema);
    const tempDiv = document.createElement('div');
    tempDiv.appendChild(serializer.serializeFragment(fragment.content));
    const htmlContent = tempDiv.innerHTML;

    setSelectedTextHTML(htmlContent);
    setShowAIModal(true);
  };

  const handleAIModalClose = () => {
    setShowAIModal(false);
    setSelectedTextHTML('');
    setSelectedRange(null);
  };

  const handleApplyAIResult = (newText: string) => {
    if (!editor || !selectedRange) return;

    const { from, to } = selectedRange;

    // Reemplazar el texto seleccionado con el resultado
    editor
      .chain()
      .focus()
      .setTextSelection({ from, to })
      .deleteSelection()
      .insertContent(newText)
      .run();

    // Limpiar estados
    handleAIModalClose();
  };

  // ⚡ ULTRA-OPTIMIZACIÓN: Memoizar extensiones con cache global
  const extensions = useMemo(() => getExtensions(), []);

  // ⚡ ULTRA-OPTIMIZACIÓN: Debouncing ultra-agresivo para onChange
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedOnChange = useCallback(
    globalDebouncer.debounce(
      'content-change',
      (newContent: string) => {
        if (newContent !== lastContent.current) {
          lastContent.current = newContent;
          onChange(newContent);
        }
      },
      50, // Reducido a 50ms para mayor fluidez
      false
    ),
    [onChange]
  );

  // ⚡ ULTRA-OPTIMIZACIÓN: Throttling ultra-ligero para selección
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const throttledSelectionUpdate = useCallback(
    globalDebouncer.debounce(
      'selection-update',
      (editor: any) => {
        if (onSelectionUpdate && !isUpdatingContent.current) {
          onSelectionUpdate(editor);
        }
      },
      8, // ~120fps para máxima fluidez
      true // Immediate = true para respuesta instantánea
    ),
    [onSelectionUpdate]
  );

  // ⚡ ULTRA-OPTIMIZACIÓN: Configuración del editor optimizada
  const editorConfig = useMemo(
    () => ({
      extensions,
      content,
      onUpdate: ({ editor }: { editor: any }) => {
        if (!isUpdatingContent.current) {
          const newContent = editor.getHTML();
          debouncedOnChange(newContent);
        }
      },
      onSelectionUpdate: ({ editor }: { editor: any }) => {
        throttledSelectionUpdate(editor);
      },
      onBlur: () => {
        if (onBlur) {
          onBlur();
        }
      },
      editorProps: {
        attributes: {
          class: className || 'tiptap-editor-optimized',
          placeholder,
          'data-placeholder': placeholder,
          // ⚡ PREVENIR PROBLEMAS DE HIDRATACIÓN: Asegurar que el editor use elementos válidos
          'data-testid': 'tiptap-editor',
        },
        // ⚡ ULTRA-OPTIMIZACIÓN: Eventos pasivos para mejor rendimiento
        handleDOMEvents: {
          keydown: () => false, // Permitir que el navegador maneje los eventos
          input: () => false, // Reducir interferencias
        },
        // ⚡ PREVENIR PROBLEMAS DE HIDRATACIÓN: Transformar el contenido para evitar anidación inválida
        transformPastedHTML: (html: string) =>
          // Asegurar que no hay divs dentro de párrafos
          html
            .replace(/<div([^>]*)>(.*?)<\/div>/gi, '<p$1>$2</p>')
            .replace(/<p([^>]*)><p([^>]*)>/gi, '<p$1 $2>')
            .replace(/<\/p><\/p>/gi, '</p>'),
      },
      // ⚡ ULTRA-OPTIMIZACIÓN: Parser optimizado
      parseOptions: {
        preserveWhitespace: 'full' as const,
      },
      // ⚡ ULTRA-OPTIMIZACIÓN: Deshabilitar auto-focus para mejor rendimiento
      autofocus: false,
      editable: true,
      injectCSS: false, // Usar CSS externo para mejor rendimiento
      // ⚡ PREVENIR PROBLEMAS DE HIDRATACIÓN: Configuración específica para SSR
      immediatelyRender: false,
      shouldRerenderOnTransaction: false,
      // ⚡ PREVENIR PROBLEMAS DE HIDRATACIÓN: Configuraciones adicionales
      enableInputRules: true,
      enablePasteRules: true,
      enableCoreExtensions: true,
    }),
    [
      extensions,
      content,
      debouncedOnChange,
      throttledSelectionUpdate,
      className,
      placeholder,
      onBlur,
    ]
  );

  const editor = useEditor(editorConfig, []);

  // ⚡ PREVENIR PROBLEMAS DE HIDRATACIÓN: Asegurar que el editor esté disponible solo en el cliente
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // ⚡ ULTRA-OPTIMIZACIÓN: Actualización de contenido con batching
  useEffect(() => {
    if (editor && content !== lastContent.current && content !== editor.getHTML()) {
      isUpdatingContent.current = true;

      // Usar scheduler de React para batching
      const updateContent = () => {
        editor.commands.setContent(content, false);
        lastContent.current = content;
        isUpdatingContent.current = false;
      };

      // Usar MessageChannel para scheduling sin bloqueo
      if (typeof MessageChannel !== 'undefined') {
        const channel = new MessageChannel();
        channel.port2.onmessage = updateContent;
        channel.port1.postMessage(null);
      } else {
        // Fallback para entornos sin MessageChannel
        requestAnimationFrame(updateContent);
      }
    }
  }, [content, editor]);

  // ⚡ ULTRA-OPTIMIZACIÓN: Guardar referencia del editor
  useEffect(() => {
    if (editor) {
      editorRef.current = editor;
    }
  }, [editor]);

  useEffect(() => {
    if (onEditorReady) {
      onEditorReady(editor);
    }
  }, [editor, onEditorReady]);

  // ⚡ ULTRA-OPTIMIZACIÓN: Cleanup optimizado
  useEffect(
    () => () => {
      globalDebouncer.clear('content-change');
      globalDebouncer.clear('selection-update');
    },
    []
  );

  // ⚡ ULTRA-OPTIMIZACIÓN: Estilos memoizados con mejor especificidad
  const shouldApplyPlaceholderColor =
    isPlaceholder && !(style && typeof style.color === 'string' && style.color.trim().length > 0);

  const editorStyles = useMemo(
    () => ({
      '& .tiptap-editor-optimized': {
        padding: showToolbar ? '8px' : '0 !important',
        minHeight: showToolbar ? '80px' : 'auto',
        border: showToolbar ? undefined : 'none !important',
        borderRadius: showToolbar ? undefined : '0 !important',
        transition: 'none', // Eliminar transiciones para mejor rendimiento
      },
      '& .ProseMirror': {
        padding: showToolbar ? undefined : '0 !important',
        minHeight: showToolbar ? 'inherit' : 'auto !important',
        outline: 'none',
        // ⚡ ULTRA-OPTIMIZACIÓN: Optimización de CSS para mejor rendimiento
        willChange: 'contents',
        contain: 'layout style',
        transform: 'translateZ(0)', // Force GPU acceleration
        // ⚡ PREVENIR PROBLEMAS DE HIDRATACIÓN: Asegurar que no se rendericen elementos inválidos
        display: 'block',
        position: 'relative',
        color: shouldApplyPlaceholderColor ? placeholderColor : undefined,
      },
      // ⚡ PREVENIR PROBLEMAS DE HIDRATACIÓN: Placeholder mejorado
      '& .ProseMirror p.is-editor-empty:first-child::before': {
        content: 'attr(data-placeholder)',
        position: 'absolute',
        color: '#adb5bd',
        pointerEvents: 'none',
        height: 0,
        opacity: 0.6,
      },
      // ⚡ PREVENIR PROBLEMAS DE HIDRATACIÓN: Asegurar que los párrafos sean válidos
      '& .ProseMirror p': {
        margin: 0,
        padding: 0,
        display: 'block',
        position: 'relative',
        // Asegurar que no hay elementos de bloque dentro de párrafos
        '& div, & section, & article, & aside, & header, & footer, & main, & nav': {
          display: 'inline !important',
        },
      },
      '& .ProseMirror h1, & .ProseMirror h2, & .ProseMirror h3, & .ProseMirror h4, & .ProseMirror h5, & .ProseMirror h6':
        {
          margin: 0,
          padding: 0,
          display: 'block',
          position: 'relative',
        },
      // ⚡ PREVENIR PROBLEMAS DE HIDRATACIÓN: Asegurar estructura correcta para listas
      '& .ProseMirror ul, & .ProseMirror ol': {
        display: 'block',
        position: 'relative',
        '& li': {
          display: 'list-item',
          position: 'relative',
        },
      },
      // ✅ Estilos para enlaces: heredar color del texto y solo subrayar
      '& .ProseMirror a': {
        color: 'inherit',
        textDecoration: 'underline',
        cursor: 'pointer',
      },
    }),
    [showToolbar, shouldApplyPlaceholderColor, placeholderColor]
  );

  // ⚡ ULTRA-OPTIMIZACIÓN: Memoización del contenedor con prevención de hidratación
  const editorContainer = useMemo(
    () => (
      <Box
        component="div"
        className={className}
        style={{
          ...style,
          // ⚡ PREVENIR PROBLEMAS DE HIDRATACIÓN: Asegurar estructura HTML válida
          position: 'relative',
          display: 'block',
          width: '100%',
        }}
        sx={editorStyles}
        data-placeholder-active={shouldApplyPlaceholderColor ? 'true' : undefined}
      >
        {isMounted && editor && (
          <>
            <EditorContent editor={editor} />

            {/* BubbleMenu para enlaces */}
            <BubbleMenu
              editor={editor}
              updateDelay={50}
              tippyOptions={{
                duration: 100,
                zIndex: 1200,
                interactive: true,
                appendTo: () => document.body,
                onHide: () => {
                  // No ocultar si hay un popover abierto
                  if (Boolean(colorAnchorEl) || Boolean(bgColorAnchorEl) || showLinkDialog) {
                    return false;
                  }
                  // Permitir ocultar devolviendo undefined (void)
                  return undefined;
                },
              }}
              shouldShow={({ from, to }) =>
                // Mostrar cuando hay texto seleccionado O cuando hay un popover/dialog abierto
                // Ocultar cuando el modal de IA está abierto
                !showAIModal &&
                (from !== to ||
                  Boolean(colorAnchorEl) ||
                  Boolean(bgColorAnchorEl) ||
                  showLinkDialog)
              }
            >
              <Paper
                elevation={3}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                sx={{
                  display: 'flex',
                  gap: 0.5,
                  p: 0.5,
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  minWidth: 'auto',
                  pointerEvents: 'auto',
                  position: 'relative',
                  zIndex: 1200,
                }}
              >
                {/* Botón de formato negrita */}
                <Tooltip title="Negrita">
                  <IconButton
                    size="small"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    sx={{
                      bgcolor: editor.isActive('bold') ? 'grey.300' : 'transparent',
                      color: editor.isActive('bold') ? 'black' : 'inherit',
                    }}
                  >
                    <Icon icon="mdi:format-bold" />
                  </IconButton>
                </Tooltip>

                {/* Botón de formato cursiva */}
                <Tooltip title="Cursiva">
                  <IconButton
                    size="small"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    sx={{
                      bgcolor: editor.isActive('italic') ? 'grey.300' : 'transparent',
                      color: editor.isActive('italic') ? 'black' : 'inherit',
                    }}
                  >
                    <Icon icon="mdi:format-italic" />
                  </IconButton>
                </Tooltip>

                {/* Botón de subrayado */}
                <Tooltip title="Subrayado">
                  <IconButton
                    size="small"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    sx={{
                      bgcolor: editor.isActive('underline') ? 'grey.300' : 'transparent',
                      color: editor.isActive('underline') ? 'black' : 'inherit',
                    }}
                  >
                    <Icon icon="mdi:format-underline" />
                  </IconButton>
                </Tooltip>

                {/* Separador */}
                <Box sx={{ width: 1, bgcolor: 'divider', mx: 0.5 }} />

                {/* Botón de color de texto */}
                <Tooltip title="Color de texto">
                  <IconButton
                    size="small"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={handleColorClick}
                    sx={{
                      bgcolor: 'transparent',
                      color: 'inherit',
                      position: 'relative',
                    }}
                  >
                    <Icon icon="mdi:format-color-text" />
                    {/* Indicador de color actual */}
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 2,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 12,
                        height: 2,
                        bgcolor: selectedTextColor,
                        borderRadius: 1,
                      }}
                    />
                  </IconButton>
                </Tooltip>

                {/* Botón de color de fondo (solo para categorías) */}
                {showBackgroundColorPicker && (
                  <Tooltip title="Color de fondo">
                    <IconButton
                      size="small"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={handleBgColorClick}
                      sx={{
                        bgcolor: 'transparent',
                        color: 'inherit',
                        position: 'relative',
                      }}
                    >
                      <Icon icon="mdi:format-color-fill" />
                      {/* Indicador de color actual */}
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 2,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: 12,
                          height: 2,
                          bgcolor: selectedBgColor,
                          borderRadius: 1,
                        }}
                      />
                    </IconButton>
                  </Tooltip>
                )}

                {/* Separador */}
                <Box sx={{ width: 1, bgcolor: 'divider', mx: 0.5 }} />

                {/* Botón de enlace */}
                <Tooltip title={editor.isActive('link') ? 'Editar enlace' : 'Crear enlace'}>
                  <IconButton
                    size="small"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (editor.isActive('link')) {
                        handleEditLink();
                      } else {
                        handleCreateLink();
                      }
                    }}
                    sx={{
                      bgcolor: editor.isActive('link') ? 'grey.300' : 'transparent',
                      color: editor.isActive('link') ? 'black' : 'inherit',
                    }}
                  >
                    <Icon icon="mdi:link" />
                  </IconButton>
                </Tooltip>

                {/* Botón para quitar enlace (solo si hay enlace activo) */}
                {editor.isActive('link') && (
                  <Tooltip title="Quitar enlace">
                    <IconButton
                      size="small"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveLink();
                      }}
                      sx={{
                        color: 'error.main',
                        '&:hover': { bgcolor: 'error.50' },
                      }}
                    >
                      <Icon icon="mdi:link-off" />
                    </IconButton>
                  </Tooltip>
                )}

                {/* Separador para IA */}
                {showAIButton && <Box sx={{ width: 1, bgcolor: 'divider', mx: 0.5 }} />}

                {/* Botón de IA */}
                {showAIButton && (
                  <Tooltip title="Asistente de IA">
                    <IconButton
                      size="small"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAIClick();
                      }}
                      sx={{
                        color: 'primary.main',
                        '&:hover': { bgcolor: 'primary.lighter' },
                      }}
                    >
                      <Icon icon="mdi:magic-staff" />
                    </IconButton>
                  </Tooltip>
                )}
              </Paper>
            </BubbleMenu>

            {/* Diálogo para crear/editar enlaces */}
            <Dialog
              open={showLinkDialog}
              onClose={() => setShowLinkDialog(false)}
              maxWidth="sm"
              fullWidth
            >
              <DialogTitle onMouseDown={(e) => e.preventDefault()}>
                {editor?.isActive('link') ? 'Editar enlace' : 'Crear enlace'}
              </DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  margin="dense"
                  label="URL del enlace"
                  type="url"
                  fullWidth
                  variant="outlined"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://ejemplo.com"
                  helperText="Se agregará https:// automáticamente si no lo incluyes"
                />
              </DialogContent>
              <DialogActions>
                <Button
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setShowLinkDialog(false)}
                >
                  Cancelar
                </Button>
                <Button
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={handleApplyLink}
                  variant="contained"
                  disabled={!linkUrl.trim()}
                >
                  {editor?.isActive('link') ? 'Actualizar' : 'Crear enlace'}
                </Button>
              </DialogActions>
            </Dialog>

            {/* Popover para color picker de texto */}
            <Popover
              open={Boolean(colorAnchorEl)}
              anchorEl={colorAnchorEl}
              onClose={handleColorClose}
              disableRestoreFocus
              disableAutoFocus
              disableEnforceFocus
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
              PaperProps={{
                sx: {
                  p: 1,
                  borderRadius: 2,
                  boxShadow: 3,
                },
                onMouseDown: (e) => e.preventDefault(), // Prevenir blur del editor
                onClick: (e) => e.stopPropagation(),
              }}
            >
              <Box onMouseDown={(e) => e.preventDefault()}>
                <TextColorPicker
                  selectedColor={selectedTextColor}
                  applyTextColor={(color) => {
                    handleApplyTextColor(color);
                    handleColorClose();
                  }}
                />
              </Box>
            </Popover>

            {/* Popover para color picker de fondo (categorías) */}
            {showBackgroundColorPicker && (
              <Popover
                open={Boolean(bgColorAnchorEl)}
                anchorEl={bgColorAnchorEl}
                onClose={handleBgColorClose}
                disableRestoreFocus
                disableAutoFocus
                disableEnforceFocus
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
                PaperProps={{
                  sx: {
                    p: 1,
                    borderRadius: 2,
                    boxShadow: 3,
                  },
                  onMouseDown: (e) => e.preventDefault(), // Prevenir blur del editor
                  onClick: (e) => e.stopPropagation(),
                }}
              >
                <Box onMouseDown={(e) => e.preventDefault()}>
                  <TextColorPicker
                    selectedColor={selectedBgColor}
                    applyTextColor={(color) => {
                      handleApplyBgColor(color);
                      handleBgColorClose();
                    }}
                  />
                </Box>
              </Popover>
            )}

            {/* Modal de Asistente de IA */}
            <AIAssistantModal
              open={showAIModal}
              onClose={handleAIModalClose}
              selectedText={selectedTextHTML}
              onApply={handleApplyAIResult}
            />
          </>
        )}
      </Box>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      className,
      style,
      editorStyles,
      editor,
      isMounted,
      showLinkDialog,
      linkUrl,
      colorAnchorEl,
      selectedTextColor,
      bgColorAnchorEl,
      selectedBgColor,
      showBackgroundColorPicker,
      showAIModal,
      selectedTextHTML,
    ]
  );

  // Exponer el editor globalmente para acceso desde TextOptions
  useEffect(() => {
    if (editor) {
      (window as any).currentTipTapEditor = editor;
    }
    return () => {
      if ((window as any).currentTipTapEditor === editor) {
        (window as any).currentTipTapEditor = null;
      }
    };
  }, [editor]);

  // Sincronizar color de fondo con las props
  useEffect(() => {
    if (showBackgroundColorPicker && backgroundColor) {
      setSelectedBgColor(backgroundColor);
    }
  }, [backgroundColor, showBackgroundColorPicker]);

  // Sincronizar color de texto con las props (para categorías)
  useEffect(() => {
    if (onTextColorChange && style?.color) {
      setSelectedTextColor(style.color as string);
    }
  }, [style?.color, onTextColorChange]);

  // Actualizar color seleccionado cuando cambia la selección
  useEffect(() => {
    if (editor) {
      const updateSelectedColor = () => {
        const color = editor.getAttributes('textStyle').color || '#000000';
        setSelectedTextColor(color);
      };

      editor.on('selectionUpdate', updateSelectedColor);
      editor.on('transaction', updateSelectedColor);

      return () => {
        editor.off('selectionUpdate', updateSelectedColor);
        editor.off('transaction', updateSelectedColor);
      };
    }
    return undefined;
  }, [editor]);

  return editorContainer;
}

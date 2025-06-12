'use client';

// ⚡ ULTRA-OPTIMIZACIÓN: Importar CSS optimizado
import './tiptap-optimizations.css';

import type React from 'react';

import Color from '@tiptap/extension-color';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import TextAlign from '@tiptap/extension-text-align';
import FontFamily from '@tiptap/extension-font-family';
import { useEditor, EditorContent } from '@tiptap/react';
import { useRef, useMemo, useEffect, useCallback } from 'react';

import { Box } from '@mui/material';

interface SimpleTipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
  style?: React.CSSProperties;
  className?: string;
  placeholder?: string;
  onSelectionUpdate?: (editor: any) => void;
  showToolbar?: boolean;
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
}: SimpleTipTapEditorProps) {
  const editorRef = useRef<any>(null);
  const isUpdatingContent = useRef(false);
  const lastContent = useRef(content);

  // ⚡ ULTRA-OPTIMIZACIÓN: Memoizar extensiones con cache global
  const extensions = useMemo(() => getExtensions(), []);

  // ⚡ ULTRA-OPTIMIZACIÓN: Debouncing ultra-agresivo para onChange
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
      editorProps: {
        attributes: {
          class: className || 'tiptap-editor-optimized',
          placeholder,
          'data-placeholder': placeholder,
        },
        // ⚡ ULTRA-OPTIMIZACIÓN: Eventos pasivos para mejor rendimiento
        handleDOMEvents: {
          keydown: () => false, // Permitir que el navegador maneje los eventos
          input: () => false, // Reducir interferencias
        },
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
    }),
    [extensions, content, debouncedOnChange, throttledSelectionUpdate, className, placeholder]
  );

  const editor = useEditor(editorConfig);

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

  // ⚡ ULTRA-OPTIMIZACIÓN: Cleanup optimizado
  useEffect(
    () => () => {
      globalDebouncer.clear('content-change');
      globalDebouncer.clear('selection-update');
    },
    []
  );

  // ⚡ ULTRA-OPTIMIZACIÓN: Estilos memoizados con mejor especificidad
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
      '& .tiptap-paragraph': {
        margin: 0,
        padding: 0,
        display: 'block',
      },
      '& .tiptap-heading': {
        margin: 0,
        padding: 0,
        display: 'block',
      },
    }),
    [showToolbar]
  );

  // ⚡ ULTRA-OPTIMIZACIÓN: Memoización del contenedor
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
      >
        <EditorContent editor={editor} />
      </Box>
    ),
    [className, style, editorStyles, editor]
  );

  return editorContainer;
}

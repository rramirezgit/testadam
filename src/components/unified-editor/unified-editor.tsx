'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import React, { useMemo, useEffect, useCallback } from 'react';

import { styled } from '@mui/material/styles';
import { Box, FormHelperText } from '@mui/material';

import { EditorContext } from './context/editor-context';
import { UnifiedToolbar } from './components/unified-toolbar';
import { useEditorMetadata } from './hooks/use-editor-metadata';
import { useCombinedExtensions } from './hooks/use-extension-builder';
import { getMergedConfig, getVariantConfig } from './configs/variant-configs';

import type { OutputFormat, EditorMetadata, UnifiedEditorProps } from './types';

// Styled components
const EditorRoot = styled(Box, {
  shouldForwardProp: (prop) =>
    !['error', 'disabled', 'fullScreen', 'minHeight', 'maxHeight'].includes(prop as string),
})<{
  error?: boolean;
  disabled?: boolean;
  fullScreen?: boolean;
  minHeight?: number | string;
  maxHeight?: number | string;
}>(({ theme, error, disabled, fullScreen, minHeight, maxHeight }) => ({
  display: 'flex',
  flexDirection: 'column',
  // border: `1px solid ${error ? theme.palette.error.main : theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  // backgroundColor: disabled
  //   ? theme.palette.action.disabledBackground
  //   : theme.palette.background.paper,
  overflow: 'hidden',
  transition: theme.transitions.create(['border-color', 'box-shadow']),

  '&:focus-within': {
    borderColor: error ? theme.palette.error.main : theme.palette.primary.main,
    boxShadow: `0 0 0 2px ${
      error ? theme.palette.error.main + '25' : theme.palette.primary.main + '25'
    }`,
  },

  ...(fullScreen && {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: theme.zIndex.modal,
    borderRadius: 0,
    border: 'none',
  }),

  ...(minHeight && { minHeight }),
  ...(maxHeight && { maxHeight }),
}));

const EditorContentWrapper = styled(Box)(({ theme }) => ({
  flex: 1,
  overflow: 'auto',

  '& .ProseMirror': {
    outline: 'none',
    padding: theme.spacing(2),
    minHeight: 'inherit',

    '&.unified-editor-empty::before': {
      content: 'attr(data-placeholder)',
      color: theme.palette.text.disabled,
      pointerEvents: 'none',
      float: 'left',
      height: 0,
    },

    // Estilos para elementos del editor
    '& .unified-editor-heading': {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(1),
      fontWeight: theme.typography.fontWeightBold,

      '&:first-child': {
        marginTop: 0,
      },
    },

    '& .unified-editor-paragraph': {
      marginBottom: theme.spacing(1),

      '&:last-child': {
        marginBottom: 0,
      },
    },

    '& .unified-editor-bullet-list, & .unified-editor-ordered-list': {
      paddingLeft: theme.spacing(3),
      marginBottom: theme.spacing(1),
    },

    '& .unified-editor-blockquote': {
      borderLeft: `4px solid ${theme.palette.primary.main}`,
      paddingLeft: theme.spacing(2),
      marginLeft: 0,
      fontStyle: 'italic',
      color: theme.palette.text.secondary,
    },

    '& .unified-editor-link': {
      color: theme.palette.primary.main,
      textDecoration: 'underline',

      '&:hover': {
        textDecoration: 'none',
      },
    },

    '& .unified-editor-image': {
      maxWidth: '100%',
      height: 'auto',
      borderRadius: theme.shape.borderRadius,
      margin: theme.spacing(1, 0),
    },

    '& .unified-editor-hr': {
      border: 'none',
      borderTop: `1px solid ${theme.palette.divider}`,
      margin: theme.spacing(2, 0),
    },

    '& .unified-editor-code-block': {
      backgroundColor: theme.palette.grey[100],
      borderRadius: theme.shape.borderRadius,
      padding: theme.spacing(1),
      fontFamily: 'monospace',
      fontSize: '0.875rem',
      overflow: 'auto',

      '& pre': {
        margin: 0,
        padding: 0,
        backgroundColor: 'transparent',
      },
    },

    '& .unified-editor-table': {
      borderCollapse: 'collapse',
      width: '100%',
      margin: theme.spacing(1, 0),

      '& .unified-editor-table-cell, & .unified-editor-table-header': {
        // border: `1px solid ${theme.palette.divider}`,
        padding: theme.spacing(1),
        textAlign: 'left',
      },

      '& .unified-editor-table-header': {
        backgroundColor: theme.palette.grey[50],
        fontWeight: theme.typography.fontWeightBold,
      },
    },
  },
}));

export function UnifiedEditor({
  // Contenido
  value = '',
  defaultValue = '',
  placeholder = 'Escribe algo increíble...',

  // Configuración
  variant = 'standard',
  outputFormat = 'html',
  extensions: extensionOverrides,
  toolbar: toolbarOverrides,

  // Callbacks
  onChange,
  onSelectionUpdate,
  onBlur,
  onFocus,

  // Comportamiento
  editable = true,
  autoFocus = false,
  autoSave = false,
  autoSaveInterval = 2000,

  // Estilo y layout
  className,
  sx,
  style,
  minHeight = 200,
  maxHeight,
  fullScreen = false,

  // Especialización por componente
  componentType,
  headingLevel = 2,

  // Estados
  error = false,
  helperText,
  loading = false,

  // Avanzado
  customExtensions = [],

  ...other
}: UnifiedEditorProps) {
  // Función para formatear output
  const formatOutput = useCallback((editorInstance: any, format: OutputFormat): string => {
    switch (format) {
      case 'text':
        return editorInstance.getText();
      case 'both':
        return JSON.stringify({
          html: editorInstance.getHTML(),
          text: editorInstance.getText(),
        });
      case 'markdown':
        // TODO: Implementar conversión a markdown
        return editorInstance.getText();
      case 'html':
      default:
        return editorInstance.getHTML();
    }
  }, []);

  // Función para generar metadata
  const generateEditorMetadata = useCallback((editorInstance: any): EditorMetadata => {
    const htmlContent = editorInstance.getHTML();
    const textContent = editorInstance.getText();
    const wordCount = textContent.trim() ? textContent.trim().split(/\s+/).length : 0;

    return {
      htmlContent,
      textContent,
      wordCount,
      characterCount: textContent.length,
      readingTime: Math.ceil(wordCount / 225),
      isEmpty: editorInstance.isEmpty,
      hasImages: htmlContent.includes('<img'),
      hasLinks: htmlContent.includes('<a '),
      hasTables: htmlContent.includes('<table'),
    };
  }, []);

  // Obtener configuración final
  const config = useMemo(() => {
    const baseConfig = getVariantConfig(variant);
    return getMergedConfig(variant, {
      extensions: extensionOverrides,
      toolbar: toolbarOverrides,
      outputFormat: outputFormat !== 'html' ? outputFormat : undefined,
    });
  }, [variant, extensionOverrides, toolbarOverrides, outputFormat]);

  // Construir extensiones
  const extensions = useCombinedExtensions(config.extensions, placeholder, customExtensions);

  // Crear instancia del editor
  const editor = useEditor({
    extensions,
    content: value || defaultValue,
    editable,
    autofocus: autoFocus,
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,

    onUpdate: ({ editor: editorInstance }) => {
      if (!onChange) return;

      const editorMetadata = generateEditorMetadata(editorInstance);
      const output = formatOutput(editorInstance, config.outputFormat);

      onChange(output, editorMetadata);
    },

    onSelectionUpdate: ({ editor: editorInstance }) => {
      if (onSelectionUpdate) {
        onSelectionUpdate(editorInstance);
      }
    },

    onBlur: ({ editor: editorInstance }) => {
      if (onBlur) {
        onBlur(editorInstance);
      }
    },

    onFocus: ({ editor: editorInstance }) => {
      if (onFocus) {
        onFocus(editorInstance);
      }
    },

    ...other,
  });

  // Metadata del editor
  const editorMetadata = useEditorMetadata(editor);

  // Sincronizar contenido externo
  useEffect(() => {
    if (editor && value !== undefined && value !== editor.getHTML()) {
      editor.commands.setContent(value, false);
    }
  }, [editor, value]);

  // Auto-save
  useEffect(() => {
    if (!autoSave || !editor || !onChange) return;

    const interval = setInterval(() => {
      if (editor.isEmpty) return;

      const autoSaveMetadata = generateEditorMetadata(editor);
      const output = formatOutput(editor, config.outputFormat);
      onChange(output, autoSaveMetadata);
    }, autoSaveInterval);

    return function cleanup() {
      clearInterval(interval);
    };
  }, [
    autoSave,
    autoSaveInterval,
    editor,
    onChange,
    config.outputFormat,
    formatOutput,
    generateEditorMetadata,
  ]);

  // Aplicar especialización por componente
  useEffect(() => {
    if (!editor || !componentType) return;

    switch (componentType) {
      case 'heading':
        if (headingLevel >= 1 && headingLevel <= 6) {
          editor.commands.toggleHeading({ level: headingLevel as any });
        }
        break;
      case 'paragraph':
        editor.commands.setParagraph();
        break;
      default:
        break;
    }
  }, [editor, componentType, headingLevel]);

  // Context value
  const contextValue = useMemo(
    () => ({
      editor,
      variant,
      isLoading: loading,
      metadata: editorMetadata,
    }),
    [editor, variant, loading, editorMetadata]
  );

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight,
          ...sx,
        }}
        className={className}
        style={style}
      >
        Cargando editor...
      </Box>
    );
  }

  return (
    <EditorContext.Provider value={contextValue}>
      <Box sx={sx} className={className} style={style}>
        <EditorRoot
          error={error}
          disabled={!editable}
          fullScreen={fullScreen}
          minHeight={minHeight}
          maxHeight={maxHeight}
        >
          {config.toolbar.enabled && (
            <UnifiedToolbar editor={editor} config={config.toolbar} variant={variant} />
          )}

          <EditorContentWrapper>
            <EditorContent editor={editor} />
          </EditorContentWrapper>
        </EditorRoot>

        {helperText && (
          <FormHelperText error={error} sx={{ mt: 1 }}>
            {helperText}
          </FormHelperText>
        )}
      </Box>
    </EditorContext.Provider>
  );
}

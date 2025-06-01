import { useMemo } from 'react';
// Extensiones de contenido
import Link from '@tiptap/extension-link';
// Extensiones de formato
import Color from '@tiptap/extension-color';
import Image from '@tiptap/extension-image';
// Extensiones de tabla
import Table from '@tiptap/extension-table';
// Tiptap core
import StarterKit from '@tiptap/starter-kit';
import Youtube from '@tiptap/extension-youtube';
import Heading from '@tiptap/extension-heading';
import { common, createLowlight } from 'lowlight';
import TableRow from '@tiptap/extension-table-row';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import TextAlign from '@tiptap/extension-text-align';
import TableCell from '@tiptap/extension-table-cell';
import Blockquote from '@tiptap/extension-blockquote';
import FontFamily from '@tiptap/extension-font-family';
import BulletList from '@tiptap/extension-bullet-list';
import Placeholder from '@tiptap/extension-placeholder';
import TableHeader from '@tiptap/extension-table-header';
import OrderedList from '@tiptap/extension-ordered-list';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
// Extensiones de código
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';

import type { ExtensionConfig } from '../types';

export function useExtensionBuilder(config: ExtensionConfig, placeholder?: string) {
  const lowlight = useMemo(() => createLowlight(common), []);

  const extensions = useMemo(() => {
    const extensionList: any[] = [];

    // StarterKit base - configurado según necesidades
    extensionList.push(
      StarterKit.configure({
        // Deshabilitar extensiones que se configuran individualmente
        heading: false,
        bulletList: false,
        orderedList: false,
        blockquote: false,
        horizontalRule: false,
        codeBlock: false, // Siempre false, se configura con CodeBlockLowlight
        code: config.codeInline === false ? false : undefined,

        paragraph: {
          HTMLAttributes: {
            class: 'unified-editor-paragraph',
          },
        },
      })
    );

    // Placeholder
    if (config.placeholder && placeholder) {
      extensionList.push(
        Placeholder.configure({
          placeholder,
          emptyEditorClass: 'unified-editor-empty',
        })
      );
    }

    // Headings
    if (config.heading) {
      const headingLevels =
        typeof config.heading === 'object'
          ? (config.heading.levels as [1, 2, 3, 4, 5, 6])
          : ([1, 2, 3, 4, 5, 6] as [1, 2, 3, 4, 5, 6]);

      extensionList.push(
        Heading.configure({
          levels: headingLevels,
          HTMLAttributes: {
            class: 'unified-editor-heading',
          },
        })
      );
    }

    // Lists
    if (config.bulletList) {
      extensionList.push(
        BulletList.configure({
          HTMLAttributes: {
            class: 'unified-editor-bullet-list',
          },
        })
      );
    }

    if (config.orderedList) {
      extensionList.push(
        OrderedList.configure({
          HTMLAttributes: {
            class: 'unified-editor-ordered-list',
          },
        })
      );
    }

    // Blockquote
    if (config.blockquote) {
      extensionList.push(
        Blockquote.configure({
          HTMLAttributes: {
            class: 'unified-editor-blockquote',
          },
        })
      );
    }

    // Horizontal Rule
    if (config.horizontalRule) {
      extensionList.push(
        HorizontalRule.configure({
          HTMLAttributes: {
            class: 'unified-editor-hr',
          },
        })
      );
    }

    // Formato de texto
    if (config.underline) {
      extensionList.push(Underline);
    }

    // Colores y estilos de texto
    if (config.textColor || config.fontFamily) {
      extensionList.push(TextStyle);
    }

    if (config.textColor) {
      extensionList.push(Color);
    }

    if (config.fontFamily) {
      extensionList.push(FontFamily);
    }

    // Alineación de texto
    if (config.textAlign) {
      extensionList.push(
        TextAlign.configure({
          types: ['heading', 'paragraph'],
        })
      );
    }

    // Enlaces
    if (config.link) {
      extensionList.push(
        Link.configure({
          autolink: true,
          openOnClick: false,
          HTMLAttributes: {
            class: 'unified-editor-link',
            rel: 'noopener noreferrer',
            target: '_blank',
          },
        })
      );
    }

    // Imágenes
    if (config.image) {
      extensionList.push(
        Image.configure({
          inline: false,
          allowBase64: true,
          HTMLAttributes: {
            class: 'unified-editor-image',
          },
        })
      );
    }

    // YouTube
    if (config.youtube) {
      extensionList.push(
        Youtube.configure({
          inline: false,
          width: 640,
          height: 480,
          HTMLAttributes: {
            class: 'unified-editor-youtube',
          },
        })
      );
    }

    // Código con highlighting
    if (config.codeBlock && config.codeHighlight) {
      extensionList.push(
        CodeBlockLowlight.configure({
          lowlight,
          HTMLAttributes: {
            class: 'unified-editor-code-block',
          },
        })
      );
    } else if (config.codeBlock) {
      // Code block simple sin highlighting
      extensionList.push(
        StarterKit.configure({
          codeBlock: {
            HTMLAttributes: {
              class: 'unified-editor-code-block',
            },
          },
        }).options.codeBlock
      );
    }

    // Tablas
    if (config.table) {
      extensionList.push(
        Table.configure({
          resizable: true,
          HTMLAttributes: {
            class: 'unified-editor-table',
          },
        }),
        TableRow.configure({
          HTMLAttributes: {
            class: 'unified-editor-table-row',
          },
        }),
        TableHeader.configure({
          HTMLAttributes: {
            class: 'unified-editor-table-header',
          },
        }),
        TableCell.configure({
          HTMLAttributes: {
            class: 'unified-editor-table-cell',
          },
        })
      );
    }

    return extensionList.filter(Boolean);
  }, [config, placeholder, lowlight]);

  return extensions;
}

// Hook para obtener extensiones personalizadas adicionales
export function useCustomExtensions(customExtensions?: any[]) {
  return useMemo(() => customExtensions || [], [customExtensions]);
}

// Hook principal que combina extensiones base + personalizadas
export function useCombinedExtensions(
  config: ExtensionConfig,
  placeholder?: string,
  customExtensions?: any[]
) {
  const baseExtensions = useExtensionBuilder(config, placeholder);
  const customExt = useCustomExtensions(customExtensions);

  return useMemo(() => [...baseExtensions, ...customExt], [baseExtensions, customExt]);
}

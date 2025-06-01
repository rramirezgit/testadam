'use client';

import type { Editor } from '@tiptap/react';

import React from 'react';
import { Icon } from '@iconify/react';

import { Box, Divider, Tooltip, IconButton, ToggleButton, ToggleButtonGroup } from '@mui/material';

import type { ToolbarGroup, ToolbarConfig, EditorVariant } from '../types';

interface UnifiedToolbarProps {
  editor: Editor | null;
  config: ToolbarConfig;
  variant: EditorVariant;
}

export function UnifiedToolbar({ editor, config, variant }: UnifiedToolbarProps) {
  if (!editor || !config.enabled) return null;

  const renderToolbarGroup = (group: ToolbarGroup) => {
    switch (group) {
      case 'format':
        return (
          <ToggleButtonGroup key={group} size="small">
            <ToggleButton
              value="bold"
              selected={editor.isActive('bold')}
              onClick={() => editor.chain().focus().toggleBold().run()}
              disabled={!editor.can().chain().focus().toggleBold().run()}
            >
              <Icon icon="mdi:format-bold" />
            </ToggleButton>
            <ToggleButton
              value="italic"
              selected={editor.isActive('italic')}
              onClick={() => editor.chain().focus().toggleItalic().run()}
              disabled={!editor.can().chain().focus().toggleItalic().run()}
            >
              <Icon icon="mdi:format-italic" />
            </ToggleButton>
            <ToggleButton
              value="underline"
              selected={editor.isActive('underline')}
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              disabled={!editor.can().chain().focus().toggleUnderline().run()}
            >
              <Icon icon="mdi:format-underline" />
            </ToggleButton>
            <ToggleButton
              value="strike"
              selected={editor.isActive('strike')}
              onClick={() => editor.chain().focus().toggleStrike().run()}
              disabled={!editor.can().chain().focus().toggleStrike().run()}
            >
              <Icon icon="mdi:format-strikethrough" />
            </ToggleButton>
          </ToggleButtonGroup>
        );

      case 'align':
        return (
          <ToggleButtonGroup key={group} size="small" exclusive>
            <ToggleButton
              value="left"
              selected={editor.isActive({ textAlign: 'left' })}
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
            >
              <Icon icon="mdi:format-align-left" />
            </ToggleButton>
            <ToggleButton
              value="center"
              selected={editor.isActive({ textAlign: 'center' })}
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
            >
              <Icon icon="mdi:format-align-center" />
            </ToggleButton>
            <ToggleButton
              value="right"
              selected={editor.isActive({ textAlign: 'right' })}
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
            >
              <Icon icon="mdi:format-align-right" />
            </ToggleButton>
            <ToggleButton
              value="justify"
              selected={editor.isActive({ textAlign: 'justify' })}
              onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            >
              <Icon icon="mdi:format-align-justify" />
            </ToggleButton>
          </ToggleButtonGroup>
        );

      case 'list':
        return (
          <ToggleButtonGroup key={group} size="small">
            <ToggleButton
              value="bulletList"
              selected={editor.isActive('bulletList')}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              <Icon icon="mdi:format-list-bulleted" />
            </ToggleButton>
            <ToggleButton
              value="orderedList"
              selected={editor.isActive('orderedList')}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
              <Icon icon="mdi:format-list-numbered" />
            </ToggleButton>
          </ToggleButtonGroup>
        );

      case 'structure':
        return (
          <ToggleButtonGroup key={group} size="small">
            <ToggleButton
              value="h1"
              selected={editor.isActive('heading', { level: 1 })}
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            >
              H1
            </ToggleButton>
            <ToggleButton
              value="h2"
              selected={editor.isActive('heading', { level: 2 })}
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            >
              H2
            </ToggleButton>
            <ToggleButton
              value="h3"
              selected={editor.isActive('heading', { level: 3 })}
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            >
              H3
            </ToggleButton>
            <ToggleButton
              value="blockquote"
              selected={editor.isActive('blockquote')}
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
            >
              <Icon icon="mdi:format-quote-close" />
            </ToggleButton>
          </ToggleButtonGroup>
        );

      case 'insert':
        return (
          <Box key={group} sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="Insertar enlace">
              <IconButton
                size="small"
                onClick={() => {
                  const url = window.prompt('URL del enlace:');
                  if (url) {
                    editor.chain().focus().setLink({ href: url }).run();
                  }
                }}
              >
                <Icon icon="mdi:link" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Insertar imagen">
              <IconButton
                size="small"
                onClick={() => {
                  const url = window.prompt('URL de la imagen:');
                  if (url) {
                    editor.chain().focus().setImage({ src: url }).run();
                  }
                }}
              >
                <Icon icon="mdi:image" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Insertar línea horizontal">
              <IconButton
                size="small"
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
              >
                <Icon icon="mdi:minus" />
              </IconButton>
            </Tooltip>
          </Box>
        );

      case 'history':
        return (
          <Box key={group} sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="Deshacer">
              <IconButton
                size="small"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().chain().focus().undo().run()}
              >
                <Icon icon="mdi:undo" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Rehacer">
              <IconButton
                size="small"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().chain().focus().redo().run()}
              >
                <Icon icon="mdi:redo" />
              </IconButton>
            </Tooltip>
          </Box>
        );

      case 'color':
        return (
          <Box key={group} sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="Color del texto">
              <IconButton
                size="small"
                onClick={() => {
                  const color = window.prompt('Color (hex, rgb, o nombre):');
                  if (color) {
                    editor.chain().focus().setColor(color).run();
                  }
                }}
              >
                <Icon icon="mdi:format-color-text" />
              </IconButton>
            </Tooltip>
          </Box>
        );

      case 'table':
        return (
          <Box key={group} sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="Insertar tabla">
              <IconButton
                size="small"
                onClick={() => {
                  editor
                    .chain()
                    .focus()
                    .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                    .run();
                }}
              >
                <Icon icon="mdi:table" />
              </IconButton>
            </Tooltip>
          </Box>
        );

      case 'code':
        return (
          <ToggleButtonGroup key={group} size="small">
            <ToggleButton
              value="code"
              selected={editor.isActive('code')}
              onClick={() => editor.chain().focus().toggleCode().run()}
            >
              <Icon icon="mdi:code-tags" />
            </ToggleButton>
            <ToggleButton
              value="codeBlock"
              selected={editor.isActive('codeBlock')}
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            >
              <Icon icon="mdi:code-block-tags" />
            </ToggleButton>
          </ToggleButtonGroup>
        );

      case 'view':
        return (
          <Box key={group} sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="Vista previa">
              <IconButton size="small">
                <Icon icon="mdi:eye" />
              </IconButton>
            </Tooltip>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        p: 1,
        borderBottom: 1,
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        flexWrap: 'wrap',
        ...(config.sticky && {
          position: 'sticky',
          top: 0,
          zIndex: 1,
        }),
      }}
    >
      {config.groups?.map((group, index) => (
        <React.Fragment key={group}>
          {renderToolbarGroup(group)}
          {index < (config.groups?.length || 0) - 1 && <Divider orientation="vertical" flexItem />}
        </React.Fragment>
      ))}

      {config.customTools && (
        <>
          <Divider orientation="vertical" flexItem />
          {config.customTools}
        </>
      )}
    </Box>
  );
}

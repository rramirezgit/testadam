'use client';

import type React from 'react';
import type { SavedNote } from 'src/types/saved-note';

import { useState } from 'react';
import { format } from 'date-fns';
import { Icon } from '@iconify/react';

import {
  Box,
  Card,
  Chip,
  Menu,
  MenuItem,
  Typography,
  IconButton,
  CardContent,
  CardActionArea,
} from '@mui/material';

interface SavedNoteCardProps {
  note: SavedNote;
  onOpen: (note: SavedNote) => void;
  onDelete: (noteId: string) => void;
}

export default function SavedNoteCard({ note, onOpen, onDelete }: SavedNoteCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (event?: React.MouseEvent<HTMLElement>) => {
    if (event) {
      event.stopPropagation();
    }
    setAnchorEl(null);
  };

  const handleDelete = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    onDelete(note.id);
    handleMenuClose();
  };

  // Get a preview of the note content
  const getContentPreview = () => {
    try {
      const objData = JSON.parse(note.objData);
      if (!objData || objData.length === 0) return 'Empty note';

      // Find the first paragraph or heading
      const firstTextItem = objData.find(
        (item: any) => item.type === 'paragraph' || item.type === 'heading'
      );

      if (firstTextItem) {
        const text = String(firstTextItem.content || '');
        return text.length > 100 ? `${text.substring(0, 100)}...` : text;
      }

      return 'No text content';
    } catch {
      return 'Error parsing note content';
    }
  };

  // Count components by type
  const getComponentCounts = () => {
    try {
      const objData = JSON.parse(note.objData);
      if (!objData) return {};

      return objData.reduce(
        (acc: any, item: any) => {
          acc[item.type] = (acc[item.type] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );
    } catch {
      return {};
    }
  };

  const componentCounts = getComponentCounts();

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
        },
      }}
    >
      <CardActionArea
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          height: '100%',
        }}
        onClick={() => onOpen(note)}
      >
        <Box
          sx={{
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid rgba(0,0,0,0.08)',
          }}
        >
          <Typography variant="h6" component="div" noWrap sx={{ maxWidth: '80%' }}>
            {note.title || 'Untitled Note'}
          </Typography>
          <IconButton size="small" onClick={handleMenuClick} sx={{ ml: 'auto' }}>
            <Icon icon="mdi:dots-vertical" />
          </IconButton>
        </Box>

        <CardContent sx={{ flexGrow: 1, pt: 2 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              height: '4.5em',
            }}
          >
            {getContentPreview()}
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {Object.entries(componentCounts).map(([type, count]) => (
              <Chip
                key={type}
                size="small"
                label={`${count} ${type}${Number(count) > 1 ? 's' : ''}`}
                icon={
                  <Icon
                    icon={
                      type === 'heading'
                        ? 'mdi:format-header-1'
                        : type === 'paragraph'
                          ? 'mdi:format-paragraph'
                          : type === 'button'
                            ? 'mdi:button-cursor'
                            : type === 'image'
                              ? 'mdi:image'
                              : type === 'divider'
                                ? 'mdi:minus'
                                : 'mdi:code-tags'
                    }
                    width={16}
                  />
                }
              />
            ))}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 'auto', pt: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Template:{' '}
              {(() => {
                try {
                  const configNote = JSON.parse(note.configNote);
                  return configNote.templateType || 'Custom';
                } catch {
                  return 'Custom';
                }
              })()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {(() => {
                try {
                  const configNote = JSON.parse(note.configNote);
                  return configNote.dateCreated
                    ? format(new Date(configNote.dateCreated), 'MMM d, yyyy')
                    : '';
                } catch {
                  return '';
                }
              })()}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => handleMenuClose()}
        onClick={(e) => e.stopPropagation()}
      >
        <MenuItem
          onClick={() => {
            handleMenuClose();
            onOpen(note);
          }}
        >
          <Icon icon="mdi:pencil" style={{ marginRight: 8 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <Icon icon="mdi:delete" style={{ marginRight: 8 }} />
          Delete
        </MenuItem>
      </Menu>
    </Card>
  );
}

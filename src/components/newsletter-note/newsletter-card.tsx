'use client';

import type React from 'react';
import type { Newsletter } from 'src/types/newsletter';

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

interface NewsletterCardProps {
  newsletter: Newsletter;
  onOpen: (newsletter: Newsletter) => void;
  onDelete: (newsletterId: string) => void;
}

export default function NewsletterCard({ newsletter, onOpen, onDelete }: NewsletterCardProps) {
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
    onDelete(newsletter.id);
    handleMenuClose();
  };

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
        onClick={() => onOpen(newsletter)}
      >
        <Box
          sx={{
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid rgba(0,0,0,0.08)',
            backgroundColor: newsletter.accentColor || '#3f51b5',
            color: 'white',
          }}
        >
          <Typography variant="h6" component="div" noWrap sx={{ maxWidth: '80%' }}>
            {newsletter.title || 'Untitled Newsletter'}
          </Typography>
          <IconButton size="small" onClick={handleMenuClick} sx={{ ml: 'auto', color: 'white' }}>
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
            {newsletter.description || 'No description provided.'}
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            <Chip
              size="small"
              label={`${newsletter.notes.length} note${newsletter.notes.length !== 1 ? 's' : ''}`}
              icon={<Icon icon="mdi:note-multiple" width={16} />}
            />
            <Chip
              size="small"
              label="Newsletter"
              icon={<Icon icon="mdi:email-newsletter" width={16} />}
              color="primary"
            />
          </Box>

          {newsletter.notes.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                Included notes:
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                {newsletter.notes.slice(0, 3).map((note, index) => (
                  <Box
                    key={note.noteId}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      p: 1,
                      borderRadius: 1,
                      backgroundColor: 'rgba(0,0,0,0.03)',
                    }}
                  >
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        backgroundColor: 'primary.main',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        mr: 1,
                      }}
                    >
                      {index + 1}
                    </Box>
                    <Typography variant="body2" noWrap sx={{ flex: 1 }}>
                      {note.noteData.title || 'Untitled Note'}
                    </Typography>
                  </Box>
                ))}
                {newsletter.notes.length > 3 && (
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                    +{newsletter.notes.length - 3} more notes
                  </Typography>
                )}
              </Box>
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 'auto', pt: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Created:{' '}
              {newsletter.dateCreated
                ? format(new Date(newsletter.dateCreated), 'MMM d, yyyy')
                : ''}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Modified:{' '}
              {newsletter.dateModified
                ? format(new Date(newsletter.dateModified), 'MMM d, yyyy')
                : ''}
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
            onOpen(newsletter);
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

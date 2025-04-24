'use client';

import type { NewsletterNote } from 'src/types/newsletter';

import { Icon } from '@iconify/react';

import {
  Box,
  Chip,
  Card,
  Grid,
  Paper,
  Button,
  Divider,
  CardMedia,
  Typography,
  IconButton,
  CardContent,
  CardActionArea,
} from '@mui/material';

import type { SidebarProps } from './types';

export default function Sidebar({
  sidebarTab,
  setSidebarTab,
  selectedNotes,
  notes,
  handleAddNote,
  handleRemoveNote,
  handleEditNote,
  handleCreateNewNote,
  activeTab,
  onSelectHeader,
  onSelectFooter,
  currentHeader,
  currentFooter,
}: SidebarProps) {
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
    {
      id: 'classic',
      name: 'Clásico',
      preview: '/assets/headers/classic-preview.jpg',
      description: 'Header clásico con logo y título',
      template: {
        title: 'Newsletter Title',
        subtitle: 'Your weekly newsletter',
        logo: '/assets/logo.png',
        bannerImage: '',
        backgroundColor: '#3f51b5',
        textColor: '#ffffff',
        alignment: 'center',
        showGradient: false,
      },
    },
    {
      id: 'minimal',
      name: 'Minimalista',
      preview: '/assets/headers/minimal-preview.jpg',
      description: 'Header minimalista con solo texto',
      template: {
        title: 'Newsletter Title',
        subtitle: 'Your weekly newsletter',
        logo: '',
        bannerImage: '',
        backgroundColor: '#ffffff',
        textColor: '#000000',
        alignment: 'left',
        showGradient: false,
      },
    },
    {
      id: 'banner',
      name: 'Banner Completo',
      preview: '/assets/headers/banner-preview.jpg',
      description: 'Header con imagen de banner completa',
      template: {
        title: 'Newsletter Title',
        subtitle: 'Your weekly newsletter',
        logo: '',
        bannerImage: '/assets/banner-full.jpg',
        backgroundColor: '#ffffff',
        textColor: '#ffffff',
        alignment: 'center',
        showGradient: false,
      },
    },
    {
      id: 'corporate',
      name: 'Corporativo',
      preview: '/assets/headers/corporate-preview.jpg',
      description: 'Header corporativo con logo y colores sobrios',
      template: {
        title: 'Newsletter Title',
        subtitle: 'Your weekly newsletter',
        logo: '/assets/logo.png',
        bannerImage: '',
        backgroundColor: '#f5f5f5',
        textColor: '#333333',
        alignment: 'center',
        showGradient: false,
      },
    },
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
    {
      id: 'minimal',
      name: 'Minimalista',
      preview: '/assets/footers/minimal-preview.jpg',
      description: 'Footer minimalista con solo lo esencial',
      template: {
        companyName: 'Your Company',
        address: '',
        contactEmail: 'contact@example.com',
        socialLinks: [],
        unsubscribeLink: '#unsubscribe',
        backgroundColor: '#ffffff',
        textColor: '#999999',
      },
    },
    {
      id: 'dark',
      name: 'Oscuro',
      preview: '/assets/footers/dark-preview.jpg',
      description: 'Footer con fondo oscuro y texto claro',
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
        backgroundColor: '#333333',
        textColor: '#ffffff',
      },
    },
    {
      id: 'colorful',
      name: 'Colorido',
      preview: '/assets/footers/colorful-preview.jpg',
      description: 'Footer con colores vibrantes',
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
        backgroundColor: '#4158D0',
        textColor: '#ffffff',
      },
    },
    {
      id: 'corporate',
      name: 'Corporativo',
      preview: '/assets/footers/corporate-preview.jpg',
      description: 'Footer corporativo con diseño profesional',
      template: {
        companyName: 'Your Company',
        address: '123 Main St, City, Country',
        contactEmail: 'contact@example.com',
        socialLinks: [
          { platform: 'twitter', url: 'https://twitter.com' },
          { platform: 'facebook', url: 'https://facebook.com' },
          { platform: 'linkedin', url: 'https://linkedin.com' },
        ],
        unsubscribeLink: '#unsubscribe',
        backgroundColor: '#f5f5f5',
        textColor: '#333333',
      },
    },
    {
      id: 'gradient',
      name: 'Gradiente',
      preview: '/assets/footers/gradient-preview.jpg',
      description: 'Footer con fondo de gradiente y texto claro',
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
        backgroundColor: '#ffffff',
        textColor: '#ffffff',
        showGradient: true,
        gradientColors: ['#4158D0', '#C850C0'],
      },
    },
  ];

  // Mostrar el tab de templates solo cuando estamos en la sección de diseño
  const showTemplatesTab = activeTab === 'design';

  return (
    <Box sx={{ width: 280, borderRight: '1px solid rgba(0, 0, 0, 0.12)' }}>
      <Box sx={{ display: 'flex', borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
        <Button
          variant={sidebarTab === 'notes' ? 'contained' : 'text'}
          onClick={() => setSidebarTab('notes')}
          sx={{ flex: 1, borderRadius: 0, py: 1 }}
        >
          NOTES
        </Button>
        <Button
          variant={sidebarTab === 'create' ? 'contained' : 'text'}
          onClick={() => setSidebarTab('create')}
          sx={{ flex: 1, borderRadius: 0, py: 1 }}
        >
          CREATE
        </Button>
        {activeTab === 'design' && (
          <Button
            variant={sidebarTab === 'templates' ? 'contained' : 'text'}
            onClick={() => setSidebarTab('templates')}
            sx={{ flex: 1, borderRadius: 0, py: 1 }}
          >
            TEMPLATES
          </Button>
        )}
      </Box>

      {sidebarTab === 'notes' && (
        <Box sx={{ p: 2, height: 'calc(100% - 48px)', overflow: 'auto' }}>
          <Typography variant="subtitle1" gutterBottom>
            Selected Notes ({selectedNotes.length})
          </Typography>
          {selectedNotes.length > 0 ? (
            <Box sx={{ mb: 3 }}>
              {selectedNotes.map((note) => (
                <Paper
                  key={note.noteId}
                  variant="outlined"
                  sx={{ mb: 1, p: 1.5, position: 'relative' }}
                >
                  <Box sx={{ pr: 6 }}>
                    <Typography variant="body2" fontWeight="medium" noWrap>
                      {note.noteData.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {new Date(
                        note.noteData.dateModified || note.noteData.dateCreated
                      ).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                    <IconButton size="small" onClick={() => handleEditNote(note.noteData)}>
                      <Icon icon="mdi:pencil" width={16} />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleRemoveNote(note.noteId)}>
                      <Icon icon="mdi:close" width={16} />
                    </IconButton>
                  </Box>
                </Paper>
              ))}
            </Box>
          ) : (
            <Paper sx={{ p: 2, textAlign: 'center', mb: 3 }}>
              <Typography variant="body2" color="text.secondary">
                No notes selected yet
              </Typography>
            </Paper>
          )}

          <Divider sx={{ my: 2 }} />

          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
          >
            <Typography variant="subtitle1">Available Notes</Typography>
            <Button size="small" startIcon={<Icon icon="mdi:plus" />} onClick={handleCreateNewNote}>
              New
            </Button>
          </Box>

          {notes.length > 0 ? (
            <Box>
              {notes
                .filter((note) => !selectedNotes.some((selected) => selected.noteId === note.id))
                .map((note) => (
                  <Paper
                    key={note.id}
                    variant="outlined"
                    sx={{ mb: 1, p: 1.5, position: 'relative', cursor: 'pointer' }}
                    onClick={() => {
                      const newNote: NewsletterNote = {
                        noteId: note.id,
                        order: selectedNotes.length,
                        noteData: note,
                      };
                      handleAddNote(newNote);
                    }}
                  >
                    <Box>
                      <Typography variant="body2" fontWeight="medium" noWrap>
                        {note.title}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(note.dateModified || note.dateCreated).toLocaleDateString()}
                        </Typography>
                        <Chip
                          size="small"
                          label={note.templateType}
                          sx={{ height: 18, fontSize: '0.625rem' }}
                        />
                      </Box>
                    </Box>
                  </Paper>
                ))}
            </Box>
          ) : (
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                No notes available
              </Typography>
            </Paper>
          )}
        </Box>
      )}

      {sidebarTab === 'create' && (
        <Box sx={{ p: 2, height: 'calc(100% - 48px)', overflow: 'auto' }}>
          <Typography variant="h6" gutterBottom>
            Create New Note
          </Typography>
          <Button
            variant="contained"
            fullWidth
            startIcon={<Icon icon="mdi:plus" />}
            onClick={handleCreateNewNote}
            sx={{ mb: 2 }}
          >
            Create Note
          </Button>
          <Typography variant="body2" color="text.secondary">
            Create a new note to add to your newsletter. You can use any of the available templates
            or start from scratch.
          </Typography>
        </Box>
      )}

      {sidebarTab === 'templates' && (
        <Box sx={{ p: 2, height: 'calc(100% - 48px)', overflow: 'auto' }}>
          <Typography variant="h6" gutterBottom>
            Header Templates
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Select a header template for your newsletter
          </Typography>

          <Grid container spacing={2}>
            {availableHeaders.map((header) => (
              <Grid item xs={12} key={header.id}>
                <Card
                  variant="outlined"
                  sx={{
                    mb: 1,
                    border:
                      currentHeader?.id === header.id
                        ? '2px solid #3f51b5'
                        : '1px solid rgba(0, 0, 0, 0.12)',
                  }}
                >
                  <CardActionArea onClick={() => onSelectHeader && onSelectHeader(header)}>
                    <CardMedia
                      component="img"
                      height="100"
                      image={header.preview}
                      alt={header.name}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent sx={{ p: 1 }}>
                      <Typography variant="subtitle2" noWrap>
                        {header.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" noWrap>
                        {header.description}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Footer Templates
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Select a footer template for your newsletter
          </Typography>

          <Grid container spacing={2}>
            {availableFooters.map((footer) => (
              <Grid item xs={12} key={footer.id}>
                <Card
                  variant="outlined"
                  sx={{
                    mb: 1,
                    border:
                      currentFooter?.id === footer.id
                        ? '2px solid #3f51b5'
                        : '1px solid rgba(0, 0, 0, 0.12)',
                  }}
                >
                  <CardActionArea onClick={() => onSelectFooter && onSelectFooter(footer)}>
                    <CardMedia
                      component="img"
                      height="80"
                      image={footer.preview}
                      alt={footer.name}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent sx={{ p: 1 }}>
                      <Typography variant="subtitle2" noWrap>
                        {footer.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" noWrap>
                        {footer.description}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
}

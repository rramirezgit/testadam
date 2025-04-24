import axios from 'axios';
import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';

// Interfaz para los resultados de búsqueda de iconos
interface IconifyResult {
  prefix: string;
  name: string;
  icons: string[];
}

interface IconPickerProps {
  open: boolean;
  onClose: () => void;
  onSelectIcon: (iconName: string) => void;
  currentIcon?: string;
}

// Colección de iconos populares para mostrar inicialmente
const POPULAR_ICONS = [
  'mdi:text-box-outline',
  'mdi:information-outline',
  'mdi:star-outline',
  'mdi:check-circle-outline',
  'mdi:alert-circle-outline',
  'mdi:clipboard-text-outline',
  'mdi:note-outline',
  'mdi:book-open-outline',
  'mdi:lightbulb-outline',
  'mdi:heart-outline',
  'mdi:calendar-outline',
  'mdi:thumb-up-outline',
  'mdi:account-outline',
  'mdi:message-outline',
  'mdi:email-outline',
  'mdi:phone-outline',
  'mdi:map-marker-outline',
  'mdi:clock-outline',
  'mdi:cog-outline',
  'mdi:bell-outline',
  'mdi:tag-outline',
  'mdi:link-variant',
  'mdi:file-document-outline',
  'mdi:chart-bar',
  'mdi:download',
  'mdi:upload',
  'mdi:share-variant',
  'mdi:eye-outline',
  'mdi:refresh',
  'mdi:shield-outline',
  'solar:verified-check-bold',
  'solar:clock-circle-bold',
  'solar:shield-check-bold',
];

export default function IconPicker({ open, onClose, onSelectIcon, currentIcon }: IconPickerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [selectedIconColor, setSelectedIconColor] = useState('#000000');
  const [iconSize, setIconSize] = useState(24);
  const [error, setError] = useState('');

  // Cuando se abre el selector, si hay un icono actual, extraer su color y tamaño
  useEffect(() => {
    if (open && currentIcon) {
      setSearchTerm('');
      setSearchResults([]);
    }
  }, [open, currentIcon]);

  // Función para buscar iconos en la API de Iconify
  const searchIcons = async (query: string) => {
    if (!query.trim()) {
      setSearchResults(POPULAR_ICONS);
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      // Usar la API pública de Iconify para buscar iconos
      const response = await axios.get(
        `https://api.iconify.design/search?query=${encodeURIComponent(query)}&limit=100`
      );

      if (response.data && response.data.icons) {
        // Formatear los resultados como strings de iconos completos (prefix:name)
        const icons = response.data.icons.map(
          (icon: { prefix: string; name: string }) => `${icon.prefix}:${icon.name}`
        );
        setSearchResults(icons);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.error('Error searching icons:', err);
      setError('Error al buscar iconos. Inténtalo de nuevo.');
      setSearchResults(POPULAR_ICONS);
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar cambios en la búsqueda
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);

    // Debounce la búsqueda para no hacer demasiadas llamadas API
    const timer = setTimeout(() => {
      searchIcons(value);
    }, 500);

    return () => clearTimeout(timer);
  };

  // Manejar la selección de un icono
  const handleSelectIcon = (iconName: string) => {
    onSelectIcon(iconName);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '80vh',
        },
      }}
    >
      <DialogTitle>Seleccionar Icono</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            placeholder="Buscar iconos..."
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            autoFocus
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" />
                </InputAdornment>
              ),
              endAdornment: isLoading && (
                <InputAdornment position="end">
                  <Box sx={{ display: 'flex' }}>
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                      }}
                    >
                      <span className="loading loading-spinner loading-xs" />
                    </Box>
                  </Box>
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Color del icono"
              type="color"
              value={selectedIconColor}
              onChange={(e) => setSelectedIconColor(e.target.value)}
              sx={{ width: 130 }}
            />

            <TextField
              label="Tamaño"
              type="number"
              value={iconSize}
              onChange={(e) => setIconSize(Number(e.target.value))}
              inputProps={{ min: 12, max: 64 }}
              sx={{ width: 100 }}
            />
          </Box>
        </Box>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Grid container spacing={1} sx={{ mt: 1 }}>
          {(searchResults.length > 0 ? searchResults : POPULAR_ICONS).map((iconName) => (
            <Grid key={iconName} sx={{ p: 1 }}>
              <Paper
                elevation={2}
                sx={{
                  p: 1.5,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  border: currentIcon === iconName ? '2px solid #3f51b5' : '2px solid transparent',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: 3,
                  },
                }}
                onClick={() => handleSelectIcon(iconName)}
              >
                <Icon
                  icon={iconName}
                  style={{
                    color: selectedIconColor,
                    width: iconSize,
                    height: iconSize,
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    mt: 1,
                    fontSize: '0.65rem',
                    maxWidth: 100,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {iconName}
                </Typography>
              </Paper>
            </Grid>
          ))}

          {searchResults.length === 0 && searchTerm && !isLoading && (
            <Box sx={{ width: '100%', py: 4, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                No se encontraron iconos con ese término de búsqueda.
              </Typography>
            </Box>
          )}

          {isLoading && searchResults.length === 0 && (
            <Box sx={{ width: '100%', py: 4, display: 'flex', justifyContent: 'center' }}>
              <Box className="loading loading-spinner loading-lg" />
            </Box>
          )}
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

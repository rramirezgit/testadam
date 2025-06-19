import axios from 'axios';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';
import { Chip, Stack, Alert, CircularProgress } from '@mui/material';

import { Iconify } from 'src/components/iconify';

// Interfaz para los resultados de iconos
interface IconResult {
  name: string;
  url: string; // URL directa del PNG
  source: string;
  tags?: string[];
}

// Props del componente
interface IconPickerProps {
  open: boolean;
  onClose: () => void;
  onSelectIcon: (iconUrl: string) => void; // ⚡ CAMBIO: Ahora enviamos la URL directa
  currentIcon?: string;
}

// ⚡ NUEVA: Configuración de APIs que proporcionan PNG
const ICON_APIS = {
  icons8: {
    name: 'Icons8',
    color: '#1976d2',
    baseUrl: 'https://img.icons8.com',
    searchUrl: 'https://search.icons8.com/api/iconsets/v5/search',
    description: '+1.4M iconos PNG gratuitos',
  },
  flaticon: {
    name: 'Flaticon',
    color: '#ff6b35',
    description: 'Iconos PNG premium y gratuitos',
  },
};

// ⚡ ICONOS PREDEFINIDOS POPULARES (URLs directas PNG de Icons8)
const POPULAR_ICONS = [
  {
    name: 'email',
    url: 'https://img.icons8.com/color/48/email.png',
    source: 'icons8',
    tags: ['email', 'mail', 'mensaje'],
  },
  {
    name: 'lightbulb',
    url: 'https://img.icons8.com/color/48/light-on.png',
    source: 'icons8',
    tags: ['idea', 'concepto', 'bombilla'],
  },
  {
    name: 'note',
    url: 'https://img.icons8.com/color/48/note.png',
    source: 'icons8',
    tags: ['nota', 'resumen', 'texto'],
  },
  {
    name: 'rocket',
    url: 'https://img.icons8.com/color/48/rocket.png',
    source: 'icons8',
    tags: ['tip', 'cohete', 'lanzamiento'],
  },
  {
    name: 'brain',
    url: 'https://img.icons8.com/color/48/brain.png',
    source: 'icons8',
    tags: ['analogía', 'cerebro', 'mente'],
  },
  {
    name: 'info',
    url: 'https://img.icons8.com/color/48/info.png',
    source: 'icons8',
    tags: ['información', 'dato', 'info'],
  },
  {
    name: 'star',
    url: 'https://img.icons8.com/color/48/star.png',
    source: 'icons8',
    tags: ['estrella', 'favorito', 'importante'],
  },
  {
    name: 'heart',
    url: 'https://img.icons8.com/color/48/heart.png',
    source: 'icons8',
    tags: ['corazón', 'amor', 'like'],
  },
  {
    name: 'check',
    url: 'https://img.icons8.com/color/48/check.png',
    source: 'icons8',
    tags: ['check', 'correcto', 'verificado'],
  },
  {
    name: 'warning',
    url: 'https://img.icons8.com/color/48/warning-shield.png',
    source: 'icons8',
    tags: ['advertencia', 'alerta', 'cuidado'],
  },
  {
    name: 'home',
    url: 'https://img.icons8.com/color/48/home.png',
    source: 'icons8',
    tags: ['casa', 'inicio', 'hogar'],
  },
  {
    name: 'user',
    url: 'https://img.icons8.com/color/48/user.png',
    source: 'icons8',
    tags: ['usuario', 'persona', 'perfil'],
  },
  {
    name: 'settings',
    url: 'https://img.icons8.com/color/48/settings.png',
    source: 'icons8',
    tags: ['configuración', 'ajustes', 'engranaje'],
  },
  {
    name: 'calendar',
    url: 'https://img.icons8.com/color/48/calendar.png',
    source: 'icons8',
    tags: ['calendario', 'fecha', 'tiempo'],
  },
  {
    name: 'clock',
    url: 'https://img.icons8.com/color/48/clock.png',
    source: 'icons8',
    tags: ['reloj', 'tiempo', 'hora'],
  },
  {
    name: 'phone',
    url: 'https://img.icons8.com/color/48/phone.png',
    source: 'icons8',
    tags: ['teléfono', 'llamada', 'contacto'],
  },
];

export default function IconPicker({ open, onClose, onSelectIcon, currentIcon }: IconPickerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<IconResult[]>(POPULAR_ICONS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [selectedSource, setSelectedSource] = useState<string>('all');

  // ⚡ NUEVA: Búsqueda en Icons8 (PNG)
  const searchIcons8 = async (query: string): Promise<IconResult[]> => {
    try {
      // Usar la API de búsqueda de Icons8
      const response = await axios.get(ICON_APIS.icons8.searchUrl, {
        params: {
          term: query,
          token: 'free', // Token gratuito
          language: 'es-ES',
          amount: 20,
        },
      });

      if (response.data && response.data.icons) {
        return response.data.icons.map((icon: any) => ({
          name: icon.name || query,
          url: `https://img.icons8.com/color/48/${icon.commonName || icon.name}.png`,
          source: 'icons8',
          tags: icon.tags || [query],
        }));
      }
    } catch (err) {
      console.warn('Icons8 search failed:', err);
    }
    return [];
  };

  // ⚡ NUEVA: Iconos basados en palabras clave (fallback)
  const getIconsByKeyword = (keyword: string): IconResult[] => {
    const keywordMappings: Record<string, string[]> = {
      // Conceptos básicos
      email: ['email', 'mail', 'message', 'envelope'],
      idea: ['light-on', 'lightbulb', 'innovation'],
      concepto: ['light-on', 'lightbulb', 'brain'],
      resumen: ['note', 'document', 'text-file'],
      tip: ['rocket', 'star', 'lightbulb-on'],
      analogía: ['brain', 'mind-map', 'connection'],
      dato: ['info', 'data', 'statistics'],

      // Emociones y estados
      importante: ['star', 'exclamation', 'priority-high'],
      correcto: ['check', 'verified', 'success'],
      error: ['cancel', 'error', 'warning-shield'],
      nuevo: ['new', 'plus', 'add'],

      // Navegación
      inicio: ['home', 'house', 'dashboard'],
      usuario: ['user', 'person', 'profile'],
      configuración: ['settings', 'gear', 'preferences'],

      // Tiempo
      tiempo: ['clock', 'time', 'schedule'],
      calendario: ['calendar', 'date', 'event'],

      // Comunicación
      teléfono: ['phone', 'call', 'contact'],
      mensaje: ['message', 'chat', 'conversation'],
    };

    const iconNames = keywordMappings[keyword.toLowerCase()] || [keyword];

    return iconNames.map((iconName) => ({
      name: iconName,
      url: `https://img.icons8.com/color/48/${iconName}.png`,
      source: 'icons8',
      tags: [keyword, iconName],
    }));
  };

  // Función principal de búsqueda
  const searchIcons = async (query: string) => {
    if (!query.trim()) {
      setSearchResults(POPULAR_ICONS);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      let results: IconResult[] = [];

      // 1. Buscar en Icons8 API
      if (selectedSource === 'all' || selectedSource === 'icons8') {
        const icons8Results = await searchIcons8(query);
        results = [...results, ...icons8Results];
      }

      // 2. Fallback: iconos basados en palabras clave
      if (results.length === 0) {
        const keywordResults = getIconsByKeyword(query);
        results = [...results, ...keywordResults];
      }

      // 3. Si aún no hay resultados, mostrar iconos populares relacionados
      if (results.length === 0) {
        const relatedIcons = POPULAR_ICONS.filter((icon) =>
          icon.tags?.some(
            (tag) =>
              tag.toLowerCase().includes(query.toLowerCase()) ||
              query.toLowerCase().includes(tag.toLowerCase())
          )
        );
        results = relatedIcons;
      }

      setSearchResults(results.slice(0, 24)); // Limitar a 24 resultados
    } catch (err) {
      setError('Error al buscar iconos. Intenta con otro término.');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Efecto para búsqueda con debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchIcons(searchTerm);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedSource]);

  // Resetear búsqueda al abrir
  useEffect(() => {
    if (open) {
      setSearchTerm('');
      setSearchResults(POPULAR_ICONS);
      setError('');
      setSelectedSource('all');
    }
  }, [open]);

  // Manejar la selección de un icono
  const handleSelectIcon = (icon: IconResult) => {
    // ⚡ CAMBIO CRÍTICO: Enviar la URL directa del PNG
    onSelectIcon(icon.url);
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
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6" component="div">
          Seleccionar Icono PNG
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Iconos PNG compatibles con emails
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 3 }}>
          {/* Buscador */}
          <TextField
            fullWidth
            placeholder="Buscar iconos... (ej: email, idea, casa)"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" />
                </InputAdornment>
              ),
              endAdornment: isLoading && (
                <InputAdornment position="end">
                  <CircularProgress size={20} />
                </InputAdornment>
              ),
            }}
          />

          {/* Filtros por fuente */}
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Chip
              label="Todos"
              variant={selectedSource === 'all' ? 'filled' : 'outlined'}
              onClick={() => setSelectedSource('all')}
              size="small"
            />
            <Chip
              label="Icons8 PNG"
              variant={selectedSource === 'icons8' ? 'filled' : 'outlined'}
              onClick={() => setSelectedSource('icons8')}
              size="small"
              sx={{ color: ICON_APIS.icons8.color }}
            />
          </Stack>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Información sobre compatibilidad */}
        {!searchTerm && (
          <Alert severity="success" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>✅ Iconos compatibles con email:</strong>
              <br />• <strong>Formato PNG:</strong> Compatible con todos los clientes de email
              <br />• <strong>URLs directas:</strong> No requieren JavaScript
              <br />• <strong>Carga rápida:</strong> Optimizados para web y email
            </Typography>
          </Alert>
        )}

        {/* Grid de iconos */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
            gap: 1,
          }}
        >
          {searchResults.map((icon, index) => (
            <Box key={`${icon.source}-${icon.name}-${index}`}>
              <Paper
                elevation={2}
                sx={{
                  p: 1.5,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  border: currentIcon === icon.url ? '2px solid #3f51b5' : '2px solid transparent',
                  minHeight: 80,
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: 4,
                    borderColor: '#3f51b5',
                  },
                }}
                onClick={() => handleSelectIcon(icon)}
              >
                {/* Icono PNG */}
                <Box
                  sx={{
                    mb: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 32,
                  }}
                >
                  <img
                    src={icon.url}
                    alt={icon.name}
                    style={{
                      width: 24,
                      height: 24,
                      objectFit: 'contain',
                    }}
                    onError={(e) => {
                      // Fallback si la imagen no carga
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </Box>

                {/* Nombre del icono */}
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: '0.6rem',
                    maxWidth: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    textAlign: 'center',
                  }}
                >
                  {icon.name}
                </Typography>

                {/* Badge de la fuente */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 2,
                    right: 2,
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: ICON_APIS.icons8.color,
                  }}
                />
              </Paper>
            </Box>
          ))}

          {/* Estado de carga */}
          {isLoading && searchResults.length === 0 && (
            <Box sx={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {/* Sin resultados */}
          {!isLoading && searchResults.length === 0 && searchTerm && (
            <Box sx={{ gridColumn: '1 / -1', textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                No se encontraron iconos con ese término.
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Intenta con términos como &quot;email&quot;, &quot;idea&quot;, &quot;casa&quot;,
                &quot;usuario&quot;, etc.
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}

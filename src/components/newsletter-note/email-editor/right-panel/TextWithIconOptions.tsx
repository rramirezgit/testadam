import type { EmailComponent } from 'src/types/saved-note';

import { Icon } from '@iconify/react';

import {
  Box,
  Slider,
  Select,
  Divider,
  MenuItem,
  TextField,
  Typography,
  InputLabel,
  FormControl,
} from '@mui/material';

interface TextWithIconOptionsProps {
  component: EmailComponent;
  updateComponentProps: (componentId: string, props: Record<string, any>) => void;
}

const iconOptions = [
  { value: 'mdi:information-outline', label: 'Información' },
  { value: 'mdi:check-circle-outline', label: 'Éxito' },
  { value: 'mdi:alert-circle-outline', label: 'Alerta' },
  { value: 'mdi:lightbulb-outline', label: 'Idea' },
  { value: 'mdi:star-outline', label: 'Estrella' },
  { value: 'mdi:heart-outline', label: 'Corazón' },
  { value: 'mdi:fire', label: 'Fuego' },
  { value: 'mdi:trending-up', label: 'Tendencia' },
  { value: 'mdi:rocket-launch-outline', label: 'Cohete' },
  { value: 'mdi:shield-check-outline', label: 'Seguridad' },
  { value: 'mdi:clock-outline', label: 'Tiempo' },
  { value: 'mdi:account-group-outline', label: 'Grupo' },
];

const TextWithIconOptions = ({ component, updateComponentProps }: TextWithIconOptionsProps) => {
  const icon = component.props?.icon || 'mdi:information-outline';
  const iconColor = component.props?.iconColor || '#2196f3';
  const iconSize = component.props?.iconSize || 24;
  const title = component.props?.title || 'Título con Icono';
  const description = component.props?.description || 'Escribe el contenido aquí...';
  const titleColor = component.props?.titleColor || '#000000';
  const textColor = component.props?.textColor || '#333333';
  const backgroundColor = component.props?.backgroundColor || '#ffffff';
  const titleSize = component.props?.titleSize || 20;
  const fontSize = component.props?.fontSize || 14;
  const alignment = component.props?.alignment || 'left';
  const spacing = component.props?.spacing || 12;
  const borderRadius = component.props?.borderRadius || 8;
  const padding = component.props?.padding || 16;

  const handleInputChange = (field: string, value: any) => {
    updateComponentProps(component.id, { [field]: value });
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Icon icon="mdi:text-box-outline" />
        Texto con Icono
      </Typography>

      {/* Sección de Contenido */}
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
        📝 Contenido
      </Typography>

      <TextField
        label="Título"
        value={title}
        onChange={(e) => handleInputChange('title', e.target.value)}
        fullWidth
        size="small"
        sx={{ mb: 2 }}
      />

      <TextField
        label="Descripción"
        value={description}
        onChange={(e) => handleInputChange('description', e.target.value)}
        fullWidth
        multiline
        rows={3}
        size="small"
        sx={{ mb: 2 }}
      />

      <Divider sx={{ my: 2 }} />

      {/* Sección de Icono */}
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
        🎨 Icono
      </Typography>

      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        <InputLabel>Seleccionar Icono</InputLabel>
        <Select
          value={icon}
          onChange={(e) => handleInputChange('icon', e.target.value)}
          label="Seleccionar Icono"
        >
          {iconOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Icon icon={option.value} width="20" height="20" />
                {option.label}
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
        <Box>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Tamaño icono: {iconSize}px
          </Typography>
          <Slider
            value={iconSize}
            onChange={(_, value) => handleInputChange('iconSize', value)}
            min={16}
            max={40}
            marks={[
              { value: 16, label: '16' },
              { value: 24, label: '24' },
              { value: 32, label: '32' },
              { value: 40, label: '40' },
            ]}
          />
        </Box>

        <Box>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Espaciado: {spacing}px
          </Typography>
          <Slider
            value={spacing}
            onChange={(_, value) => handleInputChange('spacing', value)}
            min={4}
            max={24}
            marks={[
              { value: 4, label: '4' },
              { value: 12, label: '12' },
              { value: 24, label: '24' },
            ]}
          />
        </Box>
      </Box>

      <TextField
        label="Color del icono"
        type="color"
        value={iconColor}
        onChange={(e) => handleInputChange('iconColor', e.target.value)}
        fullWidth
        size="small"
        sx={{ mb: 2 }}
      />

      <Divider sx={{ my: 2 }} />

      {/* Sección de Alineación */}
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
        📐 Alineación
      </Typography>

      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        <InputLabel>Alineación</InputLabel>
        <Select
          value={alignment}
          onChange={(e) => handleInputChange('alignment', e.target.value)}
          label="Alineación"
        >
          <MenuItem value="left">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Icon icon="mdi:format-align-left" width="16" height="16" />
              Izquierda
            </Box>
          </MenuItem>
          <MenuItem value="center">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Icon icon="mdi:format-align-center" width="16" height="16" />
              Centro
            </Box>
          </MenuItem>
          <MenuItem value="right">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Icon icon="mdi:format-align-right" width="16" height="16" />
              Derecha
            </Box>
          </MenuItem>
        </Select>
      </FormControl>

      <Divider sx={{ my: 2 }} />

      {/* Sección de Diseño */}
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
        Diseño
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
        <Box>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Tamaño título: {titleSize}px
          </Typography>
          <Slider
            value={titleSize}
            onChange={(_, value) => handleInputChange('titleSize', value)}
            min={14}
            max={28}
            marks={[
              { value: 14, label: '14' },
              { value: 20, label: '20' },
              { value: 28, label: '28' },
            ]}
            sx={{ mb: 2 }}
          />
        </Box>

        <Box>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Tamaño texto: {fontSize}px
          </Typography>
          <Slider
            value={fontSize}
            onChange={(_, value) => handleInputChange('fontSize', value)}
            min={12}
            max={18}
            marks={[
              { value: 12, label: '12' },
              { value: 14, label: '14' },
              { value: 18, label: '18' },
            ]}
            sx={{ mb: 2 }}
          />
        </Box>

        <Box>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Bordes: {borderRadius}px
          </Typography>
          <Slider
            value={borderRadius}
            onChange={(_, value) => handleInputChange('borderRadius', value)}
            min={0}
            max={20}
            marks={[
              { value: 0, label: '0' },
              { value: 8, label: '8' },
              { value: 20, label: '20' },
            ]}
            sx={{ mb: 2 }}
          />
        </Box>

        <Box>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Relleno: {padding}px
          </Typography>
          <Slider
            value={padding}
            onChange={(_, value) => handleInputChange('padding', value)}
            min={8}
            max={32}
            marks={[
              { value: 8, label: '8' },
              { value: 16, label: '16' },
              { value: 32, label: '32' },
            ]}
            sx={{ mb: 2 }}
          />
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Sección de Colores */}
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
        🎨 Colores
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
        <TextField
          label="Color de fondo"
          type="color"
          value={backgroundColor}
          onChange={(e) => handleInputChange('backgroundColor', e.target.value)}
          fullWidth
          size="small"
        />

        <TextField
          label="Color del título"
          type="color"
          value={titleColor}
          onChange={(e) => handleInputChange('titleColor', e.target.value)}
          fullWidth
          size="small"
        />
      </Box>

      <TextField
        label="Color del texto"
        type="color"
        value={textColor}
        onChange={(e) => handleInputChange('textColor', e.target.value)}
        fullWidth
        size="small"
      />
    </Box>
  );
};

export default TextWithIconOptions;

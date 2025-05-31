import { Box, Button, TextField, IconButton, Typography } from '@mui/material';

import type { BackgroundOptionsProps } from './types';

const BackgroundOptions = ({
  selectedComponentId,
  updateComponentStyle,
  emailBackground,
  setEmailBackground,
  selectedBanner,
  setSelectedBanner,
  showGradient,
  setShowGradient,
  gradientColors,
  setGradientColors,
  bannerOptions,
}: BackgroundOptionsProps) => (
  <>
    <Typography variant="subtitle2" gutterBottom>
      Color de fondo
    </Typography>
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
        {['#FFFFFF', '#F5F5F5', '#EEEEEE', '#E0F7FA', '#E8F5E9', '#FFF8E1', '#FFEBEE'].map(
          (color) => (
            <IconButton
              key={color}
              onClick={() => {
                updateComponentStyle(selectedComponentId!, { backgroundColor: color });
              }}
              sx={{
                width: 36,
                height: 36,
                backgroundColor: color,
                border: '1px solid #ddd',
                '&:hover': { opacity: 0.9 },
              }}
            />
          )
        )}
      </Box>
      <TextField
        type="color"
        fullWidth
        size="small"
        onChange={(e) => {
          updateComponentStyle(selectedComponentId!, { backgroundColor: e.target.value });
        }}
        sx={{ mb: 2 }}
      />
    </Box>

    <Typography variant="subtitle2" gutterBottom>
      Fondo del email
    </Typography>
    <Box sx={{ mb: 3 }}>
      <Typography variant="caption" display="block" gutterBottom>
        Color de fondo
      </Typography>
      <TextField
        type="color"
        fullWidth
        size="small"
        value={emailBackground}
        onChange={(e) => setEmailBackground(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Typography variant="caption" display="block" gutterBottom>
        Banner predefinido
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        {bannerOptions.map((option) => (
          <Box
            key={option.id}
            sx={{
              width: 70,
              height: 70,
              cursor: 'pointer',
              border: selectedBanner === option.id ? '2px solid #3f51b5' : '1px solid #e0e0e0',
              borderRadius: '8px',
              backgroundImage: `url(${option.preview})`,
              backgroundSize: 'cover',
              '&:hover': {
                borderColor: '#3f51b5',
              },
            }}
            onClick={() => setSelectedBanner(option.id)}
          />
        ))}
      </Box>

      <Typography variant="caption" display="block" gutterBottom>
        Gradiente
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Button
          variant={showGradient ? 'contained' : 'outlined'}
          size="small"
          onClick={() => setShowGradient(!showGradient)}
          sx={{ mr: 1 }}
        >
          {showGradient ? 'Desactivar' : 'Activar'}
        </Button>
        {showGradient && (
          <Box sx={{ display: 'flex', gap: 1, flex: 1 }}>
            <TextField
              type="color"
              size="small"
              value={gradientColors[0]}
              onChange={(e) => setGradientColors([e.target.value, gradientColors[1]])}
              sx={{ width: '50%' }}
            />
            <TextField
              type="color"
              size="small"
              value={gradientColors[1]}
              onChange={(e) => setGradientColors([gradientColors[0], e.target.value])}
              sx={{ width: '50%' }}
            />
          </Box>
        )}
      </Box>
    </Box>
  </>
);

export default BackgroundOptions;

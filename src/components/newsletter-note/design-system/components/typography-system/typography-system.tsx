import React, { useState } from 'react';

import {
  Box,
  Stack,
  styled,
  Slider,
  Select,
  MenuItem,
  Typography,
  InputLabel,
  FormControl,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';

import { Card, Button } from '../shared/ui';

// ============================================================================
// TYPOGRAPHY SYSTEM COMPONENT - Newsletter Design System
// ============================================================================

export interface TypographySystemProps {
  className?: string;
}

interface FontFamily {
  name: string;
  category: 'serif' | 'sans-serif' | 'monospace' | 'display';
  weights: number[];
  cssFamily: string;
}

interface TypographyPreset {
  id: string;
  name: string;
  description: string;
  config: {
    headingFont: string;
    bodyFont: string;
    headingSize: number;
    bodySize: number;
    lineHeight: number;
    letterSpacing: number;
  };
}

const fontFamilies: FontFamily[] = [
  {
    name: 'Inter',
    category: 'sans-serif',
    weights: [300, 400, 500, 600, 700],
    cssFamily: 'Inter, sans-serif',
  },
  {
    name: 'Roboto',
    category: 'sans-serif',
    weights: [300, 400, 500, 700],
    cssFamily: 'Roboto, sans-serif',
  },
  {
    name: 'Playfair Display',
    category: 'serif',
    weights: [400, 500, 600, 700],
    cssFamily: '"Playfair Display", serif',
  },
  {
    name: 'Merriweather',
    category: 'serif',
    weights: [300, 400, 700],
    cssFamily: 'Merriweather, serif',
  },
  {
    name: 'Montserrat',
    category: 'sans-serif',
    weights: [300, 400, 500, 600, 700],
    cssFamily: 'Montserrat, sans-serif',
  },
  {
    name: 'Source Code Pro',
    category: 'monospace',
    weights: [400, 500, 600],
    cssFamily: '"Source Code Pro", monospace',
  },
];

const typographyPresets: TypographyPreset[] = [
  {
    id: 'modern',
    name: 'Modern & Clean',
    description: 'Clean sans-serif for professional newsletters',
    config: {
      headingFont: 'Inter',
      bodyFont: 'Inter',
      headingSize: 24,
      bodySize: 16,
      lineHeight: 1.6,
      letterSpacing: 0,
    },
  },
  {
    id: 'classic',
    name: 'Classic Editorial',
    description: 'Traditional serif combination',
    config: {
      headingFont: 'Playfair Display',
      bodyFont: 'Merriweather',
      headingSize: 28,
      bodySize: 16,
      lineHeight: 1.7,
      letterSpacing: 0.02,
    },
  },
  {
    id: 'tech',
    name: 'Tech & Startup',
    description: 'Modern tech-focused typography',
    config: {
      headingFont: 'Montserrat',
      bodyFont: 'Roboto',
      headingSize: 26,
      bodySize: 15,
      lineHeight: 1.5,
      letterSpacing: -0.01,
    },
  },
];

const PreviewCard = styled(Card)(({ theme }) => ({
  minHeight: 200,
  padding: theme.spacing(3),
  '& .preview-heading': {
    marginBottom: theme.spacing(2),
  },
  '& .preview-body': {
    color: theme.palette.text.secondary,
  },
}));

const PresetCard = styled(Card)<{ selected?: boolean }>(({ theme, selected }) => ({
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  ...(selected && {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.lighter || theme.palette.primary.light,
  }),
}));

const ControlSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const TypographySystem: React.FC<TypographySystemProps> = ({ className }) => {
  const [selectedPreset, setSelectedPreset] = useState<string>('modern');
  const [headingFont, setHeadingFont] = useState('Inter');
  const [bodyFont, setBodyFont] = useState('Inter');
  const [headingSize, setHeadingSize] = useState(24);
  const [bodySize, setBodySize] = useState(16);
  const [lineHeight, setLineHeight] = useState(1.6);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [fontWeight, setFontWeight] = useState<'normal' | 'medium' | 'bold'>('normal');

  const previewStyle = {
    heading: {
      fontFamily: fontFamilies.find((f) => f.name === headingFont)?.cssFamily || 'Inter',
      fontSize: `${headingSize}px`,
      fontWeight: fontWeight === 'bold' ? 700 : fontWeight === 'medium' ? 500 : 400,
      lineHeight,
      letterSpacing: `${letterSpacing}em`,
    },
    body: {
      fontFamily: fontFamilies.find((f) => f.name === bodyFont)?.cssFamily || 'Inter',
      fontSize: `${bodySize}px`,
      lineHeight,
      letterSpacing: `${letterSpacing}em`,
    },
  };

  const handlePresetSelect = (preset: TypographyPreset) => {
    setSelectedPreset(preset.id);
    setHeadingFont(preset.config.headingFont);
    setBodyFont(preset.config.bodyFont);
    setHeadingSize(preset.config.headingSize);
    setBodySize(preset.config.bodySize);
    setLineHeight(preset.config.lineHeight);
    setLetterSpacing(preset.config.letterSpacing);
  };

  return (
    <Box className={className}>
      {/* Typography Preview */}
      <Box p={2} borderBottom="1px solid" borderColor="divider">
        <Typography variant="subtitle2" gutterBottom>
          Live Preview
        </Typography>
        <PreviewCard variant="outlined" padding="md">
          <Typography variant="h4" className="preview-heading" sx={previewStyle.heading}>
            Your Newsletter Headline
          </Typography>
          <Typography className="preview-body" sx={previewStyle.body}>
            This is how your newsletter content will look with the selected typography settings. The
            combination of fonts, sizes, and spacing creates the overall reading experience for your
            subscribers.
          </Typography>
        </PreviewCard>
      </Box>

      {/* Typography Presets */}
      <ControlSection>
        <Typography variant="subtitle2" gutterBottom>
          Typography Presets
        </Typography>
        <Stack spacing={1}>
          {typographyPresets.map((preset) => (
            <PresetCard
              key={preset.id}
              selected={selectedPreset === preset.id}
              padding="sm"
              onClick={() => handlePresetSelect(preset)}
            >
              <Typography variant="subtitle2" fontWeight="600">
                {preset.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {preset.description}
              </Typography>
            </PresetCard>
          ))}
        </Stack>
      </ControlSection>

      {/* Font Selection */}
      <ControlSection>
        <Typography variant="subtitle2" gutterBottom>
          Font Families
        </Typography>
        <Stack spacing={2}>
          <FormControl size="small" fullWidth>
            <InputLabel>Heading Font</InputLabel>
            <Select
              value={headingFont}
              label="Heading Font"
              onChange={(e) => setHeadingFont(e.target.value)}
            >
              {fontFamilies.map((font) => (
                <MenuItem key={font.name} value={font.name}>
                  <Box>
                    <Typography variant="body2">{font.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {font.category}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" fullWidth>
            <InputLabel>Body Font</InputLabel>
            <Select
              value={bodyFont}
              label="Body Font"
              onChange={(e) => setBodyFont(e.target.value)}
            >
              {fontFamilies.map((font) => (
                <MenuItem key={font.name} value={font.name}>
                  <Box>
                    <Typography variant="body2">{font.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {font.category}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </ControlSection>

      {/* Font Sizes */}
      <ControlSection>
        <Typography variant="subtitle2" gutterBottom>
          Font Sizes
        </Typography>
        <Stack spacing={3}>
          <Box>
            <Typography variant="caption" gutterBottom display="block">
              Heading Size: {headingSize}px
            </Typography>
            <Slider
              value={headingSize}
              onChange={(_, value) => setHeadingSize(value as number)}
              min={18}
              max={48}
              step={1}
              valueLabelDisplay="off"
            />
          </Box>

          <Box>
            <Typography variant="caption" gutterBottom display="block">
              Body Size: {bodySize}px
            </Typography>
            <Slider
              value={bodySize}
              onChange={(_, value) => setBodySize(value as number)}
              min={12}
              max={24}
              step={1}
              valueLabelDisplay="off"
            />
          </Box>
        </Stack>
      </ControlSection>

      {/* Text Properties */}
      <ControlSection>
        <Typography variant="subtitle2" gutterBottom>
          Text Properties
        </Typography>
        <Stack spacing={3}>
          <Box>
            <Typography variant="caption" gutterBottom display="block">
              Line Height: {lineHeight}
            </Typography>
            <Slider
              value={lineHeight}
              onChange={(_, value) => setLineHeight(value as number)}
              min={1.2}
              max={2.0}
              step={0.1}
              valueLabelDisplay="off"
            />
          </Box>

          <Box>
            <Typography variant="caption" gutterBottom display="block">
              Letter Spacing: {letterSpacing}em
            </Typography>
            <Slider
              value={letterSpacing}
              onChange={(_, value) => setLetterSpacing(value as number)}
              min={-0.05}
              max={0.1}
              step={0.005}
              valueLabelDisplay="off"
            />
          </Box>

          <Box>
            <Typography variant="caption" gutterBottom display="block">
              Font Weight
            </Typography>
            <ToggleButtonGroup
              value={fontWeight}
              exclusive
              onChange={(_, value) => value && setFontWeight(value)}
              size="small"
            >
              <ToggleButton value="normal">Normal</ToggleButton>
              <ToggleButton value="medium">Medium</ToggleButton>
              <ToggleButton value="bold">Bold</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Stack>
      </ControlSection>

      {/* Actions */}
      <Box p={2}>
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button variant="outline" size="sm">
            Reset
          </Button>
          <Button variant="primary" size="sm">
            Apply Typography
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default TypographySystem;

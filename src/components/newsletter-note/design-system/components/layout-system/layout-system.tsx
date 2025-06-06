import React, { useState } from 'react';

import {
  Box,
  Chip,
  Stack,
  styled,
  Slider,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';

import { Card, Button } from '../shared/ui';

// ============================================================================
// LAYOUT SYSTEM COMPONENT - Newsletter Design System
// ============================================================================

export interface LayoutSystemProps {
  className?: string;
}

interface LayoutPreset {
  id: string;
  name: string;
  description: string;
  maxWidth: number;
  contentPadding: number;
  sectionSpacing: number;
  columnGap: number;
  layout: 'single' | 'two-column' | 'sidebar' | 'grid';
}

interface SpacingScale {
  name: string;
  values: number[];
}

const layoutPresets: LayoutPreset[] = [
  {
    id: 'newsletter',
    name: 'Newsletter Standard',
    description: 'Classic single-column newsletter layout',
    maxWidth: 600,
    contentPadding: 24,
    sectionSpacing: 32,
    columnGap: 0,
    layout: 'single',
  },
  {
    id: 'magazine',
    name: 'Magazine Style',
    description: 'Two-column layout for rich content',
    maxWidth: 800,
    contentPadding: 32,
    sectionSpacing: 40,
    columnGap: 32,
    layout: 'two-column',
  },
  {
    id: 'promotional',
    name: 'Promotional',
    description: 'Wide layout for marketing content',
    maxWidth: 700,
    contentPadding: 20,
    sectionSpacing: 24,
    columnGap: 20,
    layout: 'grid',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean, spacious design',
    maxWidth: 500,
    contentPadding: 40,
    sectionSpacing: 48,
    columnGap: 0,
    layout: 'single',
  },
];

const spacingScales: SpacingScale[] = [
  {
    name: 'Tight',
    values: [4, 8, 12, 16, 24, 32, 48],
  },
  {
    name: 'Standard',
    values: [8, 16, 24, 32, 48, 64, 96],
  },
  {
    name: 'Spacious',
    values: [12, 24, 36, 48, 72, 96, 144],
  },
];

const PreviewContainer = styled(Box)(({ theme }) => ({
  border: `2px solid ${theme.palette.divider}`,
  borderRadius: theme.spacing(1),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.grey[50],
  position: 'relative',
  overflow: 'hidden',
}));

const LayoutPreview = styled(Box)<{
  maxWidth: number;
  contentPadding: number;
  layout: string;
}>(({ theme, maxWidth, contentPadding, layout }) => ({
  maxWidth: `${maxWidth}px`,
  margin: '0 auto',
  padding: theme.spacing(contentPadding / 8),
  backgroundColor: theme.palette.common.white,
  borderRadius: theme.spacing(0.5),
  minHeight: 200,
  display: layout === 'two-column' ? 'grid' : 'block',
  gridTemplateColumns: layout === 'two-column' ? '1fr 1fr' : 'none',
  gap: layout === 'two-column' ? theme.spacing(2) : 0,
}));

const LayoutOption = styled(Box)<{ selected?: boolean }>(({ theme, selected }) => ({
  border: `2px solid ${selected ? theme.palette.primary.main : theme.palette.divider}`,
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1),
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  backgroundColor: selected ? theme.palette.primary.lighter : 'transparent',
  '&:hover': {
    borderColor: theme.palette.primary.main,
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

export const LayoutSystem: React.FC<LayoutSystemProps> = ({ className }) => {
  const [selectedPreset, setSelectedPreset] = useState<string>('newsletter');
  const [maxWidth, setMaxWidth] = useState(600);
  const [contentPadding, setContentPadding] = useState(24);
  const [sectionSpacing, setSectionSpacing] = useState(32);
  const [columnGap, setColumnGap] = useState(0);
  const [layout, setLayout] = useState<'single' | 'two-column' | 'sidebar' | 'grid'>('single');
  const [selectedSpacingScale, setSelectedSpacingScale] = useState('Standard');

  const layoutOptions = [
    { value: 'single', label: 'Single Column', icon: '▬' },
    { value: 'two-column', label: 'Two Column', icon: '▬▬' },
    { value: 'sidebar', label: 'With Sidebar', icon: '▬▌' },
    { value: 'grid', label: 'Grid Layout', icon: '▦' },
  ];

  const handlePresetSelect = (preset: LayoutPreset) => {
    setSelectedPreset(preset.id);
    setMaxWidth(preset.maxWidth);
    setContentPadding(preset.contentPadding);
    setSectionSpacing(preset.sectionSpacing);
    setColumnGap(preset.columnGap);
    setLayout(preset.layout);
  };

  const currentSpacingScale =
    spacingScales.find((s) => s.name === selectedSpacingScale)?.values || [];

  return (
    <Box className={className}>
      {/* Layout Preview */}
      <Box p={2} borderBottom="1px solid" borderColor="divider">
        <Typography variant="subtitle2" gutterBottom>
          Layout Preview
        </Typography>
        <PreviewContainer>
          <LayoutPreview maxWidth={maxWidth} contentPadding={contentPadding} layout={layout}>
            <Box
              sx={{
                backgroundColor: 'grey.200',
                height: 40,
                borderRadius: 0.5,
                mb: sectionSpacing / 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="caption">Header Section</Typography>
            </Box>

            <Box
              sx={{
                backgroundColor: 'grey.100',
                height: 80,
                borderRadius: 0.5,
                mb: sectionSpacing / 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="caption">Main Content</Typography>
            </Box>

            {layout === 'two-column' && (
              <Box
                sx={{
                  backgroundColor: 'grey.100',
                  height: 80,
                  borderRadius: 0.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="caption">Side Content</Typography>
              </Box>
            )}

            <Box
              sx={{
                backgroundColor: 'grey.200',
                height: 30,
                borderRadius: 0.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="caption">Footer</Typography>
            </Box>
          </LayoutPreview>

          {/* Dimensions overlay */}
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: 'rgba(0,0,0,0.7)',
              color: 'white',
              padding: 0.5,
              borderRadius: 0.5,
              fontSize: '0.75rem',
            }}
          >
            {maxWidth}px × {layout}
          </Box>
        </PreviewContainer>
      </Box>

      {/* Layout Presets */}
      <ControlSection>
        <Typography variant="subtitle2" gutterBottom>
          Layout Presets
        </Typography>
        <Stack spacing={1}>
          {layoutPresets.map((preset) => (
            <PresetCard
              key={preset.id}
              selected={selectedPreset === preset.id}
              padding="sm"
              onClick={() => handlePresetSelect(preset)}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="subtitle2" fontWeight="600">
                    {preset.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {preset.description}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                  <Chip label={`${preset.maxWidth}px`} size="small" variant="outlined" />
                  <Chip label={preset.layout} size="small" variant="outlined" />
                </Stack>
              </Stack>
            </PresetCard>
          ))}
        </Stack>
      </ControlSection>

      {/* Layout Type */}
      <ControlSection>
        <Typography variant="subtitle2" gutterBottom>
          Layout Structure
        </Typography>
        <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={1}>
          {layoutOptions.map((option) => (
            <LayoutOption
              key={option.value}
              selected={layout === option.value}
              onClick={() => setLayout(option.value as any)}
            >
              <Stack alignItems="center" spacing={1}>
                <Typography variant="h6" sx={{ fontFamily: 'monospace' }}>
                  {option.icon}
                </Typography>
                <Typography variant="caption" textAlign="center">
                  {option.label}
                </Typography>
              </Stack>
            </LayoutOption>
          ))}
        </Box>
      </ControlSection>

      {/* Dimensions */}
      <ControlSection>
        <Typography variant="subtitle2" gutterBottom>
          Dimensions
        </Typography>
        <Stack spacing={3}>
          <Box>
            <Typography variant="caption" gutterBottom display="block">
              Max Width: {maxWidth}px
            </Typography>
            <Slider
              value={maxWidth}
              onChange={(_, value) => setMaxWidth(value as number)}
              min={400}
              max={900}
              step={50}
              valueLabelDisplay="off"
            />
          </Box>

          <Box>
            <Typography variant="caption" gutterBottom display="block">
              Content Padding: {contentPadding}px
            </Typography>
            <Slider
              value={contentPadding}
              onChange={(_, value) => setContentPadding(value as number)}
              min={8}
              max={64}
              step={4}
              valueLabelDisplay="off"
            />
          </Box>

          {layout !== 'single' && (
            <Box>
              <Typography variant="caption" gutterBottom display="block">
                Column Gap: {columnGap}px
              </Typography>
              <Slider
                value={columnGap}
                onChange={(_, value) => setColumnGap(value as number)}
                min={0}
                max={64}
                step={4}
                valueLabelDisplay="off"
              />
            </Box>
          )}
        </Stack>
      </ControlSection>

      {/* Spacing System */}
      <ControlSection>
        <Typography variant="subtitle2" gutterBottom>
          Spacing Scale
        </Typography>
        <Stack spacing={2}>
          <ToggleButtonGroup
            value={selectedSpacingScale}
            exclusive
            onChange={(_, value) => value && setSelectedSpacingScale(value)}
            size="small"
          >
            {spacingScales.map((scale) => (
              <ToggleButton key={scale.name} value={scale.name}>
                {scale.name}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

          <Box>
            <Typography variant="caption" color="text.secondary" gutterBottom display="block">
              Available spacing values:
            </Typography>
            <Stack direction="row" spacing={0.5} flexWrap="wrap">
              {currentSpacingScale.map((value) => (
                <Chip key={value} label={`${value}px`} size="small" variant="outlined" />
              ))}
            </Stack>
          </Box>

          <Box>
            <Typography variant="caption" gutterBottom display="block">
              Section Spacing: {sectionSpacing}px
            </Typography>
            <Slider
              value={sectionSpacing}
              onChange={(_, value) => setSectionSpacing(value as number)}
              min={Math.min(...currentSpacingScale)}
              max={Math.max(...currentSpacingScale)}
              step={8}
              valueLabelDisplay="off"
            />
          </Box>
        </Stack>
      </ControlSection>

      {/* Actions */}
      <Box p={2}>
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button variant="outline" size="sm">
            Reset Layout
          </Button>
          <Button variant="primary" size="sm">
            Apply Layout
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default LayoutSystem;

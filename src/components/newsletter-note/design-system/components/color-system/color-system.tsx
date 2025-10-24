import React, { useState } from 'react';

import { Box, Chip, Stack, styled, Typography } from '@mui/material';

import { Card } from '../shared/ui';
import { useColorPalette } from '../../';

import type { ColorHarmonyType } from '../../types';

// ============================================================================
// COLOR SYSTEM COMPONENT - Newsletter Design System
// ============================================================================

export interface ColorSystemProps {
  className?: string;
}

const ColorPaletteCard = styled(Card)<{ selected?: boolean }>(({ theme, selected }) => ({
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  ...(selected && {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.lighter || theme.palette.primary.light,
  }),
}));

const ColorSwatch = styled(Box)<{ color: string }>(({ color }) => ({
  width: 24,
  height: 24,
  borderRadius: 4,
  backgroundColor: color,
  border: '1px solid rgba(0, 0, 0, 0.1)',
  cursor: 'pointer',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.1)',
  },
}));

const HarmonyPreview = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  backgroundColor: theme.palette.grey[50],
  border: `1px solid ${theme.palette.divider}`,
}));

const AccessibilityIndicator = styled(Chip)<{
  level: 'aa' | 'aaa' | 'fail';
}>(({ theme, level }) => ({
  fontSize: '0.75rem',
  height: 20,
  backgroundColor:
    level === 'aaa'
      ? theme.palette.success.main
      : level === 'aa'
        ? theme.palette.warning.main
        : theme.palette.error.main,
  color: theme.palette.common.white,
}));

const PaletteGrid = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

export const ColorSystem: React.FC<ColorSystemProps> = ({ className }) => {
  const {
    colorPalettes,
    selectedPalette,
    setPalette,
    customColors,
    // updateCustomColor,
    generateHarmony,
    checkAccessibility,
    // selectedCategory,
    // setSelectedCategory,
    // categories,
  } = useColorPalette();

  const [harmonyType, setHarmonyType] = useState<ColorHarmonyType>('complementary');

  // Generate harmony if we have a selected palette
  const colorHarmony = selectedPalette
    ? generateHarmony(selectedPalette.primary, harmonyType)
    : null;

  // Check accessibility of current palette
  const accessibility = selectedPalette
    ? checkAccessibility(selectedPalette.background, selectedPalette.text)
    : null;

  const harmonyTypes: { value: ColorHarmonyType; label: string }[] = [
    { value: 'complementary', label: 'Complementary' },
    { value: 'triadic', label: 'Triadic' },
    { value: 'analogous', label: 'Analogous' },
    { value: 'monochromatic', label: 'Monochromatic' },
  ];

  return (
    <Box className={className}>
      {/* Selected Palette Info */}
      {selectedPalette && (
        <Box p={2} borderBottom="1px solid" borderColor="divider">
          <Typography variant="h6" gutterBottom>
            {selectedPalette.name}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block" mb={1}>
            {selectedPalette.description}
          </Typography>

          {/* Main Colors */}
          <Stack direction="row" spacing={1} mb={2}>
            <ColorSwatch color={selectedPalette.primary} title="Primary" />
            <ColorSwatch color={selectedPalette.secondary} title="Secondary" />
            <ColorSwatch color={selectedPalette.accent} title="Accent" />
            <ColorSwatch color={selectedPalette.background} title="Background" />
            <ColorSwatch color={selectedPalette.text} title="Text" />
          </Stack>

          {/* Accessibility */}
          {accessibility && (
            <Stack direction="row" spacing={1}>
              <AccessibilityIndicator
                level={accessibility.wcagAAA ? 'aaa' : accessibility.wcagAA ? 'aa' : 'fail'}
                label={
                  accessibility.wcagAAA
                    ? 'WCAG AAA'
                    : accessibility.wcagAA
                      ? 'WCAG AA'
                      : 'Needs improvement'
                }
                size="small"
              />
              <Typography variant="caption">Contrast: {accessibility.contrastRatio}:1</Typography>
            </Stack>
          )}
        </Box>
      )}

      {/* Color Harmonies */}
      {colorHarmony && (
        <Box p={2} borderBottom="1px solid" borderColor="divider">
          <Typography variant="subtitle2" gutterBottom>
            Color Harmonies
          </Typography>

          <Stack direction="row" spacing={1} mb={2} flexWrap="wrap">
            {harmonyTypes.map((type) => (
              <Chip
                key={type.value}
                label={type.label}
                size="small"
                variant={harmonyType === type.value ? 'filled' : 'outlined'}
                onClick={() => setHarmonyType(type.value)}
                sx={{ mb: 1 }}
              />
            ))}
          </Stack>

          <HarmonyPreview direction="row" spacing={1}>
            {colorHarmony.colors.map((color, index) => (
              <ColorSwatch key={index} color={color} title={`Harmony color ${index + 1}`} />
            ))}
          </HarmonyPreview>

          <Typography variant="caption" color="text.secondary" mt={1} display="block">
            {colorHarmony.description}
          </Typography>
        </Box>
      )}

      {/* Available Palettes */}
      <Box p={2}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="subtitle2">Available Palettes</Typography>
          <Typography variant="caption" color="text.secondary">
            {colorPalettes.length} palettes
          </Typography>
        </Stack>

        <PaletteGrid>
          {colorPalettes.map((palette) => {
            const isSelected = selectedPalette?.id === palette.id;

            return (
              <ColorPaletteCard
                key={palette.id}
                selected={isSelected}
                padding="sm"
                onClick={() => setPalette(palette)}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  {/* Color Preview */}
                  <Stack direction="row" spacing={0.5}>
                    <ColorSwatch color={palette.primary} />
                    <ColorSwatch color={palette.secondary} />
                    <ColorSwatch color={palette.accent} />
                  </Stack>

                  {/* Palette Info */}
                  <Box flex={1}>
                    <Typography variant="subtitle2" fontWeight="600">
                      {palette.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {palette.category}
                    </Typography>
                  </Box>

                  {/* Accessibility indicator */}
                  <AccessibilityIndicator
                    level={
                      palette.accessibility.wcagAAA
                        ? 'aaa'
                        : palette.accessibility.wcagAA
                          ? 'aa'
                          : 'fail'
                    }
                    label={
                      palette.accessibility.wcagAAA
                        ? 'AAA'
                        : palette.accessibility.wcagAA
                          ? 'AA'
                          : 'FAIL'
                    }
                    size="small"
                  />
                </Stack>
              </ColorPaletteCard>
            );
          })}
        </PaletteGrid>
      </Box>

      {/* Custom Colors */}
      {Object.keys(customColors).length > 0 && (
        <Box p={2} borderTop="1px solid" borderColor="divider">
          <Typography variant="subtitle2" gutterBottom>
            Custom Colors
          </Typography>

          <Stack direction="row" spacing={1} flexWrap="wrap">
            {Object.entries(customColors).map(([key, color]) => (
              <Stack key={key} alignItems="center" spacing={0.5}>
                <ColorSwatch color={color as string} />
                <Typography variant="caption">{key}</Typography>
              </Stack>
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default ColorSystem;

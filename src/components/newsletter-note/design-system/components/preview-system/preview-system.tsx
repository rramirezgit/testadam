import React, { useState } from 'react';

import {
  Box,
  Chip,
  Stack,
  styled,
  Switch,
  Typography,
  IconButton,
  ToggleButton,
  FormControlLabel,
  ToggleButtonGroup,
} from '@mui/material';

import { Button } from '../shared/ui';

// ============================================================================
// PREVIEW SYSTEM COMPONENT - Newsletter Design System
// ============================================================================

export interface PreviewSystemProps {
  className?: string;
}

type ViewMode = 'desktop' | 'tablet' | 'mobile';
type PreviewType = 'newsletter' | 'email' | 'web' | 'print';

interface Device {
  name: string;
  width: number;
  height: number;
  icon: string;
}

const devices: Record<ViewMode, Device> = {
  desktop: { name: 'Desktop', width: 1200, height: 800, icon: '🖥️' },
  tablet: { name: 'Tablet', width: 768, height: 1024, icon: '📱' },
  mobile: { name: 'Mobile', width: 375, height: 667, icon: '📱' },
};

const previewTypes = [
  { value: 'newsletter', label: 'Newsletter', description: 'Newsletter layout preview' },
  { value: 'email', label: 'Email Client', description: 'How it looks in email' },
  { value: 'web', label: 'Web View', description: 'Browser version' },
  { value: 'print', label: 'Print', description: 'Print-friendly version' },
];

const PreviewContainer = styled(Box)(({ theme }) => ({
  border: `2px solid ${theme.palette.divider}`,
  borderRadius: theme.spacing(1),
  backgroundColor: theme.palette.grey[100],
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 400,
}));

const DeviceFrame = styled(Box)<{
  viewMode: ViewMode;
  showFrame: boolean;
}>(({ theme, viewMode, showFrame }) => {
  const device = devices[viewMode];
  const scale = viewMode === 'desktop' ? 0.3 : viewMode === 'tablet' ? 0.4 : 0.6;

  return {
    width: device.width * scale,
    height: device.height * scale,
    backgroundColor: theme.palette.common.white,
    borderRadius: showFrame ? theme.spacing(2) : 0,
    border: showFrame ? `8px solid ${theme.palette.grey[800]}` : 'none',
    boxShadow: showFrame ? '0 8px 32px rgba(0,0,0,0.3)' : 'none',
    overflow: 'hidden',
    position: 'relative',
    transition: 'all 0.3s ease-in-out',
  };
});

const PreviewContent = styled(Box)<{ previewType: PreviewType }>(({ theme, previewType }) => ({
  width: '100%',
  height: '100%',
  padding: theme.spacing(2),
  overflow: 'auto',
  fontSize: previewType === 'print' ? '12px' : '14px',
  lineHeight: previewType === 'print' ? 1.4 : 1.6,
  '&::-webkit-scrollbar': {
    width: '4px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.grey[400],
    borderRadius: '2px',
  },
}));

const ControlPanel = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
  alignItems: 'center',
}));

const StatsBar = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  backgroundColor: theme.palette.grey[50],
  borderTop: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '0.75rem',
}));

const LoadingOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(255,255,255,0.8)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

export const PreviewSystem: React.FC<PreviewSystemProps> = ({ className }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('desktop');
  const [previewType, setPreviewType] = useState<PreviewType>('newsletter');
  const [showFrame, setShowFrame] = useState(true);
  const [showRulers, setShowRulers] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const currentDevice = devices[viewMode];
  const currentPreviewType = previewTypes.find((p) => p.value === previewType);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleExport = (format: 'pdf' | 'png' | 'html') => {
    console.log(`Exporting as ${format}...`);
    // Export functionality would be implemented here
  };

  const mockContent = {
    newsletter: (
      <Box>
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom sx={{ color: darkMode ? 'white' : 'inherit' }}>
            Tech Weekly Newsletter
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Issue #42 - March 2024
          </Typography>
        </Box>

        <Box sx={{ mb: 3, p: 2, backgroundColor: 'primary.light', borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>
            🚀 This Week&apos;s Highlights
          </Typography>
          <Typography variant="body2">
            AI breakthrough in language models, new React features, and startup funding rounds.
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ color: darkMode ? 'white' : 'inherit' }}>
            📰 Top Stories
          </Typography>
          <Typography variant="body2" paragraph>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua.
          </Typography>
          <Typography variant="body2" paragraph>
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
            commodo consequat.
          </Typography>
        </Box>

        <Box
          sx={{ textAlign: 'center', mt: 4, p: 2, backgroundColor: 'grey.100', borderRadius: 1 }}
        >
          <Typography variant="caption" color="text.secondary">
            Thanks for reading! Forward to a friend &rarr;
          </Typography>
        </Box>
      </Box>
    ),
  };

  return (
    <Box className={className}>
      {/* Controls */}
      <ControlPanel>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="caption" color="text.secondary">
            View:
          </Typography>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(_, value) => value && setViewMode(value)}
            size="small"
          >
            {Object.entries(devices).map(([key, device]) => (
              <ToggleButton key={key} value={key}>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <span style={{ fontSize: '12px' }}>{device.icon}</span>
                  <Typography variant="caption">{device.name}</Typography>
                </Stack>
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="caption" color="text.secondary">
            Type:
          </Typography>
          <ToggleButtonGroup
            value={previewType}
            exclusive
            onChange={(_, value) => value && setPreviewType(value)}
            size="small"
          >
            {previewTypes.map((type) => (
              <ToggleButton key={type.value} value={type.value}>
                {type.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Stack>

        <Stack direction="row" spacing={1}>
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={showFrame}
                onChange={(e) => setShowFrame(e.target.checked)}
              />
            }
            label={<Typography variant="caption">Device Frame</Typography>}
          />
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
              />
            }
            label={<Typography variant="caption">Dark Mode</Typography>}
          />
        </Stack>

        <Stack direction="row" spacing={1}>
          <IconButton onClick={handleRefresh} size="small" title="Refresh">
            <span>🔄</span>
          </IconButton>
          <IconButton onClick={() => handleExport('pdf')} size="small" title="Export PDF">
            <span>📄</span>
          </IconButton>
          <IconButton onClick={() => handleExport('png')} size="small" title="Export PNG">
            <span>🖼️</span>
          </IconButton>
        </Stack>
      </ControlPanel>

      {/* Preview Info */}
      <Box p={2} borderBottom="1px solid" borderColor="divider">
        <Stack direction="row" spacing={2} alignItems="center">
          <Chip
            label={`${currentDevice.width} × ${currentDevice.height}`}
            size="small"
            variant="outlined"
          />
          <Typography variant="caption" color="text.secondary">
            {currentPreviewType?.description}
          </Typography>
          <Chip label={viewMode.toUpperCase()} size="small" color="primary" />
        </Stack>
      </Box>

      {/* Preview Area */}
      <PreviewContainer>
        <DeviceFrame viewMode={viewMode} showFrame={showFrame}>
          <PreviewContent
            previewType={previewType}
            sx={{
              backgroundColor: darkMode ? 'grey.900' : 'background.paper',
              color: darkMode ? 'common.white' : 'text.primary',
            }}
          >
            {mockContent.newsletter}
          </PreviewContent>

          {isLoading && (
            <LoadingOverlay>
              <Typography variant="caption" color="text.secondary">
                Refreshing preview...
              </Typography>
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  border: '2px solid #ccc',
                  borderTop: '2px solid #1976d2',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                  },
                }}
              />
            </LoadingOverlay>
          )}
        </DeviceFrame>
      </PreviewContainer>

      {/* Stats */}
      <StatsBar>
        <Stack direction="row" spacing={2}>
          <Typography variant="caption">
            Dimensions: {currentDevice.width} × {currentDevice.height}
          </Typography>
          <Typography variant="caption">
            Scale: {viewMode === 'desktop' ? '30%' : viewMode === 'tablet' ? '40%' : '60%'}
          </Typography>
          <Typography variant="caption">Mode: {previewType}</Typography>
        </Stack>

        <Stack direction="row" spacing={2}>
          <Typography variant="caption" color="success.main">
            ✓ Responsive
          </Typography>
          <Typography variant="caption" color="success.main">
            ✓ Accessible
          </Typography>
          <Typography variant="caption" color="warning.main">
            ⚠ Large images
          </Typography>
        </Stack>
      </StatsBar>

      {/* Export Options */}
      <Box p={2}>
        <Typography variant="subtitle2" gutterBottom>
          Export Options
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<span>📄</span>}
            onClick={() => handleExport('pdf')}
          >
            Export PDF
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<span>🖼️</span>}
            onClick={() => handleExport('png')}
          >
            Export PNG
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<span>📝</span>}
            onClick={() => handleExport('html')}
          >
            Export HTML
          </Button>
          <Button variant="primary" size="sm">
            Share Preview
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default PreviewSystem;

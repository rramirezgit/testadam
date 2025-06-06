import React, { useState } from 'react';

import { Box, Stack, Drawer, styled, Divider, IconButton, Typography } from '@mui/material';

import { Tabs, Button } from '../shared/ui';
import ColorSystem from '../color-system/color-system';
import LayoutSystem from '../layout-system/layout-system';
import PreviewSystem from '../preview-system/preview-system';
import TemplateSelector from '../template-selector/template-selector';
import TypographySystem from '../typography-system/typography-system';
import { useDesignState, useColorPalette, useTemplateManager } from '../../';

import type { HeaderTemplate, FooterTemplate } from '../../types';
import type { DesignTab, DesignPanelProps } from './design-panel.types';

// Updated components with real functionality
const TemplatesTab = ({ onUpdateNewsletter }: any) => {
  const { applyHeaderTemplate, applyFooterTemplate } = useDesignState();
  const [templateType, setTemplateType] = useState<'header' | 'footer'>('header');

  const handleSelectTemplate = (template: HeaderTemplate | FooterTemplate) => {
    if (templateType === 'header') {
      applyHeaderTemplate(template as HeaderTemplate);
    } else {
      applyFooterTemplate(template as FooterTemplate);
    }

    // Update newsletter with the new template
    onUpdateNewsletter({
      [templateType]: template,
    });
  };

  return (
    <Box>
      {/* Template Type Selector */}
      <Box p={2} borderBottom="1px solid" borderColor="divider">
        <Tabs
          tabs={[
            { id: 'header', label: 'Header Templates', icon: <span>📰</span> },
            { id: 'footer', label: 'Footer Templates', icon: <span>📄</span> },
          ]}
          value={templateType}
          onChange={(value) => setTemplateType(value as 'header' | 'footer')}
          variant="underline"
          size="sm"
        />
      </Box>

      {/* Template Selector */}
      <TemplateSelector type={templateType} onSelectTemplate={handleSelectTemplate} />
    </Box>
  );
};

const ColorsTab = () => {
  const { applyColorPalette } = useDesignState();

  return <ColorSystem />;
};

const TypographyTab = () => <TypographySystem />;

const LayoutTab = () => <LayoutSystem />;

const PreviewTab = () => <PreviewSystem />;

// ============================================================================
// DESIGN PANEL COMPONENT - Newsletter Design System
// ============================================================================

const PANEL_WIDTH = 400;

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: PANEL_WIDTH,
    boxSizing: 'border-box',
    borderLeft: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    flexDirection: 'column',
  },
}));

const PanelHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.paper,
}));

const PanelContent = styled(Box)({
  flex: 1,
  overflow: 'auto',
  display: 'flex',
  flexDirection: 'column',
});

const ActionBar = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  display: 'flex',
  gap: theme.spacing(1),
  justifyContent: 'space-between',
}));

export const DesignPanel: React.FC<DesignPanelProps> = ({
  isOpen,
  onClose,
  newsletter,
  onUpdateNewsletter,
  className,
}) => {
  const [activeTab, setActiveTab] = useState<DesignTab>('templates');

  // Design System Hooks
  const { designState, canUndo, canRedo, undo, redo, hasUnsavedChanges } = useDesignState();

  const { templateStats } = useTemplateManager();
  const { paletteStats } = useColorPalette();

  const tabs = [
    {
      id: 'templates' as DesignTab,
      label: 'Templates',
      icon: <span>📋</span>,
    },
    {
      id: 'colors' as DesignTab,
      label: 'Colors',
      icon: <span>🎨</span>,
    },
    {
      id: 'typography' as DesignTab,
      label: 'Typography',
      icon: <span>📝</span>,
    },
    {
      id: 'layout' as DesignTab,
      label: 'Layout',
      icon: <span>📐</span>,
    },
    {
      id: 'preview' as DesignTab,
      label: 'Preview',
      icon: <span>👁️</span>,
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'templates':
        return <TemplatesTab onUpdateNewsletter={onUpdateNewsletter} />;
      case 'colors':
        return <ColorsTab />;
      case 'typography':
        return <TypographyTab />;
      case 'layout':
        return <LayoutTab />;
      case 'preview':
        return <PreviewTab />;
      default:
        return null;
    }
  };

  return (
    <StyledDrawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      className={className}
      variant="persistent"
    >
      {/* Header */}
      <PanelHeader>
        <Typography variant="h6" fontWeight="600">
          Design Panel
        </Typography>
        <IconButton onClick={onClose} size="small">
          <span>✕</span>
        </IconButton>
      </PanelHeader>

      {/* Tabs Navigation */}
      <Box px={2} pt={2}>
        <Tabs
          tabs={tabs}
          value={activeTab}
          onChange={(value) => setActiveTab(value as DesignTab)}
          variant="pills"
          size="sm"
          orientation="horizontal"
        />
      </Box>

      <Divider />

      {/* Tab Content */}
      <PanelContent>{renderTabContent()}</PanelContent>

      {/* Action Bar */}
      <ActionBar>
        <Stack direction="row" spacing={1}>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<span>↶</span>}
            onClick={undo}
            disabled={!canUndo}
          >
            Undo
          </Button>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<span>↷</span>}
            onClick={redo}
            disabled={!canRedo}
          >
            Redo
          </Button>
        </Stack>

        <Stack direction="row" spacing={1}>
          {hasUnsavedChanges && (
            <Typography variant="caption" color="warning.main">
              Unsaved changes
            </Typography>
          )}
          <Button variant="primary" size="sm" onClick={onClose}>
            Done
          </Button>
        </Stack>
      </ActionBar>

      {/* Debug Info - Development only */}
      {process.env.NODE_ENV === 'development' && (
        <Box p={1} bgcolor="grey.100">
          <Typography variant="caption" display="block">
            Templates: {templateStats.total} | Colors: {paletteStats.total}
          </Typography>
          <Typography variant="caption" display="block">
            Active Tab: {activeTab} | Has Changes: {hasUnsavedChanges ? 'Yes' : 'No'}
          </Typography>
        </Box>
      )}
    </StyledDrawer>
  );
};

export default DesignPanel;

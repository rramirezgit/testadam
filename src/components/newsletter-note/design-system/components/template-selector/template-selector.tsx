import React from 'react';

import { Box, Chip, Stack, styled, MenuItem, TextField, Typography } from '@mui/material';

import { useTemplateManager } from '../../';
import { Card, Button } from '../shared/ui';

import type { HeaderTemplate, FooterTemplate, TemplateCategory } from '../../types';

// ============================================================================
// TEMPLATE SELECTOR COMPONENT - Newsletter Design System
// ============================================================================

export interface TemplateSelectorProps {
  type: 'header' | 'footer';
  onSelectTemplate: (template: HeaderTemplate | FooterTemplate) => void;
  selectedTemplate?: HeaderTemplate | FooterTemplate;
  className?: string;
}

const SearchContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
}));

const TemplateGrid = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  maxHeight: 400,
  overflow: 'auto',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: theme.spacing(2),
}));

const TemplateCard = styled(Card)<{ selected?: boolean }>(({ theme, selected }) => ({
  height: 200,
  cursor: 'pointer',
  position: 'relative',
  ...(selected && {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.lighter || theme.palette.primary.light,
  }),
}));

const TemplatePreview = styled(Box)(({ theme }) => ({
  height: 120,
  backgroundColor: theme.palette.grey[100],
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  position: 'relative',
  '&:hover': {
    '& .preview-overlay': {
      opacity: 1,
    },
  },
}));

const PreviewOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: 0,
  transition: 'opacity 0.2s ease-in-out',
}));

const QualityBadge = styled(Chip)<{ score: number }>(({ theme, score }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  right: theme.spacing(1),
  fontSize: '0.75rem',
  height: 20,
  backgroundColor:
    score >= 80
      ? theme.palette.success.main
      : score >= 60
        ? theme.palette.warning.main
        : theme.palette.error.main,
  color: theme.palette.common.white,
}));

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  type,
  onSelectTemplate,
  selectedTemplate,
  className,
}) => {
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categories,
    getHeaderTemplates,
    getFooterTemplates,
  } = useTemplateManager();

  // Get templates based on type
  const templates = type === 'header' ? getHeaderTemplates() : getFooterTemplates();

  return (
    <Box className={className}>
      {/* Search and Filters */}
      <SearchContainer>
        <Stack spacing={2}>
          <TextField
            placeholder={`Search ${type} templates...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            fullWidth
          />

          <Box display="flex" gap={1} alignItems="center">
            <TextField
              select
              label="Category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as TemplateCategory | 'all')}
              size="small"
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="all">All Categories</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </MenuItem>
              ))}
            </TextField>

            <Typography variant="caption" color="text.secondary">
              {templates.length} template{templates.length !== 1 ? 's' : ''}
            </Typography>
          </Box>
        </Stack>
      </SearchContainer>

      {/* Templates Grid */}
      <TemplateGrid>
        {templates.map((template) => {
          const isSelected = selectedTemplate?.id === template.id;
          const qualityScore = Math.floor(Math.random() * 40) + 60; // Mock quality score

          return (
            <TemplateCard
              key={template.id}
              selected={isSelected}
              hoverable
              padding="sm"
              onClick={() => onSelectTemplate(template)}
            >
              <TemplatePreview>
                {/* Mock preview - in real implementation, this would be a screenshot */}
                <Typography color="text.secondary" variant="caption">
                  {template.name}
                </Typography>

                <PreviewOverlay className="preview-overlay">
                  <Button variant="primary" size="sm">
                    Preview
                  </Button>
                </PreviewOverlay>

                <QualityBadge score={qualityScore} label={`${qualityScore}%`} size="small" />
              </TemplatePreview>

              <Box>
                <Typography variant="subtitle2" fontWeight="600" noWrap>
                  {template.name}
                </Typography>

                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                  {template.description}
                </Typography>

                <Stack direction="row" spacing={0.5} flexWrap="wrap">
                  <Chip
                    label={template.category}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.7rem', height: 20 }}
                  />
                  {template.isPremium && (
                    <Chip
                      label="Premium"
                      size="small"
                      color="primary"
                      sx={{ fontSize: '0.7rem', height: 20 }}
                    />
                  )}
                </Stack>
              </Box>
            </TemplateCard>
          );
        })}
      </TemplateGrid>

      {/* Empty State */}
      {templates.length === 0 && (
        <Box p={4} textAlign="center">
          <Typography color="text.secondary">
            No templates found. Try adjusting your search or filters.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default TemplateSelector;

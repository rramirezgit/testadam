'use client';

import type { Editor } from '@tiptap/react';
import type { EmailComponent } from 'src/types/saved-note';
import type { BannerOption } from 'src/components/newsletter-note/banner-selector';

import { Icon } from '@iconify/react';
import React, { memo, useMemo } from 'react';

import { Box, Button, Typography } from '@mui/material';

import EmailList from './email-list';
import EmailComponentRenderer from './email-component-renderer';

interface EmailContentProps {
  getActiveComponents: () => EmailComponent[];
  selectedComponentId: string | null;
  setSelectedComponentId: (id: string | null) => void;
  updateComponentContent: (id: string, content: string) => void;
  updateComponentProps: (id: string, props: Record<string, any>) => void;
  updateComponentStyle: (id: string, style: React.CSSProperties) => void;
  handleSelectionUpdate: (editor: Editor) => void;
  moveComponent: (id: string, direction: 'up' | 'down') => void;
  removeComponent: (id: string) => void;
  addComponent: (type: any) => void;
  editMode: boolean;
  selectedBanner: string | null;
  bannerOptions: BannerOption[];
  emailBackground: string;
  showGradient: boolean;
  gradientColors: string[];
  addListItem: (listId: string) => void;
  removeListItem: (listId: string, itemIndex: number) => void;
  updateListItem: (listId: string, itemIndex: number, content: string) => void;
  onContainerClick: () => void;
  isContainerSelected: boolean;
  containerBorderWidth: number;
  containerBorderColor: string;
  containerBorderRadius: number;
  containerPadding: number;
  containerMaxWidth: number;
  activeTemplate: string;
  activeVersion: 'newsletter' | 'web';
}

const EmailContent = memo(
  ({
    getActiveComponents,
    selectedComponentId,
    setSelectedComponentId,
    updateComponentContent,
    updateComponentProps,
    updateComponentStyle,
    handleSelectionUpdate,
    moveComponent,
    removeComponent,
    addComponent,
    editMode,
    selectedBanner,
    bannerOptions,
    emailBackground,
    showGradient,
    gradientColors,
    addListItem,
    removeListItem,
    updateListItem,
    onContainerClick,
    isContainerSelected,
    containerBorderWidth,
    containerBorderColor,
    containerBorderRadius,
    containerPadding,
    containerMaxWidth,
    activeTemplate,
    activeVersion,
  }: EmailContentProps) => {
    // Memoizar los componentes para evitar recálculos innecesarios
    const components = useMemo(() => getActiveComponents(), [getActiveComponents]);

    // Memoizar el estilo de fondo
    const backgroundStyle = useMemo((): React.CSSProperties => {
      if (selectedBanner) {
        const banner = bannerOptions.find((b) => b.id === selectedBanner);
        if (banner) {
          if (banner.gradient) {
            return {
              background: `linear-gradient(to bottom, ${banner.gradient[0]}, ${banner.gradient[1]})`,
              padding: '24px',
              borderRadius: '12px',
            };
          } else if (banner.pattern) {
            // Aplicar patrones como fondos
            if (banner.pattern === 'dots') {
              return {
                backgroundColor: banner.color,
                backgroundImage: 'radial-gradient(#00000010 1px, transparent 1px)',
                backgroundSize: '10px 10px',
                padding: '24px',
                borderRadius: '12px',
              };
            } else if (banner.pattern === 'lines') {
              return {
                backgroundColor: banner.color,
                backgroundImage: 'linear-gradient(#00000010 1px, transparent 1px)',
                backgroundSize: '100% 10px',
                padding: '24px',
                borderRadius: '12px',
              };
            }
          } else {
            return {
              backgroundColor: banner.color,
              padding: '24px',
              borderRadius: '12px',
            };
          }
        }
      } else if (showGradient) {
        return {
          background: `linear-gradient(to bottom, ${gradientColors[0]}, ${gradientColors[1]})`,
          padding: '24px',
          borderRadius: '12px',
        };
      } else {
        return {
          backgroundColor: emailBackground,
          padding: '24px',
          borderRadius: '12px',
        };
      }
      return {};
    }, [selectedBanner, bannerOptions, showGradient, gradientColors, emailBackground]);

    // Memoizar renderBulletList
    const renderBulletList = useMemo(
      () => (component: EmailComponent) => (
        <EmailList
          component={component}
          updateListItem={updateListItem}
          removeListItem={removeListItem}
          addListItem={addListItem}
          updateComponentProps={updateComponentProps}
        />
      ),
      [updateListItem, removeListItem, addListItem, updateComponentProps]
    );

    if (components.length === 0) {
      return (
        <Box
          sx={{
            ...backgroundStyle,
            cursor: 'pointer',
            border: isContainerSelected ? '2px solid #1976d2' : 'none',
            borderRadius: isContainerSelected ? '8px' : '0px',
          }}
          onClick={(e) => {
            e.stopPropagation();
            onContainerClick();
          }}
        >
          <Box
            sx={{
              maxWidth: `${containerMaxWidth}px`,
              margin: '0 auto',
              padding: `${containerPadding}px`,
              borderRadius: `${containerBorderRadius}px`,
              border: `${containerBorderWidth}px solid ${containerBorderColor}`,
              textAlign: 'center',
              py: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon
              icon="mdi:email-outline"
              style={{
                fontSize: 64,
                color: 'rgba(0,0,0,0.2)',
                marginBottom: 16,
              }}
            />
            <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary' }}>
              Tu email está vacío
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400 }}>
              Comienza a añadir componentes desde el panel lateral izquierdo para crear tu email.
            </Typography>
            <Button
              variant="contained"
              startIcon={<Icon icon="mdi:plus" />}
              onClick={(e) => {
                e.stopPropagation();
                addComponent('paragraph');
              }}
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              Añadir párrafo
            </Button>
          </Box>
        </Box>
      );
    }

    return (
      <Box
        sx={{
          ...backgroundStyle,
          cursor: activeTemplate === 'news' && activeVersion === 'web' ? 'default' : 'pointer',
          border:
            isContainerSelected && (activeTemplate !== 'news' || activeVersion === 'newsletter')
              ? '2px solid #1976d2'
              : 'none',
          borderRadius:
            isContainerSelected && (activeTemplate !== 'news' || activeVersion === 'newsletter')
              ? '8px'
              : '0px',
        }}
        onClick={(e) => {
          e.stopPropagation();
          // Solo permitir clic del contenedor si NO es template 'news' + versión web
          if (!(activeTemplate === 'news' && activeVersion === 'web')) {
            onContainerClick();
          }
        }}
      >
        {/* nuevo borde de la nota - Template 'news': SOLO en newsletter, NO en web */}
        <Box
          sx={{
            maxWidth:
              activeTemplate === 'news' && activeVersion === 'web'
                ? 'unset'
                : `${containerMaxWidth}px`,
            margin: '0 auto',
            padding:
              activeTemplate === 'news' && activeVersion === 'web' ? '0' : `${containerPadding}px`,
            borderRadius:
              activeTemplate === 'news' && activeVersion === 'web'
                ? '0'
                : `${containerBorderRadius}px`,
            border:
              activeTemplate === 'news' && activeVersion === 'web'
                ? 'none'
                : `${containerBorderWidth}px solid ${containerBorderColor}`,
          }}
        >
          {components.map((component, index) => (
            <EmailComponentRenderer
              key={component.id}
              component={component}
              index={index}
              isSelected={component.id === selectedComponentId}
              onSelect={() => setSelectedComponentId(component.id)}
              updateComponentContent={updateComponentContent}
              updateComponentProps={updateComponentProps}
              handleSelectionUpdate={handleSelectionUpdate}
              moveComponent={moveComponent}
              removeComponent={removeComponent}
              totalComponents={components.length}
              renderCustomContent={component.type === 'bulletList' ? renderBulletList : undefined}
            />
          ))}
        </Box>
      </Box>
    );
  }
);

EmailContent.displayName = 'EmailContent';

export default EmailContent;

'use client';

import type React from 'react';
import type { Editor } from '@tiptap/react';
import type { EmailComponent } from 'src/types/saved-note';
import type { BannerOption } from 'src/components/newsletter-note/banner-selector';

import { Icon } from '@iconify/react';

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
}

export default function EmailContent({
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
}: EmailContentProps) {
  const components = getActiveComponents();

  // Determinar el estilo de fondo basado en la selección
  let backgroundStyle: React.CSSProperties = {};
  if (selectedBanner) {
    const banner = bannerOptions.find((b) => b.id === selectedBanner);
    if (banner) {
      if (banner.gradient) {
        backgroundStyle = {
          background: `linear-gradient(to bottom, ${banner.gradient[0]}, ${banner.gradient[1]})`,
          padding: '24px',
          borderRadius: '12px',
        };
      } else if (banner.pattern) {
        // Aplicar patrones como fondos
        if (banner.pattern === 'dots') {
          backgroundStyle = {
            backgroundColor: banner.color,
            backgroundImage: 'radial-gradient(#00000010 1px, transparent 1px)',
            backgroundSize: '10px 10px',
            padding: '24px',
            borderRadius: '12px',
          };
        } else if (banner.pattern === 'lines') {
          backgroundStyle = {
            backgroundColor: banner.color,
            backgroundImage: 'linear-gradient(#00000010 1px, transparent 1px)',
            backgroundSize: '100% 10px',
            padding: '24px',
            borderRadius: '12px',
          };
        }
      } else {
        backgroundStyle = {
          backgroundColor: banner.color,
          padding: '24px',
          borderRadius: '12px',
        };
      }
    }
  } else if (showGradient) {
    backgroundStyle = {
      background: `linear-gradient(to bottom, ${gradientColors[0]}, ${gradientColors[1]})`,
      padding: '24px',
      borderRadius: '12px',
    };
  } else {
    backgroundStyle = {
      backgroundColor: emailBackground,
      padding: '24px',
      borderRadius: '12px',
    };
  }

  if (components.length === 0) {
    return (
      <Box sx={backgroundStyle}>
        <Box
          sx={{
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
            onClick={() => addComponent('paragraph')}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            Añadir Componente
          </Button>
        </Box>
      </Box>
    );
  }

  const renderBulletList = (component: EmailComponent) => (
    <EmailList
      component={component}
      updateListItem={updateListItem}
      removeListItem={removeListItem}
      addListItem={addListItem}
      updateComponentProps={updateComponentProps}
    />
  );

  // Función auxiliar para generar el marcador de lista ordenada
  const getOrderedListMarker = (index: number, listStyle: string): string => {
    switch (listStyle) {
      case 'decimal':
        return `${index}.`;
      case 'lower-alpha':
        return `${String.fromCharCode(96 + index)}.`;
      case 'upper-alpha':
        return `${String.fromCharCode(64 + index)}.`;
      case 'lower-roman':
        return `${toRoman(index).toLowerCase()}.`;
      case 'upper-roman':
        return `${toRoman(index)}.`;
      default:
        return `${index}.`;
    }
  };

  // Función para convertir números a numerales romanos
  const toRoman = (num: number): string => {
    const romanNumerals = [
      { value: 1000, numeral: 'M' },
      { value: 900, numeral: 'CM' },
      { value: 500, numeral: 'D' },
      { value: 400, numeral: 'CD' },
      { value: 100, numeral: 'C' },
      { value: 90, numeral: 'XC' },
      { value: 50, numeral: 'L' },
      { value: 40, numeral: 'XL' },
      { value: 10, numeral: 'X' },
      { value: 9, numeral: 'IX' },
      { value: 5, numeral: 'V' },
      { value: 4, numeral: 'IV' },
      { value: 1, numeral: 'I' },
    ];

    let result = '';
    let remaining = num;

    for (const { value, numeral } of romanNumerals) {
      while (remaining >= value) {
        result += numeral;
        remaining -= value;
      }
    }

    return result;
  };

  return (
    <Box sx={backgroundStyle}>
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
      {editMode && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            variant="outlined"
            startIcon={<Icon icon="mdi:plus" />}
            onClick={() => addComponent('paragraph')}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
            }}
          >
            Añadir Componente
          </Button>
        </Box>
      )}
    </Box>
  );
}

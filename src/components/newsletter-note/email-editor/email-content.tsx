'use client';

import type { Editor } from '@tiptap/react';
import type { EmailComponent } from 'src/types/saved-note';
import type { BannerOption } from 'src/components/newsletter-note/banner-selector';

import { Icon } from '@iconify/react';
import React, { memo, useMemo } from 'react';

import { Box, Paper, Button, Typography } from '@mui/material';

import EmailList from './email-list';
import EmailComponentRenderer from './email-component-renderer';
import ComponentWithToolbar from './email-components/ComponentWithToolbar';

import type { NewsletterNote, NewsletterHeader, NewsletterFooter } from './types';

interface EmailContentProps {
  getActiveComponents: () => EmailComponent[];
  selectedComponentId: string | null;
  setSelectedComponentId: (id: string | null) => void;
  onComponentSelect?: (id: string | null) => void;
  onColumnSelect?: (componentId: string, column: 'left' | 'right') => void;
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
  // Nuevas props para newsletter
  isNewsletterMode?: boolean;
  newsletterNotes?: NewsletterNote[];
  onMoveNewsletterNote?: (noteId: string, direction: 'up' | 'down') => void;
  onRemoveNewsletterNote?: (noteId: string) => void;
  onEditNewsletterNote?: (note: any) => void;
  // Nuevas props para preview HTML
  showNewsletterPreview?: boolean;
  newsletterHtml?: string;
  // Nuevas funciones para editar componentes de newsletter
  updateNewsletterNoteComponentContent?: (
    noteId: string,
    componentId: string,
    content: string
  ) => void;
  updateNewsletterNoteComponentProps?: (
    noteId: string,
    componentId: string,
    props: Record<string, any>
  ) => void;
  updateNewsletterNoteComponentStyle?: (
    noteId: string,
    componentId: string,
    style: React.CSSProperties
  ) => void;
  moveNewsletterNoteComponent?: (
    noteId: string,
    componentId: string,
    direction: 'up' | 'down'
  ) => void;
  removeNewsletterNoteComponent?: (noteId: string, componentId: string) => void;
  // Función para manejar el estado del contenedor newsletter
  onNewsletterContainerClick?: () => void;
  // Props para componentes de newsletter (header y footer)
  newsletterHeader?: NewsletterHeader;
  newsletterFooter?: NewsletterFooter;
  onNewsletterHeaderUpdate?: (header: NewsletterHeader) => void;
  onNewsletterFooterUpdate?: (footer: NewsletterFooter) => void;
  // Nueva prop para eliminar contenedores de nota
  removeNoteContainer?: (containerId: string) => void;
  // Prop para la columna seleccionada
  selectedColumn?: 'left' | 'right';
}

// Componente para el header del newsletter
const NewsletterHeaderComponent = ({
  isSelected,
  onSelect,
  header,
}: {
  isSelected: boolean;
  onSelect: () => void;
  header?: NewsletterHeader;
}) => {
  // Extraer valores para aplicar directamente en el sx prop
  const useGradient = header?.useGradient;
  const gradientColor1 = header?.gradientColors?.[0];
  const gradientColor2 = header?.gradientColors?.[1];
  const gradientDirection = header?.gradientDirection;
  const backgroundColor = header?.backgroundColor;

  return (
    <Paper
      key={`header-${useGradient}-${gradientColor1}-${gradientColor2}-${backgroundColor}`}
      elevation={isSelected ? 3 : 1}
      sx={{
        mb: 3,
        p: header?.padding ? header.padding / 8 : 3,
        border: isSelected ? '2px solid #1976d2' : '1px solid #e0e0e0',
        borderRadius: 2,
        cursor: 'pointer',
        transition: 'all 0.2s',
        textAlign: header?.alignment || 'center',
        position: 'relative',
        // Aplicar el backgroundStyle
        ...(useGradient && gradientColor1 && gradientColor2
          ? {
              backgroundImage: `linear-gradient(${gradientDirection || 135}deg, ${gradientColor1}, ${gradientColor2})`,
              backgroundColor: 'transparent',
            }
          : {
              backgroundColor: backgroundColor || '#f5f5f5',
              backgroundImage: 'none',
            }),
        '&:hover': {
          elevation: 2,
          borderColor: '#1976d2',
        },
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      <Box sx={{ position: 'relative' }}>
        {/* Logo si está habilitado */}
        {header?.showLogo && header?.logo && (
          <Box sx={{ mb: 2 }}>
            <img
              src={header.logo}
              alt={header.logoAlt || 'Logo'}
              style={{
                maxHeight: header.logoHeight || 60,
                display: 'block',
                margin: '0 auto',
              }}
            />
          </Box>
        )}

        {/* Sponsor si está habilitado */}
        {header?.sponsor?.enabled && header?.sponsor?.image && (
          <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ color: header.textColor, mb: 1 }}>
              {header.sponsor.label || 'Juntos con'}
            </Typography>
            <img
              src={header.sponsor.image}
              alt={header.sponsor.imageAlt || 'Sponsor'}
              style={{ maxHeight: 48 }}
            />
          </Box>
        )}

        {/* Título solo si no está vacío */}
        {header?.title && header.title.trim() !== '' && (
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: header?.textColor || '#333333',
              mb: 1,
              textShadow: '0 1px 2px rgba(0,0,0,0.1)',
            }}
          >
            {header.title}
          </Typography>
        )}

        {/* Subtítulo solo si no está vacío */}
        {header?.subtitle && header.subtitle.trim() !== '' && (
          <Typography
            variant="subtitle1"
            sx={{
              color: header?.textColor || '#666666',
              mb: 2,
              fontStyle: 'italic',
            }}
          >
            {header.subtitle}
          </Typography>
        )}

        {/* Banner image si está habilitado y existe */}
        {header?.showBanner && header?.bannerImage && (
          <Box sx={{ mt: 2 }}>
            <img
              src={header.bannerImage}
              alt="Banner"
              style={{
                width: '100%',
                borderRadius: '8px',
                display: 'block',
              }}
            />
          </Box>
        )}

        {/* Indicador de edición */}
        <Box
          sx={{
            position: 'absolute',
            top: -8,
            right: -8,
            backgroundColor: '#1976d2',
            color: 'white',
            borderRadius: '50%',
            width: 24,
            height: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            opacity: isSelected ? 1 : 0,
            transition: 'opacity 0.2s',
          }}
        >
          <Icon icon="mdi:pencil" width={12} height={12} />
        </Box>
      </Box>
    </Paper>
  );
};

// Componente para el footer del newsletter
const NewsletterFooterComponent = ({
  isSelected,
  onSelect,
  footer,
}: {
  isSelected: boolean;
  onSelect: () => void;
  footer?: NewsletterFooter;
}) => {
  // Extraer valores para aplicar directamente en el sx prop
  const useGradient = footer?.useGradient;
  const gradientColor1 = footer?.gradientColors?.[0];
  const gradientColor2 = footer?.gradientColors?.[1];
  const gradientDirection = footer?.gradientDirection;
  const backgroundColor = footer?.backgroundColor;

  // Filtrar redes sociales habilitadas
  const enabledSocialLinks = useMemo(
    () => footer?.socialLinks?.filter((link) => link.enabled) || [],
    [footer?.socialLinks]
  );

  return (
    <Paper
      key={`footer-${useGradient}-${gradientColor1}-${gradientColor2}-${backgroundColor}`}
      elevation={isSelected ? 3 : 1}
      sx={{
        mt: 4,
        p: footer?.padding ? footer.padding / 8 : 3,
        border: isSelected ? '2px solid #1976d2' : '1px solid #e0e0e0',
        borderRadius: 2,
        cursor: 'pointer',
        transition: 'all 0.2s',
        textAlign: 'center',
        position: 'relative',
        // Aplicar el backgroundStyle
        ...(useGradient && gradientColor1 && gradientColor2
          ? {
              backgroundImage: `linear-gradient(${gradientDirection || 180}deg, ${gradientColor1} 0%, ${gradientColor2} 100%)`,
              backgroundColor: 'transparent',
            }
          : {
              backgroundColor: backgroundColor || '#f5f5f5',
              backgroundImage: 'none',
            }),
        '&:hover': {
          elevation: 2,
          borderColor: '#1976d2',
        },
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: footer?.textColor || '#333',
            mb: 1,
            fontSize: footer?.fontSize ? `${footer.fontSize + 4}px` : '1.125rem',
          }}
        >
          {footer?.companyName || 'Tu Empresa'}
        </Typography>

        {footer?.showAddress && footer?.address && (
          <Typography
            variant="body2"
            sx={{
              color: footer?.textColor || '#666',
              mb: 1,
              fontSize: footer?.fontSize ? `${footer.fontSize}px` : '0.875rem',
            }}
          >
            {footer.address}
          </Typography>
        )}

        {footer?.contactEmail && (
          <Typography
            variant="body2"
            sx={{
              color: footer?.textColor || '#666',
              mb: 2,
              fontSize: footer?.fontSize ? `${footer.fontSize}px` : '0.875rem',
            }}
          >
            Contacto: {footer.contactEmail}
          </Typography>
        )}

        {footer?.showSocial && enabledSocialLinks.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
            <Typography
              variant="caption"
              sx={{
                color: footer?.textColor || '#666',
                fontSize: footer?.fontSize ? `${footer.fontSize - 2}px` : '0.75rem',
              }}
            >
              {enabledSocialLinks
                .map((link) => link.platform.charAt(0).toUpperCase() + link.platform.slice(1))
                .join(' • ')}
            </Typography>
          </Box>
        )}

        <Typography
          variant="caption"
          sx={{
            color: footer?.textColor || '#999',
            fontSize: footer?.fontSize ? `${footer.fontSize - 2}px` : '0.75rem',
          }}
        >
          © {new Date().getFullYear()} {footer?.companyName || 'Tu Empresa'}. Todos los derechos
          reservados.
        </Typography>

        {/* Indicador de edición */}
        <Box
          sx={{
            position: 'absolute',
            top: -8,
            right: -8,
            backgroundColor: '#1976d2',
            color: 'white',
            borderRadius: '50%',
            width: 24,
            height: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            opacity: isSelected ? 1 : 0,
            transition: 'opacity 0.2s',
          }}
        >
          <Icon icon="mdi:pencil" width={12} height={12} />
        </Box>
      </Box>
    </Paper>
  );
};

const EmailContent = memo(
  ({
    getActiveComponents,
    selectedComponentId,
    setSelectedComponentId,
    onComponentSelect = () => {},
    onColumnSelect = () => {},
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
    // Nuevas props para newsletter
    isNewsletterMode = false,
    newsletterNotes = [],
    onMoveNewsletterNote = () => {},
    onRemoveNewsletterNote = () => {},
    onEditNewsletterNote = () => {},
    // Nuevas props para preview HTML
    showNewsletterPreview = false,
    newsletterHtml = '',
    // Nuevas funciones para editar componentes de newsletter
    updateNewsletterNoteComponentContent = () => {},
    updateNewsletterNoteComponentProps = () => {},
    updateNewsletterNoteComponentStyle = () => {},
    moveNewsletterNoteComponent = () => {},
    removeNewsletterNoteComponent = () => {},
    // Función para manejar el estado del contenedor newsletter
    onNewsletterContainerClick = () => {},
    // Props para componentes de newsletter (header y footer)
    newsletterHeader,
    newsletterFooter,
    onNewsletterHeaderUpdate = () => {},
    onNewsletterFooterUpdate = () => {},
    // Nueva prop para eliminar contenedores de nota
    removeNoteContainer = () => {},
    // Prop para la columna seleccionada
    selectedColumn = 'left',
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

    const body = (
      <Box
        sx={{
          ...backgroundStyle,
          cursor: 'pointer',
          // border: isContainerSelected ? '2px solid #1976d2' : 'none',
          // borderRadius: isContainerSelected ? '8px' : '0px',
        }}
        onClick={(e) => {
          e.stopPropagation();
          onContainerClick();
        }}
      >
        <Box
          sx={{
            margin: '0 auto',
            padding: `${containerPadding}px`,
            ...(isNewsletterMode
              ? {
                  // Sin bordes para newsletter
                  borderRadius: 0,
                  border: 'none',
                  maxWidth: '100%',
                }
              : (activeTemplate === 'news' ||
                    activeTemplate === 'market' ||
                    activeTemplate === 'storyboard') &&
                  activeVersion === 'web'
                ? {
                    // Sin bordes para la versión web del template de noticias/mercado/storyboard
                    borderRadius: 0,
                    border: 'none',
                  }
                : {
                    // Bordes normales para otros casos
                    borderRadius: `${containerBorderRadius}px`,
                    border: `${containerBorderWidth}px solid ${containerBorderColor}`,
                    maxWidth: `${containerMaxWidth}px`,
                  }),
          }}
        >
          {components.map((component, index) => {
            if (component.type === 'noteContainer') {
              return (
                <ComponentWithToolbar
                  key={component.id}
                  isSelected={selectedComponentId === component.id}
                  index={index}
                  totalComponents={components.length}
                  componentId={component.id}
                  moveComponent={moveComponent}
                  removeComponent={removeComponent}
                  onClick={() => {
                    setSelectedComponentId(component.id);
                    onComponentSelect(component.id);
                  }}
                >
                  <EmailComponentRenderer
                    component={component}
                    index={index}
                    isSelected={selectedComponentId === component.id}
                    onSelect={() => {
                      setSelectedComponentId(component.id);
                      onComponentSelect(component.id);
                    }}
                    updateComponentContent={updateComponentContent}
                    updateComponentProps={updateComponentProps}
                    handleSelectionUpdate={handleSelectionUpdate}
                    moveComponent={moveComponent}
                    removeComponent={removeComponent}
                    totalComponents={components.length}
                    getActiveComponents={getActiveComponents}
                    onComponentSelect={onComponentSelect}
                    selectedComponentId={selectedComponentId}
                  />
                </ComponentWithToolbar>
              );
            }
            // Renderizado normal para otros componentes
            return (
              <EmailComponentRenderer
                key={component.id}
                component={component}
                index={index}
                isSelected={selectedComponentId === component.id}
                onSelect={() => {
                  setSelectedComponentId(component.id);
                  onComponentSelect(component.id);
                }}
                updateComponentContent={updateComponentContent}
                updateComponentProps={updateComponentProps}
                handleSelectionUpdate={handleSelectionUpdate}
                moveComponent={moveComponent}
                removeComponent={removeComponent}
                totalComponents={components.length}
                getActiveComponents={getActiveComponents}
                onComponentSelect={onComponentSelect}
                selectedComponentId={selectedComponentId}
              />
            );
          })}
        </Box>
      </Box>
    );

    // Si está en modo newsletter, mostrar las notas del newsletter o preview HTML
    if (isNewsletterMode) {
      // Si se está mostrando el preview HTML
      if (showNewsletterPreview && newsletterHtml) {
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
              }}
            >
              <Typography variant="h6" sx={{ mb: 3, textAlign: 'center' }}>
                Preview HTML - Newsletter Completo
              </Typography>

              {/* Iframe para mostrar el HTML renderizado */}
              <Box
                sx={{
                  border: '1px solid #e0e0e0',
                  borderRadius: 2,
                  overflow: 'hidden',
                  mb: 2,
                }}
              >
                <iframe
                  srcDoc={newsletterHtml}
                  style={{
                    width: '100%',
                    height: '600px',
                    border: 'none',
                    borderRadius: '8px',
                  }}
                  title="Newsletter Preview"
                />
              </Box>

              {/* Código HTML para copiar */}
              <Box
                sx={{
                  backgroundColor: '#f5f5f5',
                  border: '1px solid #e0e0e0',
                  borderRadius: 2,
                  p: 2,
                  maxHeight: 300,
                  overflow: 'auto',
                }}
              >
                <Typography variant="caption" sx={{ mb: 1, display: 'block', fontWeight: 600 }}>
                  Código HTML:
                </Typography>
                <pre
                  style={{
                    margin: 0,
                    fontSize: '12px',
                    lineHeight: 1.4,
                    fontFamily: 'monospace',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {newsletterHtml}
                </pre>
              </Box>
            </Box>
          </Box>
        );
      }

      // // Vista normal de notas - newsletter vacío
      // if (newsletterNotes.length === 0) {
      //   return (
      //     <Box
      //       sx={{
      //         ...backgroundStyle,
      //         cursor: 'pointer',
      //         border: isContainerSelected ? '2px solid #1976d2' : 'none',
      //         borderRadius: isContainerSelected ? '8px' : '0px',
      //       }}
      //       onClick={(e) => {
      //         e.stopPropagation();
      //         onContainerClick();
      //       }}
      //     >
      //       <Box
      //         sx={{
      //           maxWidth: `${containerMaxWidth}px`,
      //           margin: '0 auto',
      //           padding: `${containerPadding}px`,
      //           borderRadius: `${containerBorderRadius}px`,
      //           border: `${containerBorderWidth}px solid ${containerBorderColor}`,
      //         }}
      //       >
      //         {/* NEWSLETTER HEADER - Componente fijo superior */}
      //         <NewsletterHeaderComponent
      //           isSelected={selectedComponentId === 'newsletter-header'}
      //           onSelect={() => {
      //             console.log('🎯 Newsletter header selected');
      //             setSelectedComponentId('newsletter-header');
      //             onComponentSelect('newsletter-header');
      //           }}
      //           header={newsletterHeader}
      //         />

      //         <Box
      //           sx={{
      //             textAlign: 'center',
      //             py: 8,
      //             display: 'flex',
      //             flexDirection: 'column',
      //             alignItems: 'center',
      //             justifyContent: 'center',
      //           }}
      //         >
      //           <Icon
      //             icon="mdi:email-newsletter"
      //             style={{
      //               fontSize: 64,
      //               color: 'rgba(0,0,0,0.2)',
      //               marginBottom: 16,
      //             }}
      //           />
      //           <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary' }}>
      //             Tu newsletter está vacío
      //           </Typography>
      //           <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400 }}>
      //             Agrega notas desde la biblioteca en el panel lateral izquierdo para crear tu
      //             newsletter.
      //           </Typography>
      //         </Box>

      //         {/* NEWSLETTER FOOTER - Componente fijo inferior */}
      //         <NewsletterFooterComponent
      //           isSelected={selectedComponentId === 'newsletter-footer'}
      //           onSelect={() => {
      //             console.log('🎯 Newsletter footer selected');
      //             setSelectedComponentId('newsletter-footer');
      //             onComponentSelect('newsletter-footer');
      //           }}
      //           footer={newsletterFooter}
      //         />
      //       </Box>
      //     </Box>
      //   );
      // }

      // Vista normal de notas - mostrar las notas del newsletter con componentes completos
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
              // Para newsletter, no aplicar bordes al contenedor principal
              ...(isNewsletterMode
                ? {
                    // Sin bordes para newsletter
                    borderRadius: 0,
                    border: 'none',
                    maxWidth: '100%',
                  }
                : {
                    // Bordes normales para otros casos
                    borderRadius: `${containerBorderRadius}px`,
                    border: `${containerBorderWidth}px solid ${containerBorderColor}`,
                  }),
            }}
          >
            {/* NEWSLETTER HEADER - Componente fijo superior */}
            <NewsletterHeaderComponent
              isSelected={selectedComponentId === 'newsletter-header'}
              onSelect={() => {
                setSelectedComponentId('newsletter-header');
                onComponentSelect('newsletter-header');
              }}
              header={newsletterHeader}
            />

            {body}

            {/* NEWSLETTER FOOTER - Componente fijo inferior */}
            <NewsletterFooterComponent
              isSelected={selectedComponentId === 'newsletter-footer'}
              onSelect={() => {
                setSelectedComponentId('newsletter-footer');
                onComponentSelect('newsletter-footer');
              }}
              footer={newsletterFooter}
            />
          </Box>
        </Box>
      );
    }

    // Modo normal (no newsletter) Empty state
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
              // Para newsletter, no aplicar bordes al contenedor principal
              ...(isNewsletterMode
                ? {
                    // Sin bordes para newsletter
                    borderRadius: 0,
                    border: 'none',
                    maxWidth: '100%',
                  }
                : (activeTemplate === 'news' ||
                      activeTemplate === 'market' ||
                      activeTemplate === 'storyboard') &&
                    activeVersion === 'web'
                  ? {
                      // Sin bordes para la versión web del template de noticias/mercado/storyboard
                      borderRadius: 0,
                      border: 'none',
                      maxWidth: '100%',
                    }
                  : {
                      // Bordes normales para otros casos
                      borderRadius: `${containerBorderRadius}px`,
                      border: `${containerBorderWidth}px solid ${containerBorderColor}`,
                    }),
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
              }}
            >
              Añadir tu primer componente
            </Button>
          </Box>
        </Box>
      );
    }

    // Mostrar componentes normales
    return body;
  }
);

export default EmailContent;

'use client';

import type React from 'react';
import type { PostStatus } from 'src/types/post';
import type { EmailComponent } from 'src/types/saved-note';

import { useState } from 'react';
import { Icon } from '@iconify/react';

import {
  Box,
  Chip,
  Alert,
  AppBar,
  Button,
  Dialog,
  Toolbar,
  Typography,
  IconButton,
  DialogTitle,
  ToggleButton,
  DialogActions,
  DialogContent,
  DialogContentText,
  ToggleButtonGroup,
} from '@mui/material';

import TextOptions from '../TextOptions';
import ImageOptions from '../ImageOptions';
import ButtonOptions from '../ButtonOptions';
import DividerOptions from '../DividerOptions';
import GalleryOptions from '../GalleryOptions';
import SummaryOptions from '../SummaryOptions';
import CategoryOptions from '../CategoryOptions';
import ImageTextOptions from '../ImageTextOptions';
import TwoColumnsOptions from '../TwoColumnsOptions';
import HerramientasOptions from '../HerramientasOptions';
import TextWithIconOptions from '../TextWithIconOptions';
import NoteContainerOptions from '../NoteContainerOptions';
import RespaldadoPorOptions from '../RespaldadoPorOptions';
import TituloConIconoOptions from '../TituloConIconoOptions';
import AIAssistantModal from '../../ai-menu/AIAssistantModal';
import NewsletterFooterOptions from '../NewsletterFooterOptions';
import ChartOptions from '../../email-components/options/ChartOptions';
import NewsletterFooterReusableOptions from '../NewsletterFooterReusableOptions';
import NewsletterHeaderReusableOptions from '../NewsletterHeaderReusableOptions';

interface ComponentOptionsViewProps {
  componentType: string | undefined;
  selectedComponent: EmailComponent | null;
  selectedComponentId: string;
  setSelectedComponentId: (id: string | null) => void;
  rightPanelTab: number;
  setRightPanelTab: (tab: number) => void;
  getActiveComponents: () => EmailComponent[];
  updateComponentProps: (componentId: string, props: any) => void;
  updateComponentStyle: (componentId: string, styles: any) => void;
  updateComponentContent: (componentId: string, content: string) => void;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  selectedFont: string;
  setSelectedFont: (font: string) => void;
  selectedFontSize: string;
  setSelectedFontSize: (size: string) => void;
  selectedFontWeight: string;
  setSelectedFontWeight: (weight: string) => void;
  selectedAlignment: string;
  textFormat: any;
  applyTextFormat: (format: string) => void;
  applyTextAlignment: (
    alignment: string,
    selectedComponentId?: string | null,
    updateComponentStyle?: (id: string, style: React.CSSProperties) => void
  ) => void;
  applyTextColor: (
    color: string,
    selectedComponentId?: string | null,
    updateComponentStyle?: (id: string, style: React.CSSProperties) => void
  ) => void;
  applyFontSize: (
    size: string,
    selectedComponentId: string | null,
    updateComponentStyle: (id: string, style: React.CSSProperties) => void
  ) => void;
  applyFontFamily: (
    font: string,
    selectedComponentId: string | null,
    updateComponentStyle: (id: string, style: React.CSSProperties) => void
  ) => void;
  emailBackground: string;
  setEmailBackground: (bg: string) => void;
  selectedBanner: string;
  setSelectedBanner: (banner: string) => void;
  showGradient: boolean;
  setShowGradient: (show: boolean) => void;
  gradientColors: string[];
  setGradientColors: (colors: string[]) => void;
  bannerOptions: any[];
  setSelectedAlignment: (alignment: string) => void;
  hasTextSelection: boolean;
  convertTextToList: (componentId: string | null, listType: 'ordered' | 'unordered') => void;
  setShowIconPicker: (show: boolean) => void;
  isContainerSelected: boolean;
  setIsContainerSelected: (selected: boolean) => void;
  containerBorderWidth: number;
  setContainerBorderWidth: (width: number) => void;
  containerBorderColor: string;
  setContainerBorderColor: (color: string) => void;
  containerBorderRadius: number;
  setContainerBorderRadius: (radius: number) => void;
  containerPadding: number;
  setContainerPadding: (padding: number) => void;
  containerMaxWidth: number;
  setContainerMaxWidth: (maxWidth: number) => void;
  activeTemplate: string;
  activeVersion: 'newsletter' | 'web';
  currentNoteId?: string;
  noteTitle: string;
  setNoteTitle: (title: string) => void;
  noteDescription: string;
  setNoteDescription: (description: string) => void;
  noteCoverImageUrl: string;
  setNoteCoverImageUrl: (url: string) => void;
  noteStatus: PostStatus;
  setNoteStatus: (status: PostStatus) => void;
  updateStatus: (status: PostStatus) => Promise<void>;
  contentTypeId: string;
  setContentTypeId: (id: string) => void;
  audienceId: string;
  setAudienceId: (id: string) => void;
  categoryId: string;
  setCategoryId: (id: string) => void;
  subcategoryId: string;
  setSubcategoryId: (id: string) => void;
  highlight: boolean;
  setHighlight: (highlight: boolean) => void;
  selectedColumn?: 'left' | 'right';
  injectComponentsToNewsletter?: (components: EmailComponent[], noteTitle?: string) => void;
  isViewOnly: boolean;
  openDeleteDialog: boolean;
  setOpenDeleteDialog: (open: boolean) => void;
  handleDeleteNote: () => Promise<void>;
}

export default function ComponentOptionsView({
  componentType,
  selectedComponent,
  selectedComponentId,
  setSelectedComponentId,
  rightPanelTab,
  setRightPanelTab,
  getActiveComponents,
  updateComponentProps,
  updateComponentStyle,
  updateComponentContent,
  selectedColor,
  setSelectedColor,
  selectedFont,
  setSelectedFont,
  selectedFontSize,
  setSelectedFontSize,
  selectedFontWeight,
  setSelectedFontWeight,
  selectedAlignment,
  textFormat,
  applyTextFormat,
  applyTextAlignment,
  applyTextColor,
  applyFontSize,
  applyFontFamily,
  emailBackground,
  setEmailBackground,
  selectedBanner,
  setSelectedBanner,
  showGradient,
  setShowGradient,
  gradientColors,
  setGradientColors,
  bannerOptions,
  setSelectedAlignment,
  hasTextSelection,
  convertTextToList,
  setShowIconPicker,
  isContainerSelected,
  setIsContainerSelected,
  containerBorderWidth,
  setContainerBorderWidth,
  containerBorderColor,
  setContainerBorderColor,
  containerBorderRadius,
  setContainerBorderRadius,
  containerPadding,
  setContainerPadding,
  containerMaxWidth,
  setContainerMaxWidth,
  activeTemplate,
  activeVersion,
  currentNoteId,
  noteTitle,
  setNoteTitle,
  noteDescription,
  setNoteDescription,
  noteCoverImageUrl,
  setNoteCoverImageUrl,
  noteStatus,
  setNoteStatus,
  updateStatus,
  contentTypeId,
  setContentTypeId,
  audienceId,
  setAudienceId,
  categoryId,
  setCategoryId,
  subcategoryId,
  setSubcategoryId,
  highlight,
  setHighlight,
  selectedColumn,
  injectComponentsToNewsletter,
  isViewOnly,
  openDeleteDialog,
  setOpenDeleteDialog,
  handleDeleteNote,
}: ComponentOptionsViewProps) {
  // Estados para el modal de IA
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiModalContent, setAiModalContent] = useState('');

  // Función para abrir el modal de IA con el contenido del componente
  const handleOpenAIModal = () => {
    if (!selectedComponent) return;

    // Obtener el contenido del componente
    const content = selectedComponent.content || '';
    setAiModalContent(content);
    setShowAIModal(true);
  };

  // Función para aplicar el resultado de la IA al componente
  const handleApplyAIResult = (newText: string) => {
    if (selectedComponentId) {
      updateComponentContent(selectedComponentId, newText);
    }
    setShowAIModal(false);
  };

  return (
    <Box
      sx={(theme) => ({
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        background: theme.palette.background.paper,
      })}
    >
      {/* Mostrar mensaje de solo lectura si está en modo view-only */}
      {isViewOnly ? (
        <>
          <AppBar position="static" color="default" elevation={0} sx={{ flexShrink: 0 }}>
            <Toolbar sx={{ minHeight: { xs: 48, sm: 56 } }}>
              <IconButton
                edge="start"
                onClick={() => setSelectedComponentId(null)}
                sx={{ mr: 1 }}
                size="small"
              >
                <Icon icon="mdi:arrow-left" />
              </IconButton>
              <Typography
                variant="subtitle1"
                component="div"
                sx={{
                  flexGrow: 1,
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                }}
              >
                Diseño
              </Typography>
            </Toolbar>
          </AppBar>
          <Box
            sx={{
              p: 3,
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Modo Solo Lectura
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: '250px' }}>
              Las opciones de configuración están deshabilitadas mientras el newsletter está en modo
              solo lectura.
            </Typography>
          </Box>
        </>
      ) : (
        <>
          <AppBar position="static" color="default" elevation={0} sx={{ flexShrink: 0 }}>
            <Toolbar sx={{ minHeight: { xs: 48, sm: 56 } }}>
              <IconButton
                edge="start"
                onClick={() => setSelectedComponentId(null)}
                sx={{ mr: 1 }}
                size="small"
              >
                <Icon icon="mdi:arrow-left" />
              </IconButton>
              <Typography
                variant="subtitle1"
                component="div"
                sx={{
                  flexGrow: 1,
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                }}
              >
                Diseño
              </Typography>
            </Toolbar>
          </AppBar>

          <Box
            sx={{
              p: 1,
              display: 'none',
              borderBottom: 1,
              borderColor: 'divider',
              flexShrink: 0,
            }}
          >
            <ToggleButtonGroup
              value={rightPanelTab}
              exclusive
              onChange={(e, newValue) => {
                if (newValue !== null) {
                  setRightPanelTab(newValue);
                }
              }}
              aria-label="Opciones de componente"
              size="small"
              color="primary"
              sx={{
                width: '100%',
                border: 'none',
                '& .MuiToggleButton-root': {
                  flex: 1,
                  fontSize: { xs: '0.65rem', sm: '0.75rem' },
                  padding: { xs: '4px 6px', sm: '6px 8px' },
                  border: 'none',
                },
              }}
            >
              <ToggleButton value={0} aria-label="principal">
                {componentType === 'summary' || componentType === 'respaldadoPor'
                  ? '📝 Configuración'
                  : componentType === 'image'
                    ? 'Imagen'
                    : componentType === 'button'
                      ? 'Botón'
                      : componentType === 'gallery'
                        ? 'Galería'
                        : componentType === 'chart'
                          ? 'Gráfica'
                          : componentType === 'category'
                            ? 'Categorías'
                            : componentType === 'tituloConIcono'
                              ? 'Título'
                              : componentType === 'herramientas'
                                ? 'Herramientas'
                                : componentType === 'divider'
                                  ? 'Separador'
                                  : componentType === 'noteContainer'
                                    ? 'Nota'
                                    : componentType === 'newsletterHeaderReusable'
                                      ? 'Header Newsletter'
                                      : componentType === 'newsletterFooterReusable'
                                        ? 'Footer Newsletter'
                                        : (componentType as string) === 'newsletter-footer'
                                          ? 'Footer Newsletter'
                                          : 'Tipografía'}
              </ToggleButton>

              {/* Segundo tab solo para herramientas */}
              {componentType === 'herramientas' && (
                <ToggleButton value={1} aria-label="configuracion">
                  Configuración
                </ToggleButton>
              )}

              {/* Tab IA para todos los componentes (excepto algunos específicos) */}
              {/* {componentType !== 'divider' &&
                componentType !== 'spacer' &&
                componentType !== 'noteContainer' && (
                  <ToggleButton value={componentType === 'herramientas' ? 2 : 1} aria-label="ia">
                    🤖 IA
                  </ToggleButton>
                )} */}
            </ToggleButtonGroup>
          </Box>

          <Box
            sx={{
              overflowY: 'auto',
              overflowX: 'hidden',
              flexGrow: 1,
              height: 0,
              p: { xs: 1, sm: 2 },
            }}
          >
            {rightPanelTab === 0 && (
              <>
                {/* Para Summary, mostrar directamente las opciones de configuración */}
                {componentType === 'summary' && (
                  <SummaryOptions
                    selectedComponentId={selectedComponentId}
                    getActiveComponents={getActiveComponents}
                    updateComponentProps={updateComponentProps}
                    setShowIconPicker={setShowIconPicker}
                  />
                )}

                {/* Para RespaldadoPor, mostrar directamente las opciones de configuración */}
                {componentType === 'respaldadoPor' && (
                  <RespaldadoPorOptions
                    selectedComponentId={selectedComponentId}
                    getActiveComponents={getActiveComponents}
                    updateComponentProps={updateComponentProps}
                  />
                )}

                {componentType === 'image' && (
                  <ImageOptions
                    selectedComponentId={selectedComponentId}
                    selectedComponent={selectedComponent}
                    updateComponentProps={updateComponentProps}
                    updateComponentStyle={updateComponentStyle}
                  />
                )}

                {componentType === 'gallery' && (
                  <GalleryOptions
                    selectedComponentId={selectedComponentId}
                    selectedComponent={selectedComponent}
                    updateComponentProps={updateComponentProps}
                    updateComponentStyle={updateComponentStyle}
                  />
                )}

                {componentType === 'imageText' && (
                  <ImageTextOptions
                    component={selectedComponent}
                    updateComponentProps={updateComponentProps}
                  />
                )}

                {componentType === 'twoColumns' && (
                  <TwoColumnsOptions
                    component={selectedComponent}
                    updateComponentProps={updateComponentProps}
                    selectedColumn={selectedColumn}
                  />
                )}

                {componentType === 'textWithIcon' && (
                  <TextWithIconOptions
                    component={selectedComponent}
                    updateComponentProps={updateComponentProps}
                  />
                )}

                {componentType === 'chart' && (
                  <ChartOptions
                    component={selectedComponent}
                    updateComponentProps={updateComponentProps}
                  />
                )}

                {componentType === 'button' && (
                  <ButtonOptions
                    selectedComponentId={selectedComponentId}
                    selectedComponent={selectedComponent}
                    updateComponentProps={updateComponentProps}
                    updateComponentStyle={updateComponentStyle}
                    updateComponentContent={updateComponentContent}
                  />
                )}

                {componentType === 'divider' && (
                  <DividerOptions
                    selectedComponentId={selectedComponentId}
                    selectedComponent={selectedComponent}
                    updateComponentProps={updateComponentProps}
                    updateComponentStyle={updateComponentStyle}
                  />
                )}

                {componentType === 'newsletterHeaderReusable' && (
                  <NewsletterHeaderReusableOptions
                    selectedComponentId={selectedComponentId}
                    selectedComponent={selectedComponent}
                    updateComponentProps={updateComponentProps}
                    updateComponentStyle={updateComponentStyle}
                    isViewOnly={isViewOnly}
                  />
                )}

                {componentType === 'newsletterFooterReusable' && (
                  <NewsletterFooterReusableOptions
                    selectedComponentId={selectedComponentId}
                    selectedComponent={selectedComponent}
                    updateComponentProps={updateComponentProps}
                    updateComponentStyle={updateComponentStyle}
                    isViewOnly={isViewOnly}
                  />
                )}

                {(componentType as string) === 'newsletter-footer' && (
                  <NewsletterFooterOptions
                    selectedComponentId={selectedComponentId}
                    selectedComponent={selectedComponent}
                    updateComponentProps={updateComponentProps}
                    updateComponentStyle={updateComponentStyle}
                    isViewOnly={isViewOnly}
                  />
                )}

                {(componentType === 'heading' ||
                  componentType === 'paragraph' ||
                  componentType === 'bulletList') && (
                  <TextOptions
                    componentType={componentType}
                    selectedComponent={selectedComponent}
                    selectedComponentId={selectedComponentId}
                    setSelectedComponentId={setSelectedComponentId}
                    getActiveComponents={getActiveComponents}
                    updateComponentProps={updateComponentProps}
                    updateComponentStyle={updateComponentStyle}
                    updateComponentContent={updateComponentContent}
                    selectedColor={selectedColor}
                    setSelectedColor={setSelectedColor}
                    selectedFont={selectedFont}
                    setSelectedFont={setSelectedFont}
                    selectedFontSize={selectedFontSize}
                    setSelectedFontSize={setSelectedFontSize}
                    selectedFontWeight={selectedFontWeight}
                    setSelectedFontWeight={setSelectedFontWeight}
                    selectedAlignment={selectedAlignment}
                    textFormat={textFormat}
                    applyTextFormat={applyTextFormat}
                    applyTextAlignment={applyTextAlignment}
                    applyTextColor={applyTextColor}
                    applyFontSize={applyFontSize}
                    applyFontFamily={applyFontFamily}
                    emailBackground={emailBackground}
                    setEmailBackground={setEmailBackground}
                    selectedBanner={selectedBanner}
                    setSelectedBanner={setSelectedBanner}
                    showGradient={showGradient}
                    setShowGradient={setShowGradient}
                    gradientColors={gradientColors}
                    setGradientColors={setGradientColors}
                    bannerOptions={bannerOptions}
                    setSelectedAlignment={setSelectedAlignment}
                    hasTextSelection={hasTextSelection}
                    convertTextToList={convertTextToList}
                    setShowIconPicker={setShowIconPicker}
                    isContainerSelected={isContainerSelected}
                    setIsContainerSelected={setIsContainerSelected}
                    containerBorderWidth={containerBorderWidth}
                    setContainerBorderWidth={setContainerBorderWidth}
                    containerBorderColor={containerBorderColor}
                    setContainerBorderColor={setContainerBorderColor}
                    containerBorderRadius={containerBorderRadius}
                    setContainerBorderRadius={setContainerBorderRadius}
                    containerPadding={containerPadding}
                    setContainerPadding={setContainerPadding}
                    containerMaxWidth={containerMaxWidth}
                    setContainerMaxWidth={setContainerMaxWidth}
                    activeTemplate={activeTemplate}
                    activeVersion={activeVersion}
                    currentNoteId={currentNoteId}
                    noteTitle={noteTitle}
                    setNoteTitle={setNoteTitle}
                    noteDescription={noteDescription}
                    setNoteDescription={setNoteDescription}
                    noteCoverImageUrl={noteCoverImageUrl}
                    setNoteCoverImageUrl={setNoteCoverImageUrl}
                    noteStatus={noteStatus}
                    setNoteStatus={setNoteStatus}
                    updateStatus={updateStatus}
                    contentTypeId={contentTypeId}
                    setContentTypeId={setContentTypeId}
                    audienceId={audienceId}
                    setAudienceId={setAudienceId}
                    categoryId={categoryId}
                    setCategoryId={setCategoryId}
                    subcategoryId={subcategoryId}
                    setSubcategoryId={setSubcategoryId}
                    highlight={highlight}
                    setHighlight={setHighlight}
                    selectedColumn={selectedColumn}
                    injectComponentsToNewsletter={injectComponentsToNewsletter}
                  />
                )}

                {componentType === 'category' && (
                  <CategoryOptions
                    selectedComponentId={selectedComponentId}
                    getActiveComponents={getActiveComponents}
                    updateComponentProps={updateComponentProps}
                  />
                )}

                {componentType === 'tituloConIcono' && (
                  <TituloConIconoOptions
                    selectedComponentId={selectedComponentId}
                    getActiveComponents={getActiveComponents}
                    updateComponentProps={updateComponentProps}
                    setShowIconPicker={setShowIconPicker}
                  />
                )}

                {componentType === 'noteContainer' && (
                  <NoteContainerOptions
                    selectedComponentId={selectedComponentId}
                    getActiveComponents={getActiveComponents}
                    updateComponentProps={updateComponentProps}
                    updateComponentStyle={updateComponentStyle}
                  />
                )}

                {/* Herramientas - solo en tab 0 cuando NO es summary */}
                {componentType === 'herramientas' && (
                  <HerramientasOptions
                    selectedComponentId={selectedComponentId}
                    getActiveComponents={getActiveComponents}
                    updateComponentProps={updateComponentProps}
                    setShowIconPicker={setShowIconPicker}
                  />
                )}
              </>
            )}

            {/* Tab 1: Solo para herramientas (configuración) */}
            {rightPanelTab === 1 && componentType === 'herramientas' && (
              <HerramientasOptions
                selectedComponentId={selectedComponentId}
                getActiveComponents={getActiveComponents}
                updateComponentProps={updateComponentProps}
                setShowIconPicker={setShowIconPicker}
              />
            )}

            {/* Tab IA: Para todos los componentes (valor 1 para la mayoría, 2 para herramientas) */}
            {((rightPanelTab === 1 && componentType !== 'herramientas') ||
              (rightPanelTab === 2 && componentType === 'herramientas')) && (
              <Box>
                <Chip label="🤖 Asistente IA" variant="filled" sx={{ mb: 2 }} size="small" />

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Próximamente: Herramientas de IA para mejorar tu contenido
                </Typography>

                {/* Opciones de IA según tipo de componente */}
                {(componentType === 'heading' ||
                  componentType === 'paragraph' ||
                  componentType === 'bulletList') && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: 600, mb: 1 }}>
                      Opciones para texto:
                    </Typography>

                    {/* Botón principal para abrir el modal de IA */}
                    <Button
                      variant="contained"
                      size="small"
                      onClick={handleOpenAIModal}
                      startIcon={<Icon icon="mdi:magic-staff" />}
                      sx={{
                        justifyContent: 'flex-start',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5568d3 0%, #63408a 100%)',
                        },
                      }}
                    >
                      Asistente de IA
                    </Button>

                    {/* Botones deshabilitados para referencia futura */}
                    <Button
                      variant="outlined"
                      size="small"
                      disabled
                      startIcon={<Icon icon="mdi:text-box-plus-outline" />}
                      sx={{ justifyContent: 'flex-start' }}
                    >
                      Expandir contenido
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      disabled
                      startIcon={<Icon icon="mdi:text-box-minus-outline" />}
                      sx={{ justifyContent: 'flex-start' }}
                    >
                      Resumir texto
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      disabled
                      startIcon={<Icon icon="mdi:translate" />}
                      sx={{ justifyContent: 'flex-start' }}
                    >
                      Traducir
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      disabled
                      startIcon={<Icon icon="mdi:spellcheck" />}
                      sx={{ justifyContent: 'flex-start' }}
                    >
                      Corregir ortografía
                    </Button>
                  </Box>
                )}

                {componentType === 'image' && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: 600, mb: 1 }}>
                      Opciones para imagen:
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      disabled
                      startIcon={<Icon icon="mdi:image-auto-adjust" />}
                      sx={{ justifyContent: 'flex-start' }}
                    >
                      Generar descripción ALT
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      disabled
                      startIcon={<Icon icon="mdi:image-search" />}
                      sx={{ justifyContent: 'flex-start' }}
                    >
                      Sugerir imágenes similares
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      disabled
                      startIcon={<Icon icon="mdi:palette" />}
                      sx={{ justifyContent: 'flex-start' }}
                    >
                      Generar con IA (DALL-E)
                    </Button>
                  </Box>
                )}

                {componentType === 'button' && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: 600, mb: 1 }}>
                      Opciones para botón:
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      disabled
                      startIcon={<Icon icon="mdi:target" />}
                      sx={{ justifyContent: 'flex-start' }}
                    >
                      Optimizar CTA
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      disabled
                      startIcon={<Icon icon="mdi:ab-testing" />}
                      sx={{ justifyContent: 'flex-start' }}
                    >
                      Generar variaciones A/B
                    </Button>
                  </Box>
                )}

                {componentType === 'gallery' && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: 600, mb: 1 }}>
                      Opciones para galería:
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      disabled
                      startIcon={<Icon icon="mdi:image-multiple" />}
                      sx={{ justifyContent: 'flex-start' }}
                    >
                      Generar captions automáticos
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      disabled
                      startIcon={<Icon icon="mdi:palette-swatch" />}
                      sx={{ justifyContent: 'flex-start' }}
                    >
                      Sugerir tema visual coherente
                    </Button>
                  </Box>
                )}

                {componentType === 'chart' && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: 600, mb: 1 }}>
                      Opciones para gráfica:
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      disabled
                      startIcon={<Icon icon="mdi:chart-line" />}
                      sx={{ justifyContent: 'flex-start' }}
                    >
                      Generar insights automáticos
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      disabled
                      startIcon={<Icon icon="mdi:text-box" />}
                      sx={{ justifyContent: 'flex-start' }}
                    >
                      Crear descripción textual
                    </Button>
                  </Box>
                )}

                <Alert severity="info" sx={{ mt: 2, fontSize: '0.75rem' }}>
                  💡 Las funcionalidades de IA estarán disponibles próximamente. Podrás mejorar tu
                  contenido con un solo clic.
                </Alert>
              </Box>
            )}
          </Box>

          {/* Diálogo de confirmación para eliminar nota */}
          <Dialog
            open={openDeleteDialog}
            onClose={() => setOpenDeleteDialog(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">¿Eliminar nota?</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Esta acción no se puede deshacer. ¿Estás seguro de que deseas eliminar esta nota
                permanentemente?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
                Cancelar
              </Button>
              <Button onClick={handleDeleteNote} color="error" variant="contained" autoFocus>
                Eliminar
              </Button>
            </DialogActions>
          </Dialog>

          {/* Modal de Asistente de IA */}
          <AIAssistantModal
            open={showAIModal}
            onClose={() => setShowAIModal(false)}
            selectedText={aiModalContent}
            onApply={handleApplyAIResult}
          />
        </>
      )}
    </Box>
  );
}

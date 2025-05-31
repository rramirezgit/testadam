'use client';

import { Icon } from '@iconify/react';

import { Box, Tab, Tabs, AppBar, Toolbar, Typography } from '@mui/material';

// Importaciones de los componentes individuales
import TextOptions from './right-panel/TextOptions';
import ImageOptions from './right-panel/ImageOptions';
import ButtonOptions from './right-panel/ButtonOptions';
import DesignOptions from './right-panel/DesignOptions';
import GalleryOptions from './right-panel/GalleryOptions';
import DividerOptions from './right-panel/DividerOptions';
import SummaryOptions from './right-panel/SummaryOptions';
import CategoryOptions from './right-panel/CategoryOptions';
import BackgroundOptions from './right-panel/BackgroundOptions';
import RespaldadoPorOptions from './right-panel/RespaldadoPorOptions';
import TituloConIconoOptions from './right-panel/TituloConIconoOptions';

import type { RightPanelProps } from './right-panel/types';

// ¡Todos los componentes han sido implementados!

export default function RightPanel({
  selectedComponentId,
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
  listStyle,
  updateListStyle,
  listColor,
  updateListColor,
  convertTextToList,
  setShowIconPicker,
}: RightPanelProps) {
  // Si no hay componente seleccionado, mostrar un mensaje
  const renderEmptyState = () => (
    <Box sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
      <Icon icon="mdi:cursor-text" style={{ fontSize: 48, marginBottom: 16, opacity: 0.5 }} />
      <Typography variant="h6" gutterBottom>
        Selecciona un componente
      </Typography>
      <Typography variant="body2">
        Haz clic en cualquier elemento del email para editar su formato y estilo.
      </Typography>
    </Box>
  );

  // Obtener el componente seleccionado
  const selectedComponent = selectedComponentId
    ? getActiveComponents().find((comp) => comp.id === selectedComponentId)
    : null;

  if (!selectedComponent) {
    return (
      <Box
        sx={{
          width: 280,
          borderLeft: '1px solid #e0e0e0',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#fff',
        }}
      >
        <AppBar position="static" color="default" elevation={0}>
          <Toolbar>
            <Typography variant="subtitle1" component="div" sx={{ flexGrow: 1 }}>
              Diseño
            </Typography>
          </Toolbar>
        </AppBar>
        {renderEmptyState()}
      </Box>
    );
  }

  // Determinar el tipo de componente
  const componentType = selectedComponent.type;

  return (
    <Box
      sx={{
        width: 280,
        borderLeft: '1px solid #e0e0e0',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fff',
      }}
    >
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar>
          <Typography variant="subtitle1" component="div" sx={{ flexGrow: 1 }}>
            Diseño
          </Typography>
        </Toolbar>
      </AppBar>

      <Tabs
        value={rightPanelTab}
        onChange={(e, newValue) => setRightPanelTab(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab
          label={
            componentType === 'image'
              ? 'Imagen'
              : componentType === 'button'
                ? 'Botón'
                : componentType === 'gallery'
                  ? 'Galería'
                  : componentType === 'summary'
                    ? 'Texto'
                    : componentType === 'category'
                      ? 'Categorías'
                      : componentType === 'tituloConIcono'
                        ? 'Título'
                        : componentType === 'respaldadoPor'
                          ? 'Respaldo'
                          : componentType === 'divider'
                            ? 'Separador'
                            : 'Tipografía'
          }
        />
        {componentType === 'summary' && <Tab label="Summary" />}
        <Tab label="Diseño" />
        <Tab label="Fondo" />
      </Tabs>

      <Box sx={{ overflow: 'auto' }}>
        {rightPanelTab === 0 && (
          <>
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

            {(componentType === 'heading' ||
              componentType === 'paragraph' ||
              componentType === 'bulletList' ||
              componentType === 'summary') && (
              <TextOptions
                componentType={componentType}
                selectedComponent={selectedComponent}
                selectedComponentId={selectedComponentId}
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
                listStyle={listStyle}
                updateListStyle={updateListStyle}
                listColor={listColor}
                updateListColor={updateListColor}
                convertTextToList={convertTextToList}
                setShowIconPicker={setShowIconPicker}
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

            {componentType === 'respaldadoPor' && (
              <RespaldadoPorOptions
                selectedComponentId={selectedComponentId}
                getActiveComponents={getActiveComponents}
                updateComponentProps={updateComponentProps}
              />
            )}
          </>
        )}

        {rightPanelTab === 1 && componentType === 'summary' && (
          <SummaryOptions
            selectedComponentId={selectedComponentId}
            getActiveComponents={getActiveComponents}
            updateComponentProps={updateComponentProps}
            setShowIconPicker={setShowIconPicker}
          />
        )}

        {rightPanelTab === (componentType === 'summary' ? 2 : 1) && (
          <DesignOptions
            selectedComponentId={selectedComponentId}
            updateComponentStyle={updateComponentStyle}
          />
        )}

        {rightPanelTab === (componentType === 'summary' ? 3 : 2) && (
          <BackgroundOptions
            selectedComponentId={selectedComponentId}
            updateComponentStyle={updateComponentStyle}
            emailBackground={emailBackground}
            setEmailBackground={setEmailBackground}
            selectedBanner={selectedBanner}
            setSelectedBanner={setSelectedBanner}
            showGradient={showGradient}
            setShowGradient={setShowGradient}
            gradientColors={gradientColors}
            setGradientColors={setGradientColors}
            bannerOptions={bannerOptions}
          />
        )}
      </Box>
    </Box>
  );
}

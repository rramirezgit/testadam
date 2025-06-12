'use client';

import { useState } from 'react';
import { Icon } from '@iconify/react';

import {
  Box,
  Tab,
  Tabs,
  AppBar,
  Select,
  Button,
  Toolbar,
  Divider,
  MenuItem,
  TextField,
  Typography,
  InputLabel,
  FormControl,
} from '@mui/material';

// Importaciones de los componentes individuales
import TextOptions from './right-panel/TextOptions';
import ImageOptions from './right-panel/ImageOptions';
import ButtonOptions from './right-panel/ButtonOptions';
import GalleryOptions from './right-panel/GalleryOptions';
import DividerOptions from './right-panel/DividerOptions';
import SummaryOptions from './right-panel/SummaryOptions';
import CategoryOptions from './right-panel/CategoryOptions';
import ContainerOptions from './right-panel/ContainerOptions';
import SmartDesignOptions from './right-panel/SmartDesignOptions';
import HerramientasOptions from './right-panel/HerramientasOptions';
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
  noteTitle,
  setNoteTitle,
  noteDescription,
  setNoteDescription,
  noteCoverImageUrl,
  setNoteCoverImageUrl,
  noteStatus,
  setNoteStatus,
}: RightPanelProps) {
  // Estado para los tabs del contenedor
  const [containerTab, setContainerTab] = useState(0);

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

  // ⚡ DEBUG: Log de selección
  console.log('🎯 RightPanel selectedComponentId:', selectedComponentId);
  console.log('🎯 RightPanel selectedComponent:', selectedComponent?.type, selectedComponent?.id);

  // Si el contenedor está seleccionado, mostrar las opciones del contenedor
  if (isContainerSelected && (activeTemplate !== 'news' || activeVersion === 'newsletter')) {
    return (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#fff',
          overflow: 'hidden',
        }}
      >
        <AppBar position="static" color="default" elevation={0}>
          <Toolbar sx={{ minHeight: { xs: 48, sm: 56 } }}>
            <Typography
              variant="subtitle1"
              component="div"
              sx={{
                flexGrow: 1,
                fontSize: { xs: '0.875rem', sm: '1rem' },
              }}
            >
              Configuración de la Nota
            </Typography>
          </Toolbar>

          {/* Tabs dentro del AppBar */}
          <Tabs
            value={containerTab}
            onChange={(event, newValue) => setContainerTab(newValue)}
            variant="fullWidth"
            sx={{
              borderTop: '1px solid',
              borderColor: 'divider',
              backgroundColor: 'background.paper',
            }}
          >
            <Tab label="Información Básica" />
            <Tab label="Diseño del Contenedor" />
          </Tabs>
        </AppBar>

        <Box sx={{ overflow: 'auto', flexGrow: 1 }}>
          {/* Tab 0: Información Básica */}
          {containerTab === 0 && (
            <Box sx={{ p: 2 }}>
              {/* Título */}
              <TextField
                fullWidth
                label="Título de la nota"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                sx={{ mb: 2 }}
                required
                helperText="Este título aparecerá en la lista de notas"
              />

              {/* Descripción */}
              <TextField
                fullWidth
                label="Descripción"
                value={noteDescription}
                onChange={(e) => setNoteDescription(e.target.value)}
                multiline
                rows={3}
                sx={{ mb: 2 }}
                helperText="Descripción opcional para identificar el contenido"
              />

              {/* Estado */}
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={noteStatus}
                  label="Estado"
                  onChange={(e) => setNoteStatus(e.target.value)}
                >
                  <MenuItem value="DRAFT">Borrador</MenuItem>
                  <MenuItem value="REVIEW">En Revisión</MenuItem>
                  <MenuItem value="APPROVED">Aprobado</MenuItem>
                  <MenuItem value="PUBLISHED">Publicado</MenuItem>
                </Select>
              </FormControl>

              <Divider sx={{ my: 2 }} />

              {/* Imagen de portada */}
              <Typography variant="h6" gutterBottom>
                Imagen de Portada
              </Typography>

              <TextField
                fullWidth
                label="URL de la imagen"
                value={noteCoverImageUrl}
                onChange={(e) => setNoteCoverImageUrl(e.target.value)}
                sx={{ mb: 2 }}
                helperText="URL de la imagen que aparecerá como portada"
                placeholder="https://ejemplo.com/imagen.jpg"
              />

              {/* Vista previa de la imagen */}
              {noteCoverImageUrl && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Vista previa:
                  </Typography>
                  <Box
                    component="img"
                    src={noteCoverImageUrl}
                    alt="Vista previa"
                    sx={{
                      width: '100%',
                      maxHeight: 120,
                      objectFit: 'cover',
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </Box>
              )}

              <Button
                variant="outlined"
                startIcon={<Icon icon="solar:upload-outline" />}
                sx={{ mb: 2 }}
                disabled
              >
                Subir Imagen (Próximamente)
              </Button>
            </Box>
          )}

          {/* Tab 1: Diseño del Contenedor */}
          {containerTab === 1 && (
            <Box sx={{ p: 2 }}>
              <ContainerOptions
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
              />
            </Box>
          )}
        </Box>
      </Box>
    );
  }

  if (!selectedComponent) {
    return (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#fff',
          overflow: 'hidden',
        }}
      >
        <AppBar position="static" color="default" elevation={0}>
          <Toolbar sx={{ minHeight: { xs: 48, sm: 56 } }}>
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
        {renderEmptyState()}
      </Box>
    );
  }

  // Determinar el tipo de componente
  const componentType = selectedComponent.type;

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fff',
        overflow: 'hidden',
      }}
    >
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar sx={{ minHeight: { xs: 48, sm: 56 } }}>
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

      <Tabs
        value={rightPanelTab}
        onChange={(e, newValue) => setRightPanelTab(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          flexShrink: 0,
          '& .MuiTab-root': {
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            minWidth: { xs: 'auto', sm: 72 },
            padding: { xs: '6px 8px', sm: '12px 16px' },
          },
        }}
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
                        : componentType === 'herramientas'
                          ? 'Herramientas'
                          : componentType === 'respaldadoPor'
                            ? 'Respaldo'
                            : componentType === 'divider'
                              ? 'Separador'
                              : 'Tipografía'
          }
        />
        {(componentType === 'summary' || componentType === 'herramientas') && (
          <Tab label={componentType === 'summary' ? 'Summary' : 'Configuración'} />
        )}
        <Tab label="🎨 Smart" />
      </Tabs>

      <Box sx={{ overflow: 'auto', flexGrow: 1, p: { xs: 1, sm: 2 } }}>
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
                noteTitle={noteTitle}
                setNoteTitle={setNoteTitle}
                noteDescription={noteDescription}
                setNoteDescription={setNoteDescription}
                noteCoverImageUrl={noteCoverImageUrl}
                setNoteCoverImageUrl={setNoteCoverImageUrl}
                noteStatus={noteStatus}
                setNoteStatus={setNoteStatus}
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

        {rightPanelTab === 1 && componentType === 'summary' && (
          <SummaryOptions
            selectedComponentId={selectedComponentId}
            getActiveComponents={getActiveComponents}
            updateComponentProps={updateComponentProps}
            setShowIconPicker={setShowIconPicker}
          />
        )}

        {rightPanelTab === 1 && componentType === 'herramientas' && (
          <HerramientasOptions
            selectedComponentId={selectedComponentId}
            getActiveComponents={getActiveComponents}
            updateComponentProps={updateComponentProps}
            setShowIconPicker={setShowIconPicker}
          />
        )}

        {rightPanelTab ===
          (componentType === 'summary' || componentType === 'herramientas' ? 2 : 1) && (
          <SmartDesignOptions
            selectedComponentId={selectedComponentId}
            selectedComponent={selectedComponent}
            updateComponentStyle={updateComponentStyle}
            updateComponentProps={updateComponentProps}
          />
        )}
      </Box>
    </Box>
  );
}

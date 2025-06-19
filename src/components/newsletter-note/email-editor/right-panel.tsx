'use client';

import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';

import {
  Box,
  Tab,
  Tabs,
  Alert,
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
  LinearProgress,
} from '@mui/material';

// Importaciones de los componentes individuales
import TextOptions from './right-panel/TextOptions';
import ImageOptions from './right-panel/ImageOptions';
import ButtonOptions from './right-panel/ButtonOptions';
import GalleryOptions from './right-panel/GalleryOptions';
import DividerOptions from './right-panel/DividerOptions';
import SummaryOptions from './right-panel/SummaryOptions';
import CategoryOptions from './right-panel/CategoryOptions';
import { useImageUpload } from './right-panel/useImageUpload';
import ContainerOptions from './right-panel/ContainerOptions';
import HerramientasOptions from './right-panel/HerramientasOptions';
import RespaldadoPorOptions from './right-panel/RespaldadoPorOptions';
import TituloConIconoOptions from './right-panel/TituloConIconoOptions';
import NewsletterHeaderOptions from './right-panel/NewsletterHeaderOptions';
import NewsletterFooterOptions from './right-panel/NewsletterFooterOptions';

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

  // Referencias para input de archivo de portada
  const coverImageFileInputRef = useRef<HTMLInputElement>(null);

  // Hook para subida de imágenes
  const { uploadImageToS3, uploading, uploadProgress } = useImageUpload();

  // Función para manejar selección de archivo de portada
  const handleSelectCoverImage = () => {
    coverImageFileInputRef.current?.click();
  };

  // Función para manejar cambio de archivo de portada
  const handleCoverImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        setNoteCoverImageUrl(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  // Función para subir imagen de portada a S3
  const handleUploadCoverImageToS3 = async () => {
    if (!noteCoverImageUrl || !noteCoverImageUrl.startsWith('data:image/')) {
      alert('No hay imagen de portada para subir o ya está subida');
      return;
    }

    try {
      const s3Url = await uploadImageToS3(noteCoverImageUrl, `note_cover_${Date.now()}`);
      setNoteCoverImageUrl(s3Url);
    } catch (error) {
      alert('Error al subir la imagen de portada a S3');
      console.error(error);
    }
  };

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

              {/* Vista previa de la imagen */}
              {noteCoverImageUrl && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    Vista previa:
                  </Typography>
                  <Box
                    sx={{
                      position: 'relative',
                      display: 'inline-block',
                      maxWidth: '100%',
                    }}
                  >
                    <img
                      src={noteCoverImageUrl}
                      alt="Cover preview"
                      style={{
                        width: '100%',
                        maxHeight: '120px',
                        objectFit: 'cover',
                        borderRadius: '4px',
                        border: '1px solid #e0e0e0',
                      }}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    {noteCoverImageUrl.startsWith('data:image/') && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          backgroundColor: 'rgba(255, 152, 0, 0.9)',
                          color: 'white',
                          borderRadius: '4px',
                          padding: '2px 6px',
                          fontSize: '0.75rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                        }}
                      >
                        <Icon icon="mdi:cloud-upload-outline" fontSize="12px" />
                        Subir a S3
                      </Box>
                    )}
                  </Box>
                </Box>
              )}

              {/* Alertas de estado */}
              {noteCoverImageUrl && noteCoverImageUrl.startsWith('data:image/') && (
                <Alert severity="warning" sx={{ mb: 2, fontSize: '0.875rem' }}>
                  ⚠️ Esta imagen debe subirse a S3 antes de guardar
                </Alert>
              )}

              {noteCoverImageUrl &&
                !noteCoverImageUrl.startsWith('data:image/') &&
                noteCoverImageUrl.startsWith('http') && (
                  <Alert severity="success" sx={{ mb: 2, fontSize: '0.875rem' }}>
                    ✅ Imagen guardada correctamente
                  </Alert>
                )}

              {/* Botón para seleccionar imagen */}
              <Button
                variant="contained"
                color="primary"
                fullWidth
                startIcon={<Icon icon="mdi:image-plus" />}
                onClick={handleSelectCoverImage}
                sx={{ mb: 2 }}
              >
                {noteCoverImageUrl ? 'Cambiar Imagen de Portada' : 'Seleccionar Imagen de Portada'}
              </Button>

              {/* Campo URL manual */}
              <TextField
                fullWidth
                label="URL de la imagen (opcional)"
                value={noteCoverImageUrl}
                onChange={(e) => setNoteCoverImageUrl(e.target.value)}
                sx={{ mb: 2 }}
                helperText="URL de la imagen que aparecerá como portada"
                placeholder="https://ejemplo.com/imagen.jpg"
                size="small"
              />

              {/* Botón de subida a S3 */}
              {noteCoverImageUrl && noteCoverImageUrl.startsWith('data:image/') && (
                <>
                  {uploading && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" gutterBottom>
                        Subiendo: {uploadProgress}%
                      </Typography>
                      <LinearProgress variant="determinate" value={uploadProgress} />
                    </Box>
                  )}
                  <Button
                    variant="contained"
                    color="warning"
                    fullWidth
                    startIcon={<Icon icon="mdi:cloud-upload" />}
                    onClick={handleUploadCoverImageToS3}
                    loading={uploading}
                    sx={{ mb: 2 }}
                  >
                    ⚠️ Subir Imagen a S3 (Requerido)
                  </Button>
                </>
              )}

              {/* Input de archivo oculto para imagen de portada */}
              <input
                type="file"
                ref={coverImageFileInputRef}
                style={{ display: 'none' }}
                accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                onChange={handleCoverImageFileChange}
              />
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
        {/* Para Summary y RespaldadoPor, solo mostrar la tab de configuración */}
        {componentType === 'summary' || componentType === 'respaldadoPor'
          ? [<Tab key="config" label="📝 Configuración" />]
          : [
              <Tab
                key="main"
                label={
                  componentType === 'image'
                    ? 'Imagen'
                    : componentType === 'button'
                      ? 'Botón'
                      : componentType === 'gallery'
                        ? 'Galería'
                        : componentType === 'category'
                          ? 'Categorías'
                          : componentType === 'tituloConIcono'
                            ? 'Título'
                            : componentType === 'herramientas'
                              ? 'Herramientas'
                              : componentType === 'divider'
                                ? 'Separador'
                                : (componentType as string) === 'newsletter-header'
                                  ? 'Header Newsletter'
                                  : (componentType as string) === 'newsletter-footer'
                                    ? 'Footer Newsletter'
                                    : 'Tipografía'
                }
              />,
              ...(componentType === 'herramientas'
                ? [<Tab key="herramientas-config" label="Configuración" />]
                : []),
              // <Tab key="smart" label="🎨 Smart" />,
            ]}
      </Tabs>

      <Box sx={{ overflow: 'auto', flexGrow: 1, p: { xs: 1, sm: 2 } }}>
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

            {(componentType as string) === 'newsletter-header' && (
              <NewsletterHeaderOptions
                selectedComponentId={selectedComponentId}
                selectedComponent={selectedComponent}
                updateComponentProps={updateComponentProps}
                updateComponentStyle={updateComponentStyle}
              />
            )}

            {(componentType as string) === 'newsletter-footer' && (
              <NewsletterFooterOptions
                selectedComponentId={selectedComponentId}
                selectedComponent={selectedComponent}
                updateComponentProps={updateComponentProps}
                updateComponentStyle={updateComponentStyle}
              />
            )}

            {(componentType === 'heading' ||
              componentType === 'paragraph' ||
              componentType === 'bulletList') && (
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

        {/* Tab Smart: Última tab para todos los componentes excepto Summary y RespaldadoPor */}
        {/* {componentType !== 'summary' &&
          componentType !== 'respaldadoPor' &&
          rightPanelTab === (componentType === 'herramientas' ? 2 : 1) && (
            <SmartDesignOptions
              selectedComponentId={selectedComponentId}
              selectedComponent={selectedComponent}
              updateComponentStyle={updateComponentStyle}
              updateComponentProps={updateComponentProps}
            />
          )} */}
      </Box>
    </Box>
  );
}

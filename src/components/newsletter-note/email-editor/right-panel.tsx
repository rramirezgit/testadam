'use client';

import { useState } from 'react';

import { Alert, Snackbar } from '@mui/material';

import { useImageUpload } from './right-panel/useImageUpload';
import { useRightPanelState } from './right-panel/hooks/useRightPanelState';
import ComponentOptionsView from './right-panel/views/ComponentOptionsView';
import NewsletterFooterView from './right-panel/views/NewsletterFooterView';
import NewsletterHeaderView from './right-panel/views/NewsletterHeaderView';
import NoteConfigurationView from './right-panel/views/NoteConfigurationView';
import { useNewsletterHandlers } from './right-panel/hooks/useNewsletterHandlers';
import {
  checkStatusDisabled,
  handleInjectedComponentSelection,
} from './right-panel/utils/rightPanelHelpers';

import type { RightPanelProps } from './right-panel/types';

export default function RightPanel({
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
  selectedColumn,
  injectComponentsToNewsletter,
  showValidationErrors = false,
  highlight,
  setHighlight,
  // Props para newsletter
  isNewsletterMode = false,
  newsletterTitle = '',
  onNewsletterTitleChange = () => {},
  newsletterDescription = '',
  onNewsletterDescriptionChange = () => {},
  newsletterHeader,
  newsletterFooter,
  onHeaderChange = () => {},
  onFooterChange = () => {},
  onNewsletterConfigChange,
  newsletterStatus,
  currentNewsletterId,
  onNewsletterUpdate = () => {},
  isViewOnly = false,
  noteConfigurationViewRef,
}: RightPanelProps) {
  // Hook para subida de imágenes
  const { uploadImageToS3, uploading, uploadProgress } = useImageUpload();

  // Hook para estados locales
  const {
    localTitle,
    setLocalTitle,
    localDescription,
    setLocalDescription,
    localNewsletterTitle,
    setLocalNewsletterTitle,
    localNewsletterDescription,
    setLocalNewsletterDescription,
    containerTab,
    setContainerTab,
    openDeleteDialog,
    setOpenDeleteDialog,
    contentTypes,
    audiences,
    categories,
    loadingMetadata,
    subcategories,
  } = useRightPanelState({
    noteTitle,
    noteDescription,
    newsletterTitle,
    newsletterDescription,
    setNoteTitle,
    setNoteDescription,
    onNewsletterTitleChange,
    onNewsletterDescriptionChange,
    contentTypeId,
    categoryId,
    currentNoteId,
    setCategoryId,
    setSubcategoryId,
  });

  // Estado para notificaciones
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Función para mostrar notificaciones
  const showNotification = (
    message: string,
    severity: 'success' | 'error' | 'info' | 'warning'
  ) => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  // Función para cerrar notificaciones
  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  // Hook para handlers de newsletter
  const {
    handleLogoFileChange,
    handleSponsorFileChange,
    handleUploadLogoToS3,
    handleUploadSponsorToS3,
    handleStatusChange,
    handleDeleteNote,
  } = useNewsletterHandlers({
    newsletterHeader,
    onHeaderChange,
    uploadImageToS3,
    currentNoteId,
    updateStatus,
    noteStatus,
    showNotification,
    setOpenDeleteDialog,
  });

  // Obtener todos los componentes activos
  const allComponents = getActiveComponents();

  // Debug de componentes activos si hay un componente seleccionado
  if (process.env.NODE_ENV === 'development' && selectedComponentId) {
    console.log('🎯 RightPanel - All Components Debug:', {
      totalComponents: allComponents.length,
      componentTypes: allComponents.map((c) => ({ id: c.id, type: c.type })),
      selectedComponentId,
      isInjected: selectedComponentId ? selectedComponentId.includes('-injected-') : false,
    });
  }

  // ⚡ DEBUG: Log de selección mejorado
  console.log('🎯 RightPanel selectedComponentId:', selectedComponentId);
  console.log(
    '🎯 RightPanel isInjectedComponent:',
    selectedComponentId ? selectedComponentId.includes('-injected-') : false
  );

  // Usar la función helper para obtener el componente seleccionado
  const selectedComponent = selectedComponentId
    ? handleInjectedComponentSelection(selectedComponentId, allComponents)
    : null;

  const componentType = selectedComponent?.type;

  // Debug para newsletter header/footer
  console.log('🔍 RightPanel Debug:', {
    selectedComponentId,
    isNewsletterMode,
    hasNewsletterHeader: !!newsletterHeader,
    hasNewsletterFooter: !!newsletterFooter,
  });

  // Función helper para checkStatusDisabled
  const checkStatus = (targetStatus: string): boolean =>
    checkStatusDisabled(noteStatus, targetStatus, currentNoteId);

  // ======================
  // NEWSLETTER HEADER EDIT
  // ======================
  if (selectedComponentId === 'newsletter-header' && isNewsletterMode && newsletterHeader) {
    console.log('✅ Renderizando opciones del HEADER');

    return (
      <NewsletterHeaderView
        newsletterHeader={newsletterHeader}
        onHeaderChange={onHeaderChange}
        handleLogoFileChange={handleLogoFileChange}
        handleSponsorFileChange={handleSponsorFileChange}
        handleUploadLogoToS3={handleUploadLogoToS3}
        handleUploadSponsorToS3={handleUploadSponsorToS3}
        uploading={uploading}
        uploadProgress={uploadProgress}
        setSelectedComponentId={setSelectedComponentId}
      />
    );
  }

  // ======================
  // NEWSLETTER FOOTER EDIT
  // ======================
  if (selectedComponentId === 'newsletter-footer' && isNewsletterMode && newsletterFooter) {
    console.log('✅ Renderizando opciones del FOOTER');
    return (
      <NewsletterFooterView
        newsletterFooter={newsletterFooter}
        onFooterChange={onFooterChange}
        setSelectedComponentId={setSelectedComponentId}
      />
    );
  }

  // Determinar si debemos mostrar la configuración de la nota
  const shouldShowNoteConfiguration =
    !selectedComponent ||
    (isContainerSelected &&
      ((activeTemplate !== 'news' &&
        activeTemplate !== 'market' &&
        activeTemplate !== 'storyboard') ||
        activeVersion === 'newsletter'));

  // Renderizar configuración de la nota (consolidado)
  if (shouldShowNoteConfiguration) {
    return (
      <>
        <NoteConfigurationView
          ref={noteConfigurationViewRef}
          containerTab={containerTab}
          setContainerTab={setContainerTab}
          isNewsletterMode={isNewsletterMode}
          localNewsletterTitle={localNewsletterTitle}
          setLocalNewsletterTitle={setLocalNewsletterTitle}
          localNewsletterDescription={localNewsletterDescription}
          setLocalNewsletterDescription={setLocalNewsletterDescription}
          localTitle={localTitle}
          setLocalTitle={setLocalTitle}
          localDescription={localDescription}
          setLocalDescription={setLocalDescription}
          highlight={highlight}
          setHighlight={setHighlight}
          showValidationErrors={showValidationErrors}
          currentNewsletterId={currentNewsletterId}
          newsletterStatus={newsletterStatus}
          onNewsletterUpdate={onNewsletterUpdate}
          showNotification={showNotification}
          noteCoverImageUrl={noteCoverImageUrl}
          setNoteCoverImageUrl={setNoteCoverImageUrl}
          uploadImageToS3={uploadImageToS3}
          uploading={uploading}
          uploadProgress={uploadProgress}
          currentNoteId={currentNoteId}
          noteStatus={noteStatus}
          handleStatusChange={handleStatusChange}
          checkStatusDisabled={checkStatus}
          contentTypeId={contentTypeId}
          setContentTypeId={setContentTypeId}
          audienceId={audienceId}
          setAudienceId={setAudienceId}
          categoryId={categoryId}
          setCategoryId={setCategoryId}
          subcategoryId={subcategoryId}
          setSubcategoryId={setSubcategoryId}
          contentTypes={contentTypes}
          audiences={audiences}
          categories={categories}
          subcategories={subcategories}
          loadingMetadata={loadingMetadata}
          openDeleteDialog={openDeleteDialog}
          setOpenDeleteDialog={setOpenDeleteDialog}
          handleDeleteNote={handleDeleteNote}
          newsletterHeader={newsletterHeader}
          newsletterFooter={newsletterFooter}
          onNewsletterConfigChange={onNewsletterConfigChange}
          onHeaderChange={onHeaderChange}
          onFooterChange={onFooterChange}
          isViewOnly={isViewOnly}
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

        {/* Snackbar para notificaciones */}
        <Snackbar
          open={notification.open}
          autoHideDuration={4000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={handleCloseNotification}
            severity={notification.severity}
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </>
    );
  }

  // Renderizar opciones de componente específico
  return (
    <>
      <ComponentOptionsView
        componentType={componentType}
        selectedComponent={selectedComponent}
        selectedComponentId={selectedComponentId}
        setSelectedComponentId={setSelectedComponentId}
        rightPanelTab={rightPanelTab}
        setRightPanelTab={setRightPanelTab}
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
        isViewOnly={isViewOnly}
        openDeleteDialog={openDeleteDialog}
        setOpenDeleteDialog={setOpenDeleteDialog}
        handleDeleteNote={handleDeleteNote}
      />

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
}

'use client';

import { Box, AppBar, Dialog } from '@mui/material';

import EmailEditor from 'src/components/newsletter-note/email-editor';

import Sidebar from './sidebar';
import Toolbar from './components/toolbar';
import CustomSnackbar from './ui/custom-snackbar';
import HeaderDialog from './dialogs/header-dialog';
import FooterDialog from './dialogs/footer-dialog';
import MainContent from './components/main-content';
import TabNavigation from './components/tab-navigation';
import HtmlPreviewDialog from './dialogs/html-preview-dialog';
import useNewsletterEditor from './hooks/use-newsletter-editor';

import type { NewsletterEditorProps } from './types';

export default function NewsletterEditor({ onClose, initialNewsletter }: NewsletterEditorProps) {
  const {
    // State
    title,
    setTitle,
    description,
    setDescription,
    selectedNotes,
    editingNote,
    openNoteEditor,
    isSaving,
    activeTab,
    setActiveTab,
    sidebarTab,
    setSidebarTab,
    openSidebar,
    openSnackbar,
    snackbarMessage,
    snackbarSeverity,
    generatedHtml,
    openHtmlPreview,
    generating,
    header,
    footer,
    openHeaderDialog,
    openFooterDialog,
    notes,
    setHeader,
    setFooter,

    // Actions
    handleAddNote,
    handleRemoveNote,
    handleMoveNote,
    handleEditNote,
    handleCreateNewNote,
    handleSaveNote,
    handleSaveNewsletter,
    showSnackbar,
    handleGenerateHtml,
    handleCopyHtml,
    toggleSidebar,
    setOpenNoteEditor,
    setOpenSnackbar,
    setOpenHtmlPreview,
    setOpenHeaderDialog,
    setOpenFooterDialog,
  } = useNewsletterEditor(onClose, initialNewsletter);

  return (
    <>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar
          title={title}
          setTitle={setTitle}
          onClose={onClose}
          toggleSidebar={toggleSidebar}
          openSidebar={openSidebar}
          handleGenerateHtml={handleGenerateHtml}
          generating={generating}
          handleSaveNewsletter={handleSaveNewsletter}
          isSaving={isSaving}
          selectedNotesLength={selectedNotes.length}
        />
      </AppBar>

      <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
        {/* Left Sidebar */}
        {openSidebar && (
          <Sidebar
            sidebarTab={sidebarTab}
            setSidebarTab={setSidebarTab}
            selectedNotes={selectedNotes}
            notes={notes}
            handleAddNote={handleAddNote}
            handleRemoveNote={handleRemoveNote}
            handleEditNote={handleEditNote}
            handleCreateNewNote={handleCreateNewNote}
          />
        )}

        {/* Main Content */}
        <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
          <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

          <MainContent
            activeTab={activeTab}
            title={title}
            description={description}
            setTitle={setTitle}
            setDescription={setDescription}
            selectedNotes={selectedNotes}
            handleCreateNewNote={handleCreateNewNote}
            handleEditNote={handleEditNote}
            handleRemoveNote={handleRemoveNote}
            handleMoveNote={handleMoveNote}
            header={header}
            footer={footer}
            openHeaderDialog={() => setOpenHeaderDialog(true)}
            openFooterDialog={() => setOpenFooterDialog(true)}
          />
        </Box>
      </Box>

      {/* Note Editor Dialog */}
      <Dialog fullScreen open={openNoteEditor} onClose={() => setOpenNoteEditor(false)}>
        <EmailEditor
          onClose={() => setOpenNoteEditor(false)}
          initialNote={editingNote}
          isNewsletterMode
          onSave={handleSaveNote}
        />
      </Dialog>

      {/* HTML Preview Dialog */}
      <HtmlPreviewDialog
        open={openHtmlPreview}
        onClose={() => setOpenHtmlPreview(false)}
        generatedHtml={generatedHtml}
        onCopy={handleCopyHtml}
      />

      {/* Snackbar for notifications */}
      <CustomSnackbar
        open={openSnackbar}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={() => setOpenSnackbar(false)}
      />

      {/* Header Edit Dialog */}
      <HeaderDialog
        open={openHeaderDialog}
        onClose={() => setOpenHeaderDialog(false)}
        header={header}
        setHeader={setHeader}
      />

      {/* Footer Edit Dialog */}
      <FooterDialog
        open={openFooterDialog}
        onClose={() => setOpenFooterDialog(false)}
        footer={footer}
        setFooter={setFooter}
      />
    </>
  );
}

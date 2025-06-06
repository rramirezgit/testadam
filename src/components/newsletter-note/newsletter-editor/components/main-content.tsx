"use client"

import { Box } from "@mui/material"

import DesignTab from "../tabs/design-tab"
import ContentTab from "../tabs/content-tab"
import PreviewTab from "../tabs/preview-tab"
import HeaderDialog from "../dialogs/header-dialog"
import FooterDialog from "../dialogs/footer-dialog"
import HtmlPreviewDialog from "../dialogs/html-preview-dialog"

interface MainContentProps {
  activeTab: string
  title: string
  setTitle: (title: string) => void
  description: string
  setDescription: (description: string) => void
  selectedNotes: any[]
  handleRemoveNote: (noteId: string) => void
  handleMoveNote: (noteId: string, direction: "up" | "down") => void
  handleEditNote: (note: any) => void
  handleCreateNewNote: () => void
  header: any
  setHeader: (header: any) => void
  footer: any
  setFooter: (footer: any) => void
  openHeaderDialog: boolean
  setOpenHeaderDialog: (open: boolean) => void
  openFooterDialog: boolean
  setOpenFooterDialog: (open: boolean) => void
  openHtmlPreview: boolean
  setOpenHtmlPreview: (open: boolean) => void
  generatedHtml: string
  handleCopyHtml: () => void
}

export default function MainContent({
  activeTab,
  title,
  setTitle,
  description,
  setDescription,
  selectedNotes,
  handleRemoveNote,
  handleMoveNote,
  handleEditNote,
  handleCreateNewNote,
  header,
  setHeader,
  footer,
  setFooter,
  openHeaderDialog,
  setOpenHeaderDialog,
  openFooterDialog,
  setOpenFooterDialog,
  openHtmlPreview,
  setOpenHtmlPreview,
  generatedHtml,
  handleCopyHtml,
}: MainContentProps) {
  return (
    <Box sx={{ flexGrow: 1, height: "100%", overflow: "auto" }}>
      {activeTab === "content" && (
        <ContentTab
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          selectedNotes={selectedNotes}
          handleRemoveNote={handleRemoveNote}
          handleMoveNote={handleMoveNote}
          handleEditNote={handleEditNote}
          handleCreateNewNote={handleCreateNewNote}
        />
      )}

      {activeTab === "design" && (
        <DesignTab
          header={header}
          footer={footer}
          setOpenHeaderDialog={setOpenHeaderDialog}
          setOpenFooterDialog={setOpenFooterDialog}
        />
      )}

      {activeTab === "preview" && (
        <PreviewTab
          header={header}
          footer={footer}
          title={title}
          description={description}
          selectedNotes={selectedNotes}
        />
      )}

      {/* Dialogs */}
      <HeaderDialog
        open={openHeaderDialog}
        onClose={() => setOpenHeaderDialog(false)}
        header={header}
        setHeader={setHeader}
      />

      <FooterDialog
        open={openFooterDialog}
        onClose={() => setOpenFooterDialog(false)}
        footer={footer}
        setFooter={setFooter}
      />

      <HtmlPreviewDialog
        open={openHtmlPreview}
        onClose={() => setOpenHtmlPreview(false)}
        html={generatedHtml}
        onCopy={handleCopyHtml}
      />
    </Box>
  )
}

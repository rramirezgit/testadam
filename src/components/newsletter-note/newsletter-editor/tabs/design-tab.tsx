"use client"

import type React from "react"

import { useState } from "react"
import { Box, Typography, Tabs, Tab, Button, Grid } from "@mui/material"
import { useNewsletterEditor } from "../hooks/use-newsletter-editor"
import BannerSelector from "../../banner-selector"
import { bannerOptions } from "../../../components/email-editor/data/banner-options"
import ColorPicker from "../../color-picker"
import { galleryLayouts } from "../../gallery-selector"

export default function DesignTab() {
  const {
    newsletter,
    selectedComponent,
    updateNewsletter,
    updateComponent,
    openHeaderDialog,
    openFooterDialog,
    openBannerDialog,
  } = useNewsletterEditor()

  const [activeTab, setActiveTab] = useState(0)

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  const handleGalleryLayoutChange = (layout: string) => {
    if (selectedComponent && selectedComponent.type === "gallery") {
      updateComponent({
        ...selectedComponent,
        layout,
      })
    }
  }

  const renderGalleryOptions = () => {
    if (!selectedComponent || selectedComponent.type !== "gallery") return null

    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Diseño
        </Typography>

        <Typography variant="subtitle2" gutterBottom>
          Tipo de layout
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          {galleryLayouts.map((layout) => (
            <Grid item xs={12} sm={6} key={layout.id}>
              <Button
                variant={selectedComponent.layout === layout.id ? "contained" : "outlined"}
                fullWidth
                onClick={() => handleGalleryLayoutChange(layout.id)}
                sx={{
                  justifyContent: "center",
                  height: "48px",
                  textTransform: "none",
                }}
              >
                {layout.name}
              </Button>
            </Grid>
          ))}
        </Grid>

        <Typography variant="subtitle2" gutterBottom>
          Imágenes de la galería
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          fullWidth
          onClick={() => {
            // Esta funcionalidad se maneja en el componente padre
          }}
          sx={{ mb: 2 }}
        >
          Editar imágenes
        </Button>
      </Box>
    )
  }

  const renderBackgroundOptions = () => {
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Fondo
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          Color de fondo
        </Typography>
        <ColorPicker
          color={newsletter.backgroundColor || "#ffffff"}
          onChange={(color) => updateNewsletter({ backgroundColor: color })}
          sx={{ mb: 3 }}
        />

        <Typography variant="subtitle2" gutterBottom>
          Banner
        </Typography>
        <BannerSelector
          options={bannerOptions}
          selectedBanner={newsletter.banner || null}
          onSelect={(bannerId) => updateNewsletter({ banner: bannerId })}
        />
        <Button variant="outlined" color="primary" fullWidth onClick={openBannerDialog} sx={{ mt: 2 }}>
          Personalizar banner
        </Button>
      </Box>
    )
  }

  const renderGeneralOptions = () => {
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Diseño
        </Typography>
        <Button variant="outlined" color="primary" fullWidth onClick={openHeaderDialog} sx={{ mb: 2 }}>
          Editar encabezado
        </Button>
        <Button variant="outlined" color="primary" fullWidth onClick={openFooterDialog} sx={{ mb: 2 }}>
          Editar pie de página
        </Button>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 2 }}>
      <Tabs value={activeTab} onChange={handleTabChange} aria-label="design tabs" sx={{ mb: 2 }}>
        <Tab label="GALERÍA" disabled={!selectedComponent || selectedComponent.type !== "gallery"} />
        <Tab label="DISEÑO" />
        <Tab label="FONDO" />
      </Tabs>

      {activeTab === 0 && renderGalleryOptions()}
      {activeTab === 1 && renderGeneralOptions()}
      {activeTab === 2 && renderBackgroundOptions()}
    </Box>
  )
}

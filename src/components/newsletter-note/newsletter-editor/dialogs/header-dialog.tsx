"use client"

import { Dialog, DialogTitle, Box, Grid, TextField, Typography, Button } from "@mui/material"
import { Icon } from "@iconify/react"
import type { HeaderDialogProps } from "../types"
import { useState } from "react"
import LogoDialog from "./logo-dialog"
import BannerDialog from "./banner-dialog"

export default function HeaderDialog({ open, onClose, header, setHeader }: HeaderDialogProps) {
  const [openLogoDialog, setOpenLogoDialog] = useState(false)
  const [openBannerDialog, setOpenBannerDialog] = useState(false)
  const [logoUrl, setLogoUrl] = useState("")
  const [bannerImageUrl, setBannerImageUrl] = useState("")

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Edit Newsletter Header</DialogTitle>
        <Box sx={{ px: 3, pb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Header Title"
                value={header.title}
                onChange={(e) => setHeader({ ...header, title: e.target.value })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Subtitle"
                value={header.subtitle}
                onChange={(e) => setHeader({ ...header, subtitle: e.target.value })}
                margin="normal"
              />
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Text Alignment
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={4}>
                    <Button
                      variant={header.alignment === "left" ? "contained" : "outlined"}
                      fullWidth
                      onClick={() => setHeader({ ...header, alignment: "left" })}
                    >
                      <Icon icon="mdi:format-align-left" />
                    </Button>
                  </Grid>
                  <Grid item xs={4}>
                    <Button
                      variant={header.alignment === "center" ? "contained" : "outlined"}
                      fullWidth
                      onClick={() => setHeader({ ...header, alignment: "center" })}
                    >
                      <Icon icon="mdi:format-align-center" />
                    </Button>
                  </Grid>
                  <Grid item xs={4}>
                    <Button
                      variant={header.alignment === "right" ? "contained" : "outlined"}
                      fullWidth
                      onClick={() => setHeader({ ...header, alignment: "right" })}
                    >
                      <Icon icon="mdi:format-align-right" />
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="caption" display="block" gutterBottom>
                    Background
                  </Typography>
                  <input
                    type="color"
                    value={header.backgroundColor}
                    onChange={(e) => setHeader({ ...header, backgroundColor: e.target.value })}
                    style={{ width: 40, height: 40, padding: 0, border: "none" }}
                  />
                </Box>
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="caption" display="block" gutterBottom>
                    Text Color
                  </Typography>
                  <input
                    type="color"
                    value={header.textColor}
                    onChange={(e) => setHeader({ ...header, textColor: e.target.value })}
                    style={{ width: 40, height: 40, padding: 0, border: "none" }}
                  />
                </Box>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Logo
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Logo URL"
                    value={header.logo || ""}
                    onChange={(e) => setHeader({ ...header, logo: e.target.value })}
                  />
                  <Button variant="outlined" sx={{ ml: 1, minWidth: "auto" }} onClick={() => setOpenLogoDialog(true)}>
                    <Icon icon="mdi:upload" />
                  </Button>
                </Box>
                {header.logo && (
                  <Box sx={{ mt: 1, textAlign: "center" }}>
                    <img src={header.logo || "/placeholder.svg"} alt="Logo" style={{ maxHeight: "50px" }} />
                  </Box>
                )}
              </Box>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Banner Image
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Banner Image URL"
                    value={header.bannerImage || ""}
                    onChange={(e) => setHeader({ ...header, bannerImage: e.target.value })}
                  />
                  <Button variant="outlined" sx={{ ml: 1, minWidth: "auto" }} onClick={() => setOpenBannerDialog(true)}>
                    <Icon icon="mdi:upload" />
                  </Button>
                </Box>
                {header.bannerImage && (
                  <Box sx={{ mt: 1, textAlign: "center" }}>
                    <img src={header.bannerImage || "/placeholder.svg"} alt="Banner" style={{ maxWidth: "100%" }} />
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <Button onClick={onClose} sx={{ mr: 1 }}>
              Cancel
            </Button>
            <Button variant="contained" onClick={onClose}>
              Apply
            </Button>
          </Box>
        </Box>
      </Dialog>

      <LogoDialog
        open={openLogoDialog}
        onClose={() => setOpenLogoDialog(false)}
        logoUrl={logoUrl}
        setLogoUrl={setLogoUrl}
        onSave={(url) => {
          if (url) {
            setHeader({ ...header, logo: url })
          }
          setOpenLogoDialog(false)
        }}
      />

      <BannerDialog
        open={openBannerDialog}
        onClose={() => setOpenBannerDialog(false)}
        bannerImageUrl={bannerImageUrl}
        setBannerImageUrl={setBannerImageUrl}
        onSave={(url) => {
          if (url) {
            setHeader({ ...header, bannerImage: url })
          }
          setOpenBannerDialog(false)
        }}
      />
    </>
  )
}

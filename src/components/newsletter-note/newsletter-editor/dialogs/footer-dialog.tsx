"use client"

import { Dialog, DialogTitle, Box, Grid, TextField, Typography, Button, IconButton } from "@mui/material"
import { Icon } from "@iconify/react"
import type { FooterDialogProps } from "../types"

export default function FooterDialog({ open, onClose, footer, setFooter }: FooterDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Newsletter Footer</DialogTitle>
      <Box sx={{ px: 3, pb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Company Name"
              value={footer.companyName}
              onChange={(e) => setFooter({ ...footer, companyName: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Address"
              value={footer.address || ""}
              onChange={(e) => setFooter({ ...footer, address: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Contact Email"
              value={footer.contactEmail || ""}
              onChange={(e) => setFooter({ ...footer, contactEmail: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Unsubscribe Link"
              value={footer.unsubscribeLink || "#"}
              onChange={(e) => setFooter({ ...footer, unsubscribeLink: e.target.value })}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="caption" display="block" gutterBottom>
                  Background
                </Typography>
                <input
                  type="color"
                  value={footer.backgroundColor}
                  onChange={(e) => setFooter({ ...footer, backgroundColor: e.target.value })}
                  style={{ width: 40, height: 40, padding: 0, border: "none" }}
                />
              </Box>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="caption" display="block" gutterBottom>
                  Text Color
                </Typography>
                <input
                  type="color"
                  value={footer.textColor}
                  onChange={(e) => setFooter({ ...footer, textColor: e.target.value })}
                  style={{ width: 40, height: 40, padding: 0, border: "none" }}
                />
              </Box>
            </Box>
            <Typography variant="subtitle2" gutterBottom>
              Social Links
            </Typography>
            {footer.socialLinks?.map((link, index) => (
              <Box key={index} sx={{ display: "flex", mb: 1 }}>
                <TextField
                  size="small"
                  label="Platform"
                  value={link.platform}
                  onChange={(e) => {
                    const newLinks = [...(footer.socialLinks || [])]
                    newLinks[index] = { ...newLinks[index], platform: e.target.value }
                    setFooter({ ...footer, socialLinks: newLinks })
                  }}
                  sx={{ width: "40%" }}
                />
                <TextField
                  size="small"
                  label="URL"
                  value={link.url}
                  onChange={(e) => {
                    const newLinks = [...(footer.socialLinks || [])]
                    newLinks[index] = { ...newLinks[index], url: e.target.value }
                    setFooter({ ...footer, socialLinks: newLinks })
                  }}
                  sx={{ width: "60%", ml: 1 }}
                />
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => {
                    const newLinks = [...(footer.socialLinks || [])]
                    newLinks.splice(index, 1)
                    setFooter({ ...footer, socialLinks: newLinks })
                  }}
                >
                  <Icon icon="mdi:delete" />
                </IconButton>
              </Box>
            ))}
            <Button
              variant="outlined"
              size="small"
              startIcon={<Icon icon="mdi:plus" />}
              onClick={() => {
                const newLinks = [...(footer.socialLinks || [])]
                newLinks.push({ platform: "new", url: "#" })
                setFooter({ ...footer, socialLinks: newLinks })
              }}
              sx={{ mt: 1 }}
            >
              Add Social Link
            </Button>
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
  )
}

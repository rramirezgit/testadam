"use client"
import { Box, Typography, Grid, Card, CardContent, CardMedia } from "@mui/material"

export const galleryLayouts = [
  {
    id: "single",
    name: "1 Imagen",
    description: "Una sola imagen a ancho completo",
    previewImage: "/abstract-geometric-shapes.png",
  },
  {
    id: "double",
    name: "2 Imágenes",
    description: "Dos imágenes lado a lado",
    previewImage: "/contrasting-cityscapes.png",
  },
  {
    id: "grid",
    name: "4 Imágenes",
    description: "Cuatro imágenes en una cuadrícula 2x2",
    previewImage: "/diverse-activities-grid.png",
  },
  {
    id: "feature",
    name: "3 Imágenes (Destacada)",
    description: "Dos imágenes pequeñas a la izquierda y una grande a la derecha",
    previewImage: "/asymmetrical-gallery.png",
  },
  {
    id: "masonry",
    name: "3 Imágenes (Mosaico)",
    description: "Una imagen grande a la izquierda y dos pequeñas a la derecha",
    previewImage: "/colorful-abstract-masonry.png",
  },
  {
    id: "hero",
    name: "3 Imágenes (Hero)",
    description: "Una imagen grande arriba y dos pequeñas abajo",
    previewImage: "/modern-office-hero.png",
  },
]

export default function GallerySelector({ selectedLayout, onSelectLayout }) {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Selecciona un diseño de galería
      </Typography>
      <Grid container spacing={2}>
        {galleryLayouts.map((layout) => (
          <Grid item xs={12} sm={6} md={4} key={layout.id}>
            <Card
              sx={{
                cursor: "pointer",
                border: selectedLayout === layout.id ? "2px solid #3f51b5" : "1px solid #e0e0e0",
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
              onClick={() => onSelectLayout(layout.id)}
            >
              <CardMedia
                component="img"
                height="80"
                image={layout.previewImage}
                alt={layout.name}
                sx={{ objectFit: "cover" }}
              />
              <CardContent sx={{ flexGrow: 1, p: 1.5 }}>
                <Typography variant="subtitle1" component="div">
                  {layout.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {layout.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

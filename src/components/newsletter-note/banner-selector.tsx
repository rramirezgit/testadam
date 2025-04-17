"use client"
import { Typography, Grid, Card, CardActionArea, CardMedia, CardContent } from "@mui/material"

export interface BannerOption {
  id: string
  name: string
  color?: string
  gradient?: string[]
  pattern?: string
  preview: string
}

interface BannerSelectorProps {
  options: BannerOption[]
  selectedBanner: string | null
  onSelect: (bannerId: string) => void
}

export default function BannerSelector({ options, selectedBanner, onSelect }: BannerSelectorProps) {
  return (
    <Grid container spacing={2}>
      {options.map((option) => (
        <Grid item xs={6} key={option.id}>
          <Card
            variant="outlined"
            sx={{
              borderColor: selectedBanner === option.id ? "primary.main" : "divider",
              ...(selectedBanner === option.id && {
                boxShadow: "0 0 0 2px rgba(63, 81, 181, 0.2)",
              }),
            }}
          >
            <CardActionArea onClick={() => onSelect(option.id)}>
              <CardMedia
                component="img"
                height="60"
                image={option.preview}
                alt={option.name}
                sx={{ objectFit: "cover" }}
              />
              <CardContent sx={{ p: 1 }}>
                <Typography variant="caption" component="div" align="center">
                  {option.name}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

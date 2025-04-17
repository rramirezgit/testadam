import type { BannerOption } from 'src/components/newsletter-note/banner-selector';

export const bannerOptions: BannerOption[] = [
  {
    id: 'solid-white',
    name: 'Fondo Blanco',
    color: '#ffffff',
    preview: '/blank-canvas.png',
  },
  {
    id: 'solid-light',
    name: 'Gris Claro',
    color: '#f5f5f5',
    preview: '/light-gray-canvas.png',
  },
  {
    id: 'gradient-blue',
    name: 'Gradiente Azul',
    color: '#e9f2ff',
    gradient: ['#e9f2ff', '#c7d8f2'],
    preview: '/calming-blue-gradient.png',
  },
  {
    id: 'gradient-warm',
    name: 'Gradiente Cálido',
    color: '#fff9e9',
    gradient: ['#fff9e9', '#ffefd5'],
    preview: '/sunset-glow.png',
  },
  {
    id: 'pattern-dots',
    name: 'Patrón de Puntos',
    color: '#f8f9fa',
    pattern: 'dots',
    preview: '/abstract-geometric-dots.png',
  },
  {
    id: 'pattern-lines',
    name: 'Patrón de Líneas',
    color: '#f8f9fa',
    pattern: 'lines',
    preview: '/abstract-lined-pattern.png',
  },
];

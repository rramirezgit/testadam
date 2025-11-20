// Configuración única para el componente NewsletterHeader
// Header con imagen de fondo

export interface NewsletterHeaderConfig {
  textColor: string;
  padding: number;
  alignment: 'left' | 'center' | 'right';
  borderRadius: string;
  margin: string;
  // Imagen de fondo
  backgroundImageUrl: string;
  backgroundSize: string;
  backgroundPosition: string;
  backgroundRepeat: string;
  minHeight: string;
}

// Configuración única del header con imagen de fondo
export const NEWSLETTER_HEADER_CONFIG: NewsletterHeaderConfig = {
  textColor: '#FFFFFF',
  padding: 32,
  alignment: 'center',
  borderRadius: '38px 38px 0 0',
  margin: '0 0 24px 0',
  backgroundImageUrl: 'https://s3.amazonaws.com/s3.condoor.ai/pala/408ef0ed15.webp',
  backgroundSize: 'cover',
  backgroundPosition: 'top center',
  backgroundRepeat: 'no-repeat',
  minHeight: '331px',
};

// Helper para obtener la configuración del header
export const getHeaderConfig = (): NewsletterHeaderConfig => NEWSLETTER_HEADER_CONFIG;

import { File04, ZapCircle, BarChart01, Attachment02 } from '@untitledui/icons';

export const emailTemplates = [
  {
    id: 'blank',
    name: 'En blanco',
    description: 'Comienza con una plantilla vacía',
    image: '', // Necesitarás crear esta imagen
    icon: <File04 width={40} height={40} />, // Añadir un icono por defecto
  },
  {
    id: 'news',
    name: 'Noticias',
    description: 'Template para artículos y noticias con versión web y newsletter',
    icon: <Attachment02 width={40} height={40} />,
    image: '',
  },
  {
    id: 'market',
    name: 'Mercado',
    description: 'Análisis de mercado con galería de 4 imágenes y versión web',
    icon: <BarChart01 width={40} height={40} />,
    image: '',
  },
  {
    id: 'feature',
    name: 'Características',
    description: 'Destaca características de producto con texto e íconos',
    icon: <ZapCircle width={40} height={40} />,
    image: '',
  },
  {
    id: 'newsletter',
    name: 'Newsletter',
    description: 'Plantilla de prueba para newsletter',
    icon: 'mdi:email-outline',
    image: '',
  },
  // {
  //   id: 'notion',
  //   name: 'Notion Magic Link',
  //   description: 'Template para enviar un enlace mágico de inicio de sesión',
  //   icon: 'mdi:notion',
  //   image: '/notion-email-template-mockup.png',
  // },
  // {
  //   id: 'plaid',
  //   name: 'Plaid Verify Identity',
  //   description: 'Template para verificar la identidad del usuario',
  //   icon: 'mdi:shield-check',
  //   image: '/plaid-verification-email-concept.png',
  // },
  // {
  //   id: 'stripe',
  //   name: 'Stripe Welcome',
  //   description: 'Template de bienvenida para nuevos usuarios de Stripe',
  //   icon: 'mdi:currency-usd',
  //   image: '/modern-business-welcome.png',
  // },
  // {
  //   id: 'vercel',
  //   name: 'Vercel Invite User',
  //   description: 'Template para invitar usuarios a un equipo de Vercel',
  //   icon: 'mdi:triangle',
  //   image: '/vercel-invitation-concept.png',
  // },
];

export const emailTemplates = [
  {
    id: 'blank',
    name: 'En blanco',
    description: 'Comienza con una plantilla vacía',
    image: '/templates/blank.png', // Necesitarás crear esta imagen
    icon: 'mdi:file-outline', // Añadir un icono por defecto
  },
  {
    id: 'news',
    name: 'Noticias',
    description: 'Template para artículos y noticias con versión web y newsletter',
    icon: 'mdi:newspaper',
    image: '/assets/images/templates/news.svg',
  },
  {
    id: 'notion',
    name: 'Notion Magic Link',
    description: 'Template para enviar un enlace mágico de inicio de sesión',
    icon: 'mdi:notion',
    image: '/notion-email-template-mockup.png',
  },
  {
    id: 'plaid',
    name: 'Plaid Verify Identity',
    description: 'Template para verificar la identidad del usuario',
    icon: 'mdi:shield-check',
    image: '/plaid-verification-email-concept.png',
  },
  {
    id: 'stripe',
    name: 'Stripe Welcome',
    description: 'Template de bienvenida para nuevos usuarios de Stripe',
    icon: 'mdi:currency-usd',
    image: '/modern-business-welcome.png',
  },
  {
    id: 'vercel',
    name: 'Vercel Invite User',
    description: 'Template para invitar usuarios a un equipo de Vercel',
    icon: 'mdi:triangle',
    image: '/vercel-invitation-concept.png',
  },
];

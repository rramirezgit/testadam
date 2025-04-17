import type { EmailComponent } from 'src/types/saved-note';

// Notion components
export const notionComponents: EmailComponent[] = [
  { id: 'heading-1', type: 'heading', content: 'Login', props: { level: 1 } },
  { id: 'paragraph-1', type: 'paragraph', content: 'Click here to log in with this magic link' },
  {
    id: 'paragraph-2',
    type: 'paragraph',
    content: 'Or, copy and paste this temporary login code:',
  },
  {
    id: 'paragraph-3',
    type: 'paragraph',
    content: 'sparo-ndigo-amurt-secan',
    props: { isCode: true },
  },
  {
    id: 'paragraph-4',
    type: 'paragraph',
    content: "If you didn't try to login, you can safely ignore this email.",
  },
  {
    id: 'paragraph-5',
    type: 'paragraph',
    content: 'Hint: You can set a permanent password in Settings & members → My account.',
  },
];

export const notionComponentsWeb: EmailComponent[] = [
  { id: 'heading-1-web', type: 'heading', content: 'Login to Your Account', props: { level: 1 } },
  {
    id: 'paragraph-1-web',
    type: 'paragraph',
    content: 'Welcome back! Click here to log in with this magic link to access your account.',
  },
  {
    id: 'paragraph-2-web',
    type: 'paragraph',
    content: 'If you prefer, you can copy and paste this temporary login code:',
  },
  {
    id: 'paragraph-3-web',
    type: 'paragraph',
    content: 'sparo-ndigo-amurt-secan',
    props: { isCode: true },
  },
  {
    id: 'paragraph-4-web',
    type: 'paragraph',
    content:
      "This code will expire in 24 hours for security reasons. If you didn't try to login, you can safely ignore this email.",
  },
  {
    id: 'paragraph-5-web',
    type: 'paragraph',
    content:
      'For enhanced security, we recommend setting a permanent password in Settings & members → My account. This will allow you to log in directly without requiring a magic link each time.',
  },
  {
    id: 'paragraph-6-web',
    type: 'paragraph',
    content:
      'If you have any questions or need assistance, please contact our support team at support@example.com.',
  },
];

// Plaid components
export const plaidComponents: EmailComponent[] = [
  { id: 'heading-1', type: 'heading', content: 'Verify Your Identity', props: { level: 1 } },
  {
    id: 'paragraph-1',
    type: 'paragraph',
    content: 'Enter the following code to finish linking Venmo.',
  },
  { id: 'paragraph-2', type: 'paragraph', content: '144833', props: { isCode: true } },
  { id: 'paragraph-3', type: 'paragraph', content: 'Not expecting this email?' },
  {
    id: 'paragraph-4',
    type: 'paragraph',
    content: 'Contact login@plaid.com if you did not request this code.',
  },
];

export const plaidComponentsWeb: EmailComponent[] = [
  { id: 'heading-1-web', type: 'heading', content: 'Verify Your Identity', props: { level: 1 } },
  {
    id: 'paragraph-1-web',
    type: 'paragraph',
    content:
      'Thank you for choosing to link your Venmo account. To complete the verification process, please enter the following code:',
  },
  { id: 'paragraph-2-web', type: 'paragraph', content: '144833', props: { isCode: true } },
  {
    id: 'paragraph-3-web',
    type: 'paragraph',
    content:
      'This code will expire in 10 minutes. If you need a new code, please return to the verification page and request another one.',
  },
  {
    id: 'paragraph-4-web',
    type: 'paragraph',
    content:
      'Not expecting this email? If you did not request this verification code, please contact our security team immediately at login@plaid.com or call our support line at (800) 123-4567.',
  },
  {
    id: 'paragraph-5-web',
    type: 'paragraph',
    content:
      'For your security, we recommend using strong, unique passwords for all your financial accounts and enabling two-factor authentication whenever possible.',
  },
  {
    id: 'paragraph-6-web',
    type: 'paragraph',
    content:
      'Thank you for trusting us with your financial information. We take your security seriously.',
  },
];

// Stripe components
export const stripeComponents: EmailComponent[] = [
  { id: 'heading-1', type: 'heading', content: 'Welcome to Stripe', props: { level: 1 } },
  {
    id: 'paragraph-1',
    type: 'paragraph',
    content:
      "Thanks for submitting your account information. You're now ready to make live transactions with Stripe!",
  },
  {
    id: 'paragraph-2',
    type: 'paragraph',
    content:
      'You can view your payments and a variety of other information about your account right from your dashboard.',
  },
  { id: 'button-1', type: 'button', content: 'View your Stripe Dashboard' },
  { id: 'divider-1', type: 'divider', content: '' },
  { id: 'paragraph-3', type: 'paragraph', content: '— The Stripe team' },
];

export const stripeComponentsWeb: EmailComponent[] = [
  {
    id: 'heading-1-web',
    type: 'heading',
    content: 'Welcome to Stripe - Your Payment Partner',
    props: { level: 1 },
  },
  {
    id: 'paragraph-1-web',
    type: 'paragraph',
    content:
      "Congratulations! We're excited to let you know that your account information has been successfully processed. Your Stripe account is now fully activated and ready for live transactions.",
  },
  {
    id: 'paragraph-2-web',
    type: 'paragraph',
    content:
      'With Stripe, you gain access to a comprehensive payment platform designed to help your business grow. Our robust infrastructure ensures secure, reliable payment processing for you and your customers.',
  },
  {
    id: 'paragraph-3-web',
    type: 'paragraph',
    content:
      'Your Stripe Dashboard is your command center for all payment activities. From here, you can:',
  },
  {
    id: 'bulletList-1-web',
    type: 'bulletList',
    content: '',
    props: {
      items: [
        'Track all transactions in real-time',
        'Generate detailed financial reports',
        'Manage customer information securely',
        'Set up recurring billing and subscriptions',
        'Customize your checkout experience',
      ],
    },
  },
  { id: 'button-1-web', type: 'button', content: 'Access Your Stripe Dashboard' },
  { id: 'divider-1-web', type: 'divider', content: '' },
  {
    id: 'paragraph-4-web',
    type: 'paragraph',
    content:
      'We recommend taking a few minutes to explore your dashboard and familiarize yourself with its features. Our documentation center also provides comprehensive guides to help you make the most of your Stripe account.',
  },
  {
    id: 'paragraph-5-web',
    type: 'paragraph',
    content:
      'If you have any questions or need assistance, our support team is available 24/7 to help you.',
  },
  { id: 'divider-2-web', type: 'divider', content: '' },
  {
    id: 'paragraph-6-web',
    type: 'paragraph',
    content:
      'Thank you for choosing Stripe as your payment partner. We look forward to helping your business succeed!',
  },
  { id: 'paragraph-7-web', type: 'paragraph', content: '— The Stripe team' },
];

// Vercel components
export const vercelComponents: EmailComponent[] = [
  { id: 'heading-1', type: 'heading', content: 'Join Enigma on Vercel', props: { level: 1 } },
  { id: 'paragraph-1', type: 'paragraph', content: 'Hello alanturing,' },
  {
    id: 'paragraph-2',
    type: 'paragraph',
    content: 'Alan (alan.turing@example.com) has invited you to the Enigma team on Vercel.',
  },
  { id: 'button-1', type: 'button', content: 'Join the team' },
  {
    id: 'paragraph-3',
    type: 'paragraph',
    content:
      'This invitation was intended for alanturing. This invite was sent from 204.13.186.218 located in São Paulo, Brazil. If you were not expecting this invitation, you can ignore this email.',
  },
];

export const vercelComponentsWeb: EmailComponent[] = [
  {
    id: 'heading-1-web',
    type: 'heading',
    content: "You're Invited to Join the Enigma Team on Vercel",
    props: { level: 1 },
  },
  { id: 'paragraph-1-web', type: 'paragraph', content: 'Hello alanturing,' },
  {
    id: 'paragraph-2-web',
    type: 'paragraph',
    content:
      'Great news! Alan (alan.turing@example.com) has invited you to collaborate on the Enigma project as a team member on Vercel.',
  },
  {
    id: 'paragraph-3-web',
    type: 'paragraph',
    content: 'Joining the Enigma team will give you access to:',
  },
  {
    id: 'bulletList-1-web',
    type: 'bulletList',
    content: '',
    props: {
      items: [
        'All project repositories and code',
        'Deployment and preview environments',
        'Analytics and performance monitoring',
        'Team collaboration tools',
      ],
    },
  },
  { id: 'button-1-web', type: 'button', content: 'Accept Invitation & Join Team' },
  {
    id: 'paragraph-4-web',
    type: 'paragraph',
    content:
      "If you're new to Vercel, you'll be guided through a simple account setup process after accepting the invitation.",
  },
  { id: 'divider-1-web', type: 'divider', content: '' },
  {
    id: 'paragraph-5-web',
    type: 'paragraph',
    content:
      'This invitation will expire in 7 days. If you need a new invitation after that time, please contact Alan directly.',
  },
  {
    id: 'paragraph-6-web',
    type: 'paragraph',
    content:
      'This invitation was intended for alanturing. This invite was sent from 204.13.186.218 located in São Paulo, Brazil. If you were not expecting this invitation, you can ignore this email or contact Vercel support.',
  },
  { id: 'divider-2-web', type: 'divider', content: '' },
  {
    id: 'paragraph-7-web',
    type: 'paragraph',
    content: 'Vercel Inc. • San Francisco, CA • Privacy Policy • Terms of Service',
  },
];

// News components
export const newsComponents: EmailComponent[] = [
  { id: 'category-1', type: 'category', content: 'Tecnología', props: { color: '#4caf50' } },
  {
    id: 'image-1',
    type: 'image',
    content: '',
    props: {
      src: '/interconnected-tech.png',
      alt: 'Imagen de la noticia',
    },
  },
  { id: 'heading-1', type: 'heading', content: 'Título de la noticia', props: { level: 1 } },
  {
    id: 'author-1',
    type: 'author',
    content: 'Respaldado por texto',
    props: { author: 'Redacción' },
  },
  {
    id: 'summary-1',
    type: 'summary',
    content: 'Resumen breve de la noticia',
    props: {
      icon: 'mdi:text-box-outline',
      label: 'Resumen de la noticia',
    },
  },
  {
    id: 'paragraph-1',
    type: 'paragraph',
    content:
      'Este es el contenido principal de la noticia en formato resumido para newsletter. Incluye los puntos más importantes y relevantes de manera concisa.',
  },
  {
    id: 'paragraph-2',
    type: 'paragraph',
    content:
      'La versión newsletter está diseñada para ser breve y directa, permitiendo al lector obtener la información esencial rápidamente.',
  },
  { id: 'button-1', type: 'button', content: 'Leer más en nuestra web' },
];

export const newsComponentsWeb: EmailComponent[] = [
  { id: 'category-1-web', type: 'category', content: 'Tecnología', props: { color: '#4caf50' } },
  {
    id: 'image-1-web',
    type: 'image',
    content: '',
    props: {
      src: '/tech-news-desk.png',
      alt: 'Imagen principal de la noticia',
    },
  },
  {
    id: 'heading-1-web',
    type: 'heading',
    content: 'Título completo de la noticia con más detalles',
    props: { level: 1 },
  },
  {
    id: 'author-1-web',
    type: 'author',
    content: 'Respaldado por texto',
    props: { author: 'Juan Pérez', date: '15 de abril, 2024' },
  },
  {
    id: 'summary-1-web',
    type: 'summary',
    content:
      'Resumen detallado de la noticia que proporciona una visión general del contenido completo que se desarrollará a continuación. Este resumen es más extenso que la versión de newsletter.',
    props: {
      icon: 'mdi:text-box-outline',
      label: 'Resumen de la noticia',
    },
  },
  {
    id: 'paragraph-1-web',
    type: 'paragraph',
    content:
      'Este es el primer párrafo del contenido principal de la noticia en su versión web. Aquí se desarrolla con mayor profundidad el tema, incluyendo más contexto y detalles que en la versión de newsletter.',
  },
  {
    id: 'paragraph-2-web',
    type: 'paragraph',
    content:
      'En el segundo párrafo podemos expandir sobre los aspectos más técnicos o específicos del tema. La versión web permite un desarrollo más extenso y detallado de la información.',
  },
  {
    id: 'image-2-web',
    type: 'image',
    content: '',
    props: {
      src: '/interconnected-network.png',
      alt: 'Imagen secundaria relacionada con la noticia',
    },
  },
  {
    id: 'paragraph-3-web',
    type: 'paragraph',
    content:
      'Después de la imagen secundaria, continuamos con más información relevante. Este formato permite incluir múltiples imágenes y secciones para enriquecer el contenido.',
  },
  {
    id: 'heading-2-web',
    type: 'heading',
    content: 'Subtítulo para una nueva sección',
    props: { level: 2 },
  },
  {
    id: 'paragraph-4-web',
    type: 'paragraph',
    content:
      'En esta sección podemos abordar otro aspecto importante de la noticia. La estructura con subtítulos mejora la legibilidad y organización del contenido extenso.',
  },
  {
    id: 'bulletList-1-web',
    type: 'bulletList',
    content: '',
    props: {
      items: [
        'Primer punto importante a destacar',
        'Segundo punto con información adicional',
        'Tercer punto con datos relevantes',
        'Conclusión o resumen del tema',
      ],
    },
  },
  {
    id: 'paragraph-5-web',
    type: 'paragraph',
    content:
      'Para finalizar, podemos incluir una conclusión o reflexión sobre el tema tratado, invitando al lector a comentar o compartir la noticia en redes sociales.',
  },
  { id: 'divider-1-web', type: 'divider', content: '' },
  {
    id: 'paragraph-6-web',
    type: 'paragraph',
    content:
      'Si te interesó esta noticia, también podrían interesarte nuestros artículos relacionados sobre inteligencia artificial y desarrollo web.',
  },
];

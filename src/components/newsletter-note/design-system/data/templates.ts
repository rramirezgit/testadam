import type { HeaderTemplate, FooterTemplate, TemplateCategory, ComponentTemplate } from '../types';

// ============================================================================
// PROFESSIONAL TEMPLATES DATABASE - Newsletter Design System
// ============================================================================

// Header Templates - 25+ Professional Options
export const headerTemplates: HeaderTemplate[] = [
  // CORPORATE CATEGORY
  {
    id: 'corporate-classic',
    name: 'Corporate Classic',
    category: 'corporate',
    preview: '/assets/templates/headers/corporate-classic.jpg',
    description: 'Professional header with clean typography and subtle branding',
    tags: ['professional', 'business', 'clean', 'minimal'],
    template: {
      title: 'Corporate Newsletter',
      subtitle: 'Your trusted business insights',
      logo: '/assets/logos/corporate-logo.png',
      bannerImage: '',
      backgroundColor: '#1e3a8a',
      textColor: '#ffffff',
      alignment: 'center',
      showGradient: false,
    },
  },
  {
    id: 'corporate-gradient',
    name: 'Corporate Gradient',
    category: 'corporate',
    preview: '/assets/templates/headers/corporate-gradient.jpg',
    description: 'Modern corporate look with professional gradient background',
    tags: ['professional', 'gradient', 'modern', 'corporate'],
    template: {
      title: 'Business Weekly',
      subtitle: 'Excellence in every update',
      logo: '/assets/logos/corporate-logo.png',
      bannerImage: '',
      backgroundColor: '#1e3a8a',
      textColor: '#ffffff',
      alignment: 'center',
      showGradient: true,
      gradientColors: ['#1e3a8a', '#3b82f6'],
      gradientDirection: 135,
    },
  },
  {
    id: 'corporate-minimal',
    name: 'Corporate Minimal',
    category: 'corporate',
    preview: '/assets/templates/headers/corporate-minimal.jpg',
    description: 'Ultra-clean design focusing on content over decoration',
    tags: ['minimal', 'clean', 'professional', 'typography'],
    template: {
      title: 'Executive Brief',
      subtitle: 'Strategic insights for leaders',
      logo: '',
      bannerImage: '',
      backgroundColor: '#f8fafc',
      textColor: '#1e293b',
      alignment: 'left',
      showGradient: false,
    },
  },

  // CREATIVE CATEGORY
  {
    id: 'creative-vibrant',
    name: 'Creative Vibrant',
    category: 'creative',
    preview: '/assets/templates/headers/creative-vibrant.jpg',
    description: 'Colorful and energetic design perfect for creative agencies',
    tags: ['colorful', 'creative', 'energetic', 'artistic'],
    template: {
      title: 'Creative Pulse',
      subtitle: 'Inspiration delivered weekly',
      logo: '/assets/logos/creative-logo.png',
      bannerImage: '/assets/banners/creative-banner.jpg',
      backgroundColor: '#7c3aed',
      textColor: '#ffffff',
      alignment: 'center',
      showGradient: true,
      gradientColors: ['#7c3aed', '#ec4899', '#f59e0b'],
      gradientDirection: 45,
    },
  },
  {
    id: 'creative-artistic',
    name: 'Creative Artistic',
    category: 'creative',
    preview: '/assets/templates/headers/creative-artistic.jpg',
    description: 'Artistic layout with creative typography and visual elements',
    tags: ['artistic', 'typography', 'visual', 'creative'],
    template: {
      title: 'Design Studio',
      subtitle: 'Where creativity meets innovation',
      logo: '/assets/logos/studio-logo.png',
      bannerImage: '/assets/banners/artistic-banner.jpg',
      backgroundColor: '#1f2937',
      textColor: '#f9fafb',
      alignment: 'center',
      showGradient: false,
      backgroundPattern: {
        type: 'dots',
        color: '#374151',
        opacity: 0.3,
        size: 4,
        spacing: 20,
      },
    },
  },

  // MINIMAL CATEGORY
  {
    id: 'minimal-clean',
    name: 'Minimal Clean',
    category: 'minimal',
    preview: '/assets/templates/headers/minimal-clean.jpg',
    description: 'Pure minimalism with focus on typography and whitespace',
    tags: ['minimal', 'clean', 'typography', 'whitespace'],
    template: {
      title: 'The Weekly',
      subtitle: 'Curated content, simplified',
      logo: '',
      bannerImage: '',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      alignment: 'center',
      showGradient: false,
    },
  },
  {
    id: 'minimal-elegant',
    name: 'Minimal Elegant',
    category: 'minimal',
    preview: '/assets/templates/headers/minimal-elegant.jpg',
    description: 'Sophisticated minimalism with subtle elegance',
    tags: ['minimal', 'elegant', 'sophisticated', 'subtle'],
    template: {
      title: 'Refined',
      subtitle: 'Elegance in simplicity',
      logo: '',
      bannerImage: '',
      backgroundColor: '#fafafa',
      textColor: '#2d2d2d',
      alignment: 'center',
      showGradient: false,
    },
  },

  // MODERN CATEGORY
  {
    id: 'modern-tech',
    name: 'Modern Tech',
    category: 'modern',
    preview: '/assets/templates/headers/modern-tech.jpg',
    description: 'Futuristic design perfect for tech companies and startups',
    tags: ['tech', 'modern', 'futuristic', 'startup'],
    template: {
      title: 'Tech Insider',
      subtitle: 'Innovation at the speed of thought',
      logo: '/assets/logos/tech-logo.png',
      bannerImage: '',
      backgroundColor: '#0f172a',
      textColor: '#f1f5f9',
      alignment: 'center',
      showGradient: true,
      gradientColors: ['#0f172a', '#1e293b', '#334155'],
      gradientDirection: 180,
    },
  },
  {
    id: 'modern-geometric',
    name: 'Modern Geometric',
    category: 'modern',
    preview: '/assets/templates/headers/modern-geometric.jpg',
    description: 'Bold geometric patterns with contemporary design language',
    tags: ['geometric', 'modern', 'bold', 'contemporary'],
    template: {
      title: 'Forward',
      subtitle: 'Progressive insights for modern minds',
      logo: '/assets/logos/geometric-logo.png',
      bannerImage: '',
      backgroundColor: '#059669',
      textColor: '#ffffff',
      alignment: 'center',
      showGradient: false,
      backgroundPattern: {
        type: 'grid',
        color: '#047857',
        opacity: 0.4,
        size: 24,
      },
    },
  },

  // CLASSIC CATEGORY
  {
    id: 'classic-newspaper',
    name: 'Classic Newspaper',
    category: 'classic',
    preview: '/assets/templates/headers/classic-newspaper.jpg',
    description: 'Traditional newspaper-style header with serif typography',
    tags: ['newspaper', 'classic', 'traditional', 'serif'],
    template: {
      title: 'The Daily Herald',
      subtitle: 'Est. 2024 | Your trusted news source',
      logo: '/assets/logos/newspaper-logo.png',
      bannerImage: '',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      alignment: 'center',
      showGradient: false,
      useCustomFont: true,
      customFontUrl: 'fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap',
    },
  },
  {
    id: 'classic-magazine',
    name: 'Classic Magazine',
    category: 'classic',
    preview: '/assets/templates/headers/classic-magazine.jpg',
    description: 'Elegant magazine-style layout with sophisticated typography',
    tags: ['magazine', 'classic', 'elegant', 'sophisticated'],
    template: {
      title: 'Style & Substance',
      subtitle: 'A magazine for the discerning reader',
      logo: '/assets/logos/magazine-logo.png',
      bannerImage: '/assets/banners/magazine-banner.jpg',
      backgroundColor: '#8b5a3c',
      textColor: '#ffffff',
      alignment: 'center',
      showGradient: false,
    },
  },

  // COLORFUL CATEGORY
  {
    id: 'colorful-rainbow',
    name: 'Colorful Rainbow',
    category: 'colorful',
    preview: '/assets/templates/headers/colorful-rainbow.jpg',
    description: 'Vibrant rainbow gradient perfect for lifestyle and entertainment',
    tags: ['rainbow', 'vibrant', 'lifestyle', 'entertainment'],
    template: {
      title: 'Life in Color',
      subtitle: 'Celebrating the spectrum of experiences',
      logo: '/assets/logos/colorful-logo.png',
      bannerImage: '',
      backgroundColor: '#ff6b6b',
      textColor: '#ffffff',
      alignment: 'center',
      showGradient: true,
      gradientColors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'],
      gradientDirection: 90,
    },
  },
  {
    id: 'colorful-sunset',
    name: 'Colorful Sunset',
    category: 'colorful',
    preview: '/assets/templates/headers/colorful-sunset.jpg',
    description: 'Warm sunset colors creating an inviting atmosphere',
    tags: ['sunset', 'warm', 'inviting', 'nature'],
    template: {
      title: 'Golden Hour',
      subtitle: 'Where every moment shines',
      logo: '/assets/logos/sunset-logo.png',
      bannerImage: '',
      backgroundColor: '#ff7b00',
      textColor: '#ffffff',
      alignment: 'center',
      showGradient: true,
      gradientColors: ['#ff7b00', '#ff8e53', '#ff6b9d'],
      gradientDirection: 45,
    },
  },

  // DARK CATEGORY
  {
    id: 'dark-premium',
    name: 'Dark Premium',
    category: 'dark',
    preview: '/assets/templates/headers/dark-premium.jpg',
    description: 'Luxurious dark theme with premium feel',
    tags: ['dark', 'premium', 'luxury', 'elegant'],
    template: {
      title: 'Noir',
      subtitle: 'Premium insights in dark elegance',
      logo: '/assets/logos/premium-logo.png',
      bannerImage: '',
      backgroundColor: '#0a0a0a',
      textColor: '#ffffff',
      alignment: 'center',
      showGradient: true,
      gradientColors: ['#0a0a0a', '#1a1a1a', '#2a2a2a'],
      gradientDirection: 135,
    },
  },
  {
    id: 'dark-neon',
    name: 'Dark Neon',
    category: 'dark',
    preview: '/assets/templates/headers/dark-neon.jpg',
    description: 'Cyberpunk-inspired design with neon accents',
    tags: ['dark', 'neon', 'cyberpunk', 'futuristic'],
    template: {
      title: 'Cyber Weekly',
      subtitle: 'Future insights, delivered today',
      logo: '/assets/logos/cyber-logo.png',
      bannerImage: '',
      backgroundColor: '#0d1117',
      textColor: '#00ff88',
      alignment: 'center',
      showGradient: false,
      backgroundPattern: {
        type: 'grid',
        color: '#00ff88',
        opacity: 0.1,
        size: 20,
      },
    },
  },

  // GRADIENT CATEGORY
  {
    id: 'gradient-ocean',
    name: 'Gradient Ocean',
    category: 'gradient',
    preview: '/assets/templates/headers/gradient-ocean.jpg',
    description: 'Calming ocean-inspired gradient for wellness and lifestyle',
    tags: ['ocean', 'calming', 'wellness', 'lifestyle'],
    template: {
      title: 'Deep Blue',
      subtitle: 'Diving into wellness and mindfulness',
      logo: '/assets/logos/ocean-logo.png',
      bannerImage: '',
      backgroundColor: '#0ea5e9',
      textColor: '#ffffff',
      alignment: 'center',
      showGradient: true,
      gradientColors: ['#0ea5e9', '#3b82f6', '#1e40af'],
      gradientDirection: 180,
    },
  },
  {
    id: 'gradient-forest',
    name: 'Gradient Forest',
    category: 'gradient',
    preview: '/assets/templates/headers/gradient-forest.jpg',
    description: 'Nature-inspired green gradient for eco and sustainability content',
    tags: ['nature', 'eco', 'sustainability', 'green'],
    template: {
      title: 'Green Earth',
      subtitle: 'Sustainable living for a better tomorrow',
      logo: '/assets/logos/eco-logo.png',
      bannerImage: '',
      backgroundColor: '#059669',
      textColor: '#ffffff',
      alignment: 'center',
      showGradient: true,
      gradientColors: ['#059669', '#16a34a', '#22c55e'],
      gradientDirection: 45,
    },
  },
];

// Footer Templates - 20+ Professional Options
export const footerTemplates: FooterTemplate[] = [
  // CORPORATE FOOTERS
  {
    id: 'corporate-standard',
    name: 'Corporate Standard',
    category: 'corporate',
    preview: '/assets/templates/footers/corporate-standard.jpg',
    description: 'Professional footer with all essential business information',
    tags: ['professional', 'business', 'complete', 'standard'],
    template: {
      companyName: 'Your Corporation',
      address: '123 Business Avenue, Corporate City, ST 12345',
      contactEmail: 'contact@yourcorp.com',
      socialLinks: [
        { platform: 'linkedin', url: 'https://linkedin.com/company/yourcorp' },
        { platform: 'twitter', url: 'https://twitter.com/yourcorp' },
        { platform: 'facebook', url: 'https://facebook.com/yourcorp' },
      ],
      unsubscribeLink: '#unsubscribe',
      backgroundColor: '#f8fafc',
      textColor: '#64748b',
      socialIconStyle: 'minimal',
      layoutType: 'three-column',
    },
  },
  {
    id: 'corporate-dark',
    name: 'Corporate Dark',
    category: 'corporate',
    preview: '/assets/templates/footers/corporate-dark.jpg',
    description: 'Professional dark footer for corporate communications',
    tags: ['professional', 'dark', 'corporate', 'elegant'],
    template: {
      companyName: 'Enterprise Solutions',
      address: '456 Executive Plaza, Business District, ST 67890',
      contactEmail: 'info@enterprise.com',
      socialLinks: [
        { platform: 'linkedin', url: 'https://linkedin.com/company/enterprise' },
        { platform: 'twitter', url: 'https://twitter.com/enterprise' },
      ],
      unsubscribeLink: '#unsubscribe',
      backgroundColor: '#1e293b',
      textColor: '#cbd5e1',
      socialIconStyle: 'filled',
      layoutType: 'two-column',
    },
  },

  // MINIMAL FOOTERS
  {
    id: 'minimal-simple',
    name: 'Minimal Simple',
    category: 'minimal',
    preview: '/assets/templates/footers/minimal-simple.jpg',
    description: 'Clean and simple footer with essential information only',
    tags: ['minimal', 'clean', 'simple', 'essential'],
    template: {
      companyName: 'Minimal Co.',
      address: '',
      contactEmail: 'hello@minimal.co',
      socialLinks: [],
      unsubscribeLink: '#unsubscribe',
      backgroundColor: '#ffffff',
      textColor: '#6b7280',
      socialIconStyle: 'minimal',
      layoutType: 'centered',
    },
  },

  // CREATIVE FOOTERS
  {
    id: 'creative-colorful',
    name: 'Creative Colorful',
    category: 'creative',
    preview: '/assets/templates/footers/creative-colorful.jpg',
    description: 'Vibrant footer design for creative agencies and startups',
    tags: ['creative', 'colorful', 'vibrant', 'agency'],
    template: {
      companyName: 'Creative Agency',
      address: '789 Design Street, Creative Quarter, CR 11111',
      contactEmail: 'hello@creative.agency',
      socialLinks: [
        { platform: 'instagram', url: 'https://instagram.com/creative.agency' },
        { platform: 'dribbble', url: 'https://dribbble.com/creative-agency' },
        { platform: 'behance', url: 'https://behance.net/creative-agency' },
      ],
      unsubscribeLink: '#unsubscribe',
      backgroundColor: '#7c3aed',
      textColor: '#ffffff',
      showGradient: true,
      gradientColors: ['#7c3aed', '#ec4899'],
      gradientDirection: 45,
      socialIconStyle: 'rounded',
      layoutType: 'two-column',
    },
  },

  // MODERN FOOTERS
  {
    id: 'modern-tech',
    name: 'Modern Tech',
    category: 'modern',
    preview: '/assets/templates/footers/modern-tech.jpg',
    description: 'Futuristic footer design for tech companies',
    tags: ['modern', 'tech', 'futuristic', 'startup'],
    template: {
      companyName: 'TechCorp',
      address: '101 Innovation Drive, Tech Valley, TV 22222',
      contactEmail: 'contact@techcorp.io',
      socialLinks: [
        { platform: 'twitter', url: 'https://twitter.com/techcorp' },
        { platform: 'github', url: 'https://github.com/techcorp' },
        { platform: 'linkedin', url: 'https://linkedin.com/company/techcorp' },
      ],
      unsubscribeLink: '#unsubscribe',
      backgroundColor: '#0f172a',
      textColor: '#94a3b8',
      socialIconStyle: 'outlined',
      layoutType: 'three-column',
    },
  },

  // GRADIENT FOOTERS
  {
    id: 'gradient-sunset',
    name: 'Gradient Sunset',
    category: 'gradient',
    preview: '/assets/templates/footers/gradient-sunset.jpg',
    description: 'Warm sunset gradient footer for lifestyle brands',
    tags: ['gradient', 'sunset', 'warm', 'lifestyle'],
    template: {
      companyName: 'Sunset Brands',
      address: '555 Golden Avenue, Sunset City, SC 33333',
      contactEmail: 'info@sunset.brands',
      socialLinks: [
        { platform: 'instagram', url: 'https://instagram.com/sunset.brands' },
        { platform: 'facebook', url: 'https://facebook.com/sunset.brands' },
        { platform: 'youtube', url: 'https://youtube.com/sunset-brands' },
      ],
      unsubscribeLink: '#unsubscribe',
      backgroundColor: '#ff7b00',
      textColor: '#ffffff',
      showGradient: true,
      gradientColors: ['#ff7b00', '#ff8e53', '#ff6b9d'],
      gradientDirection: 90,
      socialIconStyle: 'circle',
      layoutType: 'centered',
    },
  },
];

// Component Templates - Reusable Components
export const componentTemplates: ComponentTemplate[] = [
  // BUTTON COMPONENTS
  {
    id: 'button-primary',
    name: 'Primary Button',
    type: 'button',
    category: 'modern',
    preview: '/assets/templates/components/button-primary.jpg',
    description: 'Standard primary action button',
    config: {
      text: 'Get Started',
      backgroundColor: '#3b82f6',
      textColor: '#ffffff',
      borderRadius: 8,
      padding: { x: 24, y: 12 },
      fontSize: 16,
      fontWeight: 600,
    },
  },
  {
    id: 'button-gradient',
    name: 'Gradient Button',
    type: 'button',
    category: 'creative',
    preview: '/assets/templates/components/button-gradient.jpg',
    description: 'Eye-catching gradient button',
    config: {
      text: 'Learn More',
      gradient: ['#7c3aed', '#ec4899'],
      textColor: '#ffffff',
      borderRadius: 12,
      padding: { x: 28, y: 14 },
      fontSize: 16,
      fontWeight: 700,
    },
  },

  // DIVIDER COMPONENTS
  {
    id: 'divider-simple',
    name: 'Simple Divider',
    type: 'divider',
    category: 'minimal',
    preview: '/assets/templates/components/divider-simple.jpg',
    description: 'Clean horizontal divider',
    config: {
      height: 1,
      color: '#e5e7eb',
      margin: { top: 24, bottom: 24 },
    },
  },
  {
    id: 'divider-decorative',
    name: 'Decorative Divider',
    type: 'divider',
    category: 'classic',
    preview: '/assets/templates/components/divider-decorative.jpg',
    description: 'Ornamental divider with decorative elements',
    config: {
      height: 3,
      color: '#d1d5db',
      pattern: 'dots',
      margin: { top: 32, bottom: 32 },
    },
  },

  // SOCIAL LINKS COMPONENTS
  {
    id: 'social-minimal',
    name: 'Minimal Social Links',
    type: 'social-links',
    category: 'minimal',
    preview: '/assets/templates/components/social-minimal.jpg',
    description: 'Clean social media links',
    config: {
      style: 'minimal',
      size: 24,
      spacing: 16,
      color: '#6b7280',
      hoverColor: '#374151',
    },
  },
  {
    id: 'social-colorful',
    name: 'Colorful Social Links',
    type: 'social-links',
    category: 'colorful',
    preview: '/assets/templates/components/social-colorful.jpg',
    description: 'Vibrant brand-colored social icons',
    config: {
      style: 'filled',
      size: 32,
      spacing: 12,
      useBrandColors: true,
    },
  },
];

// Template Categories Helper
export const templateCategories: TemplateCategory[] = [
  'corporate',
  'creative',
  'minimal',
  'modern',
  'classic',
  'colorful',
  'dark',
  'gradient',
];

// Template Search and Filter Functions
export const getTemplatesByCategory = (
  category: TemplateCategory,
  type?: 'header' | 'footer' | 'component'
): (HeaderTemplate | FooterTemplate | ComponentTemplate)[] => {
  let templates: (HeaderTemplate | FooterTemplate | ComponentTemplate)[] = [];

  if (!type || type === 'header') {
    templates = [...templates, ...headerTemplates.filter((t) => t.category === category)];
  }

  if (!type || type === 'footer') {
    templates = [...templates, ...footerTemplates.filter((t) => t.category === category)];
  }

  if (!type || type === 'component') {
    templates = [...templates, ...componentTemplates.filter((t) => t.category === category)];
  }

  return templates;
};

export const searchTemplates = (
  query: string,
  type?: 'header' | 'footer' | 'component'
): (HeaderTemplate | FooterTemplate | ComponentTemplate)[] => {
  const lowerQuery = query.toLowerCase();
  let allTemplates: (HeaderTemplate | FooterTemplate | ComponentTemplate)[] = [];

  if (!type || type === 'header') allTemplates = [...allTemplates, ...headerTemplates];
  if (!type || type === 'footer') allTemplates = [...allTemplates, ...footerTemplates];
  if (!type || type === 'component') allTemplates = [...allTemplates, ...componentTemplates];

  return allTemplates.filter((template) => {
    const searchInName = template.name.toLowerCase().includes(lowerQuery);
    const searchInDescription = template.description.toLowerCase().includes(lowerQuery);

    // Check tags based on template type
    let searchInTags = false;
    if ('tags' in template) {
      searchInTags = template.tags.some((tag) => tag.toLowerCase().includes(lowerQuery));
    }

    return searchInName || searchInDescription || searchInTags;
  });
};

export const getFeaturedTemplates = (limit = 6): (HeaderTemplate | FooterTemplate)[] => {
  const featured = [
    headerTemplates.find((t) => t.id === 'corporate-gradient'),
    headerTemplates.find((t) => t.id === 'creative-vibrant'),
    headerTemplates.find((t) => t.id === 'minimal-clean'),
    footerTemplates.find((t) => t.id === 'corporate-standard'),
    footerTemplates.find((t) => t.id === 'creative-colorful'),
    footerTemplates.find((t) => t.id === 'gradient-sunset'),
  ].filter(Boolean) as (HeaderTemplate | FooterTemplate)[];

  return featured.slice(0, limit);
};

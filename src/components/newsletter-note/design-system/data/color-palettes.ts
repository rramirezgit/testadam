import type { ColorPalette, ColorPaletteCategory } from '../types';

// ============================================================================
// PROFESSIONAL COLOR PALETTES - Newsletter Design System
// ============================================================================

// Material Design Color Palettes
const materialPalettes: ColorPalette[] = [
  {
    id: 'material-blue',
    name: 'Material Blue',
    category: 'material',
    description: 'Classic Material Design blue palette for professional applications',
    primary: '#1976d2',
    secondary: '#42a5f5',
    accent: '#ff4081',
    background: '#fafafa',
    surface: '#ffffff',
    text: '#212121',
    textSecondary: '#757575',
    success: '#4caf50',
    warning: '#ff9800',
    error: '#f44336',
    info: '#2196f3',
    shades: {
      primary: [
        {
          name: '50',
          value: '#e3f2fd',
          contrast: 8.5,
          usage: ['backgrounds', 'subtle highlights'],
        },
        {
          name: '100',
          value: '#bbdefb',
          contrast: 7.2,
          usage: ['light backgrounds', 'disabled states'],
        },
        { name: '200', value: '#90caf9', contrast: 5.8, usage: ['hover states', 'light accents'] },
        { name: '300', value: '#64b5f6', contrast: 4.9, usage: ['secondary buttons', 'icons'] },
        { name: '400', value: '#42a5f5', contrast: 4.2, usage: ['active states', 'links'] },
        { name: '500', value: '#2196f3', contrast: 3.7, usage: ['primary actions', 'main brand'] },
        {
          name: '600',
          value: '#1e88e5',
          contrast: 4.1,
          usage: ['primary buttons', 'active navigation'],
        },
        { name: '700', value: '#1976d2', contrast: 4.8, usage: ['headers', 'important elements'] },
        { name: '800', value: '#1565c0', contrast: 5.9, usage: ['dark themes', 'emphasis'] },
        { name: '900', value: '#0d47a1', contrast: 7.2, usage: ['high contrast', 'dark text'] },
      ],
      secondary: [
        { name: '50', value: '#e1f5fe', contrast: 8.8, usage: ['light backgrounds'] },
        { name: '100', value: '#b3e5fc', contrast: 7.5, usage: ['subtle highlights'] },
        { name: '200', value: '#81d4fa', contrast: 6.1, usage: ['hover states'] },
        { name: '300', value: '#4fc3f7', contrast: 4.9, usage: ['secondary elements'] },
        { name: '400', value: '#29b6f6', contrast: 4.2, usage: ['active states'] },
        { name: '500', value: '#03a9f4', contrast: 3.8, usage: ['secondary actions'] },
        { name: '600', value: '#039be5', contrast: 4.3, usage: ['secondary buttons'] },
        { name: '700', value: '#0288d1', contrast: 5.1, usage: ['secondary headers'] },
        { name: '800', value: '#0277bd', contrast: 6.2, usage: ['dark secondary'] },
        { name: '900', value: '#01579b', contrast: 8.1, usage: ['high contrast secondary'] },
      ],
      accent: [
        { name: '50', value: '#fce4ec', contrast: 8.2, usage: ['light accent backgrounds'] },
        { name: '100', value: '#f8bbd9', contrast: 6.8, usage: ['subtle accent highlights'] },
        { name: '200', value: '#f48fb1', contrast: 5.4, usage: ['accent hover states'] },
        { name: '300', value: '#f06292', contrast: 4.6, usage: ['accent elements'] },
        { name: '400', value: '#ec407a', contrast: 4.1, usage: ['accent active states'] },
        { name: '500', value: '#e91e63', contrast: 3.9, usage: ['accent actions'] },
        { name: '600', value: '#d81b60', contrast: 4.4, usage: ['accent buttons'] },
        { name: '700', value: '#c2185b', contrast: 5.2, usage: ['accent headers'] },
        { name: '800', value: '#ad1457', contrast: 6.3, usage: ['dark accent'] },
        { name: '900', value: '#880e4f', contrast: 8.7, usage: ['high contrast accent'] },
      ],
    },
    accessibility: {
      wcagAA: true,
      wcagAAA: true,
      contrastRatio: 4.8,
      recommendations: [
        'Excellent for body text',
        'Suitable for all UI elements',
        'High accessibility compliance',
      ],
    },
  },
  {
    id: 'material-green',
    name: 'Material Green',
    category: 'material',
    description: 'Nature-inspired green palette for eco-friendly and health applications',
    primary: '#388e3c',
    secondary: '#66bb6a',
    accent: '#ff5722',
    background: '#f1f8e9',
    surface: '#ffffff',
    text: '#1b5e20',
    textSecondary: '#4e4e4e',
    success: '#4caf50',
    warning: '#ff9800',
    error: '#f44336',
    info: '#2196f3',
    shades: {
      primary: [
        {
          name: '50',
          value: '#e8f5e8',
          contrast: 9.1,
          usage: ['light backgrounds', 'success states'],
        },
        { name: '100', value: '#c8e6c9', contrast: 7.8, usage: ['subtle highlights'] },
        { name: '200', value: '#a5d6a7', contrast: 6.3, usage: ['hover states'] },
        { name: '300', value: '#81c784', contrast: 5.1, usage: ['secondary elements'] },
        { name: '400', value: '#66bb6a', contrast: 4.4, usage: ['active states'] },
        { name: '500', value: '#4caf50', contrast: 3.9, usage: ['primary actions'] },
        { name: '600', value: '#43a047', contrast: 4.5, usage: ['primary buttons'] },
        { name: '700', value: '#388e3c', contrast: 5.4, usage: ['headers'] },
        { name: '800', value: '#2e7d32', contrast: 6.7, usage: ['dark themes'] },
        { name: '900', value: '#1b5e20', contrast: 9.2, usage: ['high contrast'] },
      ],
      secondary: [
        { name: '50', value: '#f3e5f5', contrast: 8.9, usage: ['light backgrounds'] },
        { name: '100', value: '#e1bee7', contrast: 7.4, usage: ['subtle highlights'] },
        { name: '200', value: '#ce93d8', contrast: 5.9, usage: ['hover states'] },
        { name: '300', value: '#ba68c8', contrast: 4.8, usage: ['secondary elements'] },
        { name: '400', value: '#ab47bc', contrast: 4.2, usage: ['active states'] },
        { name: '500', value: '#9c27b0', contrast: 3.8, usage: ['secondary actions'] },
        { name: '600', value: '#8e24aa', contrast: 4.4, usage: ['secondary buttons'] },
        { name: '700', value: '#7b1fa2', contrast: 5.3, usage: ['secondary headers'] },
        { name: '800', value: '#6a1b9a', contrast: 6.8, usage: ['dark secondary'] },
        { name: '900', value: '#4a148c', contrast: 9.1, usage: ['high contrast secondary'] },
      ],
      accent: [
        { name: '50', value: '#fbe9e7', contrast: 8.5, usage: ['light accent backgrounds'] },
        { name: '100', value: '#ffccbc', contrast: 7.1, usage: ['subtle accent highlights'] },
        { name: '200', value: '#ffab91', contrast: 5.6, usage: ['accent hover states'] },
        { name: '300', value: '#ff8a65', contrast: 4.7, usage: ['accent elements'] },
        { name: '400', value: '#ff7043', contrast: 4.1, usage: ['accent active states'] },
        { name: '500', value: '#ff5722', contrast: 3.7, usage: ['accent actions'] },
        { name: '600', value: '#f4511e', contrast: 4.2, usage: ['accent buttons'] },
        { name: '700', value: '#e64a19', contrast: 4.9, usage: ['accent headers'] },
        { name: '800', value: '#d84315', contrast: 6.1, usage: ['dark accent'] },
        { name: '900', value: '#bf360c', contrast: 8.3, usage: ['high contrast accent'] },
      ],
    },
    accessibility: {
      wcagAA: true,
      wcagAAA: true,
      contrastRatio: 5.4,
      recommendations: [
        'Perfect for eco and health brands',
        'High readability',
        'Calming and trustworthy',
      ],
    },
  },
];

// Tailwind CSS Color Palettes
const tailwindPalettes: ColorPalette[] = [
  {
    id: 'tailwind-slate',
    name: 'Tailwind Slate',
    category: 'tailwind',
    description: 'Modern neutral palette perfect for contemporary interfaces',
    primary: '#0f172a',
    secondary: '#475569',
    accent: '#3b82f6',
    background: '#f8fafc',
    surface: '#ffffff',
    text: '#0f172a',
    textSecondary: '#64748b',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#06b6d4',
    shades: {
      primary: [
        { name: '50', value: '#f8fafc', contrast: 1.0, usage: ['backgrounds', 'cards'] },
        { name: '100', value: '#f1f5f9', contrast: 1.1, usage: ['subtle backgrounds'] },
        { name: '200', value: '#e2e8f0', contrast: 1.3, usage: ['borders', 'dividers'] },
        { name: '300', value: '#cbd5e1', contrast: 1.8, usage: ['placeholder text'] },
        { name: '400', value: '#94a3b8', contrast: 2.9, usage: ['disabled states'] },
        { name: '500', value: '#64748b', contrast: 4.1, usage: ['secondary text'] },
        { name: '600', value: '#475569', contrast: 5.8, usage: ['body text'] },
        { name: '700', value: '#334155', contrast: 8.1, usage: ['headings'] },
        { name: '800', value: '#1e293b', contrast: 12.1, usage: ['high contrast text'] },
        { name: '900', value: '#0f172a', contrast: 17.8, usage: ['maximum contrast'] },
      ],
      secondary: [
        { name: '50', value: '#eff6ff', contrast: 1.0, usage: ['light backgrounds'] },
        { name: '100', value: '#dbeafe', contrast: 1.2, usage: ['subtle highlights'] },
        { name: '200', value: '#bfdbfe', contrast: 1.6, usage: ['hover states'] },
        { name: '300', value: '#93c5fd', contrast: 2.4, usage: ['secondary elements'] },
        { name: '400', value: '#60a5fa', contrast: 3.5, usage: ['active states'] },
        { name: '500', value: '#3b82f6', contrast: 4.8, usage: ['primary actions'] },
        { name: '600', value: '#2563eb', contrast: 6.1, usage: ['primary buttons'] },
        { name: '700', value: '#1d4ed8', contrast: 7.9, usage: ['headers'] },
        { name: '800', value: '#1e40af', contrast: 10.2, usage: ['dark themes'] },
        { name: '900', value: '#1e3a8a', contrast: 13.1, usage: ['high contrast'] },
      ],
      accent: [
        { name: '50', value: '#fef2f2', contrast: 1.0, usage: ['light accent backgrounds'] },
        { name: '100', value: '#fee2e2', contrast: 1.2, usage: ['subtle accent highlights'] },
        { name: '200', value: '#fecaca', contrast: 1.6, usage: ['accent hover states'] },
        { name: '300', value: '#fca5a5', contrast: 2.4, usage: ['accent elements'] },
        { name: '400', value: '#f87171', contrast: 3.2, usage: ['accent active states'] },
        { name: '500', value: '#ef4444', contrast: 4.1, usage: ['accent actions'] },
        { name: '600', value: '#dc2626', contrast: 5.4, usage: ['accent buttons'] },
        { name: '700', value: '#b91c1c', contrast: 7.2, usage: ['accent headers'] },
        { name: '800', value: '#991b1b', contrast: 9.1, usage: ['dark accent'] },
        { name: '900', value: '#7f1d1d', contrast: 11.8, usage: ['high contrast accent'] },
      ],
    },
    accessibility: {
      wcagAA: true,
      wcagAAA: true,
      contrastRatio: 5.8,
      recommendations: [
        'Excellent for modern interfaces',
        'High contrast ratios',
        'Professional appearance',
      ],
    },
  },
];

// Brand Color Palettes
const brandPalettes: ColorPalette[] = [
  {
    id: 'brand-professional',
    name: 'Professional Blue',
    category: 'brand',
    description: 'Corporate blue palette for professional communications',
    primary: '#1e40af',
    secondary: '#64748b',
    accent: '#f59e0b',
    background: '#f8fafc',
    surface: '#ffffff',
    text: '#1e293b',
    textSecondary: '#64748b',
    success: '#059669',
    warning: '#d97706',
    error: '#dc2626',
    info: '#0284c7',
    shades: {
      primary: [
        { name: '50', value: '#eff6ff', contrast: 1.0, usage: ['backgrounds'] },
        { name: '100', value: '#dbeafe', contrast: 1.2, usage: ['light highlights'] },
        { name: '200', value: '#bfdbfe', contrast: 1.6, usage: ['hover states'] },
        { name: '300', value: '#93c5fd', contrast: 2.4, usage: ['secondary elements'] },
        { name: '400', value: '#60a5fa', contrast: 3.5, usage: ['interactive elements'] },
        { name: '500', value: '#3b82f6', contrast: 4.8, usage: ['primary brand'] },
        { name: '600', value: '#2563eb', contrast: 6.1, usage: ['primary actions'] },
        { name: '700', value: '#1d4ed8', contrast: 7.9, usage: ['headers'] },
        { name: '800', value: '#1e40af', contrast: 10.2, usage: ['dark brand'] },
        { name: '900', value: '#1e3a8a', contrast: 13.1, usage: ['high contrast'] },
      ],
      secondary: [
        { name: '50', value: '#f8fafc', contrast: 1.0, usage: ['neutral backgrounds'] },
        { name: '100', value: '#f1f5f9', contrast: 1.1, usage: ['card backgrounds'] },
        { name: '200', value: '#e2e8f0', contrast: 1.3, usage: ['borders'] },
        { name: '300', value: '#cbd5e1', contrast: 1.8, usage: ['dividers'] },
        { name: '400', value: '#94a3b8', contrast: 2.9, usage: ['placeholder'] },
        { name: '500', value: '#64748b', contrast: 4.1, usage: ['secondary text'] },
        { name: '600', value: '#475569', contrast: 5.8, usage: ['body text'] },
        { name: '700', value: '#334155', contrast: 8.1, usage: ['headings'] },
        { name: '800', value: '#1e293b', contrast: 12.1, usage: ['dark text'] },
        { name: '900', value: '#0f172a', contrast: 17.8, usage: ['maximum contrast'] },
      ],
      accent: [
        { name: '50', value: '#fffbeb', contrast: 1.0, usage: ['warning backgrounds'] },
        { name: '100', value: '#fef3c7', contrast: 1.2, usage: ['warning highlights'] },
        { name: '200', value: '#fde68a', contrast: 1.6, usage: ['warning hover'] },
        { name: '300', value: '#fcd34d', contrast: 2.1, usage: ['warning elements'] },
        { name: '400', value: '#fbbf24', contrast: 2.8, usage: ['warning active'] },
        { name: '500', value: '#f59e0b', contrast: 3.6, usage: ['warning primary'] },
        { name: '600', value: '#d97706', contrast: 4.8, usage: ['warning buttons'] },
        { name: '700', value: '#b45309', contrast: 6.4, usage: ['warning headers'] },
        { name: '800', value: '#92400e', contrast: 8.7, usage: ['warning dark'] },
        { name: '900', value: '#78350f', contrast: 11.9, usage: ['warning high contrast'] },
      ],
    },
    accessibility: {
      wcagAA: true,
      wcagAAA: true,
      contrastRatio: 6.1,
      recommendations: [
        'Perfect for corporate communications',
        'Trustworthy and reliable',
        'High professional appeal',
      ],
    },
  },
];

// Nature Color Palettes
const naturePalettes: ColorPalette[] = [
  {
    id: 'nature-forest',
    name: 'Forest Green',
    category: 'nature',
    description: 'Earth-inspired palette perfect for sustainability and wellness brands',
    primary: '#065f46',
    secondary: '#6b7280',
    accent: '#d97706',
    background: '#f0fdf4',
    surface: '#ffffff',
    text: '#064e3b',
    textSecondary: '#6b7280',
    success: '#059669',
    warning: '#d97706',
    error: '#dc2626',
    info: '#0891b2',
    shades: {
      primary: [
        { name: '50', value: '#ecfdf5', contrast: 1.0, usage: ['nature backgrounds'] },
        { name: '100', value: '#d1fae5', contrast: 1.1, usage: ['eco highlights'] },
        { name: '200', value: '#a7f3d0', contrast: 1.4, usage: ['sustainable hover'] },
        { name: '300', value: '#6ee7b7', contrast: 2.1, usage: ['green elements'] },
        { name: '400', value: '#34d399', contrast: 3.2, usage: ['nature active'] },
        { name: '500', value: '#10b981', contrast: 4.8, usage: ['eco primary'] },
        { name: '600', value: '#059669', contrast: 6.4, usage: ['nature buttons'] },
        { name: '700', value: '#047857', contrast: 8.2, usage: ['forest headers'] },
        { name: '800', value: '#065f46', contrast: 10.9, usage: ['deep green'] },
        { name: '900', value: '#064e3b', contrast: 14.1, usage: ['maximum nature'] },
      ],
      secondary: [
        { name: '50', value: '#f9fafb', contrast: 1.0, usage: ['neutral backgrounds'] },
        { name: '100', value: '#f3f4f6', contrast: 1.1, usage: ['card backgrounds'] },
        { name: '200', value: '#e5e7eb', contrast: 1.3, usage: ['borders'] },
        { name: '300', value: '#d1d5db', contrast: 1.7, usage: ['dividers'] },
        { name: '400', value: '#9ca3af', contrast: 2.8, usage: ['placeholder'] },
        { name: '500', value: '#6b7280', contrast: 4.0, usage: ['secondary text'] },
        { name: '600', value: '#4b5563', contrast: 5.9, usage: ['body text'] },
        { name: '700', value: '#374151', contrast: 8.3, usage: ['headings'] },
        { name: '800', value: '#1f2937', contrast: 12.8, usage: ['dark text'] },
        { name: '900', value: '#111827', contrast: 18.7, usage: ['maximum contrast'] },
      ],
      accent: [
        { name: '50', value: '#fffbeb', contrast: 1.0, usage: ['warm backgrounds'] },
        { name: '100', value: '#fef3c7', contrast: 1.2, usage: ['earth highlights'] },
        { name: '200', value: '#fde68a', contrast: 1.6, usage: ['warm hover'] },
        { name: '300', value: '#fcd34d', contrast: 2.1, usage: ['earth elements'] },
        { name: '400', value: '#fbbf24', contrast: 2.8, usage: ['warm active'] },
        { name: '500', value: '#f59e0b', contrast: 3.6, usage: ['earth primary'] },
        { name: '600', value: '#d97706', contrast: 4.8, usage: ['earth buttons'] },
        { name: '700', value: '#b45309', contrast: 6.4, usage: ['warm headers'] },
        { name: '800', value: '#92400e', contrast: 8.7, usage: ['deep earth'] },
        { name: '900', value: '#78350f', contrast: 11.9, usage: ['maximum earth'] },
      ],
    },
    accessibility: {
      wcagAA: true,
      wcagAAA: true,
      contrastRatio: 6.4,
      recommendations: [
        'Excellent for eco-friendly brands',
        'Calming and natural',
        'High sustainability appeal',
      ],
    },
  },
];

// Creative Color Palettes
const creativePalettes: ColorPalette[] = [
  {
    id: 'creative-vibrant',
    name: 'Creative Vibrant',
    category: 'creative',
    description: 'Bold and energetic palette for creative agencies and startups',
    primary: '#7c3aed',
    secondary: '#ec4899',
    accent: '#f59e0b',
    background: '#fafafa',
    surface: '#ffffff',
    text: '#1f2937',
    textSecondary: '#6b7280',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#06b6d4',
    shades: {
      primary: [
        { name: '50', value: '#faf5ff', contrast: 1.0, usage: ['creative backgrounds'] },
        { name: '100', value: '#f3e8ff', contrast: 1.1, usage: ['purple highlights'] },
        { name: '200', value: '#e9d5ff', contrast: 1.4, usage: ['creative hover'] },
        { name: '300', value: '#d8b4fe', contrast: 2.2, usage: ['purple elements'] },
        { name: '400', value: '#c084fc', contrast: 3.4, usage: ['creative active'] },
        { name: '500', value: '#a855f7', contrast: 4.9, usage: ['creative primary'] },
        { name: '600', value: '#9333ea', contrast: 6.3, usage: ['purple buttons'] },
        { name: '700', value: '#7c3aed', contrast: 8.1, usage: ['creative headers'] },
        { name: '800', value: '#6b21d0', contrast: 10.8, usage: ['deep purple'] },
        { name: '900', value: '#581c87', contrast: 14.9, usage: ['maximum creative'] },
      ],
      secondary: [
        { name: '50', value: '#fdf2f8', contrast: 1.0, usage: ['pink backgrounds'] },
        { name: '100', value: '#fce7f3', contrast: 1.1, usage: ['pink highlights'] },
        { name: '200', value: '#fbcfe8', contrast: 1.4, usage: ['pink hover'] },
        { name: '300', value: '#f9a8d4', contrast: 2.1, usage: ['pink elements'] },
        { name: '400', value: '#f472b6', contrast: 3.2, usage: ['pink active'] },
        { name: '500', value: '#ec4899', contrast: 4.6, usage: ['pink primary'] },
        { name: '600', value: '#db2777', contrast: 6.2, usage: ['pink buttons'] },
        { name: '700', value: '#be185d', contrast: 8.4, usage: ['pink headers'] },
        { name: '800', value: '#9d174d', contrast: 11.2, usage: ['deep pink'] },
        { name: '900', value: '#831843', contrast: 15.1, usage: ['maximum pink'] },
      ],
      accent: [
        { name: '50', value: '#fffbeb', contrast: 1.0, usage: ['yellow backgrounds'] },
        { name: '100', value: '#fef3c7', contrast: 1.2, usage: ['yellow highlights'] },
        { name: '200', value: '#fde68a', contrast: 1.6, usage: ['yellow hover'] },
        { name: '300', value: '#fcd34d', contrast: 2.1, usage: ['yellow elements'] },
        { name: '400', value: '#fbbf24', contrast: 2.8, usage: ['yellow active'] },
        { name: '500', value: '#f59e0b', contrast: 3.6, usage: ['yellow primary'] },
        { name: '600', value: '#d97706', contrast: 4.8, usage: ['yellow buttons'] },
        { name: '700', value: '#b45309', contrast: 6.4, usage: ['yellow headers'] },
        { name: '800', value: '#92400e', contrast: 8.7, usage: ['deep yellow'] },
        { name: '900', value: '#78350f', contrast: 11.9, usage: ['maximum yellow'] },
      ],
    },
    accessibility: {
      wcagAA: true,
      wcagAAA: false,
      contrastRatio: 4.9,
      recommendations: [
        'Great for creative brands',
        'High energy and vibrancy',
        'Use carefully for text',
      ],
    },
  },
];

// Monochrome Color Palettes
const monochromePalettes: ColorPalette[] = [
  {
    id: 'monochrome-classic',
    name: 'Classic Monochrome',
    category: 'monochrome',
    description: 'Timeless black and white palette for elegant and minimalist designs',
    primary: '#000000',
    secondary: '#6b7280',
    accent: '#3b82f6',
    background: '#ffffff',
    surface: '#f9fafb',
    text: '#111827',
    textSecondary: '#6b7280',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#06b6d4',
    shades: {
      primary: [
        { name: '50', value: '#f9fafb', contrast: 1.0, usage: ['lightest backgrounds'] },
        { name: '100', value: '#f3f4f6', contrast: 1.1, usage: ['light backgrounds'] },
        { name: '200', value: '#e5e7eb', contrast: 1.3, usage: ['borders'] },
        { name: '300', value: '#d1d5db', contrast: 1.7, usage: ['dividers'] },
        { name: '400', value: '#9ca3af', contrast: 2.8, usage: ['placeholder'] },
        { name: '500', value: '#6b7280', contrast: 4.0, usage: ['secondary text'] },
        { name: '600', value: '#4b5563', contrast: 5.9, usage: ['body text'] },
        { name: '700', value: '#374151', contrast: 8.3, usage: ['headings'] },
        { name: '800', value: '#1f2937', contrast: 12.8, usage: ['dark text'] },
        { name: '900', value: '#111827', contrast: 18.7, usage: ['maximum contrast'] },
      ],
      secondary: [
        { name: '50', value: '#f8fafc', contrast: 1.0, usage: ['alternative backgrounds'] },
        { name: '100', value: '#f1f5f9', contrast: 1.1, usage: ['alternative highlights'] },
        { name: '200', value: '#e2e8f0', contrast: 1.3, usage: ['alternative borders'] },
        { name: '300', value: '#cbd5e1', contrast: 1.8, usage: ['alternative dividers'] },
        { name: '400', value: '#94a3b8', contrast: 2.9, usage: ['alternative placeholder'] },
        { name: '500', value: '#64748b', contrast: 4.1, usage: ['alternative secondary'] },
        { name: '600', value: '#475569', contrast: 5.8, usage: ['alternative body'] },
        { name: '700', value: '#334155', contrast: 8.1, usage: ['alternative headings'] },
        { name: '800', value: '#1e293b', contrast: 12.1, usage: ['alternative dark'] },
        { name: '900', value: '#0f172a', contrast: 17.8, usage: ['alternative maximum'] },
      ],
      accent: [
        { name: '50', value: '#eff6ff', contrast: 1.0, usage: ['accent backgrounds'] },
        { name: '100', value: '#dbeafe', contrast: 1.2, usage: ['accent highlights'] },
        { name: '200', value: '#bfdbfe', contrast: 1.6, usage: ['accent hover'] },
        { name: '300', value: '#93c5fd', contrast: 2.4, usage: ['accent elements'] },
        { name: '400', value: '#60a5fa', contrast: 3.5, usage: ['accent active'] },
        { name: '500', value: '#3b82f6', contrast: 4.8, usage: ['accent primary'] },
        { name: '600', value: '#2563eb', contrast: 6.1, usage: ['accent buttons'] },
        { name: '700', value: '#1d4ed8', contrast: 7.9, usage: ['accent headers'] },
        { name: '800', value: '#1e40af', contrast: 10.2, usage: ['accent dark'] },
        { name: '900', value: '#1e3a8a', contrast: 13.1, usage: ['accent maximum'] },
      ],
    },
    accessibility: {
      wcagAA: true,
      wcagAAA: true,
      contrastRatio: 8.3,
      recommendations: [
        'Perfect for minimalist designs',
        'Maximum readability',
        'Timeless and elegant',
      ],
    },
  },
];

// Export all palettes
export const colorPalettes: ColorPalette[] = [
  ...materialPalettes,
  ...tailwindPalettes,
  ...brandPalettes,
  ...naturePalettes,
  ...creativePalettes,
  ...monochromePalettes,
];

// Export by category
export const colorPalettesByCategory = {
  material: materialPalettes,
  tailwind: tailwindPalettes,
  brand: brandPalettes,
  nature: naturePalettes,
  creative: creativePalettes,
  monochrome: monochromePalettes,
};

// Export categories
export const colorPaletteCategories: ColorPaletteCategory[] = [
  'material',
  'tailwind',
  'brand',
  'nature',
  'corporate',
  'creative',
  'monochrome',
];

// Helper functions
export const getPalettesByCategory = (category: ColorPaletteCategory): ColorPalette[] =>
  colorPalettes.filter((palette) => palette.category === category);

export const getPaletteById = (id: string): ColorPalette | undefined =>
  colorPalettes.find((palette) => palette.id === id);

export const getAccessiblePalettes = (): ColorPalette[] =>
  colorPalettes.filter((palette) => palette.accessibility.wcagAA);

export const getFeaturedPalettes = (limit = 6): ColorPalette[] => {
  const featured = [
    'material-blue',
    'tailwind-slate',
    'brand-professional',
    'nature-forest',
    'creative-vibrant',
    'monochrome-classic',
  ];

  return featured
    .map((id) => getPaletteById(id))
    .filter(Boolean)
    .slice(0, limit) as ColorPalette[];
};

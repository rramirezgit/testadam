import type { DesignState, PreviewMode, LayoutSettings, TypographySettings } from '../types';

// ============================================================================
// DEFAULT CONFIGURATIONS - Newsletter Design System
// ============================================================================

// Default Typography Settings
export const defaultTypography: TypographySettings = {
  fontFamily: {
    primary: {
      name: 'Inter',
      fallbacks: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      source: 'google',
      weights: [300, 400, 500, 600, 700],
      styles: ['normal', 'italic'],
    },
    secondary: {
      name: 'Georgia',
      fallbacks: ['Times New Roman', 'serif'],
      source: 'system',
      weights: [400, 700],
      styles: ['normal', 'italic'],
    },
    monospace: {
      name: 'SF Mono',
      fallbacks: ['Monaco', 'Inconsolata', 'Roboto Mono', 'monospace'],
      source: 'system',
      weights: [400, 500, 600],
      styles: ['normal'],
    },
  },
  customFonts: [],
  typeScale: {
    ratio: 1.25, // Major Third
    baseSize: 16,
    sizes: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
      '5xl': 48,
      '6xl': 60,
    },
  },
  textStyles: {
    h1: {
      fontSize: 48,
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: -0.025,
    },
    h2: {
      fontSize: 36,
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: -0.02,
    },
    h3: {
      fontSize: 30,
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: -0.01,
    },
    h4: {
      fontSize: 24,
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: 0,
    },
    h5: {
      fontSize: 20,
      fontWeight: 600,
      lineHeight: 1.5,
      letterSpacing: 0,
    },
    h6: {
      fontSize: 18,
      fontWeight: 600,
      lineHeight: 1.5,
      letterSpacing: 0,
    },
    body: {
      fontSize: 16,
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: 0,
    },
    bodyLarge: {
      fontSize: 18,
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: 0,
    },
    bodySmall: {
      fontSize: 14,
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: 0,
    },
    caption: {
      fontSize: 12,
      fontWeight: 400,
      lineHeight: 1.4,
      letterSpacing: 0.025,
      textTransform: 'uppercase',
    },
    overline: {
      fontSize: 10,
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: 0.1,
      textTransform: 'uppercase',
    },
    button: {
      fontSize: 14,
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: 0.025,
    },
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.6,
    loose: 1.8,
  },
  letterSpacing: {
    tight: -0.025,
    normal: 0,
    wide: 0.025,
    wider: 0.05,
    widest: 0.1,
  },
};

// Default Layout Settings
export const defaultLayout: LayoutSettings = {
  spacing: {
    unit: 4, // 4px base unit
    scale: {
      xs: 4, // 4px
      sm: 8, // 8px
      md: 16, // 16px
      lg: 24, // 24px
      xl: 32, // 32px
      '2xl': 48, // 48px
      '3xl': 64, // 64px
      '4xl': 96, // 96px
    },
  },
  grid: {
    columns: 12,
    gutter: 24,
    maxWidth: '1200px',
    containerPadding: 24,
  },
  breakpoints: {
    xs: 320,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  },
  container: {
    maxWidth: '1200px',
    padding: 24,
    center: true,
  },
};

// Default Preview Mode
export const defaultPreviewMode: PreviewMode = {
  device: 'desktop',
  orientation: 'portrait',
  theme: 'light',
  emailClient: 'generic',
};

// Default Design State
export const defaultDesignState: DesignState = {
  // Template System
  headerTemplate: null,
  footerTemplate: null,
  componentTemplates: [],

  // Color System
  colorPalette: null, // Will be set to featured palette
  customColors: {},

  // Typography
  typography: defaultTypography,

  // Layout
  layout: defaultLayout,

  // Preview
  previewMode: defaultPreviewMode,
  realTimePreview: true,

  // History
  history: [],
  historyIndex: -1,
};

// Google Fonts Integration - Popular Newsletter Fonts
export const googleFonts = {
  serif: [
    {
      name: 'Playfair Display',
      fallbacks: ['Georgia', 'serif'],
      weights: [400, 500, 600, 700, 800, 900],
      styles: ['normal', 'italic'],
      category: 'Elegant Headlines',
    },
    {
      name: 'Crimson Text',
      fallbacks: ['Georgia', 'serif'],
      weights: [400, 600, 700],
      styles: ['normal', 'italic'],
      category: 'Reading Content',
    },
    {
      name: 'Lora',
      fallbacks: ['Georgia', 'serif'],
      weights: [400, 500, 600, 700],
      styles: ['normal', 'italic'],
      category: 'Body Text',
    },
    {
      name: 'Merriweather',
      fallbacks: ['Georgia', 'serif'],
      weights: [300, 400, 700, 900],
      styles: ['normal', 'italic'],
      category: 'Long Form Reading',
    },
  ],
  sansSerif: [
    {
      name: 'Inter',
      fallbacks: ['-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
      styles: ['normal', 'italic'],
      category: 'Modern Interface',
    },
    {
      name: 'Poppins',
      fallbacks: ['-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
      styles: ['normal', 'italic'],
      category: 'Friendly & Modern',
    },
    {
      name: 'Roboto',
      fallbacks: ['-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      weights: [100, 300, 400, 500, 700, 900],
      styles: ['normal', 'italic'],
      category: 'Clean & Versatile',
    },
    {
      name: 'Open Sans',
      fallbacks: ['-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      weights: [300, 400, 500, 600, 700, 800],
      styles: ['normal', 'italic'],
      category: 'Highly Readable',
    },
    {
      name: 'Montserrat',
      fallbacks: ['-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
      styles: ['normal', 'italic'],
      category: 'Geometric & Strong',
    },
    {
      name: 'Source Sans Pro',
      fallbacks: ['-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      weights: [200, 300, 400, 600, 700, 900],
      styles: ['normal', 'italic'],
      category: 'Professional',
    },
  ],
  display: [
    {
      name: 'Oswald',
      fallbacks: ['Impact', 'sans-serif'],
      weights: [200, 300, 400, 500, 600, 700],
      styles: ['normal'],
      category: 'Bold Headlines',
    },
    {
      name: 'Raleway',
      fallbacks: ['-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
      styles: ['normal', 'italic'],
      category: 'Elegant Display',
    },
    {
      name: 'Quicksand',
      fallbacks: ['-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      weights: [300, 400, 500, 600, 700],
      styles: ['normal'],
      category: 'Friendly Display',
    },
  ],
  monospace: [
    {
      name: 'JetBrains Mono',
      fallbacks: ['Monaco', 'Consolas', 'monospace'],
      weights: [100, 200, 300, 400, 500, 600, 700, 800],
      styles: ['normal', 'italic'],
      category: 'Code & Technical',
    },
    {
      name: 'Fira Code',
      fallbacks: ['Monaco', 'Consolas', 'monospace'],
      weights: [300, 400, 500, 600, 700],
      styles: ['normal'],
      category: 'Programming',
    },
  ],
};

// Email Client Specific Considerations
export const emailClientSettings = {
  gmail: {
    maxWidth: 600,
    supportedFonts: ['Arial', 'Helvetica', 'Georgia', 'Times New Roman', 'Verdana'],
    supportsWebFonts: true,
    supportsMediaQueries: true,
    notes: 'Excellent support for modern CSS and web fonts',
  },
  outlook: {
    maxWidth: 660,
    supportedFonts: ['Arial', 'Helvetica', 'Georgia', 'Times New Roman', 'Verdana', 'Calibri'],
    supportsWebFonts: false,
    supportsMediaQueries: false,
    notes: 'Use fallback fonts, table-based layouts recommended',
  },
  'apple-mail': {
    maxWidth: 600,
    supportedFonts: ['Arial', 'Helvetica', 'Georgia', 'Times New Roman', 'Verdana'],
    supportsWebFonts: true,
    supportsMediaQueries: true,
    notes: 'Good support for modern features on iOS/macOS',
  },
  yahoo: {
    maxWidth: 600,
    supportedFonts: ['Arial', 'Helvetica', 'Georgia', 'Times New Roman', 'Verdana'],
    supportsWebFonts: true,
    supportsMediaQueries: true,
    notes: 'Similar to Gmail in capabilities',
  },
  thunderbird: {
    maxWidth: 600,
    supportedFonts: ['Arial', 'Helvetica', 'Georgia', 'Times New Roman', 'Verdana'],
    supportsWebFonts: true,
    supportsMediaQueries: true,
    notes: 'Good modern email client support',
  },
  generic: {
    maxWidth: 600,
    supportedFonts: ['Arial', 'Helvetica', 'Georgia', 'Times New Roman'],
    supportsWebFonts: false,
    supportsMediaQueries: false,
    notes: 'Conservative settings for maximum compatibility',
  },
};

// Responsive Email Breakpoints
export const emailBreakpoints = {
  mobile: {
    maxWidth: 480,
    fontSize: {
      h1: 32,
      h2: 28,
      h3: 24,
      h4: 20,
      h5: 18,
      h6: 16,
      body: 16,
    },
    spacing: {
      padding: 16,
      margin: 16,
    },
  },
  tablet: {
    maxWidth: 768,
    fontSize: {
      h1: 40,
      h2: 32,
      h3: 28,
      h4: 22,
      h5: 20,
      h6: 18,
      body: 16,
    },
    spacing: {
      padding: 20,
      margin: 20,
    },
  },
  desktop: {
    maxWidth: 600,
    fontSize: {
      h1: 48,
      h2: 36,
      h3: 30,
      h4: 24,
      h5: 20,
      h6: 18,
      body: 16,
    },
    spacing: {
      padding: 24,
      margin: 24,
    },
  },
};

// Accessibility Guidelines
export const accessibilityDefaults = {
  minimumContrastRatio: {
    normal: 4.5, // WCAG AA
    large: 3.0, // WCAG AA for large text
    enhanced: 7.0, // WCAG AAA
  },
  fontSize: {
    minimum: 14,
    recommended: 16,
    large: 18,
  },
  lineHeight: {
    minimum: 1.3,
    recommended: 1.5,
    spacious: 1.6,
  },
  colors: {
    errorMinimumContrast: 3.0,
    linkMinimumContrast: 3.0,
    focusIndicatorMinimumContrast: 3.0,
  },
};

// Performance Optimization Defaults
export const performanceDefaults = {
  imageOptimization: {
    maxWidth: 600,
    quality: 85,
    format: 'webp',
    fallback: 'jpg',
  },
  fontLoading: {
    strategy: 'swap',
    preload: ['Inter:400,600', 'Playfair Display:700'],
    maxFonts: 3,
  },
  cssOptimization: {
    minify: true,
    inline: true,
    maxFileSize: '50kb',
  },
};

// Export helper functions
export const getDefaultDesignState = (): DesignState => ({
  ...defaultDesignState,
  // Set featured color palette as default
  colorPalette: null, // Will be set by hook
});

export const getTypographyForDevice = (device: 'mobile' | 'tablet' | 'desktop') => {
  const baseTypography = defaultTypography;
  const deviceSettings = emailBreakpoints[device];

  return {
    ...baseTypography,
    textStyles: {
      ...baseTypography.textStyles,
      h1: { ...baseTypography.textStyles.h1, fontSize: deviceSettings.fontSize.h1 },
      h2: { ...baseTypography.textStyles.h2, fontSize: deviceSettings.fontSize.h2 },
      h3: { ...baseTypography.textStyles.h3, fontSize: deviceSettings.fontSize.h3 },
      h4: { ...baseTypography.textStyles.h4, fontSize: deviceSettings.fontSize.h4 },
      h5: { ...baseTypography.textStyles.h5, fontSize: deviceSettings.fontSize.h5 },
      h6: { ...baseTypography.textStyles.h6, fontSize: deviceSettings.fontSize.h6 },
      body: { ...baseTypography.textStyles.body, fontSize: deviceSettings.fontSize.body },
    },
  };
};

export const getLayoutForDevice = (device: 'mobile' | 'tablet' | 'desktop') => {
  const baseLayout = defaultLayout;
  const deviceSettings = emailBreakpoints[device];

  return {
    ...baseLayout,
    container: {
      ...baseLayout.container,
      maxWidth: `${deviceSettings.maxWidth}px`,
      padding: deviceSettings.spacing.padding,
    },
  };
};

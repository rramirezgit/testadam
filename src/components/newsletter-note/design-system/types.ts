import type { NewsletterHeader, NewsletterFooter } from '../../../types/newsletter';

// ============================================================================
// DESIGN SYSTEM TYPES - Newsletter Editor
// ============================================================================

// Base Design State
export interface DesignState {
  // Template System
  headerTemplate: HeaderTemplate | null;
  footerTemplate: FooterTemplate | null;
  componentTemplates: ComponentTemplate[];

  // Color System
  colorPalette: ColorPalette | null;
  customColors: CustomColorSet;

  // Typography
  typography: TypographySettings;

  // Layout
  layout: LayoutSettings;

  // Preview
  previewMode: PreviewMode;
  realTimePreview: boolean;

  // History
  history: DesignHistoryEntry[];
  historyIndex: number;
}

// Template System
export interface HeaderTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  preview: string;
  description: string;
  tags: string[];
  isPremium?: boolean;
  template: NewsletterHeader & {
    // Extended properties for advanced templates
    showGradient?: boolean;
    gradientColors?: string[];
    gradientDirection?: number;
    useCustomFont?: boolean;
    customFontUrl?: string;
    backgroundPattern?: BackgroundPattern;
    animation?: AnimationConfig;
  };
}

export interface FooterTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  preview: string;
  description: string;
  tags: string[];
  isPremium?: boolean;
  template: NewsletterFooter & {
    // Extended properties
    showGradient?: boolean;
    gradientColors?: string[];
    gradientDirection?: number;
    socialIconStyle?: SocialIconStyle;
    layoutType?: FooterLayoutType;
    showBorder?: boolean;
    borderColor?: string;
  };
}

export interface ComponentTemplate {
  id: string;
  name: string;
  type: ComponentType;
  category: TemplateCategory;
  preview: string;
  description: string;
  config: Record<string, any>;
}

export type TemplateCategory =
  | 'corporate'
  | 'creative'
  | 'minimal'
  | 'modern'
  | 'classic'
  | 'colorful'
  | 'dark'
  | 'gradient';

export type ComponentType =
  | 'button'
  | 'divider'
  | 'image'
  | 'text'
  | 'gallery'
  | 'social-links'
  | 'callout'
  | 'quote';

// Color System
export interface ColorPalette {
  id: string;
  name: string;
  category: ColorPaletteCategory;
  description: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  // Extended color variations
  shades: {
    primary: ColorShade[];
    secondary: ColorShade[];
    accent: ColorShade[];
  };
  // Accessibility data
  accessibility: ColorAccessibility;
}

export interface ColorShade {
  name: string;
  value: string;
  contrast: number;
  usage: string[];
}

export interface ColorAccessibility {
  wcagAA: boolean;
  wcagAAA: boolean;
  contrastRatio: number;
  recommendations: string[];
}

export type ColorPaletteCategory =
  | 'material'
  | 'tailwind'
  | 'brand'
  | 'nature'
  | 'corporate'
  | 'creative'
  | 'monochrome';

export interface CustomColorSet {
  [key: string]: string;
}

export interface ColorHarmony {
  type: ColorHarmonyType;
  baseColor: string;
  colors: string[];
  description: string;
}

export type ColorHarmonyType =
  | 'complementary'
  | 'triadic'
  | 'analogous'
  | 'tetradic'
  | 'split-complementary'
  | 'monochromatic';

// Typography System
export interface TypographySettings {
  fontFamily: FontStack;
  customFonts: CustomFont[];
  typeScale: TypeScale;
  textStyles: TextStyleSet;
  lineHeight: LineHeightConfig;
  letterSpacing: LetterSpacingConfig;
}

export interface FontStack {
  primary: FontDefinition;
  secondary: FontDefinition;
  monospace: FontDefinition;
}

export interface FontDefinition {
  name: string;
  fallbacks: string[];
  source: FontSource;
  weights: FontWeight[];
  styles: FontStyle[];
}

export interface CustomFont {
  name: string;
  url: string;
  weights: FontWeight[];
  styles: FontStyle[];
}

export type FontSource = 'system' | 'google' | 'custom' | 'web-safe';
export type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
export type FontStyle = 'normal' | 'italic' | 'oblique';

export interface TypeScale {
  ratio: number;
  baseSize: number;
  sizes: {
    xs: number;
    sm: number;
    base: number;
    lg: number;
    xl: number;
    '2xl': number;
    '3xl': number;
    '4xl': number;
    '5xl': number;
    '6xl': number;
  };
}

export interface TextStyleSet {
  h1: TextStyle;
  h2: TextStyle;
  h3: TextStyle;
  h4: TextStyle;
  h5: TextStyle;
  h6: TextStyle;
  body: TextStyle;
  bodyLarge: TextStyle;
  bodySmall: TextStyle;
  caption: TextStyle;
  overline: TextStyle;
  button: TextStyle;
}

export interface TextStyle {
  fontSize: number;
  fontWeight: FontWeight;
  lineHeight: number;
  letterSpacing: number;
  textTransform?: TextTransform;
  color?: string;
}

export type TextTransform = 'none' | 'uppercase' | 'lowercase' | 'capitalize';

export interface LineHeightConfig {
  tight: number;
  normal: number;
  relaxed: number;
  loose: number;
}

export interface LetterSpacingConfig {
  tight: number;
  normal: number;
  wide: number;
  wider: number;
  widest: number;
}

// Layout System
export interface LayoutSettings {
  spacing: SpacingScale;
  grid: GridSettings;
  breakpoints: BreakpointSettings;
  container: ContainerSettings;
}

export interface SpacingScale {
  unit: number; // Base unit (usually 4px)
  scale: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    '2xl': number;
    '3xl': number;
    '4xl': number;
  };
}

export interface GridSettings {
  columns: number;
  gutter: number;
  maxWidth: string;
  containerPadding: number;
}

export interface BreakpointSettings {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
}

export interface ContainerSettings {
  maxWidth: string;
  padding: number;
  center: boolean;
}

// Background & Visual Effects
export interface BackgroundPattern {
  type: BackgroundPatternType;
  color: string;
  opacity: number;
  size: number;
  spacing?: number;
}

export type BackgroundPatternType =
  | 'dots'
  | 'lines'
  | 'grid'
  | 'diagonal'
  | 'waves'
  | 'noise'
  | 'texture';

export interface AnimationConfig {
  type: AnimationType;
  duration: number;
  easing: AnimationEasing;
  delay?: number;
  repeat?: number;
}

export type AnimationType = 'fade-in' | 'slide-in' | 'scale-in' | 'bounce' | 'pulse' | 'shake';

export type AnimationEasing =
  | 'ease'
  | 'ease-in'
  | 'ease-out'
  | 'ease-in-out'
  | 'linear'
  | 'bounce'
  | 'elastic';

// Social Icons
export type SocialIconStyle = 'filled' | 'outlined' | 'minimal' | 'rounded' | 'square' | 'circle';

export type FooterLayoutType =
  | 'single-column'
  | 'two-column'
  | 'three-column'
  | 'centered'
  | 'left-aligned'
  | 'right-aligned';

// Preview System
export interface PreviewMode {
  device: DeviceType;
  orientation: DeviceOrientation;
  theme: PreviewTheme;
  emailClient?: EmailClient;
}

export type DeviceType = 'desktop' | 'tablet' | 'mobile' | 'email';
export type DeviceOrientation = 'portrait' | 'landscape';
export type PreviewTheme = 'light' | 'dark' | 'auto';
export type EmailClient = 'gmail' | 'outlook' | 'apple-mail' | 'yahoo' | 'thunderbird' | 'generic';

// History & Undo/Redo
export interface DesignHistoryEntry {
  id: string;
  timestamp: number;
  description: string;
  state: Partial<DesignState>;
}

// Component Props Types
export interface DesignPanelProps {
  designState: DesignState;
  onUpdateDesign: (updates: Partial<DesignState>) => void;
  onPreview: () => void;
  onReset: () => void;
  className?: string;
}

export interface TemplateSelectorProps {
  type: 'header' | 'footer' | 'component';
  category?: TemplateCategory;
  selectedTemplate?: HeaderTemplate | FooterTemplate | ComponentTemplate;
  onSelectTemplate: (template: HeaderTemplate | FooterTemplate | ComponentTemplate) => void;
  onPreviewTemplate?: (template: HeaderTemplate | FooterTemplate | ComponentTemplate) => void;
  showPreview?: boolean;
  className?: string;
}

export interface ColorSystemProps {
  colorPalette: ColorPalette | null;
  customColors: CustomColorSet;
  onUpdateColors: (updates: { palette?: ColorPalette; custom?: CustomColorSet }) => void;
  onGenerateHarmony?: (baseColor: string, type: ColorHarmonyType) => void;
  showAdvanced?: boolean;
  className?: string;
}

export interface PreviewSystemProps {
  content: any;
  designState: DesignState;
  mode: PreviewMode;
  onModeChange: (mode: PreviewMode) => void;
  realTime?: boolean;
  className?: string;
}

// Hook Return Types
export interface UseDesignStateReturn {
  // Estado principal
  designState: DesignState;

  // Funciones de actualización
  updateDesign: (updates: Partial<DesignState>) => void;
  resetDesign: () => void;

  // Historia (undo/redo)
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  saveSnapshot: (description: string) => void;

  // Aplicar templates específicos
  applyHeaderTemplate: (template: HeaderTemplate) => void;
  applyFooterTemplate: (template: FooterTemplate) => void;
  applyColorPalette: (palette: ColorPalette) => void;
  updateCustomColors: (customColors: Partial<CustomColorSet>) => void;

  // Estado de cambios
  hasUnsavedChanges: boolean;
}

export interface UseTemplateManagerReturn {
  // Templates por tipo
  headerTemplates: HeaderTemplate[];
  footerTemplates: FooterTemplate[];
  componentTemplates: ComponentTemplate[];

  // Categorías disponibles
  categories: TemplateCategory[];

  // Funciones de filtrado
  getFilteredTemplates: (
    type?: 'header' | 'footer' | 'component'
  ) => (HeaderTemplate | FooterTemplate | ComponentTemplate)[];
  getHeaderTemplates: () => HeaderTemplate[];
  getFooterTemplates: () => FooterTemplate[];
  getComponentTemplates: () => ComponentTemplate[];
  getTemplatesByCategory: (
    category: TemplateCategory,
    type?: 'header' | 'footer' | 'component'
  ) => (HeaderTemplate | FooterTemplate | ComponentTemplate)[];

  // Funciones de búsqueda
  searchTemplates: (
    query: string,
    type?: 'header' | 'footer' | 'component'
  ) => (HeaderTemplate | FooterTemplate | ComponentTemplate)[];

  // Estado de filtros
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: TemplateCategory | 'all';
  setSelectedCategory: (category: TemplateCategory | 'all') => void;

  // Templates destacados
  getFeaturedHeaderTemplates: (limit?: number) => HeaderTemplate[];
  getFeaturedFooterTemplates: (limit?: number) => FooterTemplate[];

  // Gestión de templates personalizados
  createCustomTemplate: (
    template: Partial<HeaderTemplate | FooterTemplate | ComponentTemplate>,
    type: 'header' | 'footer' | 'component'
  ) => HeaderTemplate | FooterTemplate | ComponentTemplate;
  deleteCustomTemplate: (id: string, type: 'header' | 'footer' | 'component') => void;
  duplicateTemplate: (
    template: HeaderTemplate | FooterTemplate | ComponentTemplate,
    type: 'header' | 'footer' | 'component'
  ) => HeaderTemplate | FooterTemplate | ComponentTemplate;

  // Import/Export
  exportCustomTemplates: () => string;
  importCustomTemplates: (jsonData: string) => boolean;

  // Estadísticas
  templateStats: {
    total: number;
    headers: number;
    footers: number;
    components: number;
    custom: number;
    byCategory: Record<TemplateCategory, number>;
  };

  // Templates personalizados
  customTemplates: {
    headers: HeaderTemplate[];
    footers: FooterTemplate[];
    components: ComponentTemplate[];
  };
}

export interface UseColorPaletteReturn {
  // Paletas disponibles
  colorPalettes: ColorPalette[];
  categories: ColorPaletteCategory[];

  // Paleta seleccionada
  selectedPalette: ColorPalette | null;
  setPalette: (palette: ColorPalette) => void;

  // Colores personalizados
  customColors: CustomColorSet;
  updateCustomColor: (key: string, color: string) => void;
  removeCustomColor: (key: string) => void;
  clearCustomColors: () => void;

  // Filtros
  selectedCategory: ColorPaletteCategory | 'all';
  setSelectedCategory: (category: ColorPaletteCategory | 'all') => void;

  // Paletas especiales
  accessiblePalettes: ColorPalette[];
  featuredPalettes: ColorPalette[];

  // Funciones de utilidad
  generateHarmony: (baseColor: string, type: ColorHarmonyType) => ColorHarmony;
  checkAccessibility: (color1: string, color2: string) => ColorAccessibility;

  // Import/Export
  exportPalette: (format: 'json' | 'css' | 'figma') => string;
  importPalette: (data: string, format: 'json' | 'css' | 'figma') => ColorPalette | null;

  // Estadísticas
  paletteStats: {
    total: number;
    accessible: number;
    byCategory: Record<ColorPaletteCategory, number>;
    customColorsCount: number;
  };

  // Funciones de conveniencia
  getPaletteById: (id: string) => ColorPalette | undefined;
  getPalettesByCategory: (category: ColorPaletteCategory) => ColorPalette[];
}

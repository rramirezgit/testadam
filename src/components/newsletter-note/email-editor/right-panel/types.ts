import type React from 'react';
import type { PostStatus } from 'src/types/post';
import type { EmailComponent } from 'src/types/saved-note';
import type { BannerOption } from 'src/components/newsletter-note/banner-selector';

import type { NoteConfigurationViewHandle } from './views/NoteConfigurationView';

export interface UpdateComponentPropsOptions {
  content?: string;
}

export type UpdateComponentPropsFn = (
  id: string,
  props: Record<string, any>,
  options?: UpdateComponentPropsOptions
) => void;

export interface RightPanelProps {
  selectedComponentId: string | null;
  setSelectedComponentId: (id: string | null) => void;
  rightPanelTab: number;
  setRightPanelTab: (tab: number) => void;
  getActiveComponents: () => EmailComponent[];
  updateComponentProps: UpdateComponentPropsFn;
  updateComponentStyle: (id: string, style: React.CSSProperties) => void;
  updateComponentContent: (id: string, content: string) => void;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  selectedFont: string;
  setSelectedFont: (font: string) => void;
  selectedFontSize: string;
  setSelectedFontSize: (size: string) => void;
  selectedFontWeight: string;
  setSelectedFontWeight: (weight: string) => void;
  selectedAlignment: string;
  textFormat: string[];
  applyTextFormat: (format: string) => void;
  applyTextAlignment: (
    alignment: string,
    selectedComponentId?: string | null,
    updateComponentStyle?: (id: string, style: React.CSSProperties) => void
  ) => void;
  applyTextColor: (
    color: string,
    selectedComponentId?: string | null,
    updateComponentStyle?: (id: string, style: React.CSSProperties) => void
  ) => void;
  applyFontSize: (
    size: string,
    selectedComponentId: string | null,
    updateComponentStyle: (id: string, style: React.CSSProperties) => void
  ) => void;
  applyFontFamily: (
    font: string,
    selectedComponentId: string | null,
    updateComponentStyle: (id: string, style: React.CSSProperties) => void
  ) => void;
  emailBackground: string;
  setEmailBackground: (color: string) => void;
  selectedBanner: string | null;
  setSelectedBanner: (banner: string | null) => void;
  showGradient: boolean;
  setShowGradient: (show: boolean) => void;
  gradientColors: string[];
  setGradientColors: (colors: string[]) => void;
  bannerOptions: BannerOption[];
  setSelectedAlignment: (alignment: string) => void;
  hasTextSelection: boolean;
  convertTextToList: (componentId: string | null, listType: 'ordered' | 'unordered') => void;
  setShowIconPicker: (show: boolean) => void;
  isContainerSelected: boolean;
  setIsContainerSelected: (selected: boolean) => void;
  containerBorderWidth: number;
  setContainerBorderWidth: (width: number) => void;
  containerBorderColor: string;
  setContainerBorderColor: (color: string) => void;
  containerBorderRadius: number;
  setContainerBorderRadius: (radius: number) => void;
  containerPadding: number;
  setContainerPadding: (padding: number) => void;
  containerMaxWidth: number;
  setContainerMaxWidth: (width: number) => void;
  activeTemplate: string;
  activeVersion: 'newsletter' | 'web';

  // Nuevos campos para la nota
  currentNoteId: string | null;
  noteTitle: string;
  setNoteTitle: (title: string) => void;
  noteDescription: string;
  setNoteDescription: (description: string) => void;
  noteCoverImageUrl: string;
  setNoteCoverImageUrl: (url: string) => void;
  noteStatus: PostStatus;
  setNoteStatus: (status: PostStatus) => void;
  updateStatus: (status: PostStatus) => Promise<void>;

  // Nuevos campos de metadata
  contentTypeId: string;
  setContentTypeId: (id: string) => void;
  audienceId: string;
  setAudienceId: (id: string) => void;
  categoryId: string;
  setCategoryId: (id: string) => void;
  subcategoryId: string;
  setSubcategoryId: (id: string) => void;

  // Campo highlight
  highlight: boolean;
  setHighlight: (highlight: boolean) => void;

  // Control de validaciones
  showValidationErrors?: boolean;

  // Prop para columna seleccionada en TwoColumns
  selectedColumn?: 'left' | 'right';

  // Nueva prop para inyectar componentes al newsletter
  injectComponentsToNewsletter?: (components: EmailComponent[], noteTitle?: string) => void;

  // Nueva prop para eliminar contenedores de nota
  removeNoteContainer?: (containerId: string) => void;

  // Props para newsletter
  isNewsletterMode?: boolean;
  newsletterTitle?: string;
  onNewsletterTitleChange?: (title: string) => void;
  newsletterDescription?: string;
  onNewsletterDescriptionChange?: (description: string) => void;
  newsletterHeader?: any; // NewsletterHeader type
  newsletterFooter?: any; // NewsletterFooter type
  onHeaderChange?: (header: any) => void;
  onFooterChange?: (footer: any) => void;
  onNewsletterConfigChange?: (config: { header?: any; footer?: any }) => void;
  newsletterStatus?: string;
  currentNewsletterId?: string | null;
  onNewsletterUpdate?: () => void;
  // Prop para modo view-only
  isViewOnly?: boolean;
  noteConfigurationViewRef?: React.Ref<NoteConfigurationViewHandle>;

  // NUEVAS PROPS para actualizar componentes dentro de newsletters
  updateNewsletterNoteComponentProps?: (
    noteId: string,
    componentId: string,
    props: Record<string, any>
  ) => void;
  updateNewsletterNoteComponentStyle?: (
    noteId: string,
    componentId: string,
    style: React.CSSProperties
  ) => void;
}

export interface TextOptionsProps
  extends Omit<RightPanelProps, 'rightPanelTab' | 'setRightPanelTab'> {
  componentType: string;
  selectedComponent: EmailComponent | null;
}

export interface ImageOptionsProps {
  selectedComponentId: string | null;
  selectedComponent: EmailComponent;
  updateComponentProps: UpdateComponentPropsFn;
  updateComponentStyle: (id: string, style: React.CSSProperties) => void;
}

export interface GalleryOptionsProps {
  selectedComponentId: string | null;
  selectedComponent: EmailComponent;
  updateComponentProps: UpdateComponentPropsFn;
  updateComponentStyle: (id: string, style: React.CSSProperties) => void;
}

export interface ButtonOptionsProps {
  selectedComponentId: string | null;
  selectedComponent: EmailComponent;
  updateComponentProps: UpdateComponentPropsFn;
  updateComponentStyle: (id: string, style: React.CSSProperties) => void;
  updateComponentContent: (id: string, content: string) => void;
}

export interface SummaryOptionsProps {
  selectedComponentId: string | null;
  getActiveComponents: () => EmailComponent[];
  updateComponentProps: UpdateComponentPropsFn;
  setShowIconPicker: (show: boolean) => void;
}

export interface CategoryOptionsProps {
  selectedComponentId: string | null;
  getActiveComponents: () => EmailComponent[];
  updateComponentProps: UpdateComponentPropsFn;
  updateComponentContent: (id: string, content: string) => void;
  categoryId: string;
  setCategoryId: (id: string) => void;
  subcategoryId: string;
  setSubcategoryId: (id: string) => void;
  categories: Array<{
    id: string;
    name: string;
    subcategories?: Array<{ id: string; name: string }>;
  }>;
  subcategories: Array<{ id: string; name: string }>;
  contentTypeId: string;
  loadingMetadata: boolean;
}

export interface TituloConIconoOptionsProps {
  selectedComponentId: string | null;
  getActiveComponents: () => EmailComponent[];
  updateComponentProps: UpdateComponentPropsFn;
  setShowIconPicker: (show: boolean) => void;
  // Nuevas props para sincronización con categorías
  contentTypeId: string;
  setContentTypeId: (id: string) => void;
  categoryId: string;
  setCategoryId: (id: string) => void;
  contentTypes: Array<{ id: string; name: string }>;
  categories: Array<{ id: string; name: string; imageUrl?: string }>;
  loadingMetadata: boolean;
  loadCategories: (contentTypeId: string) => void;
}

export interface RespaldadoPorOptionsProps {
  selectedComponentId: string | null;
  getActiveComponents: () => EmailComponent[];
  updateComponentProps: UpdateComponentPropsFn;
}

export interface DividerOptionsProps {
  selectedComponentId: string | null;
  selectedComponent: EmailComponent | null;
  updateComponentStyle: (id: string, style: React.CSSProperties) => void;
  updateComponentProps: UpdateComponentPropsFn;
}

export interface ImageCropDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (croppedImage: string) => void;
  initialImage: string;
  currentAspectRatio?: number;
  initialTab?: 'edit' | 'ai';
  userId?: string;
  plan?: string;
}

export interface CropRatio {
  label: string;
  value: number | undefined;
  icon: string;
}

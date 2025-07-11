import type React from 'react';
import type { PostStatus } from 'src/types/post';
import type { EmailComponent } from 'src/types/saved-note';
import type { BannerOption } from 'src/components/newsletter-note/banner-selector';

export interface RightPanelProps {
  selectedComponentId: string | null;
  rightPanelTab: number;
  setRightPanelTab: (tab: number) => void;
  getActiveComponents: () => EmailComponent[];
  updateComponentProps: (id: string, props: Record<string, any>) => void;
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
  applyTextAlignment: (alignment: string) => void;
  applyTextColor: (color: string) => void;
  applyFontSize: (size: string) => void;
  applyFontFamily: (font: string) => void;
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
  listStyle?: string;
  updateListStyle: (listId: string, listStyleType: string) => void;
  listColor?: string;
  updateListColor: (listId: string, color: string) => void;
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

  // Prop para columna seleccionada en TwoColumns
  selectedColumn?: 'left' | 'right';

  // Nueva prop para inyectar componentes al newsletter
  injectComponentsToNewsletter?: (components: EmailComponent[], noteTitle?: string) => void;

  // Nueva prop para eliminar contenedores de nota
  removeNoteContainer?: (containerId: string) => void;
}

export interface ListStyleOptionsProps {
  selectedComponentId: string | null;
  listStyle?: string;
  updateListStyle: (listId: string, listStyleType: string) => void;
  listColor?: string;
  updateListColor: (listId: string, color: string) => void;
}

export interface TextOptionsProps
  extends Omit<RightPanelProps, 'rightPanelTab' | 'setRightPanelTab'> {
  componentType: string;
  selectedComponent: EmailComponent | null;
}

export interface ImageOptionsProps {
  selectedComponentId: string | null;
  selectedComponent: EmailComponent;
  updateComponentProps: (id: string, props: Record<string, any>) => void;
  updateComponentStyle: (id: string, style: React.CSSProperties) => void;
}

export interface GalleryOptionsProps {
  selectedComponentId: string | null;
  selectedComponent: EmailComponent;
  updateComponentProps: (id: string, props: Record<string, any>) => void;
  updateComponentStyle: (id: string, style: React.CSSProperties) => void;
}

export interface ButtonOptionsProps {
  selectedComponentId: string | null;
  selectedComponent: EmailComponent;
  updateComponentProps: (id: string, props: Record<string, any>) => void;
  updateComponentStyle: (id: string, style: React.CSSProperties) => void;
  updateComponentContent: (id: string, content: string) => void;
}

export interface SummaryOptionsProps {
  selectedComponentId: string | null;
  getActiveComponents: () => EmailComponent[];
  updateComponentProps: (id: string, props: Record<string, any>) => void;
  setShowIconPicker: (show: boolean) => void;
}

export interface CategoryOptionsProps {
  selectedComponentId: string | null;
  getActiveComponents: () => EmailComponent[];
  updateComponentProps: (id: string, props: Record<string, any>) => void;
}

export interface TituloConIconoOptionsProps {
  selectedComponentId: string | null;
  getActiveComponents: () => EmailComponent[];
  updateComponentProps: (id: string, props: Record<string, any>) => void;
  setShowIconPicker: (show: boolean) => void;
}

export interface RespaldadoPorOptionsProps {
  selectedComponentId: string | null;
  getActiveComponents: () => EmailComponent[];
  updateComponentProps: (id: string, props: Record<string, any>) => void;
}

export interface DividerOptionsProps {
  selectedComponentId: string | null;
  selectedComponent: EmailComponent | null;
  updateComponentStyle: (id: string, style: React.CSSProperties) => void;
  updateComponentProps: (id: string, props: Record<string, any>) => void;
}

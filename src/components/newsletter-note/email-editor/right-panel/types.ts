import type React from 'react';
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

export interface DesignOptionsProps {
  selectedComponentId: string | null;
  updateComponentStyle: (id: string, style: React.CSSProperties) => void;
}

export interface BackgroundOptionsProps {
  selectedComponentId: string | null;
  updateComponentStyle: (id: string, style: React.CSSProperties) => void;
  emailBackground: string;
  setEmailBackground: (color: string) => void;
  selectedBanner: string | null;
  setSelectedBanner: (banner: string | null) => void;
  showGradient: boolean;
  setShowGradient: (show: boolean) => void;
  gradientColors: string[];
  setGradientColors: (colors: string[]) => void;
  bannerOptions: BannerOption[];
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

import type { Newsletter } from '../../../../../types/newsletter';

// ============================================================================
// DESIGN PANEL TYPES - Newsletter Design System
// ============================================================================

export interface DesignPanelProps {
  isOpen: boolean;
  onClose: () => void;
  newsletter: Newsletter;
  onUpdateNewsletter: (updates: Partial<Newsletter>) => void;
  className?: string;
}

export type DesignTab = 'templates' | 'colors' | 'typography' | 'layout' | 'preview';

export interface DesignPanelState {
  activeTab: DesignTab;
  searchQuery: string;
  isLoading: boolean;
  isDirty: boolean;
}

export interface PanelSection {
  id: DesignTab;
  label: string;
  icon: React.ReactNode;
  component: React.ComponentType<any>;
}

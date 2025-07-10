import type { Editor } from '@tiptap/react';
import type { EmailComponent } from 'src/types/saved-note';

export interface EmailComponentProps {
  component: EmailComponent;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  updateComponentContent: (id: string, content: string) => void;
  updateComponentProps: (id: string, props: Record<string, any>) => void;
  handleSelectionUpdate: (editor: Editor) => void;
  moveComponent: (id: string, direction: 'up' | 'down') => void;
  removeComponent: (id: string) => void;
  totalComponents: number;
  renderCustomContent?: (component: EmailComponent) => React.ReactNode;
  onColumnSelect?: (componentId: string, column: 'left' | 'right') => void;
}

export interface ComponentWithToolbarProps {
  isSelected: boolean;
  index: number;
  totalComponents: number;
  componentId: string;
  moveComponent: (id: string, direction: 'up' | 'down') => void;
  removeComponent: (id: string) => void;
  children: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
}

// Tipo para categoría
export interface Categoria {
  id: string;
  texto: string;
  colorFondo: string;
  colorTexto: string;
}

import type { Editor } from '@tiptap/react';
import type { EmailComponent } from 'src/types/saved-note';

export interface EmailComponentProps {
  component: EmailComponent;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  updateComponentContent: (id: string, content: string) => void;
  updateComponentProps: (id: string, props: Record<string, any>) => void;
  updateComponentStyle?: (id: string, style: React.CSSProperties) => void;
  handleSelectionUpdate: (editor: Editor) => void;
  moveComponent: (id: string, direction: 'up' | 'down') => void;
  removeComponent: (id: string) => void;
  totalComponents: number;
  renderCustomContent?: (component: EmailComponent) => React.ReactNode;
  onColumnSelect?: (componentId: string, column: 'left' | 'right') => void;
  removeNoteContainer?: (containerId: string) => void;
  getActiveComponents?: () => any[];
  onComponentSelect?: (componentId: string) => void; // Nueva prop para selección de componentes
  selectedComponentId?: string | null; // Nueva prop para saber qué componente está seleccionado
}

export interface ComponentWithToolbarProps {
  isSelected: boolean;
  index: number;
  totalComponents: number;
  componentId: string;
  componentType?: string;
  moveComponent: (id: string, direction: 'up' | 'down') => void;
  removeComponent: (id: string) => void;
  children: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
  isViewOnly?: boolean;
  onAIClick?: () => void;
  // Props para guardar notas de IA en newsletters
  isAIGeneratedNote?: boolean;
  onSaveClick?: () => void;
}

// Tipo para categoría
export interface Categoria {
  id: string;
  texto: string;
  colorFondo: string;
  colorTexto: string;
}

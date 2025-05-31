import type { CSSProperties } from 'react';

export interface EducacionComponent {
  id: string;
  type:
    | 'heading'
    | 'paragraph'
    | 'bulletList'
    | 'button'
    | 'divider'
    | 'spacer'
    | 'image'
    | 'category'
    | 'gallery'
    | 'video'
    | 'audio'
    | 'quiz'
    | 'codeSnippet'
    | 'table'
    | 'timeline'
    | 'accordion'
    | 'infoCard'
    | 'highlightBox'
    | 'iconList'
    | 'stepProcess'
    | 'exampleBox';
  content: string;
  props?: Record<string, any>;
  style?: CSSProperties;
}

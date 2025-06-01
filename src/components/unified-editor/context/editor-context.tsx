'use client';

import { useContext, createContext } from 'react';

import type { EditorContextValue } from '../types';

export const EditorContext = createContext<EditorContextValue | null>(null);

export function useEditorContext() {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditorContext must be used within an EditorContext.Provider');
  }
  return context;
}

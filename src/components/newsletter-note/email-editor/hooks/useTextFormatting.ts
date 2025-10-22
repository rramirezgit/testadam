import type { Editor } from '@tiptap/react';

import { useState, useCallback } from 'react';

export const useTextFormatting = () => {
  const [activeEditor, setActiveEditor] = useState<Editor | null>(null);
  const [selectedColor, setSelectedColor] = useState('black');
  const [selectedFont, setSelectedFont] = useState('Public Sans');
  const [selectedFontWeight, setSelectedFontWeight] = useState('normal');
  const [selectedFontSize, setSelectedFontSize] = useState('16');
  const [selectedAlignment, setSelectedAlignment] = useState('left');
  const [textFormat, setTextFormat] = useState<string[]>([]);
  const [hasTextSelection, setHasTextSelection] = useState(false);

  // ⚡ Optimización: handleSelectionUpdate con debouncing y optimizaciones
  const handleSelectionUpdate = useCallback((editor: Editor) => {
    // Usar requestAnimationFrame para diferir actualizaciones pesadas
    requestAnimationFrame(() => {
      setActiveEditor(editor);

      // Verificar si hay texto seleccionado
      const { from, to } = editor.state.selection;
      const hasSelection = from !== to;
      setHasTextSelection(hasSelection);

      // Solo actualizar formatos si hay cambios significativos
      if (editor) {
        const newFormats = [];
        if (editor.isActive('bold')) newFormats.push('bold');
        if (editor.isActive('italic')) newFormats.push('italic');
        if (editor.isActive('underline')) newFormats.push('underlined');
        if (editor.isActive('strike')) newFormats.push('strikethrough');

        // Solo actualizar si hay cambios
        setTextFormat((prevFormats) => {
          if (JSON.stringify(prevFormats) !== JSON.stringify(newFormats)) {
            return newFormats;
          }
          return prevFormats;
        });

        // Actualizar alineación solo si cambió
        let newAlignment = 'left';
        if (editor.isActive({ textAlign: 'center' })) newAlignment = 'center';
        else if (editor.isActive({ textAlign: 'right' })) newAlignment = 'right';
        else if (editor.isActive({ textAlign: 'justify' })) newAlignment = 'justify';

        setSelectedAlignment((prevAlignment) => {
          if (prevAlignment !== newAlignment) {
            return newAlignment;
          }
          return prevAlignment;
        });

        // Actualizar atributos de texto de forma optimizada
        const marks = editor.getAttributes('textStyle');
        if (marks.color) {
          setSelectedColor((prevColor) => {
            if (prevColor !== marks.color) {
              return marks.color;
            }
            return prevColor;
          });
        }

        if (marks.fontFamily) {
          setSelectedFont((prevFont) => {
            if (prevFont !== marks.fontFamily) {
              return marks.fontFamily;
            }
            return prevFont;
          });
        }

        if (marks.fontWeight) {
          setSelectedFontWeight((prevWeight) => {
            if (prevWeight !== marks.fontWeight) {
              return marks.fontWeight;
            }
            return prevWeight;
          });
        }
      }
    });
  }, []);

  // Aplicar formato al texto seleccionado
  const applyTextFormat = useCallback(
    (format: string) => {
      if (!activeEditor) return;

      // Crear una copia del array actual de formatos
      const newFormats = [...textFormat];

      switch (format) {
        case 'bold':
          activeEditor.chain().focus().toggleBold().run();
          // Actualizar el estado inmediatamente
          if (activeEditor.isActive('bold')) {
            if (!newFormats.includes('bold')) newFormats.push('bold');
          } else {
            const index = newFormats.indexOf('bold');
            if (index > -1) newFormats.splice(index, 1);
          }
          break;
        case 'italic':
          activeEditor.chain().focus().toggleItalic().run();
          if (activeEditor.isActive('italic')) {
            if (!newFormats.includes('italic')) newFormats.push('italic');
          } else {
            const index = newFormats.indexOf('italic');
            if (index > -1) newFormats.splice(index, 1);
          }
          break;
        case 'underlined':
          activeEditor.chain().focus().toggleUnderline().run();
          if (activeEditor.isActive('underline')) {
            if (!newFormats.includes('underlined')) newFormats.push('underlined');
          } else {
            const index = newFormats.indexOf('underlined');
            if (index > -1) newFormats.splice(index, 1);
          }
          break;
        case 'strikethrough':
          activeEditor.chain().focus().toggleStrike().run();
          if (activeEditor.isActive('strike')) {
            if (!newFormats.includes('strikethrough')) newFormats.push('strikethrough');
          } else {
            const index = newFormats.indexOf('strikethrough');
            if (index > -1) newFormats.splice(index, 1);
          }
          break;
        default:
          break;
      }

      // Actualizar el estado con los nuevos formatos
      setTextFormat(newFormats);
    },
    [activeEditor, textFormat]
  );

  // Aplicar alineación al texto seleccionado
  const applyTextAlignment = useCallback(
    (
      alignment: string,
      selectedComponentId?: string | null,
      updateComponentStyle?: (id: string, style: React.CSSProperties) => void
    ) => {
      // Si hay un componente seleccionado y función de actualización, actualizar directamente
      if (selectedComponentId && updateComponentStyle) {
        updateComponentStyle(selectedComponentId, {
          textAlign: alignment as React.CSSProperties['textAlign'],
        });
        setSelectedAlignment(alignment);
        return;
      }

      // Fallback: usar el editor activo si está disponible
      if (!activeEditor) return;
      activeEditor.chain().focus().setTextAlign(alignment).run();
      setSelectedAlignment(alignment);
    },
    [activeEditor]
  );

  // Aplicar color al texto seleccionado
  const applyTextColor = useCallback(
    (
      color: string,
      selectedComponentId?: string | null,
      updateComponentStyle?: (id: string, style: React.CSSProperties) => void
    ) => {
      // Si hay un componente seleccionado y función de actualización, actualizar directamente
      if (selectedComponentId && updateComponentStyle) {
        updateComponentStyle(selectedComponentId, { color });
        setSelectedColor(color);
        return;
      }

      // Fallback: usar el editor activo si está disponible
      if (!activeEditor) return;
      activeEditor.chain().focus().setColor(color).run();
      setSelectedColor(color);
    },
    [activeEditor]
  );

  // Aplicar tamaño de fuente al texto seleccionado
  const applyFontSize = useCallback(
    (
      size: string,
      selectedComponentId: string | null,
      updateComponentStyle: (id: string, style: React.CSSProperties) => void
    ) => {
      // Siempre actualizar el estilo del componente si hay ID válido
      if (selectedComponentId && updateComponentStyle) {
        updateComponentStyle(selectedComponentId, { fontSize: `${size}px` });
        setSelectedFontSize(size);
      }
    },
    [activeEditor]
  );

  // Aplicar fuente al texto seleccionado
  const applyFontFamily = useCallback(
    (
      font: string,
      selectedComponentId: string | null,
      updateComponentStyle: (id: string, style: React.CSSProperties) => void
    ) => {
      // Siempre actualizar el estilo del componente si hay ID válido
      if (selectedComponentId && updateComponentStyle) {
        updateComponentStyle(selectedComponentId, { fontFamily: font });
        setSelectedFont(font);
      }
    },
    [activeEditor]
  );

  return {
    // Estados
    activeEditor,
    selectedColor,
    selectedFont,
    selectedFontWeight,
    selectedFontSize,
    selectedAlignment,
    textFormat,
    hasTextSelection,

    // Setters
    setActiveEditor,
    setSelectedColor,
    setSelectedFont,
    setSelectedFontWeight,
    setSelectedFontSize,
    setSelectedAlignment,
    setTextFormat,
    setHasTextSelection,

    // Funciones
    handleSelectionUpdate,
    applyTextFormat,
    applyTextAlignment,
    applyTextColor,
    applyFontSize,
    applyFontFamily,
  };
};

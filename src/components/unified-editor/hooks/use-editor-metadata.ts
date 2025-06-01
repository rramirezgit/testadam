import type { Editor } from '@tiptap/react';

import { useMemo, useState, useEffect } from 'react';

import type { EditorMetadata } from '../types';

export function useEditorMetadata(editor: Editor | null): EditorMetadata | null {
  return useMemo(() => {
    if (!editor) return null;

    const htmlContent = editor.getHTML();
    const textContent = editor.getText();

    // Calcular estadísticas básicas
    const wordCount = textContent.trim() ? textContent.trim().split(/\s+/).length : 0;
    const characterCount = textContent.length;
    const characterCountWithoutSpaces = textContent.replace(/\s/g, '').length;

    // Estimar tiempo de lectura (promedio 200-250 palabras por minuto)
    const readingTime = Math.ceil(wordCount / 225);

    // Detectar elementos específicos
    const hasImages = htmlContent.includes('<img') || htmlContent.includes('data-type="image"');
    const hasLinks = htmlContent.includes('<a ') && htmlContent.includes('href=');
    const hasTables = htmlContent.includes('<table') || htmlContent.includes('data-type="table"');
    const hasYoutube = htmlContent.includes('data-youtube-video');
    const hasCodeBlocks = htmlContent.includes('<pre') || htmlContent.includes('<code');

    // Verificar si está vacío (solo <p></p> o <p><br></p> cuenta como vacío)
    const isEmpty =
      editor.isEmpty ||
      htmlContent === '<p></p>' ||
      htmlContent === '<p><br></p>' ||
      textContent.trim() === '';

    // Contar elementos específicos
    const imageCount = (htmlContent.match(/<img/g) || []).length;
    const linkCount = (htmlContent.match(/<a\s+href=/g) || []).length;
    const headingCount = (htmlContent.match(/<h[1-6]/g) || []).length;
    const listCount = (htmlContent.match(/<(ul|ol)/g) || []).length;
    const tableCount = (htmlContent.match(/<table/g) || []).length;

    // Análisis de estructura del documento
    const headingStructure = extractHeadingStructure(htmlContent);

    // Análisis de legibilidad (Flesch Reading Ease simplificado)
    const readabilityScore = calculateReadabilityScore(textContent, wordCount);

    return {
      htmlContent,
      textContent,
      wordCount,
      characterCount,
      characterCountWithoutSpaces,
      readingTime,
      isEmpty,
      hasImages,
      hasLinks,
      hasTables,
      hasYoutube,
      hasCodeBlocks,

      // Conteos detallados
      counts: {
        images: imageCount,
        links: linkCount,
        headings: headingCount,
        lists: listCount,
        tables: tableCount,
        paragraphs: (htmlContent.match(/<p/g) || []).length,
        codeBlocks: (htmlContent.match(/<pre/g) || []).length,
      },

      // Estructura
      headingStructure,

      // Análisis de calidad
      readabilityScore,

      // Metadata adicional
      lastModified: new Date().toISOString(),
      contentHash: generateSimpleHash(htmlContent),
    };
  }, [editor?.getHTML(), editor?.getText(), editor?.isEmpty]);
}

// Función para extraer estructura de encabezados
function extractHeadingStructure(htmlContent: string) {
  const headingRegex = /<h([1-6])[^>]*>(.*?)<\/h[1-6]>/gi;
  const headings: Array<{ level: number; text: string; id?: string }> = [];
  let match;

  while ((match = headingRegex.exec(htmlContent)) !== null) {
    const level = parseInt(match[1], 10);
    const text = match[2].replace(/<[^>]*>/g, '').trim(); // Remover tags HTML internos
    headings.push({ level, text });
  }

  return headings;
}

// Función para calcular score de legibilidad (simplificado)
function calculateReadabilityScore(text: string, wordCount: number): number {
  if (wordCount === 0) return 0;

  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;
  const avgWordsPerSentence = wordCount / Math.max(sentences, 1);

  // Contar sílabas aproximadamente (muy simplificado para español/inglés)
  const syllableCount = text
    .toLowerCase()
    .replace(/[^a-záéíóúüñ]/g, '')
    .replace(/[aeiouáéíóúü]/g, 'X')
    .replace(/[^X]/g, '').length;

  const avgSyllablesPerWord = syllableCount / Math.max(wordCount, 1);

  // Fórmula simplificada de legibilidad (0-100, mayor = más fácil)
  const score = Math.max(
    0,
    Math.min(100, 100 - avgWordsPerSentence * 1.015 - avgSyllablesPerWord * 84.6)
  );

  return Math.round(score);
}

// Función para generar hash simple del contenido (sin operadores bitwise)
function generateSimpleHash(content: string): string {
  if (content.length === 0) return '0';

  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = (hash * 31 + char) % 2147483647; // Usar módulo en lugar de operadores bitwise
  }

  return Math.abs(hash).toString(36);
}

// Hook para metadata en tiempo real con debounce
export function useDebouncedEditorMetadata(
  editor: Editor | null,
  delay: number = 500
): EditorMetadata | null {
  const [debouncedEditor, setDebouncedEditor] = useState(editor);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedEditor(editor);
    }, delay);

    return () => clearTimeout(timer);
  }, [editor?.getHTML(), delay]);

  return useEditorMetadata(debouncedEditor);
}

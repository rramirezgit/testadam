// Función para convertir números a numerales romanos
export const toRoman = (num: number): string => {
  const romanNumerals = [
    { value: 1000, numeral: 'M' },
    { value: 900, numeral: 'CM' },
    { value: 500, numeral: 'D' },
    { value: 400, numeral: 'CD' },
    { value: 100, numeral: 'C' },
    { value: 90, numeral: 'XC' },
    { value: 50, numeral: 'L' },
    { value: 40, numeral: 'XL' },
    { value: 10, numeral: 'X' },
    { value: 9, numeral: 'IX' },
    { value: 5, numeral: 'V' },
    { value: 4, numeral: 'IV' },
    { value: 1, numeral: 'I' },
  ];

  let result = '';
  let remaining = num;

  for (const { value, numeral } of romanNumerals) {
    while (remaining >= value) {
      result += numeral;
      remaining -= value;
    }
  }

  return result;
};

// Función auxiliar para generar el marcador de lista ordenada
import type { EmailComponent } from 'src/types/saved-note';

export const DEFAULT_PLACEHOLDER_COLOR = '#9CA3AF';

const hasExplicitColor = (color?: string | null): boolean =>
  typeof color === 'string' && color.trim().length > 0;

export const shouldUsePlaceholderColor = (
  component: EmailComponent,
  explicitColor?: string | null
): boolean => Boolean(component.meta?.isDefaultContent && !hasExplicitColor(explicitColor));

export const resolveTextColor = (
  component: EmailComponent,
  explicitColor?: string | null,
  fallbackColor: string = 'inherit'
): string => {
  if (hasExplicitColor(explicitColor)) {
    return explicitColor!.trim();
  }

  if (component.meta?.isDefaultContent) {
    return DEFAULT_PLACEHOLDER_COLOR;
  }

  return fallbackColor;
};

export const getOrderedListMarker = (itemIndex: number, listStyle: string): string => {
  switch (listStyle) {
    case 'decimal':
      return `${itemIndex}`;
    case 'lower-alpha':
      return `${String.fromCharCode(96 + itemIndex)}`;
    case 'upper-alpha':
      return `${String.fromCharCode(64 + itemIndex)}`;
    case 'lower-roman':
      return `${toRoman(itemIndex).toLowerCase()}`;
    case 'upper-roman':
      return `${toRoman(itemIndex)}`;
    default:
      return `${itemIndex}`;
  }
};

const LIST_STYLE_TAGS: Record<string, 'ul' | 'ol'> = {
  disc: 'ul',
  circle: 'ul',
  square: 'ul',
  decimal: 'ol',
  'lower-alpha': 'ol',
  'upper-alpha': 'ol',
  'lower-roman': 'ol',
  'upper-roman': 'ol',
};

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export const isOrderedListStyle = (style?: string): boolean =>
  style
    ? ['decimal', 'lower-alpha', 'upper-alpha', 'lower-roman', 'upper-roman'].includes(style)
    : false;

export const normaliseListStyle = (style?: string): string =>
  style && LIST_STYLE_TAGS[style] ? style : 'disc';

export const buildListHtml = (items: string[], style?: string): string => {
  const listStyle = normaliseListStyle(style);
  const tag = LIST_STYLE_TAGS[listStyle] || 'ul';
  const safeItems = items.length > 0 ? items : ['Elemento de lista'];

  return `<${tag}>${safeItems.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</${tag}>`;
};

export const extractListItemsFromHtml = (html: string): string[] => {
  if (!html || typeof window === 'undefined') {
    return [];
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const listNode = doc.querySelector('ul, ol');

    if (!listNode) {
      return [];
    }

    const items: string[] = [];

    listNode.querySelectorAll('li').forEach((li) => {
      const textContent = li.textContent ?? '';
      items.push(textContent.trim());
    });

    return items;
  } catch (error) {
    console.warn('extractListItemsFromHtml: error parsing HTML', error);
    return [];
  }
};

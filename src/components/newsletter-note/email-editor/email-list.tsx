import type { EmailComponent } from 'src/types/saved-note';

import React from 'react';
import { Icon } from '@iconify/react';

import { Box, Button, IconButton } from '@mui/material';

import SimpleEditable from './simple-editable';

interface EmailListProps {
  component: EmailComponent;
  updateListItem: (id: string, index: number, content: string) => void;
  removeListItem: (id: string, index: number) => void;
  addListItem: (id: string) => void;
  updateComponentProps: (id: string, props: Record<string, any>) => void;
}

export const EmailList: React.FC<EmailListProps> = ({
  component,
  updateListItem,
  removeListItem,
  addListItem,
  updateComponentProps,
}) => {
  const items = component.props.items || ['List item'];
  const listStyle = component.props.listStyle || 'disc';
  const listColor = component.props.listColor || '#000000';

  // Determinar si es una lista ordenada
  const isOrderedList =
    listStyle === 'decimal' ||
    listStyle === 'lower-alpha' ||
    listStyle === 'upper-alpha' ||
    listStyle === 'lower-roman' ||
    listStyle === 'upper-roman';

  // Manejar la tecla Enter para crear un nuevo elemento
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();

      // Obtener el elemento de entrada actual
      const inputElement = e.target as HTMLInputElement;
      const cursorPosition = inputElement.selectionStart || 0;
      const currentText = items[index];

      // Dividir el texto en la posición del cursor
      const textBefore = currentText.substring(0, cursorPosition);
      const textAfter = currentText.substring(cursorPosition);

      // Crear un nuevo elemento después del actual con el texto después del cursor
      const newItems = [...items];
      newItems[index] = textBefore; // Actualizar el elemento actual
      newItems.splice(index + 1, 0, textAfter); // Insertar nuevo elemento

      // Actualizar el componente con los nuevos elementos
      const updatedProps = {
        ...component.props,
        items: newItems,
      };

      // Actualizar el componente
      updateComponentProps(component.id, updatedProps);

      // Enfocar el nuevo elemento
      setTimeout(() => {
        const elements = document.querySelectorAll(`[data-list-item="${component.id}"]`);
        if (elements[index + 1]) {
          (elements[index + 1] as HTMLElement).click();
        }
      }, 10);
    } else if (e.key === 'Backspace') {
      const inputElement = e.target as HTMLInputElement;
      const cursorPosition = inputElement.selectionStart || 0;
      const currentText = items[index];

      // Si estamos al inicio del texto y hay un elemento anterior
      if (cursorPosition === 0 && index > 0) {
        e.preventDefault();

        // Obtener el texto del elemento actual y el anterior
        const previousText = items[index - 1];

        // Combinar el texto del elemento anterior con el actual
        const newItems = [...items];
        newItems[index - 1] = previousText + currentText; // Combinar textos
        newItems.splice(index, 1); // Eliminar el elemento actual

        // Actualizar el componente
        const updatedProps = {
          ...component.props,
          items: newItems,
        };

        updateComponentProps(component.id, updatedProps);

        // Enfocar el elemento anterior y posicionar el cursor al final
        setTimeout(() => {
          const elements = document.querySelectorAll(`[data-list-item="${component.id}"]`);
          if (elements[index - 1]) {
            const element = elements[index - 1] as HTMLElement;
            element.click();

            // Posicionar el cursor al final del texto anterior
            setTimeout(() => {
              const input = document.activeElement as HTMLInputElement;
              if (input && input.tagName === 'INPUT') {
                input.selectionStart = previousText.length;
                input.selectionEnd = previousText.length;
              }
            }, 10);
          }
        }, 10);
      }
      // Si el elemento está vacío y hay más de un elemento
      else if (currentText.trim() === '' && items.length > 1) {
        e.preventDefault();

        // Eliminar el elemento actual
        removeListItem(component.id, index);

        // Enfocar el elemento anterior o siguiente
        setTimeout(() => {
          const elements = document.querySelectorAll(`[data-list-item="${component.id}"]`);
          const newIndex = index > 0 ? index - 1 : 0;
          if (elements[newIndex]) {
            (elements[newIndex] as HTMLElement).click();
          }
        }, 10);
      }
    }
  };

  return (
    <Box sx={{ position: 'relative' }}>
      {items.map((item, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            mb: 2,
            pl: 2,
          }}
        >
          {isOrderedList ? (
            // Marcador para listas ordenadas - Estilo unificado con círculo y número
            <Box
              sx={{
                minWidth: '24px',
                mr: 2,
                backgroundColor: listColor,
                borderRadius: '50%',
                color: 'white',
                fontSize: '12px',
                fontWeight: 'bold',
                height: '24px',
                width: '24px',
                lineHeight: '24px',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {getOrderedListMarker(index + 1, listStyle)}
            </Box>
          ) : (
            // Para listas no ordenadas, también usamos círculos para mantener consistencia
            <Box
              sx={{
                minWidth: '24px',
                mr: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {listStyle === 'disc' && (
                <Box
                  sx={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: listColor,
                  }}
                />
              )}
              {listStyle === 'circle' && (
                <Box
                  sx={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    border: `1px solid ${listColor}`,
                    backgroundColor: 'transparent',
                  }}
                />
              )}
              {listStyle === 'square' && (
                <Box
                  sx={{
                    width: '8px',
                    height: '8px',
                    backgroundColor: listColor,
                  }}
                />
              )}
            </Box>
          )}

          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <SimpleEditable
              value={item}
              onChange={(newValue) => updateListItem(component.id, index, newValue)}
              style={{ flexGrow: 1 }}
              onKeyDown={(e) => handleKeyDown(e, index)}
              data-list-item={component.id}
            />

            <IconButton
              size="small"
              onClick={() => removeListItem(component.id, index)}
              sx={{ ml: 1, opacity: 0.6 }}
            >
              <Icon icon="mdi:delete" fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      ))}

      <Box sx={{ pl: 2, mt: 1 }}>
        <Button
          startIcon={<Icon icon="mdi:plus" />}
          size="small"
          onClick={() => addListItem(component.id)}
        >
          Añadir elemento
        </Button>
      </Box>
    </Box>
  );
};

// Función auxiliar para generar el marcador de lista ordenada
const getOrderedListMarker = (index: number, listStyle: string): string => {
  switch (listStyle) {
    case 'decimal':
      return `${index}`;
    case 'lower-alpha':
      return `${String.fromCharCode(96 + index)}`;
    case 'upper-alpha':
      return `${String.fromCharCode(64 + index)}`;
    case 'lower-roman':
      return `${toRoman(index).toLowerCase()}`;
    case 'upper-roman':
      return `${toRoman(index)}`;
    default:
      return `${index}`;
  }
};

// Función para convertir números a numerales romanos
const toRoman = (num: number): string => {
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

export default EmailList;

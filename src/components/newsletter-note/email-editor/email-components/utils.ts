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

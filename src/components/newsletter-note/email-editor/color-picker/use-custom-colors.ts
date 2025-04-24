'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'custom-colors';
const MAX_CUSTOM_COLORS = 6;

export const useCustomColors = () => {
  const [customColors, setCustomColors] = useState<string[]>([]);

  // Cargar colores guardados al iniciar
  useEffect(() => {
    const savedColors = localStorage.getItem(STORAGE_KEY);
    if (savedColors) {
      setCustomColors(JSON.parse(savedColors));
    }
  }, []);

  // Guardar colores cuando cambien
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customColors));
  }, [customColors]);

  const addCustomColor = (color: string) => {
    setCustomColors((prevColors) => {
      const newColors = [...prevColors];

      // Si ya existe el color, no lo agregamos
      if (newColors.includes(color)) {
        return newColors;
      }

      // Si alcanzamos el máximo, eliminamos el primer color agregado
      if (newColors.length >= MAX_CUSTOM_COLORS) {
        newColors.shift();
      }

      newColors.push(color);
      return newColors;
    });
  };

  const removeCustomColor = (colorToRemove: string) => {
    setCustomColors((prevColors) => prevColors.filter((color) => color !== colorToRemove));
  };

  return {
    customColors,
    addCustomColor,
    removeCustomColor,
  };
};

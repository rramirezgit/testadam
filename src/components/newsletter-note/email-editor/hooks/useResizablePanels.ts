import { useState, useEffect, useCallback } from 'react';

// Configuración de límites para los paneles
const MIN_PANEL_WIDTH = 280;
const MAX_PANEL_WIDTH = 500;

export const useResizablePanels = () => {
  // Estados para paneles redimensionables
  const [leftPanelWidth, setLeftPanelWidth] = useState(320); // Ancho inicial
  const [rightPanelWidth, setRightPanelWidth] = useState(320); // Ancho inicial
  const [isResizingLeft, setIsResizingLeft] = useState(false);
  const [isResizingRight, setIsResizingRight] = useState(false);

  // Funciones para el redimensionado de paneles
  const handleMouseDownLeft = useCallback(() => {
    setIsResizingLeft(true);
  }, []);

  const handleMouseDownRight = useCallback(() => {
    setIsResizingRight(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isResizingLeft) {
        const newWidth = Math.min(Math.max(e.clientX, MIN_PANEL_WIDTH), MAX_PANEL_WIDTH);
        setLeftPanelWidth(newWidth);
      }
      if (isResizingRight) {
        const newWidth = Math.min(
          Math.max(window.innerWidth - e.clientX, MIN_PANEL_WIDTH),
          MAX_PANEL_WIDTH
        );
        setRightPanelWidth(newWidth);
      }
    },
    [isResizingLeft, isResizingRight]
  );

  const handleMouseUp = useCallback(() => {
    setIsResizingLeft(false);
    setIsResizingRight(false);
  }, []);

  // Effect para manejar eventos globales de mouse
  useEffect(() => {
    if (isResizingLeft || isResizingRight) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
    }
    return undefined;
  }, [isResizingLeft, isResizingRight, handleMouseMove, handleMouseUp]);

  return {
    // Estados
    leftPanelWidth,
    rightPanelWidth,
    isResizingLeft,
    isResizingRight,

    // Constantes
    MIN_PANEL_WIDTH,
    MAX_PANEL_WIDTH,

    // Funciones
    handleMouseDownLeft,
    handleMouseDownRight,

    // Setters
    setLeftPanelWidth,
    setRightPanelWidth,
  };
};

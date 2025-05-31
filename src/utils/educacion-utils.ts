import type { SavedEducacion } from 'src/types/saved-educacion';

// Clave para almacenar los contenidos educativos en el localStorage
const STORAGE_KEY = 'savedEducaciones';

/**
 * Guarda un contenido educativo en localStorage.
 * Si el contenido ya existe (mismo ID), lo sobrescribe.
 */
export const saveEducacionToStorage = (educacion: SavedEducacion): void => {
  try {
    // Obtener los contenidos educativos existentes
    const educaciones = getAllEducacionesFromStorage();

    // Buscar si el contenido ya existe por ID
    const existingIndex = educaciones.findIndex((e) => e.id === educacion.id);

    if (existingIndex >= 0) {
      // Actualizar el contenido existente
      educaciones[existingIndex] = educacion;
    } else {
      // Agregar nuevo contenido
      educaciones.push(educacion);
    }

    // Guardar la lista actualizada en localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(educaciones));

    // Disparar evento de storage para notificar a otros componentes
    window.dispatchEvent(new Event('storage'));
  } catch (error) {
    console.error('Error al guardar el contenido educativo:', error);
  }
};

/**
 * Elimina un contenido educativo del localStorage por su ID.
 */
export const deleteEducacionFromStorage = (educacionId: string): void => {
  try {
    // Obtener los contenidos educativos existentes
    const educaciones = getAllEducacionesFromStorage();

    // Filtrar el contenido a eliminar
    const updatedEducaciones = educaciones.filter((e) => e.id !== educacionId);

    // Guardar la lista actualizada en localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEducaciones));

    // Disparar evento de storage para notificar a otros componentes
    window.dispatchEvent(new Event('storage'));
  } catch (error) {
    console.error('Error al eliminar el contenido educativo:', error);
  }
};

/**
 * Obtiene todos los contenidos educativos almacenados.
 */
export const getAllEducacionesFromStorage = (): SavedEducacion[] => {
  try {
    // Obtener el string de localStorage
    const educacionesJson = localStorage.getItem(STORAGE_KEY);

    // Si no hay contenidos, devolver array vacío
    if (!educacionesJson) {
      return [];
    }

    // Parsear y devolver los contenidos
    return JSON.parse(educacionesJson);
  } catch (error) {
    console.error('Error al obtener los contenidos educativos:', error);
    return [];
  }
};

/**
 * Obtiene un contenido educativo específico por su ID.
 */
export const getEducacionById = (educacionId: string): SavedEducacion | null => {
  try {
    const educaciones = getAllEducacionesFromStorage();
    const educacion = educaciones.find((e) => e.id === educacionId);
    return educacion || null;
  } catch (error) {
    console.error('Error al obtener el contenido educativo:', error);
    return null;
  }
};

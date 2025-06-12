/* eslint-disable no-constant-binary-expression */
import { useState } from 'react';

import { createAxiosInstance } from 'src/utils/axiosInstance';

// Mapeo de MIME types a extensiones válidas según el backend
const MIME_TO_EXTENSION: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'image/bmp': 'bmp',
};

// Extensiones permitidas por el backend
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'];

// Función mejorada para convertir base64 a blob
const base64ToBlob = (base64: string, mimeType: string): Blob => {
  try {
    // Remover el prefijo data:image/...;base64, si existe
    const base64Data = base64.split(',')[1] || base64;

    // Decodificar base64
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  } catch (error) {
    console.error('Error converting base64 to blob:', error);
    throw new Error('Failed to convert base64 to blob');
  }
};

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadImageToS3 = async (base64Image: string, filename?: string): Promise<string> => {
    setUploading(true);
    setUploadProgress(0);

    try {
      // Detectar el tipo MIME de la imagen base64
      const mimeMatch = base64Image.match(/^data:([^;]+);base64,/);
      const detectedMimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';

      // Obtener extensión válida desde el mapeo
      const extension = MIME_TO_EXTENSION[detectedMimeType] || 'jpg';

      // Validar que la extensión esté permitida
      if (!ALLOWED_EXTENSIONS.includes(extension)) {
        throw new Error(
          `Formato de imagen no permitido. Solo se permiten: ${ALLOWED_EXTENSIONS.join(', ')}`
        );
      }

      // Usar el MIME type correcto para el blob
      const mimeType = detectedMimeType;

      // Convertir base64 a blob
      const imageBlob = base64ToBlob(base64Image, mimeType);

      if (imageBlob.size === 0) {
        throw new Error('Generated blob is empty');
      }

      // Crear nombre de archivo si no se proporciona
      const finalFilename = `${filename}.${extension}` || `image_${Date.now()}.${extension}`;

      // Validar que el filename tenga una extensión válida
      const filenameExtension = finalFilename.split('.').pop()?.toLowerCase();
      if (!filenameExtension || !ALLOWED_EXTENSIONS.includes(filenameExtension)) {
        throw new Error(
          `Nombre de archivo inválido. Debe terminar en: ${ALLOWED_EXTENSIONS.join(', ')}`
        );
      }

      // Crear FormData
      const formData = new FormData();
      formData.append('file', imageBlob, finalFilename);

      // Subir a S3
      const axiosInstance = createAxiosInstance();

      const { data } = await axiosInstance.post('/media/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          setUploadProgress(percentCompleted);
        },
      });
      return data.s3Url;
    } catch (error) {
      // Log más detalles del error
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }

      throw new Error('Failed to upload image');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return {
    uploadImageToS3,
    uploading,
    uploadProgress,
  };
};

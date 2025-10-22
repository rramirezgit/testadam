import type { PixelCrop } from 'react-image-crop';

export function imgPreview(
  image: HTMLImageElement,
  crop: PixelCrop,
  scale = 1,
  rotate = 0
): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('No 2d context');
  }

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  const pixelRatio = window.devicePixelRatio;

  canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
  canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

  ctx.scale(pixelRatio, pixelRatio);
  ctx.imageSmoothingQuality = 'high';

  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;

  const rotateRads = (rotate * Math.PI) / 180;
  const centerX = image.naturalWidth / 2;
  const centerY = image.naturalHeight / 2;

  ctx.save();

  // 5) Move the crop origin to the canvas origin (0,0)
  ctx.translate(-cropX, -cropY);
  // 4) Move the origin to the center of the original position
  ctx.translate(centerX, centerY);
  // 3) Rotate around the origin
  ctx.rotate(rotateRads);
  // 2) Scale the image
  ctx.scale(scale, scale);
  // 1) Move the center of the image to the origin (0,0)
  ctx.translate(-centerX, -centerY);
  ctx.drawImage(
    image,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight
  );

  ctx.restore();

  return canvas.toDataURL('image/webp', 0.9);
}

/**
 * Valida que el tamaño del archivo sea razonable para la web
 * Límite: 1MB
 */
export function validateFileSize(file: File): { valid: boolean; sizeMB: number } {
  const MAX_SIZE_MB = 1;
  const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
  const sizeMB = file.size / (1024 * 1024);

  return {
    valid: file.size <= MAX_SIZE_BYTES,
    sizeMB: parseFloat(sizeMB.toFixed(2)),
  };
}

/**
 * Convierte cualquier imagen (JPG, PNG) a formato WebP
 * GIFs se mantienen como GIF para preservar animaciones
 * Preserva transparencia en PNGs
 */
export function convertImageToWebP(imageFile: File, quality: number = 0.9): Promise<string> {
  return new Promise((resolve, reject) => {
    // Si es GIF, no convertir (preservar animación)
    if (imageFile.type === 'image/gif') {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = () => reject(new Error('Error reading GIF'));
      reader.readAsDataURL(imageFile);
      return;
    }

    // Para JPG, PNG, WebP → convertir a WebP
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('No 2d context'));
          return;
        }

        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        // Importante: NO hacer fillRect para preservar transparencia
        ctx.drawImage(img, 0, 0);

        // Convertir a WebP
        const webpBase64 = canvas.toDataURL('image/webp', quality);
        resolve(webpBase64);
      };

      img.onerror = () => reject(new Error('Error loading image'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Error reading file'));
    reader.readAsDataURL(imageFile);
  });
}

export function base64ToBlob(base64: string, mimeType: string): Blob {
  const byteCharacters = atob(base64.split(',')[1]);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i += 1) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}

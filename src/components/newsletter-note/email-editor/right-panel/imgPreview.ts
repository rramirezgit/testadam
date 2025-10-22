import type { PixelCrop } from 'react-image-crop';

/**
 * Detecta si un canvas tiene transparencia verificando el canal alpha
 */
function hasTransparency(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): boolean {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Verificar cada píxel del canal alpha (cada 4to valor)
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] < 255) {
      return true; // Encontró transparencia
    }
  }
  return false;
}

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

  // Detectar transparencia y elegir formato óptimo
  const hasAlpha = hasTransparency(ctx, canvas);
  return hasAlpha ? canvas.toDataURL('image/png') : canvas.toDataURL('image/webp', 0.9);
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
 * Convierte cualquier imagen al formato óptimo
 * - GIFs se mantienen como GIF para preservar animaciones
 * - PNG si la imagen tiene transparencia (mejor compatibilidad en correos)
 * - WebP si no tiene transparencia (mejor compresión)
 */
export function convertImageToOptimalFormat(
  imageFile: File,
  quality: number = 0.9
): Promise<string> {
  return new Promise((resolve, reject) => {
    // Si es GIF, no convertir (preservar animación)
    if (imageFile.type === 'image/gif') {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = () => reject(new Error('Error reading GIF'));
      reader.readAsDataURL(imageFile);
      return;
    }

    // Para JPG, PNG, WebP → convertir a formato óptimo
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

        // Detectar transparencia y elegir formato
        const hasAlpha = hasTransparency(ctx, canvas);

        // PNG si tiene transparencia (mejor para correos), WebP si no
        const result = hasAlpha
          ? canvas.toDataURL('image/png')
          : canvas.toDataURL('image/webp', quality);

        resolve(result);
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

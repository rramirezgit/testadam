import { useRef } from 'react';
import Image from 'next/image';

import ComponentWithToolbar from './ComponentWithToolbar';

import type { EmailComponentProps } from './types';

interface ImageComponentData {
  src?: string;
  alt?: string;
}

interface ImageUploaderProps {
  data: ImageComponentData;
  onUpdate: (id: string, props: Record<string, any>) => void;
  componentId: string;
}

const ImageUploader = ({ data, onUpdate, componentId }: ImageUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Verificar el tipo de archivo
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      alert(
        'Tipo de archivo no válido. Por favor selecciona una imagen PNG, JPG, JPEG, WEBP o GIF.'
      );
      return;
    }

    // Convertir a base64
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      onUpdate(componentId, { src: base64String, alt: file.name });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="image-component-wrapper">
      {data.src ? (
        <img
          src={data.src}
          alt={data.alt || 'Newsletter image'}
          style={{
            maxWidth: '100%',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
          onClick={handleImageClick}
        />
      ) : (
        <div
          onClick={handleImageClick}
          style={{
            height: '270px',
            borderRadius: '8px',
            backgroundColor: 'rgba(145, 158, 171, 0.12)',
            textAlign: 'center',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 2,
            color: 'rgba(145, 158, 171, 0.94)',
          }}
        >
          <Image src="/assets/icons/apps/ic-empty.svg" alt="Imagen" width={40} height={40} />
          <p>Haz clic para seleccionar una imagen</p>
        </div>
      )}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
        onChange={handleFileChange}
      />
    </div>
  );
};

const ImageComponent = ({
  component,
  index,
  isSelected,
  onSelect,
  updateComponentProps,
  moveComponent,
  removeComponent,
  totalComponents,
}: EmailComponentProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
  };

  return (
    <ComponentWithToolbar
      isSelected={isSelected}
      index={index}
      totalComponents={totalComponents}
      componentId={component.id}
      moveComponent={moveComponent}
      removeComponent={removeComponent}
      onClick={handleClick}
    >
      <ImageUploader
        data={component.props || {}}
        onUpdate={updateComponentProps}
        componentId={component.id}
      />
    </ComponentWithToolbar>
  );
};

export default ImageComponent;

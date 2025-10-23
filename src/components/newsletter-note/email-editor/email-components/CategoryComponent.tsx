import { Box } from '@mui/material';

import Categorias from '../components/Categorias';
import ComponentWithToolbar from './ComponentWithToolbar';

import type { Categoria, EmailComponentProps } from './types';

const CategoryComponent = ({
  component,
  index,
  isSelected,
  onSelect,
  updateComponentProps,
  moveComponent,
  removeComponent,
  totalComponents,
}: EmailComponentProps) => {
  // Convertir el color único a un array de categorías
  const convertCategoryProps = (): Categoria[] => {
    // Si ya tenemos un array de categorías, usarlo
    if (component.props?.categorias) {
      return component.props.categorias;
    }

    // Si no, crear uno con el valor actual
    return [
      {
        id: `cat-${Date.now()}`,
        texto: component.content,
        colorFondo: component.props?.color || '#4caf50',
        colorTexto: component.props?.textColor || '#ffffff',
      },
    ];
  };

  const categorias = convertCategoryProps();

  const handleCategoriasChange = (nuevasCategorias: Categoria[]) => {
    updateComponentProps(component.id, { categorias: nuevasCategorias });
  };

  const handleCategoriaUpdate = (catId: string, field: keyof Categoria, value: string) => {
    const nuevasCategorias = categorias.map((cat) =>
      cat.id === catId ? { ...cat, [field]: value } : cat
    );
    updateComponentProps(component.id, { categorias: nuevasCategorias });
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
  };

  return (
    <Box onClick={handleClick}>
      <ComponentWithToolbar
        isSelected={isSelected}
        index={index}
        totalComponents={totalComponents}
        componentId={component.id}
        moveComponent={moveComponent}
        removeComponent={removeComponent}
        onClick={handleClick}
      >
        <Categorias
          categorias={categorias}
          onCategoriasChange={handleCategoriasChange}
          onCategoriaUpdate={handleCategoriaUpdate}
          editable={isSelected}
          borderRadius={component.props?.borderRadius ?? 16}
          padding={component.props?.padding ?? 4}
          fontSize={component.props?.fontSize ?? 14}
          fontWeight={component.props?.fontWeight ?? 500}
        />
      </ComponentWithToolbar>
    </Box>
  );
};

export default CategoryComponent;

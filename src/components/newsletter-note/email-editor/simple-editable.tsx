import React, { useRef, useState, useEffect } from 'react';

interface SimpleEditableProps {
  value: string;
  onChange: (value: string) => void;
  style?: React.CSSProperties;
  listStyle?: string;
  listColor?: string;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  'data-list-item'?: string;
  isPlaceholder?: boolean;
  placeholderColor?: string;
}

const SimpleEditable: React.FC<SimpleEditableProps> = ({
  value,
  onChange,
  style,
  listStyle,
  listColor,
  onKeyDown,
  isPlaceholder = false,
  placeholderColor = '#9CA3AF',
  ...props
}) => {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);

  useEffect(() => {
    setText(value);
  }, [value]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();

      // Si hay una posición de cursor guardada, restaurarla
      if (cursorPosition !== null && inputRef.current) {
        inputRef.current.selectionStart = cursorPosition;
        inputRef.current.selectionEnd = cursorPosition;
        setCursorPosition(null);
      }
    }
  }, [editing, cursorPosition]);

  const handleBlur = () => {
    setEditing(false);
    onChange(text);
  };

  const shouldApplyPlaceholderColor =
    isPlaceholder &&
    !listColor &&
    !(style && typeof style.color === 'string' && style.color.trim().length > 0);

  // Aplicar estilos específicos de lista si se proporcionan
  const combinedStyle = {
    ...style,
    ...(listStyle && { listStyleType: listStyle }),
    ...(listColor && { color: listColor }),
    ...(shouldApplyPlaceholderColor && { color: placeholderColor }),
  };

  return editing ? (
    <input
      ref={inputRef}
      type="text"
      value={text}
      onChange={(e) => setText(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={(e) => {
        // Guardar la posición del cursor antes de cualquier acción
        if (inputRef.current) {
          setCursorPosition(inputRef.current.selectionStart);
        }

        if (e.key === 'Enter' && !e.shiftKey) {
          if (onKeyDown) {
            onKeyDown(e);
          } else {
            handleBlur();
          }
        } else if (e.key === 'Backspace') {
          if (onKeyDown) {
            onKeyDown(e);
          }
        } else if (onKeyDown) {
          onKeyDown(e);
        }
      }}
      style={{
        ...combinedStyle,
        border: 'none',
        background: 'transparent',
        fontFamily: 'inherit',
        fontSize: 'inherit',
        width: '100%',
      }}
      {...props}
    />
  ) : (
    <span
      onClick={() => setEditing(true)}
      style={{
        ...combinedStyle,
        cursor: 'text',
        display: 'inline-block',
        minHeight: '1.2em', // Asegurar que los elementos vacíos tengan altura
      }}
      {...props}
    >
      {text || <span style={{ opacity: 0.5 }}>Escribir aquí...</span>}
    </span>
  );
};

export default SimpleEditable;

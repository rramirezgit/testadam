'use client';

import * as React from 'react';

import { cn } from 'src/lib/utils';

const toggleVariants = {
  variant: {
    default: 'bg-transparent hover:bg-gray-100 data-[state=on]:bg-gray-200',
    outline: 'border border-gray-300 bg-transparent hover:bg-gray-100 data-[state=on]:bg-gray-200',
  },
  size: {
    default: 'h-10 px-3',
    sm: 'h-9 px-2.5',
    lg: 'h-11 px-5',
  },
};

export interface ToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof toggleVariants.variant;
  size?: keyof typeof toggleVariants.size;
  pressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
}

const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  (
    { className, variant = 'default', size = 'default', pressed, onPressedChange, ...props },
    ref
  ) => {
    const [isPressed, setIsPressed] = React.useState(pressed || false);

    const handleClick = () => {
      const newPressed = !isPressed;
      setIsPressed(newPressed);
      onPressedChange?.(newPressed);
    };

    React.useEffect(() => {
      if (pressed !== undefined) {
        setIsPressed(pressed);
      }
    }, [pressed]);

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          toggleVariants.variant[variant],
          toggleVariants.size[size],
          isPressed && 'bg-gray-200',
          className
        )}
        onClick={handleClick}
        data-state={isPressed ? 'on' : 'off'}
        {...props}
      />
    );
  }
);
Toggle.displayName = 'Toggle';

export { Toggle, toggleVariants };

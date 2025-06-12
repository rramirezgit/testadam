'use client';

import * as React from 'react';

import { cn } from 'src/lib/utils';

interface DrawerContextType {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DrawerContext = React.createContext<DrawerContextType | null>(null);

const useDrawer = () => {
  const context = React.useContext(DrawerContext);
  if (!context) {
    throw new Error('useDrawer must be used within a Drawer');
  }
  return context;
};

interface DrawerProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  shouldScaleBackground?: boolean;
}

const Drawer = ({
  children,
  open = false,
  onOpenChange,
  shouldScaleBackground = true,
}: DrawerProps) => {
  const [isOpen, setIsOpen] = React.useState(open);

  const handleOpenChange = React.useCallback(
    (newOpen: boolean) => {
      setIsOpen(newOpen);
      onOpenChange?.(newOpen);
    },
    [onOpenChange]
  );

  React.useEffect(() => {
    setIsOpen(open);
  }, [open]);

  return (
    <DrawerContext.Provider value={{ open: isOpen, onOpenChange: handleOpenChange }}>
      {children}
    </DrawerContext.Provider>
  );
};
Drawer.displayName = 'Drawer';

const DrawerTrigger = React.forwardRef<HTMLButtonElement, React.ComponentProps<'button'>>(
  ({ className, onClick, ...props }, ref) => {
    const { onOpenChange } = useDrawer();

    return (
      <button
        ref={ref}
        className={className}
        onClick={(e) => {
          onClick?.(e);
          onOpenChange(true);
        }}
        {...props}
      />
    );
  }
);
DrawerTrigger.displayName = 'DrawerTrigger';

const DrawerPortal = ({ children }: { children: React.ReactNode }) => <>{children}</>;

const DrawerClose = React.forwardRef<HTMLButtonElement, React.ComponentProps<'button'>>(
  ({ className, onClick, ...props }, ref) => {
    const { onOpenChange } = useDrawer();

    return (
      <button
        ref={ref}
        className={className}
        onClick={(e) => {
          onClick?.(e);
          onOpenChange(false);
        }}
        {...props}
      />
    );
  }
);
DrawerClose.displayName = 'DrawerClose';

const DrawerOverlay = React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('fixed inset-0 z-50 bg-black/80', className)} {...props} />
  )
);
DrawerOverlay.displayName = 'DrawerOverlay';

const DrawerContent = React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
  ({ className, children, ...props }, ref) => {
    const { open, onOpenChange } = useDrawer();

    if (!open) return null;

    return (
      <DrawerPortal>
        <DrawerOverlay onClick={() => onOpenChange(false)} />
        <div
          ref={ref}
          className={cn(
            'fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-white',
            'animate-in slide-in-from-bottom-80 duration-200',
            className
          )}
          {...props}
        >
          <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-gray-300" />
          {children}
        </div>
      </DrawerPortal>
    );
  }
);
DrawerContent.displayName = 'DrawerContent';

const DrawerHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('grid gap-1.5 p-4 text-center sm:text-left', className)} {...props} />
);
DrawerHeader.displayName = 'DrawerHeader';

const DrawerFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('mt-auto flex flex-col gap-2 p-4', className)} {...props} />
);
DrawerFooter.displayName = 'DrawerFooter';

const DrawerTitle = React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('text-lg font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  )
);
DrawerTitle.displayName = 'DrawerTitle';

const DrawerDescription = React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('text-sm text-gray-600', className)} {...props} />
  )
);
DrawerDescription.displayName = 'DrawerDescription';

export {
  Drawer,
  DrawerClose,
  DrawerTitle,
  DrawerPortal,
  DrawerHeader,
  DrawerFooter,
  DrawerOverlay,
  DrawerTrigger,
  DrawerContent,
  DrawerDescription,
};

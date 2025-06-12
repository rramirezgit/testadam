'use client';

import * as React from 'react';

interface ToasterProps {
  theme?: 'light' | 'dark' | 'system';
  className?: string;
  toastOptions?: any;
}

const Toaster = ({ theme = 'system', className, ...props }: ToasterProps) => (
  <div className={`toaster group ${className || ''}`} data-theme={theme} {...props}>
    {/* Simplified toaster without external dependencies */}
  </div>
);

export { Toaster };

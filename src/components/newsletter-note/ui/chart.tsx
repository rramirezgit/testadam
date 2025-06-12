'use client';

import * as React from 'react';

import { cn } from 'src/lib/utils';

const ChartContext = React.createContext<{ config: Record<string, any> } | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) {
    throw new Error('useChart must be used within a <ChartContainer />');
  }
  return context;
}

interface ChartConfig {
  [key: string]: {
    label?: string;
    color?: string;
  };
}

interface ChartContainerProps extends React.ComponentProps<'div'> {
  config: ChartConfig;
  children: React.ComponentProps<'div'>['children'];
}

const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ className, children, config, ...props }, ref) => (
    <ChartContext.Provider value={{ config }}>
      <div
        ref={ref}
        className={cn(
          'flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick-value]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke="#ccc"]]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke="#fff"]]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke="#ccc"]]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke="#ccc"]]:stroke-border [&_.recharts-sector[stroke="#fff"]]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none',
          className
        )}
        {...props}
      >
        {children}
      </div>
    </ChartContext.Provider>
  )
);
ChartContainer.displayName = 'ChartContainer';

const ChartTooltip = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    hideLabel?: boolean;
    hideIndicator?: boolean;
    indicator?: 'line' | 'dot' | 'dashed';
    nameKey?: string;
    labelKey?: string;
  }
>(({ className, hideLabel = false, hideIndicator = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl',
      className
    )}
    {...props}
  />
));
ChartTooltipContent.displayName = 'ChartTooltipContent';

const ChartLegend = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    hideIcon?: boolean;
    payload?: Array<any>;
    verticalAlign?: 'top' | 'bottom';
    nameKey?: string;
  }
>(({ className, hideIcon = false, payload, verticalAlign = 'bottom', nameKey, ...props }, ref) => {
  if (!payload?.length) {
    return null;
  }

  return (
    <div ref={ref} className={cn('flex items-center justify-center gap-4', className)} {...props}>
      {payload.map((item, index) => {
        const key = `${nameKey || item.dataKey || item.value || item.id || index}`;
        return (
          <div
            key={key}
            className="flex items-center gap-1.5 [&>svg]:size-3 [&>svg]:text-muted-foreground"
          >
            {!hideIcon && (
              <div
                className="size-2 shrink-0 rounded-[2px]"
                style={{ backgroundColor: item.color }}
              />
            )}
            {item.value}
          </div>
        );
      })}
    </div>
  );
});
ChartLegendContent.displayName = 'ChartLegendContent';

export { ChartLegend, ChartTooltip, ChartContainer, ChartLegendContent, ChartTooltipContent };

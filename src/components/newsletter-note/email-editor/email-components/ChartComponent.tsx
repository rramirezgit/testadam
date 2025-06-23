import { Box } from '@mui/material';

import ComponentWithToolbar from './ComponentWithToolbar';

import type { EmailComponentProps } from './types';

interface ChartData {
  label: string;
  value: number;
  color: string;
}

const ChartComponent = ({
  component,
  index,
  isSelected,
  onSelect,
  updateComponentProps,
  moveComponent,
  removeComponent,
  totalComponents,
}: EmailComponentProps) => {
  const chartType = component.props?.chartType || 'bar'; // 'bar' o 'pie'
  const title = component.props?.title || 'Título de la Gráfica';
  const data: ChartData[] = component.props?.data || [
    { label: 'Enero', value: 45, color: '#2196f3' },
    { label: 'Febrero', value: 30, color: '#4caf50' },
    { label: 'Marzo', value: 35, color: '#ff9800' },
    { label: 'Abril', value: 40, color: '#f44336' },
  ];
  const width = component.props?.width || 400;
  const height = component.props?.height || 300;
  const backgroundColor = component.props?.backgroundColor || '#ffffff';
  const titleColor = component.props?.titleColor || '#000000';
  const borderRadius = component.props?.borderRadius || 8;
  const padding = component.props?.padding || 20;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
  };

  // Función para generar gráfica de barras SVG
  const generateBarChart = () => {
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2 - 40; // Espacio para título
    const maxValue = Math.max(...data.map((d) => d.value));
    const barWidth = (chartWidth / data.length) * 0.8;
    const barSpacing = (chartWidth / data.length) * 0.2;

    return (
      <svg
        width={width}
        height={height}
        style={{ border: `1px solid #e0e0e0`, borderRadius: `${borderRadius}px` }}
      >
        {/* Fondo */}
        <rect width={width} height={height} fill={backgroundColor} rx={borderRadius} />

        {/* Título */}
        <text
          x={width / 2}
          y={30}
          textAnchor="middle"
          fontSize="16"
          fontWeight="bold"
          fill={titleColor}
        >
          {title}
        </text>

        {/* Barras */}
        {data.map((item, idx) => {
          const barHeight = (item.value / maxValue) * chartHeight;
          const x = padding + idx * (barWidth + barSpacing) + barSpacing / 2;
          const y = height - padding - barHeight;

          return (
            <g key={idx}>
              {/* Barra */}
              <rect x={x} y={y} width={barWidth} height={barHeight} fill={item.color} rx="4" />
              {/* Valor encima de la barra */}
              <text x={x + barWidth / 2} y={y - 5} textAnchor="middle" fontSize="12" fill="#333">
                {item.value}
              </text>
              {/* Etiqueta debajo */}
              <text
                x={x + barWidth / 2}
                y={height - 5}
                textAnchor="middle"
                fontSize="10"
                fill="#666"
              >
                {item.label}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  // Función para generar gráfica de torta SVG
  const generatePieChart = () => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - padding - 20;
    const total = data.reduce((sum, item) => sum + item.value, 0);

    let currentAngle = 0;

    return (
      <svg
        width={width}
        height={height}
        style={{ border: `1px solid #e0e0e0`, borderRadius: `${borderRadius}px` }}
      >
        {/* Fondo */}
        <rect width={width} height={height} fill={backgroundColor} rx={borderRadius} />

        {/* Título */}
        <text
          x={centerX}
          y={30}
          textAnchor="middle"
          fontSize="16"
          fontWeight="bold"
          fill={titleColor}
        >
          {title}
        </text>

        {/* Slices de la torta */}
        {data.map((item, idx) => {
          const sliceAngle = (item.value / total) * 360;
          const startAngle = currentAngle;
          const endAngle = currentAngle + sliceAngle;

          // Convertir ángulos a radianes
          const startRad = (startAngle * Math.PI) / 180;
          const endRad = (endAngle * Math.PI) / 180;

          // Calcular puntos del arco
          const x1 = centerX + radius * Math.cos(startRad);
          const y1 = centerY + radius * Math.sin(startRad);
          const x2 = centerX + radius * Math.cos(endRad);
          const y2 = centerY + radius * Math.sin(endRad);

          const largeArcFlag = sliceAngle > 180 ? 1 : 0;

          const pathData = [
            `M ${centerX} ${centerY}`,
            `L ${x1} ${y1}`,
            `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            'Z',
          ].join(' ');

          // Calcular posición del texto (porcentaje)
          const midAngle = startAngle + sliceAngle / 2;
          const textRadius = radius * 0.7;
          const textX = centerX + textRadius * Math.cos((midAngle * Math.PI) / 180);
          const textY = centerY + textRadius * Math.sin((midAngle * Math.PI) / 180);
          const percentage = Math.round((item.value / total) * 100);

          currentAngle += sliceAngle;

          return (
            <g key={idx}>
              {/* Slice */}
              <path d={pathData} fill={item.color} stroke="#fff" strokeWidth="2" />
              {/* Porcentaje */}
              {percentage >= 5 && (
                <text
                  x={textX}
                  y={textY}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="bold"
                  fill="#fff"
                >
                  {percentage}%
                </text>
              )}
            </g>
          );
        })}

        {/* Leyenda */}
        <g>
          {data.map((item, idx) => {
            const legendY = height - 80 + idx * 15;
            return (
              <g key={idx}>
                <rect x={20} y={legendY - 8} width={10} height={10} fill={item.color} rx="2" />
                <text x={35} y={legendY} fontSize="10" fill="#333">
                  {item.label}: {item.value}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    );
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
      <Box
        sx={{
          mb: 2,
          display: 'flex',
          justifyContent: 'center',
          ...(component.style || {}),
        }}
      >
        {chartType === 'bar' ? generateBarChart() : generatePieChart()}
      </Box>
    </ComponentWithToolbar>
  );
};

export default ChartComponent;

import type { EmailComponent } from 'src/types/saved-note';

import React, { useState } from 'react';

import {
  Box,
  Tab,
  Card,
  Tabs,
  Button,
  Slider,
  TextField,
  Typography,
  CardContent,
} from '@mui/material';

interface ChartOptionsProps {
  component: EmailComponent;
  updateComponentProps: (componentId: string, updates: Record<string, any>) => void;
}

interface ChartData {
  label: string;
  value: number;
  color: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, index, value, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`chart-tabpanel-${index}`}
      aria-labelledby={`chart-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const ChartOptions = ({ component, updateComponentProps }: ChartOptionsProps) => {
  const [tabValue, setTabValue] = useState(0);

  const chartType = component.props?.chartType || 'bar';
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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const updateProps = (updates: Record<string, any>) => {
    updateComponentProps(component.id, updates);
  };

  const addDataPoint = () => {
    const newData = [
      ...data,
      {
        label: `Elemento ${data.length + 1}`,
        value: 25,
        color: '#9c27b0',
      },
    ];
    updateProps({ data: newData });
  };

  const removeDataPoint = (index: number) => {
    if (data.length > 1) {
      const newData = data.filter((_, i) => i !== index);
      updateProps({ data: newData });
    }
  };

  const updateDataPoint = (index: number, field: keyof ChartData, value: string | number) => {
    const newData = [...data];
    newData[index] = { ...newData[index], [field]: value };
    updateProps({ data: newData });
  };

  const presetColors = [
    '#2196f3',
    '#4caf50',
    '#ff9800',
    '#f44336',
    '#9c27b0',
    '#00bcd4',
    '#ffeb3b',
    '#795548',
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs value={tabValue} onChange={handleTabChange} aria-label="chart options tabs">
        <Tab label="Datos" />
        <Tab label="Estilo" />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        {/* Tipo de gráfica */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Tipo de Gráfica
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant={chartType === 'bar' ? 'contained' : 'outlined'}
              onClick={() => updateProps({ chartType: 'bar' })}
            >
              📊 Barras
            </Button>
            <Button
              variant={chartType === 'pie' ? 'contained' : 'outlined'}
              onClick={() => updateProps({ chartType: 'pie' })}
            >
              🥧 Torta
            </Button>
          </Box>
        </Box>

        {/* Título */}
        <Box sx={{ mb: 3 }}>
          <TextField
            label="Título de la Gráfica"
            variant="outlined"
            fullWidth
            value={title}
            onChange={(e) => updateProps({ title: e.target.value })}
          />
        </Box>

        {/* Datos */}
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
          >
            <Typography variant="subtitle2">Datos ({data.length} elementos)</Typography>
            <Button variant="outlined" onClick={addDataPoint} size="small">
              ➕ Agregar
            </Button>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {data.map((item, index) => (
              <Card variant="outlined" key={index}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Typography variant="body2" sx={{ minWidth: 60 }}>
                      #{index + 1}
                    </Typography>
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        backgroundColor: item.color,
                        borderRadius: '50%',
                        border: '1px solid #ccc',
                      }}
                    />
                    {data.length > 1 && (
                      <Button
                        size="small"
                        color="error"
                        onClick={() => removeDataPoint(index)}
                        sx={{ ml: 'auto' }}
                      >
                        🗑️ Eliminar
                      </Button>
                    )}
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <TextField
                      label="Etiqueta"
                      variant="outlined"
                      size="small"
                      value={item.label}
                      onChange={(e) => updateDataPoint(index, 'label', e.target.value)}
                      sx={{ flex: 1 }}
                    />
                    <TextField
                      label="Valor"
                      variant="outlined"
                      size="small"
                      type="number"
                      value={item.value}
                      onChange={(e) => updateDataPoint(index, 'value', Number(e.target.value))}
                      sx={{ width: 80 }}
                    />
                  </Box>

                  {/* Colores predefinidos */}
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Color:
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {presetColors.map((color) => (
                        <Box
                          key={color}
                          sx={{
                            width: 24,
                            height: 24,
                            backgroundColor: color,
                            borderRadius: '50%',
                            cursor: 'pointer',
                            border: item.color === color ? '3px solid #000' : '1px solid #ccc',
                          }}
                          onClick={() => updateDataPoint(index, 'color', color)}
                        />
                      ))}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {/* Dimensiones */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Dimensiones
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Ancho"
              variant="outlined"
              size="small"
              type="number"
              value={width}
              onChange={(e) => updateProps({ width: Number(e.target.value) })}
              InputProps={{ inputProps: { min: 200, max: 800 } }}
            />
            <TextField
              label="Alto"
              variant="outlined"
              size="small"
              type="number"
              value={height}
              onChange={(e) => updateProps({ height: Number(e.target.value) })}
              InputProps={{ inputProps: { min: 200, max: 600 } }}
            />
          </Box>
        </Box>

        {/* Bordes y espaciado */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Bordes Redondeados: {borderRadius}px
          </Typography>
          <Slider
            value={borderRadius}
            onChange={(_, value) => updateProps({ borderRadius: value })}
            min={0}
            max={20}
            marks={[
              { value: 0, label: '0' },
              { value: 5, label: '5' },
              { value: 10, label: '10' },
              { value: 20, label: '20' },
            ]}
            valueLabelDisplay="auto"
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Padding Interno: {padding}px
          </Typography>
          <Slider
            value={padding}
            onChange={(_, value) => updateProps({ padding: value })}
            min={10}
            max={40}
            marks={[
              { value: 10, label: '10' },
              { value: 20, label: '20' },
              { value: 30, label: '30' },
              { value: 40, label: '40' },
            ]}
            valueLabelDisplay="auto"
          />
        </Box>
      </TabPanel>
    </Box>
  );
};

export default ChartOptions;

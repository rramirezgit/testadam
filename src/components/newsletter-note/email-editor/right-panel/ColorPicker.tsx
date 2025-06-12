import { TextField, Typography } from '@mui/material';

interface ColorPickerProps {
  label: string;
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ColorPicker = ({ label, name, value, onChange }: ColorPickerProps) => (
  <>
    <Typography variant="body2" gutterBottom>
      {label}
    </Typography>
    <TextField
      name={name}
      type="color"
      value={value}
      onChange={onChange}
      fullWidth
      size="small"
      sx={{ mb: 2 }}
    />
  </>
);

export default ColorPicker;

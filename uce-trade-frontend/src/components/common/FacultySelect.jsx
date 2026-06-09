import { TextField, MenuItem } from '@mui/material';
import { FACULTIES } from '../../data/faculties';

const FacultySelect = ({ register, errors, defaultValue = "", sx = {} }) => {
  return (
    <TextField
      select
      label="College / Major"
      fullWidth
      variant="outlined"
      defaultValue={defaultValue}
      {...register("faculty")}
      error={!!errors.faculty}
      helperText={errors.faculty?.message}
      sx={{ 
        mb: 2, 
        '& .MuiOutlinedInput-root': { borderRadius: '8px', bgcolor: '#f9fafb' },
        ...sx
      }}
    >
      {FACULTIES.map((opt) => (
        <MenuItem key={opt} value={opt}>
          {opt}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default FacultySelect;
import { Grid, TextField, MenuItem, InputAdornment } from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

export const VENTURE_CATEGORIES = ['Tutorials', 'Food', 'Design', 'Technology', 'Clothes', 'Photography', 'Other'];

const VentureFormFields = ({ register, errors, variant = 'standard' }) => {
  const inputStyle = variant === 'fancy' 
    ? { '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#f9fafb' } } 
    : {};

  return (
    <>
      <Grid size={{ xs: 12 }}> 
        <TextField 
          fullWidth label="Service Title" placeholder="e.g., Math Tutorials" variant="outlined" 
          {...register("title")} error={!!errors.title} helperText={errors.title?.message}
          sx={inputStyle} 
        />
      </Grid>
      
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField 
          select fullWidth label="Category" defaultValue=""
          {...register("category")} error={!!errors.category} helperText={errors.category?.message}
          sx={inputStyle}
        >
          {VENTURE_CATEGORIES.map((option) => (<MenuItem key={option} value={option}>{option}</MenuItem>))}
        </TextField>
      </Grid>
      
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField 
          fullWidth label="Price" type="number" placeholder="0.00" 
          {...register("price")} error={!!errors.price} helperText={errors.price?.message}
          InputProps={{ startAdornment: <InputAdornment position="start"><AttachMoneyIcon fontSize="small" /></InputAdornment> }}
          sx={inputStyle}
        />
      </Grid>
      
      <Grid size={{ xs: 12 }}>
        <TextField 
          fullWidth label="Description" multiline rows={4} placeholder="Describe what you offer..."
          {...register("description")} error={!!errors.description} helperText={errors.description?.message}
          sx={inputStyle}
        />
      </Grid>
    </>
  );
};

export default VentureFormFields;
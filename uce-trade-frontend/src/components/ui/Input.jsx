// src/components/ui/Input.jsx
import { TextField } from '@mui/material';
import { forwardRef } from 'react'; 

const Input = forwardRef(({ label, type = "text", ...props }, ref) => {
  return (
    <TextField
      inputRef={ref} 
      label={label}
      type={type}
      fullWidth
      variant="outlined"
      InputLabelProps={{ shrink: true }}
      sx={{
        mb: 2, 
        '& .MuiOutlinedInput-root': {
          borderRadius: '8px', 
          bgcolor: '#f9fafb',  
          '&:hover fieldset': {
            borderColor: 'primary.main',
          },
        },
        '& .MuiInputLabel-root': {
          color: 'text.secondary',
        }
      }}
      {...props} 
    />
  );
});

Input.displayName = "Input";

export default Input;
// src/components/ui/Button.jsx
import { Button as MuiButton } from '@mui/material';

const Button = ({ children, variant = 'contained', color = 'primary', sx, ...props }) => {

  const gradientStyle = variant === 'gradient' ? {
    background: (theme) => `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
    color: 'white',
    boxShadow: '0 4px 10px rgba(13, 33, 73, 0.2)',
    '&:hover': {
      background: (theme) => `linear-gradient(90deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
      boxShadow: '0 6px 15px rgba(13, 33, 73, 0.3)',
      transform: 'translateY(-1px)'
    }
  } : {};

  const secondaryStyle = color === 'secondary' && variant === 'contained' ? {
    backgroundColor: '#efb034',
    color: '#0d2149',
    fontWeight: 'bold',
    '&:hover': { backgroundColor: '#f0b94e' }
  } : {};

  return (
    <MuiButton
      variant={variant === 'gradient' ? 'contained' : variant}
      color={variant === 'gradient' ? 'primary' : color}
      sx={{ 
        borderRadius: '8px', 
        textTransform: 'none',
        fontWeight: 600,
        px: 3,
        ...gradientStyle,
        ...secondaryStyle,
        ...sx 
      }}
      {...props}
    >
      {children}
    </MuiButton>
  );
};

export default Button;
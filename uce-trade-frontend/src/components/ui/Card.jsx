import { Paper } from '@mui/material';

const Card = ({ children, noPadding = false, hover = false, ...props }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: noPadding ? 0 : { xs: 3, md: 4 },
        borderRadius: '24px',
        border: '1px solid #e5e7eb',
        bgcolor: 'white',
        transition: 'all 0.3s ease',
        '&:hover': hover ? {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 24px -4px rgba(0, 0, 0, 0.08)',
          borderColor: '#d1d5db'
        } : {},
        ...props.sx
      }}
      {...props}
    >
      {children}
    </Paper>
  );
};
export default Card;
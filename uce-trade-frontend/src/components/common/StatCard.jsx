import { Paper, Box, Typography } from '@mui/material';

const StatCard = ({ title, value, badge, icon, color }) => {
  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 3, 
        borderRadius: '20px', 
        border: '1px solid #e5e7eb', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        height: '100%',
        transition: 'transform 0.2s',
        '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
        }
      }}
    >
      <Box display="flex" flexDirection="column">
        <Typography variant="body2" color="text.secondary" fontWeight="600" mb={0.5}>
            {title}
        </Typography>
        
        <Typography variant="h4" fontWeight="800" color="#0d2149">
            {value}
        </Typography>
        
        {badge && (
            <Typography variant="caption" fontWeight="bold" sx={{ color: color, mt: 0.5 }}>
                {badge}
            </Typography>
        )}
      </Box>

      {/* Lado Derecho: Icono con fondo de color y sombra */}
      <Box sx={{ 
          bgcolor: color, 
          p: 1.5, 
          borderRadius: '16px', 
          display: 'flex', 
          color: 'white', 
          boxShadow: `0 4px 12px ${color}40` 
      }}>
        {icon}
      </Box>
    </Paper>
  );
};

export default StatCard;
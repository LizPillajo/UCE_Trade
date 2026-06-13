import { Box, Typography } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox'; // Icono por defecto

const EmptyState = ({ title, subtitle, icon, sx }) => {
  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center" 
      py={6}
      textAlign="center"
      sx={{ opacity: 0.7, ...sx }}
    >
      <Box sx={{ bgcolor: '#f3f4f6', p: 2, borderRadius: '50%', mb: 2, color: '#9ca3af' }}>
        {icon || <InboxIcon sx={{ fontSize: 40 }} />}
      </Box>
      <Typography variant="h6" fontWeight="bold" color="text.primary">
        {title || "No data found"}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary" maxWidth={300}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};

export default EmptyState;
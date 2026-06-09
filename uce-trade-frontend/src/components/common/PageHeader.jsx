import { Box, Typography } from '@mui/material';

const PageHeader = ({ title, subtitle, action, mb = 4 }) => {
  return (
    <Box 
      mb={mb} 
      display="flex" 
      justifyContent="space-between" 
      alignItems={{ xs: 'flex-start', sm: 'center' }}
      flexDirection={{ xs: 'column', sm: 'row' }}
      gap={2}
    >
      <Box>
        <Typography variant="h4" fontWeight="800" color="#0d2149" sx={{ mb: 0.5 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body1" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
      
      {/* Si hay botones a la derecha (ej: Export, New Product), se renderizan aquí */}
      {action && (
        <Box>
            {action}
        </Box>
      )}
    </Box>
  );
};

export default PageHeader;
import { Box, Container, Typography } from '@mui/material';

const PageLayout = ({ children, title, subtitle, actions, breadcrumbs }) => {
  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', pt: { xs: 10, sm: 12 }, pb: 8 }}>
      <Container maxWidth="xl">
        
        {/* NUEVO: Zona de Navegación superior (ej: Botón Back) */}
        {breadcrumbs && (
            <Box mb={2}>
                {breadcrumbs}
            </Box>
        )}

        {/* Header Principal */}
        {(title || actions) && (
            <Box mb={5} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
                <Box>
                    {title && (
                        <Typography variant="h4" fontWeight="800" color="#0d2149">
                            {title}
                        </Typography>
                    )}
                    {subtitle && (
                        <Typography variant="body1" color="text.secondary">
                            {subtitle}
                        </Typography>
                    )}
                </Box>
                
                {/* Botones de acción principales (ej: Exportar, Nuevo) */}
                {actions && (
                    <Box display="flex" gap={2} alignItems="center">
                        {actions}
                    </Box>
                )}
            </Box>
        )}

        {children}
      </Container>
    </Box>
  );
};

export default PageLayout;
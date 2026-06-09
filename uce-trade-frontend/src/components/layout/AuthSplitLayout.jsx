import { Grid, Container, Box, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AuthBluePanel from '../auth/AuthBluePanel';

/**
 * @param {string} panelPosition - 'left' para Register, 'right' para Login
 * @param {string} title - Título del panel azul
 * @param {string} subtitle - Subtítulo del panel azul
 * @param {ReactNode} children - El formulario
 */
const AuthSplitLayout = ({ panelPosition = 'right', title, subtitle, children }) => {
  const isPanelLeft = panelPosition === 'left';

  // Componente del Panel Azul
  const BluePanelGrid = (
    <Grid size={{ xs: 12, md: 6 }} 
      sx={{ 
        display: { xs: 'none', md: 'flex' }, 
        p: 0, 
        minHeight: '100vh', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}
    >
      <AuthBluePanel title={title} subtitle={subtitle} />
    </Grid>
  );

  return (
    <Grid container sx={{ minHeight: "100vh", width: "100%", m: 0, alignItems: "stretch" }}>
      
      {/* Si el panel va a la izquierda, renderíza primero */}
      {isPanelLeft && BluePanelGrid}

      {/* ZONA DEL FORMULARIO */}
      <Grid size={{ xs: 12, md: 6 }} 
        sx={{ 
          bgcolor: isPanelLeft ? 'white' : '#f8fafc', 
          p: { xs: 4, md: 6 }, 
          display: "flex", 
          flexDirection: "column", 
          justifyContent: "center", 
          px: { xs: 4, md: 10 }, 
          minHeight: "100vh" 
        }}
      >
        <Container maxWidth="sm">
          <Box mb={6}>
            <Link component={RouterLink} to="/" underline="none" sx={{ display: "flex", alignItems: "center", color: "text.secondary", fontSize: "0.875rem" }}>
              <ArrowBackIcon sx={{ fontSize: 16, mr: 1 }} /> Back to home
            </Link>
          </Box>

          {children}
        </Container>
      </Grid>

      {/* Si el panel va a la derecha, renderíza al final */}
      {!isPanelLeft && BluePanelGrid}
      
    </Grid>
  );
};

export default AuthSplitLayout;
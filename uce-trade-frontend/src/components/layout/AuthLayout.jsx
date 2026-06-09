// src/components/layout/AuthLayout.jsx
import { Box, Paper, Container, Typography } from '@mui/material';
import { Link as RouterLink, Outlet } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';

const AuthLayout = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // The exact blue gradient from your wireframes
        background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
        p: 2
      }}
    >
      <Container maxWidth="sm">
        {/* Header (Logo and Text) outside the card */}
        <Box textAlign="center" mb={4} color="white">
          <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
            <SchoolIcon sx={{ fontSize: 40, color: '#efb034', mr: 1 }} />
            <Typography variant="h4" fontWeight="bold">UCE Market</Typography>
          </Box>
          <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
            University Community
          </Typography>
        </Box>

        {/* Centered White Card */}
        <Paper
          elevation={10}
          sx={{
            p: { xs: 3, md: 5 }, // Padding responsive
            borderRadius: '16px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}
        >
          {/* LOGIN OR REGISTER WILL BE LOADED HERE */}
          <Outlet />
        </Paper>

        {/* Back link */}
        <Box textAlign="center" mt={3}>
          <Typography 
            component={RouterLink} 
            to="/" 
            sx={{ color: 'white', opacity: 0.7, textDecoration: 'none', '&:hover': { opacity: 1 } }}
          >
            ← Back to Home
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default AuthLayout;
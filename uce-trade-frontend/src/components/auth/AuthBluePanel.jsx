// src/components/auth/AuthBluePanel.jsx
import { Box, Typography } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';

const AuthBluePanel = ({ title, subtitle }) => {
  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        bgcolor: '#0d2149', 
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        p: 4,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Graduation Cap Icon */}
      <Box 
        sx={{ 
          bgcolor: 'rgba(255,255,255,0.1)', 
          p: 3, 
          borderRadius: '16px',
          mb: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <SchoolIcon sx={{ fontSize: 60, color: 'white' }} />
      </Box>

      <Typography variant="h4" fontWeight="800" gutterBottom sx={{ maxWidth: '400px' }}>
        {title}
      </Typography>
      
      <Typography variant="body1" sx={{ opacity: 0.8, maxWidth: '350px', lineHeight: 1.6 }}>
        {subtitle}
      </Typography>

      {/* Background decoration (subtle circles) */}
      <Box sx={{ 
          position: 'absolute', top: -50, right: -50, width: 200, height: 200, 
          borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.03)' 
      }} />
      <Box sx={{ 
          position: 'absolute', bottom: -100, left: -50, width: 300, height: 300, 
          borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.03)' 
      }} />
    </Box>
  );
};

export default AuthBluePanel;

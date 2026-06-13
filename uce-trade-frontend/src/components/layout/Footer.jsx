// src/components/layout/Footer.jsx
import { Box, Container, Grid, Typography, IconButton, Stack } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';

const Footer = () => {
  return (
    <Box sx={{ bgcolor: '#0d2149', color: 'white', py: 8, mt: 'auto' }}>
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box display="flex" alignItems="center" mb={2}>
                <SchoolIcon sx={{ color: '#efb034', mr: 1, fontSize: 30 }} />
                <Typography variant="h6" fontWeight="bold">UCE Trade</Typography>
            </Box>
            <Typography variant="body2" sx={{ opacity: 0.7, maxWidth: 300 }}>
              The official platform for student entrepreneurship at the Central University of Ecuador.
            </Typography>
          </Grid>
          
          <Grid size={{ xs: 6, md: 2 }}>
            <Typography variant="subtitle2" fontWeight="bold" mb={2}>Platform</Typography>
            <Stack spacing={1} sx={{ opacity: 0.7 }}>
                <Typography variant="body2">Home</Typography>
                <Typography variant="body2">Explore</Typography>
                <Typography variant="body2">Login</Typography>
            </Stack>
          </Grid>

          <Grid size={{ xs: 6, md: 2 }}>
            <Typography variant="subtitle2" fontWeight="bold" mb={2}>Support</Typography>
            <Stack spacing={1} sx={{ opacity: 0.7 }}>
                <Typography variant="body2">Help Center</Typography>
                <Typography variant="body2">Safety</Typography>
                <Typography variant="body2">Terms of Service</Typography>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="subtitle2" fontWeight="bold" mb={2}>Follow us</Typography>
            <Box>
                <IconButton sx={{ color: 'white' }}><FacebookIcon /></IconButton>
                <IconButton sx={{ color: 'white' }}><TwitterIcon /></IconButton>
                <IconButton sx={{ color: 'white' }}><InstagramIcon /></IconButton>
            </Box>
            <Typography variant="caption" sx={{ opacity: 0.5, mt: 2, display: 'block' }}>
                © 2024 UCE Trade. All rights reserved.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
export default Footer;

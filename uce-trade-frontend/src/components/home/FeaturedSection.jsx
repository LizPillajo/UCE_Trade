import { Box, Container, Typography, Grid, Alert } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { fetchFeaturedServices } from '../../services/api'; 
import VentureCard from '../ventures/VentureCard';
import { VentureCardSkeleton } from '../ui/Skeletons';

const FeaturedSection = () => {
  const { data: ventures, isLoading, isError } = useQuery({
    queryKey: ['featuredVentures'],
    queryFn: fetchFeaturedServices, 
  });

  const validVentures = Array.isArray(ventures) ? ventures : (ventures?.content || []);

  return (
    <Box component="section" sx={{ py: { xs: 4, md: 6 }, bgcolor: 'white' }}>
      <Container maxWidth="xl">
        <Box mb={4}>
            <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">Highlights of the week</Typography>
            <Typography variant="body1" color="text.secondary">Entrepreneurial ventures most highly valued by the UCE community.</Typography>
        </Box>

        {isError && <Alert severity="error">Could not load featured ventures at this moment.</Alert>}

        <Grid container spacing={3} justifyContent="flex-start" sx={{ mb: 6 }}>
          {/* ESTADO DE CARGA: MOSTRAR 4 SKELETONS */}
          {isLoading ? (
             [1, 2, 3, 4].map((n) => (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={n}>
                   <VentureCardSkeleton />
                </Grid>
             ))
          ) : validVentures.length > 0 ? (
             validVentures.map((venture) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={venture.id}>
                <VentureCard data={venture} />
              </Grid>
            ))
          ) : (
            <Box sx={{ width: '100%', textAlign: 'center', py: 4 }}>
                <Typography color="text.secondary">
                    No ventures available right now. Please check back later.
                </Typography>
            </Box>
          )}
        </Grid>
      </Container>
    </Box>
  );
};
export default FeaturedSection;
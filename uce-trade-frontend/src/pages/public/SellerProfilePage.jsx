// src/pages/public/SellerProfilePage.jsx
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Box, Container, Typography, Alert, Chip, Grid } from '@mui/material'; 
import { fetchUserProfile } from '../../services/api';

import VentureCard from '../../components/ventures/VentureCard';
import StudentProfileHeader from '../../components/student/StudentProfileHeader';
import ProfileBioSection from '../../components/profile/ProfileBioSection';
import ProfileStatsGrid from '../../components/profile/ProfileStatsGrid';
import { ProfileHeaderSkeleton } from '../../components/ui/Skeletons';

const SellerProfilePage = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['userProfile', id],
    queryFn: () => fetchUserProfile(id)
  });

  if (isLoading) return (
    <Box sx={{ bgcolor: "#f8f9fa", minHeight: "100vh", pt: "120px", pb: 8 }}>
      <Container maxWidth="xl">
          <ProfileHeaderSkeleton />
      </Container>
    </Box>
  );
  
  if (isError || !data) return <Box sx={{ pt: 15, textAlign: 'center' }}><Alert severity="error">User not found</Alert></Box>;

  const { user, ventures } = data;

  const avgRating = ventures?.length > 0 
    ? (ventures.reduce((acc, curr) => acc + (curr.rating || 0), 0) / ventures.length).toFixed(1) 
    : "0.0";

  const headerStats = { kpi: { rating: avgRating } };

  const gridStats = { rating: avgRating };

  return (
    <Box sx={{ bgcolor: "#f8f9fa", minHeight: "100vh", pt: "120px", pb: 8 }}>
      <Container maxWidth="xl">
        
        <StudentProfileHeader 
            user={user} 
            stats={headerStats} 
            action={<Chip label="Public View" variant="outlined" />}
        />

        <ProfileBioSection user={user} />

        <Box mb={5}>
            <Typography variant="h5" fontWeight="800" color="#0d2149" mb={2}>Overview</Typography>
             {/* Pasamos gridStats y el Rol */}
             <ProfileStatsGrid 
                ventureCount={ventures?.length} 
                role={user.role}
                stats={gridStats} 
             />
        </Box>

        <Typography variant="h5" fontWeight="800" color="#0d2149" mb={3}>
            Published ventures
        </Typography>

        {ventures?.length > 0 ? (
          <Grid container spacing={3}>
            {ventures.map((v) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={v.id}>
                <VentureCard data={v} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body1" color="text.secondary" align="center" py={4}>
            This user hasn't published any ventures yet.
          </Typography>
        )}
      </Container>
    </Box>
  );
};
export default SellerProfilePage;
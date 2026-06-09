import { Grid, Stack, Box } from '@mui/material';
import SearchOffIcon from '@mui/icons-material/SearchOff'; // Icono opcional
import VentureCard from './VentureCard';
import { VentureCardSkeleton } from '../ui/Skeletons';
import EmptyState from '../common/EmptyState'; // <--- Importamos

const VentureGrid = ({ isLoading, ventures, viewMode }) => {
  if (isLoading) {
    return (
      <Grid container spacing={3}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={n}>
            <VentureCardSkeleton />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (ventures.length === 0) {
    return (
       <EmptyState 
         title="No ventures match your filters" 
         subtitle="Try adjusting your search or category selection."
         icon={<SearchOffIcon sx={{ fontSize: 40 }} />}
       />
    );
  }

  // MODO CUADRÍCULA (GRID) 
  if (viewMode === 'grid') {
    return (
      <Grid container spacing={3} justifyContent="flex-start">
        {ventures.map((venture) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={venture.id}>
            <VentureCard data={venture} />
          </Grid>
        ))}
      </Grid>
    );
  }

  // MODO LISTA (LIST)
  return (
    <Stack spacing={3}>
      {ventures.map((venture) => (
        <Box key={venture.id} sx={{ width: '100%' }}>
          <VentureCard data={venture} variant="horizontal" />
        </Box>
      ))}
    </Stack>
  );
};

export default VentureGrid;
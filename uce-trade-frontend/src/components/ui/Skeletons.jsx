import { Skeleton, Grid, Box, Paper, TableCell, TableRow } from '@mui/material';

// 1. SKELETON PARA TARJETAS (Grid de Ventures)
export const VentureCardSkeleton = () => (
  <Paper elevation={0} sx={{ borderRadius: '16px', border: '1px solid #eaecf0', overflow: 'hidden', height: '100%' }}>
    <Skeleton variant="rectangular" height={180} animation="wave" />
    <Box p={2}>
      <Box display="flex" justifyContent="space-between" mb={1}>
        <Skeleton variant="text" width="60%" height={30} />
        <Skeleton variant="text" width="20%" />
      </Box>
      <Skeleton variant="text" width="40%" height={20} sx={{ mb: 2 }} />
      <Box display="flex" justifyContent="space-between" alignItems="center" pt={2} borderTop="1px solid #f2f4f7">
        <Box>
           <Skeleton variant="text" width={50} />
           <Skeleton variant="text" width={80} height={30} />
        </Box>
        <Skeleton variant="rounded" width={100} height={36} sx={{ borderRadius: '20px' }} />
      </Box>
    </Box>
  </Paper>
);

// 2. SKELETON PARA TABLAS
export const TableRowSkeleton = ({ cols = 5 }) => (
  <TableRow>
    {[...Array(cols)].map((_, i) => (
      <TableCell key={i}>
        <Skeleton variant="text" animation="wave" height={30} />
      </TableCell>
    ))}
  </TableRow>
);

// 3. SKELETON PARA PERFIL (Header)
export const ProfileHeaderSkeleton = () => (
  <Paper elevation={0} sx={{ borderRadius: "24px", overflow: "hidden", mb: 4, border: "1px solid #e5e7eb" }}>
    <Skeleton variant="rectangular" height={80} animation="wave" sx={{ bgcolor: '#e0e0e0' }} />
    <Box px={4} pb={4}>
      <Grid container alignItems="flex-end" spacing={3}>
        <Grid size>
          <Skeleton variant="circular" width={150} height={150} sx={{ mt: -10, border: "4px solid white" }} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Skeleton variant="text" width="40%" height={50} />
          <Skeleton variant="text" width="30%" height={30} />
        </Grid>
      </Grid>
    </Box>
  </Paper>
);

// 4. SKELETON KPI (Tarjetitas de números)
export const KpiSkeleton = () => (
    <Grid container spacing={3} mb={6}>
        {[1, 2, 3, 4].map((i) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: '20px', border: '1px solid #e5e7eb', height: 110 }}>
                    <Skeleton variant="text" width="50%" />
                    <Skeleton variant="text" width="80%" height={60} />
                </Paper>
            </Grid>
        ))}
    </Grid>
);

// 5. SKELETON DASHBOARD COMPLETO
export const DashboardSkeleton = () => (
    <Box>
        <Box mb={4} display="flex" justifyContent="space-between">
            <Skeleton variant="text" width={200} height={50} />
            <Skeleton variant="rectangular" width={150} height={40} sx={{ borderRadius: 1 }} />
        </Box>
        <KpiSkeleton />
        <Skeleton variant="rectangular" width="100%" height={350} sx={{ borderRadius: '24px', mb: 4 }} />
        <Grid container spacing={4}>
            <Grid size={{ xs: 12, lg: 6 }}>
                <Skeleton variant="rectangular" width="100%" height={300} sx={{ borderRadius: '24px' }} />
            </Grid>
            <Grid size={{ xs: 12, lg: 6 }}>
                <Skeleton variant="rectangular" width="100%" height={300} sx={{ borderRadius: '24px' }} />
            </Grid>
        </Grid>
    </Box>
);
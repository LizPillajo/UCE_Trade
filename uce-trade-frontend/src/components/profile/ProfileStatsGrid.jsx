import { Grid, Paper, Box, Typography } from '@mui/material';
import WidgetsIcon from '@mui/icons-material/Widgets';
import VisibilityIcon from '@mui/icons-material/Visibility';
import StarIcon from '@mui/icons-material/Star';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

// Iconos mapeados
const icons = {
  services: <WidgetsIcon sx={{ color: '#0d2149', fontSize: 28 }} />,
  role: <VisibilityIcon sx={{ color: '#0d2149', fontSize: 28 }} />,
  rating: <StarIcon sx={{ color: '#f59e0b', fontSize: 28 }} />,
  sales: <TrendingUpIcon sx={{ color: '#10b981', fontSize: 28 }} />
};

const StatCard = ({ label, value, iconType }) => (
  <Paper elevation={0} sx={{ 
      p: 2, 
      border: "1px solid #e5e7eb", 
      borderRadius: "16px", 
      display: "flex", 
      alignItems: "center", 
      gap: 2,
      height: '100%'
  }}>
    <Box bgcolor="#f3f4f6" p={1.5} borderRadius="12px" display="flex">
      {icons[iconType] || icons.services}
    </Box>
    <Box>
      <Typography variant="caption" color="text.secondary" fontWeight="bold" textTransform="uppercase">
        {label}
      </Typography>
      <Typography variant="h5" fontWeight="800" color="#0d2149">
        {value}
      </Typography>
    </Box>
  </Paper>
);

const ProfileStatsGrid = ({ stats, ventureCount, role }) => {
  return (
    <Grid container spacing={3} mb={4}>
      <Grid size={{ xs: 12, sm: 4 }}>
        <StatCard label="Active Services" value={ventureCount || 0} iconType="services" />
      </Grid>
      
      <Grid size={{ xs: 12, sm: 4 }}>
        {/* Si hay ventas (dashboard propio) mostramos ventas, si no (perfil público) mostramos rol */}
        {stats?.sales !== undefined ? (
           <StatCard label="Total Sales" value={stats.sales} iconType="sales" />
        ) : (
           <StatCard label="Role" value={role || "Student"} iconType="role" />
        )}
      </Grid>
      
      <Grid size={{ xs: 12, sm: 4 }}>
        <StatCard label="Average Rating" value={stats?.rating || "0.0"} iconType="rating" />
      </Grid>
    </Grid>
  );
};

export default ProfileStatsGrid;
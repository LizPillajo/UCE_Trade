import { Box, Container, Typography, Grid } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import BrushIcon from '@mui/icons-material/Brush';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CategoryCard from './CategoryCard'; 

const categories = [
  { id: 'Tutorials', name: 'Tutorials', icon: SchoolIcon, color: '#e3f2fd', iconColor: '#1565c0', count: 120 },
  { id: 'Food', name: 'Food', icon: RestaurantIcon, color: '#fff8e1', iconColor: '#ff8f00', count: 85 },
  { id: 'Clothes', name: 'Clothes', icon: CheckroomIcon, color: '#fce4ec', iconColor: '#c2185b', count: 64 },
  { id: 'Design', name: 'Design', icon: BrushIcon, color: '#f3e5f5', iconColor: '#7b1fa2', count: 72 },
  { id: 'Technology', name: 'Technology', icon: LaptopMacIcon, color: '#e8f5e9', iconColor: '#2e7d32', count: 45 },
  { id: 'Photography', name: 'Photography', icon: CameraAltIcon, color: '#ffebee', iconColor: '#c62828', count: 38 },
  { id: 'Other', name: 'Others', icon: MoreHorizIcon, color: '#f5f5f5', iconColor: '#616161', count: 156 },
];

const CategorySection = () => {
  return (
    <Box component="section" sx={{ py: 5, bgcolor: '#f8f9fa' }}>
      <Container maxWidth="xl"> 
        
        <Box textAlign="center" mb={6}>
          <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
            Browse by Category
          </Typography>
          <Typography variant="body1" color="text.secondary" fontWeight="400">
            Find the perfect service or product by browsing our specialized categories.
          </Typography>
        </Box>

        <Grid container spacing={3} justifyContent="center" alignItems="stretch">
          {categories.map((cat) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={cat.id} sx={{ display: 'flex' }}>
              <CategoryCard category={cat} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default CategorySection;
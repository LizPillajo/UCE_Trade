// src/pages/public/HomePage.jsx
import { Box } from '@mui/material';
import HeroSection from '../../components/home/HeroSection';
import CategorySection from '../../components/home/CategorySection';
import FeaturedSection from '../../components/home/FeaturedSection';
import SeoMeta from '../../components/common/SeoMeta';

const HomePage = () => {
  return (
    
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', overflowX: 'hidden' }}>

      <SeoMeta title="Home" description="Discover the best ventures from UCE." />
      
      {/* 1. HERO (Blue) */}
      <HeroSection />

      {/* 2. CATEGORIES (Light gray) */}
      <CategorySection />

      {/* 3. FEATURED (White) */}
      <FeaturedSection />

    </Box>
  );
};

export default HomePage;
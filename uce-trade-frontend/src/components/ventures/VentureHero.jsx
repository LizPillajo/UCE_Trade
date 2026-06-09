// src/components/ventures/VentureHero.jsx
import { Box } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';

const VentureHero = ({ imageUrl, title, onShare }) => {
  return (
    <Box 
      sx={{ 
        position: 'relative', width: '100%', height: { xs: 300, md: 500 }, 
        borderRadius: '16px', overflow: 'hidden', mb: 2, bgcolor: '#e5e7eb',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
      }}
    >
      <img 
        src={imageUrl || "https://placehold.co/600x400?text=No+Image"} 
        alt={title} 
        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
      />
      <Box sx={{ position: 'absolute', top: 20, right: 20, display: 'flex', gap: 1 }}>
        <Box onClick={onShare} sx={{ bgcolor: 'white', p: 1, borderRadius: '50%', cursor: 'pointer', display: 'flex' }}>
          <ShareIcon fontSize="small" />
        </Box>
      </Box>
    </Box>
  );
};

export default VentureHero;
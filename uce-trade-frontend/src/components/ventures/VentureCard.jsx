// src/components/ventures/VentureCard.jsx
import { useState } from 'react';
import { Card, CardMedia, CardContent, Typography, Box, Chip } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import Button from '../ui/Button';
import { useNavigate } from 'react-router-dom';

const VentureCard = ({ data, variant = 'vertical' }) => {
  const navigate = useNavigate();
  const [imgSrc, setImgSrc] = useState(data.imageUrl);

  const handleImageError = () => {
    setImgSrc('https://placehold.co/600x400/0d2149/FFF?text=UCE+Trade');
  };

  const isHorizontal = variant === 'horizontal';

  return (
    <Card 
      sx={{ 
        height: isHorizontal ? { xs: 'auto', sm: 220 } : '100%',       
        display: 'flex',         
        flexDirection: isHorizontal ? { xs: 'column', sm: 'row' } : 'column',         
        borderRadius: '16px', 
        boxShadow: 'none', 
        border: '1px solid #eaecf0',
        position: 'relative',
        transition: 'all 0.3s ease',
        overflow: 'hidden', 
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 24px -4px rgba(0, 0, 0, 0.1)',
        }
      }}
    >
      {/* 1. IMAGEN */}
      <Box sx={{ 
          position: 'relative', 
          width: isHorizontal ? { xs: '100%', sm: 280 } : '100%',
          minWidth: isHorizontal ? { sm: 280 } : 'auto',
          height: isHorizontal ? { xs: 'auto', sm: '100%' } : 'auto'
      }}>
        <CardMedia
          component="img"
          height={isHorizontal ? undefined : "180"} 
          image={imgSrc}
          alt={data.title}
          onError={handleImageError}
          sx={{ 
            objectFit: 'cover', 
            height: isHorizontal ? { xs: 180, sm: '100%' } : 180 
          }}
        />
        
        {/* Chip de Categoría */}
        <Chip 
          label={data.category} 
          size="small"
          sx={{ 
            position: 'absolute', 
            bottom: 10, 
            left: 10, 
            bgcolor: 'white', 
            fontWeight: 600, 
            fontSize: '0.9rem', 
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
          }} 
        />
      </Box>

      {/* 2. CONTENIDO */}
      <CardContent sx={{ 
          flexGrow: 1, 
          p: 2,
          display: 'flex',
          flexDirection: 'column'
      }}>
        <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
          <Typography variant="subtitle1" fontWeight="bold" lineHeight={1.3} sx={{ flex: 1, mr: 1 }}>
            {data.title}
          </Typography>
          
          {/* Rating */}
          <Box display="flex" alignItems="center">
            <StarIcon sx={{ color: '#f59e0b', fontSize: 18 }} />
            <Typography variant="body1" fontWeight="bold" ml={0.5}>
              {data.rating}
            </Typography>
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" display="block" mb={2}>
           By {data.owner?.fullName || "Unknown"}
        </Typography>

        {/* Descripción extra SOLO en modo Lista Escritorio (Opcional, llena espacio vacío) */}
        {isHorizontal && (
            <Typography variant="body2" color="text.secondary" mb={2} sx={{ display: { xs: 'none', sm: '-webkit-box' }, overflow: 'hidden', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                {data.description}
            </Typography>
        )}

        {/* Precio y Botón */}
        <Box mt="auto" pt={2} display="flex" alignItems="center" justifyContent="space-between" borderTop="1px solid #f2f4f7">
          <Box>
            <Typography variant="caption" color="text.secondary" display="block">Starting at</Typography>
            <Typography variant="h5" fontWeight="bold" color="primary">
              ${data.price}
            </Typography>
          </Box>
          
          <Button 
            variant="contained" 
            size="small"
            onClick={() => navigate(`/venture/${data.id}`)}
            sx={{ 
                bgcolor: '#0d2149', 
                borderRadius: '20px', 
                fontSize: '0.85rem', 
                px: 2.5 
            }}
          >
            See details
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default VentureCard;
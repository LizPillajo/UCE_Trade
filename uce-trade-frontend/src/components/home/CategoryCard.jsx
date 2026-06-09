import { Paper, Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const CategoryCard = ({ category }) => {
  const { id, name, icon: Icon, color, iconColor, count } = category;

  return (
    <Paper
        component={Link}
        to={`/explore?category=${id}`}
        elevation={0}
        sx={{
            width: '100%',
            height: '100%',
            p: 2, 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            textDecoration: 'none',
            borderRadius: '24px', 
            border: '1px solid',
            borderColor: 'divider',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            bgcolor: 'white',
            '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 20px 20px rgba(0,0,0,0.08)',
                borderColor: 'primary.main',
            }
        }}
    >
        <Box sx={{ 
            bgcolor: color, 
            color: iconColor, 
            width: 80, 
            height: 80,
            borderRadius: '50%', 
            mb: 3,
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center'
        }}>
            <Icon sx={{ fontSize: 40 }} />
        </Box>
        
        <Typography variant="h5" fontWeight="bold" color="text.primary" gutterBottom>
            {name}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
            {count} listings
        </Typography>
    </Paper>
  );
};

export default CategoryCard;
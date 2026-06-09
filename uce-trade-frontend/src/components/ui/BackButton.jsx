import { Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const BackButton = ({ to, label = "Back", sx = {} }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1); 
    }
  };

  return (
    <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={handleClick} 
        sx={{ 
            mb: 3, 
            color: 'text.secondary', 
            textTransform: 'none', 
            fontWeight: 600,
            justifyContent: 'flex-start',
            px: 0,
            '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' },
            ...sx 
        }}
        disableRipple
    >
        {label}
    </Button>
  );
};

export default BackButton;
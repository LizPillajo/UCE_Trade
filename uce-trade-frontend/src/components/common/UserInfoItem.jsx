import { Box, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // <--- IMPORTAMOS EL ICONO
import Avatar from '../ui/Avatar'; 

const UserInfoItem = ({ 
  name, 
  avatar, 
  subtitle, 
  size = 45, 
  isVerified = false, // <--- NUEVA PROPIEDAD
  sx = {} 
}) => {
  return (
    <Box display="flex" alignItems="center" gap={2} sx={sx}>
      <Avatar 
        src={avatar} 
        alt={name}
        size={size}
        fallback={name}
      />
      
      <Box>
        <Box display="flex" alignItems="center" gap={0.5}>
            <Typography variant="body2" fontWeight="bold" color="#0d2149" lineHeight={1.2}>
                {name || "Unknown User"}
            </Typography>
            
            {/* Si es verificado, mostramos el check */}
            {isVerified && (
                <CheckCircleIcon sx={{ fontSize: 16, color: '#10b981' }} />
            )}
        </Box>

        {subtitle && (
            <Typography variant="caption" color="text.secondary" display="block">
                {subtitle}
            </Typography>
        )}
      </Box>
    </Box>
  );
};

export default UserInfoItem;
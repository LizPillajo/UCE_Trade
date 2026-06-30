import { Paper, Box, Typography, Divider, Stack } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Button from '../ui/Button';
import UserInfoItem from '../common/UserInfoItem'; 

const OwnerCard = ({ owner, onNavigate }) => (
  <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid #e5e7eb' }}>
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
      <Typography variant="caption" color="text.secondary" fontWeight="bold">PROVIDED BY</Typography>
      <Button size="small" variant="contained" onClick={onNavigate}>Profile</Button>
    </Box>
    
    <UserInfoItem 
        name={owner?.fullName || owner?.name || "Unknown User"} 
        avatar={owner?.avatarUrl || owner?.avatar}
        subtitle={owner?.faculty || "No specified"}
        size={55}
        isVerified={true} 
    />

    <Divider sx={{ my: 2 }} />
    <Stack spacing={1}>
       <Box display="flex" gap={1} alignItems="center" color="text.secondary">
            <AccessTimeIcon sx={{ fontSize: 16 }} />
            <Typography variant="body2">Response: Fast</Typography>
       </Box>
    </Stack>
  </Paper>
);
export default OwnerCard;
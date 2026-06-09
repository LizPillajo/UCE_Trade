import { IconButton, Avatar, Menu, MenuItem, Box, Typography, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const UserMenu = ({ user, anchorEl, setAnchorEl, onLogout }) => {
  const navigate = useNavigate();
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Lógica de iniciales
  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
  };

  const isUrl = user?.avatar 
    && (user.avatar.startsWith('http') || user.avatar.startsWith('data:'))
    && !user.avatar.includes('ui-avatars.com');

  return (
    <>
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ p: 0 }}>
        <Avatar 
          src={isUrl ? user.avatar : null} 
          alt={user.name}
          sx={{ bgcolor: '#efb034', color: '#0d2149', fontWeight: 'bold' }}
        >
          {!isUrl ? getInitials(user.name) : null}
        </Avatar>
      </IconButton>
      
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{ sx: { mt: 1.5, minWidth: 150 } }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box px={2} py={1}>
          <Typography variant="subtitle2" fontWeight="bold">{user.name}</Typography>
          <Typography variant="caption" color="text.secondary">{user.role}</Typography>
        </Box>
        <Divider />
        
        {user.role === 'STUDENT' && (
            <MenuItem onClick={() => { navigate('/profile'); handleClose(); }}>My Profile</MenuItem>
        )}
        {user.role === 'ADMIN' && (
            <MenuItem onClick={() => { navigate('/admin/dashboard'); handleClose(); }}>Dashboard</MenuItem>
        )}
        
        <MenuItem onClick={() => { handleClose(); onLogout(); }} sx={{ color: 'error.main' }}>
            Log out
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;
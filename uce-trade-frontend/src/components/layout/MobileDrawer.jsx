import { Box, Typography, Divider, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';

const MobileDrawer = ({ handleDrawerToggle, links, user }) => {
  return (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Box py={2} display="flex" alignItems="center" justifyContent="center">
         <SchoolIcon sx={{ mr: 1, color: '#efb034' }} />
         <Typography variant="h6" sx={{ my: 2, fontWeight:'bold', color: '#0d2149' }}>
            UCE Trade
         </Typography>
      </Box>
      <Divider />
      <List>
        {links.map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton component={RouterLink} to={item.path} sx={{ textAlign: 'center' }}>
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
        
        {/* Botones de Auth en Móvil si no está logueado */}
        {!user && (
            <>
                <Divider sx={{ my:1 }}/>
                <ListItem disablePadding>
                    <ListItemButton component={RouterLink} to="/login" sx={{ textAlign: 'center' }}>
                        <ListItemText primary="Log in" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton component={RouterLink} to="/register" sx={{ textAlign: 'center', bgcolor:'#efb034', color: '#0d2149' }}>
                        <ListItemText primary="Sign up" primaryTypographyProps={{fontWeight:'bold'}} />
                    </ListItemButton>
                </ListItem>
            </>
        )}
      </List>
    </Box>
  );
};

export default MobileDrawer;
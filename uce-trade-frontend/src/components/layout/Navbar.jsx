// src/components/layout/Navbar.jsx
import { useState } from 'react';
import { AppBar, Toolbar, Box, Typography, IconButton, useScrollTrigger, Container, Drawer } from '@mui/material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

// Iconos
import SchoolIcon from '@mui/icons-material/School';
import MenuIcon from '@mui/icons-material/Menu';

// Componentes y Servicios
import Button from '../ui/Button'; 
import { useAuthStore } from '../../store/authStore'; 
import { fetchNotifications } from '../../services/api';
import MobileDrawer from './MobileDrawer';
import UserMenu from './UserMenu';
import NotificationMenu from './NotificationMenu'; // <--- NUEVO IMPORT

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Estados para Menús
  const [anchorEl, setAnchorEl] = useState(null);        // Para el Avatar
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // Efecto de Scroll
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 20 });
  const isTransparent = location.pathname === '/' && !trigger;

  // 1. Obtener Notificaciones (Solo si hay usuario)
  const { data: notifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
    enabled: !!user,
    refetchInterval: 30000 
  });
  
  let links = [{ name: 'Home', path: '/' }, { name: 'Explore', path: '/explore' }];
  if (user?.role === 'UCE_STUDENT') links.push({ name: 'Dashboard', path: '/student/dashboard' });
  if (user?.role === 'UCE_ADMIN') links.push({ name: 'Dashboard', path: '/admin/dashboard' });

  const handleLogout = () => {
    setAnchorEl(null);
    logout();
    navigate('/login');
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
    <AppBar position="fixed" sx={{ 
       background: isTransparent ? 'transparent' : (theme) => `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
       boxShadow: isTransparent ? 'none' : 4,
       transition: 'all 0.3s ease',
       py: 1 
    }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', minHeight: '70px' }}>
          
          {/* 1. HAMBURGUESA (Móvil) */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          {/* 2. LOGO */}
          <Box display="flex" alignItems="center" component={RouterLink} to="/" sx={{ textDecoration: 'none', color: 'white', flexGrow: {xs: 1, sm: 0} }}>
            <SchoolIcon sx={{ mr: 1.5, color: '#efb034', fontSize: { xs: 30, md: 40 } }} />
            <Box>
              <Typography variant="h5" fontWeight={800} lineHeight={1} sx={{ fontSize: { xs: '1.2rem', md: '1.5rem' } }}>UCE Trade</Typography>
            </Box>
          </Box>

          {/* 3. MENÚ CENTRAL (Escritorio) */}
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 3 }}>
            {links.map((link) => (
              <Button 
                key={link.name} 
                component={RouterLink} to={link.path} variant="text" 
                sx={{ color: 'white', fontWeight: 700, fontSize: '1.1rem', opacity: 0.9, '&:hover': { opacity: 1 } }}
              >
                {link.name}
              </Button>
            ))}
          </Box>

          {/* 4. ÁREA DE USUARIO */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {!user ? (
              <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 2 }}>
                <Button component={RouterLink} to="/login" variant="text" sx={{ color: 'white', fontWeight: 600 }}>
                  Log in
                </Button>
                <Button component={RouterLink} to="/register" variant="contained" color="secondary">
                  Sign up
                </Button>
              </Box>
            ) : (
              <>
                {/* A. CAMPANA DE NOTIFICACIONES (Refactorizado) */}
                <NotificationMenu notifications={notifications} />

                {/* B. MENÚ DE USUARIO (Avatar) */}
                <UserMenu 
                    user={user} 
                    anchorEl={anchorEl} 
                    setAnchorEl={setAnchorEl} 
                    onLogout={handleLogout} 
                />
              </>
            )}
          </Box>

        </Toolbar>
      </Container>
    </AppBar>

    <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
          }}
        >
          <MobileDrawer 
            handleDrawerToggle={handleDrawerToggle} 
            links={links} 
            user={user} 
          />
        </Drawer>
    </Box>
    </>
  );
};

export default Navbar;
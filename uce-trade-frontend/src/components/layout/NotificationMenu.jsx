import { useState } from 'react';
import { IconButton, Badge, Menu, MenuItem, ListItemText, Typography, Divider, Box } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useQueryClient } from '@tanstack/react-query'; // <--- 1. Importamos esto para refrescar datos
import api from '../../services/api'; // <--- 2. Importamos tu instancia de API para llamar al backend

const NotificationMenu = ({ notifications }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  
  // Hook para poder invalidar queries y refrescar la UI
  const queryClient = useQueryClient();

  // Contamos visualmente cuántas no están leídas para el globito rojo
  const unreadCount = notifications?.filter(n => !n.read).length || 0;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);

    // 3. LÓGICA MAGICA: Si hay notificaciones sin leer, avisamos al backend
    if (unreadCount > 0) {
      // Recorremos las notificaciones
      notifications.forEach(async (notif) => {
        // Solo enviamos petición si NO está leída
        if (!notif.read) {
          try {
            await api.put(`/notifications/${notif.id}/read`);
          } catch (error) {
            console.error("Error marcando notificación como leída", error);
          }
        }
      });

      // 4. Refrescamos los datos en el Frontend
      // Ponemos un pequeño delay (1s) para que se vea el efecto visual
      // y dar tiempo a que el backend procese las peticiones.
      setTimeout(() => {
         queryClient.invalidateQueries(['notifications']); 
      }, 1000);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{ sx: { width: 320, maxHeight: 400, mt: 1.5 } }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Typography p={2} variant="subtitle1" fontWeight="bold" color="#0d2149">
          Notifications
        </Typography>
        <Divider />
        {notifications?.length > 0 ? (
          notifications.map((notif) => (
            <MenuItem 
                key={notif.id} 
                onClick={handleClose} 
                sx={{ 
                    whiteSpace: 'normal', 
                    borderBottom: '1px solid #f0f0f0',
                    // 5. ESTILO VISUAL: Fondo azulito si no está leída, blanco si ya lo está
                    bgcolor: notif.read ? 'white' : '#f0f9ff' 
                }}
            >
              <ListItemText 
                primary={
                    <Typography variant="subtitle2" fontWeight={notif.read ? "400" : "700"}>
                        {notif.title}
                    </Typography>
                }
                secondary={
                  <>
                    <Typography variant="body2" component="span" display="block" color="text.primary" sx={{ my: 0.5, fontSize: '0.9rem' }}>
                      {notif.message}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(notif.date).toLocaleString()}
                    </Typography>
                  </>
                }
              />
            </MenuItem>
          ))
        ) : (
          <Box p={3} textAlign="center">
            <Typography variant="body2" color="text.secondary">No notifications yet</Typography>
          </Box>
        )}
      </Menu>
    </>
  );
};

export default NotificationMenu;
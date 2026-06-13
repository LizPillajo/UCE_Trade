// src/components/student/StudentProfileHeader.jsx
import { Box, Grid, Paper, Typography } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import Avatar from "../ui/Avatar";

const StudentProfileHeader = ({ user, stats, action }) => {
  return (
    <Paper elevation={0} sx={{ borderRadius: "24px", overflow: "hidden", mb: 4, border: "1px solid #e5e7eb", bgcolor: 'white' }}>
      {/* 1. Banner Amarillo (Igual al original) */}
      <Box sx={{ height: 80, bgcolor: "#efb034" }} />
      
      <Box px={4} pb={4}>
        {/* Grid principal alineado al fondo para respetar el avatar subiendo */}
        <Grid container alignItems="flex-end" spacing={3} sx={{ mt: 1 }}>
          
          {/* 2. Avatar con margen negativo fuerte (Restaurado) */}
          <Grid size="auto">
            <Avatar 
              src={user?.avatarUrl || user?.avatar} 
              alt={user?.fullName || user?.name}
              fallback={user?.fullName || user?.name}
              sx={{
                width: 150,
                height: 150,
                border: "4px solid white",
                bgcolor: "#0d2149",
                fontSize: "3rem",
                fontWeight: "bold",
                mt: -20, 
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }} 
            />
          </Grid>
          
          {/* 3. Información de Texto */}
          <Grid size="grow" sx={{ mb: 1 }}>
             <Box sx={{ mt: { xs: 2, md: 0 } }}>
                <Typography variant="h4" fontWeight="800" color="#0d2149" sx={{ mb: 1 }}>
                  {user?.fullName || user?.name}
                </Typography>
                
                <Typography variant="body1" color="text.secondary" fontWeight="500">
                  {user?.faculty || "UCE Community Member"}
                </Typography>
                
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                  {user?.role || "Student"} • Active Member
                </Typography>
             </Box>
          </Grid>

          {/* 4. Acción a la derecha*/}
          <Grid size="auto" sx={{ mb: 6 }}>
             {action}
          </Grid>
        </Grid>

        {/* 5. Fila inferior de Iconos (Restaurada) */}
        <Box display="flex" gap={4} mt={3} flexWrap="wrap">
          <Box display="flex" alignItems="center" gap={1}>
            <StarIcon sx={{ color: "#f59e0b" }} />
            <Typography fontWeight="bold">{stats?.kpi?.rating || user?.rating || "0.0"}</Typography>
            <Typography color="text.secondary">(Rating)</Typography>
          </Box>
          
          <Box display="flex" alignItems="center" gap={1} color="text.secondary">
            <LocationOnIcon fontSize="small" />
            <Typography variant="body2">UCE Central Campus</Typography>
          </Box>
          
          <Box display="flex" alignItems="center" gap={1} color="text.secondary">
            <CalendarTodayIcon fontSize="small" />
            <Typography variant="body2">Active User</Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default StudentProfileHeader;
// src/components/profile/ProfileBioSection.jsx
import { Grid, Paper, Typography } from '@mui/material';
import ContactButtons from '../common/ContactButtons';

const ProfileBioSection = ({ user }) => {
  return (
    <Grid container spacing={4} mb={5}>
      {/* COLUMNA IZQUIERDA: ABOUT ME */}
      <Grid size={{ xs: 12, md: 8 }}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: "24px", border: "1px solid #e5e7eb", height: "100%" }}>
          <Typography variant="h6" fontWeight="bold" color="#0d2149" gutterBottom>
            About me
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, whiteSpace: 'pre-line' }}>
            {user?.description || "No description provided."}
          </Typography>
          
          {user?.githubUser && (
            <Typography 
              variant="body2" component="a" 
              href={`https://github.com/${user.githubUser}`} target="_blank" 
              sx={{ color: '#0d2149', fontWeight: 'bold', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" width={20} alt="github"/>
              github.com/{user.githubUser}
            </Typography>
          )}
        </Paper>
      </Grid>

      {/* COLUMNA DERECHA: CONTACTO */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: "24px", border: "1px solid #e5e7eb", height: "100%" }}>
          <Typography variant="h6" fontWeight="bold" color="#0d2149" mb={2}>
            Contact Information
          </Typography>
          {/* Reutilizamos tu componente de botones existente */}
          <ContactButtons 
            phoneNumber={user?.phoneNumber} 
            email={user?.email} 
            fullName={user?.name || user?.fullName} 
          />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ProfileBioSection;
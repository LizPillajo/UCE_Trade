import { Grid } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import GitHubIcon from '@mui/icons-material/GitHub';
import TextField from '@mui/material/TextField'; // Usamos TextField directo para manejar props específicas del modal
import FacultySelect from '../common/FacultySelect';

const ProfileFormFields = ({ register, errors }) => {
  return (
    <>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField 
            fullWidth label="Full Name" 
            {...register("fullName")} 
            error={!!errors.fullName} 
            helperText={errors.fullName?.message}
        />
      </Grid>
      
      <Grid size={{ xs: 12, sm: 6 }}>
        {/* Reutilizamos el Select aquí también para mantener consistencia */}
        <FacultySelect 
            register={register} 
            errors={errors} 
            sx={{ mb: 0 }} /* Quitamos margin bottom porque está en Grid */
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <TextField 
            fullWidth label="WhatsApp Number" placeholder="593..."
            InputProps={{ startAdornment: <InputAdornment position="start"><WhatsAppIcon color="success" /></InputAdornment> }}
            {...register("phoneNumber")} error={!!errors.phoneNumber} helperText={errors.phoneNumber?.message}
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <TextField 
            fullWidth label="GitHub Username" placeholder="username"
            InputProps={{ startAdornment: <InputAdornment position="start"><GitHubIcon /></InputAdornment> }}
            {...register("githubUser")} error={!!errors.githubUser} helperText={errors.githubUser?.message}
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <TextField 
            fullWidth label="About Me" multiline rows={3} placeholder="Tell us about yourself..."
            {...register("description")} error={!!errors.description} helperText={errors.description?.message}
        />
      </Grid>
    </>
  );
};

export default ProfileFormFields;
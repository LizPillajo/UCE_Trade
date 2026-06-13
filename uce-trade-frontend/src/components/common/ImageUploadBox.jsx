import { Box, Button, Typography, CircularProgress, IconButton } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';

const ImageUploadBox = ({ preview, uploading, onUpload, onRemove, error }) => {
  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" color="#0d2149" mb={3}>2. Gallery</Typography>
      
      {/* Botón / Zona de Carga */}
      <Button
        component="label"
        sx={{ 
            width: '100%',
            border: `2px dashed ${error ? '#ef4444' : '#e5e7eb'}`, 
            borderRadius: '16px', 
            p: 4, 
            textAlign: 'center', 
            bgcolor: '#f9fafb',
            display: 'flex',
            flexDirection: 'column',
            textTransform: 'none',
            '&:hover': { borderColor: '#0d2149', bgcolor: '#e0e7ff' }
        }}
      >
        <input 
            type="file" 
            hidden 
            accept="image/*" 
            onChange={onUpload} 
            disabled={uploading}
        />
        
        {uploading ? (
            <CircularProgress /> 
        ) : (
            <>
                <CloudUploadIcon sx={{ fontSize: 48, color: '#9ca3af', mb: 2 }} />
                <Typography fontWeight="bold" color="#0d2149">Click to upload image</Typography>
                <Typography variant="caption" color="text.secondary">JPG or PNG (max. 5MB)</Typography>
            </>
        )}
      </Button>
      
      {/* Previsualización */}
      {preview && (
        <Box mt={2} display="flex" gap={2}>
            <Box sx={{ position: 'relative', width: 150, height: 100, borderRadius: '12px', overflow: 'hidden', border: '1px solid #ddd' }}>
                <img src={preview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <IconButton 
                    size="small" 
                    onClick={(e) => { e.preventDefault(); onRemove(); }} // preventDefault es clave aquí
                    sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'rgba(0,0,0,0.5)', color: 'white', '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' } }}
                >
                    <CloseIcon fontSize="small" />
                </IconButton>
            </Box>
        </Box>
      )}
      
      {error && (
        <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
            {error}
        </Typography>
      )}
    </Box>
  );
};

export default ImageUploadBox;
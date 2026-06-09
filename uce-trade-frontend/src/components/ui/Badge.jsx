import { Chip } from '@mui/material';

const Badge = ({ status, ...props }) => {
  let styles = { bgcolor: '#f3f4f6', color: '#374151', border: '1px solid #e5e7eb' }; // Default (Gris)

  const normalizedStatus = status?.toLowerCase() || '';

  switch (normalizedStatus) {
    case 'active':
    case 'approved':
    case 'completed':
      styles = { bgcolor: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0' }; // Verde
      break;
    case 'pending':
    case 'review':
      styles = { bgcolor: '#eff6ff', color: '#1e40af', border: '1px solid #bfdbfe' }; // Azul
      break;
    case 'rejected':
    case 'inactive':
    case 'cancelled':
      styles = { bgcolor: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' }; // Rojo
      break;
    // Categorías (Opcional, si quieres usarlos como badges también)
    case 'tutorials':
      styles = { bgcolor: '#e0f2fe', color: '#0369a1', border: 'none' };
      break;
    case 'food':
      styles = { bgcolor: '#fff7ed', color: '#c2410c', border: 'none' };
      break;
  }

  return (
    <Chip 
      label={status} 
      size="small" 
      sx={{ 
        ...styles, 
        fontWeight: 'bold', 
        borderRadius: '6px', 
        height: 24,
        fontSize: '0.75rem',
        ...props.sx 
      }} 
      {...props} 
    />
  );
};

export default Badge;
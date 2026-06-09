import { Typography, Box } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Button from '../ui/Button';
import BaseModal from '../ui/BaseModal';

const ConfirmationModal = ({ open, title, message, onClose, onConfirm, loading }) => {
  return (
    <BaseModal
        open={open}
        onClose={onClose}
        title={title}
        maxWidth="xs"
        actions={
            <>
                <Button variant="text" onClick={onClose} disabled={loading} sx={{ color: '#6b7280' }}>
                    Cancel
                </Button>
                <Button 
                    onClick={onConfirm} 
                    disabled={loading}
                    sx={{ bgcolor: '#ef4444', '&:hover': { bgcolor: '#dc2626' } }}
                >
                    {loading ? "Deleting..." : "Delete"}
                </Button>
            </>
        }
    >
        {/* El cuerpo del modal */}
        <Box display="flex" flexDirection="column" alignItems="center" textAlign="center" py={2}>
            <Box sx={{ bgcolor: '#fef2f2', p: 2, borderRadius: '50%', color: '#ef4444', mb: 2 }}>
                <WarningAmberIcon fontSize="large" />
            </Box>
            <Typography variant="body1" color="text.secondary">
                {message}
            </Typography>
        </Box>
    </BaseModal>
  );
};

export default ConfirmationModal;
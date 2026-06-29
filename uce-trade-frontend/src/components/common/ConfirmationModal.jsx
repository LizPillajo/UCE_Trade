import { Typography, Box } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Button from '../ui/Button';
import BaseModal from '../ui/BaseModal';

const ConfirmationModal = ({ open, title, message, onClose, onConfirm, loading }) => {
  return (
    <BaseModal
        open={open}
        onClose={onClose}
        title={title || "Confirm Action"}
        maxWidth="xs"
        actions={
            <>
                <Button variant="text" onClick={onClose} disabled={loading} sx={{ color: '#6b7280' }}>
                    Cancel
                </Button>
                <Button 
                    onClick={onConfirm} 
                    disabled={loading}
                    sx={{ 
                        bgcolor: '#ef4444', 
                        '&:hover': { bgcolor: '#dc2626' },
                        '&:disabled': { bgcolor: '#fca5a5' }
                    }}
                >
                    {loading ? "Deleting..." : "Delete"}
                </Button>
            </>
        }
    >
        <Box display="flex" flexDirection="column" alignItems="center" textAlign="center" py={2}>
            <Box sx={{ bgcolor: '#fef2f2', p: 2, borderRadius: '50%', color: '#ef4444', mb: 2 }}>
                <WarningAmberIcon fontSize="large" />
            </Box>
            <Typography variant="body1" color="text.secondary">
                {message || "Are you sure you want to delete this item? This action cannot be undone."}
            </Typography>
        </Box>
    </BaseModal>
  );
};

export default ConfirmationModal;
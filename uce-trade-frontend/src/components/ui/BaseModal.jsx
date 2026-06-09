import { Dialog, DialogTitle, DialogContent, DialogActions, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const BaseModal = ({ open, onClose, title, children, actions, maxWidth = "sm" }) => {
  return (
    <Dialog 
        open={open} 
        onClose={onClose} 
        maxWidth={maxWidth} 
        fullWidth 
        PaperProps={{ sx: { borderRadius: '20px', p: 1 } }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" pr={2}>
          <DialogTitle sx={{ fontWeight: 'bold', color: '#0d2149' }}>{title}</DialogTitle>
          <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
      </Box>
      
      <DialogContent dividers sx={{ borderColor: '#f0f0f0' }}>
        {children}
      </DialogContent>

      {actions && (
        <DialogActions sx={{ p: 3 }}>
            {actions}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default BaseModal;
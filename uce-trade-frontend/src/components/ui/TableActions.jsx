import { Box, IconButton, Tooltip } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const TableActions = ({ 
  onView, 
  onEdit, 
  onDelete, 
  onApprove, 
  onReject, 
  status 
}) => {
  return (
    <Box display="flex" justifyContent="flex-end" gap={0.5}>
      {/* Botón Ver (Siempre visible si se pasa la función) */}
      {onView && (
        <Tooltip title="View Details">
          <IconButton size="small" onClick={onView} sx={{ color: '#3b82f6' }}>
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}

      {/* Botón Editar */}
      {onEdit && (
        <Tooltip title="Edit">
          <IconButton size="small" onClick={onEdit} sx={{ color: '#f59e0b' }}>
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}

      {/* Botones de Estado (Solo admin) */}
      {onApprove && status !== 'Active' && (
        <Tooltip title="Approve">
          <IconButton size="small" color="success" onClick={onApprove}>
            <CheckCircleIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}

      {onReject && status !== 'Rejected' && (
        <Tooltip title="Reject">
          <IconButton size="small" color="warning" onClick={onReject}>
            <CancelIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}

      {/* Botón Borrar */}
      {onDelete && (
        <Tooltip title="Delete">
          <IconButton size="small" color="error" onClick={onDelete}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};

export default TableActions;
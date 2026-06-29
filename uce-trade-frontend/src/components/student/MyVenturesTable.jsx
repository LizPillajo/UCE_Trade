import { useState } from 'react';
import { TableRow, TableCell, Box } from '@mui/material';
import StarIcon from "@mui/icons-material/Star";
import { useNavigate } from "react-router-dom";

import Badge from '../ui/Badge'; 
import ConfirmationModal from '../common/ConfirmationModal';
import EditVentureModal from './EditVentureModal';
import TableActions from '../ui/TableActions'; 
import UserInfoItem from '../common/UserInfoItem'; 
import DataTable from '../ui/DataTable';
import { useVentureMutations } from '../../hooks/useVentureMutations'; 

const MyVenturesTable = ({ ventures }) => {
  const navigate = useNavigate();
  const { deleteVenture, updateVenture, isDeleting, isUpdating } = useVentureMutations();

  const [deleteId, setDeleteId] = useState(null);
  const [editVenture, setEditVenture] = useState(null);

  const handleUpdate = (data) => {
    if (!editVenture) return;
    updateVenture({ id: editVenture.id, data });
    setEditVenture(null);
  };

  const headers = ["Service", "Category", "Price", "Status", "Rating", "Actions"];

  return (
    <>
      <DataTable
        headers={headers}
        loading={false} 
        isEmpty={!ventures || ventures.length === 0}
        emptyMessage="You haven't published any services yet."
        colSpan={6}
      >
          {ventures?.map((row) => (
            <TableRow key={row.id} hover>
                <TableCell>
                    <UserInfoItem 
                        name={row.title}
                        avatar={row.imageUrl}
                        subtitle={`Created: ${row.createdAt || row.createdDate || 'Recently'}`}
                        sx={{ '& .MuiAvatar-root': { borderRadius: '8px' } }}
                    />
                </TableCell>
                <TableCell><Badge status={row.category} /></TableCell> 
                <TableCell sx={{ fontWeight: "bold" }}>${row.price}</TableCell>
                <TableCell><Badge status={row.status || 'Active'} /></TableCell>
                <TableCell>
                    <Box display="flex" alignItems="center" gap={0.5}>
                        <StarIcon fontSize="small" sx={{ color: "#f59e0b" }} />
                        {row.rating || 0.0}
                    </Box>
                </TableCell>
                
                <TableCell align="right">
                    <TableActions 
                        onView={() => navigate(`/venture/${row.id}`)}
                        onEdit={() => setEditVenture(row)}
                        onDelete={() => setDeleteId(row.id)}
                    />
                </TableCell>
            </TableRow>
          ))}
      </DataTable>

      <ConfirmationModal 
        open={!!deleteId}
        title="Delete Venture?"
        message="Are you sure? This action will remove the service from the store."
        onClose={() => setDeleteId(null)}
        onConfirm={() => { deleteVenture(deleteId); setDeleteId(null); }}
        loading={isDeleting}
      />

      <EditVentureModal 
        open={!!editVenture}
        handleClose={() => setEditVenture(null)}
        venture={editVenture}
        onSave={handleUpdate}
        loading={isUpdating}
      />
    </>
  );
};

export default MyVenturesTable;
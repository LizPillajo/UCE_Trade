import { TableRow, TableCell, Typography } from '@mui/material';
import Badge from '../ui/Badge'; 
import { useNavigate } from 'react-router-dom';
import TableActions from '../ui/TableActions';
import DataTable from '../ui/DataTable';

const VenturesTable = ({ ventures, onDelete, onStatusChange, loading }) => {
  const navigate = useNavigate();
  const headers = ["Entrepreneurship", "Owner", "Category", "Status", "Price", "Date", "Actions"];

  return (
    <DataTable 
        headers={headers}
        loading={loading}
        isEmpty={ventures.length === 0}
        emptyMessage="No ventures found"
        colSpan={7}
    >
        {ventures.map((row) => (
            <TableRow key={row.id} hover>
                <TableCell>
                    <Typography fontWeight="bold" color="#0d2149">{row.title}</Typography>
                </TableCell>
                <TableCell>
                    <Typography variant="body2">{row.owner?.fullName}</Typography>
                    <Typography variant="caption" color="text.secondary">{row.owner?.faculty}</Typography>
                </TableCell>
                <TableCell><Badge status={row.category} /></TableCell>
                <TableCell><Badge status={row.status || 'Active'} /></TableCell>
                <TableCell>${row.price}</TableCell>
                <TableCell sx={{ color: 'text.secondary' }}>{row.createdDate}</TableCell>
                
                <TableCell align="right">
                    <TableActions 
                        onView={() => navigate(`/venture/${row.id}`)}
                        onDelete={() => onDelete(row.id)}
                        onApprove={() => onStatusChange(row.id, 'Active')}
                        onReject={() => onStatusChange(row.id, 'Rejected')}
                        status={row.status}
                    />
                </TableCell>
            </TableRow>
        ))}
    </DataTable>
  );
};

export default VenturesTable;
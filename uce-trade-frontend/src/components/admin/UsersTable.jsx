import { TableRow, TableCell, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TableActions from '../ui/TableActions';
import UserInfoItem from '../common/UserInfoItem';
import DataTable from '../ui/DataTable';

const UsersTable = ({ users, onDelete, loading }) => {
  const navigate = useNavigate();
  const headers = ["User", "Faculty", "Joined", "Active Ventures", "Total Sales", "Actions"];

  return (
    <DataTable 
        headers={headers} 
        loading={loading} 
        isEmpty={users.length === 0}
        emptyMessage="No users found."
        colSpan={6}
    >
        {users.map((row) => (
            <TableRow key={row.id} hover>
                <TableCell>
                    <UserInfoItem 
                        name={row.fullName} 
                        avatar={row.avatar} 
                        subtitle={row.email} 
                    />
                </TableCell>

                <TableCell>{row.faculty}</TableCell>
                <TableCell sx={{ color: 'text.secondary' }}>{row.joinDate}</TableCell>
                
                {/* Active Ventures (Centrado manual si quieres mantener diseño exacto, o ajustamos DataTable) */}
                <TableCell>
                    <Box sx={{ bgcolor: '#eff6ff', color: '#1d4ed8', py: 0.5, px: 1.5, borderRadius: '6px', display: 'inline-block', fontWeight: 'bold' }}>
                        {row.activeVentures}
                    </Box>
                </TableCell>

                <TableCell>
                     <Typography fontWeight="bold" color={row.totalSales > 0 ? "success.main" : "text.secondary"}>
                        {row.totalSales}
                     </Typography>
                </TableCell>
                
                <TableCell align="right">
                    <TableActions 
                        onView={() => navigate(`/profile/${row.id}`)}
                        onDelete={() => onDelete(row.id)}
                    />
                </TableCell>
            </TableRow>
        ))}
    </DataTable>
  );
};

export default UsersTable;
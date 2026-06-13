import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import { TableRowSkeleton } from './Skeletons';

/**
 * @param {Array} headers - Lista de títulos de columna ["Name", "Date", "Actions"]
 * @param {Boolean} loading - Estado de carga
 * @param {Boolean} isEmpty - Si no hay datos
 * @param {String} emptyMessage - Mensaje para estado vacío
 * @param {Integer} colSpan - Cantidad de columnas (para el skeleton y empty state)
 * @param {ReactNode} children - Las filas (TableRow) que renderiza el padre
 */
const DataTable = ({ headers, loading, isEmpty, emptyMessage, colSpan, children }) => {
  return (
    <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e5e7eb' }}>
        <Table>
            <TableHead sx={{ bgcolor: '#f9fafb' }}>
                <TableRow>
                    {headers.map((head) => (
                        <TableCell 
                            key={head} 
                            align={head === "Actions" ? "right" : "left"} 
                            sx={{ fontWeight: 'bold', color: '#6b7280' }}
                        >
                            {head}
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {loading ? (
                    [...Array(5)].map((_, i) => <TableRowSkeleton key={i} cols={colSpan} />)
                ) : isEmpty ? (
                    <TableRow>
                        <TableCell colSpan={colSpan} align="center" sx={{ py: 3 }}>
                            <Typography color="text.secondary">{emptyMessage || "No data found."}</Typography>
                        </TableCell>
                    </TableRow>
                ) : (
                    children
                )}
            </TableBody>
        </Table>
    </TableContainer>
  );
};

export default DataTable;
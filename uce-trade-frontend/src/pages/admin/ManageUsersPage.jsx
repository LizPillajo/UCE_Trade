import { useState } from 'react';
import { Button, Pagination, CircularProgress } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import UsersTable from '../../components/admin/UsersTable';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { fetchAdminUsers, deleteAdminUser, exportUsersReport } from '../../services/api';
import PageLayout from '../../components/layout/PageLayout'; 

const ManageUsersPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);
  const [downloading, setDownloading] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['adminUsers', page],
    queryFn: () => fetchAdminUsers(page, 10),
    keepPreviousData: true
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdminUser,
    onSuccess: () => {
        toast.success("User deleted successfully");
        queryClient.invalidateQueries(['adminUsers']);
        setDeleteId(null);
    },
    onError: () => toast.error("Could not delete user")
  });

  const handleExport = async () => {
    try {
        setDownloading(true);
        const blob = await exportUsersReport();
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Users_Report.csv`);
        document.body.appendChild(link);
        link.click();
        setDownloading(false);
        toast.success("Report downloaded!");
    } catch (e) {
        setDownloading(false);
        toast.error("Export failed");
    }
  };

  return (
    <PageLayout
        breadcrumbs={
            <Button 
                startIcon={<ArrowBackIcon />} 
                onClick={() => navigate('/admin/dashboard')} 
                sx={{ color: 'text.secondary', textTransform: 'none', pl: 0, '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' } }}
            >
                Dashboard
            </Button>
        }
        title="Manage Users"
        actions={
            <Button 
                variant="contained" 
                startIcon={downloading ? <CircularProgress size={20} color="inherit"/> : <FileDownloadIcon />}
                onClick={handleExport}
                disabled={downloading}
                sx={{ bgcolor: '#0d2149' }}
            >
                {downloading ? "Exporting..." : "Export List"}
            </Button>
        }
    >
       <UsersTable 
          users={data?.content || []} 
          onDelete={setDeleteId} 
          loading={isLoading} 
       />
       
       {!isLoading && (
            <Pagination 
                count={data?.totalPages || 1} 
                page={page} 
                onChange={(e, v) => setPage(v)} 
                color="primary" 
                sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}
            />
       )}

       <ConfirmationModal 
          open={!!deleteId}
          title="Delete User"
          message="This will permanently delete the user. Are you sure?"
          onClose={() => setDeleteId(null)}
          onConfirm={() => deleteMutation.mutate(deleteId)}
          loading={deleteMutation.isPending}
       />
    </PageLayout>
  );
};
export default ManageUsersPage;
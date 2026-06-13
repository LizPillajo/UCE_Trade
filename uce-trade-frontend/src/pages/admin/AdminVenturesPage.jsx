import { useState } from 'react';
import { Pagination, CircularProgress, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FileDownloadIcon from '@mui/icons-material/FileDownload'; 
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import VenturesTable from '../../components/admin/VenturesTable';
import VentureFilter from '../../components/ventures/VentureFilter';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { fetchAdminVentures, exportVenturesReport } from '../../services/api';
import { useVentureMutations } from '../../hooks/useVentureMutations'; 
import PageLayout from '../../components/layout/PageLayout'; 

const AdminVenturesPage = () => {
  const navigate = useNavigate();
  const { deleteVenture, changeStatus, isDeleting } = useVentureMutations();
  
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('recent');
  const [deleteId, setDeleteId] = useState(null);
  const [downloading, setDownloading] = useState(false); 

  const { data, isLoading } = useQuery({
    queryKey: ['adminVentures', page, searchTerm, category, sort],
    queryFn: () => fetchAdminVentures(page, searchTerm, category, sort),
    keepPreviousData: true
  });

  const handleExport = async () => {
    try {
        setDownloading(true);
        const blob = await exportVenturesReport();
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Ventures_Report.csv`);
        document.body.appendChild(link);
        link.click();
        setDownloading(false);
    } catch (e) {
        setDownloading(false);
        toast.error("Failed to export");
    }
  };

  return (
    <PageLayout
        // 1. Aquí va el botón de atrás (arriba a la izquierda)
        breadcrumbs={
             <Button 
                startIcon={<ArrowBackIcon />} 
                onClick={() => navigate('/admin/dashboard')} 
                sx={{ color: 'text.secondary', textTransform: 'none', pl: 0, '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' } }}
             >
                Dashboard
             </Button>
        }
        // 2. Aquí va el título grande (abajo del breadcrumb)
        title="Explore Business"
        
        // 3. Aquí va el botón de exportar (arriba a la derecha)
        actions={
             <Button 
                variant="contained" 
                startIcon={downloading ? <CircularProgress size={20} color="inherit"/> : <FileDownloadIcon />}
                onClick={handleExport}
                disabled={downloading}
                sx={{ bgcolor: '#0d2149', fontWeight: 'bold' }}
            >
                {downloading ? "Exporting..." : "Export Report"}
            </Button>
        }
    >
         {/* 4. Importante: showTitle={false} para que no salga DOBLE título */}
         <VentureFilter 
            searchTerm={searchTerm} setSearchTerm={setSearchTerm}
            category={category} setCategory={setCategory}
            sort={sort} setSort={setSort}
            showViewToggles={false}
            showTitle={false} 
            isAdmin={true} 
            initialSort="recent"
         />

         <VenturesTable 
             ventures={data?.content || []} 
             onDelete={setDeleteId}
             onStatusChange={(id, status) => changeStatus({ id, status })} 
             loading={isLoading} 
          />
          
          {!isLoading && (
                 <Pagination 
                    count={data?.totalPages || 1} 
                    page={page} 
                    onChange={(e,v) => setPage(v)} 
                    color="primary" 
                    sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}
                 />
          )}

         <ConfirmationModal 
            open={!!deleteId}
            title="Delete Venture"
            message="Are you sure? This cannot be undone."
            onClose={() => setDeleteId(null)}
            onConfirm={() => { deleteVenture(deleteId); setDeleteId(null); }}
            loading={isDeleting}
         />
    </PageLayout>
  );
};

export default AdminVenturesPage;
// src/pages/public/VentureDetailPage.jsx
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Container, Grid, Box, Typography, Paper, CircularProgress, Alert, Dialog, DialogContent, DialogActions } from '@mui/material';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';

import VentureHero from '../../components/ventures/VentureHero';
import PurchaseSidebar from '../../components/ventures/PurchaseSidebar';
import OwnerCard from '../../components/ventures/OwnerCard';
import ReviewSection from '../../components/ventures/ReviewSection';

import Button from '../../components/ui/Button';
import { toast } from 'react-toastify';
import SeoMeta from '../../components/common/SeoMeta';
import PaymentModal from '../../components/payment/PaymentModal'; 
import { fetchServiceById, downloadInvoice, confirmPayment } from '../../services/api';
import { useAuthStore} from '../../store/authStore';
import BackButton from '../../components/ui/BackButton';

const VentureDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const processedRef = useRef(false);
  const { user } = useAuthStore();

  const [openPayment, setOpenPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); 
  const [downloading, setDownloading] = useState(false); 
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleDownloadInvoice = async () => {
      try {
          setDownloading(true);
          const blob = await downloadInvoice(id); 
          const url = window.URL.createObjectURL(new Blob([blob]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `invoice_${venture?.title}.pdf`);
          document.body.appendChild(link);
          link.click();
          link.parentNode.removeChild(link);
      } catch (error) {
          toast.error("Error generating invoice.");
      } finally {
          setDownloading(false);
      }
  };

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    if (query.get('redirect_status') === 'succeeded' && !processedRef.current) {
      processedRef.current = true;
      setPaymentStatus('succeeded');
      confirmPayment(id).then(() => setShowSuccessModal(true));
    }
  }, [location, id]);

  const { data: venture, isLoading, isError } = useQuery({
    queryKey: ['venture', id],
    queryFn: () => fetchServiceById(id),
    retry: 1
  });

  if (isLoading) return <Box sx={{ pt: 15, display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>;
  if (isError || !venture) return <Box sx={{ pt: 15, textAlign: 'center' }}><Alert severity="error">Service not found.</Alert></Box>;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.info("Link copied to clipboard! 📋");
  };

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', pt: { xs: 10, sm: 12 }, pb: 8 }}>
      <SeoMeta title={venture.title} description={venture.description?.substring(0, 150)} />

      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 } }}>
        <BackButton />

        <Grid container spacing={4}>
          {/* COLUMNA IZQUIERDA */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <VentureHero 
              imageUrl={venture.imageUrl} 
              title={venture.title} 
              onShare={handleShare} 
            />

            <Paper elevation={0} sx={{ p: 4, borderRadius: '16px', border: '1px solid #e5e7eb', bgcolor: 'white' }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom color="#0d2149">Description</Typography>
              <Typography variant="body1" sx={{ color: '#4b5563', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                {venture.description}
              </Typography>
            </Paper>
          </Grid>

          {/* COLUMNA DERECHA */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              
              {/* COMPONENTE DE COMPRA + CONTACTO INTEGRADO */}
              <PurchaseSidebar 
                venture={venture}
                paymentStatus={paymentStatus}
                downloading={downloading}
                onBuy={() => setOpenPayment(true)}
                onDownload={handleDownloadInvoice}
              />

              <OwnerCard 
                owner={venture.owner} 
                onNavigate={() => navigate(`/profile/${venture.owner.id}`)} 
              />
            </Box>
          </Grid>
        </Grid>

        <Box mt={4}>
          <ReviewSection ventureId={id} />
        </Box>
      </Container>

      {/* MODALES */}
      <PaymentModal 
        open={openPayment} 
        handleClose={() => setOpenPayment(false)} 
        ventureId={id} 
        price={venture.price} 
      />

      <Dialog open={showSuccessModal} onClose={() => setShowSuccessModal(false)} PaperProps={{ sx: { borderRadius: '20px', p: 2 } }}>
        <DialogContent sx={{ textAlign: 'center' }}>
          <MarkEmailReadIcon sx={{ fontSize: 60, color: '#10b981', mb: 2 }} />
          <Typography variant="h5" fontWeight="bold">Purchase Successful!</Typography>
          <Typography variant="body2" sx={{ mt: 2, bgcolor: '#f3f4f6', p: 2, borderRadius: '8px' }}>
            Receipt sent to: <b>{user?.email}</b>
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button onClick={() => setShowSuccessModal(false)}>Great, thanks!</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VentureDetailPage;
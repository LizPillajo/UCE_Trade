import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { Box, Typography, CircularProgress } from '@mui/material';
import CheckoutForm from './CheckoutForm';
import api from '../../services/api';
import BaseModal from '../ui/BaseModal';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const PaymentModal = ({ open, handleClose, ventureId, ventureName, price }) => {
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    if (open && ventureId) {
      setClientSecret('');
      api.post('/v1/payments/create-intent', { ventureId, ventureName, amount: price })
        .then(res => setClientSecret(res.data.clientSecret))
        .catch(err => console.error("Error iniciando pago:", err));
    }
  }, [open, ventureId]);

  return (
    <BaseModal
        open={open}
        onClose={handleClose}
        title="Secure Checkout"
        maxWidth="sm"
    >
        {clientSecret ? (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm amount={price} />
          </Elements>
        ) : (
          <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" p={4} gap={2}>
            <CircularProgress size={40} />
            <Typography color="text.secondary">Initializing secure payment...</Typography>
          </Box>
        )}
    </BaseModal>
  );
};

export default PaymentModal;
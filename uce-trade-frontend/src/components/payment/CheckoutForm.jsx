// src/components/payment/CheckoutForm.jsx
import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Typography, Alert, CircularProgress, Box } from '@mui/material';
import Button from '../ui/Button';

const CheckoutForm = ({ amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  
  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      return;
    }

    setIsProcessing(true);

    // 1. Trigger form validation and wallet collection
    const { error: submitError } = await elements.submit();
    if (submitError) {
      setMessage(submitError.message);
      setIsProcessing(false);
      return;
    }

    // 2. Confirm the payment
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.href, // Redirige aquí mismo tras el pago
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`.
    if (error) {
      setMessage(error.message);
    } 
    
    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      <Typography variant="h6" color="#0d2149" mb={2} align="center">
        Total to pay: <b>${amount}</b>
      </Typography>
      
      {/* Contenedor para el elemento de pago */}
      <Box sx={{ minHeight: '200px', mb: 2 }}>
          <PaymentElement />
      </Box>

      {message && <Alert severity="error" sx={{ mt: 2, mb: 2 }}>{message}</Alert>}

      <Button 
        type="submit" 
        disabled={isProcessing || !stripe || !elements} 
        variant="contained" 
        fullWidth
        sx={{ mt: 2, bgcolor: '#0d2149', py: 1.5 }}
      >
        {isProcessing ? <CircularProgress size={24} color="inherit"/> : "Pay Now"}
      </Button>
    </form>
  );
};

export default CheckoutForm;
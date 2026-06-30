import { useState } from 'react';
import { Box, Container, Paper, Typography, Grid, Button, Stack, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQueryClient } from '@tanstack/react-query'; 
import { toast } from 'react-toastify';              

import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { auth as firebaseAuth } from '../../services/firebase'; 
import ImageUploadBox from '../../components/common/ImageUploadBox';
import VentureFormFields from '../../components/ventures/VentureFormFields'; 

const ventureSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long"),
  category: z.string().min(1, "Please select a category"),
  price: z.preprocess((val) => Number(val), z.number().min(1, "Price must be at least $1")),
  description: z.string().min(20, "Description is too short (min 20 chars)"),
});

const CreateVenturePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient(); 
  const { user } = useAuthStore(); 

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(ventureSchema),
    defaultValues: { title: '', category: '', price: '', description: '' }
  });

  const [submitting, setSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [generalError, setGeneralError] = useState('');

  const handleImageUpload = (e) => {
    setGeneralError('');
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file)); 
  };

  const onSubmit = async (data) => {
    if (!selectedFile) {
      setGeneralError("Please upload an image for your service");
      return;
    }

    try {
      setSubmitting(true);
      const token = await firebaseAuth.currentUser?.getIdToken();

      const formData = new FormData();
      formData.append('studentId', user.uid); 
      formData.append('title', data.title);
      formData.append('category', data.category);
      formData.append('price', data.price);
      formData.append('description', data.description);
      formData.append('file', selectedFile); 

      await api.post('/ventures', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}` 
        }
      });
      
      toast.success("Service published successfully! 🚀");
      
      // Delay to allow Kafka -> MS3 eventual consistency before refetching
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['myVentures'] });
        queryClient.invalidateQueries({ queryKey: ['catalog'] });
        queryClient.invalidateQueries({ queryKey: ['featuredVentures'] });
      }, 1500);

      navigate('/student/my-ventures');

    } catch (error) {
      console.error(error);
      setGeneralError('Server error o token inválido. Por favor intenta de nuevo.');
      toast.error("Failed to publish service.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', pt: { xs: 10, sm: 12 }, pb: 8 }}>
      <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3 } }}>
        
        <Box mb={5} textAlign="center">
          <Typography variant="h4" fontWeight="800" color="#0d2149">Publish a new service</Typography>
          <Typography variant="body1" color="text.secondary">Share your talent with the university community.</Typography>
        </Box>

        {generalError && <Alert severity="error" sx={{ mb: 3 }}>{generalError}</Alert>}

        <Paper component="form" onSubmit={handleSubmit(onSubmit)} elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: '24px', border: '1px solid #e5e7eb' }}>
          <Stack spacing={4}>
            <Box>
              <Typography variant="h6" fontWeight="bold" color="#0d2149" mb={3}>1. Basic Information</Typography>
              <Grid container spacing={3}>
                <VentureFormFields register={register} errors={errors} variant="fancy" />
              </Grid>
            </Box>

            <ImageUploadBox 
                preview={preview}
                uploading={false} 
                onUpload={handleImageUpload}
                onRemove={() => { setPreview(null); setSelectedFile(null); }}
                error={generalError && !preview ? "Image is required" : null}
            />

            <Box pt={2} display="flex" gap={2} justifyContent="flex-end">
                <Button variant="text" onClick={() => navigate(-1)} sx={{ color: '#6b7280', fontWeight: 'bold' }}>Cancel</Button>
                <Button 
                    type="submit" variant="contained" size="large"
                    disabled={submitting}
                    sx={{ bgcolor: '#0d2149', borderRadius: '12px', px: 6 }}
                >
                    {submitting ? 'Publishing...' : 'Publish Service'}
                </Button>
            </Box>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default CreateVenturePage;
// src/pages/student/CreateVenturePage.jsx
import { useState } from 'react';
import { Box, Container, Paper, Typography, Grid, Button, Stack, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQueryClient } from '@tanstack/react-query'; 
import { toast } from 'react-toastify';              

import { supabase } from '../../services/supabaseClient';
import api from '../../services/api';
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
  
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(ventureSchema),
    defaultValues: { title: '', category: '', price: '', description: '' }
  });

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState(null);
  const [generalError, setGeneralError] = useState('');

  const handleImageUpload = async (e) => {
    try {
      setGeneralError('');
      setUploading(true);
      
      const file = e.target.files[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage.from('ventures').upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('ventures').getPublicUrl(fileName);

      setPreview(data.publicUrl);
      setValue('imageUrl', data.publicUrl); 
      
    } catch (error) {
      console.error('Supabase Error:', error);
      setGeneralError('Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data) => {
    if (!preview) {
      setGeneralError("Please upload an image for your service");
      return;
    }

    try {
      setSubmitting(true);
      await api.post('/ventures', { ...data, imageUrl: preview });
      
      toast.success("Service published successfully! 🚀");

      queryClient.invalidateQueries({ queryKey: ['myVentures'] });
      queryClient.invalidateQueries({ queryKey: ['studentStats'] }); 

      navigate('/student/my-ventures');

    } catch (error) {
      console.error(error);
      setGeneralError('Server error. Please try again.');
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
            
            {/* Sección 1: Inputs Refactorizados */}
            <Box>
              <Typography variant="h6" fontWeight="bold" color="#0d2149" mb={3}>1. Basic Information</Typography>
              <Grid container spacing={3}>
                <VentureFormFields register={register} errors={errors} variant="fancy" />
              </Grid>
            </Box>

            {/* Sección 2: Imagen */}
            <ImageUploadBox 
                preview={preview}
                uploading={uploading}
                onUpload={handleImageUpload}
                onRemove={() => { setPreview(null); setValue('imageUrl', ''); }}
                error={generalError && !preview ? "Image is required" : null}
            />

            {/* Botones de Acción */}
            <Box pt={2} display="flex" gap={2} justifyContent="flex-end">
                <Button variant="text" onClick={() => navigate(-1)} sx={{ color: '#6b7280', fontWeight: 'bold' }}>Cancel</Button>
                <Button 
                    type="submit" variant="contained" size="large"
                    disabled={submitting || uploading}
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
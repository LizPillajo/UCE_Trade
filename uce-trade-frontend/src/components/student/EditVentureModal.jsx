import { useEffect } from 'react';
import { Grid } from '@mui/material';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '../ui/Button';
import BaseModal from '../ui/BaseModal';
import VentureFormFields from '../ventures/VentureFormFields';

const schema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  category: z.string().min(1, "Please select a category"),
  price: z.preprocess((val) => Number(val), z.number().min(1, "Minimum price is $1")),
  description: z.string().min(20, "Description must be at least 20 characters"),
});

const EditVentureModal = ({ open, handleClose, venture, onSave, loading }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  });

  useEffect(() => {
    if (venture && open) {
      reset({
        title: venture.title || '',
        category: venture.category || '',
        price: venture.price || 0,
        description: venture.description || ''
      });
    }
  }, [venture, open, reset]);

  return (
    <BaseModal
        open={open}
        onClose={handleClose}
        title="Edit Service"
        actions={
            <>
                <Button variant="text" onClick={handleClose} disabled={loading} sx={{ color: '#6b7280' }}>
                    Cancel
                </Button>
                <Button type="submit" form="edit-form" disabled={loading} sx={{ bgcolor: '#0d2149' }}>
                    {loading ? "Saving..." : "Save Changes"}
                </Button>
            </>
        }
    >
        <Grid container spacing={2} pt={1} component="form" id="edit-form" onSubmit={handleSubmit(onSave)}>
           <VentureFormFields register={register} errors={errors} variant="standard" />
        </Grid>
    </BaseModal>
  );
};

export default EditVentureModal;
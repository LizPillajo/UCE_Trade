import { useState } from 'react';
import { Box, Typography, Alert } from '@mui/material';
import Button from '../ui/Button';
import { useAuthStore } from '../../store/authStore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchReviews, postReview } from '../../services/api';
import { useNavigate } from 'react-router-dom';

import ReviewForm from './ReviewForm'; // <--- NUEVO
import ReviewList from './ReviewList'; // <--- NUEVO

const ReviewSection = ({ ventureId }) => {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const { data: reviews } = useQuery({
    queryKey: ['reviews', ventureId],
    queryFn: () => fetchReviews(ventureId)
  });

  const mutation = useMutation({
    mutationFn: (newReview) => postReview(ventureId, newReview),
    onSuccess: () => {
      queryClient.invalidateQueries(['reviews', ventureId]);
      queryClient.invalidateQueries(['venture', ventureId]); 
      setComment('');
      setRating(5);
    }
  });

  const handleSubmit = () => {
    if(!comment.trim()) return;
    mutation.mutate({ rating, comment });
  };

  return (
    <Box mt={6} id="reviews-section">
      <Typography variant="h5" fontWeight="bold" color="#0d2149" mb={3}>
        Reviews & Comments
      </Typography>

      {isAuthenticated ? (
        <ReviewForm 
            user={user}
            rating={rating}
            setRating={setRating}
            comment={comment}
            setComment={setComment}
            onSubmit={handleSubmit}
            isPending={mutation.isPending}
        />
      ) : (
        <Alert severity="info" sx={{ mb: 4 }} action={
            <Button color="inherit" size="small" onClick={() => navigate('/login')}>Login</Button>
        }>
            You must be logged in to rate and comment.
        </Alert>
      )}

      <ReviewList reviews={reviews} />

    </Box>
  );
};

export default ReviewSection;
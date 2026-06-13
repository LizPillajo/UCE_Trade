import { Box, Typography, Rating, Paper, Stack } from '@mui/material';
import RateReviewIcon from '@mui/icons-material/RateReview';
import EmptyState from '../common/EmptyState';
import UserInfoItem from '../common/UserInfoItem'; // <--- IMPORTADO

const ReviewList = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return (
        <EmptyState 
            title="No reviews yet" 
            subtitle="Be the first to share your experience with this service!"
            icon={<RateReviewIcon sx={{ fontSize: 40, color: '#9ca3af' }} />}
            sx={{ py: 2 }} 
        />
    );
  }

  return (
    <Stack spacing={3}>
        {reviews.map((review) => (
            <Paper key={review.id} elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid #eaecf0' }}>
                <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="flex-start">
                    
                    {/* REUTILIZACIÓN AQUÍ */}
                    <UserInfoItem 
                        name={review.user?.fullName}
                        avatar={review.user?.avatarUrl}
                        subtitle={review.user?.faculty || "Verified User"}
                        isVerified={true} 
                    />

                    <Box textAlign="right">
                        <Rating value={review.rating} readOnly size="small" />
                        <Typography variant="caption" color="text.secondary" display="block">
                            {new Date(review.date).toLocaleDateString()}
                        </Typography>
                    </Box>
                </Stack>
                <Typography variant="body2" mt={2} color="text.secondary">
                    {review.comment}
                </Typography>
            </Paper>
        ))}
    </Stack>
  );
};

export default ReviewList;
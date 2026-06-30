import { Box, TextField, Rating, Typography, Paper, Stack, Avatar } from '@mui/material';
import Button from '../ui/Button';

const ReviewForm = ({ user, rating, setRating, comment, setComment, onSubmit, isPending }) => {
  return (
    <Paper elevation={0} sx={{ p: 3, mb: 4, border: '1px solid #e5e7eb', borderRadius: '16px', bgcolor: '#f9fafb' }}>
      <Stack direction="row" spacing={2} alignItems="center" mb={2}>
        <Avatar sx={{ bgcolor: '#efb034' }}>{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</Avatar>
        <Box>
            <Typography variant="subtitle2" fontWeight="bold">{user?.name || "Anonymous"}</Typography>
            <Typography variant="caption" color="text.secondary">Share your experience</Typography>
        </Box>
      </Stack>
      
      <Box mb={2}>
        <Typography component="legend" variant="caption">Rating</Typography>
        <Rating value={rating} onChange={(e, val) => setRating(val)} />
      </Box>

      <TextField 
        fullWidth 
        multiline 
        rows={3} 
        placeholder="Write a comment..." 
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        sx={{ bgcolor: 'white', mb: 2 }}
      />
      
      <Box textAlign="right">
        <Button onClick={onSubmit} disabled={isPending}>
          {isPending ? 'Posting...' : 'Post Review'}
        </Button>
      </Box>
    </Paper>
  );
};

export default ReviewForm;
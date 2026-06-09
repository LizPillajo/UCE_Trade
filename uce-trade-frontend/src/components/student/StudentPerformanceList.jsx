// src/components/student/StudentPerformanceList.jsx
import { Paper, Typography, Box, Stack, Avatar } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

const ServiceItem = ({ rank, title, details, rating }) => (
  <Box 
    display="flex" 
    alignItems="center" 
    justifyContent="space-between" 
    sx={{ 
        borderBottom: '1px solid #f0f0f0', 
        pb: 2, 
        '&:last-child': { borderBottom: 'none', pb: 0 } 
    }}
  >
    <Box display="flex" alignItems="center" gap={2}>
      <Avatar sx={{ 
          bgcolor: rank === 1 ? '#efb034' : '#f3f4f6', 
          color: rank === 1 ? 'white' : '#374151', 
          width: 36, height: 36, fontWeight: 'bold', fontSize: '0.9rem' 
      }}>
        {rank}
      </Avatar>
      <Box>
        <Typography fontWeight="bold" color="#0d2149">{title}</Typography>
        <Typography variant="caption" color="text.secondary">{details}</Typography>
      </Box>
    </Box>
    
    <Box 
      sx={{ 
        bgcolor: '#fffbeb', color: '#b45309', px: 1.5, py: 0.5, 
        borderRadius: '8px', fontSize: '0.85rem', fontWeight: 'bold', 
        display: 'flex', alignItems: 'center', gap: 0.5 
      }}
    >
      <StarIcon sx={{ fontSize: 16 }} /> {rating}
    </Box>
  </Box>
);

const StudentPerformanceList = ({ topServices }) => (
  <Paper sx={{ p: 4, borderRadius: '24px', border: '1px solid #e5e7eb' }} elevation={0}>
    <Typography variant="h6" fontWeight="bold" color="#0d2149" mb={3}>
      Top Performance (Best Rated)
    </Typography>
    
    <Stack spacing={3}>
      {topServices && topServices.length > 0 ? (
        topServices.map((service, index) => (
          <ServiceItem 
            key={index} 
            rank={index + 1} 
            title={service.title} 
            details={`${service.category} • ${service.sales} Sales`} 
            rating={service.rating}
          />
        ))
      ) : (
        <Typography color="text.secondary" align="center" py={2}>
          No ventures data available yet.
        </Typography>
      )}
    </Stack>
  </Paper>
);

export default StudentPerformanceList;
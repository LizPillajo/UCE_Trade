import { Box, Typography } from "@mui/material";

const statsData = [
  { number: "500+", label: "Entrepreneurship" },
  { number: "15", label: "Faculties" },
  { number: "2K+", label: "Active Students" },
];

const HeroStats = () => {
  return (
    <Box
      sx={{
        mt: 6,
        display: "flex",
        justifyContent: "center",
        gap: { xs: 3, md: 10 },
        flexWrap: 'wrap'
      }}
    >
      {statsData.map((stat, index) => (
        <Box key={index} textAlign="center">
          <Typography
            variant="h3"
            fontWeight="bold"
            sx={{ color: "white", fontSize: { xs: '2rem', md: '3rem' } }}
          >
            {stat.number}
          </Typography>
          <Typography
            variant="body1"
            sx={{ opacity: 0.8, fontWeight: 500, color: "white" }}
          >
            {stat.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default HeroStats;
import { Paper, Typography, Box } from "@mui/material";
import { ResponsiveContainer } from "recharts";

const ChartCard = ({ title, height = 300, children, action }) => {
  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 4, 
        borderRadius: "16px", 
        border: "1px solid #e5e7eb", 
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6" fontWeight="bold" color="#0d2149">
            {title}
        </Typography>
        {action && <Box>{action}</Box>}
      </Box>

      {/* Contenedor flexible para el gráfico */}
      <Box sx={{ width: "100%", height: height, flexGrow: 1, minHeight: height }}>
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default ChartCard;
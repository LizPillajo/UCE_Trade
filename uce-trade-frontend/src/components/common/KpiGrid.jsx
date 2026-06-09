import { Grid } from "@mui/material";
import StatCard from "./StatCard"; // Asegúrate de que StatCard esté en la misma carpeta common

const KpiGrid = ({ items }) => {
  if (!items || items.length === 0) return null;

  const mdSize = Math.max(3, 12 / items.length);

  return (
    <Grid container spacing={3} mb={5}>
      {items.map((item, index) => (
        <Grid size={{ xs: 12, sm: 6, md: mdSize }} key={index}>
          <StatCard 
            title={item.title} 
            value={item.value} 
            badge={item.badge} 
            icon={item.icon} 
            color={item.color} 
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default KpiGrid;
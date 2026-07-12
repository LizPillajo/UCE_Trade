import { useState } from 'react';
import { Button, Alert, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useQuery } from '@tanstack/react-query';
import { fetchAdminStats } from '../../services/api';
import { useWebSocket } from "../../hooks/useWebSocket";

import AdminKpiGroup from "../../components/admin/AdminKpiGroup";
import CategoryCharts from "../../components/admin/CategoryCharts";
import GrowthChart from "../../components/admin/GrowthChart";
import { DashboardSkeleton } from '../../components/ui/Skeletons';
import PeriodSelector from '../../components/common/PeriodSelector'; 
import PageLayout from '../../components/layout/PageLayout'; 

const COLORS = ["#0d2149", "#efb034", "#10b981", "#ef4444", "#3b82f6", "#8b5cf6"];

const AdminDashboard = () => {
  const navigate = useNavigate();
  // useWebSocket is now handled globally in App.jsx
  const [period, setPeriod] = useState('ALL');

  const { data: stats, isLoading, isError } = useQuery({
    queryKey: ['adminStats', period],
    queryFn: () => fetchAdminStats(period)
  });

  if (isLoading) return (
     <PageLayout><DashboardSkeleton /></PageLayout>
  );
  
  if (isError) return <PageLayout><Alert severity="error">Error connecting to admin server.</Alert></PageLayout>;

  const safeStats = stats || {};
  const kpiData = safeStats.kpi || {
    totalUsers: 0,
    totalStartups: 0,
    totalRevenue: 0
  };

  const pieData = safeStats.pieData ? Object.entries(safeStats.pieData).map(([name, value], index) => ({
    name: name || "Other",
    value,
    color: COLORS[index % COLORS.length]
  })) : [];

  return (
    <PageLayout 
        title="Admin Panel" 
        subtitle="Real-time platform monitoring"
        actions={
            <>
                <PeriodSelector value={period} onChange={setPeriod} />
                <Button variant="outlined" startIcon={<PersonIcon />} onClick={() => navigate("/admin/users")}>Users</Button>
                <Button variant="contained" startIcon={<FilterListIcon />} onClick={() => navigate("/admin/ventures")} sx={{ bgcolor: "#0d2149" }}>Startups</Button>
            </>
        }
    >
      <AdminKpiGroup kpi={kpiData} />
      <Box mb={5}>
        <GrowthChart data={safeStats.growthData || []} />        
      </Box>
      <CategoryCharts pieData={pieData} />   

    </PageLayout>
  );
};

export default AdminDashboard;
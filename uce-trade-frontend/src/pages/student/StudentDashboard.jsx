import { useState } from 'react';
import { Grid, CircularProgress } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { fetchStudentStats, downloadStudentReport } from '../../services/api';
import { useWebSocket } from '../../hooks/useWebSocket';

import StudentKpiCards from '../../components/student/StudentKpiCards';
import { IncomeHistoryChart, CategoryBarChart } from '../../components/student/StudentCharts';
import StudentPerformanceList from '../../components/student/StudentPerformanceList';
import Button from '../../components/ui/Button'; 
import { DashboardSkeleton } from '../../components/ui/Skeletons';
import PeriodSelector from '../../components/common/PeriodSelector'; 
import PageLayout from '../../components/layout/PageLayout'; 

const StudentDashboard = () => {
  // useWebSocket is now handled globally in App.jsx
  const [period, setPeriod] = useState('ALL');
  const [downloading, setDownloading] = useState(false);

  const { data: stats, isLoading, isError } = useQuery({
    queryKey: ['studentStats', period],
    queryFn: () => fetchStudentStats(period)
  });

  const handleDownload = async () => {
    try {
        setDownloading(true);
        const blob = await downloadStudentReport(period);
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `My_Report_${period}.csv`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        toast.success("Report downloaded! 📄");
    } catch (e) {
        toast.error("Error generating report");
    } finally {
        setDownloading(false);
    }
  };

  if (isLoading) return <PageLayout><DashboardSkeleton /></PageLayout>;
  if (isError) return <PageLayout title="Error">Error loading dashboard.</PageLayout>;

    // Transformaciones de datos
  const safeStats = stats || {};
  const kpiData = safeStats.kpi || {
    totalSales: 0,
    totalRevenue: 0,
    activeServices: 0,
    avgRating: 0
  };

  const lineChartData = safeStats.chartSales 
    ? Object.keys(safeStats.chartSales)
      .map(key => ({ 
        name: key, 
        income: safeStats.chartSales[key] 
      }))
      .sort((a, b) => {
          const [dayA, monthA] = a.name.split('/').map(Number);
          const [dayB, monthB] = b.name.split('/').map(Number);
        
          if (monthA !== monthB) return monthA - monthB;
          return dayA - dayB;
        })
    : [];

  const barChartData = safeStats.chartCategory
    ? Object.keys(safeStats.chartCategory).map(cat => ({ category: cat, value: safeStats.chartCategory[cat] })) 
    : [];

  return (
    <PageLayout 
        title="Dashboard" 
        subtitle="Business overview"
        actions={
            <>
                <PeriodSelector value={period} onChange={setPeriod} />
                <Button 
                    variant="outlined" 
                    startIcon={downloading ? <CircularProgress size={20}/> : <FileDownloadIcon />}
                    onClick={handleDownload}
                    disabled={downloading}
                    sx={{ bgcolor: 'white', borderColor: '#e5e7eb', color: '#0d2149' }}
                >
                    {downloading ? "Exporting..." : "Report"}
                </Button>
            </>
        }
    >
        <StudentKpiCards kpi={kpiData} />
        <IncomeHistoryChart lineData={lineChartData} />

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, lg: 6 }}>
            <CategoryBarChart barData={barChartData} />
          </Grid>
          <Grid size={{ xs: 12, lg: 6 }}>
            <StudentPerformanceList topServices={safeStats.topServices || []} />
          </Grid>
        </Grid>
    </PageLayout>
  );
};

export default StudentDashboard;
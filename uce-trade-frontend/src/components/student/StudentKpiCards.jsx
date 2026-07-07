import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import InventoryIcon from '@mui/icons-material/Inventory';
import MessageIcon from '@mui/icons-material/Message';
import StarIcon from '@mui/icons-material/Star';
import KpiGrid from '../common/KpiGrid'; 

const StudentKpiCards = ({ kpi }) => {
  // Configuración específica del Estudiante
  const items = [
    { title: "Total Earnings", value: `$${kpi?.totalRevenue || 0}`, badge: "Revenue", icon: <TrendingUpIcon />, color: "#10b981"},
    { title: "Active Services", value: kpi?.activeServices || 0, badge: "Published", icon: <InventoryIcon />, color: "#8b5cf6"},
    { title: "Total Sales", value: kpi?.totalSales || 0, badge: "Orders", icon: <MessageIcon />, color: "#3b82f6"},
    { title: "Avg Rating",  value: kpi?.rating || "0.0", badge: "Stars", icon: <StarIcon />, color: "#f59e0b"},
  ];

  return <KpiGrid items={items} />;
};

export default StudentKpiCards;
import StoreIcon from "@mui/icons-material/Store";
import PeopleIcon from "@mui/icons-material/People";
import WarningIcon from "@mui/icons-material/Warning";
import VisibilityIcon from "@mui/icons-material/Visibility";
import KpiGrid from "../common/KpiGrid"; 

const AdminKpiGroup = ({ kpi }) => {
  // Aquí definimos la configuración específica del Admin
  const items = [
    { title: "Total Ventures", value: kpi?.totalVentures, badge: "Live Now", icon: <StoreIcon />, color: "#3b82f6" },
    { title: "Active Users", value: kpi?.activeUsers, badge: "Community", icon: <PeopleIcon />, color: "#8b5cf6" },
    { title: "Pending Review", value: kpi?.pendingApproval, badge: "Needs Action", icon: <WarningIcon />, color: "#ef4444" },
    { title: "Total Transactions", value: kpi?.totalVisits, badge: "Volume", icon: <VisibilityIcon />, color: "#10b981" }
  ];

  return <KpiGrid items={items} />;
};

export default AdminKpiGroup;
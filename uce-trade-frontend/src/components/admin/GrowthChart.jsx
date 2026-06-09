import { Typography } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import ChartCard from "../common/ChartCard";

const GrowthChart = ({ data }) => (
  <ChartCard title="User Growth" height={350}>
      {data.length > 0 ? (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#9ca3af" }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9ca3af" }} />
            <Tooltip />
            <Line type="monotone" dataKey="val" stroke="#efb034" strokeWidth={3} dot={{ r: 4, fill: "#efb034" }} />
          </LineChart>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Typography color="text.secondary">No historical data yet.</Typography>
        </div>
      )}
  </ChartCard>
);

export default GrowthChart;
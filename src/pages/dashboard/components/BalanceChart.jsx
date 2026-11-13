import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import "./BalanceChart.css";

/* =========================
   FORMAT HELPERS
========================= */

// Format date → "1 Jan"
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
};

// Format currency → ₹1.2K / ₹1.5L
const formatCurrency = (value) => {
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
  return `₹${value}`;
};

/* =========================
   CUSTOM TOOLTIP
========================= */

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p className="tooltip-label">{formatDate(label)}</p>
        <p className="tooltip-value">₹{payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

const BalanceChart = ({ transactions }) => {
const data = useMemo(() => {
  const sorted = [...transactions].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const result = [];
  let running = 0;

  for (const tx of sorted) {
    running += tx.type === "income" ? tx.amount : -tx.amount;
    result.push({ date: tx.date, balance: running });
  }

  return result;
}, [transactions]);

  return (
    <div className="chart">
      <div className="chart-header">
        <h4 className="chart-title">Balance Trend</h4>
        <span className="chart-subtitle">Running balance over time</span>
      </div>

      <div className="chart-body">
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="chart-grid" />

            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              className="chart-axis"
            />

            <YAxis tickFormatter={formatCurrency} className="chart-axis" />

            <Tooltip content={<CustomTooltip />} />

            <Line
              type="monotone"
              dataKey="balance"
              stroke="var(--color-primary)"
              strokeWidth={2.5}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BalanceChart;
import "./ChartsSection.css";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";

const COLORS = ["#3b82f6", "#16a34a", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function ChartsSection({
  monthlyTrend,
  balanceTrend,
  categoryBreakdown,
  topCategory,
  formatCurrency,
  formatMonth,
}) {
  const renderPieLabel = ({ percent }) => `${(percent * 100).toFixed(0)}%`;

  return (
    <div className="charts-block">
      <p className="charts-intro">
        {topCategory
          ? `${topCategory.name} has been your biggest driver of spend. Here's the fuller picture across income, balance, and category — over time.`
          : "Here's the fuller picture across income, balance, and category — over time."}
      </p>

      <div className="insights-grid">
        {/* BAR */}
        <div className="chart-card span-2">
          <div className="chart-title">Income vs Expense Trend</div>

          {!(monthlyTrend && monthlyTrend.length > 1) ? (
            <div className="chart-empty">Not enough data to show trend</div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyTrend}>
                <XAxis dataKey="month" tickFormatter={formatMonth} />
                <YAxis />
                <Tooltip
                  formatter={(v) => formatCurrency(v)}
                  labelFormatter={(l) => formatMonth(l)}
                />
                <Bar dataKey="income" fill="#16a34a" radius={[6, 6, 0, 0]} />
                <Bar dataKey="expense" fill="#ef4444" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* PIE */}
        <div className="chart-card">
          <div className="chart-title">Expense Breakdown</div>

          {!categoryBreakdown?.length ? (
            <div className="chart-empty">No category data available</div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label={renderPieLabel}
                >
                  {categoryBreakdown.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>

                <Tooltip formatter={(v) => formatCurrency(v)} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* LINE */}
        <div className="chart-card span-2">
          <div className="chart-title">Balance Movement</div>

          {!balanceTrend?.length ? (
            <div className="chart-empty">Not enough data to show balance trend</div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={balanceTrend}>
                <XAxis
                  dataKey="date"
                  tickFormatter={(d) =>
                    new Date(d).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                    })
                  }
                />
                <YAxis />
                <Tooltip
                  formatter={(v) => formatCurrency(v)}
                  labelFormatter={(l) => new Date(l).toLocaleDateString("en-IN")}
                />
                <Line
                  type="monotone"
                  dataKey="balance"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
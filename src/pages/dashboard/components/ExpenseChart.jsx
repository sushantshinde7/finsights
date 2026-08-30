import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import "./ExpenseChart.css";

const COLORS = [
  "var(--color-chart-blue)",
  "var(--color-chart-green)",
  "var(--color-chart-amber)",
  "var(--color-chart-red)",
  "var(--color-chart-purple)",
];

const LEGEND_LIMIT = 5;

const ExpenseChart = ({ transactions }) => {
  const grouped = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, tx) => {
      acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
      return acc;
    }, {});

  const data = Object.entries(grouped).map(([name, value]) => ({
    name,
    value,
  }));

  // ✅ FIX: compute AFTER data exists
  const total = data.reduce((sum, d) => sum + d.value, 0);

  // Color lookup keyed by category, matching each Cell's fill exactly —
  // computed from `data`'s original order, before any sorting for the legend.
  const colorOf = (name) => {
    const i = data.findIndex((d) => d.name === name);
    return COLORS[i % COLORS.length];
  };

  // Legend: top categories by spend only, capped — a glanceable key,
  // not a full breakdown (that's what Insights is for).
  const sortedForLegend = [...data].sort((a, b) => b.value - a.value);
  const visibleCategories = sortedForLegend.slice(0, LEGEND_LIMIT);
  const remainingCount = sortedForLegend.length - visibleCategories.length;

  return (
    <div className="chart">
      <div className="chart-header">
        <h4 className="chart-title">Expense Breakdown</h4>
        <span className="chart-subtitle">Category-wise distribution</span>
      </div>

      <div className="chart-body">
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={85}
              innerRadius={50}
              paddingAngle={2}
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            {/* CENTER TEXT */}
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="pie-center-text"
            >
              ₹{total.toLocaleString()}
            </text>

            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {data.length > 0 && (
        <div className="expense-legend">
          {visibleCategories.map((c) => (
            <div className="expense-legend-item" key={c.name}>
              <span
                className="expense-legend-dot"
                style={{ background: colorOf(c.name) }}
                aria-hidden="true"
              />
              <span className="expense-legend-name">{c.name}</span>
            </div>
          ))}

          {remainingCount > 0 && (
            <span className="expense-legend-more">
              +{remainingCount} more
            </span>
          )}
        </div>
      )}
    </div>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p className="tooltip-label">{payload[0].name}</p>
        <p className="tooltip-value">
          ₹{payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export default ExpenseChart;
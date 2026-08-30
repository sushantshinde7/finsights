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
} from "recharts";

const COLORS = [
  "var(--color-chart-blue)",
  "var(--color-chart-green)",
  "var(--color-chart-amber)",
  "var(--color-chart-red)",
  "var(--color-chart-purple)",
];

function getIntro(topCategory, expenseChange) {
  const spendTrend =
    expenseChange > 20
      ? "rising fast"
      : expenseChange > 0
      ? "up slightly"
      : "under control";

  if (topCategory) {
    return `${topCategory.name} has been your biggest driver of spend, and with expenses ${spendTrend} this month, here's the full picture — income, balance, and category — over time.`;
  }

  return `With expenses ${spendTrend} this month, here's the fuller picture across income, balance, and category — over time.`;
}

export default function ChartsSection({
  monthlyTrend,
  balanceTrend,
  categoryBreakdown,
  topCategory,
  expenseChange,
  formatCurrency,
  formatMonth,
}) {
  const renderPieLabel = ({ percent }) => `${(percent * 100).toFixed(0)}%`;

  return (
    <div className="charts-block">
      <p className="charts-intro">{getIntro(topCategory, expenseChange)}</p>

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
                <Bar dataKey="income" fill="var(--color-chart-green)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="expense" fill="var(--color-chart-red)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* PIE */}
        <div className="chart-card span-2">
          <div className="chart-title">Expense Breakdown</div>

          {!categoryBreakdown?.length ? (
            <div className="chart-empty">No category data available</div>
          ) : (
            <div className="pie-chart-body">
              <div className="pie-visual">
                <ResponsiveContainer width="100%" height={280}>
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
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="pie-legend-list">
                {(() => {
                  const total = categoryBreakdown.reduce(
                    (sum, c) => sum + c.value,
                    0,
                  );
                  return categoryBreakdown.map((c, i) => {
                    const percent =
                      total > 0 ? Math.round((c.value / total) * 100) : 0;
                    return (
                      <div className="pie-legend-item" key={c.name}>
                        <span
                          className="pie-legend-swatch"
                          style={{ background: COLORS[i % COLORS.length] }}
                          aria-hidden="true"
                        />
                        <span className="pie-legend-name">{c.name}</span>
                        <span className="pie-legend-value">
                          {formatCurrency(c.value)}
                        </span>
                        <span className="pie-legend-percent">{percent}%</span>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
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
                <Line type="monotone" dataKey="balance" stroke="var(--color-primary)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}



import "./KPIGrid.css";

export default function KPIGrid({
  income,
  expense,
  topCategory,
  formatCurrency,
}) {
  return (
    <div className="kpi-strip">
      <div className="kpi-item">
        <span className="kpi-label">Total income</span>
        <span className="kpi-value income">{formatCurrency(income)}</span>
      </div>

      <div className="kpi-divider" aria-hidden="true" />

      <div className="kpi-item">
        <span className="kpi-label">Total expenses</span>
        <span className="kpi-value expense">{formatCurrency(expense)}</span>
      </div>

      <div className="kpi-divider" aria-hidden="true" />

      <div className="kpi-item">
        <span className="kpi-label">Top spending category</span>
        <span className="kpi-value category">
          {topCategory?.name || "—"}
        </span>
      </div>
    </div>
  );
}
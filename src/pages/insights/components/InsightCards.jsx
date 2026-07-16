import "./InsightCards.css";

export default function InsightCards({
  expenseChange,
  biggestTx,
  highestMonth,
  topCategory,
  expense,
  formatCurrency,
}) {
  const isIncrease = expenseChange >= 0;

  const behaviorLabel =
    expenseChange > 20 ? "Rising" : expenseChange > 0 ? "Moderate" : "Controlled";

  const behaviorText =
    expenseChange > 20
      ? "Your expenses are rising fast this month. Worth reviewing non-essential spending before it compounds."
      : expenseChange > 0
      ? "Spending is slightly up this period, but nothing alarming yet — keep an eye on it."
      : "Spending is stable or trending down. You're keeping good control over your budget.";

  const behaviorStatus =
    expenseChange > 20 ? "bad" : expenseChange > 0 ? "warning" : "good";

  const concentration =
    topCategory && expense > 0
      ? Math.round((topCategory.value / expense) * 100)
      : null;

  return (
    <div className="insights-narrative-block">
      {/* FEATURED — spending behavior */}
      <div className={`insight-featured status-${behaviorStatus}`}>
        <div className="featured-top">
          <span className="featured-tag">Spending behavior</span>
          <span className="featured-badge">{behaviorLabel}</span>
        </div>

        <p className="featured-text">{behaviorText}</p>

        <div className="featured-stat">
          <span className={`featured-stat-value ${isIncrease ? "up" : "down"}`}>
            {isIncrease ? "▲" : "▼"} {Math.abs(expenseChange).toFixed(1)}%
          </span>
          <span className="featured-stat-caption">vs last month</span>
        </div>
      </div>

      {/* SECONDARY — supporting facts */}
      <div className="insight-secondary-row">
        {biggestTx && (
          <div className="insight-fact">
            <span className="fact-label">Largest transaction</span>
            <span className="fact-value">{formatCurrency(biggestTx.amount)}</span>
            <span className="fact-caption">
              {biggestTx.category} ·{" "}
              {new Date(biggestTx.date).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
              })}
            </span>
          </div>
        )}

        {highestMonth && (
          <div className="insight-fact">
            <span className="fact-label">Highest spending month</span>
            <span className="fact-value">{highestMonth.month}</span>
            <span className="fact-caption">
              {formatCurrency(highestMonth.expense)} in expenses
            </span>
          </div>
        )}

        {concentration !== null && (
          <div className="insight-fact">
            <span className="fact-label">Category concentration</span>
            <span className={`fact-value ${concentration >= 50 ? "warn" : "good"}`}>
              {concentration}%
            </span>
            <span className="fact-caption">
              {concentration >= 50
                ? `${topCategory.name} alone makes up over half your spend`
                : `${topCategory.name} leads, but spend is fairly spread out`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
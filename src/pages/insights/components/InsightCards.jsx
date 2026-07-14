import "./InsightCards.css";

export default function InsightCards({
  expenseChange,
  biggestTx,
  highestMonth,
  savingsRate,
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

        <div className="insight-fact">
          <span className="fact-label">Savings rate</span>
          <span className={`fact-value ${savingsRate >= 20 ? "good" : "warn"}`}>
            {savingsRate}%
          </span>
          <span className="fact-caption">
            {savingsRate >= 40
              ? "Well above the 20% target"
              : savingsRate >= 20
              ? "Meeting the recommended target"
              : "Below the recommended 20%"}
          </span>
        </div>
      </div>
    </div>
  );
}
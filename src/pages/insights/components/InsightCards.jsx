import { motion } from "framer-motion";
import { fadeUp, staggerContainer, viewportOnce } from "../../../lib/motion";
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
      {/* FEATURED — spending behavior. No CSS hover-transform on this
      element, so it's safe to animate directly, no wrapper needed. */}
      <motion.div
        className={`insight-featured status-${behaviorStatus}`}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={fadeUp}
      >
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
      </motion.div>

      {/* SECONDARY — supporting facts, staggered in as a group */}
      <motion.div
        className="insight-secondary-row"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer(0.08)}
      >
        {biggestTx && (
          <motion.div className="insight-fact" variants={fadeUp}>
            <span className="fact-label">Largest transaction</span>
            <span className="fact-value">{formatCurrency(biggestTx.amount)}</span>
            <span className="fact-caption">
              {biggestTx.category} ·{" "}
              {new Date(biggestTx.date).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
              })}
            </span>
          </motion.div>
        )}

        {highestMonth && (
          <motion.div className="insight-fact" variants={fadeUp}>
            <span className="fact-label">Highest spending month</span>
            <span className="fact-value">{highestMonth.month}</span>
            <span className="fact-caption">
              {formatCurrency(highestMonth.expense)} in expenses
            </span>
          </motion.div>
        )}

        {concentration !== null && (
          <motion.div className="insight-fact" variants={fadeUp}>
            <span className="fact-label">Category concentration</span>
            <span className={`fact-value ${concentration >= 50 ? "warn" : "good"}`}>
              {concentration}%
            </span>
            <span className="fact-caption">
              {concentration >= 50
                ? `${topCategory.name} alone makes up over half your spend`
                : `${topCategory.name} leads, but spend is fairly spread out`}
            </span>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
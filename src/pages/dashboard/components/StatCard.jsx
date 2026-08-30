import { useCountUp } from "../../../lib/motion";
import "./StatCard.css";

const StatCard = ({ title, numericValue, format, icon, type, change }) => {
  const isPositive = change > 0;
  const isNeutral = change === 0;
  const displayValue = useCountUp(numericValue, { format });

  return (
    <div className={`card stat-card ${type}`}>
      {/* HEADER */}
      <div className="stat-header">
        <div className="stat-title-group">
          <span className="stat-icon">{icon}</span>
          <span className="stat-title">{title}</span>
        </div>
      </div>

      {/* BODY — value and trend share the row instead of stacking */}
      <div className="stat-body">
        <span className="stat-value">{displayValue}</span>

        {change !== undefined && (
          <div className="stat-trend">
            <span
              className={`trend-badge ${
                isNeutral ? "neutral" : isPositive ? "positive" : "negative"
              }`}
            >
              {isPositive ? "+" : ""}
              {change}%
            </span>

            <span className="trend-text">vs last month</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
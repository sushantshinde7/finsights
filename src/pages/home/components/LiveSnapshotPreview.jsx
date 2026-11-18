import { useEffect, useState } from "react";
import { useInView } from "../../../hooks/useInView";
import { homePreviewData } from "../../../data/homePreviewData";
import "./LiveSnapshotPreview.css";

const { hero, summary } = homePreviewData;

const DATA = {
  balance: hero.totalBalance,
  balanceIncrease: hero.balanceIncrease,
  income: summary.income,
  incomeChange: summary.incomeChange,
  expense: summary.expenses,
  expenseChange: summary.expenseChange,
  savingsRate: summary.savingsRate,
};

const INSIGHT = {
  text: `Expenses dropped ${Math.abs(DATA.expenseChange)}% compared with last month.`,
  tone: "good",
};

const fmtINR = (n) => `₹${Math.round(n).toLocaleString("en-IN")}`;
const fmtChange = (n) => `${n > 0 ? "+" : ""}${n}%`;

const BALANCE_START = 200;
const BALANCE_DURATION = 600;
const INSIGHT_START = BALANCE_START + BALANCE_DURATION + 80;
const SIDE_START = INSIGHT_START + 150;
const SIDE_DURATION = 500;
const EXPENSE_LAG = 0.15;
const RING_START = SIDE_START + SIDE_DURATION + 120;
const RING_DURATION = 600;

const RING_RADIUS = 30;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

function tween(duration, delay, onUpdate, onDone) {
  const start = performance.now() + delay;
  let frame;

  const tick = (now) => {
    const elapsed = now - start;

    if (elapsed < 0) {
      frame = requestAnimationFrame(tick);
      return;
    }

    const p = Math.min(elapsed / duration, 1);
    onUpdate(1 - Math.pow(1 - p, 3));

    if (p < 1) frame = requestAnimationFrame(tick);
    else onDone?.();
  };

  frame = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(frame);
}

export default function LiveSnapshotPreview() {
  const [containerRef, hasPlayed] = useInView(0.4);
  const [balanceProgress, setBalanceProgress] = useState(0);
  const [insightVisible, setInsightVisible] = useState(false);
  const [sideProgress, setSideProgress] = useState(0);
  const [ringProgress, setRingProgress] = useState(0);

  useEffect(() => {
    if (!hasPlayed) return;

    const cancels = [
      tween(BALANCE_DURATION, BALANCE_START, setBalanceProgress),
      tween(SIDE_DURATION, SIDE_START, setSideProgress),
      tween(RING_DURATION, RING_START, setRingProgress),
    ];

    const insightTimer = setTimeout(
      () => setInsightVisible(true),
      INSIGHT_START,
    );

    return () => {
      clearTimeout(insightTimer);
      cancels.forEach((cancel) => cancel());
    };
  }, [hasPlayed]);

  const balanceValue = DATA.balance * balanceProgress;

  const incomeP = Math.min(sideProgress, 1);
  const expenseP = Math.max(
    0,
    Math.min((sideProgress - EXPENSE_LAG) / (1 - EXPENSE_LAG), 1),
  );

  const incomeValue = DATA.income * incomeP;
  const expenseValue = DATA.expense * expenseP;

  const ringFraction = ringProgress * (DATA.savingsRate / 100);
  const ringOffset = RING_CIRCUMFERENCE * (1 - ringFraction);
  const ringPercent = Math.round(ringFraction * 100);

  return (
    <div className="live-snapshot" ref={containerRef}>
      <div className="home-preview-data-label">
        <span className="home-preview-data-label-dot" />
        Illustrative Preview
      </div>

      <div className="snapshot-grid">
        <div className="snapshot-cell snapshot-cell--balance">
          <span className="snapshot-cell-label">Total Balance</span>
          <span className="snapshot-cell-value snapshot-cell-value--lg">
            {fmtINR(balanceValue)}
          </span>
          <span className="snapshot-trend positive">
            +{fmtINR(DATA.balanceIncrease)} net savings vs last month
          </span>

          <p
            className={`snapshot-insight ${insightVisible ? "is-visible" : ""}`}
          >
            <span
              className={`snapshot-insight-dot dot-${INSIGHT.tone}`}
              aria-hidden="true"
            />
            {INSIGHT.text}
          </p>
        </div>

        <div className="snapshot-cell snapshot-cell--income">
          <span className="snapshot-cell-label">Income</span>
          <span className="snapshot-cell-value">{fmtINR(incomeValue)}</span>
          <span className="snapshot-trend positive">
            {fmtChange(DATA.incomeChange)}
          </span>
        </div>

        <div className="snapshot-cell snapshot-cell--expense">
          <span className="snapshot-cell-label">Expenses</span>
          <span className="snapshot-cell-value">{fmtINR(expenseValue)}</span>
          <span className="snapshot-trend positive">
            {fmtChange(DATA.expenseChange)}
          </span>
        </div>

        <div className="snapshot-cell snapshot-cell--savings">
          <div className="snapshot-ring">
            <svg viewBox="0 0 72 72">
              <circle
                className="snapshot-ring-track"
                cx="36"
                cy="36"
                r={RING_RADIUS}
              />
              <circle
                className="snapshot-ring-fill"
                cx="36"
                cy="36"
                r={RING_RADIUS}
                strokeDasharray={RING_CIRCUMFERENCE}
                strokeDashoffset={ringOffset}
              />
            </svg>
            <span className="snapshot-ring-value">{ringPercent}%</span>
          </div>
          <span className="snapshot-cell-label">Savings Rate</span>
        </div>
      </div>
    </div>
  );
}

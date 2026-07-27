import { useEffect, useState } from "react";
import { useInView } from "./useInView";
import "./InsightVerdictPreview.css";

// Derived from the real getNarrative/getStatus logic in InsightsOverview,
// fed the same Sample 1 figures used in LiveSnapshotPreview (savings
// rate 74%, expense change -55%) — this is what the real page would say.
const DATA = {
  status: "good",
  statusLabel: "On track",
  headline:
    "You're saving exceptionally well — well above the recommended 20%.",
  balance: 442000,
  expenseChange: -55,
  categories: [
    { name: "Rent", percent: 45, color: "#3b82f6", size: "lg" },
    { name: "Groceries", percent: 22, color: "#16a34a", size: "md" },
    { name: "Dining Out", percent: 14, color: "#f59e0b", size: "sm" },
    { name: "Other", percent: 19, color: "#8b5cf6", size: "md2" },
  ],
};

const fmtINR = (n) => `₹${Math.round(n).toLocaleString("en-IN")}`;

const CHIP_START = 150;
const HEADLINE_START = 350;
const HEADLINE_DURATION = 650;
const BALANCE_START = HEADLINE_START + HEADLINE_DURATION + 100; // 1100
const BALANCE_DURATION = 500;
const TILES_START = BALANCE_START + BALANCE_DURATION + 150; // 1750
const TILES_STAGGER = 100;

export default function InsightVerdictPreview() {
  const [containerRef, hasPlayed] = useInView(0.4);
  const [chipVisible, setChipVisible] = useState(false);
  const [headlineRevealed, setHeadlineRevealed] = useState(false);
  const [balanceVisible, setBalanceVisible] = useState(false);
  const [balanceProgress, setBalanceProgress] = useState(0);
  const [tilesVisible, setTilesVisible] = useState(0);

  useEffect(() => {
    if (!hasPlayed) return;

    const timers = [];
    timers.push(setTimeout(() => setChipVisible(true), CHIP_START));
    timers.push(
      setTimeout(() => setHeadlineRevealed(true), HEADLINE_START),
    );

    let frame;
    timers.push(
      setTimeout(() => {
        setBalanceVisible(true);
        const start = performance.now();
        const tick = (now) => {
          const p = Math.min((now - start) / BALANCE_DURATION, 1);
          setBalanceProgress(1 - Math.pow(1 - p, 3));
          if (p < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      }, BALANCE_START),
    );

    DATA.categories.forEach((_, i) =>
      timers.push(
        setTimeout(
          () => setTilesVisible(i + 1),
          TILES_START + i * TILES_STAGGER,
        ),
      ),
    );

    return () => {
      timers.forEach(clearTimeout);
      cancelAnimationFrame(frame);
    };
  }, [hasPlayed]);

  const isExpenseUp = DATA.expenseChange >= 0;
  const balanceValue = DATA.balance * balanceProgress;

  return (
    <div className="verdict-preview" ref={containerRef}>
      <div className="verdict-preview-top">
        <span className="verdict-preview-eyebrow">Financial Insights</span>
        <span
          className={`verdict-preview-chip status-${DATA.status} ${
            chipVisible ? "is-visible" : ""
          }`}
        >
          {DATA.statusLabel}
        </span>
      </div>

      <div className="verdict-preview-headline-wrap">
        <h3 className="verdict-preview-headline">{DATA.headline}</h3>
        <span
          className={`verdict-preview-curtain ${
            headlineRevealed ? "is-revealed" : ""
          }`}
          aria-hidden="true"
        />
      </div>

      <div
        className={`verdict-preview-balance ${
          balanceVisible ? "is-visible" : ""
        }`}
      >
        <span className="verdict-preview-balance-label">
          Net balance this month
        </span>
        <div className="verdict-preview-balance-row">
          <span className="verdict-preview-balance-value">
            {fmtINR(balanceValue)}
          </span>
          <span
            className={`verdict-preview-trend ${isExpenseUp ? "up" : "down"}`}
          >
            {isExpenseUp ? "▲" : "▼"} {Math.abs(DATA.expenseChange)}% vs last
            month
          </span>
        </div>
      </div>

      <div className="verdict-preview-tiles">
        {DATA.categories.map((cat, i) => (
          <div
            key={cat.name}
            className={`verdict-tile verdict-tile--${cat.size} ${
              i < tilesVisible ? "is-visible" : ""
            }`}
            style={{ background: cat.color }}
          >
            <span className="verdict-tile-name">{cat.name}</span>
            <span className="verdict-tile-percent">{cat.percent}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
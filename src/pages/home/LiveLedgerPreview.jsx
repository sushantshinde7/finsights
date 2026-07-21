import { useEffect, useRef, useState } from "react";
import {
  Briefcase,
  ShoppingCart,
  Home,
  Laptop,
  UtensilsCrossed,
} from "lucide-react";
import "./LiveLedgerPreview.css";

const TRANSACTIONS = [
  { id: 1, category: "Salary", type: "income", amount: 68000, Icon: Briefcase },
  { id: 2, category: "Groceries", type: "expense", amount: 4200, Icon: ShoppingCart },
  { id: 3, category: "Rent", type: "expense", amount: 18000, Icon: Home },
  { id: 4, category: "Freelance", type: "income", amount: 12500, Icon: Laptop },
  { id: 5, category: "Dining Out", type: "expense", amount: 2100, Icon: UtensilsCrossed },
];

const MAX_AMOUNT = Math.max(...TRANSACTIONS.map((t) => t.amount));

const INCOME_TOTAL = TRANSACTIONS.filter((t) => t.type === "income").reduce(
  (s, t) => s + t.amount,
  0,
);
const EXPENSE_TOTAL = TRANSACTIONS.filter((t) => t.type === "expense").reduce(
  (s, t) => s + t.amount,
  0,
);
const SPLIT_TOTAL = INCOME_TOTAL + EXPENSE_TOTAL;
const INCOME_PCT = (INCOME_TOTAL / SPLIT_TOTAL) * 100;
const EXPENSE_PCT = 100 - INCOME_PCT;

// Running net balance after each transaction, in display order —
// this is what the header figure tweens toward as each row lands.
const RUNNING_NET = TRANSACTIONS.reduce((acc, tx, i) => {
  const prev = i === 0 ? 0 : acc[i - 1];
  const delta = tx.type === "income" ? tx.amount : -tx.amount;
  acc.push(prev + delta);
  return acc;
}, []);

const SPLIT_BAR_DURATION = 500; // ms, plays first
const ROW_START_DELAY = 550; // ms before first row appears (after split bar)
const ROW_STAGGER = 150; // ms between each row appearing
const COUNT_DURATION = 350; // ms for the net figure to tween per step

const formatINR = (n) => `₹${Math.abs(Math.round(n)).toLocaleString("en-IN")}`;

export default function LiveLedgerPreview() {
  const containerRef = useRef(null);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [splitReady, setSplitReady] = useState(false);
  const [visibleCount, setVisibleCount] = useState(0);
  const [displayedNet, setDisplayedNet] = useState(0);

  // Play once, when the widget scrolls into view — not on page load,
  // and never again after that (no looping).
  useEffect(() => {
    const el = containerRef.current;
    if (!el || hasPlayed) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setHasPlayed(true);
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasPlayed]);

  // Split bar draws in first
  useEffect(() => {
    if (!hasPlayed) return;
    const t = setTimeout(() => setSplitReady(true), 30);
    return () => clearTimeout(t);
  }, [hasPlayed]);

  // Then rows stagger in, one at a time
  useEffect(() => {
    if (!hasPlayed) return;

    const timers = TRANSACTIONS.map((_, i) =>
      setTimeout(
        () => setVisibleCount(i + 1),
        ROW_START_DELAY + i * ROW_STAGGER,
      ),
    );

    return () => timers.forEach(clearTimeout);
  }, [hasPlayed]);

  // Tween the net figure toward the new running total each time a row lands
  useEffect(() => {
    if (visibleCount === 0) return;

    const from = visibleCount > 1 ? RUNNING_NET[visibleCount - 2] : 0;
    const to = RUNNING_NET[visibleCount - 1];
    const start = performance.now();
    let frame;

    const tick = (now) => {
      const progress = Math.min((now - start) / COUNT_DURATION, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplayedNet(from + (to - from) * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [visibleCount]);

  const isPositive = displayedNet >= 0;
  const isDone = visibleCount === TRANSACTIONS.length;

  return (
    <div className="live-ledger" ref={containerRef}>
      <div className="live-ledger-header">
        <span className="live-ledger-label">Recent Activity</span>
        <span className="live-ledger-badge">
          <span className="live-dot" aria-hidden="true" />
          Live
        </span>
      </div>

      {/* Income vs expense split bar */}
      <div className="live-ledger-split" aria-hidden="true">
        <span
          className="live-ledger-split-income"
          style={{ width: splitReady ? `${INCOME_PCT}%` : "0%" }}
        />
        <span
          className="live-ledger-split-expense"
          style={{ width: splitReady ? `${EXPENSE_PCT}%` : "0%" }}
        />
      </div>

      <div className="live-ledger-net">
        <span className="live-ledger-net-label">Net Balance</span>
        <span
          className={`live-ledger-net-value ${
            isPositive ? "positive" : "negative"
          } ${isDone ? "settled" : ""}`}
        >
          {isPositive ? "+" : "−"}
          {formatINR(displayedNet)}
        </span>
      </div>

      <div className="live-ledger-rows">
        {TRANSACTIONS.map((tx, i) => {
          const revealed = i < visibleCount;
          const fillPct = (tx.amount / MAX_AMOUNT) * 100;
          const Icon = tx.Icon;

          return (
            <div
              key={tx.id}
              className={`live-ledger-row ${revealed ? "is-visible" : ""}`}
            >
              <span
                className="live-ledger-row-fill"
                style={{ width: revealed ? `${fillPct}%` : "0%" }}
                data-type={tx.type}
                aria-hidden="true"
              />

              <span className={`live-ledger-icon icon-${tx.type}`}>
                <Icon size={13} />
              </span>

              <span className="live-ledger-category">{tx.category}</span>

              <span className={`live-ledger-amount ${tx.type}`}>
                {tx.type === "income" ? "+" : "−"}
                {formatINR(tx.amount)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
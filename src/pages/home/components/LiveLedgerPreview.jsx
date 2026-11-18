import { useEffect, useState } from "react";
import {
  Briefcase,
  ShoppingCart,
  Home,
  Laptop,
  GraduationCap,
} from "lucide-react";
import { useInView } from "../../../hooks/useInView";
import { homePreviewData } from "../../../data/homePreviewData";
import "./LiveLedgerPreview.css";

const ICONS = {
  Salary: Briefcase,
  "Home Loan EMI": Home,
  Groceries: ShoppingCart,
  Consulting: Laptop,
  "School Fees": GraduationCap,
};

const TRANSACTIONS = homePreviewData.recentTransactions.map((tx) => ({
  ...tx,
  Icon: ICONS[tx.category],
}));

const MAX_AMOUNT = Math.max(...TRANSACTIONS.map((t) => t.amount));

const INCOME_TOTAL = TRANSACTIONS.filter((t) => t.type === "income").reduce(
  (sum, t) => sum + t.amount,
  0,
);

const EXPENSE_TOTAL = TRANSACTIONS.filter((t) => t.type === "expense").reduce(
  (sum, t) => sum + t.amount,
  0,
);

const SPLIT_TOTAL = INCOME_TOTAL + EXPENSE_TOTAL;
const INCOME_PCT = (INCOME_TOTAL / SPLIT_TOTAL) * 100;
const EXPENSE_PCT = 100 - INCOME_PCT;

const RUNNING_NET = TRANSACTIONS.reduce((acc, tx, i) => {
  const prev = i === 0 ? 0 : acc[i - 1];
  const delta = tx.type === "income" ? tx.amount : -tx.amount;
  acc.push(prev + delta);
  return acc;
}, []);

const SPLIT_BAR_DURATION = 500;
const ROW_START_DELAY = 550;
const ROW_STAGGER = 150;
const COUNT_DURATION = 350;

const formatINR = (n) => `₹${Math.abs(Math.round(n)).toLocaleString("en-IN")}`;

export default function LiveLedgerPreview() {
  const [containerRef, hasPlayed] = useInView(0.4);
  const [splitReady, setSplitReady] = useState(false);
  const [visibleCount, setVisibleCount] = useState(0);
  const [displayedNet, setDisplayedNet] = useState(0);

  useEffect(() => {
    if (!hasPlayed) return;

    const t = setTimeout(() => setSplitReady(true), 30);
    return () => clearTimeout(t);
  }, [hasPlayed]);

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

  useEffect(() => {
    if (visibleCount === 0) return;

    const from = visibleCount > 1 ? RUNNING_NET[visibleCount - 2] : 0;

    const to = RUNNING_NET[visibleCount - 1];
    const start = performance.now();
    let frame;

    const tick = (now) => {
      const progress = Math.min((now - start) / COUNT_DURATION, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

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

        <div className="home-preview-data-label">
          <span className="home-preview-data-label-dot" />
          Illustrative Preview
        </div>
      </div>

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
        <span className="live-ledger-net-label">Net from shown activity</span>
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

import { motion, MotionConfig } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTransactions } from "../../context/TransactionContext";
import { ROUTES } from "../../routes/routes";
import { fadeUp, viewportOnce } from "../../lib/motion";

import InsightsOverview from "./components/InsightsOverview";
import InsightCards from "./components/InsightCards";
import ChartsSection from "./components/ChartsSection";

import "./insights.css";

export default function InsightsPage() {
  const navigate = useNavigate();
  const {
    transactions,
    income,
    expense,
    balance,
    categoryBreakdown,
    monthlyTrend,
    balanceTrend,
    expenseChange,
  } = useTransactions();

  const formatCurrency = (v) => `₹${v.toLocaleString("en-IN")}`;

  /* ── Derived values ─────────────────────────────────────── */
  const topCategory = [...categoryBreakdown].sort(
    (a, b) => b.value - a.value,
  )[0];

  const savingsRate =
    income > 0 ? Math.round(((income - expense) / income) * 100) : 0;

  const biggestTx = [...transactions].sort((a, b) => b.amount - a.amount)[0];

  const highestMonth = [...monthlyTrend].sort(
    (a, b) => b.expense - a.expense,
  )[0];

  /* ── Empty state ────────────────────────────────────────── */
  const isEmpty =
    !monthlyTrend?.length &&
    !balanceTrend?.length &&
    !categoryBreakdown?.length;

  if (isEmpty) {
    return (
      <MotionConfig reducedMotion="user">
        <div className="insights-container">
          <motion.div
            className="insights-empty"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <div className="insights-empty-icon" aria-hidden="true">
              📊
            </div>
            <h3 className="insights-empty-title">No insights available yet</h3>
            <p className="insights-empty-subtitle">
              Add transactions to unlock charts and financial insights
            </p>
            <button
              className="insights-empty-cta"
              onClick={() => navigate(ROUTES.TRANSACTIONS)}
            >
              Go to transactions
            </button>
          </motion.div>
        </div>
      </MotionConfig>
    );
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="insights-container">
        <InsightsOverview
          balance={balance}
          savingsRate={savingsRate}
          expenseChange={expenseChange}
          income={income}
          expense={expense}
          topCategory={topCategory}
          formatCurrency={formatCurrency}
        />

        {/* SECTION — SPENDING PATTERNS */}
        <section className="insights-section">
          <motion.h3
            className="insights-section-label"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeUp}
          >
            Spending patterns
          </motion.h3>
          <InsightCards
            expenseChange={expenseChange}
            biggestTx={biggestTx}
            highestMonth={highestMonth}
            topCategory={topCategory}
            expense={expense}
            formatCurrency={formatCurrency}
          />
        </section>

        {/* SECTION — CHARTS */}
        <section className="insights-section">
          <motion.h3
            className="insights-section-label"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeUp}
          >
            Trends and breakdown
          </motion.h3>
          <ChartsSection
            monthlyTrend={monthlyTrend}
            balanceTrend={balanceTrend}
            categoryBreakdown={categoryBreakdown}
            topCategory={topCategory}
            expenseChange={expenseChange}
            formatCurrency={formatCurrency}
            formatMonth={(m) => m}
          />
        </section>
      </div>
    </MotionConfig>
  );
}
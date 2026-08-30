import { Wallet, ArrowUpRight, ArrowDownRight, ArrowRight, PiggyBank } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import StatCard from "./components/StatCard";
import BalanceChart from "./components/BalanceChart";
import ExpenseChart from "./components/ExpenseChart";
import { useTransactions } from "../../context/TransactionContext";
import { ROUTES } from "../../routes/routes";
import { fadeUp, fadeIn, staggerContainer, viewportOnce } from "../../lib/motion";
import "./dashboard.css";

export default function DashboardPage() {
  const {
    transactions,
    income,
    expense,
    balance,
    incomeChange,
    expenseChange,
    balanceChange,
  } = useTransactions();

  /* ── Period label ───────────────────────────────────────────
     Find the most recent transaction date and use its month
     as the "current period" label in the page header.
  ────────────────────────────────────────────────────────────── */
  const periodLabel = (() => {
    if (!transactions.length) return null;
    const latest = [...transactions].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    )[0];
    return new Date(latest.date).toLocaleString("en-IN", {
      month: "long",
      year: "numeric",
    });
  })();

  /* ── Savings rate ────────────────────────────────────────────
     Shared by the insight line and the Savings Rate stat card.
  ────────────────────────────────────────────────────────────── */
  const savingsRate = income > 0
    ? Math.round(((income - expense) / income) * 100)
    : 0;

  /* ── Quick insight ───────────────────────────────────────────
     One derived line from existing analytics, plus a tone so the
     page header can carry the same red/amber/green language as
     Insights — just as a quiet dot, not a status chip.
  ────────────────────────────────────────────────────────────── */
  const insight = (() => {
    if (!transactions.length) return null;

    if (expenseChange < -20)
      return {
        text: `Expenses dropped ${Math.abs(expenseChange)}% vs last month — your best controlled month recently.`,
        tone: "good",
      };
    if (expenseChange > 20)
      return {
        text: `Expenses rose ${expenseChange}% vs last month. Worth reviewing non-essential spending.`,
        tone: "bad",
      };
    if (savingsRate > 40)
      return {
        text: `You're saving ${savingsRate}% of your income — strong financial position.`,
        tone: "good",
      };
    if (savingsRate < 10)
      return {
        text: `Savings rate is ${savingsRate}%. Income and expenses are close — watch the gap.`,
        tone: "warning",
      };
    return {
      text: `Savings rate is ${savingsRate}% this period.`,
      tone: "neutral",
    };
  })();

  /* ── Charts intro ────────────────────────────────────────────
     One line tying the charts back to the insight above them,
     framed as the "proof" rather than a new, disconnected topic.
  ────────────────────────────────────────────────────────────── */
  const chartsIntro = insight
    ? insight.tone === "good"
      ? "Here's what got you here."
      : insight.tone === "bad" || insight.tone === "warning"
      ? "Here's where it's showing up."
      : "Here's the movement behind the numbers."
    : null;

  /* ── Balance card tone ────────────────────────────────────────
     Total Balance is the page's headline number, so it carries
     the same tone as the header dot instead of a static color —
     one shared signal instead of a decoration repeated by itself.
  ────────────────────────────────────────────────────────────── */
  const balanceCardType =
    insight && insight.tone !== "neutral"
      ? `balance-${insight.tone}`
      : "balance";

  /* ── Recent transactions ────────────────────────────────────
     Last 5 by date — shown in the bottom strip.
  ────────────────────────────────────────────────────────────── */
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <MotionConfig reducedMotion="user">
      <div className="dashboard">

        {/* PAGE HEADER — animates on mount, same treatment as the
        homepage hero, since this is above the fold on every load. */}
        <motion.div
          className="dashboard-header"
          initial="hidden"
          animate="visible"
          variants={staggerContainer(0.1)}
        >
          <motion.div className="dashboard-heading-row" variants={fadeUp}>
            <h2 className="dashboard-title">Overview</h2>
            {periodLabel && (
              <span className="dashboard-period">{periodLabel}</span>
            )}
          </motion.div>

          {insight && (
            <motion.p className="dashboard-insight" variants={fadeUp}>
              <span
                className={`insight-dot dot-${insight.tone}`}
                aria-hidden="true"
              />
              {insight.text}
            </motion.p>
          )}
        </motion.div>

        {/* STAT CARDS — also mount-triggered, staggered right after
        the header so the eye lands on numbers a beat later. Values
        are now raw numbers + a formatter, so StatCard can count
        them up on load instead of just displaying a static string. */}
        <motion.div
          className="cards-row"
          initial="hidden"
          animate="visible"
          variants={staggerContainer(0.08, 0.15)}
        >
          <motion.div variants={fadeUp}>
            <StatCard
              title="Total Balance"
              numericValue={balance}
              format={(n) => `₹${Math.round(n).toLocaleString("en-IN")}`}
              icon={<Wallet size={18} />}
              type={balanceCardType}
              change={balanceChange}
            />
          </motion.div>
          <motion.div variants={fadeUp}>
            <StatCard
              title="Income"
              numericValue={income}
              format={(n) => `₹${Math.round(n).toLocaleString("en-IN")}`}
              icon={<ArrowUpRight size={18} />}
              type="income"
              change={incomeChange}
            />
          </motion.div>
          <motion.div variants={fadeUp}>
            <StatCard
              title="Expenses"
              numericValue={expense}
              format={(n) => `₹${Math.round(n).toLocaleString("en-IN")}`}
              icon={<ArrowDownRight size={18} />}
              type="expense"
              change={expenseChange}
            />
          </motion.div>
          <motion.div variants={fadeUp}>
            <StatCard
              title="Savings Rate"
              numericValue={savingsRate}
              format={(n) => `${Math.round(n)}%`}
              icon={<PiggyBank size={18} />}
              type="savings"
            />
          </motion.div>
        </motion.div>

        {/* CHARTS — scroll-triggered; each chart card is wrapped in
        a plain motion.div so the entrance animation doesn't touch
        .chart-card's own transform, which its :hover rule already owns. */}
        <motion.div
          className="dashboard-charts-block"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer(0.12)}
        >
          {chartsIntro && (
            <motion.p className="dashboard-charts-intro" variants={fadeUp}>
              {chartsIntro}
            </motion.p>
          )}
          <div className="charts-row">
            <motion.div variants={fadeUp}>
              <div className="card chart-card">
                <BalanceChart transactions={transactions} />
              </div>
            </motion.div>
            <motion.div variants={fadeUp}>
              <div className="card chart-card">
                <ExpenseChart transactions={transactions} />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* RECENT TRANSACTIONS STRIP — AnimatePresence here because
        this block's presence is conditional on async data resolving,
        not just scroll position. A smooth fade-in when the data
        actually arrives is more honest than an abrupt pop. */}
        <AnimatePresence>
          {recentTransactions.length > 0 && (
            <motion.div
              key="recent-section"
              className="card recent-section"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="recent-header">
                <h3 className="recent-title">Recent transactions</h3>
                <Link to={ROUTES.TRANSACTIONS} className="recent-view-all">
                  View all <ArrowRight size={13} aria-hidden="true" />
                </Link>
              </div>
              <motion.div
                className="recent-list"
                initial="hidden"
                animate="visible"
                variants={staggerContainer(0.05, 0.1)}
              >
                {recentTransactions.map((tx) => (
                  <motion.div key={tx.id} className="recent-row" variants={fadeIn}>
                    <div className="recent-row-left">
                      <span className={`recent-dot recent-dot--${tx.type}`} aria-hidden="true" />
                      <div>
                        <span className="recent-category">{tx.category}</span>
                        <span className="recent-date">
                          {new Date(tx.date).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                    <span className={`recent-amount recent-amount--${tx.type}`}>
                      {tx.type === "income" ? "+" : "−"}₹{tx.amount.toLocaleString("en-IN")}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* BOTTOM LINK */}
        <motion.div
          className="dashboard-footer"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeIn}
        >
          <Link to={ROUTES.INSIGHTS} className="dashboard-footer-link">
            View detailed financial insights <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </motion.div>

      </div>
    </MotionConfig>
  );
}
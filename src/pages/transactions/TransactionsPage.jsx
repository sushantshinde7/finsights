import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";

import TransactionsTable from "./components/TransactionsTable";
import TableControls from "./components/TableControls";
import AddTransactionModal from "./components/AddTransactionModal";

import FilterModal from "./components/FilterModal";
import AuthPrompt from "../../components/auth/AuthPrompt";

import { useTransactions } from "../../context/TransactionContext";
import { useAuth } from "../../context/AuthContext";

import { fadeUp, staggerContainer } from "../../lib/motion";

import "./transactions.css";
import {
  Plus,
  Upload,
  Download,
  ChevronDown,
} from "lucide-react";

const EASE = [0.22, 1, 0.36, 1];

const MIN_AMOUNT = 0;
const MAX_AMOUNT = 100000;

const DEFAULT_FILTERS = {
  type: "all",
  categories: [],
  dateRange: "all",
  amountRange: {
    min: MIN_AMOUNT,
    max: MAX_AMOUNT,
  },
};

export default function TransactionsPage() {
  const {
    transactions,
    activeSample,
    loadSample,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useTransactions();
  const { isAuthenticated, isGuest, loading } = useAuth();
  console.log({ isAuthenticated, isGuest, loading });

  const [searchTerm, setSearchTerm] = useState(() => {
    return localStorage.getItem("finance-dashboard-search") || "";
  });

  useEffect(() => {
    localStorage.setItem("finance-dashboard-search", searchTerm);
  }, [searchTerm]);

  const [sortField, setSortField] = useState(() => {
    return localStorage.getItem("finance-dashboard-sort-field") || "date";
  });
  useEffect(() => {
    localStorage.setItem("finance-dashboard-sort-field", sortField);
  }, [sortField]);

  const [sortOrder, setSortOrder] = useState(() => {
    return localStorage.getItem("finance-dashboard-sort-order") || "desc";
  });

  useEffect(() => {
    localStorage.setItem("finance-dashboard-sort-order", sortOrder);
  }, [sortOrder]);

  const [showModal, setShowModal] = useState(false);
  const [showFiltersModal, setShowFiltersModal] = useState(false);

  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  const [editingTx, setEditingTx] = useState(null);

  const [toast, setToast] = useState(null);

  const [filters, setFilters] = useState(() => {
    try {
      const saved = localStorage.getItem("finance-dashboard-filters");

      return saved ? JSON.parse(saved) : DEFAULT_FILTERS;
    } catch {
      return DEFAULT_FILTERS;
    }
  });

  useEffect(() => {
    localStorage.setItem("finance-dashboard-filters", JSON.stringify(filters));
  }, [filters]);

  const resetTransactionView = () => {
    setSearchTerm("");
    setSortField("date");
    setSortOrder("desc");
    setFilters(DEFAULT_FILTERS);

    localStorage.removeItem("finance-dashboard-search");
    localStorage.removeItem("finance-dashboard-sort-field");
    localStorage.removeItem("finance-dashboard-sort-order");
    localStorage.removeItem("finance-dashboard-filters");
  };

  // 2. add handler — after resetTransactionView()
  const handleLoadSample = (key) => {
    loadSample(key);
    resetTransactionView();
  };

  const categories = useMemo(() => {
    return [...new Set(transactions.map((tx) => tx.category))].sort();
  }, [transactions]);

  const overviewStats = useMemo(() => {
    const totalVolume = transactions.reduce((sum, tx) => sum + tx.amount, 0);

    return {
      transactionCount: transactions.length,
      categoryCount: categories.length,
      datasetLabel:
        activeSample === "sample1"
          ? "Personal Finance"
          : activeSample === "sample2"
            ? "Senior Professional"
            : "Custom Dataset",
      totalVolume,
    };
  }, [transactions, categories, activeSample]);

  const activeFilterCount = useMemo(() => {
    let count = 0;

    if (filters.type !== "all") count++;

    if (filters.categories.length > 0) count++;

    if (filters.dateRange !== "all") count++;

    if (
      filters.amountRange.min !== MIN_AMOUNT ||
      filters.amountRange.max !== MAX_AMOUNT
    ) {
      count++;
    }

    return count;
  }, [filters]);

  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);

    localStorage.removeItem("finance-dashboard-filters");
  };

  const filterSummary = [];

  if (filters.type !== "all") {
    filterSummary.push(
      filters.type.charAt(0).toUpperCase() + filters.type.slice(1),
    );
  }

  if (filters.categories.length > 0) {
    filterSummary.push(
      filters.categories.length === 1
        ? filters.categories[0]
        : `${filters.categories.length} Categories`,
    );
  }

  const dateLabels = {
    "7d": "Last 7 Days",
    "15d": "Last 15 Days",
    "30d": "Last 30 Days",
    "90d": "Last 90 Days",
    "1y": "Last 1 Year",
  };

  if (filters.dateRange !== "all") {
    filterSummary.push(dateLabels[filters.dateRange]);
  }

  if (
    filters.amountRange.min !== MIN_AMOUNT ||
    filters.amountRange.max !== MAX_AMOUNT
  ) {
    filterSummary.push(
      `₹${filters.amountRange.min.toLocaleString(
        "en-IN",
      )}–₹${filters.amountRange.max.toLocaleString("en-IN")}`,
    );
  }

  const processedTransactions = [...transactions]
    .filter((tx) => {
      /* TYPE */

      const typeMatch =
        filters.type === "all" ? true : tx.type === filters.type;

      if (!typeMatch) return false;

      /* CATEGORY */

      const categoryMatch =
        filters.categories.length === 0
          ? true
          : filters.categories.includes(tx.category);

      if (!categoryMatch) return false;

      /* AMOUNT */

      const amountMatch =
        tx.amount >= filters.amountRange.min &&
        tx.amount <= filters.amountRange.max;

      if (!amountMatch) return false;

      /* DATE RANGE */

      if (filters.dateRange !== "all") {
        const txDate = new Date(tx.date);
        const now = new Date();

        const diffDays = (now - txDate) / (1000 * 60 * 60 * 24);

        const limits = {
          "7d": 7,
          "15d": 15,
          "30d": 30,
          "90d": 90,
          "1y": 365,
        };

        const limit = limits[filters.dateRange];

        if (limit && diffDays > limit) {
          return false;
        }
      }

      /* SEARCH */

      const query = searchTerm.trim().toLowerCase();

      if (!query) return true;

      const formattedDate = new Date(tx.date)
        .toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
        .toLowerCase();

      return (
        tx.category.toLowerCase().includes(query) ||
        tx.type.toLowerCase().includes(query) ||
        tx.amount.toString().includes(query) ||
        formattedDate.includes(query)
      );
    })
    .sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case "amount":
          comparison = a.amount - b.amount;
          break;

        case "category":
          comparison = a.category.localeCompare(b.category);
          break;

        case "date":
        default:
          comparison = new Date(a.date) - new Date(b.date);
      }

      return sortOrder === "asc" ? comparison : comparison * -1;
    });

  const summary = useMemo(() => {
    const income = processedTransactions
      .filter((tx) => tx.type === "income")
      .reduce((sum, tx) => sum + tx.amount, 0);

    const expense = processedTransactions
      .filter((tx) => tx.type === "expense")
      .reduce((sum, tx) => sum + tx.amount, 0);

    return {
      count: processedTransactions.length,
      income,
      expense,
      net: income - expense,
    };
  }, [processedTransactions]);

  const handleAdd = (tx) => {
    addTransaction(tx);
  };

  const handleUpdate = (tx) => {
    updateTransaction(tx);
  };

  const handleDelete = (id) => {
    if (!isAuthenticated) {
      setShowAuthPrompt(true);
      return;
    }

    const deleted = transactions.find((t) => t.id === id);

    if (!deleted) return;

    deleteTransaction(id);

    setToast({
      message: "Transaction deleted",

      actionLabel: "Undo",

      onAction: () => {
        addTransaction(deleted);
        setToast(null);
      },
    });

    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const getEmptyState = () => {
    if (transactions.length === 0) {
      return {
        title: "No transactions yet",
        subtitle: "Add your first transaction to get started",
      };
    }

    if (searchTerm.trim()) {
      return {
        title: "No matching transactions",
        subtitle: "Try a different search term",
      };
    }

    if (activeFilterCount > 0) {
      return {
        title: "No transactions found",
        subtitle: "Try adjusting your filters",
      };
    }

    return {
      title: "No transactions found",
      subtitle: "Try adjusting filters",
    };
  };

  const emptyState = getEmptyState();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl + K → Focus Search
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();

        document.querySelector(".search-input")?.focus();

        return;
      }

      // Escape → Clear Search
      if (e.key === "Escape" && searchTerm) {
        setSearchTerm("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchTerm]);

  const balanceStatus =
    summary.net > 0
      ? "Healthy Surplus"
      : summary.net < 0
        ? "Overspending"
        : "Break-even";

  return (
    <MotionConfig reducedMotion="user">
      <section
        className="transactions-overview"
        aria-label="Transactions overview"
      >
        {/* PAGE HEADER — mount-triggered stagger, above the fold on
        every load, same treatment as Dashboard's header. */}
        <div className="transactions-header">
          <motion.div
            className="transactions-header-top"
            initial="hidden"
            animate="visible"
            variants={staggerContainer(0.1)}
          >
            <motion.h1 className="transactions-title" variants={fadeUp}>
              Transactions
            </motion.h1>

            <motion.p className="transactions-subtitle" variants={fadeUp}>
              Manage, search, filter and organize your financial activity.
            </motion.p>

            <motion.div className="header-actions" variants={fadeUp}>
              <button
                className="btn-add"
                onClick={() => {
                  if (!isAuthenticated) {
                    setShowAuthPrompt(true);
                    return;
                  }
                  setShowModal(true);
                }}
              >
                <span aria-hidden="true"><Plus size={16} /></span> Add Transaction
              </button>

              <button
                className="btn-transfer"
                onClick={() => {
                  if (!isAuthenticated) {
                    setShowAuthPrompt(true);
                    return;
                  }
                  /* import logic later */
                }}
              >
                <span aria-hidden="true"><Upload size={15} /> </span> Import
              </button>

              <button
                className="btn-transfer"
                disabled={transactions.length === 0}
                onClick={() => {
                  if (!isAuthenticated) {
                    setShowAuthPrompt(true);
                    return;
                  }
                  /* export logic later */
                }}
              >
                <span aria-hidden="true"><Download size={15} /></span> Export
              </button>

              <div className="sample-wrapper">
                <button className="btn-transfer btn-sample">
                  Sample <span aria-hidden="true"><ChevronDown size={15} /></span>
                </button>

                <div className="sample-dropdown">
                  <button
                    className={`sample-item ${activeSample === "sample1" ? "sample-item--active" : ""}`}
                    onClick={() => handleLoadSample("sample1")}
                  >
                    <span className="sample-dot dot-blue" />
                    Personal finance
                    {activeSample === "sample1" && (
                      <span className="sample-check">✓</span>
                    )}
                  </button>

                  <button
                    className={`sample-item ${activeSample === "sample2" ? "sample-item--active" : ""}`}
                    onClick={() => handleLoadSample("sample2")}
                  >
                    <span className="sample-dot dot-green" />
                    Senior professional
                    {activeSample === "sample2" && (
                      <span className="sample-check">✓</span>
                    )}
                  </button>

                  <button
                    className="sample-item sample-item--danger"
                    onClick={() => handleLoadSample("clear")}
                  >
                    Clear all data
                  </button>
                </div>
              </div>
            </motion.div>

            {transactions.length > 0 && (
              <motion.div variants={fadeUp}>
                <p className="transactions-context">
                  View, search and manage your complete transaction history in one place. Filter by category, amount or date, sort records instantly, and switch between sample datasets to explore different financial scenarios and workflows.
                </p>

                <div className="transactions-meta">
                  <span className="meta-pill">{overviewStats.datasetLabel}</span>
                  <span className="meta-pill">
                    {overviewStats.transactionCount} Transactions
                  </span>
                  <span className="meta-pill">
                    {overviewStats.categoryCount} Categories
                  </span>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* SUMMARY BAR — AnimatePresence keyed to `transactions.length`,
        not `processedTransactions.length`, so this only mounts/unmounts
        on dataset-level changes (load sample, clear data) — never on
        every search/filter keystroke, which would just look like flicker. */}
        <AnimatePresence>
          {transactions.length > 0 && (
            <motion.section
              key="summary-bar"
              className="summary-bar"
              aria-label="Transaction summary"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <div className="summary-item">
                <span className="summary-label">Transactions</span>
                <span className="summary-value">{summary.count}</span>
                {/*<span className="summary-status">{balanceStatus}</span>*/}
              </div>
              <div className="summary-item">
                <span className="summary-label">Income</span>
                <span className="summary-value summary-income">
                  ₹{summary.income.toLocaleString("en-IN")}
                </span>
                {/*<span className="summary-status">{balanceStatus}</span>*/}
              </div>
              <div className="summary-item">
                <span className="summary-label">Expenses</span>
                <span className="summary-value summary-expense">
                  ₹{summary.expense.toLocaleString("en-IN")}
                </span>
                {/*<span className="summary-status">{balanceStatus}</span>*/}
              </div>
              <div className="summary-item">
                <span className="summary-label">Net Balance</span>

                <span
                  className={`summary-value ${
                    summary.net >= 0 ? "summary-net-pos" : "summary-net-neg"
                  }`}
                >
                  {summary.net >= 0 ? "+" : ""}₹
                  {Math.abs(summary.net).toLocaleString("en-IN")}
                </span>

                {/*<span className="summary-status">{balanceStatus}</span>*/}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* CARD — mount-triggered fadeUp, arrives after the header/summary */}
        <motion.div
          className="card transactions-panel"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: EASE }}
        >
          <div className="panel-filters">
            <TableControls
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              sortField={sortField}
              setSortField={setSortField}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              resultCount={processedTransactions.length}
              activeFilterCount={activeFilterCount}
              onOpenFilters={() => setShowFiltersModal(true)}
              filterSummary={filterSummary}
              onClearFilters={clearFilters}
            />
          </div>
          <div className="panel-divider" />
          <div className="panel-table">
            <TransactionsTable
              data={processedTransactions}
              emptyState={emptyState}
              onAddClick={() => {
                if (!isAuthenticated) {
                  setShowAuthPrompt(true);
                  return;
                }
                setShowModal(true);
              }}
              onEdit={(tx) => {
                if (!isAuthenticated) {
                  setShowAuthPrompt(true);
                  return;
                }
                setEditingTx(tx);
                setShowModal(true);
              }}
              onDelete={handleDelete}
            />
          </div>
        </motion.div>

        {/* MODALS — opacity-only wrapper. Deliberately NOT animating
        scale/x/y here: a transform on this wrapper would create a new
        containing block, which breaks `position: fixed` inside the
        modal components (they almost certainly use it). Opacity alone
        is safe regardless of their internal CSS. For a scale-in on the
        modal's inner card specifically, that has to happen inside the
        modal component itself, targeting the inner element — not this
        wrapper. */}
        <AnimatePresence>
          {showFiltersModal && (
            <motion.div
              key="filter-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <FilterModal
                isOpen={showFiltersModal}
                onClose={() => setShowFiltersModal(false)}
                filters={filters}
                setFilters={setFilters}
                categories={categories}
                minAmount={MIN_AMOUNT}
                maxAmount={MAX_AMOUNT}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* TOAST — x: "-50%" is included in every state on purpose.
        This element used to rely on a CSS `transform: translateX(-50%)`
        for centering; once it's a motion element, Framer's inline
        transform replaces the CSS one entirely, so the centering has
        to be re-declared inside Framer's own animate/exit states. */}
        <AnimatePresence>
          {toast && (
            <motion.div
              key="toast"
              className="toast"
              initial={{ opacity: 0, y: 20, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 12, x: "-50%" }}
              transition={{ duration: 0.25, ease: EASE }}
            >
              <span>{toast.message}</span>
              <button className="toast-action" onClick={toast.onAction}>
                {toast.actionLabel}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showModal && (
            <motion.div
              key={editingTx ? `edit-${editingTx.id}` : "add"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <AddTransactionModal
                mode={editingTx ? "edit" : "add"}
                initialData={editingTx}
                onClose={() => {
                  setShowModal(false);
                  setEditingTx(null);
                }}
                onAdd={handleAdd}
                onUpdate={handleUpdate}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showAuthPrompt && (
            <motion.div
              key="auth-prompt"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <AuthPrompt onClose={() => setShowAuthPrompt(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </MotionConfig>
  );
}
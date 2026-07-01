import { useMemo, useState, useEffect } from "react";

import TransactionsTable from "./components/TransactionsTable";
import TransactionFilters from "./components/TransactionFilters";
import AddTransactionModal from "./components/AddTransactionModal";

import FilterModal from "./components/FilterModal";
import AuthPrompt from "../../components/auth/AuthPrompt";

import { useTransactions } from "../../context/TransactionContext";
import { useAuth } from "../../context/AuthContext";

import "./transactions.css";

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
  const { transactions, addTransaction, updateTransaction, deleteTransaction } =
    useTransactions();

  const { isAuthenticated } = useAuth();

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

  const categories = useMemo(() => {
    return [...new Set(transactions.map((tx) => tx.category))].sort();
  }, [transactions]);

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

  return (
    <div className="transactions-container">
      {/* PAGE HEADER */}
      <div className="transactions-header">
        <h2 className="transactions-title">Transactions</h2>

        <div className="header-actions">
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
            <span aria-hidden="true">+</span> Add
          </button>

          <button
            className="btn-secondary"
            onClick={() => {
              if (!isAuthenticated) {
                setShowAuthPrompt(true);
                return;
              }
              /* import logic later */
            }}
          >
            ↑ Import
          </button>

          <button
            className="btn-secondary"
            onClick={() => {
              if (!isAuthenticated) {
                setShowAuthPrompt(true);
                return;
              }
              /* export logic later */
            }}
          >
            ↓ Export
          </button>

          <div className="sample-wrapper">
            <button className="btn-secondary btn-sample">
              Sample <span className="sample-chevron">▾</span>
            </button>
            <div className="sample-dropdown">
              <button
                className="sample-item"
                onClick={() => {
                  /* load sample 1 */
                }}
              >
                <span className="sample-dot dot-blue" />
                Personal finance
              </button>
              <button
                className="sample-item"
                onClick={() => {
                  /* load sample 2 */
                }}
              >
                <span className="sample-dot dot-green" />
                Business expenses
              </button>
              <button
                className="sample-item sample-item--danger"
                onClick={resetTransactionView}
              >
                Clear sample data
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SUMMARY BAR */}
      {transactions.length > 0 && (
        <div
          className="summary-bar"
          role="region"
          aria-label="Transaction summary"
        >
          <div className="summary-item">
            <span className="summary-label">Transactions</span>
            <span className="summary-value">{summary.count}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Income</span>
            <span className="summary-value summary-income">
              ₹{summary.income.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Expenses</span>
            <span className="summary-value summary-expense">
              ₹{summary.expense.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Net</span>
            <span
              className={`summary-value ${summary.net >= 0 ? "summary-net-pos" : "summary-net-neg"}`}
            >
              {summary.net >= 0 ? "+" : ""}₹
              {Math.abs(summary.net).toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      )}

      {/* CARD */}
      <div className="card transactions-panel">
        <div className="panel-filters">
          <TransactionFilters
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
      </div>

      {/* MODALS + TOAST — unchanged */}
      {showFiltersModal && (
        <FilterModal
          isOpen={showFiltersModal}
          onClose={() => setShowFiltersModal(false)}
          filters={filters}
          setFilters={setFilters}
          categories={categories}
          minAmount={MIN_AMOUNT}
          maxAmount={MAX_AMOUNT}
        />
      )}
      {toast && (
        <div className="toast">
          <span>{toast.message}</span>
          <button className="toast-action" onClick={toast.onAction}>
            {toast.actionLabel}
          </button>
        </div>
      )}
      {showModal && (
        <AddTransactionModal
          key={editingTx ? editingTx.id : "new"}
          mode={editingTx ? "edit" : "add"}
          initialData={editingTx}
          onClose={() => {
            setShowModal(false);
            setEditingTx(null);
          }}
          onAdd={handleAdd}
          onUpdate={handleUpdate}
        />
      )}
      {showAuthPrompt && (
        <AuthPrompt onClose={() => setShowAuthPrompt(false)} />
      )}
    </div>
  );
}

import { useMemo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";

import TransactionsTable from "./components/TransactionsTable";
import TableControls from "./components/TableControls";
import AddTransactionModal from "./components/AddTransactionModal";
import ImportSummaryModal from "./components/ImportSummaryModal";
import ImportModal from "./components/ImportModal";
import ExportModal from "./components/ExportModal";
import FilterModal from "./components/FilterModal";
import AuthPrompt from "../../components/auth/AuthPrompt";

import { useTransactions } from "../../context/TransactionContext";
import { useAuth } from "../../context/AuthContext";

import {
  validateTransactionsCSV,
  datasetNameFromFile,
  transactionsToCSV,
  exportFileName,
  downloadCSV,
  downloadTemplate,
  MAX_FILE_BYTES,
} from "../../lib/csv";

import { fadeUp, staggerContainer } from "../../lib/motion";

import "./transactions.css";
import { Plus, Upload, Download, ChevronDown } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1];

const KIND_LABELS = {
  sample: "Sample dataset",
  custom: "Custom dataset",
  imported: "Imported file",
};

function InfoTip({ text }) {
  return (
    <button
      type="button"
      className="info-tip"
      data-tip={text}
      aria-label={text}
    >
      i
    </button>
  );
}

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
    activeDataset,
    datasets,
    maxImportedDatasets,
    switchDataset,
    importDataset,
    deleteDataset,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useTransactions();

  const activeInfo =
    datasets.find((d) => d.id === activeDataset.id) ?? datasets[0];

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
  const [importReport, setImportReport] = useState(null);
  const [showExport, setShowExport] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const toastTimer = useRef(null);
  const fileInputRef = useRef(null);

  const showToast = (message, options = {}) => {
    clearTimeout(toastTimer.current);
    setToast({ message, ...options });
    toastTimer.current = setTimeout(
      () => setToast(null),
      options.duration ?? 4000,
    );
  };

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
  const [showDatasetMenu, setShowDatasetMenu] = useState(false);
  const datasetMenuRef = useRef(null);

  // close on outside click / Escape
  useEffect(() => {
    if (!showDatasetMenu) return;

    const onPointerDown = (e) => {
      if (
        datasetMenuRef.current &&
        !datasetMenuRef.current.contains(e.target)
      ) {
        setShowDatasetMenu(false);
      }
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") setShowDatasetMenu(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [showDatasetMenu]);

  const handleSwitchDataset = (id) => {
    setShowDatasetMenu(false);
    if (id === activeDataset.id) return;
    switchDataset(id);
    resetTransactionView();
  };

  const handleDeleteDataset = (e, ds) => {
    e.stopPropagation();
    if (!window.confirm(`Delete "${ds.name}"? This can't be undone.`)) return;
    const wasActive = ds.id === activeDataset.id;
    deleteDataset(ds.id);
    if (wasActive) resetTransactionView();
  };

  const samples = datasets.filter((d) => d.kind === "sample");
  const customs = datasets.filter((d) => d.kind === "custom");
  const importeds = datasets.filter((d) => d.kind === "imported");

  const renderDatasetItem = (ds) => {
    const isActive = ds.id === activeDataset.id;
    return (
      <div
        key={ds.id}
        className={`dataset-row ${isActive ? "dataset-row--active" : ""}`}
      >
        <button
          type="button"
          className="dataset-item"
          onClick={() => handleSwitchDataset(ds.id)}
        >
          <span className="dataset-name">{ds.name}</span>
          <span className="dataset-count">{ds.count}</span>
          {isActive && <span className="sample-check">✓</span>}
        </button>

        {ds.kind === "imported" && (
          <button
            type="button"
            className="dataset-remove"
            aria-label={`Delete ${ds.name}`}
            onClick={(e) => handleDeleteDataset(e, ds)}
          >
            ✕
          </button>
        )}
      </div>
    );
  };

  const handleImportClick = () => {
    if (!isAuthenticated) {
      setShowAuthPrompt(true);
      return;
    }
    setShowImportDialog(true);
  };

  const handleChooseFile = () => {
    setShowImportDialog(false);
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // lets the same file be chosen again later
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".csv")) {
      showToast("Please choose a .csv file.", { duration: 5000 });
      return;
    }

    if (file.size > MAX_FILE_BYTES) {
      showToast("That file is too large (max 1 MB).", { duration: 5000 });
      return;
    }

    let text;
    try {
      text = await file.text();
    } catch {
      showToast("Couldn't read that file.", { duration: 5000 });
      return;
    }

    const result = validateTransactionsCSV(text);

    if (!result.ok) {
      showToast(result.error, { duration: 6000 });
      return;
    }

    if (result.rows.length === 0) {
      // Header only, no data lines at all
      if (result.skipped.length === 0) {
        showToast("That file has a header but no transactions.", {
          duration: 6000,
        });
        return;
      }

      // Every row was bad: show why, create nothing
      setImportReport({
        fileName: file.name,
        datasetName: null,
        importedCount: 0,
        skipped: result.skipped,
      });
      return;
    }

    const imported = importDataset({
      name: datasetNameFromFile(file.name),
      rows: result.rows,
    });

    if (!imported.ok) {
      showToast(
        imported.reason === "limit"
          ? `You can keep up to ${maxImportedDatasets} imported datasets. Delete one first.`
          : "Import failed.",
        { duration: 6000 },
      );
      return;
    }

    resetTransactionView();

    const count = result.rows.length;

    if (result.skipped.length > 0) {
      // Some rows were bad: a toast is too easy to miss, so open the report
      setImportReport({
        fileName: file.name,
        datasetName: imported.name,
        importedCount: count,
        skipped: result.skipped,
      });
    } else {
      showToast(
        `Imported "${imported.name}": ${count} transaction${count === 1 ? "" : "s"}`,
        { duration: 5000 },
      );
    }
  };

  const exportFile = exportFileName(activeDataset.name);

  const handleExportClick = () => {
    if (!isAuthenticated) {
      setShowAuthPrompt(true);
      return;
    }
    setShowExport(true);
  };

  const handleExportConfirm = (scope) => {
    const rows =
      scope === "results"
        ? processedTransactions
        : [...transactions].sort((a, b) => b.date.localeCompare(a.date));

    downloadCSV(transactionsToCSV(rows), exportFile);
    setShowExport(false);

    showToast(
      `Exported ${rows.length} transaction${rows.length === 1 ? "" : "s"}`,
      { duration: 4000 },
    );
  };

  const categories = useMemo(() => {
    return [...new Set(transactions.map((tx) => tx.category))].sort();
  }, [transactions]);

  const overviewStats = useMemo(() => {
    const totalVolume = transactions.reduce((sum, tx) => sum + tx.amount, 0);

    return {
      transactionCount: transactions.length,
      categoryCount: categories.length,
      datasetLabel: activeDataset.name,
      totalVolume,
    };
  }, [transactions, categories, activeDataset]);

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

  const isViewFiltered = activeFilterCount > 0 || searchTerm.trim() !== "";

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
    const income = transactions
      .filter((tx) => tx.type === "income")
      .reduce((sum, tx) => sum + tx.amount, 0);

    const expense = transactions
      .filter((tx) => tx.type === "expense")
      .reduce((sum, tx) => sum + tx.amount, 0);

    return {
      count: transactions.length,
      income,
      expense,
      net: income - expense,
    };
  }, [transactions]);

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

    showToast("Transaction deleted", {
      actionLabel: "Undo",
      onAction: () => {
        addTransaction(deleted);
        setToast(null);
      },
    });
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
                <span aria-hidden="true">
                  <Plus size={16} />
                </span>{" "}
                Add Transaction
              </button>

              <button className="btn-transfer" onClick={handleImportClick}>
                <span aria-hidden="true">
                  <Upload size={15} />{" "}
                </span>{" "}
                Import
              </button>

              <input
                type="file"
                accept=".csv,text/csv"
                ref={fileInputRef}
                onChange={handleFileSelected}
                hidden
              />

              <button
                className="btn-transfer"
                disabled={transactions.length === 0}
                onClick={handleExportClick}
              >
                <span aria-hidden="true">
                  <Download size={15} />
                </span>{" "}
                Export
              </button>

              <div className="sample-wrapper" ref={datasetMenuRef}>
                <button
                  type="button"
                  className="btn-transfer btn-sample"
                  aria-label={`Active dataset: ${activeDataset.name}. Change dataset`}
                  aria-haspopup="menu"
                  aria-expanded={showDatasetMenu}
                  onClick={() => setShowDatasetMenu((open) => !open)}
                >
                  <span className="dataset-btn-name">{activeDataset.name}</span>
                  <span aria-hidden="true">
                    <ChevronDown size={15} />
                  </span>
                </button>

                {showDatasetMenu && (
                  <div className="sample-dropdown" role="menu">
                    <p className="dataset-section-title">Samples</p>
                    {samples.map(renderDatasetItem)}

                    <p className="dataset-section-title">Custom</p>
                    {customs.map(renderDatasetItem)}

                    <p className="dataset-section-title">Imported</p>
                    {importeds.length > 0 ? (
                      importeds.map(renderDatasetItem)
                    ) : (
                      <p className="dataset-empty">Nothing imported yet</p>
                    )}
                  </div>
                )}
              </div>
            </motion.div>

            {transactions.length > 0 && (
              <motion.div variants={fadeUp}>
                <p className="transactions-context">
                  View, search and manage your complete transaction history in
                  one place. Filter by category, amount or date, sort records
                  instantly, and switch between sample datasets to explore
                  different financial scenarios and workflows.
                </p>

                <div className="transactions-meta">
                  <span className="meta-pill">
                    {KIND_LABELS[activeInfo.kind]}
                  </span>
                  <span className="meta-pill">
                    {overviewStats.categoryCount} categories
                  </span>
                  {activeInfo.originalCount !== null && (
                    <span className="meta-pill">
                      {activeInfo.originalCount} original transactions
                    </span>
                  )}
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
                <span className="summary-label">
                  Total transactions
                  <InfoTip text="All Total(original + newly added/removed) rows in this dataset right now. Filters don't change it." />
                </span>
                <span className="summary-value">{summary.count}</span>
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

        <AnimatePresence>
          {showImportDialog && (
            <motion.div
              key="import-dialog"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ImportModal
                importedCount={importeds.length}
                maxImported={maxImportedDatasets}
                onClose={() => setShowImportDialog(false)}
                onChooseFile={handleChooseFile}
                onDownloadTemplate={downloadTemplate}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {importReport && (
            <motion.div
              key="import-report"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ImportSummaryModal
                report={importReport}
                onClose={() => setImportReport(null)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showExport && (
            <motion.div
              key="export-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ExportModal
                datasetName={activeDataset.name}
                totalCount={transactions.length}
                resultsCount={processedTransactions.length}
                isFiltered={isViewFiltered}
                fileName={exportFile}
                onClose={() => setShowExport(false)}
                onConfirm={handleExportConfirm}
              />
            </motion.div>
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
              {toast.actionLabel && (
                <button className="toast-action" onClick={toast.onAction}>
                  {toast.actionLabel}
                </button>
              )}
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

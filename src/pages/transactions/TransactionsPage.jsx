import { useState } from "react";
import TransactionsTable from "./components/TransactionsTable";
import TransactionFilters from "./components/TransactionFilters";
import AddTransactionModal from "./components/AddTransactionModal";
import { useTransactions } from "../../hooks/useTransactions";

import "./transactions.css";

export default function TransactionsPage() {
  const { transactions, addTransaction, updateTransaction, deleteTransaction } =
    useTransactions();

  const [filterType, setFilterType] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");

  const [showModal, setShowModal] = useState(false);
  const [editingTx, setEditingTx] = useState(null);
  const [toast, setToast] = useState(null);

  const processedTransactions = [...transactions]
    .filter((tx) => (filterType === "all" ? true : tx.type === filterType))
    .sort((a, b) =>
      sortOrder === "asc"
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date),
    );

  const handleAdd = (tx) => addTransaction(tx);

  const handleUpdate = (tx) => updateTransaction(tx);

  const handleDelete = (id) => {
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

    setTimeout(() => setToast(null), 4000);
  };

  /* ================= EMPTY STATE LOGIC ================= */

  const getEmptyState = () => {
    if (transactions.length === 0) {
      return {
        title: "No transactions yet",
        subtitle: "Add your first transaction to get started",
      };
    }

    if (filterType === "income") {
      return {
        title: "No income transactions",
        subtitle: "Try changing filters or add income",
      };
    }

    if (filterType === "expense") {
      return {
        title: "No expense transactions",
        subtitle: "Try changing filters or add expenses",
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
      {/* ================= HEADER ================= */}
      <div className="transactions-header">
        <h2 className="transactions-title">Transactions</h2>

        <button className="add-btn" onClick={() => setShowModal(true)}>
          + Add
        </button>
      </div>

      {/* ================= UNIFIED PANEL ================= */}
      <div className="card transactions-panel">
        {/* Filters */}
        <div className="panel-filters">
          <TransactionFilters
            filterType={filterType}
            setFilterType={setFilterType}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />
        </div>

        {/* Divider */}
        <div className="panel-divider" />

        {/* Table */}
        <div className="panel-table">
          <TransactionsTable
            data={processedTransactions}
            emptyState={emptyState}
            onAddClick={() => setShowModal(true)}
            onEdit={(tx) => {
              setEditingTx(tx);
              setShowModal(true);
            }}
            onDelete={handleDelete}
          />
        </div>
      </div>

      {/* ================= TOAST ================= */}
      {toast && (
        <div className="toast">
          <span>{toast.message}</span>
          <button className="toast-action" onClick={toast.onAction}>
            {toast.actionLabel}
          </button>
        </div>
      )}

      {/* ================= MODAL ================= */}
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
    </div>
  );
}

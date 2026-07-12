import { useEffect, useState } from "react";
import "./AddTransactionModal.css";

export default function AddTransactionModal({
  onClose,
  onAdd,
  onUpdate,
  mode = "add",
  initialData,
}) {
  const [form, setForm] = useState({
    date: "",
    amount: "",
    category: "",
    type: "expense",
  });

  const [initialSnapshot, setInitialSnapshot] = useState(null);

  // PREFILL for edit
  useEffect(() => {
    if (mode === "edit" && initialData) {
      const data = {
        ...initialData,
        amount: String(initialData.amount),
      };

      setForm(data);
      setInitialSnapshot(data);
    }
  }, [mode, initialData]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);

    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // dirty check
  const isDirty = JSON.stringify(form) !== JSON.stringify(initialSnapshot);

  // ✅ VALIDATION
  const isValid = form.date && form.amount && form.category;

  const handleSubmit = () => {
    if (!isValid) return;

    const payload = {
      ...form,
      amount: Number(form.amount),
    };

    if (mode === "edit") {
      if (!isDirty) {
        onClose();
        return;
      }

      onUpdate(payload);
    } else {
      onAdd(payload);
    }

    onClose();
  };

  return (
    // ✅ OVERLAY CLICK CLOSE
    <div className="modal-overlay" onClick={onClose}>
      {/* ✅ STOP PROPAGATION */}
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close modal"
        >
          ✕
        </button>
        <h3 className="modal-title">
          {mode === "edit" ? "Edit Transaction" : "Add Transaction"}
        </h3>

        <div className="modal-form">
          <div className="modal-field">
            <label htmlFor="tx-date" className="modal-label">
              Date
            </label>
            <input
              id="tx-date"
              type="date"
              autoFocus
              name="date"
              value={form.date}
              onChange={handleChange}
              className="modal-input"
              max={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="modal-field">
            <label htmlFor="tx-amount" className="modal-label">
              Amount (₹)
            </label>
            <input
              id="tx-amount"
              type="number"
              name="amount"
              placeholder="0"
              min="1"
              value={form.amount}
              onChange={handleChange}
              className="modal-input"
            />
          </div>

          <div className="modal-field">
            <label htmlFor="tx-category" className="modal-label">
              Category
            </label>
            <input
              id="tx-category"
              type="text"
              name="category"
              placeholder="e.g. Food, Salary"
              value={form.category}
              onChange={handleChange}
              className="modal-input"
            />
          </div>

          <div className="modal-field">
            <label htmlFor="tx-type" className="modal-label">
              Type
            </label>
            <select
              id="tx-type"
              name="type"
              value={form.type}
              onChange={handleChange}
              className="modal-input"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
        </div>

        <div className="modal-actions">
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>

          {/* disable when form invalid */}
          <button
            onClick={handleSubmit}
            className="btn-primary"
            disabled={!isValid}
          >
            {mode === "edit" ? "Save Changes" : "Add Transaction"}
          </button>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { EASE } from "../../../lib/motion";
import "./ExportModal.css";

const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

export default function ExportModal({
  datasetName,
  totalCount,
  resultsCount,
  isFiltered,
  fileName,
  onClose,
  onConfirm,
}) {
  const [scope, setScope] = useState("all");

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const resultsDisabled = resultsCount === 0;

  return (
    <motion.div
      className="modal-overlay"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label="Export transactions"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.22, ease: EASE }}
      >
        <button className="modal-close-btn" onClick={onClose} aria-label="Close">
          ✕
        </button>

        <h3 className="modal-title">Export "{datasetName}"</h3>

        {isFiltered ? (
          <div className="export-options">
            <label
              className={`export-option ${scope === "all" ? "export-option--selected" : ""}`}
            >
              <input
                type="radio"
                name="export-scope"
                checked={scope === "all"}
                onChange={() => setScope("all")}
              />
              <span className="export-option-text">
                <span className="export-option-title">Entire dataset</span>
                <span className="export-option-sub">
                  Every transaction, newest first
                </span>
              </span>
              <span className="export-option-count">{totalCount}</span>
            </label>

            <label
              className={`export-option ${scope === "results" ? "export-option--selected" : ""} ${resultsDisabled ? "export-option--disabled" : ""}`}
            >
              <input
                type="radio"
                name="export-scope"
                checked={scope === "results"}
                disabled={resultsDisabled}
                onChange={() => setScope("results")}
              />
              <span className="export-option-text">
                <span className="export-option-title">Only current results</span>
                <span className="export-option-sub">
                  What the table shows now, in its current order
                </span>
              </span>
              <span className="export-option-count">{resultsCount}</span>
            </label>
          </div>
        ) : (
          <p className="export-summary">
            {plural(totalCount, "transaction")} will be exported.
          </p>
        )}

        <p className="export-file">
          File: <strong>{fileName}</strong>
        </p>
        <p className="export-hint">
          Columns: Date, Category, Amount, Type. You can import this file back
          into Finsights.
        </p>

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-primary"
            onClick={() => onConfirm(isFiltered ? scope : "all")}
          >
            Download CSV
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
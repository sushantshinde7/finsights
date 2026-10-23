import { useEffect } from "react";
import { motion } from "framer-motion";
import { EASE } from "../../../lib/motion";
import "./ImportSummaryModal.css";

const MAX_SHOWN = 50;

const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

export default function ImportSummaryModal({ report, onClose }) {
  const { fileName, datasetName, importedCount, skipped } = report;

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const nothingImported = importedCount === 0;
  const shown = skipped.slice(0, MAX_SHOWN);
  const hidden = skipped.length - shown.length;

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
        aria-label="Import summary"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.22, ease: EASE }}
      >
        <button
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>

        <h3 className="modal-title">Import summary</h3>
        <p className="import-report-file">{fileName}</p>

        {nothingImported ? (
          <p className="import-report-line import-report-line--bad">
            Nothing was imported. Every row in this file was skipped.
          </p>
        ) : (
          <p className="import-report-line import-report-line--ok">
            ✓ {plural(importedCount, "transaction")} imported into "
            {datasetName}"
          </p>
        )}

        <p className="import-report-line import-report-line--warn">
          {plural(skipped.length, "row")} skipped
        </p>

        <ul className="import-report-list">
          {shown.map((item) => (
            <li key={item.row}>
              <span className="import-report-row">Row {item.row}</span>
              <span>{item.reason}</span>
            </li>
          ))}
        </ul>

        {hidden > 0 && (
          <p className="import-report-more">
            …and {plural(hidden, "more skipped row")}.
          </p>
        )}

        <p className="import-report-hint">
          {nothingImported
            ? "Fix the rows in your file and import it again."
            : "Fix these rows in your file and import it again. This import is already saved, so delete it from the dataset menu if you want to replace it."}
        </p>

        <div className="modal-actions">
          <button className="btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
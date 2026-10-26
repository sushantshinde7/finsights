import { useEffect } from "react";
import { motion } from "framer-motion";
import { Download, Upload } from "lucide-react";
import { EASE } from "../../../lib/motion";
import {
  REQUIRED_HEADERS,
  MAX_FILE_BYTES,
  MAX_ROWS,
  getTemplateRows,
} from "../../../lib/csv";
import "./ImportModal.css";

const MAX_MB = MAX_FILE_BYTES / (1024 * 1024);

export default function ImportModal({
  importedCount,
  maxImported,
  onClose,
  onChooseFile,
  onDownloadTemplate,
}) {
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const limitReached = importedCount >= maxImported;
  const examples = getTemplateRows().slice(0, 3);

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
        className="modal import-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="import-modal-title"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.22, ease: EASE }}
      >
        <button className="modal-close-btn" onClick={onClose} aria-label="Close">
          ✕
        </button>

        <h3 className="modal-title" id="import-modal-title">
          Import transactions
        </h3>
        <p className="import-modal-lead">
          Upload a CSV file. It becomes its own dataset, so nothing in your
          current data is changed or merged.
        </p>

        <p className="import-modal-label">Your file should look like this</p>
        <div className="import-example">
          <table>
            <thead>
              <tr>
                {REQUIRED_HEADERS.map((h) => (
                  <th key={h} className={h === "Amount" ? "is-num" : ""}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {examples.map((row) => (
                <tr key={row.date + row.category}>
                  <td>{row.date}</td>
                  <td>{row.category}</td>
                  <td className="is-num">{row.amount}</td>
                  <td className={`import-type--${row.type}`}>
                    {row.type === "income" ? "Income" : "Expense"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ul className="import-rules">
          <li>
            A .csv file, up to {MAX_MB} MB and{" "}
            {MAX_ROWS.toLocaleString("en-IN")} rows
          </li>
          <li>Date as YYYY-MM-DD, and Type as Income or Expense</li>
          <li>Rows with problems are skipped and listed for you</li>
        </ul>

        <p className="import-quota">
          Imported datasets:{" "}
          <strong>
            {importedCount} of {maxImported}
          </strong>
        </p>

        {limitReached && (
          <div className="import-limit" role="alert">
            You've reached the limit of {maxImported} imported datasets. Delete
            one from the dataset menu to import another file.
          </div>
        )}

        <div className="import-actions">
          <button
            type="button"
            className="import-template-btn"
            onClick={onDownloadTemplate}
          >
            <Download size={15} aria-hidden="true" />
            Download template
          </button>

          <div className="import-actions-right">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              type="button"
              className="btn-primary import-choose-btn"
              onClick={onChooseFile}
              disabled={limitReached}
            >
              <Upload size={15} aria-hidden="true" />
              Choose file
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
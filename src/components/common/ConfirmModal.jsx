import { useEffect } from "react";
import { motion } from "framer-motion";
import { EASE } from "../../lib/motion";
import "./ConfirmModal.css";

export default function ConfirmModal({
  title,
  children,
  confirmLabel = "Confirm",
  danger = false,
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onCancel]);

  return (
    <motion.div
      className="modal-overlay"
      onClick={onCancel}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="modal confirm-modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-body"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.22, ease: EASE }}
      >
        <h3 className="modal-title" id="confirm-title">
          {title}
        </h3>

        <div className="confirm-body" id="confirm-body">
          {children}
        </div>

        <div className="modal-actions">
          {/* Cancel is focused first, so a stray Enter can't destroy data */}
          <button className="btn-secondary" onClick={onCancel} autoFocus>
            Cancel
          </button>
          <button
            className={`btn-primary ${danger ? "confirm-btn--danger" : ""}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
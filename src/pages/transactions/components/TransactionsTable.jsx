import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import "./TransactionsTable.css";
import { Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { fadeUp, EASE } from "../../../lib/motion";

const PAGE_SIZE_OPTIONS = [10, 25, 50];

export default function TransactionsTable({
  data,
  onEdit,
  onDelete,
  emptyState,
  onAddClick,
}) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Rows currently mid-delete-animation. A Set (not a single id) so
  // deleting two rows in quick succession doesn't block the second
  // click while the first is still animating.
  const [deletingIds, setDeletingIds] = useState(() => new Set());

  // reset to page 1 whenever data changes (filter/search/sort)
  const totalPages = Math.ceil(data.length / pageSize);
  const safePage = Math.min(page, totalPages || 1);

  const pageData = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, safePage, pageSize]);

  const handlePageSize = (e) => {
    setPageSize(Number(e.target.value));
    setPage(1);
  };

  // Start the visual fade for a row. The real onDelete(id) — the one
  // that actually removes it from data — only fires once the fade
  // finishes, via onAnimationComplete below. This is deliberate: it
  // keeps the delete animation scoped to genuine delete clicks only,
  // never to rows disappearing because of search/filter/sort/paging.
  const handleDeleteClick = (id) => {
    setDeletingIds((prev) => new Set(prev).add(id));
  };

  const handleRowFadeComplete = (id, wasDeleting) => {
    if (!wasDeleting) return; // ignore the normal resting-state animation completing

    onDelete(id);

    setDeletingIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  // page number buttons: always show first, last, current ±1, with ellipsis
  const getPageNumbers = () => {
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1);

    const pages = new Set(
      [1, totalPages, safePage, safePage - 1, safePage + 1].filter(
        (p) => p >= 1 && p <= totalPages,
      ),
    );

    return [...pages].sort((a, b) => a - b);
  };

  const pageNumbers = getPageNumbers();

  if (!data.length) {
    return (
      <motion.div
        className="empty-state"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
        <p className="empty-title">
          {emptyState?.title || "No data available"}
        </p>
        <p className="empty-subtitle">
          {emptyState?.subtitle || "Try adjusting filters"}
        </p>
        {onAddClick && (
          <button className="empty-cta" onClick={onAddClick}>
            + Add your first transaction
          </button>
        )}
      </motion.div>
    );
  }

  const start = (safePage - 1) * pageSize + 1;
  const end = Math.min(safePage * pageSize, data.length);

  return (
    <div className="table-outer">
      {/* TABLE */}
      <div className="table-wrapper">
        <table className="transactions-table">
          <colgroup>
            <col className="col-date" />
            <col className="col-category" />
            <col className="col-amount" />
            <col className="col-type" />
            <col className="col-actions" />
          </colgroup>

          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {pageData.map((tx) => {
              const isDeleting = deletingIds.has(tx.id);

              return (
                <motion.tr
                  key={tx.id}
                  initial={false}
                  animate={
                    isDeleting
                      ? { opacity: 0, x: -16, backgroundColor: "var(--color-danger-bg)" }
                      : { opacity: 1, x: 0, backgroundColor: "rgba(0,0,0,0)" }
                  }
                  transition={{ duration: 0.25, ease: EASE }}
                  onAnimationComplete={() =>
                    handleRowFadeComplete(tx.id, isDeleting)
                  }
                >
                  <td className="td-date">
                    {(() => {
                      const d = new Date(tx.date);
                      const isCurrentYear =
                        d.getFullYear() === new Date().getFullYear();
                      return d.toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        ...(isCurrentYear ? {} : { year: "numeric" }),
                      });
                    })()}
                  </td>

                  <td className="td-category" title={tx.category}>
                    {tx.category}
                  </td>

                  <td className="td-amount">
                    ₹{tx.amount.toLocaleString("en-IN")}
                  </td>

                  <td>
                    <span className={`badge badge-${tx.type}`}>{tx.type}</span>
                  </td>

                  <td className="td-actions">
                    <div className="actions-inner">
                      <button
                        className="icon-btn"
                        onClick={() => onEdit(tx)}
                        title="Edit"
                        aria-label={`Edit ${tx.category}`}
                        disabled={isDeleting}
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        className="icon-btn danger"
                        onClick={() => handleDeleteClick(tx.id)}
                        title="Delete"
                        aria-label={`Delete ${tx.category}`}
                        disabled={isDeleting}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <nav className="pagination" aria-label="Table pagination">
        <div className="pg-left">
          <span className="pg-rpp-label">Rows</span>
          <select
            className="pg-rpp-select"
            value={pageSize}
            onChange={handlePageSize}
            aria-label="Rows per page"
          >
            {PAGE_SIZE_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <div className="pg-info">
          {start}–{end} of {data.length}
        </div>

        <div className="pg-buttons">
          <button
            className="pg-btn pg-btn--nav"
            onClick={() => setPage((p) => p - 1)}
            disabled={safePage === 1}
            aria-label="Previous page"
          >
            <ChevronLeft size={13} /> Prev
          </button>

          {pageNumbers.map((num, i) => {
            const prev = pageNumbers[i - 1];
            const showEllipsis = prev && num - prev > 1;
            return (
              <span key={num} className="pg-num-group">
                {showEllipsis && (
                  <span className="pg-ellipsis" aria-hidden="true">
                    …
                  </span>
                )}
                <button
                  className={`pg-btn ${num === safePage ? "pg-btn--active" : ""}`}
                  onClick={() => setPage(num)}
                  aria-label={`Page ${num}`}
                  aria-current={num === safePage ? "page" : undefined}
                >
                  {num}
                </button>
              </span>
            );
          })}

          <button
            className="pg-btn pg-btn--nav"
            onClick={() => setPage((p) => p + 1)}
            disabled={safePage === totalPages}
            aria-label="Next page"
          >
            Next <ChevronRight size={13} />
          </button>
        </div>
      </nav>
    </div>
  );
}
import "./TransactionsTable.css";
import { Pencil, Trash2 } from "lucide-react";

export default function TransactionsTable({
  data,
  onEdit,
  onDelete,
  emptyState,
  onAddClick,
}) {
  if (!data.length) {
    return (
      <div className="empty-state">
        <p className="empty-title">
          {emptyState?.title || "No data available"}
        </p>

        <p className="empty-subtitle">
          {emptyState?.subtitle || "Try adjusting filters"}
        </p>

        {/* CTA only for admin */}
        {onAddClick && (
          <button className="empty-cta" onClick={onAddClick}>
            + Add Transaction
          </button>
        )}
      </div>
    );
  }
  return (
    <div className="table-wrapper">
      <table className="transactions-table">
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
          {data.map((tx) => (
            <tr key={tx.id}>
              <td>
                {new Date(tx.date).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                })}
              </td>
              <td>{tx.category}</td>

              <td className={`amount ${tx.type}`}>
                ₹{tx.amount.toLocaleString()}
              </td>

              <td>
                <span
                  className={`badge ${
                    tx.type === "income" ? "income" : "expense"
                  }`}
                >
                  {tx.type}
                </span>
              </td>

                <td className="actions-cell">
                  {/* EDIT */}
                  <button
                    onClick={() => onEdit(tx)}
                    className="icon-btn"
                    title="Edit"
                  >
                    <Pencil size={16} />
                  </button>

                  {/* DELETE */}
                  <button
                    onClick={() => onDelete(tx.id)}
                    className="icon-btn danger"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

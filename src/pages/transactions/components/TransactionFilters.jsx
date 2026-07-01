import "./TransactionFilters.css";
import { SlidersHorizontal, Search } from "lucide-react";

export default function TransactionFilters({
  searchTerm,
  setSearchTerm,
  sortField,
  setSortField,
  sortOrder,
  setSortOrder,
  resultCount,
  activeFilterCount,
  onOpenFilters,
  onClearFilters,
  filterSummary,
}) {
  return (
    <div className="filters-wrapper">

      {/* SEARCH */}
      <div className="search-row">
        <Search size={15} className="search-icon" aria-hidden="true" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by category, amount, type, date..."
          className="search-input"
        />
      </div>

      {/* TOOLBAR */}
      <div className="filters-toolbar">

        {/* LEFT — filters */}
        <div className="toolbar-left">
          <button className="filters-trigger" onClick={onOpenFilters}>
            <SlidersHorizontal size={15} />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="filters-badge">{activeFilterCount}</span>
            )}
          </button>

          {activeFilterCount > 0 && (
            <button className="filters-reset-btn" onClick={onClearFilters}>
              Reset
            </button>
          )}
        </div>

        {/* RIGHT — sort + results */}
        <div className="toolbar-right">
          <select
            className="filter-select"
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
          >
            <option value="date">Date</option>
            <option value="amount">Amount</option>
            <option value="category">Category</option>
          </select>

          <select
            className="filter-select"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>

          <div className="results-count">
            {resultCount} result{resultCount !== 1 ? "s" : ""}
          </div>
        </div>

      </div>

      {/* CHIPS */}
      {filterSummary.length > 0 && (
        <div className="filter-summary-row">
          {filterSummary.map((item) => (
            <span key={item} className="summary-chip">{item}</span>
          ))}
        </div>
      )}

    </div>
  );
}
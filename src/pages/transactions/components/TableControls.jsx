import "./TableControls.css";
import { SlidersHorizontal, Search } from "lucide-react";

export default function TableControls({
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
      <div className="search-row" role="search">
        <Search size={15} className="search-icon" aria-hidden="true" />

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by category, amount, type, date..."
          className="search-input"
        />
        {!searchTerm && <span className="search-shortcut">Ctrl + K</span>}
        {searchTerm && (
          <button
            type="button"
            className="search-clear-btn"
            onClick={() => setSearchTerm("")}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* TOOLBAR */}
      <div className="filters-toolbar">
        {/* LEFT — filters */}
        <div className="toolbar-left">
          <button
            className={`filters-trigger ${
              activeFilterCount > 0 ? "active" : ""
            }`}
            onClick={onOpenFilters}
            aria-haspopup="dialog"
            aria-label={`Filters${activeFilterCount > 0 ? `, ${activeFilterCount} active` : ""}`}
          >
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
          <div className="sort-group">
            <select
              className="sort-select"
              value={sortField}
              aria-label="Sort by"
              onChange={(e) => setSortField(e.target.value)}
            >
              <option value="date">Date</option>
              <option value="amount">Amount</option>
              <option value="category">Category</option>
            </select>

            <span className="sort-divider" aria-hidden="true" />

            <select
              className="sort-select"
              value={sortOrder}
              aria-label="Sort order"
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>

          <div className="results-count">
            {resultCount} result
            {resultCount !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      {/* CHIPS */}
      {filterSummary.length > 0 && (
        <div className="filter-summary-row">
          {filterSummary.map((item) => (
            <span key={item} className="summary-chip">
              {item}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

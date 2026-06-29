import { useState } from "react";
import "./FilterModal.css";

const DATE_OPTIONS = [
  { label: "All Time", value: "all" },
  { label: "Last 7 Days", value: "7d" },
  { label: "Last 15 Days", value: "15d" },
  { label: "Last 30 Days", value: "30d" },
  { label: "Last 90 Days", value: "90d" },
  { label: "Last 1 Year", value: "1y" },
];

const MIN_AMOUNT = 0;
const MAX_AMOUNT = 100000;

export default function FilterModal({
  onClose,
  filters,
  setFilters,
  categories,
}) {
  const [localFilters, setLocalFilters] = useState(() => ({
    ...filters,
    amountRange: {
      ...filters.amountRange,
    },
  }));

  const [activeSection, setActiveSection] = useState("type");

  const updateFilter = (key, value) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleCategoryToggle = (category) => {
    const exists = localFilters.categories.includes(category);

    const updated = exists
      ? localFilters.categories.filter((c) => c !== category)
      : [...localFilters.categories, category];

    updateFilter("categories", updated);
  };

  const clearFilters = () => {
    setLocalFilters({
      type: "all",
      categories: [],
      dateRange: "all",
      amountRange: {
        min: MIN_AMOUNT,
        max: MAX_AMOUNT,
      },
    });
  };

  const applyFilters = () => {
    setFilters(localFilters);
    onClose();
  };

  const hasActiveFilters =
    localFilters.type !== "all" ||
    localFilters.categories.length > 0 ||
    localFilters.dateRange !== "all" ||
    localFilters.amountRange.min !== MIN_AMOUNT ||
    localFilters.amountRange.max !== MAX_AMOUNT;

  const hasChanges = JSON.stringify(localFilters) !== JSON.stringify(filters);

  const filterCounts = {
    type: localFilters.type !== "all" ? 1 : 0,
    categories: localFilters.categories.length,
    date: localFilters.dateRange !== "all" ? 1 : 0,
    amount:
      localFilters.amountRange.min !== MIN_AMOUNT ||
      localFilters.amountRange.max !== MAX_AMOUNT
        ? 1
        : 0,
  };

  const activeFilterCount =
    filterCounts.type +
    (filterCounts.categories > 0 ? 1 : 0) +
    filterCounts.date +
    filterCounts.amount;

  return (
    <div className="filter-modal-overlay" onClick={onClose}>
      <div className="filter-modal" onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}

        <div className="filter-header">
          <div className="filter-header-left">
            <h3>Filters</h3>
            <p>
              {activeFilterCount > 0
                ? `${activeFilterCount} filters selected`
                : "Showing all transactions"}
            </p>
          </div>

          <div className="filter-header-actions">
            <button
              className="clear-btn"
              onClick={clearFilters}
              disabled={!hasActiveFilters}
            >
              {hasActiveFilters && (
                <span className="clear-dot" aria-hidden="true" />
              )}
              Clear
            </button>

            <button
              className="close-btn"
              onClick={onClose}
              aria-label="Close filters"
            >
              ✕
            </button>
          </div>
        </div>

        {/* BODY */}

        <div className="filter-body">
          {/* LEFT MENU */}

          <aside className="filter-sidebar">
            <button
              className={`filter-nav ${
                activeSection === "type" ? "active" : ""
              }`}
              onClick={() => setActiveSection("type")}
            >
              Type
              {filterCounts.type > 0 && (
                <span className="nav-badge">{filterCounts.type}</span>
              )}
            </button>

            <button
              className={`filter-nav ${
                activeSection === "categories" ? "active" : ""
              }`}
              onClick={() => setActiveSection("categories")}
            >
              Categories
              {filterCounts.categories > 0 && (
                <span className="nav-badge">{filterCounts.categories}</span>
              )}
            </button>

            <button
              className={`filter-nav ${
                activeSection === "date" ? "active" : ""
              }`}
              onClick={() => setActiveSection("date")}
            >
              Date Range
              {filterCounts.date > 0 && (
                <span className="nav-badge">{filterCounts.date}</span>
              )}
            </button>

            <button
              className={`filter-nav ${
                activeSection === "amount" ? "active" : ""
              }`}
              onClick={() => setActiveSection("amount")}
            >
              Amount
              {filterCounts.amount > 0 && (
                <span className="nav-badge">{filterCounts.amount}</span>
              )}
            </button>
          </aside>

          {/* CONTENT */}

          <div className="filter-content">
            {/* TYPE */}

            {activeSection === "type" && (
              <div>
                <h4>Transaction type</h4>

                <div className="option-list">
                  {["all", "income", "expense"].map((type) => (
                    <label key={type} className="radio-item">
                      <input
                        type="radio"
                        checked={localFilters.type === type}
                        onChange={() => updateFilter("type", type)}
                      />

                      <span>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* CATEGORY */}

            {activeSection === "categories" && (
              <div>
                <h4>Categories</h4>

                <div className="checkbox-grid category-scroll">
                  {categories.map((category) => (
                    <label key={category} className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={localFilters.categories.includes(category)}
                        onChange={() => handleCategoryToggle(category)}
                      />

                      <span>{category}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* DATE */}

            {activeSection === "date" && (
              <div>
                <h4>Date range</h4>

                <div className="option-list">
                  {DATE_OPTIONS.map((option) => (
                    <label key={option.value} className="radio-item">
                      <input
                        type="radio"
                        checked={localFilters.dateRange === option.value}
                        onChange={() => updateFilter("dateRange", option.value)}
                      />

                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* AMOUNT */}

            {activeSection === "amount" && (
              <div>
                <h4>Amount range</h4>

                <div className="amount-values">
                  <div className="amount-pill">
                    ₹{localFilters.amountRange.min.toLocaleString("en-IN")}
                  </div>

                  <div className="amount-pill">
                    ₹{localFilters.amountRange.max.toLocaleString("en-IN")}
                  </div>
                </div>

                <div className="dual-slider">
                  <div
                    className="slider-range"
                    style={{
                      left: `${
                        (localFilters.amountRange.min / MAX_AMOUNT) * 100
                      }%`,
                      right: `${
                        100 - (localFilters.amountRange.max / MAX_AMOUNT) * 100
                      }%`,
                    }}
                  />

                  <input
                    type="range"
                    min={MIN_AMOUNT}
                    max={MAX_AMOUNT}
                    value={localFilters.amountRange.min}
                    className="thumb thumb-left"
                    onChange={(e) =>
                      updateFilter("amountRange", {
                        ...localFilters.amountRange,
                        min: Math.min(
                          Number(e.target.value),
                          localFilters.amountRange.max - 100,
                        ),
                      })
                    }
                  />

                  <input
                    type="range"
                    min={MIN_AMOUNT}
                    max={MAX_AMOUNT}
                    value={localFilters.amountRange.max}
                    className="thumb thumb-right"
                    onChange={(e) =>
                      updateFilter("amountRange", {
                        ...localFilters.amountRange,
                        max: Math.max(
                          Number(e.target.value),
                          localFilters.amountRange.min + 100,
                        ),
                      })
                    }
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}

        <div className="filter-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>

          <button
            className="btn-primary"
            onClick={applyFilters}
            disabled={!hasChanges}
          >
            Apply{" "}
            {activeFilterCount > 0 && (
              <span className="apply-badge">{activeFilterCount}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

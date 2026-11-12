import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";

import { fingerprintRows } from "../lib/csv";
import { useAuth } from "./AuthContext";
import { sampleOneTransactions } from "../data/mockTransactions";
import { sampleTwoTransactions } from "../data/mockTransactions2";

/* =========================================================
   STORAGE
   Each signed-in account saves to its OWN key; guests save nothing.
   SHARED_KEY is the old browser-wide save: the first account to sign
   in after this update claims it once, then it is deleted.
========================================================= */
const USER_KEY_PREFIX = "finsights_datasets_v3_";
const SHARED_KEY = "finsights_datasets_v2";

const storageKeyFor = (uid) => `${USER_KEY_PREFIX}${uid}`;

const MAX_IMPORTED_DATASETS = 5;

/* ---------- save status (tiny external store) ----------
   Lets the provider report "couldn't save" to the page without
   calling setState inside an effect. */
let saveFailed = false;
const saveListeners = new Set();

const subscribeSaveStatus = (listener) => {
  saveListeners.add(listener);
  return () => saveListeners.delete(listener);
};
const getSaveStatus = () => saveFailed;
const setSaveStatus = (failed) => {
  if (saveFailed === failed) return;
  saveFailed = failed;
  saveListeners.forEach((listener) => listener());
};

// Live from the data files: edit the .js file and this follows.
const SAMPLE_ORIGINALS = {
  sample1: sampleOneTransactions,
  sample2: sampleTwoTransactions,
};

const TransactionContext = createContext();

/* =========================================================
   DATASET HELPERS
========================================================= */

const buildDefaults = () => ({
  activeId: "sample1",
  datasets: [
    {
      id: "sample1",
      name: "Personal Finance",
      kind: "sample",
      transactions: sampleOneTransactions,
    },
    {
      id: "sample2",
      name: "Senior Professional",
      kind: "sample",
      transactions: sampleTwoTransactions,
    },
    {
      id: "custom",
      name: "Custom Dataset",
      kind: "custom",
      transactions: [],
    },
  ],
});

const isValidDataset = (d) =>
  d &&
  typeof d.id === "string" &&
  typeof d.name === "string" &&
  Array.isArray(d.transactions);

// Guarantees the 3 built-in datasets always exist, in a fixed order,
// followed by any imported ones. Repairs a damaged/partial save.
const normalize = (saved) => {
  const defaults = buildDefaults().datasets;
  const valid = saved.datasets.filter(isValidDataset);
  const byId = new Map(valid.map((d) => [d.id, d]));

  const builtIns = defaults.map((d) => byId.get(d.id) ?? d);
  const imported = valid.filter((d) => d.kind === "imported");
  const datasets = [...builtIns, ...imported];

  const activeId = datasets.some((d) => d.id === saved.activeId)
    ? saved.activeId
    : "sample1";

  return { activeId, datasets };
};


const readState = (key) => {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return null;
    const parsed = JSON.parse(saved);
    return parsed && Array.isArray(parsed.datasets) ? normalize(parsed) : null;
  } catch {
    return null;
  }
};

// Guest → clean samples. Signed in → their own saved data; if they
// have none yet, claim the old browser-wide save once, else defaults.
const loadStateFor = (uid) => {
  if (!uid) return buildDefaults();
  return (
    readState(storageKeyFor(uid)) ?? readState(SHARED_KEY) ?? buildDefaults()
  );
};

// Next id = highest existing id + 1 (no same-millisecond collisions).
const nextId = (list) =>
  list.reduce((max, t) => Math.max(max, Number(t.id) || 0), 0) + 1;
// Same rows, same order, same values?
const sameRows = (a, b) =>
  a.length === b.length &&
  a.every((t, i) => {
    const o = b[i];
    return (
      t.id === o.id &&
      t.date === o.date &&
      t.category === o.category &&
      t.amount === o.amount &&
      t.type === o.type
    );
  });

// "bank" → "bank", then "bank (2)", "bank (3)"…
const makeUniqueName = (base, datasets) => {
  const taken = new Set(datasets.map((d) => d.name.toLowerCase()));
  if (!taken.has(base.toLowerCase())) return base;

  let n = 2;
  while (taken.has(`${base} (${n})`.toLowerCase())) n++;
  return `${base} (${n})`;
};

/* =========================================================
   PROVIDER
========================================================= */

export function TransactionProvider({ children }) {
  const { user } = useAuth();
  const uid = user?.uid ?? null;
  const isGuest = uid === null;

  const [state, setState] = useState(() => loadStateFor(uid));
  const [loadedFor, setLoadedFor] = useState(uid);

  // A different person is now signed in (or signed out): load THEIR data.
  if (loadedFor !== uid) {
    setLoadedFor(uid);
    setState(loadStateFor(uid));
  }

  const storageError = useSyncExternalStore(subscribeSaveStatus, getSaveStatus);

  // Persist every change under this account's own key. Guests save nothing.
  useEffect(() => {
    if (!uid) {
      setSaveStatus(false);
      return;
    }
    try {
      localStorage.setItem(storageKeyFor(uid), JSON.stringify(state));
      localStorage.removeItem(SHARED_KEY); // the old shared save is claimed
      setSaveStatus(false);
    } catch (err) {
      console.warn("Could not save datasets to localStorage:", err);
      setSaveStatus(true);
    }
  }, [state, uid]);
  const activeDataset =
    state.datasets.find((d) => d.id === state.activeId) ?? state.datasets[0];

  const transactions = activeDataset.transactions;

  /* ---------- dataset-level actions ---------- */

  const switchDataset = (id) => {
    setState((prev) =>
      prev.datasets.some((d) => d.id === id) ? { ...prev, activeId: id } : prev,
    );
  };

  // Kept so TransactionsPage keeps working untouched in this step.
  // "clear" now means "go to the Custom dataset" (nothing is wiped).
  const loadSample = (key) => switchDataset(key === "clear" ? "custom" : key);

  // Creates a NEW dataset from parsed rows and makes it active.
  // Never touches existing datasets (no merging, no overwriting).
  // Returns { ok, id, name } or { ok: false, reason }.
  const importDataset = ({ name, rows }) => {
    if (isGuest) return { ok: false, reason: "auth" };
    const importedCount = state.datasets.filter(
      (d) => d.kind === "imported",
    ).length;

    if (importedCount >= MAX_IMPORTED_DATASETS) {
      return { ok: false, reason: "limit" };
    }

    if (!Array.isArray(rows) || rows.length === 0) {
      return { ok: false, reason: "empty" };
    }

    const finalName = makeUniqueName(
      (name || "Imported Dataset").trim() || "Imported Dataset",
      state.datasets,
    );

    const id = `imported-${Date.now()}`;

    // D2: a fingerprint of the file's rows, to spot the same file again
    const fingerprint = fingerprintRows(rows);
    const twin = state.datasets.find(
      (d) => d.kind === "imported" && d.fingerprint === fingerprint,
    );

    const dataset = {
      id,
      name: finalName,
      kind: "imported",
      originalCount: rows.length,
      fingerprint,
      transactions: rows.map((r, i) => ({
        id: i + 1,
        date: r.date,
        category: r.category,
        amount: r.amount,
        type: r.type,
      })),
    };

    const nextState = {
      activeId: id,
      datasets: [...state.datasets, dataset],
    };

    // D1: make sure it actually fits BEFORE switching to it
    try {
      localStorage.setItem(storageKeyFor(uid), JSON.stringify(nextState));
    } catch {
      return { ok: false, reason: "storage" };
    }

    setState(nextState);

    return {
      ok: true,
      id,
      name: finalName,
      duplicateOf: twin ? twin.name : null,
    };
  };

  // Only imported datasets can be removed. If it was the active one,
  // fall back to the first sample.
  const deleteDataset = (id) => {
    if (isGuest) return false;
    const target = state.datasets.find((d) => d.id === id);
    if (!target || target.kind !== "imported") return false;

    setState((prev) => ({
      activeId: prev.activeId === id ? "sample1" : prev.activeId,
      datasets: prev.datasets.filter((d) => d.id !== id),
    }));

    return true;
  };

  // Samples go back to their coded rows; Custom goes back to empty.
  // Imported datasets can't be reset (their original rows aren't stored).
  const resetDataset = (id) => {
    if (isGuest) return false;

    const target = state.datasets.find((d) => d.id === id);
    if (!target) return false;

    let rows;
    if (target.kind === "sample") rows = SAMPLE_ORIGINALS[id];
    else if (target.kind === "custom") rows = [];
    else return false;

    setState((prev) => ({
      ...prev,
      datasets: prev.datasets.map((d) =>
        d.id === id ? { ...d, transactions: rows } : d,
      ),
    }));

    return true;
  };

  /* ---------- row-level actions (always on the ACTIVE dataset) ---------- */

  const updateActiveTransactions = (updater) => {
    if (isGuest) return;
    setState((prev) => ({
      ...prev,
      datasets: prev.datasets.map((d) =>
        d.id === prev.activeId
          ? { ...d, transactions: updater(d.transactions) }
          : d,
      ),
    }));
  };

  const addTransaction = (tx) => {
    updateActiveTransactions((list) => [{ id: nextId(list), ...tx }, ...list]);
  };

  const updateTransaction = (updated) => {
    updateActiveTransactions((list) =>
      list.map((t) => (t.id === updated.id ? updated : t)),
    );
  };

  const deleteTransaction = (id) => {
    updateActiveTransactions((list) => list.filter((t) => t.id !== id));
  };

  /* ---------- dropdown-friendly list ---------- */

  const datasets = useMemo(
    () =>
      state.datasets.map((d) => ({
        id: d.id,
        name: d.name,
        kind: d.kind,
        count: d.transactions.length,
        originalCount:
          d.kind === "sample"
            ? (SAMPLE_ORIGINALS[d.id]?.length ?? null)
            : d.kind === "imported"
              ? (d.originalCount ?? d.transactions.length)
              : null, // custom has no original
        isModified:
          d.kind === "sample"
            ? !sameRows(d.transactions, SAMPLE_ORIGINALS[d.id] ?? [])
            : d.kind === "custom"
              ? d.transactions.length > 0
              : false,
      })),
    [state.datasets],
  );

  /* ---------- analytics (same outputs as before) ---------- */

  const analytics = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = income - expense;

    const byCategory = transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});

    const categoryBreakdown = Object.entries(byCategory).map(
      ([name, value]) => ({ name, value }),
    );

    const monthlyMap = {};

    transactions.forEach((t) => {
      const month = t.date.slice(0, 7);
      if (!monthlyMap[month]) monthlyMap[month] = { income: 0, expense: 0 };
      if (t.type === "income" || t.type === "expense") {
        monthlyMap[month][t.type] += t.amount;
      }
    });

    const sortedMonths = Object.keys(monthlyMap).sort(); // "YYYY-MM" sorts correctly
    const spansYears = new Set(sortedMonths.map((m) => m.slice(0, 4))).size > 1;

    const formatMonth = (ym) => {
      const [year, month] = ym.split("-");
      const name = new Date(year, month - 1).toLocaleString("en-IN", {
        month: "short",
      });
      return spansYears ? `${name} '${year.slice(2)}` : name;
    };

    // Sort by real month key BEFORE formatting (the old code sorted
    // month names alphabetically: Aug came before Jul).
    const monthlyTrend = sortedMonths.map((month) => ({
      month: formatMonth(month),
      ...monthlyMap[month],
      balance: monthlyMap[month].income - monthlyMap[month].expense,
    }));

    const currentMonth = sortedMonths.at(-1);
    const previousMonth = sortedMonths.at(-2);
    const current = monthlyMap[currentMonth] || { income: 0, expense: 0 };
    const previous = monthlyMap[previousMonth] || { income: 0, expense: 0 };

    const calcChange = (curr, prev) =>
      prev === 0 ? 0 : Math.round(((curr - prev) / prev) * 100);

    const sorted = [...transactions].sort(
      (a, b) => new Date(a.date) - new Date(b.date),
    );

    const balanceTrend = sorted.reduce((trend, t) => {
      const previous = trend.length ? trend[trend.length - 1].balance : 0;
      const change = t.type === "income" ? t.amount : -t.amount;
      trend.push({ date: t.date, balance: previous + change });
      return trend;
    }, []);

    return {
      income,
      expense,
      balance,
      categoryBreakdown,
      monthlyTrend,
      balanceTrend,
      incomeChange: calcChange(current.income, previous.income),
      expenseChange: calcChange(current.expense, previous.expense),
      balanceChange: calcChange(
        current.income - current.expense,
        previous.income - previous.expense,
      ),
    };
  }, [transactions]);

  return (
    <TransactionContext.Provider
      value={{
        // rows of the ACTIVE dataset (what every page already reads)
        transactions,
        storageError,
        // dataset info + actions (used by the Transactions page)
        datasets,
        activeDataset,
        activeSample: state.activeId, // alias, kept for the current page
        maxImportedDatasets: MAX_IMPORTED_DATASETS,
        switchDataset,
        loadSample,
        importDataset,
        deleteDataset,
        resetDataset,
        // row actions
        addTransaction,
        updateTransaction,
        deleteTransaction,

        ...analytics,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  return useContext(TransactionContext);
}

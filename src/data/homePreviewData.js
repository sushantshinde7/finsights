
// Representative data used only by the homepage previews.
// Based on the financial profile in Sample 2.
// This is independent of guest and authenticated-user transactions.

export const homePreviewData = {
  period: "June 2026",

  // Hero preview
  hero: {
    totalBalance: 1284600,
    balanceIncrease: 105700,
    tickerItems: [
      "Expenses dropped 56% compared with last month",
      "Your savings rate reached 72% this month",
      "Top expense: Home Loan EMI — ₹28,000",
      "Monthly surplus increased by ₹1,05,700",
    ],
  },

  // Dashboard snapshot preview
  summary: {
    income: 198000,
    incomeChange: 21,
    expenses: 55600,
    expenseChange: -56,
    netSavings: 142400,
    savingsRate: 72,
  },

  // Recent transactions preview
  recentTransactions: [
    {
      id: 1,
      date: "2026-06-01",
      category: "Salary",
      type: "income",
      amount: 105000,
    },
    {
      id: 2,
      date: "2026-06-03",
      category: "Home Loan EMI",
      type: "expense",
      amount: 28000,
    },
    {
      id: 3,
      date: "2026-06-06",
      category: "Groceries",
      type: "expense",
      amount: 4800,
    },
    {
      id: 4,
      date: "2026-06-10",
      category: "Consulting",
      type: "income",
      amount: 35000,
    },
    {
      id: 5,
      date: "2026-06-12",
      category: "School Fees",
      type: "expense",
      amount: 9000,
    },
  ],

  // Expense distribution preview
  expenseCategories: [
    { name: "Home Loan EMI", percent: 50, color: "#3b82f6" },
    { name: "School Fees", percent: 16, color: "#16a34a" },
    { name: "Mutual Funds", percent: 9, color: "#f59e0b" },
    { name: "Groceries", percent: 9, color: "#8b5cf6" },
    { name: "Other", percent: 16, color: "#64748b" },
  ],

  // Monthly income and expense trend (Sample 2)
  monthlyTrend: [
    { month: "Jul", income: 147000, expenses: 67500 },
    { month: "Aug", income: 162000, expenses: 56700 },
    { month: "Sep", income: 165000, expenses: 62100 },
    { month: "Oct", income: 167000, expenses: 84300 },
    { month: "Nov", income: 169000, expenses: 68900 },
    { month: "Dec", income: 177000, expenses: 94000 },
    { month: "Jan", income: 188000, expenses: 114000 },
    { month: "Feb", income: 163000, expenses: 61300 },
    { month: "Mar", income: 183000, expenses: 80000 },
    { month: "Apr", income: 191000, expenses: 67000 },
    { month: "May", income: 163000, expenses: 126300 },
    { month: "Jun", income: 198000, expenses: 55600 },
  ],
};

# 📊 Finance Insights Dashboard

A financial analytics dashboard built with **React + Vite** — turning raw transaction data into clear, actionable insights through interactive visualizations, derived analytics, and role-based access controls.

🔗 **[Live Demo →](https://finance-insights-dashboard.vercel.app/)**

---

## ✨ Features

### Dashboard Overview
- KPI cards for Total Income, Total Expense, and Net Balance
- Income vs. Expense comparison chart
- Expense distribution by category

### Transactions
- Full CRUD with admin-only mutation controls
- Filter by type (income / expense / all) and sort by date
- Context-aware empty states

### Insights
- Month-over-month expense comparison
- Dynamic top spending category detection
- Spending behavior classification with trend analytics

---

## 🏗 Architecture

### Role-Based Access Control
| Role | Capabilities |
|------|-------------|
| Viewer | Read-only dashboard access |
| Admin | Full CRUD + data mutation |

### Analytics Engine
Raw transactions are processed into aggregated KPI metrics, category distributions, time-series chart datasets, and behavioral insight summaries — entirely client-side with no backend dependency.

### Frontend Structure
```text
src/
├── layout/          # Shared navigation & layout system
├── pages/
│   ├── dashboard/   # KPI + charts overview
│   ├── transactions/# CRUD + filtering controls
│   └── insights/    # Derived analytics engine
├── hooks/           # Reusable business logic
├── data/            # Mock transaction source
└── styles/          # Global design system
```

---

## 🎨 UI / UX

- Dark / Light mode
- Responsive collapsible sidebar with mobile drawer
- ESC key support + scroll lock on mobile
- Accessible layout with contextual empty states

---

## 🛠 Tech Stack

`React.js` · `Vite` · `Recharts` · `Lucide React` · `Modular CSS`

---

## 🔮 Roadmap

- [ ] Advanced date & category filtering
- [ ] CSV / PDF export
- [ ] Budget alerts & thresholds
- [ ] Predictive expense forecasting
- [ ] Drill-down category analytics

---

## 📄 License

MIT — free to use, learn from, and build upon.

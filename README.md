# 📊 Finsights

**Personal Finance Management & Financial Analytics Application**

Finsights is a modern React-based personal finance application that helps users manage transactions, explore spending patterns, and visualize financial activity through interactive dashboards and analytics.

Built with a frontend-first architecture, the project showcases real-world React application patterns including authentication, route protection, state management, financial analytics, responsive UI design, and scalable project organization.

🔗 **Live Demo:** [ Finsights ](https://finsights-web.vercel.app/)

---

## ✨ Highlights

- Firebase Authentication (Email/Password + Google)
- Guest & Authenticated User Experiences
- Protected & Guest Route Guards
- Financial Dashboards & Analytics
- Transaction Management System
- Search, Sorting & Advanced Filtering
- Interactive Charts & Data Visualization
- Responsive Layout & Dark Mode
- Error Boundaries & Loading States
- Backend-Ready Architecture

---

## ⚙️ Tech Stack

| Category | Technologies |
|----------|--------------|
| Frontend | React 19, Vite |
| Routing | React Router DOM 7 |
| State Management | Context API, React Hooks |
| Authentication | Firebase Authentication |
| Data Visualization | Recharts |
| Icons | Lucide React |
| Styling | CSS, CSS Variables, Responsive Design |
| Tooling | ESLint, npm |
| Deployment | Vercel |

---

## 🚀 Features

| Module | Capabilities |
|---------|-------------|
| **Authentication** | Email/Password Login & Signup, Google Sign-In, Session Persistence, Forgot Password, Protected Routes |
| **Dashboard** | Financial KPI Cards, Balance Tracking, Income vs Expense Monitoring, Category-Based Visualizations |
| **Transactions** | Add/Edit/Delete Transactions, Search, Sorting, Pagination, Advanced Filtering, Dataset Switching |
| **Insights** | Spending Analysis, Trend Detection, Category Breakdown, Financial KPI Reporting |
| **Guest Experience** | Full Read-Only Access to Dashboards, Analytics, Transactions & Sample Datasets |
| **Reliability & UX** | Error Boundaries, Loading States, 404 Handling, Responsive Navigation, Accessibility Improvements |

---

## 🏗️ Architecture

> Most React components maintain their own dedicated CSS files, following a modular component-based styling structure.

### Architectural Highlights

- Context-driven global state management
- Authentication-aware routing architecture
- Protected and guest route guards
- Feature-based project organization
- Dedicated service layer for future API integration
- Centralized analytics engine via TransactionContext
- Reusable modal and error-handling systems
- Shared layout architecture with Navbar and Sidebar
- Backend-ready foundation for future full-stack expansion

## 🏗 Architecture

### Project Structure

```text
src/
├── components/
│   ├── auth/
│   │   ├── AuthPrompt.jsx
│   │   ├── GuestRoute.jsx
│   │   └── ProtectedRoute.jsx
│   │
│   ├── common/
│   │   └── PageLoader.jsx
│   │
│   └── error/
│       ├── ErrorBoundary.jsx
│       └── ErrorFallback.jsx
│
├── context/
│   ├── AuthContext.jsx
│   ├── ThemeContext.jsx
│   └── TransactionContext.jsx
│
├── services/
│   ├── firebase.js
│   ├── authService.js
│   └── transactionService.js
│
├── hooks/
│   └── useAuthForm.js
│
├── layout/
│   ├── Layout.jsx
│   ├── Navbar.jsx
│   └── Sidebar.jsx
│
├── pages/
│   ├── auth/
│   │   ├── LoginPage.jsx
│   │   └── SignupPage.jsx
│   │
│   ├── dashboard/
│   │   ├── DashboardPage.jsx
│   │   └── components/
│   │       ├── StatCard.jsx
│   │       ├── BalanceChart.jsx
│   │       └── ExpenseChart.jsx
│   │
│   ├── transactions/
│   │   ├── TransactionsPage.jsx
│   │   └── components/
│   │       ├── TransactionsTable.jsx
│   │       ├── TableControls.jsx
│   │       ├── FilterModal.jsx
│   │       └── AddTransactionModal.jsx
│   │
│   ├── insights/
│   │   ├── InsightsPage.jsx
│   │   └── components/
│   │       ├── KPIGrid.jsx
│   │       ├── InsightCards.jsx
│   │       ├── ChartsSection.jsx
│   │       └── InsightsHeader.jsx
│   │
│   └── not-found/
│       └── NotFoundPage.jsx
│
├── routes/
│   ├── AppRoutes.jsx
│   └── routes.js
│
├── data/
│   ├── mockTransactions.js
│   └── mockTransactions2.js
│
├── App.jsx
├── main.jsx
└── index.css
```

---

## 🧠 Financial Analytics Engine

Transaction data is processed client-side to automatically generate:

| Analytics | Description |
|------------|------------|
| Income & Expenses | Aggregate financial totals |
| Net Balance | Current financial position |
| Category Breakdown | Expense distribution by category |
| Monthly Trends | Month-over-month performance |
| Balance Movement | Running balance calculations |
| Spending Insights | Behavior classification & trend analysis |
| Top Categories | Highest spending categories |

All analytics update dynamically whenever transaction data changes.

---

## 🔄 User Flow

### Guest User

```text
Explore Dashboard
→ Explore Transactions
→ Explore Insights
→ Attempt Protected Action
→ Authentication Prompt
```

### Authenticated User

```text
Login / Sign Up
→ Manage Transactions
→ View Analytics
→ Logout
```

---

## 🚧 Current Status

Finsights is currently a fully functional frontend application featuring authentication, transaction management, analytics dashboards, responsive layouts, and client-side persistence.

| Completed | Planned Enhancements |
|------------|---------------------|
| Authentication System | Homepage Experience |
| Transaction Management | Backend API Integration |
| Financial Analytics | Database Persistence |
| Responsive Layout | Import / Export |
| Route Protection | Budget Tracking |
| Error Handling | Financial Goals |
| Dark Mode | Recurring Transactions |

---

## 📄 License

MIT License

Feel free to use, learn from, and build upon this project.

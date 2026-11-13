
# 📊 Finsights
 
**A personal finance management and financial analytics web application.**
 
Finsights helps users organize income and expenses, explore transaction data, and understand their financial activity through dashboards, interactive charts, and rule-based insights.
 
- **Live application:** https://finsights-web.vercel.app/
- **GitHub repository:** https://github.com/sushantshinde7/finsights
- **README last updated:** 13 November 2026
> **Project status:** Frontend-first application with Firebase Authentication. Transaction data is managed in the browser using `localStorage`. A production backend, transaction API, and database have not been implemented yet.
 
---
 
## ✨ What the application offers
 
- Email/password registration and login
- Google sign-in, logout, and password-reset flow
- Firebase authentication-state restoration (session persistence)
- Protected and guest-only route guards
- Guest access to explore sample data in read-only mode
- Dashboard with income, expense, balance KPIs and chart visualizations
- Transaction creation, editing, deletion, searching, sorting, filtering, and pagination for signed-in users
- Multiple datasets: built-in samples, a custom dataset, and imported CSV datasets
- CSV import, validation, export, and a downloadable import template
- Insights and financial summaries derived from the active dataset
- Animated home page with live previews of the product
- Responsive layouts and light/dark theme support
- Loading states, error boundaries, 404 handling, and confirmation dialogs
---
 
## ⚙️ Technology
 
| Area | Technology |
|---|---|
| UI | React 19 |
| Development / build | Vite |
| Routing | React Router DOM 7 |
| Shared application state | React Context API and hooks |
| Authentication | Firebase Authentication |
| Charts | Recharts |
| Animation | Framer Motion |
| Icons | Lucide React and React Icons |
| Styling | CSS, CSS variables / design tokens, responsive media queries |
| Persistence | Browser `localStorage` |
| CSV | Custom parser, validator, serializer, and download utilities |
| Tooling | ESLint, npm |
| Hosting | Vercel |
 
Refer to `package.json` for the exact installed dependency versions.
 
---
 
## 🚀 Features in detail
 
| Module | Capabilities |
|---|---|
| **Authentication** | Email/password login and signup, Google sign-in, forgot password, session persistence, protected routes |
| **Dashboard** | Financial KPI cards, balance trend, income vs expense monitoring, category-based visualizations |
| **Transactions** | Add / edit / delete (with undo), search, sorting, pagination, advanced filtering, dataset switching |
| **Import / Export** | CSV import with validation and error report, CSV export (all rows or current results), import template |
| **Insights** | Spending analysis, trend detection, category breakdown, financial KPI reporting |
| **Guest experience** | Read-only access to dashboards, insights, transactions and sample datasets; protected actions open a sign-in prompt |
| **Reliability and UX** | Error boundaries, loading states, 404 page, responsive navigation, accessibility improvements |
 
---
 
## 🏗️ Architecture at a glance
 
The application is organized around page-level features and shared application concerns:
 
- `context/` owns authentication, theme, and transaction state.
- `services/firebase.js` initializes Firebase and exposes authentication operations.
- `routes/` centralizes route configuration; route guards live in `components/auth/`.
- `layouts/` holds the main app shell (top navbar, sidebar, and content area).
- `pages/` contains the home, authentication, dashboard, transactions, insights, and not-found experiences. Each page folder follows the same pattern: the page file and its CSS, plus a `components/` folder for the parts used only by that page.
- `components/` contains reusable authentication, common, and error-handling UI.
- `hooks/` contains reusable hooks (`useAuthForm`, `useInView`).
- `lib/` contains reusable utilities such as CSV handling and shared motion settings.
- `data/` contains the built-in sample transaction datasets.
- `backend/` is currently a scaffold. Its files are placeholders and do not represent a functioning API or database.
The provider order in `src/main.jsx` is `ThemeProvider` → `AuthProvider` → `TransactionProvider`. This lets transaction state respond to the authenticated Firebase user.
 
### App layout
 
```text
┌──────────────────────────────────────────────────────┐
│                  Navbar (thin, full width)           │
├────────────┬─────────────────────────────────────────┤
│  Sidebar   │                                         │
│  (~15-25%) │         Main content (~75-85%)          │
│            │                                         │
│  Home      │   Renders the page selected in the      │
│  Dashboard │   sidebar: Dashboard, Transactions,     │
│  Transact. │   or Insights                           │
│  Insights  │                                         │
│  Logout    │                                         │
└────────────┴─────────────────────────────────────────┘
```
 
---
 
## 📁 Project structure
 
```text
finsights/
│
├── dist/
├── node_modules/
├── public/
│
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── AuthPrompt.jsx
│   │   │   ├── AuthPrompt.css
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── GuestRoute.jsx
│   │   ├── common/
│   │   │   ├── ConfirmModal.jsx
│   │   │   ├── ConfirmModal.css
│   │   │   ├── PageLoader.jsx
│   │   │   └── PageLoader.css
│   │   └── error/
│   │       ├── ErrorBoundary.jsx
│   │       ├── ErrorFallback.jsx
│   │       └── ErrorFallback.css
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── ThemeContext.jsx
│   │   └── TransactionContext.jsx
│   ├── hooks/
│   │   ├── useAuthForm.js
│   │   └── useInView.js
│   ├── services/
│   │   ├── firebase.js
│   │   ├── authService.js (empty)
│   │   └── transactionService.js (empty)
│   ├── layouts/
│   │   ├── AppLayout.jsx
│   │   ├── AppLayout.css
│   │   └── components/
│   │       ├── Navbar.jsx
│   │       ├── Navbar.css
│   │       ├── Sidebar.jsx
│   │       └── Sidebar.css
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── ForgotPasswordPage.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   └── AuthPages.css
│   │   ├── dashboard/
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── DashboardPage.css
│   │   │   └── components/
│   │   │       ├── StatCard.jsx
│   │   │       ├── StatCard.css
│   │   │       ├── BalanceChart.jsx
│   │   │       ├── BalanceChart.css
│   │   │       ├── ExpenseChart.jsx
│   │   │       └── ExpenseChart.css
│   │   ├── transactions/
│   │   │   ├── TransactionsPage.jsx
│   │   │   ├── TransactionsPage.css
│   │   │   └── components/
│   │   │       ├── TransactionsTable.jsx
│   │   │       ├── TransactionsTable.css
│   │   │       ├── TableControls.jsx
│   │   │       ├── TableControls.css
│   │   │       ├── FilterModal.jsx
│   │   │       ├── FilterModal.css
│   │   │       ├── ImportModal.jsx
│   │   │       ├── ImportModal.css
│   │   │       ├── ExportModal.jsx
│   │   │       ├── ExportModal.css
│   │   │       ├── ImportSummaryModal.jsx
│   │   │       ├── ImportSummaryModal.css
│   │   │       ├── AddTransactionModal.jsx
│   │   │       └── AddTransactionModal.css
│   │   ├── home/
│   │   │   ├── HomePage.jsx
│   │   │   ├── HomePage.css
│   │   │   └── components/
│   │   │       ├── HeroPreview.jsx
│   │   │       ├── HeroPreview.css
│   │   │       ├── InsightVerdictPreview.jsx
│   │   │       ├── InsightVerdictPreview.css
│   │   │       ├── LiveLedgerPreview.jsx
│   │   │       ├── LiveLedgerPreview.css
│   │   │       ├── LiveSnapshotPreview.jsx
│   │   │       └── LiveSnapshotPreview.css
│   │   ├── insights/
│   │   │   ├── InsightsPage.jsx
│   │   │   ├── InsightsPage.css
│   │   │   └── components/
│   │   │       ├── ChartsSection.jsx
│   │   │       ├── ChartsSection.css
│   │   │       ├── InsightCards.jsx
│   │   │       ├── InsightCards.css
│   │   │       ├── InsightsOverview.jsx
│   │   │       └── InsightsOverview.css
│   │   └── not-found/
│   │       ├── NotFoundPage.jsx
│   │       └── NotFoundPage.css
│   ├── routes/
│   │   ├── AppRoutes.jsx
│   │   └── routes.js
│   ├── data/
│   │   ├── mockTransactions.js
│   │   └── mockTransactions2.js
│   ├── lib/
│   │   ├── csv.js
│   │   └── motion.js
│   ├── styles/
│   │   ├── global.css
│   │   └── variables.css
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── middleware/
│   │   │   └── verifyToken.js
│   │   ├── models/
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   └── transactions.js
│   │   └── index.js
│   ├── .env
│   └── package.json
│
├── .env
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── README.md
└── vite.config.js
```
 
> `backend/` is a scaffold for future full-stack work and is not used by the running application. `authService.js` and `transactionService.js` are empty placeholders for a future API layer.
 
---
 
## 🔐 Data and authentication model
 
Firebase is used for **identity and authentication**, not as the transaction database.
 
- Firebase Authentication manages account creation, email/password sign-in, Google sign-in, sign-out, password reset, and auth-state observation.
- The transaction context stores each signed-in user's datasets in browser `localStorage`, using a key derived from the Firebase UID.
- Guest users receive the built-in sample datasets. Guest mutations are blocked, and guest data is not persisted.
- When the signed-in account changes, the transaction provider loads the corresponding account's local dataset state.
- Imported datasets are created separately rather than merged into or overwriting an existing dataset.
This means transaction data is browser- and device-local at this stage. It is not synchronized across devices or backed by a server database.
 
---
 
## 📥 CSV support
 
CSV import and export are implemented in `src/lib/csv.js`.
 
- Import expects the columns `Date, Category, Amount, Type`.
- Input is checked for valid dates, non-empty categories, positive numeric amounts, and `Income` / `Expense` types.
- The parser handles quoted cells, escaped quotes, commas inside quoted values, and common line endings.
- Import is limited to 1 MB and 5,000 valid rows per file.
- Up to five imported datasets can be retained.
- Imported data becomes a new dataset; it does not merge into the current dataset.
- Rows that fail validation are reported in an import summary instead of being silently dropped.
- Export includes a UTF-8 BOM and quotes values when needed.
- Formula-like category text is guarded during export and restored during import.
---
 
## 🧠 Financial analytics engine
 
Transaction data is processed client-side to generate:
 
| Analytics | Description |
|---|---|
| Income and expenses | Aggregate financial totals |
| Net balance | Current financial position |
| Category breakdown | Expense distribution by category |
| Monthly trends | Month-over-month performance |
| Balance movement | Running balance over time |
| Spending insights | Rule-based behavior classification and trend analysis |
| Top categories | Highest spending categories |
 
All analytics update dynamically whenever the active dataset changes. Insights are rule-based and calculated from the active client-side dataset. They are not generated by an AI service.
 
---
 
## 🔄 User flow
 
**Guest user**
 
```text
Explore Home → Explore Dashboard → Explore Transactions → Explore Insights
→ Attempt a protected action (add / edit / delete / import / export)
→ Authentication prompt
```
 
**Authenticated user**
 
```text
Login / Sign Up → Manage Transactions → Import / Export → View Analytics → Logout
```
 
---
 
## 🛠️ Run locally
 
```bash
git clone https://github.com/sushantshinde7/finsights.git
cd finsights
npm install
npm run dev
```
 
Create a `.env` file in the project root and provide the Firebase configuration values expected by `src/services/firebase.js`:
 
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```
 
Do not commit real credentials or private environment values. The `.env` files must stay excluded from version control.
 
### Available scripts
 
| Command | Purpose |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
 
---
 
## 🚧 Current status and roadmap
 
| Completed | Planned |
|---|---|
| Authentication system | Backend API integration |
| Transaction management | Database persistence and cross-device sync |
| Financial analytics and insights | Budget tracking |
| CSV import / export | Financial goals |
| Home page experience | Recurring transactions |
| Responsive layout and dark mode | Route-level code splitting |
| Route protection and error handling | |
 
### Current scope and limitations
 
Finsights is a substantial frontend application, but it is not yet a full-stack finance platform. It currently has no implemented transaction API, backend business logic, or database persistence.
 
---
 
## 📄 License
 
MIT License. Feel free to use, learn from, and build upon this project.
 
---
 
## 🤝 Connect
 
If you found this project useful, have feedback, or want to get in touch, feel free to reach out. A ⭐ on the repository is always appreciated.
 
- **Email:** [sushantshinde2024@gmail.com](mailto:sushantshinde2024@gmail.com)
- **LinkedIn:** [linkedin.com/in/sushantshinde7](https://linkedin.com/in/sushantshinde7)
- **GitHub:** [github.com/sushantshinde7](https://github.com/sushantshinde7)
- **Portfolio:** [sushantdev.vercel.app](https://sushantdev.vercel.app)
---
 
*Built by Sushant Shinde.*

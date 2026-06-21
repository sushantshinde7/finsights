import { useState } from "react";
import Layout from "./layout/Layout";
import Dashboard from "./pages/dashboard/DashboardPage";
import Transactions from "./pages/transactions/TransactionsPage";
import Insights from "./pages/insights/InsightsPage";

function App() {
  const [page, setPage] = useState("dashboard");

  const renderPage = () => {
    if (page === "dashboard") return <Dashboard />;
    if (page === "transactions") return <Transactions />;
    if (page === "insights") return <Insights />;
  };

  return (
    <Layout
      setPage={setPage}
      activePage={page}
    >
      {renderPage()}
    </Layout>
  );
}

export default App;
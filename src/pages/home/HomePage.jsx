import { Link } from "react-router-dom";
import { ROUTES } from "../../routes/routes";
import {
  BarChart3,
  CreditCard,
  TrendingUp,
  ShieldCheck,
  Database,
  Layers,
  ArrowRight,
} from "lucide-react";

import "./HomePage.css";

const HomePage = () => {
  return (
    <div className="home-page">
      {/* HERO */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-badge">
            <span className="hero-badge-dot" aria-hidden="true" />
            Finsights · Personal Finance, Simplified
          </span>

          <h1 className="hero-title">
            <span className="hero-title-line">
              Turn Everyday Transactions Into Financial Clarity.
            </span>
            <span className="hero-title-line">
              Track, Analyze, and Grow With Confidence.
            </span>
          </h1>

          <p className="hero-description">
            Track expenses, monitor income, and turn your transaction
            history into clear, actionable insights through interactive
            dashboards and modern financial tools.
          </p>

          <div className="hero-actions">
            <Link to={ROUTES.DASHBOARD} className="btn-primary">
              Explore Demo
            </Link>

            <Link to={ROUTES.SIGNUP} className="btn-secondary">
              Create Account
            </Link>
          </div>
        </div>

        <div className="hero-preview">
          <div className="preview-card">
            <div className="preview-header">
              <span />
              <span />
              <span />
            </div>

            <div className="preview-body">
              <div className="preview-stat" />
              <div className="preview-stat" />
              <div className="preview-stat" />

              <div className="preview-chart" />

              <p>Dashboard Preview</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section">
        <div className="section-heading">
          <h2>Everything You Need To Understand Your Finances</h2>
          <p>
            Finsights combines transaction management, analytics, and
            visualization into a single modern experience.
          </p>
        </div>

        <div className="feature-grid">
          <article className="feature-card">
            <CreditCard size={24} />
            <h3>Track</h3>
            <p>
              Organize income and expenses with powerful transaction
              management tools.
            </p>
          </article>

          <article className="feature-card">
            <BarChart3 size={24} />
            <h3>Analyze</h3>
            <p>
              Visualize financial activity through charts, trends, and
              performance indicators.
            </p>
          </article>

          <article className="feature-card">
            <TrendingUp size={24} />
            <h3>Improve</h3>
            <p>
              Gain insights into spending behavior and make informed financial
              decisions.
            </p>
          </article>
        </div>
      </section>

      {/* DASHBOARD */}
      <section className="showcase-section">
        <div className="showcase-content">
          <span className="showcase-label">
            <span className="showcase-label-dot showcase-label-dot--dashboard" aria-hidden="true" />
            Dashboard
          </span>

          <h2>Financial Overview At A Glance</h2>

          <p>
            Monitor balances, income, expenses, and trends through an
            intuitive dashboard designed to provide instant visibility into
            your financial health.
          </p>

          <ul>
            <li>Total Balance Tracking</li>
            <li>Income & Expense KPIs</li>
            <li>Balance Trend Visualization</li>
            <li>Expense Breakdown Charts</li>
          </ul>
        </div>

        <div className="showcase-preview">
          <div className="placeholder-card">
            <div className="mock-dashboard">
              <div className="mock-stats-row">
                <span className="mock-chip mock-chip--balance" />
                <span className="mock-chip mock-chip--income" />
                <span className="mock-chip mock-chip--expense" />
                <span className="mock-chip mock-chip--savings" />
              </div>
              <div className="mock-charts-row">
                <span className="mock-block" />
                <span className="mock-block" />
              </div>
            </div>
            <Link to={ROUTES.DASHBOARD} className="mock-cta">
              Explore Dashboard <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* TRANSACTIONS */}
      <section className="showcase-section showcase-section--reverse showcase-section--panel">
        <div className="showcase-content">
          <span className="showcase-label">
            <span className="showcase-label-dot showcase-label-dot--transactions" aria-hidden="true" />
            Transactions
          </span>

          <h2>Powerful Transaction Management</h2>

          <p>
            Manage financial records efficiently with advanced tools that go
            beyond basic CRUD functionality.
          </p>

          <ul>
            <li>Search Transactions</li>
            <li>Advanced Filters</li>
            <li>Sorting & Ordering</li>
            <li>Pagination</li>
            <li>Add, Edit & Delete</li>
            <li>Sample Datasets</li>
          </ul>
        </div>

        <div className="showcase-preview">
          <div className="placeholder-card">
            <div className="mock-transactions">
              <div className="mock-toolbar">
                <span className="mock-search" />
                <span className="mock-filter" />
              </div>
              <div className="mock-rows">
                <span className="mock-row mock-row--income" />
                <span className="mock-row mock-row--expense" />
                <span className="mock-row mock-row--income" />
                <span className="mock-row mock-row--expense" />
              </div>
            </div>
            <Link to={ROUTES.TRANSACTIONS} className="mock-cta">
              Explore Transactions <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* INSIGHTS */}
      <section className="showcase-section">
        <div className="showcase-content">
          <span className="showcase-label">
            <span className="showcase-label-dot showcase-label-dot--insights" aria-hidden="true" />
            Insights
          </span>

          <h2>Turn Data Into Financial Intelligence</h2>

          <p>
            Transform transaction history into meaningful insights through
            trend analysis, category breakdowns, and behavioral indicators.
          </p>

          <ul>
            <li>Spending Behavior Analysis</li>
            <li>Top Category Detection</li>
            <li>Income vs Expense Trends</li>
            <li>KPI Summaries</li>
            <li>Balance Movement Tracking</li>
          </ul>
        </div>

        <div className="showcase-preview">
          <div className="placeholder-card">
            <div className="mock-insights">
              <span className="mock-verdict" />
              <div className="mock-insight-row">
                <span className="mock-pie" />
                <span className="mock-bars">
                  <span />
                  <span />
                  <span />
                </span>
              </div>
            </div>
            <Link to={ROUTES.INSIGHTS} className="mock-cta">
              Explore Insights <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* GUEST MODE */}
      <section className="guest-section">
        <div className="guest-content">
          <h2>Explore Before You Sign Up</h2>

          <p>
            Browse the dashboard, transactions, and insights pages without
            creating an account. Sign up only when you're ready to manage your
            own financial data.
          </p>

          <div className="hero-actions">
            <Link to={ROUTES.DASHBOARD} className="btn-primary">
              Explore Demo
            </Link>

            <Link to={ROUTES.SIGNUP} className="btn-secondary">
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* TECH STACK */}
      <section className="section">
        <div className="section-heading">
          <h2>Built With Modern Technologies</h2>
        </div>

        <div className="tech-grid">
          <div className="tech-card">
            <Layers size={22} />
            <h3>Frontend</h3>
            <p>React 19, Vite, React Router, Context API</p>
          </div>

          <div className="tech-card">
            <ShieldCheck size={22} />
            <h3>Authentication</h3>
            <p>Firebase Authentication, Google Sign-In, Protected Routes</p>
          </div>

          <div className="tech-card">
            <Database size={22} />
            <h3>Analytics</h3>
            <p>Recharts, Financial Insights, Visualization Engine</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2>Take Control Of Your Finances</h2>

        <p>
          Start tracking, analyzing, and understanding your money through a
          modern finance management experience.
        </p>

        <Link to={ROUTES.SIGNUP} className="cta-button">
          Get Started
          <ArrowRight size={18} />
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="home-footer">
        <div>
          <h3>Finsights</h3>
          <p>Personal Finance Management & Financial Analytics Platform</p>
        </div>

        <div className="footer-links">
          <a
            href="https://github.com/sushantshinde7"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>

          <a
            href="https://sushantdev.vercel.app"
            target="_blank"
            rel="noreferrer"
          >
            Portfolio
          </a>

          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
import { Link } from "react-router-dom";
import { ROUTES } from "../../routes/routes";
import * as Icons from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

import "./HomePage.css";
import HeroPreview from "./HeroPreview";
import LiveLedgerPreview from "./LiveLedgerPreview";
import LiveSnapshotPreview from "./LiveSnapshotPreview";
import InsightVerdictPreview from "./InsightVerdictPreview";

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
            Track expenses, monitor income, and turn your transaction history
            into clear, actionable insights through interactive dashboards and
            modern financial tools.
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
          <HeroPreview />
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
          <article className="feature-card feature-card--transactions">
            <span className="feature-card-icon">
              <Icons.CreditCard size={22} />
            </span>
            <h3>Track</h3>
            <p>
              Organize income and expenses with powerful transaction management
              tools.
            </p>
          </article>

          <article className="feature-card feature-card--dashboard">
            <span className="feature-card-icon">
              <Icons.BarChart3 size={22} />
            </span>
            <h3>Analyze</h3>
            <p>
              Visualize financial activity through charts, trends, and
              performance indicators.
            </p>
          </article>

          <article className="feature-card feature-card--insights">
            <span className="feature-card-icon">
              <Icons.TrendingUp size={22} />
            </span>
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
        <div className="showcase-content showcase-content--dashboard">
          <span className="showcase-label">
            <span
              className="showcase-label-dot showcase-label-dot--dashboard"
              aria-hidden="true"
            />
            Dashboard
          </span>

          <h2>Financial Overview At A Glance</h2>

          <p>
            Monitor balances, income, expenses, and trends through an intuitive
            dashboard designed to provide instant visibility into your financial
            health.
          </p>

          <ul className="showcase-check-list">
            <li>
              <Icons.Check size={12} /> Total Balance Tracking
            </li>
            <li>
              <Icons.Check size={12} /> Income & Expense KPIs
            </li>
            <li>
              <Icons.Check size={12} /> Balance Trend Visualization
            </li>
            <li>
              <Icons.Check size={12} /> Expense Breakdown Charts
            </li>
          </ul>
        </div>

        <div className="showcase-preview">
          <div className="placeholder-card">
            <LiveSnapshotPreview />
            <Link to={ROUTES.DASHBOARD} className="mock-cta">
              Explore Dashboard <Icons.ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* TRANSACTIONS */}
      <section className="showcase-section showcase-section--reverse showcase-section--panel">
        <div className="showcase-content showcase-content--transactions">
          <span className="showcase-label">
            <span
              className="showcase-label-dot showcase-label-dot--transactions"
              aria-hidden="true"
            />
            Transactions
          </span>

          <h2>Powerful Transaction Management</h2>

          <p>
            Manage financial records efficiently with advanced tools that go
            beyond basic CRUD functionality.
          </p>

          <ul className="showcase-check-list">
            <li>
              <Icons.Check size={12} />
              Search Transactions
            </li>
            <li>
              <Icons.Check size={12} />
              Advanced Filters
            </li>
            <li>
              <Icons.Check size={12} />
              Sorting & Ordering
            </li>
            <li>
              <Icons.Check size={12} />
              Pagination
            </li>
            <li>
              <Icons.Check size={12} />
              Add, Edit & Delete
            </li>
            <li>
              <Icons.Check size={12} />
              Sample Datasets
            </li>
          </ul>
        </div>

        <div className="showcase-preview">
          <div className="placeholder-card">
            <LiveLedgerPreview />
            <Link to={ROUTES.TRANSACTIONS} className="mock-cta">
              Explore Transactions <Icons.ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* INSIGHTS */}
      <section className="showcase-section">
        <div className="showcase-content showcase-content--insights">
          <span className="showcase-label">
            <span
              className="showcase-label-dot showcase-label-dot--insights"
              aria-hidden="true"
            />
            Insights
          </span>

          <h2>Turn Data Into Financial Intelligence</h2>

          <p>
            Transform transaction history into meaningful insights through trend
            analysis, category breakdowns, and behavioral indicators.
          </p>

          <ul className="showcase-check-list">
            <li>
              <Icons.Check size={12} />
              Spending Behavior Analysis
            </li>
            <li>
              <Icons.Check size={12} />
              Top Category Detection
            </li>
            <li>
              <Icons.Check size={12} />
              Income vs Expense Trends
            </li>
            <li>
              <Icons.Check size={12} />
              KPI Summaries
            </li>
            <li>
              <Icons.Check size={12} />
              Balance Movement Tracking
            </li>
          </ul>
        </div>

        <div className="showcase-preview">
          <div className="placeholder-card">
            <InsightVerdictPreview />
            <Link to={ROUTES.INSIGHTS} className="mock-cta">
              Explore Insights <Icons.ArrowRight size={13} />
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

          <div className="guest-actions">
            <Link to={ROUTES.DASHBOARD} className="btn-primary">
              Explore Demo
            </Link>
            <span className="guest-stat">
              No sign-up needed · 3 live pages to explore
            </span>
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
            <Icons.Layers size={22} />
            <h3>Frontend</h3>
            <p>React 19, Vite, React Router, Context API</p>
          </div>

          <div className="tech-card">
            <Icons.ShieldCheck size={22} />
            <h3>Authentication</h3>
            <p>Firebase Authentication, Google Sign-In, Protected Routes</p>
          </div>

          <div className="tech-card">
            <Icons.Database size={22} />
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
          <Icons.ArrowRight size={18} />
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="home-footer">
        <div className="footer-top">
          <div className="footer-brand">
            <h3>Finsights</h3>
            <p>Personal Finance Management & Financial Analytics Platform</p>
          </div>

          <nav className="footer-nav">
            <Link to={ROUTES.DASHBOARD}>Dashboard</Link>
            <Link to={ROUTES.TRANSACTIONS}>Transactions</Link>
            <Link to={ROUTES.INSIGHTS}>Insights</Link>
          </nav>

          <div className="footer-socials">
            <a
              href="https://github.com/sushantshinde7"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
            >
              <FaGithub size={18} />
            </a>

            <a
              href="https://linkedin.com/in/sushantshinde7"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
            >
              <FaLinkedin size={18} />
            </a>

            <a
              href="https://sushantdev.vercel.app"
              target="_blank"
              rel="noreferrer"
              aria-label="Portfolio"
            >
              <Icons.Globe size={18} />
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} Finsights. Built by Sushant Shinde.
          </span>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;

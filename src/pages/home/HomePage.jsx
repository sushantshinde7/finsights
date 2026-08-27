import { Link } from "react-router-dom";
import { ROUTES } from "../../routes/routes";
import * as Icons from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

import "./HomePage.css";
import HeroPreview from "./HeroPreview";
import LiveLedgerPreview from "./LiveLedgerPreview";
import LiveSnapshotPreview from "./LiveSnapshotPreview";
import InsightVerdictPreview from "./InsightVerdictPreview";

// Static content lives outside the component so it isn't
// recreated on every render, and so each card/column/section
// is a single source of truth instead of hand-duplicated JSX.

const FEATURES = [
  {
    step: "Step 01",
    icon: Icons.CreditCard,
    title: "Track",
    description:
      "Organize income and expenses with powerful transaction management tools.",
    accentClass: "feature-card--transactions",
  },
  {
    step: "Step 02",
    icon: Icons.BarChart3,
    title: "Analyze",
    description:
      "Visualize financial activity through charts, trends, and performance indicators.",
    accentClass: "feature-card--dashboard",
  },
  {
    step: "Step 03",
    icon: Icons.TrendingUp,
    title: "Improve",
    description:
      "Gain insights into spending behavior and make informed financial decisions.",
    accentClass: "feature-card--insights",
  },
];

const SHOWCASES = [
  {
    id: "dashboard",
    label: "Dashboard",
    accent: "dashboard",
    title: "Financial Overview At A Glance",
    description:
      "Monitor balances, income, expenses, and trends through an intuitive dashboard designed to provide instant visibility into your financial health.",
    checklist: [
      "Total Balance Tracking",
      "Income & Expense KPIs",
      "Balance Trend Visualization",
      "Expense Breakdown Charts",
    ],
    Preview: LiveSnapshotPreview,
    route: ROUTES.DASHBOARD,
    ctaLabel: "Explore Dashboard",
    reverse: false,
    panel: false,
  },
  {
    id: "transactions",
    label: "Transactions",
    accent: "transactions",
    title: "Powerful Transaction Management",
    description:
      "Manage financial records efficiently with advanced tools that go beyond basic CRUD functionality.",
    checklist: [
      "Search Transactions",
      "Advanced Filters",
      "Sorting & Ordering",
      "Pagination",
      "Add, Edit & Delete",
      "Sample Datasets",
    ],
    Preview: LiveLedgerPreview,
    route: ROUTES.TRANSACTIONS,
    ctaLabel: "Explore Transactions",
    reverse: true,
    panel: true,
  },
  {
    id: "insights",
    label: "Insights",
    accent: "insights",
    title: "Turn Data Into Financial Intelligence",
    description:
      "Transform transaction history into meaningful insights through trend analysis, category breakdowns, and behavioral indicators.",
    checklist: [
      "Spending Behavior Analysis",
      "Top Category Detection",
      "Income vs Expense Trends",
      "KPI Summaries",
      "Balance Movement Tracking",
    ],
    Preview: InsightVerdictPreview,
    route: ROUTES.INSIGHTS,
    ctaLabel: "Explore Insights",
    reverse: false,
    panel: false,
  },
];

const TECH_STACK = [
  {
    label: "Frontend",
    dotClass: "",
    tags: ["React 19", "Vite", "React Router", "Context API"],
  },
  {
    label: "Authentication",
    dotClass: "tech-stack-dot--auth",
    tags: ["Firebase Auth", "Google Sign-In", "Protected Routes"],
  },
  {
    label: "Analytics",
    dotClass: "tech-stack-dot--analytics",
    tags: ["Recharts", "Financial Insights", "Visualization Engine"],
  },
];

const SOCIAL_LINKS = [
  {
    href: "https://github.com/sushantshinde7",
    label: "GitHub",
    Icon: FaGithub,
    colorClass: "footer-social--github",
  },
  {
    href: "https://linkedin.com/in/sushantshinde7",
    label: "LinkedIn",
    Icon: FaLinkedin,
    colorClass: "footer-social--linkedin",
  },
  {
    href: "mailto:sushantshinde2024@gmail.com",
    label: "Email",
    Icon: Icons.Mail,
    colorClass: "footer-social--email",
  },
  {
    href: "https://sushantdev.vercel.app",
    label: "Portfolio",
    Icon: Icons.Globe,
    colorClass: "footer-social--portfolio",
  },
];

const HomePage = () => {
  return (
    // If your app's Layout component doesn't already render a
    // <main>, promote this to <main className="home-page">.
    // Two <main> landmarks on one page is a worse a11y issue
    // than none, so this isn't changed automatically.
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
          {FEATURES.map(
            ({ step, icon: Icon, title, description, accentClass }) => (
              <article key={title} className={`feature-card ${accentClass}`}>
                <span className="feature-card-step">{step}</span>
                <span className="feature-card-icon" aria-hidden="true">
                  <Icon size={22} />
                </span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ),
          )}
        </div>
      </section>

      {/* DASHBOARD / TRANSACTIONS / INSIGHTS SHOWCASES */}
      {SHOWCASES.map(
        ({
          id,
          label,
          accent,
          title,
          description,
          checklist,
          Preview,
          route,
          ctaLabel,
          reverse,
          panel,
        }) => (
          <section
            key={id}
            className={[
              "showcase-section",
              reverse && "showcase-section--reverse",
              panel && "showcase-section--panel",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <div className={`showcase-content showcase-content--${accent}`}>
              <span className="showcase-label">
                <span
                  className={`showcase-label-dot showcase-label-dot--${accent}`}
                  aria-hidden="true"
                />
                {label}
              </span>

              <h2>{title}</h2>
              <p>{description}</p>

              <ul className="showcase-check-list">
                {checklist.map((item) => (
                  <li key={item}>
                    <Icons.Check size={12} aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="showcase-preview">
              <div className="placeholder-card">
                <Preview />
                <Link to={route} className="mock-cta">
                  {ctaLabel} <Icons.ArrowRight size={13} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </section>
        ),
      )}

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
        <a
          href="https://github.com/sushantshinde7/finsights"
          target="_blank"
          rel="noopener noreferrer"
          className="oss-banner"
        >
          <FaGithub size={15} aria-hidden="true" />
          <span>Open source on GitHub</span>
          <Icons.ArrowRight
            size={14}
            className="oss-banner-arrow"
            aria-hidden="true"
          />
        </a>

        <div className="section-heading">
          <h2>Built With Modern Technologies</h2>
        </div>

        <div className="tech-stack-card">
          {TECH_STACK.map(({ label, dotClass, tags }) => (
            <div className="tech-stack-col" key={label}>
              <span className="tech-stack-label">
                <span
                  className={`tech-stack-dot ${dotClass}`}
                  aria-hidden="true"
                />
                {label}
              </span>
              <ul className="tech-tag-list">
                {tags.map((tag) => (
                  <li className="tech-tag" key={tag}>
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          ))}
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
          <Icons.ArrowRight size={18} aria-hidden="true" />
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="home-footer">
        <div className="footer-top">
          <div className="footer-brand">
            <h3>Finsights</h3>
            <p>Personal Finance Management & Financial Analytics Platform</p>
          </div>

          <div className="footer-right">
            <nav className="footer-nav" aria-label="Footer">
              <Link to={ROUTES.DASHBOARD}>Dashboard</Link>
              <Link to={ROUTES.TRANSACTIONS}>Transactions</Link>
              <Link to={ROUTES.INSIGHTS}>Insights</Link>
            </nav>

            <div className="footer-socials">
              {SOCIAL_LINKS.map(({ href, label, Icon, colorClass }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={colorClass}
                >
                  <Icon size={16} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} Finsights. Built by Sushant Shinde.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;

import { Link } from "react-router-dom";
import { motion, MotionConfig } from "framer-motion";
import { ROUTES } from "../../routes/routes";
import * as Icons from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

import {
  fadeUp,
  fadeIn,
  slideIn,
  staggerContainer,
  viewportOnce,
} from "../../lib/motion";

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
    // MotionConfig makes every motion.* element in this subtree
    // respect prefers-reduced-motion automatically. When you add
    // motion to other pages, lift this to your App root instead
    // of repeating it per page.
    <MotionConfig reducedMotion="user">
      {/* If your app's Layout component doesn't already render a
      <main>, promote this to <main className="home-page">.
      Two <main> landmarks on one page is a worse a11y issue
      than none, so this isn't changed automatically. */}
      <div className="home-page">
        {/* HERO — animates on mount, not on scroll, since it's
        already in view on load. */}
        <section className="hero-section">
          <motion.div
            className="hero-content"
            initial="hidden"
            animate="visible"
            variants={staggerContainer(0.12, 0.1)}
          >
            <motion.span className="hero-badge" variants={fadeUp}>
              <span className="hero-badge-dot" aria-hidden="true" />
              Finsights · Personal Finance, Simplified
            </motion.span>

            <motion.h1 className="hero-title" variants={fadeUp}>
              <span className="hero-title-line">
                Turn Everyday Transactions Into Financial Clarity.
              </span>
              <span className="hero-title-line">
                Track, Analyze, and Grow With Confidence.
              </span>
            </motion.h1>

            <motion.p className="hero-description" variants={fadeUp}>
              Track expenses, monitor income, and turn your transaction
              history into clear, actionable insights through interactive
              dashboards and modern financial tools.
            </motion.p>

            <motion.div className="hero-actions" variants={fadeUp}>
              <Link to={ROUTES.DASHBOARD} className="btn-primary">
                Explore Demo
              </Link>

              <Link to={ROUTES.SIGNUP} className="btn-secondary">
                Create Account
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            className="hero-preview"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <HeroPreview />
          </motion.div>
        </section>

        {/* FEATURES */}
        <section className="section">
          <motion.div
            className="section-heading"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeUp}
          >
            <h2>Everything You Need To Understand Your Finances</h2>
            <p>
              Finsights combines transaction management, analytics, and
              visualization into a single modern experience.
            </p>
          </motion.div>

          <motion.div
            className="feature-grid"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerContainer(0.1)}
          >
            {FEATURES.map(
              ({ step, icon: Icon, title, description, accentClass }) => (
                // Wrapped in a plain motion.div so the entrance
                // animation doesn't touch .feature-card's own
                // transform — that's still owned entirely by its
                // CSS :hover rule.
                <motion.div key={title} variants={fadeUp}>
                  <article className={`feature-card ${accentClass}`}>
                    <span className="feature-card-step">{step}</span>
                    <span className="feature-card-icon" aria-hidden="true">
                      <Icon size={22} />
                    </span>
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </article>
                </motion.div>
              ),
            )}
          </motion.div>
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
              <motion.div
                className={`showcase-content showcase-content--${accent}`}
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
                // Content slides in from the side it visually sits on,
                // so reversed (Transactions) rows feel intentional
                // rather than identical to the others.
                variants={slideIn(reverse ? "right" : "left")}
              >
                <span className="showcase-label">
                  <span
                    className={`showcase-label-dot showcase-label-dot--${accent}`}
                    aria-hidden="true"
                  />
                  {label}
                </span>

                <h2>{title}</h2>
                <p>{description}</p>

                <motion.ul
                  className="showcase-check-list"
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewportOnce}
                  variants={staggerContainer(0.06, 0.15)}
                >
                  {checklist.map((item) => (
                    <motion.li key={item} variants={fadeUp}>
                      <Icons.Check size={12} aria-hidden="true" />
                      {item}
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>

              <motion.div
                className="showcase-preview"
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
                variants={slideIn(reverse ? "left" : "right")}
              >
                <div className="placeholder-card">
                  <Preview />
                  <Link to={route} className="mock-cta">
                    {ctaLabel}{" "}
                    <Icons.ArrowRight size={13} aria-hidden="true" />
                  </Link>
                </div>
              </motion.div>
            </section>
          ),
        )}

        {/* GUEST MODE */}
        <motion.section
          className="guest-section"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
        >
          <div className="guest-content">
            <h2>Explore Before You Sign Up</h2>
            <p>
              Browse the dashboard, transactions, and insights pages without
              creating an account. Sign up only when you're ready to manage
              your own financial data.
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
        </motion.section>

        {/* TECH STACK */}
        <section className="section">
          {/* Wrapped so entrance animation doesn't touch the
          anchor's own transform — .oss-banner:hover owns that. */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeUp}
            style={{ display: "flex", justifyContent: "center" }}
          >
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
          </motion.div>

          <motion.div
            className="section-heading"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeUp}
          >
            <h2>Built With Modern Technologies</h2>
          </motion.div>

          <motion.div
            className="tech-stack-card"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerContainer(0.12)}
          >
            {TECH_STACK.map(({ label, dotClass, tags }) => (
              <motion.div className="tech-stack-col" key={label} variants={fadeIn}>
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
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* CTA — fade+scale rather than fade+rise, so the one bold
        color moment on the page also feels like the one distinct
        entrance, not a repeat of every section above it. */}
        <motion.section
          className="cta-section"
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={viewportOnce}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2>Take Control Of Your Finances</h2>

          <p>
            Start tracking, analyzing, and understanding your money through a
            modern finance management experience.
          </p>

          <Link to={ROUTES.SIGNUP} className="cta-button">
            Get Started
            <Icons.ArrowRight size={18} aria-hidden="true" />
          </Link>
        </motion.section>

        {/* FOOTER — deliberately NOT animated. By the time someone
        scrolls here they want immediate access to links, not a
        delay; entrance motion on a footer reads as an afterthought
        rather than a polish. */}
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
    </MotionConfig>
  );
};

export default HomePage;
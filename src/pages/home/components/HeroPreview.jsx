// HeroPreview.jsx
import { useEffect, useRef, useState } from "react";
import { TrendingUp, Radio } from "lucide-react";
import "./HeroPreview.css";

const TICKER_ITEMS = [
  "Spending on Groceries dropped 12% this month",
  "You saved ₹18,400 more than last month",
  "Top category: Rent — ₹22,900",
  "Net balance trending upward for 3 weeks",
];

function useCountUp(target, duration = 1400) {
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    let start;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setValue(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);

  return value;
}

export default function HeroPreview() {
  const [tickIndex, setTickIndex] = useState(0);
  const [drawn, setDrawn] = useState(false);
  const balance = useCountUp(505300);

  useEffect(() => {
    const t = setTimeout(() => setDrawn(true), 150);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTickIndex((i) => (i + 1) % TICKER_ITEMS.length);
    }, 3600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="preview-card">
      <div className="preview-header">
        <div className="preview-header-dots">
          <span />
          <span />
          <span />
        </div>
        <div className="live-indicator">
          <Radio size={11} />
          Live Preview
        </div>
      </div>

      <div className="preview-body-live">
        <div className="preview-live-top">
          <span className="preview-live-label">Total Balance</span>
          <span className="preview-live-value">
            ₹{balance.toLocaleString("en-IN")}
          </span>
        </div>

        <div className="preview-chart-wrap">
          <svg
            className="preview-chart-svg"
            viewBox="0 0 400 160"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="heroFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" style={{ stopColor: "var(--color-primary)", stopOpacity: 0.35 }} />
                <stop offset="100%" style={{ stopColor: "var(--color-primary)", stopOpacity: 0 }} />
              </linearGradient>
            </defs>

            <path
              className="preview-chart-fill"
              d="M0,120 C40,100 60,130 100,105 C140,80 160,95 200,70 C240,50 260,65 300,40 C330,20 360,35 400,15 L400,160 L0,160 Z"
              fill="url(#heroFill)"
            />

            <path
              className={`preview-chart-line ${drawn ? "is-drawn" : ""}`}
              d="M0,120 C40,100 60,130 100,105 C140,80 160,95 200,70 C240,50 260,65 300,40 C330,20 360,35 400,15"
              fill="none"
              pathLength="1"
            />
          </svg>

          <div className={`preview-badge ${drawn ? "is-visible" : ""}`}>
            <TrendingUp size={13} />
            +₹18,400
          </div>
        </div>

        <div className="preview-ticker">
          <span className="preview-ticker-dot" />
          <p key={tickIndex} className="preview-ticker-text">
            {TICKER_ITEMS[tickIndex]}
          </p>
        </div>
      </div>
    </div>
  );
}
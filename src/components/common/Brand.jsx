import "./Brand.css";

// Logomark: rounded tile + four-slice ring (a nod to the expense-breakdown
// chart) around the F taken from the wordmark font (Plus Jakarta Sans 800).
// Slices step down in size and opacity; the smallest, green one is thicker
// and brighter: the "insight".
export const BrandMark = ({ className = "" }) => (
  <svg
    className={`brand-mark ${className}`.trim()}
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
  >
    <rect className="brand-mark-tile" width="24" height="24" rx="7" />
    <g transform="rotate(-90 12 12)" fill="none">
      <circle cx="12" cy="12" r="8.4" stroke="#fff" strokeWidth="2.4" strokeDasharray="21.11 31.67" strokeDashoffset="0" />
      <circle cx="12" cy="12" r="8.4" stroke="#fff" strokeOpacity="0.6" strokeWidth="2.4" strokeDasharray="12.93 39.85" strokeDashoffset="-22.69" />
      <circle cx="12" cy="12" r="8.4" stroke="#fff" strokeOpacity="0.3" strokeWidth="2.4" strokeDasharray="7.39 45.39" strokeDashoffset="-37.21" />
      <circle cx="12" cy="12" r="8.55" stroke="#4ade80" strokeWidth="3.1" strokeDasharray="5.10 48.62" strokeDashoffset="-47.01" />
    </g>
    <path
      transform="translate(8.424 16.150) scale(0.01114 -0.01114)"
      d="M66 0V745H576V610H221V421H526V286H221V0Z"
      fill="#fff"
    />
  </svg>
);

const Brand = () => (
  <span className="brand">
    <BrandMark />
    <span className="brand-name">Finsights</span>
  </span>
);

export default Brand;
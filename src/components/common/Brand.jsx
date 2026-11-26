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
      <circle
        cx="12"
        cy="12"
        r="8.4"
        stroke="#fff"
        strokeWidth="2.4"
        strokeDasharray="21.11 31.67"
        strokeDashoffset="0"
      />
      <circle
        cx="12"
        cy="12"
        r="8.4"
        stroke="#fff"
        strokeOpacity="0.6"
        strokeWidth="2.4"
        strokeDasharray="12.93 39.85"
        strokeDashoffset="-22.69"
      />
      <circle
        cx="12"
        cy="12"
        r="8.4"
        stroke="#fff"
        strokeOpacity="0.3"
        strokeWidth="2.4"
        strokeDasharray="7.39 45.39"
        strokeDashoffset="-37.21"
      />
      <circle
        cx="12"
        cy="12"
        r="8.55"
        stroke="#4ade80"
        strokeWidth="3.1"
        strokeDasharray="5.10 48.62"
        strokeDashoffset="-47.01"
      />
    </g>
    <path
      transform="translate(8.143 16.150) scale(0.005788 -0.005788)"
      d="M889 1400Q931 1400 959.5 1408.5Q988 1417 1011.0 1425.5Q1034 1434 1057 1434Q1096 1434 1116.0 1414.5Q1136 1395 1149 1349L1234 1048Q1242 1022 1226.5 1003.5Q1211 985 1184 981Q1161 977 1139.0 985.5Q1117 994 1103 1023Q1051 1130 1004.0 1185.0Q957 1240 906.0 1260.0Q855 1280 790 1280H627V192Q627 169 639.0 152.5Q651 136 678 131L753 119Q781 113 793.0 98.5Q805 84 805 56Q805 31 787.5 15.5Q770 0 733 0H169Q132 0 114.0 15.5Q96 31 96 56Q96 101 143 118L191 131Q216 140 228.5 154.5Q241 169 241 192V1208Q241 1231 228.5 1245.5Q216 1260 191 1269L143 1282Q96 1299 96 1344Q96 1370 114.0 1385.0Q132 1400 169 1400ZM483 728H778Q842 728 868.5 753.0Q895 778 915 852Q923 878 938.0 889.0Q953 900 973 900Q1022 902 1034 853L1110 544Q1118 513 1108.5 496.0Q1099 479 1077 471Q1054 463 1033.0 470.5Q1012 478 994 503Q966 545 942.0 568.5Q918 592 887.0 601.0Q856 610 807 610H483Z"
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

import type { PredictResponse } from "../Types";

interface Props {
  result: PredictResponse;
  onReset: () => void;
}

const INDEX_LABELS = [
  { index: 0, short: "Ext. Weak" },
  { index: 1, short: "Weak" },
  { index: 2, short: "Normal" },
  { index: 3, short: "Overweight" },
  { index: 4, short: "Obese" },
  { index: 5, short: "Ext. Obese" },
];

const SEVERITY_ICONS: Record<string, string> = {
  critical: "✕",
  warning: "▲",
  caution: "◎",
  good: "✓",
};

export default function ResultCard({ result, onReset }: Props) {
  const percent = ((result.index / 5) * 100).toFixed(0);

  return (
    <div className="card result-card">
      {/* Score header */}
      <div className="result-header" style={{ "--accent": result.color } as React.CSSProperties}>
        <div className="score-badge" style={{ borderColor: result.color }}>
          <span className="score-icon" style={{ color: result.color }}>
            {SEVERITY_ICONS[result.severity]}
          </span>
          <span className="score-number" style={{ color: result.color }}>
            {result.index}
          </span>
          <span className="score-of">/5</span>
        </div>
        <div className="score-meta">
          <h2 className="result-label" style={{ color: result.color }}>
            {result.label}
          </h2>
          <p className="result-bmi">BMI: <strong>{result.bmi}</strong></p>
        </div>
      </div>

      {/* Index scale */}
      <div className="scale-section">
        <div className="scale-track">
          {INDEX_LABELS.map(({ index, short }) => (
            <div
              key={index}
              className={`scale-step ${result.index === index ? "active" : ""}`}
            >
              <div
                className="scale-dot"
                style={result.index === index ? { background: result.color, borderColor: result.color } : {}}
              />
              <span className="scale-label">{short}</span>
            </div>
          ))}
        </div>
        <div className="scale-bar">
          <div
            className="scale-fill"
            style={{ width: `${percent}%`, background: result.color }}
          />
        </div>
      </div>

      {/* Description */}
      <div className="result-body">
        <div className="result-section">
          <h3 className="section-heading">What this means</h3>
          <p className="section-text">{result.description}</p>
        </div>

        <div className="result-section advice-box" style={{ borderLeftColor: result.color }}>
          <h3 className="section-heading">Recommendation</h3>
          <p className="section-text">{result.advice}</p>
        </div>
      </div>

      <button className="reset-btn" onClick={onReset}>
        ← Check Again
      </button>
    </div>
  );
}

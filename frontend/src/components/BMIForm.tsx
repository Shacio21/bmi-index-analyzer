import { useState, FormEvent } from "react";

interface Props {
  onSubmit: (data: { gender: string; height: number; weight: number }) => void;
  loading: boolean;
  error: string | null;
}

export default function BMIForm({ onSubmit, loading, error }: Props) {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [touched, setTouched] = useState({ height: false, weight: false });

  const heightNum = parseFloat(height);
  const weightNum = parseFloat(weight);
  const heightErr = touched.height && (isNaN(heightNum) || heightNum < 50 || heightNum > 300);
  const weightErr = touched.weight && (isNaN(weightNum) || weightNum < 10 || weightNum > 500);
  const canSubmit = !isNaN(heightNum) && !isNaN(weightNum) && heightNum >= 50 && weightNum >= 10;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit({ gender, height: heightNum, weight: weightNum });
  };

  return (
    <div className="card form-card">
      <div className="card-header">
        <h2>Check Your Body Index</h2>
        <p>Enter your details below to get an instant analysis</p>
      </div>

      <form onSubmit={handleSubmit} className="form">
        {/* Gender */}
        <div className="field">
          <label className="field-label">Gender</label>
          <div className="gender-toggle">
            <button
              type="button"
              className={`gender-btn ${gender === "male" ? "active" : ""}`}
              onClick={() => setGender("male")}
            >
              <span className="gender-icon">♂</span>
              Male
            </button>
            <button
              type="button"
              className={`gender-btn ${gender === "female" ? "active" : ""}`}
              onClick={() => setGender("female")}
            >
              <span className="gender-icon">♀</span>
              Female
            </button>
          </div>
        </div>

        {/* Height */}
        <div className="field">
          <label className="field-label" htmlFor="height">
            Height <span className="field-unit">cm</span>
          </label>
          <input
            id="height"
            type="number"
            className={`field-input ${heightErr ? "input-error" : ""}`}
            placeholder="e.g. 170"
            value={height}
            min={50}
            max={300}
            onChange={(e) => setHeight(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, height: true }))}
          />
          {heightErr && <span className="field-error">Enter a valid height (50–300 cm)</span>}
        </div>

        {/* Weight */}
        <div className="field">
          <label className="field-label" htmlFor="weight">
            Weight <span className="field-unit">kg</span>
          </label>
          <input
            id="weight"
            type="number"
            className={`field-input ${weightErr ? "input-error" : ""}`}
            placeholder="e.g. 65"
            value={weight}
            min={10}
            max={500}
            onChange={(e) => setWeight(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, weight: true }))}
          />
          {weightErr && <span className="field-error">Enter a valid weight (10–500 kg)</span>}
        </div>

        {error && (
          <div className="api-error">
            <span>⚠</span> {error}
          </div>
        )}

        <button
          type="submit"
          className={`submit-btn ${loading ? "loading" : ""}`}
          disabled={!canSubmit || loading}
        >
          {loading ? (
            <>
              <span className="spinner" />
              Analyzing...
            </>
          ) : (
            "Analyze My Body Index →"
          )}
        </button>
      </form>
    </div>
  );
}

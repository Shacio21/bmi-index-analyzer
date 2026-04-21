import { useState } from "react";
import BMIForm from "./components/BMIForm";
import ResultCard from "./components/ResultCard";
import type { PredictResponse } from "./Types";
import "./App.css";

export default function App() {
  const [result, setResult] = useState<PredictResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePredict = async (data: {
    gender: string;
    height: number;
    weight: number;
  }) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Prediction failed");
      }
      const json: PredictResponse = await res.json();
      setResult(json);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="app">
      <div className="bg-shapes">
        <div className="shape shape-1" />
        <div className="shape shape-2" />
        <div className="shape shape-3" />
      </div>

      <header className="header">
        <div className="logo-mark">BMI</div>
        <h1 className="site-title">Body Index Analyzer</h1>
        <p className="site-sub">Powered by Machine Learning</p>
      </header>

      <main className="main">
        {!result ? (
          <BMIForm onSubmit={handlePredict} loading={loading} error={error} />
        ) : (
          <ResultCard result={result} onReset={handleReset} />
        )}
      </main>

      <footer className="footer">
        <p>For informational purposes only — not a substitute for medical advice.</p>
      </footer>
    </div>
  );
}
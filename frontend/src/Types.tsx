export interface PredictResponse {
  index: number;
  label: string;
  short: string;
  description: string;
  color: string;
  severity: "critical" | "warning" | "caution" | "good";
  advice: string;
  bmi: number;
}

export interface FormData {
  gender: "male" | "female";
  height: number;
  weight: number;
}
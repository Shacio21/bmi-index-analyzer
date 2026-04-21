# BMI Index Analyzer

![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=flat&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?style=flat&logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)

A full-stack BMI classification app powered by a Gradient Boosting ML model. Users input their gender, height, and weight and instantly receive a body index score (0–5) with an interpreted result, health description, and personalized recommendation.

---

## Screenshot

> _Add a screenshot or screen recording of the app here._
> `![App Screenshot](./docs/screenshot.png)`

---

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 18, TypeScript, Vite          |
| Backend   | FastAPI, Uvicorn, Pydantic          |
| ML Model  | scikit-learn, Gradient Boosting, joblib |
| Styling   | Plain CSS, Google Fonts (Syne + DM Sans) |

---

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+

### Backend

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

API runs at `http://localhost:8000`  
Interactive docs at `http://localhost:8000/docs`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:5173`

---

## API Reference

### `POST /predict`

Classifies a user's body index based on gender, height, and weight.

**Request**

```json
{
  "gender": "male",
  "height": 175,
  "weight": 80
}
```

| Field    | Type   | Constraints         |
|----------|--------|---------------------|
| `gender` | string | `"male"` or `"female"` |
| `height` | float  | 50–300 cm           |
| `weight` | float  | 10–500 kg           |

**Response**

```json
{
  "index": 3,
  "label": "Overweight",
  "short": "Overweight",
  "description": "Your body weight is slightly above the healthy range...",
  "color": "#eab308",
  "severity": "caution",
  "advice": "Aim for moderate exercise (30 min/day)...",
  "bmi": 26.1
}
```

---

## BMI Index Scale

| Index | Category        | Severity |
|-------|-----------------|----------|
| 0     | Extremely Weak  | Critical |
| 1     | Weak            | Warning  |
| 2     | Normal          | Good ✓   |
| 3     | Overweight      | Caution  |
| 4     | Obese           | Warning  |
| 5     | Extremely Obese | Critical |

---

## Model

- **Algorithm:** Gradient Boosting Classifier (scikit-learn)
- **Dataset:** 500 samples, 3 features — Gender, Height (cm), Weight (kg)
- **Train / Test split:** 80% / 20% with stratification
- **Test accuracy:** 83%
- **Features used:** Gender (encoded), Height, Weight
- **Feature importance:** Weight (~68%) › Height (~31%) › Gender (~1%)

The trained model is saved as `backend/bmi_model.pkl` and loaded at server startup via `joblib`.

---

## Project Structure

```
bmi-index-analyzer/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── bmi_model.pkl        # Trained ML model
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── App.tsx
    │   ├── App.css
    │   ├── main.tsx
    │   ├── types.ts
    │   └── components/
    │       ├── BMIForm.tsx
    │       └── ResultCard.tsx
    ├── index.html
    ├── package.json
    └── vite.config.ts
```

---

## License

MIT — see [LICENSE](./LICENSE) for details.

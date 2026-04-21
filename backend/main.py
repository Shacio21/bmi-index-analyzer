from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, validator
import joblib
import numpy as np
import os

app = FastAPI(title="BMI Classifier API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = os.path.join(os.path.dirname(__file__), "bmi_model.pkl")
model = joblib.load(MODEL_PATH)

BMI_CATEGORIES = {
    0: {
        "label": "Extremely Weak",
        "short": "Extremely Weak",
        "description": "Your body weight is critically low. This may indicate severe malnutrition or an underlying health condition. Please consult a doctor as soon as possible.",
        "color": "#ef4444",
        "severity": "critical",
        "advice": "Seek immediate medical attention and consult a nutritionist to develop a healthy weight-gain plan.",
    },
    1: {
        "label": "Weak",
        "short": "Underweight",
        "description": "Your body weight is below the healthy range. Being underweight can weaken your immune system and reduce energy levels.",
        "color": "#f97316",
        "severity": "warning",
        "advice": "Increase caloric intake with nutrient-dense foods. Consider consulting a dietitian for a personalized meal plan.",
    },
    2: {
        "label": "Normal",
        "short": "Healthy Weight",
        "description": "Your body weight is within the healthy range. Keep up your balanced diet and regular physical activity.",
        "color": "#22c55e",
        "severity": "good",
        "advice": "Maintain your current lifestyle. Regular exercise (150 min/week) and a balanced diet will keep you in great shape.",
    },
    3: {
        "label": "Overweight",
        "short": "Overweight",
        "description": "Your body weight is slightly above the healthy range. This can increase the risk of heart disease, diabetes, and joint problems.",
        "color": "#eab308",
        "severity": "caution",
        "advice": "Aim for moderate exercise (30 min/day) and reduce intake of processed foods and sugary drinks.",
    },
    4: {
        "label": "Obesity",
        "short": "Obese",
        "description": "Your body weight is significantly above the healthy range. Obesity increases the risk of serious health conditions like type 2 diabetes and cardiovascular disease.",
        "color": "#f97316",
        "severity": "warning",
        "advice": "Consult your doctor for a structured weight-loss plan. Focus on sustainable lifestyle changes rather than crash diets.",
    },
    5: {
        "label": "Extreme Obesity",
        "short": "Extremely Obese",
        "description": "Your body weight poses serious health risks. Extreme obesity is associated with heart disease, sleep apnea, and reduced life expectancy.",
        "color": "#ef4444",
        "severity": "critical",
        "advice": "Please seek medical guidance immediately. A healthcare professional can help create a safe and effective weight management program.",
    },
}


class PredictRequest(BaseModel):
    gender: str = Field(..., description="'male' or 'female'")
    height: float = Field(..., gt=50, lt=300, description="Height in centimeters")
    weight: float = Field(..., gt=10, lt=500, description="Weight in kilograms")

    @validator("gender")
    def validate_gender(cls, v):
        if v.lower() not in ("male", "female"):
            raise ValueError("gender must be 'male' or 'female'")
        return v.lower()


class PredictResponse(BaseModel):
    index: int
    label: str
    short: str
    description: str
    color: str
    severity: str
    advice: str
    bmi: float


@app.get("/")
def root():
    return {"message": "BMI Classifier API is running"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    gender_encoded = 1 if req.gender == "male" else 0
    features = np.array([[gender_encoded, req.height, req.weight]])

    try:
        index = int(model.predict(features)[0])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

    bmi = round(req.weight / ((req.height / 100) ** 2), 1)
    category = BMI_CATEGORIES[index]

    return PredictResponse(
        index=index,
        label=category["label"],
        short=category["short"],
        description=category["description"],
        color=category["color"],
        severity=category["severity"],
        advice=category["advice"],
        bmi=bmi,
    )

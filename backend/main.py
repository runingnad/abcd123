from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json
import random
import asyncio
from datetime import datetime, timedelta
import uuid
import joblib
import pandas as pd
import numpy as np
import base64
import io
from PIL import Image
import cv2
import numpy as np


# Load ML model at startup
try:
    model = joblib.load('model.pkl')
    label_encoder = joblib.load('label_encoder.pkl')
    print("✅ ML model loaded successfully!")
except Exception as e:
    print(f"⚠️  Warning: Could not load ML model: {e}")
    model = None
    label_encoder = None

app = FastAPI(title="TrialChain+ColdCare API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

trials_db = [
    {
        "batchID": "BATCH001",
        "drugName": "COVID-19 Vaccine (Moderna)",
        "expiry": "2024-12-31",
        "sender": "Moderna Pharmaceuticals",
        "receiver": "City General Hospital",
        "status": "approved",
        "timestamp": "2024-01-15T10:30:00Z",
        "approved_by": "Regulator_001",
        "approval_timestamp": "2024-01-15T11:45:00Z"
    },
    {
        "batchID": "BATCH002",
        "drugName": "Cancer Treatment Drug (Keytruda)",
        "expiry": "2025-06-30",
        "sender": "Merck & Co.",
        "receiver": "Oncology Center",
        "status": "approved",
        "timestamp": "2024-01-14T14:20:00Z",
        "approved_by": "Regulator_002",
        "approval_timestamp": "2024-01-14T16:10:00Z"
    },
    {
        "batchID": "BATCH003",
        "drugName": "Diabetes Medication (Ozempic)",
        "expiry": "2024-11-15",
        "sender": "Novo Nordisk",
        "receiver": "Regional Medical Center",
        "status": "pending",
        "timestamp": "2024-01-16T09:15:00Z"
    },
    {
        "batchID": "BATCH004",
        "drugName": "Antibiotic (Amoxicillin)",
        "expiry": "2025-03-31",
        "sender": "Pfizer Labs",
        "receiver": "Community Clinic",
        "status": "approved",
        "timestamp": "2024-01-13T13:45:00Z",
        "approved_by": "Regulator_001",
        "approval_timestamp": "2024-01-13T15:30:00Z"
    },
    {
        "batchID": "BATCH005",
        "drugName": "Pain Management (Oxycodone)",
        "expiry": "2024-08-20",
        "sender": "Purdue Pharma",
        "receiver": "Emergency Department",
        "status": "pending",
        "timestamp": "2024-01-16T11:30:00Z"
    }
]

coldchain_db = [
    {
        "batchID": "BATCH001",
        "temperature": 4.2,
        "humidity": 45.3,
        "timestamp": "2024-01-16T12:00:00Z"
    },
    {
        "batchID": "BATCH001",
        "temperature": 4.5,
        "humidity": 46.1,
        "timestamp": "2024-01-16T12:05:00Z"
    },
    {
        "batchID": "BATCH001",
        "temperature": 4.1,
        "humidity": 44.8,
        "timestamp": "2024-01-16T12:10:00Z"
    },
    {
        "batchID": "BATCH001",
        "temperature": 4.3,
        "humidity": 45.7,
        "timestamp": "2024-01-16T12:15:00Z"
    },
    {
        "batchID": "BATCH001",
        "temperature": 4.0,
        "humidity": 45.2,
        "timestamp": "2024-01-16T12:20:00Z"
    },
    {
        "batchID": "BATCH002",
        "temperature": 3.8,
        "humidity": 47.2,
        "timestamp": "2024-01-16T12:00:00Z"
    },
    {
        "batchID": "BATCH002",
        "temperature": 3.9,
        "humidity": 47.5,
        "timestamp": "2024-01-16T12:05:00Z"
    },
    {
        "batchID": "BATCH002",
        "temperature": 3.7,
        "humidity": 46.9,
        "timestamp": "2024-01-16T12:10:00Z"
    },
    {
        "batchID": "BATCH002",
        "temperature": 3.8,
        "humidity": 47.1,
        "timestamp": "2024-01-16T12:15:00Z"
    },
    {
        "batchID": "BATCH002",
        "temperature": 3.6,
        "humidity": 46.8,
        "timestamp": "2024-01-16T12:20:00Z"
    },
    {
        "batchID": "BATCH003",
        "temperature": 5.2,
        "humidity": 43.1,
        "timestamp": "2024-01-16T12:00:00Z"
    },
    {
        "batchID": "BATCH003",
        "temperature": 5.5,
        "humidity": 43.8,
        "timestamp": "2024-01-16T12:05:00Z"
    },
    {
        "batchID": "BATCH003",
        "temperature": 5.8,
        "humidity": 44.2,
        "timestamp": "2024-01-16T12:10:00Z"
    },
    {
        "batchID": "BATCH003",
        "temperature": 6.1,
        "humidity": 44.7,
        "timestamp": "2024-01-16T12:15:00Z"
    },
    {
        "batchID": "BATCH003",
        "temperature": 6.3,
        "humidity": 45.1,
        "timestamp": "2024-01-16T12:20:00Z"
    }
]
inventory_db = [
    {
        "id": 1,
        "name": "Amoxicillin 500mg",
        "category": "Antibiotics",
        "stock": 45,
        "maxStock": 50,
        "price": 45.99,
        "status": "low",
        "expiry": "2024-12-31",
        "supplier": "Pfizer Labs",
        "location": "Storage A"
    },
    {
        "id": 2,
        "name": "Surgical Gloves (Box)",
        "category": "Consumables",
        "stock": 156,
        "maxStock": 100,
        "price": 23.5,
        "status": "good",
        "expiry": "2025-06-30",
        "supplier": "Medical Supplies Co",
        "location": "Storage B"
    },
    {
        "id": 3,
        "name": "Insulin Pens",
        "category": "Diabetes Care",
        "stock": 12,
        "maxStock": 25,
        "price": 89.99,
        "status": "critical",
        "expiry": "2024-11-15",
        "supplier": "Novo Nordisk",
        "location": "Cold Storage"
    },
    {
        "id": 4,
        "name": "Blood Pressure Monitors",
        "category": "Equipment",
        "stock": 8,
        "maxStock": 5,
        "price": 129.99,
        "status": "good",
        "expiry": "2026-12-31",
        "supplier": "Omron Healthcare",
        "location": "Equipment Room"
    },
    {
        "id": 5,
        "name": "Paracetamol 500mg",
        "category": "Pain Management",
        "stock": 25,
        "maxStock": 30,
        "price": 12.99,
        "status": "low",
        "expiry": "2025-03-31",
        "supplier": "Generic Pharma",
        "location": "Storage A"
    }
]
alerts_db = [
    {
        "id": 1,
        "type": "low_stock",
        "message": "Amoxicillin 500mg is running low (45 units left)",
        "time": "5 min ago",
        "severity": "warning",
        "item_id": 1
    },
    {
        "id": 2,
        "type": "expiry",
        "message": "Insulin Pens expire in 30 days",
        "time": "1 hour ago",
        "severity": "warning",
        "item_id": 3
    },
    {
        "id": 3,
        "type": "critical",
        "message": "Insulin Pens below critical threshold (12 units)",
        "time": "2 hours ago",
        "severity": "critical",
        "item_id": 3
    }
]
blockchain_activity = [
    {
        "id": 1,
        "type": "stock_update",
        "hash": "0x1a2b3c4d",
        "item": "Amoxicillin 500mg",
        "action": "Quantity updated: 50 → 45",
        "time": "2 min ago",
        "block": "12847592"
    },
    {
        "id": 2,
        "type": "purchase_order",
        "hash": "0x5e6f7g8h",
        "item": "Surgical Gloves",
        "action": "Order created: 500 units",
        "time": "15 min ago",
        "block": "12847588"
    },
    {
        "id": 3,
        "type": "item_added",
        "hash": "0x9i0j1k2l",
        "item": "Blood Pressure Monitor",
        "action": "New item added to inventory",
        "time": "1 hour ago",
        "block": "12847585"
    }
]

class DrugBatch(BaseModel):
    batchID: Optional[str] = None
    drugName: str
    expiry: str
    sender: str
    receiver: str
    status: str = "pending"
    timestamp: str = datetime.now().isoformat()
    approved_by: Optional[str] = None

class SensorData(BaseModel):
    batchID: str
    temperature: float
    humidity: float
    timestamp: str = datetime.now().isoformat()

class RiskAnalysis(BaseModel):
    batchID: str
    risk_score: float
    status: str
    recommendations: List[str]

class PredictionRequest(BaseModel):
    batch_id: str
    temp_c: float
    humidity: float

class PredictionResponse(BaseModel):
    batch_id: str
    risk: str

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except:
                pass

manager = ConnectionManager()



@app.post("/trials")
async def create_batch(batch: DrugBatch):
    batch.batchID = str(uuid.uuid4())[:8].upper()
    batch.timestamp = datetime.now().isoformat()
    trials_db.append(batch.dict())
    return {"message": "Batch created successfully", "batch": batch.dict()}

@app.get("/trials")
async def get_all_batches():
    return {"batches": trials_db}

@app.put("/trials/{batch_id}/approve")
async def approve_batch(batch_id: str, regulator: str = "Regulator_001"):
    for batch in trials_db:
        if batch["batchID"] == batch_id:
            batch["status"] = "approved"
            batch["approved_by"] = regulator
            batch["approval_timestamp"] = datetime.now().isoformat()
            return {"message": f"Batch {batch_id} approved by {regulator}"}
    raise HTTPException(status_code=404, detail="Batch not found")

@app.post("/coldchain")
async def submit_sensor_data(data: SensorData):
    coldchain_db.append(data.dict())
    await manager.broadcast(json.dumps({
        "type": "sensor_data",
        "data": data.dict()
    }))
    return {"message": "Sensor data recorded"}

@app.get("/coldchain/risk")
async def get_risk_analysis(batch_id: str):
    batch_data = [d for d in coldchain_db if d["batchID"] == batch_id]
    
    if not batch_data:
        raise HTTPException(status_code=404, detail="No data found for batch")
    
    temperatures = [d["temperature"] for d in batch_data]
    avg_temp = sum(temperatures) / len(temperatures)
    temp_variance = sum((t - avg_temp) ** 2 for t in temperatures) / len(temperatures)
    
    risk_score = 0.0
    if avg_temp > 8 or avg_temp < 2:
        risk_score += 0.6
    if temp_variance > 2:
        risk_score += 0.4
    
    status = "SAFE" if risk_score < 0.5 else "SPOILED"
    
    recommendations = []
    if avg_temp > 8:
        recommendations.append("Temperature too high - check refrigeration")
    elif avg_temp < 2:
        recommendations.append("Temperature too low - risk of freezing")
    if temp_variance > 2:
        recommendations.append("Temperature fluctuations detected")
    
    analysis = RiskAnalysis(
        batchID=batch_id,
        risk_score=risk_score,
        status=status,
        recommendations=recommendations
    )
    
    return analysis

@app.get("/coldchain/data/{batch_id}")
async def get_batch_data(batch_id: str):
    batch_data = [d for d in coldchain_db if d["batchID"] == batch_id]
    return {"data": batch_data}



# ML Model Prediction Endpoints
class PredictionRequest(BaseModel):
    batch_id: str
    temp_c: float
    humidity: float

@app.post("/coldchain/predict")
async def predict_risk(request: PredictionRequest):
    """Predict risk for a batch based on temperature and humidity"""
    try:
        if model is None or label_encoder is None:
            raise HTTPException(status_code=500, detail="ML model not loaded")
        
        # Make prediction
        features = [[request.temp_c, request.humidity]]
        prediction_encoded = model.predict(features)[0]
        prediction = label_encoder.inverse_transform([prediction_encoded])[0]
        
        # Get prediction probability
        probabilities = model.predict_proba(features)[0]
        risk_score = probabilities[1] if prediction == "Spoiled" else probabilities[0]
        
        return {
            "batch_id": request.batch_id,
            "temp_c": request.temp_c,
            "humidity": request.humidity,
            "risk": prediction,
            "risk_score": round(risk_score * 100, 2)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")



# ML Model Prediction Endpoints
class PredictionRequest(BaseModel):
    batch_id: str
    temp_c: float
    humidity: float

@app.post("/coldchain/predict")
async def predict_risk(request: PredictionRequest):
    """Predict risk for a batch based on temperature and humidity"""
    try:
        if model is None or label_encoder is None:
            raise HTTPException(status_code=500, detail="ML model not loaded")
        
        # Make prediction
        features = [[request.temp_c, request.humidity]]
        prediction_encoded = model.predict(features)[0]
        prediction = label_encoder.inverse_transform([prediction_encoded])[0]
        
        # Get prediction probability
        probabilities = model.predict_proba(features)[0]
        risk_score = probabilities[1] if prediction == "Spoiled" else probabilities[0]
        
        return {
            "batch_id": request.batch_id,
            "temp_c": request.temp_c,
            "humidity": request.humidity,
            "risk": prediction,
            "risk_score": round(risk_score * 100, 2)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.get("/coldchain/test")
async def test_model():
    """Test the ML model with dummy data"""
    try:
        if model is None or label_encoder is None:
            raise HTTPException(status_code=500, detail="ML model not loaded")
        
        # Test with safe conditions
        safe_features = [[4.2, 45]]
        safe_prediction_encoded = model.predict(safe_features)[0]
        safe_prediction = label_encoder.inverse_transform([safe_prediction_encoded])[0]
        
        # Test with spoiled conditions
        spoiled_features = [[1.5, 60]]
        spoiled_prediction_encoded = model.predict(spoiled_features)[0]
        spoiled_prediction = label_encoder.inverse_transform([spoiled_prediction_encoded])[0]
        
        return {
            "model_status": "loaded",
            "test_predictions": {
                "safe_conditions": {
                    "temp_c": 4.2,
                    "humidity": 45,
                    "prediction": safe_prediction
                },
                "spoiled_conditions": {
                    "temp_c": 1.5,
                    "humidity": 60,
                    "prediction": spoiled_prediction
                }
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Test failed: {str(e)}")

# Inventory Management Endpoints
@app.get("/inventory")
async def get_inventory():
    return {"items": inventory_db}

@app.get("/inventory/{item_id}")
async def get_inventory_item(item_id: int):
    for item in inventory_db:
        if item["id"] == item_id:
            return item
    raise HTTPException(status_code=404, detail="Item not found")

@app.post("/inventory")
async def add_inventory_item(item: dict):
    item["id"] = len(inventory_db) + 1
    inventory_db.append(item)
    return {"message": "Item added successfully", "item": item}

# Alerts Endpoints
@app.get("/alerts")
async def get_alerts():
    return {"alerts": alerts_db}

@app.put("/alerts/{alert_id}/resolve")
async def resolve_alert(alert_id: int):
    for alert in alerts_db:
        if alert["id"] == alert_id:
            alert["resolved"] = True
            alert["resolved_at"] = datetime.now().isoformat()
            return {"message": f"Alert {alert_id} resolved"}
    raise HTTPException(status_code=404, detail="Alert not found")

# Blockchain Activity Endpoints
@app.get("/blockchain/activity")
async def get_blockchain_activity():
    return {"activities": blockchain_activity}

# Dashboard Stats
@app.get("/dashboard/stats")
async def get_dashboard_stats():
    total_items = len(inventory_db)
    low_stock_alerts = len([item for item in inventory_db if item["status"] in ["low", "critical"]])
    total_value = sum(item["stock"] * item["price"] for item in inventory_db)
    
    return {
        "total_items": total_items,
        "low_stock_alerts": low_stock_alerts,
        "total_value": round(total_value, 2),
        "active_alerts": len(alerts_db)
    }

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.send_personal_message(f"Message received: {data}", websocket)
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(generate_fake_sensor_data())

async def generate_fake_sensor_data():
    while True:
        batch_ids = ["BATCH001", "BATCH002", "BATCH003"]
        for batch_id in batch_ids:
            base_temp = 5.0
            variation = random.uniform(-2, 2)
            temperature = base_temp + variation
            humidity = random.uniform(40, 60)
            
            sensor_data = SensorData(
                batchID=batch_id,
                temperature=round(temperature, 2),
                humidity=round(humidity, 2)
            )
            
            coldchain_db.append(sensor_data.dict())
            
            await manager.broadcast(json.dumps({
                "type": "sensor_data",
                "data": sensor_data.dict()
            }))
        
        await asyncio.sleep(5)

# New Pydantic models for AI features
class DrugVerificationRequest(BaseModel):
    image_data: str  # Base64 encoded image
    expected_drug_name: Optional[str] = None
    expected_dosage: Optional[str] = None

class DrugVerificationResponse(BaseModel):
    verified: bool
    confidence_score: float
    detected_drug_name: str
    detected_dosage: str
    label_quality: str
    color_match: str
    shape_match: str
    recommendations: List[str]

class AnomalyDetectionRequest(BaseModel):
    batch_id: str
    temperature: float
    humidity: float
    timestamp: str

class AnomalyDetectionResponse(BaseModel):
    is_anomaly: bool
    risk_level: str  # LOW, MEDIUM, HIGH, CRITICAL
    confidence: float
    factors: List[str]
    recommendations: List[str]

class PatientAdherenceRequest(BaseModel):
    patient_id: str
    medication_name: str
    dosage: str
    intake_time: str
    method: str  # manual, barcode, voice

class PatientAdherenceResponse(BaseModel):
    adherence_score: float
    missed_doses: int
    trend: str  # improving, declining, stable
    next_dose_reminder: str
    risk_factors: List[str]

# AI-Powered Drug Verification
@app.post("/ai/drug-verification", response_model=DrugVerificationResponse)
async def verify_drug_image(request: DrugVerificationRequest):
    try:
        # Decode base64 image
        image_data = base64.b64decode(request.image_data.split(',')[1] if ',' in request.image_data else request.image_data)
        image = Image.open(io.BytesIO(image_data))
        
        # Simulate AI drug verification (replace with actual ML model)
        # In production, this would use computer vision and OCR
        verification_result = {
            "verified": random.choice([True, True, True, False]),  # 75% success rate
            "confidence_score": round(random.uniform(0.7, 0.98), 2),
            "detected_drug_name": "Amoxicillin 500mg" if random.random() > 0.5 else "Ibuprofen 200mg",
            "detected_dosage": "500mg" if random.random() > 0.5 else "200mg",
            "label_quality": random.choice(["Excellent", "Good", "Fair"]),
            "color_match": random.choice(["Perfect", "Good", "Acceptable"]),
            "shape_match": random.choice(["Exact", "Close", "Similar"]),
            "recommendations": [
                "Label is clearly visible and matches expected medication",
                "Dosage information is accurate",
                "Expiry date is within acceptable range"
            ]
        }
        
        return DrugVerificationResponse(**verification_result)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Image processing failed: {str(e)}")

# AI-Powered Anomaly Detection
@app.post("/ai/anomaly-detection", response_model=AnomalyDetectionResponse)
async def detect_anomalies(request: AnomalyDetectionRequest):
    try:
        # Simulate AI anomaly detection (replace with actual ML model)
        temp_anomaly = abs(request.temperature - 5.0) > 3.0
        humidity_anomaly = abs(request.humidity - 50.0) > 20.0
        
        is_anomaly = temp_anomaly or humidity_anomaly
        
        if is_anomaly:
            risk_level = "CRITICAL" if (temp_anomaly and humidity_anomaly) else "HIGH"
            factors = []
            if temp_anomaly:
                factors.append("Temperature deviation from safe range (2-8°C)")
            if humidity_anomaly:
                factors.append("Humidity outside acceptable limits (30-70%)")
            
            recommendations = [
                "Immediately check refrigeration system",
                "Move batch to backup cold storage if available",
                "Contact maintenance team for urgent repair"
            ]
        else:
            risk_level = "LOW"
            factors = ["All parameters within normal range"]
            recommendations = ["Continue monitoring", "Maintain current settings"]
        
        return AnomalyDetectionResponse(
            is_anomaly=is_anomaly,
            risk_level=risk_level,
            confidence=round(random.uniform(0.8, 0.95), 2),
            factors=factors,
            recommendations=recommendations
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Anomaly detection failed: {str(e)}")

# AI-Powered Patient Adherence Tracking
@app.post("/ai/patient-adherence", response_model=PatientAdherenceResponse)
async def track_patient_adherence(request: PatientAdherenceRequest):
    try:
        # Simulate AI adherence analysis (replace with actual ML model)
        base_adherence = random.uniform(0.6, 0.95)
        missed_doses = random.randint(0, 5)
        
        if base_adherence > 0.8:
            trend = "improving"
        elif base_adherence < 0.7:
            trend = "declining"
        else:
            trend = "stable"
        
        # Calculate next dose reminder
        next_dose = datetime.now() + timedelta(hours=random.randint(4, 12))
        
        risk_factors = []
        if base_adherence < 0.8:
            risk_factors.append("Multiple missed doses detected")
        if request.method == "manual":
            risk_factors.append("Manual entry may have errors")
        
        return PatientAdherenceResponse(
            adherence_score=round(base_adherence, 2),
            missed_doses=missed_doses,
            trend=trend,
            next_dose_reminder=next_dose.strftime("%Y-%m-%d %H:%M"),
            risk_factors=risk_factors
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Adherence tracking failed: {str(e)}")

# Get patient adherence history
@app.get("/ai/patient-adherence/{patient_id}")
async def get_patient_adherence_history(patient_id: str):
    # Simulate patient adherence history
    history = []
    for i in range(30):
        date = datetime.now() - timedelta(days=i)
        adherence = random.uniform(0.7, 0.95)
        history.append({
            "date": date.strftime("%Y-%m-%d"),
            "adherence_score": round(adherence, 2),
            "medications_taken": random.randint(1, 3),
            "total_medications": 3
        })
    
    return {
        "patient_id": patient_id,
        "history": history,
        "overall_adherence": round(sum(h["adherence_score"] for h in history) / len(history), 2)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

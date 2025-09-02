from fastapi import FastAPI, HTTPException, Header, File, UploadFile, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import sqlite3
import uvicorn
import os
import json
import asyncio
import random
from datetime import datetime

app = FastAPI(title="MedCare Hospital Management API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize SQLite database without SQLAlchemy
@app.on_event("startup")
async def startup_event():
    # Create database if it doesn't exist
    if not os.path.exists("medcare.db"):
        print("Creating database...")
        conn = sqlite3.connect("medcare.db")
        cursor = conn.cursor()
        
        # Create users table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                role TEXT NOT NULL DEFAULT 'patient',
                is_active BOOLEAN DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Create documents table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS documents (
                id TEXT PRIMARY KEY,
                filename TEXT NOT NULL,
                file_path TEXT NOT NULL,
                owner_id TEXT NOT NULL,
                blockchain_hash TEXT,
                uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (owner_id) REFERENCES users (id)
            )
        """)
        
        # Create adherence_logs table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS adherence_logs (
                id TEXT PRIMARY KEY,
                patient_id TEXT NOT NULL,
                medication TEXT NOT NULL,
                taken BOOLEAN NOT NULL,
                scheduled_time TIMESTAMP NOT NULL,
                actual_time TIMESTAMP,
                notes TEXT,
                FOREIGN KEY (patient_id) REFERENCES users (id)
            )
        """)
        
        conn.commit()
        conn.close()
        print("Database created successfully")
    
    # Start background sensor data task
    asyncio.create_task(send_sensor_data())

# Simple routers without SQLAlchemy dependencies

class LoginRequest(BaseModel):
    email: str
    password: str

class SymptomRequest(BaseModel):
    symptoms: List[str]

@app.post("/auth/login")
async def login(request: LoginRequest):
    print(f"Login attempt: email={request.email}, password={request.password}")
    
    # Simple demo login
    demo_users = {
        "admin@medcare.com": {"role": "admin", "password": "admin123"},
        "manager@medcare.com": {"role": "manager", "password": "manager123"},
        "doctor@medcare.com": {"role": "doctor", "password": "doctor123"},
        "patient@medcare.com": {"role": "patient", "password": "patient123"}
    }
    
    user = demo_users.get(request.email)
    print(f"Found user: {user}")
    
    if user and user["password"] == request.password:
        response = {
            "access_token": f"demo_token_{user['role']}",
            "token_type": "bearer",
            "user": {"email": request.email, "role": user["role"]}
        }
        print(f"Login successful: {response}")
        return response
    
    print("Login failed - invalid credentials")
    raise HTTPException(status_code=401, detail=f"Invalid credentials for {request.email}")

@app.get("/auth/me")
async def get_current_user(authorization: str = Header(None)):
    print(f"Auth header received: {authorization}")
    # Extract role from token for proper routing
    if authorization and 'demo_token_' in authorization:
        token_part = authorization.replace('Bearer ', '')
        if 'demo_token_' in token_part:
            role = token_part.split('demo_token_')[1]
            print(f"Extracted role: {role}")
            return {"email": f"{role}@medcare.com", "role": role}
    print("Returning default patient role")
    return {"email": "demo@medcare.com", "role": "patient"}

# Add test endpoint to verify login works
@app.get("/test/users")
async def test_users():
    return {
        "available_users": [
            {"email": "admin@medcare.com", "password": "admin123", "role": "admin"},
            {"email": "manager@medcare.com", "password": "manager123", "role": "manager"},
            {"email": "doctor@medcare.com", "password": "doctor123", "role": "doctor"},
            {"email": "patient@medcare.com", "password": "patient123", "role": "patient"}
        ]
    }

@app.post("/ai/symptoms/predict")
async def predict_symptoms(request: SymptomRequest):
    # Map symptoms to diseases
    symptom_diseases = {
        "fever": ["Flu", "COVID-19", "Malaria"],
        "cough": ["Common Cold", "Bronchitis", "COVID-19"],
        "headache": ["Migraine", "Tension Headache", "Flu"],
        "fatigue": ["Flu", "Anemia", "Depression"],
        "nausea": ["Food Poisoning", "Gastritis", "Pregnancy"],
        "vomiting": ["Food Poisoning", "Gastroenteritis", "Migraine"],
        "diarrhea": ["Gastroenteritis", "Food Poisoning", "IBS"],
        "joint pain": ["Arthritis", "Flu", "Lupus"],
        "muscle aches": ["Flu", "Fibromyalgia", "Exercise strain"],
        "shortness of breath": ["Asthma", "COVID-19", "Heart Disease"],
        "chest pain": ["Heart Disease", "Anxiety", "Muscle strain"],
        "abdominal pain": ["Gastritis", "Appendicitis", "IBS"],
        "rash": ["Allergic Reaction", "Eczema", "Viral Infection"],
        "dizziness": ["Low Blood Pressure", "Dehydration", "Inner Ear Problem"],
        "sore throat": ["Strep Throat", "Common Cold", "Viral Infection"]
    }
    
    # Find most likely disease based on symptoms
    disease_scores = {}
    for symptom in request.symptoms:
        if symptom.lower() in symptom_diseases:
            for disease in symptom_diseases[symptom.lower()]:
                disease_scores[disease] = disease_scores.get(disease, 0) + 1
    
    if disease_scores:
        # Get disease with highest score
        predicted_disease = max(disease_scores, key=disease_scores.get)
        confidence = min(0.95, 0.6 + (disease_scores[predicted_disease] * 0.1))
    else:
        predicted_disease = "Unknown Condition"
        confidence = 0.3
    
    return {
        "prediction": predicted_disease,
        "confidence": confidence,
        "recommendations": ["Consult a healthcare professional", "Monitor symptoms", "Rest and stay hydrated"]
    }

@app.post("/ai/skin/predict")
async def predict_skin(file: UploadFile = File(...)):
    # Demo skin analysis
    return {
        "label": "Normal skin condition",
        "confidence": 0.85,
        "message": "Demo analysis - consult a dermatologist for real diagnosis"
    }

@app.post("/ai/disease/predict")
async def predict_disease_risk(request: dict):
    symptoms = request.get("symptoms", "")
    medical_history = request.get("medical_history", "")
    
    # Demo disease risk assessment
    demo_conditions = [
        {"name": "Common Cold", "probability": 0.65},
        {"name": "Seasonal Allergies", "probability": 0.45},
        {"name": "Viral Infection", "probability": 0.35}
    ]
    
    demo_recommendations = [
        "Get adequate rest and stay hydrated",
        "Monitor symptoms for any worsening",
        "Consider over-the-counter symptom relief if appropriate",
        "Consult a healthcare provider if symptoms persist or worsen"
    ]
    
    return {
        "conditions": demo_conditions,
        "recommendations": demo_recommendations,
        "message": "This is a demo assessment. Please consult a healthcare professional for accurate diagnosis."
    }

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except:
                pass

manager = ConnectionManager()

# Generate mock sensor data
def generate_sensor_data(batch_id: str):
    base_temps = {"BATCH001": 4.2, "BATCH002": 5.8, "BATCH003": 15.5}  # BATCH003 critically high
    base_humidity = {"BATCH001": 48, "BATCH002": 55, "BATCH003": 88}
    
    # Smaller variations for BATCH001/002, larger for BATCH003
    if batch_id == "BATCH003":
        temp_variation = random.uniform(-2.0, 3.0)  # More volatile
        humidity_variation = random.uniform(-15, 12)
    else:
        temp_variation = random.uniform(-0.8, 0.8)  # Stable
        humidity_variation = random.uniform(-5, 5)
    
    temperature = base_temps.get(batch_id, 5.0) + temp_variation
    humidity = base_humidity.get(batch_id, 50) + humidity_variation
    
    return {
        "batchID": batch_id,
        "temperature": round(temperature, 1),
        "humidity": round(max(0, min(100, humidity)), 1),
        "timestamp": datetime.now().isoformat(),
        "location": f"Warehouse-{batch_id[-1]}"
    }

# Background task to send sensor data
async def send_sensor_data():
    while True:
        try:
            # Generate one consistent reading per cycle
            for batch_id in ["BATCH001", "BATCH002", "BATCH003"]:
                sensor_data = generate_sensor_data(batch_id)
                message = {
                    "type": "sensor_data",
                    "data": sensor_data
                }
                await manager.broadcast(json.dumps(message))
                print(f"Sent data: {batch_id} - {sensor_data['temperature']}°C")
            await asyncio.sleep(5)  # Send data every 5 seconds
        except Exception as e:
            print(f"Error sending sensor data: {e}")
            await asyncio.sleep(5)

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.get("/coldchain/data/{batch_id}")
async def get_batch_data(batch_id: str):
    # Generate consistent historical data for the batch
    data = []
    for i in range(20):  # Generate 20 historical points
        # Use consistent seed for each batch to avoid random variations
        import random
        random.seed(hash(batch_id + str(i)))
        sensor_data = generate_sensor_data(batch_id)
        data.append(sensor_data)
    
    # Reset random seed
    random.seed()
    return {"data": data}

@app.get("/coldchain/risk")
async def get_risk_analysis(batch_id: str):
    risk_data = {
        "BATCH001": {
            "risk_level": "LOW",
            "analysis": "Temperature and humidity within optimal ranges. Storage conditions are stable.",
            "recommendations": [
                "Continue current monitoring protocols",
                "Maintain temperature between 2-8°C",
                "Regular equipment calibration recommended"
            ],
            "ai_insights": [
                "Predictive model shows 98% probability of maintaining cold chain integrity",
                "No anomalies detected in the last 24 hours",
                "Storage efficiency: Excellent"
            ]
        },
        "BATCH002": {
            "risk_level": "MEDIUM", 
            "analysis": "Slight temperature fluctuations detected. Humidity levels acceptable but monitoring required.",
            "recommendations": [
                "Increase monitoring frequency to every 30 minutes",
                "Check refrigeration unit performance",
                "Consider backup cooling system activation"
            ],
            "ai_insights": [
                "Temperature variance pattern suggests minor equipment drift",
                "85% confidence in maintaining product integrity",
                "Recommend preventive maintenance within 48 hours"
            ]
        },
        "BATCH003": {
            "risk_level": "CRITICAL",
            "analysis": "CRITICAL: Temperature consistently above safe range. Immediate intervention required to prevent product degradation.",
            "recommendations": [
                "🚨 IMMEDIATE ACTION: Transfer to backup storage",
                "🚨 Isolate batch for quality assessment",
                "🚨 Notify quality control team immediately",
                "🚨 Document all temperature excursions"
            ],
            "ai_insights": [
                "🚨 CRITICAL: 95% probability of product degradation",
                "🚨 Temperature has been above 10°C for extended period",
                "🚨 Recommend immediate product quarantine and testing",
                "🚨 Estimated product loss: HIGH RISK"
            ]
        }
    }
    
    return risk_data.get(batch_id, risk_data["BATCH001"])

@app.get("/")
def read_root():
    return {"message": "MedCare API is running"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

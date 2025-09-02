from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect, File, UploadFile, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
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
import hashlib
import base64
import io
from PIL import Image

# Import new modular components
from app.models.base import Base, engine
from app.routers import auth, manager_files, ai_symptoms, ai_skin, adherence, chat
    
    class SymptomPredictor:
        def train_model(self): pass
        def predict(self, symptoms): 
            return {
                "predicted_diseases": [{"disease": "Common Cold", "confidence": 85}],
                "confidence_scores": [85],
                "recommendations": ["Rest and hydration"]
            }
    
    class SkinDiseaseDetector:
        def predict_from_image(self, image_data):
            return {
                "predicted_condition": "Normal Skin",
                "confidence_score": 92,
                "severity": "None",
                "recommendations": ["No action needed"]
            }
    
    symptom_predictor = SymptomPredictor()
    skin_detector = SkinDiseaseDetector()
    
    class MockDatabase:
        async def connect(self): pass
        async def disconnect(self): pass
        async def fetch_one(self, query, values=None): return None
        async def fetch_all(self, query, values=None): return []
        async def execute(self, query, values=None): pass
    
    database = MockDatabase()
# Simple blockchain simulation
def calculate_file_hash(content):
    return hashlib.sha256(content).hexdigest()

class SimpleBlockchain:
    def __init__(self):
        self.files = {}
    
    def add_file_record(self, filename, file_hash, uploaded_by, file_size):
        record = {
            "filename": filename,
            "hash": file_hash,
            "uploaded_by": uploaded_by,
            "size": file_size,
            "timestamp": datetime.now().isoformat()
        }
        self.files[file_hash] = record
        return f"blockchain_hash_{file_hash[:8]}"
    
    def verify_file_integrity(self, file_hash):
        return self.files.get(file_hash)

blockchain_manager = SimpleBlockchain()


# Load ML model at startup
try:
    model = joblib.load('model.pkl')
    label_encoder = joblib.load('label_encoder.pkl')
    print("✅ ML model loaded successfully!")
except Exception as e:
    print(f"⚠️  Warning: Could not load ML model: {e}")
    model = None
    label_encoder = None

app = FastAPI(title="MedCare Hospital Management API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables
Base.metadata.create_all(bind=engine)

# Include routers
app.include_router(auth.router)
app.include_router(manager_files.router)
app.include_router(ai_symptoms.router)
app.include_router(ai_skin.router)
app.include_router(adherence.router)
app.include_router(chat.router)

# Database startup/shutdown events
@app.on_event("startup")
async def startup():
    try:
        await database.connect()
        print("Database connected")
    except:
        print("Database connection failed, running in demo mode")
    
    # Initialize coldchain data with some historical data
    if len(coldchain_db) == 0:
        batch_configs = {
            "BATCH001": {"base_temp": 4.5, "temp_variance": 1.0, "base_humidity": 45},
            "BATCH002": {"base_temp": 3.8, "temp_variance": 0.8, "base_humidity": 47},
            "BATCH003": {"base_temp": 5.2, "temp_variance": 1.5, "base_humidity": 43}
        }
        
        for batch_id, config in batch_configs.items():
            for i in range(20):
                timestamp = datetime.now() - timedelta(minutes=i*5)
                temp = config["base_temp"] + random.uniform(-config["temp_variance"], config["temp_variance"])
                hum = config["base_humidity"] + random.uniform(-5, 5)
                
                initial_data = {
                    "batchID": batch_id,
                    "temperature": round(temp, 1),
                    "humidity": round(max(0, min(100, hum)), 1),
                    "timestamp": timestamp.isoformat()
                }
                coldchain_db.append(initial_data)
        
        print(f"Initialized coldchain_db with {len(coldchain_db)} data points")
    
    # Start sensor data generation
    asyncio.create_task(generate_fake_sensor_data())
    print("Sensor data generation started")
    
    # Initialize ML models
    try:
        symptom_predictor.train_model()
        print("ML models initialized")
    except:
        print("ML models not available, using simulation")

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

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
storage_db = [
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
        "action": "New item added to storage",
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
        print(f"WebSocket connected. Total connections: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        print(f"WebSocket disconnected. Total connections: {len(self.active_connections)}")

    async def broadcast(self, message: str):
        if self.active_connections:
            disconnected = []
            for connection in self.active_connections:
                try:
                    await connection.send_text(message)
                except:
                    disconnected.append(connection)
            
            # Remove disconnected connections
            for conn in disconnected:
                self.disconnect(conn)
    
    async def send_personal_message(self, message: str, websocket: WebSocket):
        try:
            await websocket.send_text(message)
        except:
            self.disconnect(websocket)

manager = ConnectionManager()

# Authentication Endpoints
@app.post("/auth/register", response_model=Token)
async def register_user(user_data: UserCreate):
    # Check if user already exists
    query = "SELECT id FROM users WHERE email = :email"
    existing_user = await database.fetch_one(query, {"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash password
    hashed_password = get_password_hash(user_data.password)
    
    # Insert new user
    query = """
        INSERT INTO users (email, full_name, role, hashed_password, employee_id, patient_id)
        VALUES (:email, :full_name, :role, :hashed_password, :employee_id, :patient_id)
    """
    values = {
        "email": user_data.email,
        "full_name": user_data.full_name,
        "role": user_data.role,
        "hashed_password": hashed_password,
        "employee_id": user_data.employee_id,
        "patient_id": user_data.patient_id
    }
    
    await database.execute(query, values)
    
    # Create access token
    access_token = create_access_token(data={"sub": user_data.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/auth/login", response_model=Token)
async def login_user(form_data: UserLogin):
    user = await authenticate_user(form_data.email, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user["email"]})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/auth/me", response_model=dict)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

# User management endpoints
@app.get("/users/patients")
async def get_patients(current_user: User = Depends(get_doctor_or_manager)):
    """Get all patients for doctors and managers"""
    query = "SELECT id, email, full_name, patient_id FROM users WHERE role = 'patient'"
    patients = await database.fetch_all(query)
    return {"patients": [dict(patient) for patient in patients]}

@app.get("/users/doctors")
async def get_doctors(current_user: User = Depends(get_current_user)):
    """Get all doctors for patients and managers"""
    query = "SELECT id, email, full_name, employee_id FROM users WHERE role = 'doctor'"
    doctors = await database.fetch_all(query)
    return {"doctors": [dict(doctor) for doctor in doctors]}


# File Management Endpoints (Manager Only)
@app.post("/files/upload", response_model=FileUploadResponse)
async def upload_file(
    file: UploadFile = File(...),
    current_user: User = Depends(get_manager),
    db: Session = Depends(get_db)
):
    # Read file content
    file_content = await file.read()
    file_hash = calculate_file_hash(file_content)
    
    # Add to blockchain
    blockchain_hash = blockchain_manager.add_file_record(
        filename=file.filename,
        file_hash=file_hash,
        uploaded_by=current_user.username,
        file_size=len(file_content)
    )
    
    # Save to database
    db_file = FileRecord(
        filename=file.filename,
        file_hash=file_hash,
        blockchain_hash=blockchain_hash,
        uploaded_by=current_user.id,
        file_type=file.content_type,
        file_size=len(file_content)
    )
    
    db.add(db_file)
    db.commit()
    db.refresh(db_file)
    
    return FileUploadResponse(
        file_id=db_file.id,
        filename=db_file.filename,
        file_hash=db_file.file_hash,
        blockchain_hash=db_file.blockchain_hash,
        upload_timestamp=db_file.upload_timestamp
    )

@app.get("/files/verify/{file_hash}")
async def verify_file_integrity(
    file_hash: str,
    current_user: User = Depends(get_doctor_or_manager)
):
    result = blockchain_manager.verify_file_integrity(file_hash)
    if result:
        return {"verified": True, "details": result}
    else:
        return {"verified": False, "message": "File not found in blockchain"}

@app.get("/files/history/{filename}")
async def get_file_history(
    filename: str,
    current_user: User = Depends(get_doctor_or_manager)
):
    history = blockchain_manager.get_file_history(filename)
    return {"filename": filename, "history": history}

# Chat Endpoints
@app.post("/chat/send", response_model=ChatMessageResponse)
async def send_message(
    message: ChatMessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verify receiver exists
    receiver = db.query(User).filter(User.id == message.receiver_id).first()
    if not receiver:
        raise HTTPException(status_code=404, detail="Receiver not found")
    
    # Create message
    db_message = ChatMessage(
        sender_id=current_user.id,
        receiver_id=message.receiver_id,
        message=message.message
    )
    
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    
    return ChatMessageResponse(
        id=db_message.id,
        sender_id=db_message.sender_id,
        receiver_id=db_message.receiver_id,
        message=db_message.message,
        timestamp=db_message.timestamp,
        is_read=db_message.is_read,
        sender_name=current_user.full_name,
        receiver_name=receiver.full_name
    )

@app.get("/chat/conversations")
async def get_conversations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Get all users this user has chatted with
    conversations = db.query(ChatMessage).filter(
        (ChatMessage.sender_id == current_user.id) | 
        (ChatMessage.receiver_id == current_user.id)
    ).all()
    
    # Group by conversation partner
    partners = {}
    for msg in conversations:
        partner_id = msg.receiver_id if msg.sender_id == current_user.id else msg.sender_id
        if partner_id not in partners:
            partner = db.query(User).filter(User.id == partner_id).first()
            partners[partner_id] = {
                "user_id": partner_id,
                "name": partner.full_name,
                "role": partner.role,
                "last_message": msg.message,
                "last_timestamp": msg.timestamp,
                "unread_count": 0
            }
        
        # Update last message if more recent
        if msg.timestamp > partners[partner_id]["last_timestamp"]:
            partners[partner_id]["last_message"] = msg.message
            partners[partner_id]["last_timestamp"] = msg.timestamp
        
        # Count unread messages
        if msg.receiver_id == current_user.id and not msg.is_read:
            partners[partner_id]["unread_count"] += 1
    
    return {"conversations": list(partners.values())}

@app.get("/chat/messages/{partner_id}")
async def get_chat_messages(
    partner_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    messages = db.query(ChatMessage).filter(
        ((ChatMessage.sender_id == current_user.id) & (ChatMessage.receiver_id == partner_id)) |
        ((ChatMessage.sender_id == partner_id) & (ChatMessage.receiver_id == current_user.id))
    ).order_by(ChatMessage.timestamp).all()
    
    # Mark messages as read
    db.query(ChatMessage).filter(
        (ChatMessage.sender_id == partner_id) & 
        (ChatMessage.receiver_id == current_user.id) &
        (ChatMessage.is_read == False)
    ).update({"is_read": True})
    db.commit()
    
    # Get partner info
    partner = db.query(User).filter(User.id == partner_id).first()
    
    message_list = []
    for msg in messages:
        sender = db.query(User).filter(User.id == msg.sender_id).first()
        message_list.append({
            "id": msg.id,
            "sender_id": msg.sender_id,
            "sender_name": sender.full_name,
            "message": msg.message,
            "timestamp": msg.timestamp,
            "is_own_message": msg.sender_id == current_user.id
        })
    
    return {
        "partner": {"id": partner.id, "name": partner.full_name, "role": partner.role},
        "messages": message_list
    }

# Disease Prediction Endpoints
@app.post("/predict/symptoms", response_model=SymptomPredictionResponse)
async def predict_disease_from_symptoms(
    request: SymptomPredictionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        result = symptom_predictor.predict(request.symptoms)
        
        # Save prediction to database
        if current_user.role == "patient":
            db_prediction = DiseaseSymptom(
                patient_id=current_user.id,
                symptoms=json.dumps(request.symptoms),
                predicted_disease=result["predicted_diseases"][0]["disease"],
                confidence_score=result["predicted_diseases"][0]["confidence"] / 100
            )
            db.add(db_prediction)
            db.commit()
        
        return SymptomPredictionResponse(
            predicted_diseases=result["predicted_diseases"],
            confidence_scores=result["confidence_scores"],
            recommendations=result["recommendations"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.post("/predict/skin", response_model=SkinDiseaseResponse)
async def predict_skin_disease(
    request: SkinDiseaseRequest,
    current_user: User = Depends(get_current_user)
):
    try:
        result = skin_detector.predict_from_image(request.image_data)
        
        return SkinDiseaseResponse(
            predicted_condition=result["predicted_condition"],
            confidence_score=result["confidence_score"],
            severity=result["severity"],
            recommendations=result["recommendations"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Skin prediction failed: {str(e)}")

# Prescription Management
@app.post("/prescriptions", response_model=PrescriptionResponse)
async def create_prescription(
    prescription: PrescriptionCreate,
    current_user: User = Depends(get_doctor),
    db: Session = Depends(get_db)
):
    # Verify patient exists
    patient = db.query(User).filter(User.id == prescription.patient_id, User.role == "patient").first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    db_prescription = Prescription(
        patient_id=prescription.patient_id,
        doctor_id=current_user.id,
        medication_name=prescription.medication_name,
        dosage=prescription.dosage,
        frequency=prescription.frequency,
        duration=prescription.duration,
        instructions=prescription.instructions
    )
    
    db.add(db_prescription)
    db.commit()
    db.refresh(db_prescription)
    
    return PrescriptionResponse(
        id=db_prescription.id,
        patient_id=db_prescription.patient_id,
        doctor_id=db_prescription.doctor_id,
        medication_name=db_prescription.medication_name,
        dosage=db_prescription.dosage,
        frequency=db_prescription.frequency,
        duration=db_prescription.duration,
        instructions=db_prescription.instructions,
        created_at=db_prescription.created_at,
        doctor_name=current_user.full_name,
        patient_name=patient.full_name
    )

@app.get("/prescriptions/patient/{patient_id}")
async def get_patient_prescriptions(
    patient_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Patients can only see their own prescriptions
    if current_user.role == "patient" and current_user.id != patient_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    prescriptions = db.query(Prescription).filter(Prescription.patient_id == patient_id).all()
    
    result = []
    for p in prescriptions:
        doctor = db.query(User).filter(User.id == p.doctor_id).first()
        patient = db.query(User).filter(User.id == p.patient_id).first()
        
        result.append(PrescriptionResponse(
            id=p.id,
            patient_id=p.patient_id,
            doctor_id=p.doctor_id,
            medication_name=p.medication_name,
            dosage=p.dosage,
            frequency=p.frequency,
            duration=p.duration,
            instructions=p.instructions,
            created_at=p.created_at,
            doctor_name=doctor.full_name,
            patient_name=patient.full_name
        ))
    
    return {"prescriptions": result}

@app.get("/users/doctors")
async def get_doctors(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    doctors = db.query(User).filter(User.role == "doctor").all()
    return {
        "doctors": [
            {
                "id": doc.id,
                "name": doc.full_name,
                "employee_id": doc.employee_id,
                "email": doc.email
            }
            for doc in doctors
        ]
    }

@app.get("/users/patients")
async def get_patients(
    current_user: User = Depends(get_doctor_or_manager),
    db: Session = Depends(get_db)
):
    patients = db.query(User).filter(User.role == "patient").all()
    return {
        "patients": [
            {
                "id": patient.id,
                "name": patient.full_name,
                "patient_id": patient.patient_id,
                "email": patient.email
            }
            for patient in patients
        ]
    }

@app.post("/trials")
async def create_batch(
    batch: DrugBatch, 
    current_user: User = Depends(get_doctor_or_manager)
):
    batch.batchID = str(uuid.uuid4())[:8].upper()
    batch.timestamp = datetime.now().isoformat()
    trials_db.append(batch.dict())
    return {"message": "Batch created successfully", "batch": batch.dict()}

@app.get("/trials")
async def get_all_batches():
    """Get all batches - no auth required for demo"""
    return {"batches": trials_db}

@app.put("/trials/{batch_id}/approve")
async def approve_batch(
    batch_id: str, 
    regulator: str = "Regulator_001",
    current_user: User = Depends(get_manager)
):
    for batch in trials_db:
        if batch["batchID"] == batch_id:
            batch["status"] = "approved"
            batch["approved_by"] = regulator
            batch["approval_timestamp"] = datetime.now().isoformat()
            return {"message": f"Batch {batch_id} approved by {regulator}"}
    raise HTTPException(status_code=404, detail="Batch not found")

@app.post("/coldchain")
async def submit_sensor_data(data: SensorData):
    """Submit sensor data - no auth required for demo"""
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
    """Get sensor data for a specific batch - no auth required for demo"""
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
@app.get("/storage")
async def get_storage(current_user: User = Depends(get_doctor_or_manager)):
    return {"items": storage_db}

@app.get("/storage/{item_id}")
async def get_storage_item(
    item_id: int,
    current_user: User = Depends(get_doctor_or_manager)
):
    for item in storage_db:
        if item["id"] == item_id:
            return item
    raise HTTPException(status_code=404, detail="Item not found")

@app.post("/storage")
async def add_storage_item(
    item: dict,
    current_user: User = Depends(get_manager)
):
    item["id"] = len(storage_db) + 1
    storage_db.append(item)
    return {"message": "Item added successfully", "item": item}

# Alerts Endpoints
@app.get("/alerts")
async def get_alerts(current_user: User = Depends(get_current_user)):
    return {"alerts": alerts_db}

@app.put("/alerts/{alert_id}/resolve")
async def resolve_alert(
    alert_id: int,
    current_user: User = Depends(get_doctor_or_manager)
):
    for alert in alerts_db:
        if alert["id"] == alert_id:
            alert["resolved"] = True
            alert["resolved_at"] = datetime.now().isoformat()
            return {"message": f"Alert {alert_id} resolved"}
    raise HTTPException(status_code=404, detail="Alert not found")

# Blockchain Activity Endpoints
@app.get("/blockchain/activity")
async def get_blockchain_activity(current_user: User = Depends(get_doctor_or_manager)):
    return {"activities": blockchain_activity}

# Dashboard Stats (Role-based)
@app.get("/dashboard/stats")
async def get_dashboard_stats():
    """Get dashboard stats - simplified for demo"""
    total_items = len(storage_db)
    low_stock_alerts = len([item for item in storage_db if item["status"] in ["low", "critical"]])
    total_value = sum(item["stock"] * item["price"] for item in storage_db)
    
    # Return general stats for demo
    return {
        "total_items": total_items,
        "low_stock_alerts": low_stock_alerts,
        "total_value": round(total_value, 2),
        "active_alerts": len(alerts_db),
        "total_batches": len(trials_db),
        "pending_approvals": len([b for b in trials_db if b["status"] == "pending"]),
        "total_patients": 15,
        "active_prescriptions": 8,
        "unread_messages": 3,
        "pending_consultations": 5,
        "upcoming_appointments": 2,
        "health_score": 85
    }

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    manager.active_connections.append(websocket)
    print(f"WebSocket connected. Total connections: {len(manager.active_connections)}")
    
    try:
        while True:
            # Keep connection alive - just wait for messages
            await websocket.receive_text()
    except WebSocketDisconnect:
        if websocket in manager.active_connections:
            manager.active_connections.remove(websocket)
        print(f"WebSocket disconnected. Total connections: {len(manager.active_connections)}")
    except Exception as e:
        print(f"WebSocket error: {e}")
        if websocket in manager.active_connections:
            manager.active_connections.remove(websocket)


async def generate_fake_sensor_data():
    """Generate realistic sensor data with occasional anomalies"""
    print("Starting sensor data generation...")
    
    batch_configs = {
        "BATCH001": {"base_temp": 4.5, "temp_variance": 1.0, "base_humidity": 45},
        "BATCH002": {"base_temp": 3.8, "temp_variance": 0.8, "base_humidity": 47},
        "BATCH003": {"base_temp": 5.2, "temp_variance": 1.5, "base_humidity": 43}
    }
    
    while True:
        try:
            for batch_id, config in batch_configs.items():
                # Generate realistic temperature with occasional spikes
                if random.random() < 0.05:  # 5% chance of anomaly
                    temperature = config["base_temp"] + random.uniform(-5, 8)  # Anomaly
                else:
                    temperature = config["base_temp"] + random.uniform(-config["temp_variance"], config["temp_variance"])
                
                # Generate humidity with correlation to temperature anomalies
                if abs(temperature - config["base_temp"]) > 3:
                    humidity = config["base_humidity"] + random.uniform(-15, 25)  # Correlated anomaly
                else:
                    humidity = config["base_humidity"] + random.uniform(-5, 5)
                
                sensor_data = SensorData(
                    batchID=batch_id,
                    temperature=round(temperature, 1),
                    humidity=round(max(0, min(100, humidity)), 1),
                    timestamp=datetime.now().isoformat()
                )
                
                # Add to database
                coldchain_db.append(sensor_data.dict())
                
                # Broadcast to connected clients
                if manager.active_connections:
                    await manager.broadcast(json.dumps({
                        "type": "sensor_data",
                        "data": sensor_data.dict()
                    }))
                    print(f"Broadcasted data for {batch_id}: {temperature:.1f}°C, {humidity:.1f}%")
            
            # Keep last 100 readings per batch  
            if len(coldchain_db) > 300:
                coldchain_db = coldchain_db[-300:]
            
            await asyncio.sleep(3)  # Update every 3 seconds
        except Exception as e:
            print(f"Error in sensor data generation: {e}")
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

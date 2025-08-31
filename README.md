# 🏥 MedCare - Blockchain & AI Powered Healthcare Management System

A comprehensive platform for clinical trial drug supply tracking and vaccine cold-chain monitoring, combining **Blockchain**, **AI/ML**, and **IoT** for next-generation healthcare reliability.

---

## 👨‍💻 Development Team
- **Shivam Bhardwaj** - 25BAI1526  
- **Krrish Rajput** - 25BAIxxxx  

---

## 🌟 Features

### 🏠 Landing Page
- Modern, responsive UI with professional healthcare branding
- Light/Dark mode toggle
- Dynamic animations with smooth transitions
- Call-to-action sections with statistics and demo highlights

### 🔐 Authentication
- Dummy login system (demo-ready)
- Default credentials: `admin` / `admin123`

### 📊 Dashboard Overview
- Drug batches tracked via blockchain
- Cold-chain monitoring with live IoT data
- Alerts & notifications for risk/expiry
- Quick access to analytics and reports

### 🧪 Clinical Trial Supply
- Log new drug batches with sender/receiver info
- Regulator approval workflow
- Blockchain-backed ledger for immutability
- Complete audit trail for compliance

### 🌡️ Cold-Chain Monitoring
- Real-time temperature & humidity graph
- AI-powered **Safe vs. Spoiled** classification
- Confidence scores from ML model
- Individual batch-level tracking
- WebSocket-based live updates

### 🔔 Alerts System
- Expiry warnings
- Cold-chain anomaly detection
- Blockchain transaction alerts
- Real-time notifications

### ⛓️ Blockchain Activity
- Transaction history with timestamps
- Batch approval logs
- Regulator vs. supplier role enforcement
- Hash-based verification

### 📈 Analytics & Reports
- Usage patterns
- Risk prediction stats
- Inventory & trial reports

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- Python 3.8+
- PostgreSQL
- npm / yarn

### Installation

1. **Clone Repository**
```bash
git clone <repository-url>
cd MedCare
```

2. **Backend Setup**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. **Frontend Setup**
```bash
cd frontend
npm install
```

4. **Run Application**
```bash
# Backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Frontend
npm start
```

5. **Access**
- Frontend → http://localhost:3000  
- Backend API → http://localhost:8000  
- API Docs → http://localhost:8000/docs  

---

## 📡 API Endpoints

### 🧪 Clinical Trials

- `GET /trials` → Get all batches  
- `POST /trials` → Add new batch  
- `PUT /trials/{batch_id}/approve` → Approve batch  
- `GET /trials/{batch_id}` → Get batch details  

### 🌡️ Cold-Chain Monitoring

- `POST /coldchain/data` → Add sensor data  
- `GET /coldchain/data/{batch_id}` → Get sensor readings  
- `GET /coldchain/risk?batch_id={id}` → Risk assessment  
- `POST /coldchain/predict` → ML model prediction  
- `GET /coldchain/test` → Validate ML model  

### 🔔 Alerts
- `GET /alerts` → Active alerts  
- `POST /alerts` → Create alert  
- `PUT /alerts/{id}/resolve` → Resolve alert  

### ⛓️ Blockchain
- `GET /blockchain/activity` → All blockchain transactions  
- `GET /blockchain/transaction/{hash}` → Transaction details  

---

## 🤖 Machine Learning Model

- **Task**: Binary classification (Safe vs Spoiled)  
- **Features**: Temperature (°C), Humidity (%)  
- **Training Data**: `batch_data.csv`  
- **Model Files**: `model.pkl`, `scaler.pkl`  
- **API Routes**:
  - `POST /coldchain/predict` → Predict Safe/Spoiled with confidence  
  - `GET /coldchain/test` → Model test endpoint  

Training Script:
```bash
cd backend
python3 train_model.py
```

Model Accuracy: ~78% training, ~65% testing  

---

## 🎨 Tech Stack

### Frontend
- React + TailwindCSS  
- Recharts (data visualization)  
- Framer Motion (animations)  

### Backend
- FastAPI (Python)  
- PostgreSQL  
- scikit-learn (ML)  
- WebSockets (live updates)  
- Thirdweb (Blockchain integration)  

### IoT & AI
- Ubidots (simulated IoT data)  
- Hugging Face AutoTrain (risk model API)  

---

## 🚀 Deployment

### Env Variables
```bash
DATABASE_URL=postgresql://user:password@localhost/medcare
SECRET_KEY=super-secret-key
REACT_APP_API_URL=http://localhost:8000
```

### Build Frontend
```bash
cd frontend
npm run build
```

### Run Backend in Production
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

---

## 📝 License
MIT License

---

**MedCare** – Secure Clinical Trials & Cold-Chain Monitoring with Blockchain + AI 🚀

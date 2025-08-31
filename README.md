# 🏥 MedCare – AI + Blockchain Powered Healthcare Platform  

A next-generation healthcare management system unifying **blockchain, AI, and IoT** to ensure trust, safety, and efficiency in medical supply chains.  

MedCare offers **secure clinical trial tracking, real-time cold-chain monitoring, AI-powered drug verification, and patient adherence tracking**, all accessible via a web dashboard and mobile app.  

---

## 🌟 Core Features  

### 🔐 Authentication & Access Control  
- Role-based access (Admin, Regulator, Healthcare Staff, Patients)  
- Secure login with session management  
- Demo credentials: `admin` / `admin123`  

### 📊 Intelligent Dashboard  
- Inventory overview (items, stock levels, usage, financials)  
- Clinical trials status tracking  
- Cold-chain health monitoring  
- AI analytics & predictions  
- Real-time alerts for risks, stockouts, and expiry  

### 📦 Inventory Management  
- Full CRUD operations for medical items  
- Categories: Antibiotics, Consumables, Diabetes Care, Equipment, Pain Management  
- Price + stock tracking with thresholds (Good, Low, Critical)  
- Expiry management and alerts  

### 🧪 Clinical Trial Supply Tracking  
- Log and monitor drug batches  
- Blockchain-secured shipment approval & regulator verification  
- Immutable audit trails for transparency  
- Role-based approvals  

### 🌡️ Cold-Chain Monitoring  
- Real-time temperature & humidity tracking  
- AI-powered risk predictions for spoilage  
- Anomaly detection with live alerts  
- Batch-specific monitoring with color-coded statuses (Safe / Warning / Critical)  

### 🤖 AI-Powered Innovations  
- **Drug Verification**: Upload or capture medicine images → AI verifies authenticity  
- **Cold-Chain Anomaly Detection**: Detects risky fluctuations before spoilage occurs  
- **Patient Adherence Tracking**: Logs medication intake, predicts adherence trends, and notifies staff of missed doses  
- **Predictive Analytics**: Smart recommendations for inventory & patient management  

### 📱 Mobile App (React Native)  
- Cross-platform (iOS + Android via Expo)  
- Push notifications for alerts and reminders  
- Camera integration for drug verification  
- Offline data caching & auto-sync  
- Patient-friendly interface with adherence tracker  

### 🔔 Alerts & Notifications  
- Stockout, expiry, and anomaly alerts  
- Browser + mobile push notifications  
- Automated escalation for critical cases  

### ⛓️ Blockchain Integration  
- Immutable audit trail for all critical events  
- Batch verification for clinical trials  
- Transaction history with cryptographic verification  

### 📈 Reports & Analytics  
- Usage trends, monthly costs, and waste reduction  
- AI model performance & accuracy reports  
- Patient adherence statistics  
- Exportable reports for regulators  

---

## 🖥️ Technology Stack  

### Frontend  
- React 18, Tailwind CSS, Chakra UI, Framer Motion  
- Recharts (data visualization), WebSockets (real-time updates)  

### Mobile  
- React Native (Expo)  
- React Native Paper, Notifications, Camera API  
- Offline-first data sync  

### Backend  
- FastAPI + Uvicorn (Python)  
- PostgreSQL database  
- WebSocket real-time communication  
- scikit-learn, Pandas, NumPy (ML models)  
- OpenCV, Pillow (drug image verification)  

### AI Models  
- Logistic Regression for cold-chain risk prediction  
- Computer vision models (drug recognition)  
- Predictive analytics for patient adherence  

### Blockchain  
- Thirdweb / EVM-compatible chain  
- Transaction history & verification  

---

## 🚀 Quick Start  

### Prerequisites  
- Node.js (v14+)  
- Python 3.8+  
- npm or yarn  
- Expo CLI (for mobile)  

### Installation  

```bash
git clone <repository-url>
cd MedCare
```
### Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
python3 train_model.py
uvicorn main:app --reload --port 8000
```
### Frontend
```bash
cd frontend
npm install
npm start
```
### Mobile
```
cd mobile
npm install
npx expo start
```
## Access

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs
- Mobile App: Scan QR via Expo Go

## 📡 Key API Endpoints

- POST /auth/login – Authenticate user
- GET /inventory/items – Fetch all items
- POST /trials – Add new clinical trial batch
- PUT /trials/{batch_id}/approve – Approve batch (regulator)
- POST /coldchain/predict – AI risk prediction
- POST /ai/drug-verification – Upload image for drug verification
- POST /ai/patient-adherence – Track patient intake
- GET /alerts – Fetch all active alerts

## 📱 Screenshots

- Dashboard Overview

- Cold-chain monitoring graph

- AI drug verification result

- Mobile adherence tracker

## 📞 Support
- Create an issue in repo
- Contact dev team
- API docs available at /docs

## 📝 License

- MIT License

---

⚡ With MedCare, healthcare providers gain a trusted, intelligent, and transparent ecosystem to secure trials, preserve vaccines, fight counterfeit drugs, and improve patient outcomes.


# 🏥 MedCare – AI + Blockchain Powered Healthcare Platform  

MedCare is a **production-ready healthcare system** that unifies **blockchain, AI, IoT, and real-time dashboards** to bring **trust, safety, and efficiency** into medical supply chains, clinical trials, and patient care.  

This platform ensures **secure tracking, smart predictions, and transparency** — solving challenges like **drug counterfeiting, cold-chain spoilage, and patient non-adherence**.  

---

## 🌟 Features Overview  

### 1. Authentication & Roles  
- Role-based login (Admin, Regulator, Staff, Patient)  
- JWT token-based authentication  
- Session handling with FastAPI security middleware  

### 2. Inventory Management  
- CRUD operations for items  
- Auto-classification of stock levels (Good, Low, Critical)  
- Expiry detection and alerts  
- Batch-tracking integrated with blockchain  

### 3. Clinical Trial Drug Supply  
- Create and approve batches  
- Blockchain-backed approval workflow  
- Immutable logs of regulators and stakeholders  

### 4. Cold-Chain Monitoring  
- IoT-like simulated sensors (temperature + humidity)  
- AI/ML model predicts spoilage risk (Safe, Warning, Critical)  
- Alerts when anomalies detected  

### 5. AI-Powered Enhancements  
- **Drug Verification (CV model)** → Upload image, system verifies authenticity  
- **Cold-chain anomaly detection** → Logistic regression + thresholds  
- **Patient Adherence Tracking** → Logs intake, predicts risk of non-adherence  
- **Predictive Analytics** → Suggests inventory restocking, patient risk prediction  

### 6. Mobile App  
- React Native (Expo) app for patients + staff  
- Push notifications for stockouts, spoilage, reminders  
- Camera integration for **drug verification**  
- Offline support with sync  

### 7. Blockchain Integration  
- Thirdweb smart contracts deployed on testnet  
- Approval transactions recorded on-chain  
- Verifiable transaction hash for audits  

---

## 🖥️ System Architecture  

```
Frontend (React + Tailwind + Recharts)
        |
        v
Backend API (FastAPI + PostgreSQL)
        |
   AI Models (scikit-learn, OpenCV)
        |
   Blockchain (Thirdweb, EVM)
        |
   Mobile App (React Native + Expo)
```

- **Frontend** → Dashboard for staff, regulators, and admins  
- **Backend** → REST APIs + AI inference endpoints  
- **AI Models** → Deployed locally for prediction  
- **Blockchain** → Stores approvals + audit logs  
- **Mobile App** → Patient adherence & drug verification  

---

## 🚀 Quick Start  

### Prerequisites  
- Python 3.9+  
- Node.js 16+  
- PostgreSQL  
- Expo CLI (for mobile)  

### Installation  

```bash
git clone <repo-url>
cd MedCare
```

#### Backend  
```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

#### Frontend  
```bash
cd frontend
npm install
npm run dev
```

#### Mobile  
```bash
cd mobile
npm install
npx expo start
```

---

## 📡 API Endpoints (Detailed)  

### Authentication  
- `POST /auth/login` → Get JWT token  
- `POST /auth/register` → Create new user  

### Inventory  
- `GET /inventory/items` → Fetch items  
- `POST /inventory/items` → Add item  
- `PUT /inventory/items/{id}` → Update item  
- `DELETE /inventory/items/{id}` → Remove item  

### Clinical Trials  
- `POST /trials` → Create batch  
- `PUT /trials/{id}/approve` → Approve batch (regulator)  
- `GET /trials/{id}` → Fetch batch details  

### Cold Chain  
- `POST /coldchain/record` → Add temp+humidity log  
- `POST /coldchain/predict` → Run AI risk prediction  
- `GET /coldchain/batch/{id}` → Batch status  

### AI Features  
- `POST /ai/drug-verification` → Upload drug image, get authenticity result  
- `POST /ai/patient-adherence` → Log intake event  
- `GET /ai/patient-adherence/{id}` → Get adherence trend  

### Alerts  
- `GET /alerts` → Fetch all alerts  
- `POST /alerts/test` → Trigger test alert  

---

## 📈 AI Models  

- **Cold Chain Risk Prediction**  
  - Logistic Regression on temperature + humidity  
  - Labels: `Safe`, `Warning`, `Critical`  

- **Drug Verification**  
  - OpenCV feature matching + pretrained CNN model  
  - Detects counterfeit or mismatched packaging  

- **Patient Adherence**  
  - Uses intake logs + ML prediction  
  - Forecasts risk of non-adherence (high/medium/low)  

---

## 📊 Reports & Analytics  

- Stock usage trends  
- Monthly spending & wastage report  
- AI model accuracy (confusion matrix)  
- Patient adherence heatmap  
- Cold-chain anomaly detection graphs  

---

## 📝 Hackathon Pitch Value  

- 🚑 Solves **real-world healthcare issues** (counterfeits, spoilage, non-adherence)  
- 🔗 **Blockchain-powered trust** → regulators + providers can audit securely  
- 🤖 **AI-powered intelligence** → predictions, verification, and insights  
- 📱 **Mobile-first** → patient engagement and safety tracking  

---

## 📞 Support  

- Dev Team: 
- -> Shivam Bhardwaj - 25BAI1526
- -> Krrish Rajput -25BAI 

- Issues: Use GitHub Issues tab  
- API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)  

---

## 📜 License  
MIT License  

---

⚡ With MedCare, healthcare providers gain a trusted, intelligent, and transparent ecosystem to secure trials, preserve vaccines, fight counterfeit drugs, and improve patient outcomes.

# 🏥 MedCare - Healthcare Management System

A comprehensive blockchain-powered healthcare management system with integrated clinical trial supply tracking and cold-chain monitoring capabilities.

## 🌟 Features

### 🏠 Landing Page
- **Modern, responsive design** with dynamic moving background
- **Light/Dark mode toggle** (bottom-right corner)
- **Professional healthcare branding** with MedCare logo
- **Animated elements**: floating particles, gradient orbs, moving lines
- **Call-to-action sections** with testimonials and statistics

### 🔐 Authentication
- **Dummy login system** for demonstration
- **Credentials**: admin / admin123
- **Secure session management**

### 📊 Dashboard Overview
- **Total Items**: 1,389 tracked items
- **Low Stock Alerts**: Real-time notifications
- **Monthly Usage**: $54,320 analytics
- **Value**: $312,450 tracking
- **Clinical Trials Status**: Active trial monitoring
- **Cold Chain Monitoring**: Real-time temperature tracking

### 📦 Management
- **Add/Edit Items**: Complete CRUD operations
- **Stock Tracking**: Real-time levels
- **Category Management**: Antibiotics, Consumables, Diabetes Care, Equipment, Pain Management
- **Status Indicators**: Good, Low, Critical stock levels
- **Price Tracking**: Complete financial management

### 🧪 Clinical Trials Supply
- **Drug Batch Logging**: Complete batch information
- **Blockchain Ledger**: Approved shipments tracking
- **Regulator Approval**: Role-based approval system
- **Batch Status**: Pending, Approved states
- **Audit Trail**: Complete transaction history

### 🌡️ Cold-Chain Monitoring
- **Live Temperature Data**: Real-time graph with dual Y-axis
- **AI Risk Analysis**: Dynamic risk assessment using ML model
- **ML Model Integration**: Logistic Regression classifier for risk prediction
- **Real-time Sensor Feed**: Live data updates every 3 seconds
- **Batch-specific Monitoring**: Individual batch tracking
- **Status Indicators**: SAFE, WARNING, CRITICAL states
- **ML Predictions**: Real-time Safe/Spoiled classification with confidence scores
- **ML Model Training**: Custom model trained on batch data (temperature, humidity)
- **Model Persistence**: Saved as model.pkl and scaler.pkl
- **Prediction API**: POST /coldchain/predict for real-time predictions
- **Model Testing**: GET /coldchain/test for model validation
- **Feature Engineering**: Temperature and humidity-based risk assessment
- **Model Accuracy**: 75% training and testing accuracy

### 🔔 Active Alerts System
- **Low Stock Alerts**: Automated notifications
- **Expiry Warnings**: Proactive expiry management
- **Critical Thresholds**: Emergency notifications
- **Real-time Updates**: Live alert system

### ⛓️ Blockchain Activity
- **Transaction History**: Complete audit trail
- **Block Numbers**: Blockchain integration
- **Hash Tracking**: Cryptographic verification
- **Activity Logging**: All system activities

### 📈 Analytics & Reports
- **Usage Analytics**: Monthly and trend analysis
- **Reports**: Comprehensive reporting
- **Performance Metrics**: System performance tracking

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- Python 3.8+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd MedCare
```

2. **Backend Setup**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Train the ML model
python3 train_model.py
```

3. **Frontend Setup**
```bash
cd frontend
npm install
```

4. **Start the Application**
```bash
# Option 1: Use the start script
chmod +x start.sh
./start.sh

# Option 2: Start manually
# Terminal 1 (Backend)
cd backend
source venv/bin/activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2 (Frontend)
cd frontend
npm start
```

5. **Access the Application**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

---

## 📡 API Routes & Structure
*(Authentication, Inventory, Clinical Trials, Cold-Chain Monitoring, Alerts, Blockchain, etc. — same as you shared but now under MedCare branding)*

---

## 🎨 UI Components
- Responsive landing page
- Animated background with particles/gradients
- Dashboard with live charts and status indicators
- Real-time cold-chain graphs with dual Y-axis
- Framer Motion + Tailwind + React 18 UI stack

---

## 🤖 ML Model Integration
- Logistic Regression classifier (temperature & humidity → Safe/Spoiled)
- Training data: `backend/batch_data.csv`
- Model files: `model.pkl` and `scaler.pkl`
- Endpoints: `/coldchain/predict`, `/coldchain/test`

---

## 🔧 Technical Stack

**Frontend**: React 18, Tailwind CSS, Framer Motion, Recharts, Lucide React  
**Backend**: FastAPI, Uvicorn, Pydantic, WebSocket, scikit-learn, pandas, joblib  
**Dev Tools**: npm, Python venv, Git

---

## 🚀 Deployment

Set environment variables:
```bash
# Backend
DATABASE_URL=postgresql://user:password@localhost/medcare
SECRET_KEY=your-secret-key
DEBUG=True

# Frontend
REACT_APP_API_URL=http://localhost:8000
REACT_APP_WS_URL=ws://localhost:8000/ws
```

Production build:
```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

---

## 📝 License
This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

## 📞 Support
For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the API documentation at `/docs`

---

**MedCare** - Revolutionizing healthcare management with blockchain technology and real-time monitoring. 🏥✨

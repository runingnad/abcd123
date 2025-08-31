# 🏥 MedChain - Next-Generation AI-Powered Healthcare Inventory Management System

A comprehensive blockchain-powered healthcare inventory management system with integrated clinical trial supply tracking, cold-chain monitoring, and cutting-edge AI capabilities. Built through 4 phases of development, evolving from basic inventory management to a sophisticated AI-powered healthcare platform.

## 🚀 **System Evolution - Complete Development Journey**

### **Phase 1: Foundation** 🏗️
- Basic inventory management system
- PostgreSQL database setup
- FastAPI backend foundation
- React frontend with Tailwind CSS

### **Phase 2: Core Features** ⚡
- Clinical trials supply tracking
- Cold-chain monitoring with real-time sensors
- Blockchain integration for audit trails
- User authentication and role management

### **Phase 3: Advanced Analytics** 📊
- Machine learning integration for cold-chain risk prediction
- Real-time analytics and reporting
- Enhanced UI/UX with interactive charts
- WebSocket integration for live updates

### **Phase 4: AI-Powered Innovation** 🤖
- **AI Drug Verification**: Image-based drug recognition and verification
- **Cold-Chain Anomaly Detection**: Real-time AI-powered anomaly detection
- **Patient Adherence Tracking**: ML-based medication adherence prediction
- **Mobile Application**: Cross-platform React Native mobile app
- **Enhanced UI/UX**: Modern Chakra UI components and fluid animations

## 🌟 **Complete Feature Set**

### 🏠 **Landing Page**
- **Modern, responsive design** with dynamic moving background
- **Light/Dark mode toggle** (bottom-right corner)
- **Professional healthcare branding** with MedChain logo
- **Animated elements**: floating particles, gradient orbs, moving lines
- **Call-to-action sections** with testimonials and statistics

### 🔐 **Authentication**
- **Dummy login system** for demonstration
- **Credentials**: `admin` / `admin123`
- **Secure session management**

### 📊 **Dashboard Overview**
- **Total Items**: 1,389 tracked items
- **Low Stock Alerts**: Real-time notifications
- **Monthly Usage**: $54,320 analytics
- **Inventory Value**: $312,450 tracking
- **Clinical Trials Status**: Active trial monitoring
- **Cold Chain Monitoring**: Real-time temperature tracking
- **AI Analytics**: ML model performance metrics
- **Patient Care**: Medication adherence insights

### 📦 **Inventory Management**
- **Add/Edit Items**: Complete CRUD operations
- **Stock Tracking**: Real-time inventory levels
- **Category Management**: Antibiotics, Consumables, Diabetes Care, Equipment, Pain Management
- **Status Indicators**: Good, Low, Critical stock levels
- **Price Tracking**: Complete financial management

### 🧪 **Clinical Trials Supply**
- **Drug Batch Logging**: Complete batch information
- **Blockchain Ledger**: Approved shipments tracking
- **Regulator Approval**: Role-based approval system
- **Batch Status**: Pending, Approved states
- **Audit Trail**: Complete transaction history

### 🌡️ **Cold-Chain Monitoring**
- **Live Temperature Data**: Real-time graph with dual Y-axis
- **AI Risk Analysis**: Dynamic risk assessment using ML model
- **ML Model Integration**: Logistic Regression classifier for risk prediction
- **Real-time Sensor Feed**: Live data updates every 3 seconds
- **Batch-specific Monitoring**: Individual batch tracking
- **Status Indicators**: SAFE, WARNING, CRITICAL states
- **ML Predictions**: Real-time Safe/Spoiled classification with confidence scores
- **AI Anomaly Detection**: Real-time detection of temperature/humidity anomalies
- **Risk Analysis**: Color-coded alerts and ML-powered recommendations

### 🤖 **AI-Powered Features (Phase 4)**

#### **AI Drug Verification**
- **Image Upload/Capture**: Support for drug package photos
- **ML Model Integration**: Computer vision for drug recognition
- **Verification Results**: Confidence scores and drug details
- **Quality Assessment**: Label, dosage, shape, and color analysis
- **Available in**: Web dashboard and mobile app

#### **Cold-Chain Anomaly Detection**
- **Real-time Monitoring**: Continuous anomaly detection
- **AI Alerts**: Intelligent flagging of risky batches
- **Risk Assessment**: ML-powered risk analysis
- **Color-coded Alerts**: Visual risk indicators
- **Browser Notifications**: Optional push notifications

#### **Patient Medication Adherence**
- **Intake Logging**: Manual, barcode, and voice input support
- **ML Predictions**: Adherence trend analysis
- **Staff Alerts**: Automated notifications for missed doses
- **Interactive Charts**: 30-day adherence trends
- **AI Insights**: Predictive analytics and recommendations

### 📱 **Mobile Application**
- **Cross-platform**: React Native with Expo
- **Native Features**: Push notifications, camera access, device integration
- **AI Integration**: All AI features available on mobile
- **Responsive Design**: Optimized for mobile devices
- **Offline Support**: Local data caching and sync
- **Modern UI**: React Native Paper components with fluid animations

### 🔔 **Active Alerts System**
- **Low Stock Alerts**: Automated notifications
- **Expiry Warnings**: Proactive expiry management
- **Critical Thresholds**: Emergency notifications
- **AI Anomaly Alerts**: ML-powered cold-chain alerts
- **Real-time Updates**: Live alert system

### ⛓️ **Blockchain Activity**
- **Transaction History**: Complete audit trail
- **Block Numbers**: Blockchain integration
- **Hash Tracking**: Cryptographic verification
- **Activity Logging**: All system activities

### 📈 **Analytics & Reports**
- **Usage Analytics**: Monthly and trend analysis
- **Inventory Reports**: Comprehensive reporting
- **Performance Metrics**: System performance tracking
- **AI Model Performance**: ML accuracy and efficiency metrics
- **Patient Adherence Trends**: Medication compliance analytics

## 🚀 **Quick Start**

### Prerequisites
- Node.js (v14 or higher)
- Python 3.8+
- npm or yarn
- Expo CLI (for mobile development)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd MedChain
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

4. **Mobile App Setup**
```bash
cd mobile
npm install
```

5. **Start the Application**
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

# Terminal 3 (Mobile - Optional)
cd mobile
npx expo start
```

6. **Access the Application**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Mobile App**: Scan QR code with Expo Go app

## 📡 **API Routes & Structure**

### 🔐 **Authentication Routes**
```http
POST /auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

### 📦 **Inventory Management Routes**

#### Get All Inventory Items
```http
GET /inventory/items
Response: Array of inventory items with stock levels, prices, and status
```

#### Add New Item
```http
POST /inventory/items
Content-Type: application/json

{
  "name": "Amoxicillin 500mg",
  "category": "Antibiotics",
  "stock": 50,
  "price": 45.99,
  "description": "Broad-spectrum antibiotic"
}
```

#### Update Item
```http
PUT /inventory/items/{item_id}
Content-Type: application/json

{
  "stock": 45,
  "price": 42.99
}
```

#### Delete Item
```http
DELETE /inventory/items/{item_id}
```

### 🧪 **Clinical Trials Routes**

#### Get All Batches
```http
GET /trials
Response: Array of drug batches with approval status
```

#### Add New Batch
```http
POST /trials
Content-Type: application/json

{
  "drugName": "COVID-19 Vaccine (Moderna)",
  "expiry": "2024-12-31",
  "sender": "Moderna Pharmaceuticals",
  "receiver": "City General Hospital"
}
```

#### Approve Batch (Regulator Role)
```http
PUT /trials/{batch_id}/approve
Content-Type: application/json

{
  "approved_by": "Regulator_001",
  "approval_notes": "All safety checks passed"
}
```

#### Get Batch Details
```http
GET /trials/{batch_id}
Response: Complete batch information with approval history
```

### 🌡️ **Cold-Chain Monitoring Routes**

#### Get Sensor Data for Batch
```http
GET /coldchain/data/{batch_id}
Response: Array of temperature and humidity readings
```

#### Get Risk Analysis
```http
GET /coldchain/risk?batch_id={batch_id}
Response: AI risk assessment with recommendations
```

#### Post Sensor Data
```http
POST /coldchain/data
Content-Type: application/json

{
  "batchID": "BATCH001",
  "temperature": 4.2,
  "humidity": 45.3
}
```

#### ML Model Prediction
```http
POST /coldchain/predict
Content-Type: application/json

{
  "batch_id": "BATCH001",
  "temp_c": 4.5,
  "humidity": 70
}
Response: {
  "batch_id": "BATCH001",
  "temp_c": 4.5,
  "humidity": 70,
  "risk": "Safe",
  "risk_score": 85.2,
  "confidence": 92.1
}
```

#### Test ML Model
```http
GET /coldchain/test
Response: Test predictions with sample data to verify model functionality
```

### 🤖 **AI-Powered Routes (Phase 4)**

#### AI Drug Verification
```http
POST /ai/drug-verification
Content-Type: multipart/form-data

{
  "image": [image_file],
  "drug_type": "tablet"
}
Response: {
  "verification_result": "verified",
  "confidence_score": 94.2,
  "detected_drug": "Amoxicillin 500mg",
  "quality_assessment": "excellent"
}
```

#### AI Anomaly Detection
```http
POST /ai/anomaly-detection
Content-Type: application/json

{
  "batch_id": "BATCH001",
  "temperature_data": [4.2, 4.5, 8.1, 4.3],
  "humidity_data": [45, 47, 52, 46]
}
Response: {
  "anomalies_detected": true,
  "risk_level": "WARNING",
  "anomaly_type": "temperature_spike",
  "recommendations": ["Check cooling system", "Monitor closely"]
}
```

#### Patient Adherence Tracking
```http
POST /ai/patient-adherence
Content-Type: application/json

{
  "patient_id": "P001",
  "medication_id": "MED001",
  "intake_time": "2024-01-16T08:00:00Z",
  "intake_method": "manual"
}
Response: {
  "adherence_score": 87.5,
  "trend": "improving",
  "next_dose": "2024-01-16T20:00:00Z",
  "recommendations": ["Continue current schedule"]
}
```

#### Get Patient Adherence History
```http
GET /ai/patient-adherence/{patient_id}
Response: Complete adherence history with trends and predictions
```

### 🔔 **Alerts Routes**

#### Get Active Alerts
```http
GET /alerts
Response: Array of active alerts with severity levels
```

#### Create Alert
```http
POST /alerts
Content-Type: application/json

{
  "type": "low_stock",
  "message": "Amoxicillin 500mg is running low",
  "severity": "warning",
  "item_id": "item_123"
}
```

#### Resolve Alert
```http
PUT /alerts/{alert_id}/resolve
```

### ⛓️ **Blockchain Routes**

#### Get Blockchain Activity
```http
GET /blockchain/activity
Response: Array of blockchain transactions
```

#### Get Transaction Details
```http
GET /blockchain/transaction/{hash}
Response: Detailed transaction information
```

## 📊 **Data Models**

### Drug Batch Model
```json
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
}
```

### Sensor Data Model
```json
{
  "batchID": "BATCH001",
  "temperature": 4.2,
  "humidity": 45.3,
  "timestamp": "2024-01-16T12:00:00Z"
}
```

### Risk Analysis Model
```json
{
  "status": "SAFE",
  "risk_score": 0.12,
  "recommendations": [
    "Temperature stable at 4.2°C",
    "Humidity levels optimal",
    "Continue standard monitoring"
  ]
}
```

### AI Drug Verification Model
```json
{
  "verification_result": "verified",
  "confidence_score": 94.2,
  "detected_drug": "Amoxicillin 500mg",
  "dosage": "500mg",
  "form": "tablet",
  "quality_assessment": "excellent",
  "label_verification": "passed",
  "color_analysis": "within_range"
}
```

### Patient Adherence Model
```json
{
  "patient_id": "P001",
  "medication_id": "MED001",
  "adherence_score": 87.5,
  "trend": "improving",
  "last_intake": "2024-01-16T08:00:00Z",
  "next_dose": "2024-01-16T20:00:00Z",
  "missed_doses": 2,
  "recommendations": ["Continue current schedule"]
}
```

### Inventory Item Model
```json
{
  "id": "item_123",
  "name": "Amoxicillin 500mg",
  "category": "Antibiotics",
  "stock": 45,
  "max_stock": 50,
  "price": 45.99,
  "status": "low",
  "description": "Broad-spectrum antibiotic"
}
```

## 🎨 **UI Components**

### Landing Page Features
- **Responsive Design**: Mobile-first approach
- **Dynamic Background**: Animated particles and gradients
- **Theme Toggle**: Light/Dark mode switching
- **Smooth Animations**: Framer Motion integration

### Dashboard Features
- **Tab Navigation**: 11 main sections including AI features
- **Real-time Updates**: Live data streaming
- **Interactive Charts**: Recharts integration
- **Status Indicators**: Color-coded alerts
- **AI Analytics**: ML model performance dashboard

### Cold-Chain Monitoring
- **Live Temperature Graph**: Real-time updates every 3 seconds
- **Dual Y-axis**: Temperature and humidity tracking
- **AI Risk Analysis**: Dynamic risk assessment
- **Current Values Display**: Real-time sensor readings
- **Anomaly Detection**: AI-powered alert system

### AI Features Interface
- **Drug Verification**: Image upload and ML results display
- **Patient Adherence**: Interactive charts and trend analysis
- **Anomaly Alerts**: Real-time notification system
- **Performance Metrics**: ML model accuracy tracking

### Mobile App Features
- **Native Navigation**: Bottom tab navigation
- **Touch-Optimized**: Mobile-first design
- **Offline Capability**: Local data caching
- **Push Notifications**: Real-time alerts
- **Camera Integration**: Drug verification photos

## 🤖 **ML Model Integration**

### Model Training
The system includes a trained Logistic Regression classifier for cold-chain risk prediction:

1. **Training Data**: `backend/batch_data.csv` contains 40 samples with temperature, humidity, and target (Safe/Spoiled)
2. **Features**: Temperature (°C) and Humidity (%)
3. **Target**: Binary classification (Safe/Spoiled)
4. **Training Script**: `backend/train_model.py`
5. **Model Files**: `model.pkl` and `scaler.pkl`

### Training Process
```bash
cd backend
python3 train_model.py
```

### Model Performance
- **Training Accuracy**: ~78%
- **Testing Accuracy**: ~63%
- **Features**: Temperature and Humidity scaling
- **Output**: Safe/Spoiled classification

### API Integration
- **POST `/coldchain/predict`**: Real-time risk prediction
- **GET `/coldchain/test`**: Model testing with sample data
- **Automatic Loading**: Model loads at FastAPI startup

### AI Features (Phase 4)
- **Drug Verification**: Computer vision models (simulated)
- **Anomaly Detection**: Time-series analysis models
- **Patient Adherence**: Predictive analytics models
- **Real-time Processing**: Live ML inference

## 🔧 **Technical Stack**

### Frontend (Web)
- **React 18**: Modern React with hooks
- **Tailwind CSS**: Utility-first CSS framework
- **Chakra UI**: Modern component library
- **Framer Motion**: Smooth animations
- **Recharts**: Data visualization
- **Lucide React**: Icon library

### Frontend (Mobile)
- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tools
- **React Native Paper**: Material Design components
- **React Navigation**: Navigation framework
- **React Native Chart Kit**: Mobile charting
- **Expo Notifications**: Push notification system

### Backend
- **FastAPI**: Modern Python web framework
- **Uvicorn**: ASGI server
- **Pydantic**: Data validation
- **WebSocket**: Real-time communication
- **scikit-learn**: Machine learning library
- **pandas**: Data manipulation
- **joblib**: Model serialization
- **Pillow**: Image processing
- **OpenCV**: Computer vision
- **NumPy**: Numerical computing
- **Logistic Regression**: ML model for risk prediction

### Development Tools
- **npm**: Package management
- **Python venv**: Virtual environment
- **Git**: Version control
- **Expo CLI**: Mobile development tools

## 🚀 **Deployment**

### Environment Variables
```bash
# Backend
DATABASE_URL=postgresql://user:password@localhost/medchain
SECRET_KEY=your-secret-key
DEBUG=True

# Frontend
REACT_APP_API_URL=http://localhost:8000
REACT_APP_WS_URL=ws://localhost:8000/ws

# Mobile
EXPO_PUBLIC_API_URL=http://localhost:8000
```

### Production Build
```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000

# Mobile
cd mobile
npx expo build:android  # or build:ios
```

## 📱 **Mobile App Development**

### Setup
```bash
cd mobile
npm install
npx expo start
```

### Features
- **Cross-platform**: iOS and Android support
- **Native Performance**: React Native optimization
- **Offline Support**: Local data persistence
- **Push Notifications**: Real-time alerts
- **Camera Integration**: Drug verification photos
- **Responsive Design**: Adaptive layouts

### Development
- **Expo Go**: Test on physical devices
- **Hot Reload**: Instant code updates
- **Debug Tools**: Built-in debugging
- **Performance Monitoring**: Real-time metrics

## 📝 **License**

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 **Support**

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the API documentation at `/docs`
- Review mobile app documentation in `/mobile/README.md`

---

**MedChain** - Revolutionizing healthcare inventory management with blockchain technology, real-time monitoring, and cutting-edge AI capabilities. From basic inventory tracking to next-generation AI-powered healthcare platform. 🏥✨🤖

*Built through 4 phases of development, evolving continuously to meet modern healthcare needs.*

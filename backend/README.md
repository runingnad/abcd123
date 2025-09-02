# MedCare Clean Architecture Setup

## Quick Start

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Create Database & Users
```bash
python create_admin.py
```

### 3. Train ML Models
```bash
# Train symptom prediction model
python ai/train_symptoms.py

# Train skin classification model (needs images first)
python ai/train_skin.py
```

### 4. Start Backend
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 5. Start Frontend
```bash
cd ../frontend
npm start
```

## Demo Accounts
- **Admin**: admin@medcare.com / admin123
- **Manager**: manager@medcare.com / manager123  
- **Doctor**: doctor@medcare.com / doctor123
- **Patient**: patient@medcare.com / patient123

## Architecture

### Backend Structure
```
backend/
├── app/
│   ├── models/          # SQLAlchemy models
│   ├── routers/         # FastAPI route handlers
│   ├── services/        # Business logic (blockchain, etc.)
│   ├── utils/           # Utilities (auth, security)
│   └── schemas/         # Pydantic models
├── ai/                  # ML models and training scripts
└── storage/             # File uploads
```

### Role-Based Features
- **Manager**: File management + blockchain approval
- **Doctor**: Patient adherence monitoring + chat
- **Patient**: Symptom checker + skin/nail analysis

## ML Models Setup

### Symptom Prediction
Already configured with demo data. For production:
1. Replace `ai/symptoms_small.csv` with larger Kaggle dataset
2. Re-run `python ai/train_symptoms.py`

### Skin/Nail Classification
1. Add images to `ai/skin_nail/train/` and `ai/skin_nail/valid/` folders:
   ```
   ai/skin_nail/
   ├── train/
   │   ├── healthy/
   │   ├── fungal/
   │   └── psoriasis/
   └── valid/
       ├── healthy/
       ├── fungal/
       └── psoriasis/
   ```
2. Run `python ai/train_skin.py`

## Blockchain Integration
Update `.env` with your blockchain credentials:
```
SECRET_KEY=your-super-secret-key
RPC_URL=https://your-evm-rpc-url
CONTRACT_ADDRESS=0xYourContractAddress
PRIVATE_KEY=0xYourDeployerPrivateKey
```

## API Endpoints

### Authentication
- `POST /auth/login` - Login
- `POST /auth/register` - Register (admin only)
- `GET /auth/me` - Get current user

### Manager Features
- `POST /files` - Upload file
- `GET /files` - List files
- `POST /files/{id}/approve` - Approve on blockchain

### AI Features
- `POST /ai/symptoms/predict` - Symptom prediction
- `POST /ai/skin/predict` - Skin/nail analysis

### Doctor Features
- `GET /adherence/{patient_id}` - Patient adherence
- `WS /ws/chat/{room_id}` - Patient chat

Built with clean architecture principles for scalability and maintainability.

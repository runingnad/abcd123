# MedCare: AI + Blockchain Powered Clinical Trial & Cold-Chain Management

## Team
- Shivam Bhardwaj - 25BAI1526
- Krrish Rajput - 25BAIxxxx

---

## 🚀 Project Overview

**MedCare** is an innovative platform that integrates **Blockchain, Artificial Intelligence, and IoT** to ensure **secure clinical trial drug supply management** and **reliable vaccine cold-chain monitoring**.  
Built for healthcare institutions and regulators, MedCare improves **trust, transparency, and efficiency** in clinical trials and medical supply logistics.

---

## 🏥 Problem Statement

- **Clinical Trials** face fraud, tampering, and lack of transparency.  
- **Vaccine Supply Chains** often fail due to cold-chain breaches, leading to spoilage and loss.  
- Current systems are siloed and do not leverage advanced AI/ML for decision-making.

---

## 💡 Our Solution

MedCare combines **Blockchain for immutable drug supply records** with **AI-powered cold-chain safety analysis**, creating a next-gen healthcare management system.

### Key Features
1. **Blockchain-Based Clinical Trial Drug Supply**
   - Immutable ledger of drug batches.
   - Role-based actions (Supplier, Regulator).
   - Transparent approval workflow.

2. **AI-Powered Cold-Chain Monitoring**
   - Real-time IoT data ingestion (temperature, humidity).
   - ML model predicts **Safe vs Spoiled** batches.
   - Alerts for threshold breaches.

3. **Future-Ready AI Enhancements (Planned)**
   - Voice-based prescription manager.
   - Image-based drug verification.
   - AI-powered patient medication adherence tracker.

---

## 🛠️ Tech Stack

- **Frontend:** React + Tailwind (Dashboard UI)  
- **Backend:** FastAPI (REST APIs)  
- **Database:** PostgreSQL  
- **Blockchain:** Solidity Smart Contracts (deployed via Thirdweb)  
- **AI/ML:** Hugging Face AutoTrain Model  
- **IoT Simulation:** Ubidots Device Simulator  

---

## 🔗 System Architecture

**Frontend → Backend → Blockchain + AI → Database**  

### Example API Endpoints
- `/trials`
  - **POST** → Add new batch  
  - **GET** → Fetch all batches  
  - **PUT** → Approve a batch  

- `/coldchain`
  - **POST** → Ingest IoT data (temp, humidity)  
  - **GET** → AI model inference (Safe/Spoiled)  

---

## 📊 Workflow

1. Supplier logs a new batch (sent to blockchain).  
2. Regulator approves batch (immutable record stored).  
3. IoT devices send live cold-chain data.  
4. Backend forwards data to AI model → classification (Safe/Spoiled).  
5. Dashboard visualizes supply status and risk alerts.  

---

## 📂 Project Structure

MedCare/
│── backend/ (FastAPI routes, DB models)
│── frontend/ (React + Tailwind dashboard)
│── contracts/ (Solidity smart contracts)
│── ai-model/ (Hugging Face API integration)
│── iot-sim/ (Ubidots device simulator configs)
│── README.md (Project documentation)

yaml
Copy code

---

## ⚡ Demo Use Cases

- A regulator approves a clinical trial drug shipment on-chain.  
- IoT sensors detect vaccine batch temperature rising → AI flags as “Spoiled”.  
- Dashboard updates in real-time with alerts.  

---

## 📌 Future Scope

- Mobile app with voice prescription management.  
- Advanced anomaly detection in cold-chain datasets.  
- AI-powered medication adherence and reminders.  
- Integration with hospital EHR systems.  

---

## 🙌 Contributors

- Shivam Bhardwaj (25BAI1526)  
- Krrish Rajput (25BAIxxxx)  

---

## 🏆 Hackathon Ready

This project is designed as a **hackathon-ready prototype** with extendable architecture for production deployment.  
Our goal is to **enhance transparency, safety, and trust** in healthcare supply chains.

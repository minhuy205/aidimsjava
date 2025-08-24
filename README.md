# 🏥 AI-based Diagnostic Imaging Management System (AIDIMS)

## 📌 Overview
AIDIMS is a medical web application designed to manage patient records, diagnostic imaging, and AI-assisted analysis.  
The system provides functionalities for **staff, doctors, technicians, and administrators**.

### 🛠️ Technology Stack
- **Backend**: Java Spring Boot  
- **Frontend**: React / Next.js / Angular / JavaScript (option)  
- **AI Integration**: DICOM image analysis  
- **Deployment**: Web App  

---

## 👥 User Roles & Features

### 👩‍💼 Staff (Receptionist)
- Create and update patient profiles.  
- Record patient symptoms.  
- Assign patients to suitable doctors based on symptoms and specialty.  

### 👨‍⚕️ Doctor
- View patient records and request imaging.  
- Analyze DICOM images.  
- Receive AI analysis results and make final diagnosis.  
- Annotate and add notes to images.  
- Compare patient images across time.  
- Generate diagnostic reports.  

### 🧑‍🔬 Imaging Technician
- Import images from imaging devices into the system.  
- Check image quality and re-capture if needed.  
- Assign images to patients and add related information.  

### 👨‍💻 System Administrator *(under development)*
- Manage user accounts.  
- Monitor system activities.  
- Configure system parameters and AI models.  

---

## 🚀 Getting Started

### 1. Backend (Spring Boot)
``bash
cd aidims-backend
mvn clean install
mvn spring-boot:run

###  2. Frontend (React)
''bash
cd aidims-frontend
npm install
npm install react-konva use-image react-modal
npm start

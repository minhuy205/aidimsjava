import ReactDOM from "react-dom/client"
import HomePage from "./pages/Guest/index.js"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/Login/Login.js"
import Register from "./pages/Register/Register.js"
import IndexDoctor from "./pages/Doctor/indexDoctor.js"
import PatientProfile from "./pages/Doctor/PatientProfile.js"
import MedicalReportForm from "./pages/Doctor/MedicalReportForm.js"
import IndexReceptionist from "./pages/Receptionist/IndexReceptionist.js"
import PatientForm from "./pages/Receptionist/PatientForm.js"
import SymptomRecord from "./pages/Receptionist/SymptomRecord.js"
import AssignDoctor from "./pages/Receptionist/AssignDoctor.js"
import IndexTechnician from "./pages/Technician/IndexTechnician.js"
import ImportDicom from "./pages/Technician/ImportDicom.js"
import VerifyImages from "./pages/Technician/VerifyImages.js"
import AssignImages from "./pages/Technician/AssignImages.js"
import IndexAdmin from "./pages/Admin/IndexAdmin.js"
import UserManagement from "./pages/Admin/UserManagement.js"
import SystemMonitoring from "./pages/Admin/SystemMonitoring.js"
import SystemSettings from "./pages/Admin/SystemSettings.js"
import About from "./pages/Guest/about.js"
import Contact from "./pages/Guest/Contact.js"
import Feature from "./pages/Guest/Feature.js"
import User from "./pages/User.js"
import DicomViewer from "./pages/Doctor/DicomViewer.js"
import CompareImages from "./pages/Doctor/CompareImages.js"
import SymptomDisplayLayout from "./pages/Doctor/SymptomDisplay.js"

import DoctorLogin from "./pages/Login/DoctorLogin.js"
import ReceptionistLogin from "./pages/Login/ReceptionistLogin.js"
import TechnicianLogin from "./pages/Login/TechnicianLogin.js"
import AdminLogin from "./pages/Login/AdminLogin.js"
const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/LoginRegister" element={<Login />} /> {/* Redirect cũ */}
      {/* Doctor Routes */}
      <Route path="/IndexDoctor" element={<IndexDoctor />} />
      <Route path="/doctor/patients" element={<PatientProfile />} />
      <Route path="/PatientProfile" element={<PatientProfile />} /> {/* Redirect cũ */}
      <Route path="/doctor/reports" element={<MedicalReportForm />} />
      <Route path="MedicalReportForm" element={<MedicalReportForm />} />
      <Route path="/doctor/dicom-viewer" element={<DicomViewer />} />
      <Route path="/doctor/compare-images" element={<CompareImages/>}/>
      <Route path="/doctor/symptom" element={<SymptomDisplayLayout />} />
      <Route path="/SymptomDisplay" element={<SymptomDisplayLayout />} />

      {/* Receptionist Routes */}
      <Route path="/IndexReceptionist" element={<IndexReceptionist />} />
      <Route path="/receptionist" element={<IndexReceptionist />} />
      <Route path="/receptionist/patients" element={<PatientForm />} />
      <Route path="/receptionist/symptoms" element={<SymptomRecord />} />
      <Route path="/receptionist/assign" element={<AssignDoctor />} />
      <Route path="/patient" element={<PatientForm />} /> {/* Redirect cũ */}
      {/* Technician Routes */}
      <Route path="/IndexTechnician" element={<IndexTechnician />} />
      <Route path="/technician" element={<IndexTechnician />} />
      <Route path="/technician/import-dicom" element={<ImportDicom />} />
      <Route path="/technician/verify-images" element={<VerifyImages />} />
      <Route path="/technician/assign-images" element={<AssignImages />} />
      {/* Admin Routes */}
      <Route path="/IndexAdmin" element={<IndexAdmin />} />
      <Route path="/admin" element={<IndexAdmin />} />
      <Route path="/admin/users" element={<UserManagement />} />
      <Route path="/admin/system" element={<SystemMonitoring />} />
      <Route path="/admin/settings" element={<SystemSettings />} />
      {/* Guest Routes */}
      <Route path="/About" element={<About />} />
      <Route path="/Contact" element={<Contact />} />
      <Route path="/Feature" element={<Feature />} />
      <Route path="/User" element={<User />} />
      {/* Catch-all route */}

      <Route path="/login/doctor" element={<DoctorLogin />} />
      <Route path="/login/receptionist" element={<ReceptionistLogin />} />
      <Route path="/login/technician" element={<TechnicianLogin />} />
      <Route path="/login/admin" element={<AdminLogin />} />
    </Routes>
  </BrowserRouter>,
)

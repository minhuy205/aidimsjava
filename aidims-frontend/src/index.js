import React from 'react';
import ReactDOM from 'react-dom/client';
import HomePage from "./pages/Guest/index.js";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginRegister from "./pages/Login/Login.js";
import IndexDoctor from "./pages/Doctor/indexDoctor.js";
import About from './pages/Guest/about.js';
import Contact from './pages/Guest/Contact.js';
import Feature from './pages/Guest/Feature.js';
import PatientProfile from './pages/Doctor/PatientProfile.js';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/LoginRegister" element={<LoginRegister />} />
        <Route path="/LoginRegister" element={<LoginRegister />} />
      <Route path="/IndexDoctor" element={<IndexDoctor />} />
      <Route path="/About" element={<About />} />
      <Route path="/Contact" element={<Contact />} />
      <Route path="/Feature" element={<Feature />} />
        <Route path="/PatientProfile" element={<PatientProfile />} />
        {/* Add more routes as needed */}
    </Routes>
  </BrowserRouter>
);
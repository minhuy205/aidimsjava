// src/services/patientService.js
const API_BASE_URL = 'http://localhost:8080/api/patients';

export const patientService = {
    getAllPatients: async () => {
        const response = await fetch(API_BASE_URL);
        return await response.json();
    }
};
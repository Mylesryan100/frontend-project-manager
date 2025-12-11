import axios from "axios";


console.log(import.meta.env.VITE_BACKEND_URL);
export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    headers: {
        Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Il9pZCI6IjY5M2E3Nzk4YmM2MTRlNWVmOWEwODVhNiIsInVzZXJuYW1lIjoibXlsZXNmZWwxMDAiLCJlbWFpbCI6Im15bGVzZmVsaWNpYW5vQGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIn0sImlhdCI6MTc2NTQzOTM5MSwiZXhwIjoxNzY1NTI1NzkxfQ.Cr7Bwd4ru8sZ42qjDJfjAiwFlMoufCAfFbXPpgVJo9E'
    }
})
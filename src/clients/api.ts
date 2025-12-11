import axios from "axios";


console.log(import.meta.env.VITE_BACKEND_URL);
export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    headers: {
        Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Il9pZCI6IjY5MzliMDY2MjAxMjU5ZmE2ZTBkNzNhMiIsInVzZXJuYW1lIjoia3lsZWR5bGFuMTAwIiwiZW1haWwiOiJreWxlZHlsYW5AZ21haWwuY29tIiwicm9sZSI6InVzZXIifSwiaWF0IjoxNzY1NDA1MTEwLCJleHAiOjE3NjU0OTE1MTB9.z3IiDA5jLf3YJ_xfiFlWFX0bfr71cjv72xOz28ygHNQ'
    }
})
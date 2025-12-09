import axios from "axios";



export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    headers: {
        Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Il9pZCI6IjY5MzMxZGQyMzM4MjJmMDdiODEyNDg5NSIsInVzZXJuYW1lIjoidXNlcjEwIiwiZW1haWwiOiJ1c2VyM0BlbWFpbC5jb20iLCJyb2xlIjoidXNlciJ9LCJpYXQiOjE3NjQ5NTc2ODYsImV4cCI6MTc2NDk2NDg4Nn0.Vct6TjYLhkUPfoaJlftxX0vIA8iwMsAwoL-Tntdx4RE'
    }
})
import axios from "axios";



export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    headers: {
        Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Il9pZCI6IjY5Mzg2MmQzZjkxNjdlMmI2NDRmNTljZCIsInVzZXJuYW1lIjoibXlsZXMxMjMiLCJlbWFpbCI6Im15bGVzcnlhbkBnbWFpbC5jb20iLCJyb2xlIjoidXNlciJ9LCJpYXQiOjE3NjUzMDMwMTUsImV4cCI6MTc2NTM4OTQxNX0.B0W0Q_MoqBFfrJ7T4VcusKyqcIsbCIZiCWxdTCWjgvg'
    }
})
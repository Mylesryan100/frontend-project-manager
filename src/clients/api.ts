import axios from "axios";



export const apiClient = axios.create({
    baseURL: 'http://localhost:4000',
    headers: {
        Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Il9pZCI6IjY5MzIwMjZkZjVhZWE2YjU5YTU0MTg3NCIsInVzZXJuYW1lIjoiTXlsZXNyeWFuMTIzIiwiZW1haWwiOiJ0ZXN0M0BtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIn0sImlhdCI6MTc2NDg4NTE1MSwiZXhwIjoxNzY0ODkyMzUxfQ.FNreTMK9KFu3Niw8oFnNXmXfrGmWc0q_RIWd-000O9M'
    }
})
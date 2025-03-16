import axios from "axios";
import { toast } from "react-toastify";


export const customFetch = axios.create({
    baseURL: location.hostname == "localhost" ? "http://localhost:8080/api/v1" : "/api/v1"
})

export async function refreshAccessToken() {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: import.meta.env.VITE_CLIENT_ID,
      client_secret: import.meta.env.VITE_CLIENT_SECRET,
      refresh_token: import.meta.env.VITE_REFRESH_TOKEN,
      grant_type: "refresh_token",
    }),
  });

  const data = await response.json();
  return data.access_token; // Use this token for API requests
}

export const saveToDataBase = async (action) => {
    try {
        const resp = await customFetch.post("/addlogs", {action})
        toast.success(resp?.data?.msg)
    } catch (error) {
        toast.error(error?.resp?.response?.data?.msg)
    }
}
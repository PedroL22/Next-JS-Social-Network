import axios from "axios";

const api = axios.create({
  baseURL: `https://${process.env.VERCEL_URL}`,
});

export default api;

import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_VERCEL_URL,
  headers: { 'Accept-Encoding': 'application/json' },
})

export default api

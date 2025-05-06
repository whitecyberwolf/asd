import axios from 'axios';
export default axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api' });
export const api = axios.create({
  baseURL: '/api',   // thanks to the Vite proxy this goes to :4000 in dev
  // withCredentials: true,        // ← enable if you need cookies
  // timeout: 10000,
});

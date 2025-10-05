import axios from 'axios';

const envUrlRaw = import.meta.env.VITE_API_URL;
const envUrl = typeof envUrlRaw === 'string' ? envUrlRaw.trim() : '';
const fallback = 'http://localhost:5000/api';
const baseURL = envUrl && envUrl.startsWith('http') ? envUrl : fallback;


const api = axios.create({ baseURL: '/api' });

export default api;

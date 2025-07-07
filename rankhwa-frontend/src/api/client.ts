import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE ?? 'https://rankhwa-704497531631.us-central1.run.app',
});

api.interceptors.request.use(cfg => {
    const token = localStorage.getItem('jwt');
    if (token) {
        cfg.headers.Authorization = `Bearer ${token}`;
    }
    return cfg;
})

export default api;


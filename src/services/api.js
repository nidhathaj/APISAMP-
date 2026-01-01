import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor for Auth Token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response Interceptor for Token Refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
                try {
                    const res = await axios.post('/api/auth/refresh/', { refresh: refreshToken });
                    localStorage.setItem('access_token', res.data.access);
                    api.defaults.headers.common['Authorization'] = `Bearer ${res.data.access}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    localStorage.clear();
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

export const authService = {
    login: (credentials) => api.post('/auth/login/', credentials),
    logout: () => api.post('/auth/logout/'),
};

export const kbService = {
    getCategories: () => api.get('/owasp/categories/'),
    getVulnerabilities: (categoryId) => api.get(`/owasp/vulnerabilities/${categoryId ? `?category_id=${categoryId}` : ''}`),
    getDefinitions: (source) => api.get(`/vulnerability-definitions/${source ? `?source=${source}` : ''}`),
};

export const reportService = {
    getReports: () => api.get('/reports/'),
    getReport: (id) => api.get(`/reports/${id}/`),
    createReport: (data) => api.post('/reports/', data),
    getFindings: (reportId) => api.get(`/reports/${reportId}/findings/`),
    addFinding: (reportId, data) => api.post(`/reports/${reportId}/findings/`, data),
    updateFinding: (findingId, data) => api.patch(`/report-findings/${findingId}/`, data),
    getEvidence: (findingId) => api.get(`/report-findings/${findingId}/evidence/`),
    addEvidence: (findingId, data) => {
        // Evidence often requires multi-part for screenshots
        const formData = new FormData();
        Object.keys(data).forEach(key => formData.append(key, data[key]));
        return api.post(`/report-findings/${findingId}/evidence/`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    getPreview: (reportId) => api.get(`/reports/${reportId}/preview/`),
    exportPdf: (reportId) => api.post(`/reports/${reportId}/export/pdf/`, {}, { responseType: 'blob' }),
    exportDocx: (reportId) => api.post(`/reports/${reportId}/export/docx/`, {}, { responseType: 'blob' }),
};

export default api;

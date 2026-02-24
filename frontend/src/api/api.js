import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor — attach JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor — handle 401
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// ============ Auth API ============
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
};

// ============ Jobs API ============
export const jobsAPI = {
    getAll: () => api.get('/jobs'),
    getById: (id) => api.get(`/jobs/${id}`),
    create: (data) => api.post('/jobs', data),
    update: (id, data) => api.put(`/jobs/${id}`, data),
    delete: (id) => api.delete(`/jobs/${id}`),
    getMyJobs: () => api.get('/jobs/my'),
};

// ============ Applications API ============
export const applicationsAPI = {
    apply: (jobId, data) => api.post(`/applications/${jobId}/apply`, data),
    getMyApplications: () => api.get('/applications/my'),
    getApplicantsForJob: (jobId) => api.get(`/applications/job/${jobId}`),
    updateStatus: (id, status) => api.put(`/applications/${id}/status?status=${status}`),
};

// ============ Profile API ============
export const profileAPI = {
    getMyProfile: () => api.get('/profile/my'),
    createOrUpdate: (data) => api.post('/profile', data),
};

// ============ Admin API ============
export const adminAPI = {
    getAllRecruiters: () => api.get('/admin/recruiters'),
    approveRecruiter: (id) => api.put(`/admin/recruiters/${id}/approve`),
    getAllJobs: () => api.get('/admin/jobs'),
    removeJob: (id) => api.delete(`/admin/jobs/${id}`),
};

// ============ File Upload API ============
export const filesAPI = {
    uploadResume: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/files/upload/resume', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
    uploadPhoto: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/files/upload/photo', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
};

// ============ User API ============
export const userAPI = {
    deleteAccount: () => api.delete('/users/me'),
};

export default api;

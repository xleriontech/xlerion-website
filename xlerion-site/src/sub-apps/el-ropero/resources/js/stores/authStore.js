import axios from 'axios';

export const authStore = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,

    async login(email, password) {
        this.loading = true;
        try {
            const { data } = await axios.post('/api/auth/login', { email, password });
            this.user = data.user;
            this.isAuthenticated = true;
            localStorage.setItem('authToken', data.token);
            this.error = null;
            return { success: true };
        } catch (err) {
            const message = err.response?.data?.message || 'Login failed';
            this.error = message;
            return { success: false, error: message };
        } finally {
            this.loading = false;
        }
    },

    async register(formData) {
        this.loading = true;
        try {
            const { data } = await axios.post('/api/auth/register', formData);
            this.user = data.user;
            this.isAuthenticated = true;
            localStorage.setItem('authToken', data.token);
            this.error = null;
            return { success: true };
        } catch (err) {
            const message = err.response?.data?.message || 'Registration failed';
            this.error = message;
            return { success: false, error: message };
        } finally {
            this.loading = false;
        }
    },

    async logout() {
        try {
            await axios.post('/api/auth/logout');
            this.user = null;
            this.isAuthenticated = false;
            localStorage.removeItem('authToken');
        } catch (err) {
            console.error('Logout error:', err);
        }
    },

    checkAuth() {
        const token = localStorage.getItem('authToken');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            // En producción, verificar el token con el servidor
            this.isAuthenticated = true;
        }
    },
};

export const initAuthStore = () => {
    authStore.checkAuth();
};

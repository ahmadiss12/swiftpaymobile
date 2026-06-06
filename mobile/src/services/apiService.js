import { API_BASE_URL } from '../config/api';

class ApiService {
    constructor() {
        this.token = null;
        this.baseURL = API_BASE_URL;
    }

    setToken(token) {
        this.token = token;
    }

    clearToken() {
        this.token = null;
    }

    async parseResponse(response) {
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
            return response.json();
        }

        const text = await response.text();
        return text ? { message: text } : {};
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;

        const config = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
                ...options.headers,
            },
        };

        if (options.body && typeof options.body === 'object') {
            config.body = JSON.stringify(options.body);
        }

        try {
            const response = await fetch(url, config);
            const data = await this.parseResponse(response);

            if (!response.ok) {
                // Provide more specific error messages
                let errorMessage = data.message || 'Request failed';

                // Handle validation errors
                if (data.errors && typeof data.errors === 'object') {
                    const errorMessages = Object.values(data.errors).flat();
                    if (errorMessages.length > 0) {
                        errorMessage = errorMessages[0];
                    }
                }

                // Handle specific HTTP status codes
                if (response.status === 404) {
                    errorMessage = data.message || 'Resource not found';
                } else if (response.status === 401) {
                    errorMessage = data.message || 'Unauthorized';
                } else if (response.status === 422) {
                    errorMessage = data.message || 'Validation failed';
                }

                const error = new Error(errorMessage);
                error.status = response.status;
                error.data = data;
                throw error;
            }

            return data;
        } catch (error) {
            if (error.message && error.status) {
                throw error;
            }
            throw new Error(error.message || 'Network error. Please check your connection.');
        }
    }

    // Auth methods
    async register(userData) {
        return await this.request('/register', {
            method: 'POST',
            body: userData,
        });
    }

    async login(credentials) {
        const response = await this.request('/login', {
            method: 'POST',
            body: credentials,
        });

        if (response.token) {
            this.setToken(response.token);
        }

        return response;
    }

    async logout() {
        try {
            await this.request('/logout', {
                method: 'POST',
            });
        } finally {
            this.clearToken();
        }
    }

    // Dashboard
    async getDashboard() {
        return await this.request('/dashboard', {
            method: 'GET',
        });
    }

    // Transactions
    async sendMoney(transferData) {
        return await this.request('/transactions/send', {
            method: 'POST',
            body: transferData,
        });
    }

    async getTransactions(type = 'All', limit = 50) {
        return await this.request(`/transactions?type=${type}&limit=${limit}`, {
            method: 'GET',
        });
    }

    // Users
    async getUserByIdentifier(identifier) {
        return await this.request(`/user/search?identifier=${encodeURIComponent(identifier)}`, {
            method: 'GET',
        });
    }
}

export default new ApiService();

const API_URL = 'http://localhost:8080/api';

export const getAuthToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token');
    }
    return null;
}

export const setAuthToken = (token: string) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
    }
}

export const clearAuthToken = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
    }
}

export const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
    const token = getAuthToken();
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...((options.headers as Record<string, string>) || {}),
    };

    const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!res.ok) {
        throw new Error((await res.text()) || 'An error occurred');
    }

    if (res.status === 204) return null;

    try {
        return await res.json();
    } catch {
        return null;
    }
}

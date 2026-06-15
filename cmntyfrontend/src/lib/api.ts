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

export const setAuthUser = (token: string, userId: number, name: string) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
        localStorage.setItem('userId', String(userId));
        localStorage.setItem('name', name);
    }
}

export const getAuthUser = () => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        const name = localStorage.getItem('name');
        if (token && userId && name) {
            return { token, userId: Number(userId), name };
        }
    }
    return null;
}

export const clearAuthToken = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('name');
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

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuthUser, setAuthUser, clearAuthToken } from '@/lib/api';

export type AuthUser = {
    token: string;
    userId: number;
    name: string;
    role: string;
};

interface AuthContextType {
    currentUser: AuthUser | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    loading: boolean;
    login: (token: string, userId: number, name: string, role: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Hydrate from localStorage on client mount
        const user = getAuthUser();
        if (user) {
            setCurrentUser(user);
        }
        setLoading(false);
    }, []);

    const login = (token: string, userId: number, name: string, role: string) => {
        setAuthUser(token, userId, name, role);
        setCurrentUser({ token, userId, name, role });
    };

    const logout = () => {
        clearAuthToken();
        setCurrentUser(null);
    };

    const isAuthenticated = currentUser !== null && currentUser.token.length > 0;
    const isAdmin = isAuthenticated && currentUser?.role === 'ADMIN';

    return (
        <AuthContext.Provider value={{ currentUser, isAuthenticated, isAdmin, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}


'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuthUser, setAuthUser, clearAuthToken } from '@/lib/api';

export type AuthUser = {
    token: string;
    userId: number;
    name: string;
};

interface AuthContextType {
    currentUser: AuthUser | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (token: string, userId: number, name: string) => void;
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

    const login = (token: string, userId: number, name: string) => {
        setAuthUser(token, userId, name);
        setCurrentUser({ token, userId, name });
    };

    const logout = () => {
        clearAuthToken();
        setCurrentUser(null);
    };

    const isAuthenticated = currentUser !== null && currentUser.token.length > 0;

    return (
        <AuthContext.Provider value={{ currentUser, isAuthenticated, loading, login, logout }}>
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

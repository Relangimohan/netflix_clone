/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useEffect } from 'react';
import { AuthPage } from './pages/AuthPage';
import { BrowsePage } from './pages/BrowsePage';

interface User {
    _id: string;
    email: string;
}

interface AuthData {
    token: string;
    user: User;
}

// Main App Component
export const App = () => {
    const [authData, setAuthData] = useState<AuthData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for token in local storage on initial load
        const token = localStorage.getItem('token');
        const userString = localStorage.getItem('user');
        if (token && userString) {
            const user = JSON.parse(userString);
            setAuthData({ token, user });
        }
        setLoading(false);
    }, []);

    const handleAuthSuccess = (newAuthData: AuthData) => {
        localStorage.setItem('token', newAuthData.token);
        localStorage.setItem('user', JSON.stringify(newAuthData.user));
        setAuthData(newAuthData);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setAuthData(null);
    };
    
    if (loading) {
        return <div>Loading...</div>; // Or a proper spinner
    }

    return authData ? <BrowsePage onLogout={handleLogout} /> : <AuthPage onAuthSuccess={handleAuthSuccess} />;
};
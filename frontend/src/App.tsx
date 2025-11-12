/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState } from 'react';
import { AuthPage } from './pages/AuthPage';
import { BrowsePage } from './pages/BrowsePage';

interface User {
    // A simple user object for the demo
    email: string;
}

// Main App Component
export const App = () => {
    const [user, setUser] = useState<User | null>(null);

    const handleAuthSuccess = (authData: { token: string; user: User }) => {
        setUser(authData.user);
    };

    const handleLogout = () => {
        setUser(null);
        console.log('User logged out.');
    };
    
    return user ? (
        <BrowsePage onLogout={handleLogout} />
    ) : (
        <AuthPage onAuthSuccess={handleAuthSuccess} />
    );
};
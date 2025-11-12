/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState } from 'react';
import { TypingLogo } from '../components/TypingLogo';

interface User {
    _id: string;
    email: string;
}

interface AuthPageProps {
    onAuthSuccess: (authData: { token: string; user: User }) => void;
}

// Registration/Login Page Component
export const AuthPage = ({ onAuthSuccess }: AuthPageProps) => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!email || !password) {
            setError('Please enter email and password.');
            return;
        }

        // --- Simulating a successful login for static demo ---
        console.log(`Simulating ${isRegistering ? 'registration' : 'login'} for ${email}`);
        // In a real app, you would get the user and token from the backend.
        onAuthSuccess({ token: 'fake-jwt-token', user: { _id: '123', email: email } });
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <TypingLogo text="mana studio"/>
                <h1 style={{marginTop: '2rem'}}>{isRegistering ? 'Sign Up' : 'Sign In'}</h1>
                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                    <div className="input-group">
                        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
                    </div>
                    {error && <p style={{ color: '#e87c03', marginTop: '10px' }}>{error}</p>}
                    <button type="submit">{isRegistering ? 'Sign Up' : 'Sign In'}</button>
                </form>
                <div className="auth-switch">
                    {isRegistering ? 'Already have an account? ' : 'New to mana studio? '}
                    <a onClick={() => { setIsRegistering(!isRegistering); setError(''); }}>
                        {isRegistering ? 'Sign in now.' : 'Sign up now.'}
                    </a>
                </div>
            </div>
        </div>
    );
};
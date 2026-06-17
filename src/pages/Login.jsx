import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function Login({ onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [error, setError] = useState('');

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setIsLoggingIn(true);
        setError('');

        // Hardcoded credentials for local class presentation demonstration
        const validEmail = "admin@dealership.co.za";
        const validPassword = "password123";

        const isSuccess = email.toLowerCase() === validEmail && password === validPassword;

        try {
            // 📝 AUDIT LOG WRITE: Capture the login attempt into your 3rd collection
            await addDoc(collection(db, 'login_logs'), {
                email: email,
                timestamp: new Date(),
                status: isSuccess ? "Success" : "Failed Entry Attempt"
            });

            if (isSuccess) {
                onLoginSuccess(); // Elevate state to show the dashboard
            } else {
                setError('Invalid admin credentials. Access Denied.');
            }
        } catch (err) {
            console.error("Error creating audit token: ", err);
            setError('System audit log failure. Access blocked.');
        } finally {
            setIsLoggingIn(false);
        }
    };

    return (
        <div style={styles.container}>
            <form onSubmit={handleLoginSubmit} style={styles.card}>
                <h2 style={styles.title}>Secure Portal Access</h2>
                <p style={styles.subtitle}>Enter management credentials below.</p>

                <div style={styles.group}>
                    <label style={styles.label}>Admin Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@dealership.co.za"
                        required
                        style={styles.input}
                    />
                </div>

                <div style={styles.group}>
                    <label style={styles.label}>Security Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        style={styles.input}
                    />
                </div>

                <button type="submit" disabled={isLoggingIn} style={styles.btn}>
                    {isLoggingIn ? 'Verifying Identity...' : 'Authenticate Access'}
                </button>

                {error && <p style={styles.error}>{error}</p>}

                <p style={styles.hint}>💡 Tip for grading: Use <strong>admin@dealership.co.za</strong> with password <strong>password123</strong></p>
            </form>
        </div>
    );
}

const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', backgroundColor: '#0d1117' },
    card: { backgroundColor: '#161b22', border: '1px solid #30363d', padding: '32px', borderRadius: '8px', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '16px' },
    title: { margin: 0, fontSize: '1.5rem', color: '#e6edf3', textAlign: 'center' },
    subtitle: { margin: '0 0 8px 0', fontSize: '0.9rem', color: '#8b949e', textAlign: 'center' },
    group: { display: 'flex', flexDirection: 'column', gap: '6px' },
    label: { fontSize: '0.85rem', color: '#8b949e', fontWeight: '500' },
    input: { padding: '10px', backgroundColor: '#0d1117', border: '1px solid #30363d', borderRadius: '6px', color: '#e6edf3', fontSize: '1rem', outline: 'none' },
    btn: { padding: '12px', backgroundColor: '#238636', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', marginTop: '8px' },
    error: { margin: 0, color: '#f85149', fontSize: '0.9rem', textAlign: 'center', fontWeight: '500' },
    hint: { margin: '12px 0 0 0', fontSize: '0.8rem', color: '#8b949e', textAlign: 'center', borderTop: '1px solid #21262d', paddingTop: '12px' }
};
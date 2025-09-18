import React, { useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useAuth } from '../../context/ApiProvider';

export const Route = createFileRoute('/_public/login')({
  component: LoginPage,
});

function LoginPage() {
  const [email, setEmail] = useState('admin@admin.com');
  const [password, setPassword] = useState('password');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@admin.com' && password === 'password') {
      // Read the token directly from the environment variable
      const adminToken = import.meta.env.VITE_ADMIN_BEARER_TOKEN; 
      
      if (adminToken) {
        login(adminToken);
        navigate({ to: '/' });
      } else {
        alert('Admin token is not configured. Please check your .env file.');
      }
    } else {
      alert('Invalid credentials');
    }
  };
  
  // ... rest of the component remains the same
  return (
    <div style={styles.card}>
      <h1 style={styles.title}>Admin Login</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div>
            <label style={styles.label}>Email</label>
            <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            />
        </div>
        <div>
            <label style={styles.label}>Password</label>
            <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            />
        </div>
        <button type="submit" style={styles.button}>
          Login
        </button>
      </form>
    </div>
  );
}

// ... styles object remains the same
const styles: { [key: string]: React.CSSProperties } = {
  card: { backgroundColor: 'var(--surface-color)', padding: 'calc(var(--spacing-unit) * 5)', borderRadius: 'var(--border-radius)', boxShadow: 'var(--shadow-md)', width: '100%', maxWidth: '400px' },
  title: { margin: '0 0 calc(var(--spacing-unit) * 3) 0', fontSize: '1.8rem', textAlign: 'center' },
  form: { display: 'flex', flexDirection: 'column', gap: 'calc(var(--spacing-unit) * 2)' },
  label: { fontWeight: 500, marginBottom: 'calc(var(--spacing-unit) / 2)', display: 'block', textAlign: 'left'},
  input: { width: '100%', padding: 'calc(var(--spacing-unit) * 1.5)', fontSize: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius)' },
  button: { padding: 'calc(var(--spacing-unit) * 1.5)', fontSize: '1rem', border: 'none', borderRadius: 'var(--border-radius)', backgroundColor: 'var(--primary-color)', color: 'white', cursor: 'pointer', transition: 'background-color 0.2s', marginTop: 'var(--spacing-unit)'},
};
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, ShieldCheck, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await login({ email, password });
            navigate('/');
        } catch (err) {
            setError('Invalid credentials. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel login-card"
            >
                <div className="login-header">
                    <div className="logo-icon">
                        <ShieldCheck size={40} color="#3b82f6" />
                    </div>
                    <h1>VAPT Reporting Tool</h1>
                    <p>Sign in to your pentest workspace</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label><Mail size={16} /> Email Address</label>
                        <input
                            type="email"
                            placeholder="pentester@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label><Lock size={16} /> Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="error-message">{error}</motion.p>}

                    <button type="submit" disabled={isLoading}>
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Secure Login'}
                    </button>
                </form>

                <div className="login-footer">
                    <a href="#">Forgot password?</a>
                </div>
            </motion.div>

            <style>{`
        .login-container {
          height: 100vh;
          width: 100vw;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .login-card {
          width: 100%;
          max-width: 420px;
          padding: 2.5rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        .login-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .logo-icon {
          display: inline-flex;
          padding: 1rem;
          background: rgba(59, 130, 246, 0.1);
          border-radius: 50%;
          margin-bottom: 1rem;
        }

        .login-header h1 {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0;
          letter-spacing: -0.025em;
        }

        .login-header p {
          color: var(--text-secondary);
          font-size: 0.875rem;
          margin-top: 0.5rem;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        button {
          margin-top: 1rem;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .error-message {
          color: var(--accent-danger);
          font-size: 0.875rem;
          text-align: center;
          margin: 0;
        }

        .login-footer {
          margin-top: 1.5rem;
          text-align: center;
        }

        .login-footer a {
          font-size: 0.875rem;
          color: var(--text-secondary);
          text-decoration: none;
          transition: color 0.2s;
        }

        .login-footer a:hover {
          color: var(--accent-primary);
        }
      `}</style>
        </div>
    );
};

export default Login;

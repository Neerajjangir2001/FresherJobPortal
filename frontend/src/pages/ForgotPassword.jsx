import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../api/api';
import './Auth.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            const response = await authAPI.forgotPassword({ email });
            setStatus({ type: 'success', message: response.data || 'Password reset link sent to your email.' });
        } catch (err) {
            setStatus({ type: 'error', message: err.message || 'Failed to send reset link.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card glass-card animate-fade-in">
                <div className="auth-header">
                    <h1>Forgot Password</h1>
                    <p>Enter your email to receive a password reset link</p>
                </div>

                {status.message && (
                    <div className={`alert alert-${status.type}`}>
                        {status.message}
                    </div>
                )}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setStatus({ type: '', message: '' });
                            }}
                            className="form-input"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-lg auth-submit"
                        disabled={loading || status.type === 'success'}
                        style={{ width: '100%' }}
                    >
                        {loading ? 'Sending link...' : 'Send Reset Link'}
                    </button>
                </form>

                <div className="auth-footer" style={{ marginTop: '20px' }}>
                    Remember your password? <Link to="/login">Sign In</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;

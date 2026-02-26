import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { authAPI } from '../api/api';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import './Auth.css';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({ newPassword: '', confirmPassword: '' });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setStatus({ type: '', message: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.newPassword !== form.confirmPassword) {
            setStatus({ type: 'error', message: 'Passwords do not match.' });
            return;
        }

        if (form.newPassword.length < 6) {
            setStatus({ type: 'error', message: 'Password must be at least 6 characters.' });
            return;
        }

        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            await authAPI.resetPassword({
                token,
                newPassword: form.newPassword
            });
            setStatus({ type: 'success', message: 'Password successfully reset. You can now login.' });
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setStatus({ type: 'error', message: err.message || 'Failed to reset password. The token may be invalid or expired.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card glass-card animate-fade-in">
                <div className="auth-header">
                    <h1>Set New Password</h1>
                    <p>Enter your new password below</p>
                </div>

                {status.message && (
                    <div className={`alert alert-${status.type}`}>
                        {status.message}
                    </div>
                )}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>New Password</label>
                        <div className="password-wrapper">
                            <input
                                type={showPass ? 'text' : 'password'}
                                name="newPassword"
                                value={form.newPassword}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="Enter new password"
                                required
                                style={{ paddingRight: '2.5rem' }}
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPass(!showPass)}
                                tabIndex={-1}
                            >
                                {showPass ? <HiEyeOff /> : <HiEye />}
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Confirm Password</label>
                        <div className="password-wrapper">
                            <input
                                type={showConfirmPass ? 'text' : 'password'}
                                name="confirmPassword"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="Confirm new password"
                                required
                                style={{ paddingRight: '2.5rem' }}
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowConfirmPass(!showConfirmPass)}
                                tabIndex={-1}
                            >
                                {showConfirmPass ? <HiEyeOff /> : <HiEye />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-lg auth-submit"
                        disabled={loading || status.type === 'success'}
                        style={{ width: '100%' }}
                    >
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>

                <div className="auth-footer" style={{ marginTop: '20px' }}>
                    Remember your password? <Link to="/login">Sign In</Link>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;

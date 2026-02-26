import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiEye, HiEyeOff, HiUser, HiOfficeBuilding } from 'react-icons/hi';
import './Auth.css';

const Register = () => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        role: 'JOB_SEEKER',
        companyName: '',
        website: '',
        companyLocation: '',
        companyDescription: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const payload = { name: form.name, email: form.email, password: form.password, role: form.role };
            if (form.role === 'RECRUITER') {
                payload.companyName = form.companyName;
                payload.website = form.website;
                payload.companyLocation = form.companyLocation;
                payload.companyDescription = form.companyDescription;
            }
            const user = await register(payload);
            switch (user.role) {
                case 'JOB_SEEKER': navigate('/seeker/profile'); break;
                case 'RECRUITER': navigate('/recruiter/dashboard'); break;
                case 'ADMIN': navigate('/admin/dashboard'); break;
                default: navigate('/');
            }
        } catch (err) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card glass-card animate-fade-in" style={{ maxWidth: form.role === 'RECRUITER' ? 540 : 480 }}>
                <div className="auth-header">
                    <h1>Create Account</h1>
                    <p>Join FresherJobs and start your journey</p>
                </div>

                {error && <div className="alert alert-error">{error}</div>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    {/* Role Selector */}
                    <div className="form-group">
                        <label>I am a...</label>
                        <div className="role-selector">
                            <div
                                className={`role-option ${form.role === 'JOB_SEEKER' ? 'active' : ''}`}
                                onClick={() => setForm((p) => ({ ...p, role: 'JOB_SEEKER' }))}
                            >
                                <div className="role-icon"><HiUser /></div>
                                Job Seeker
                            </div>
                            <div
                                className={`role-option ${form.role === 'RECRUITER' ? 'active' : ''}`}
                                onClick={() => setForm((p) => ({ ...p, role: 'RECRUITER' }))}
                            >
                                <div className="role-icon"><HiOfficeBuilding /></div>
                                Recruiter
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="John Doe"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <div className="password-wrapper">
                            <input
                                type={showPass ? 'text' : 'password'}
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="Minimum 8 characters"
                                required
                                minLength={8}
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

                    {/* Company fields for RECRUITER */}
                    {form.role === 'RECRUITER' && (
                        <div className="company-fields">
                            <span className="company-fields-title">Company Details</span>
                            <div className="form-group">
                                <label>Company Name</label>
                                <input
                                    type="text"
                                    name="companyName"
                                    value={form.companyName}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="Acme Inc."
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Website</label>
                                <input
                                    type="url"
                                    name="website"
                                    value={form.website}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="https://company.com"
                                />
                            </div>
                            <div className="form-group">
                                <label>Location</label>
                                <input
                                    type="text"
                                    name="companyLocation"
                                    value={form.companyLocation}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="Bangalore, India"
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    name="companyDescription"
                                    value={form.companyDescription}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="Brief description of your company..."
                                    rows={3}
                                />
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary btn-lg auth-submit"
                        disabled={loading}
                        style={{ width: '100%' }}
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <div className="auth-footer">
                    Already have an account? <Link to="/login">Sign In</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;

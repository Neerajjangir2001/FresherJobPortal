import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobsAPI } from '../../api/api';
import './RecruiterDashboard.css';

const CreateJob = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        title: '',
        description: '',
        skillsRequired: '',
        jobType: 'FULL_TIME',
        experienceRequired: 0,
        graduationYear: '',
        salaryMin: '',
        salaryMax: '',
        location: '',
        expiresAt: '',
        categoryId: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const payload = {
                ...form,
                experienceRequired: Number(form.experienceRequired),
                graduationYear: form.graduationYear ? Number(form.graduationYear) : null,
                salaryMin: form.salaryMin ? Number(form.salaryMin) : null,
                salaryMax: form.salaryMax ? Number(form.salaryMax) : null,
                categoryId: form.categoryId ? Number(form.categoryId) : null,
                expiresAt: form.expiresAt || null,
            };
            await jobsAPI.create(payload);
            navigate('/recruiter/dashboard');
        } catch (err) {
            setError(err.message || 'Failed to create job');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-job-page container">
            <div className="page-header" style={{ textAlign: 'center' }}>
                <h1>Post a New Job</h1>
                <p>Find the best fresher talent for your team</p>
            </div>

            <div className="create-job-card glass-card animate-fade-in">
                {error && <div className="alert alert-error">{error}</div>}

                <form className="create-job-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Job Title *</label>
                        <input type="text" name="title" value={form.title} onChange={handleChange} className="form-input" placeholder="Software Developer Intern" required />
                    </div>

                    <div className="form-group">
                        <label>Description *</label>
                        <textarea name="description" value={form.description} onChange={handleChange} className="form-input" placeholder="Describe the role, responsibilities, and requirements..." rows={5} required />
                    </div>

                    <div className="form-group">
                        <label>Skills Required (comma separated)</label>
                        <input type="text" name="skillsRequired" value={form.skillsRequired} onChange={handleChange} className="form-input" placeholder="Java, React, SQL..." />
                    </div>

                    <div className="create-job-row">
                        <div className="form-group">
                            <label>Job Type *</label>
                            <select name="jobType" value={form.jobType} onChange={handleChange} className="form-input" required>
                                <option value="FULL_TIME">Full Time</option>
                                <option value="PART_TIME">Part Time</option>
                                <option value="INTERNSHIP">Internship</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Experience Required (years) *</label>
                            <select name="experienceRequired" value={form.experienceRequired} onChange={handleChange} className="form-input" required>
                                <option value={0}>0 — Fresher</option>
                                <option value={1}>1 Year</option>
                            </select>
                        </div>
                    </div>

                    <div className="create-job-row">
                        <div className="form-group">
                            <label>Salary Min (₹)</label>
                            <input type="number" name="salaryMin" value={form.salaryMin} onChange={handleChange} className="form-input" placeholder="300000" />
                        </div>
                        <div className="form-group">
                            <label>Salary Max (₹)</label>
                            <input type="number" name="salaryMax" value={form.salaryMax} onChange={handleChange} className="form-input" placeholder="600000" />
                        </div>
                    </div>

                    <div className="create-job-row">
                        <div className="form-group">
                            <label>Location</label>
                            <input type="text" name="location" value={form.location} onChange={handleChange} className="form-input" placeholder="Bangalore, Remote, etc." />
                        </div>
                        <div className="form-group">
                            <label>Graduation Year (batch)</label>
                            <input type="number" name="graduationYear" value={form.graduationYear} onChange={handleChange} className="form-input" placeholder="2025" />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Expires At</label>
                        <input type="date" name="expiresAt" value={form.expiresAt} onChange={handleChange} className="form-input" />
                    </div>

                    <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-sm)' }}>
                        <button type="button" className="btn btn-secondary btn-lg" onClick={() => navigate('/recruiter/dashboard')} style={{ flex: 1 }}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ flex: 2 }}>
                            {loading ? 'Posting...' : 'Post Job'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateJob;

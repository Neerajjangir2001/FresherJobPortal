import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiPlus, HiPencil, HiTrash, HiUserGroup } from 'react-icons/hi';
import { jobsAPI, userAPI } from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import './RecruiterDashboard.css';

const RecruiterDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await jobsAPI.getMyJobs();
                setJobs(response.data);
            } catch {
                setJobs([]);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this job?')) return;
        try {
            await jobsAPI.delete(id);
            setJobs((prev) => prev.filter((j) => j.id !== id));
        } catch (err) {
            alert(err.message || 'Failed to delete job');
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone and will delete all your posted jobs.')) return;

        try {
            await userAPI.deleteAccount();
            logout();
            navigate('/');
        } catch (err) {
            alert(err.message || 'Failed to delete account');
        }
    };

    const formatJobType = (type) => {
        switch (type) {
            case 'FULL_TIME': return 'Full Time';
            case 'PART_TIME': return 'Part Time';
            case 'INTERNSHIP': return 'Internship';
            default: return type;
        }
    };

    return (
        <div className="recruiter-dashboard container">
            <div className="page-header">
                <h1>Recruiter Dashboard</h1>
                <p>Welcome back, {user?.name}! Manage your job postings here.</p>
                <button className="btn btn-danger btn-sm" onClick={handleDeleteAccount} style={{ marginTop: '0.5rem' }}>
                    <HiTrash /> Delete Account
                </button>
            </div>

            {!user?.isApproved && (
                <div className="alert alert-error" style={{ marginBottom: 'var(--space-xl)' }}>
                    ⚠️ Your recruiter profile is pending admin approval. Jobs you post will be hidden from seekers until you are approved.
                </div>
            )}

            <div className="section-header">
                <h2>My Job Postings ({jobs.length})</h2>
                <Link to="/recruiter/create-job" className="btn btn-primary btn-sm"><HiPlus /> Post New Job</Link>
            </div>

            {loading ? (
                <div className="spinner"></div>
            ) : jobs.length > 0 ? (
                <div className="recruiter-jobs-list">
                    {jobs.map((job) => (
                        <div key={job.id} className="recruiter-job-card glass-card">
                            <div className="recruiter-job-info">
                                <h3>{job.title}</h3>
                                <div className="recruiter-job-meta">
                                    <span className="badge badge-job-type">{formatJobType(job.jobType)}</span>
                                    {job.location && <span>{job.location}</span>}
                                    <span>{job.postedAt ? new Date(job.postedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : ''}</span>
                                    {job.isActive ? (
                                        <span className="badge badge-active">Active</span>
                                    ) : (
                                        <span className="badge badge-inactive">Inactive</span>
                                    )}
                                </div>
                            </div>
                            <div className="recruiter-job-actions">
                                <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/recruiter/jobs/${job.id}/applicants`)}>
                                    <HiUserGroup /> Applicants
                                </button>
                                <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/recruiter/edit-job/${job.id}`)}>
                                    <HiPencil />
                                </button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(job.id)}>
                                    <HiTrash />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state glass-card">
                    <p>You haven&apos;t posted any jobs yet.</p>
                    <Link to="/recruiter/create-job" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                        <HiPlus /> Post Your First Job
                    </Link>
                </div>
            )}
        </div>
    );
};

export default RecruiterDashboard;

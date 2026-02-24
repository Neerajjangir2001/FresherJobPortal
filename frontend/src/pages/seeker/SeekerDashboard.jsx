import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiDocumentText, HiCheckCircle, HiXCircle, HiStar } from 'react-icons/hi';
import { applicationsAPI } from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import './SeekerDashboard.css';

const SeekerDashboard = () => {
    const { user } = useAuth();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await applicationsAPI.getMyApplications();
                setApplications(response.data);
            } catch {
                setApplications([]);
            } finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, []);

    const stats = {
        total: applications.length,
        shortlisted: applications.filter((a) => a.status === 'SHORTLISTED').length,
        hired: applications.filter((a) => a.status === 'HIRED').length,
        rejected: applications.filter((a) => a.status === 'REJECTED').length,
    };

    const getStatusBadge = (status) => {
        const map = {
            APPLIED: 'badge badge-applied',
            SHORTLISTED: 'badge badge-shortlisted',
            HIRED: 'badge badge-hired',
            REJECTED: 'badge badge-rejected',
        };
        return map[status] || 'badge';
    };

    return (
        <div className="seeker-dashboard container">
            <div className="page-header">
                <h1>Welcome, {user?.name} 👋</h1>
                <p>Track your job applications and manage your profile</p>
            </div>

            {/* Stats */}
            <div className="dashboard-stats">
                <div className="stat-card glass-card">
                    <div className="stat-icon" style={{ background: 'var(--gradient-secondary)' }}><HiDocumentText /></div>
                    <div className="stat-info">
                        <div className="stat-number">{stats.total}</div>
                        <div className="stat-label">Applied</div>
                    </div>
                </div>
                <div className="stat-card glass-card">
                    <div className="stat-icon" style={{ background: 'var(--gradient-warning)' }}><HiStar /></div>
                    <div className="stat-info">
                        <div className="stat-number">{stats.shortlisted}</div>
                        <div className="stat-label">Shortlisted</div>
                    </div>
                </div>
                <div className="stat-card glass-card">
                    <div className="stat-icon" style={{ background: 'var(--gradient-success)' }}><HiCheckCircle /></div>
                    <div className="stat-info">
                        <div className="stat-number">{stats.hired}</div>
                        <div className="stat-label">Hired</div>
                    </div>
                </div>
                <div className="stat-card glass-card">
                    <div className="stat-icon" style={{ background: 'var(--gradient-danger)' }}><HiXCircle /></div>
                    <div className="stat-info">
                        <div className="stat-number">{stats.rejected}</div>
                        <div className="stat-label">Rejected</div>
                    </div>
                </div>
            </div>

            {/* Applications */}
            <div className="section-header">
                <h2>My Applications</h2>
                <Link to="/jobs" className="btn btn-primary btn-sm">Browse More Jobs</Link>
            </div>

            {loading ? (
                <div className="spinner"></div>
            ) : applications.length > 0 ? (
                <div className="applications-list">
                    {applications.map((app) => (
                        <div key={app.id} className="application-card glass-card">
                            <div className="application-info">
                                <div className="application-logo">
                                    {app.companyName?.charAt(0)?.toUpperCase() || 'C'}
                                </div>
                                <div className="application-details">
                                    <h3><Link to={`/jobs/${app.jobId}`}>{app.jobTitle}</Link></h3>
                                    <span>{app.companyName}</span>
                                </div>
                            </div>
                            <div className="application-meta">
                                <span className="application-date">
                                    {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                                </span>
                                <span className={getStatusBadge(app.status)}>{app.status}</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state glass-card">
                    <p>You haven&apos;t applied to any jobs yet.</p>
                    <Link to="/jobs" className="btn btn-primary" style={{ marginTop: '1rem' }}>Start Applying</Link>
                </div>
            )}
        </div>
    );
};

export default SeekerDashboard;

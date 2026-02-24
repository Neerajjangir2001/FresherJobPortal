import { useState, useEffect } from 'react';
import { HiCheckCircle, HiTrash } from 'react-icons/hi';
import { adminAPI } from '../../api/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [tab, setTab] = useState('recruiters');
    const [recruiters, setRecruiters] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                if (tab === 'recruiters') {
                    const res = await adminAPI.getAllRecruiters();
                    setRecruiters(res.data);
                } else {
                    const res = await adminAPI.getAllJobs();
                    setJobs(res.data);
                }
            } catch {
                // Ignore
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [tab]);

    const handleApproveRecruiter = async (id) => {
        try {
            const res = await adminAPI.approveRecruiter(id);
            setRecruiters((prev) =>
                prev.map((r) => (r.id === id ? res.data : r))
            );
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to approve');
        }
    };

    const handleRemoveJob = async (id) => {
        if (!window.confirm('Remove this job listing?')) return;
        try {
            await adminAPI.removeJob(id);
            setJobs((prev) => prev.filter((j) => j.id !== id));
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to remove');
        }
    };

    return (
        <div className="admin-dashboard container">
            <div className="page-header">
                <h1>Admin Dashboard</h1>
                <p>Manage recruiters, jobs, and platform operations</p>
            </div>

            <div className="admin-tabs">
                <button className={`admin-tab ${tab === 'recruiters' ? 'active' : ''}`} onClick={() => setTab('recruiters')}>
                    Recruiters
                </button>
                <button className={`admin-tab ${tab === 'jobs' ? 'active' : ''}`} onClick={() => setTab('jobs')}>
                    All Jobs
                </button>
            </div>

            {loading ? (
                <div className="spinner"></div>
            ) : tab === 'recruiters' ? (
                recruiters.length > 0 ? (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Joined</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recruiters.map((r) => (
                                <tr key={r.id}>
                                    <td>{r.id}</td>
                                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{r.name}</td>
                                    <td>{r.email}</td>
                                    <td>{r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}</td>
                                    <td>
                                        {r.isApproved ? (
                                            <span className="badge badge-active">Approved</span>
                                        ) : (
                                            <span className="badge badge-shortlisted">Pending</span>
                                        )}
                                    </td>
                                    <td>
                                        <div className="actions-cell">
                                            {!r.isApproved && (
                                                <button className="btn btn-success btn-sm" onClick={() => handleApproveRecruiter(r.id)}>
                                                    <HiCheckCircle /> Approve
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="empty-state glass-card"><p>No recruiters found.</p></div>
                )
            ) : (
                jobs.length > 0 ? (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Title</th>
                                <th>Company</th>
                                <th>Type</th>
                                <th>Location</th>
                                <th>Active</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {jobs.map((j) => (
                                <tr key={j.id}>
                                    <td>{j.id}</td>
                                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{j.title}</td>
                                    <td>{j.company?.name || '—'}</td>
                                    <td><span className="badge badge-job-type">{j.jobType}</span></td>
                                    <td>{j.location || '—'}</td>
                                    <td>
                                        {j.isActive ? (
                                            <span className="badge badge-active">Active</span>
                                        ) : (
                                            <span className="badge badge-inactive">Inactive</span>
                                        )}
                                    </td>
                                    <td>
                                        <div className="actions-cell">
                                            <button className="btn btn-danger btn-sm" onClick={() => handleRemoveJob(j.id)}>
                                                <HiTrash /> Remove
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="empty-state glass-card"><p>No jobs found.</p></div>
                )
            )}
        </div>
    );
};

export default AdminDashboard;

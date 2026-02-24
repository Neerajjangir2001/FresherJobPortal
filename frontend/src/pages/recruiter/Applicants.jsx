import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { HiChevronDown, HiChevronUp, HiAcademicCap, HiMail, HiCalendar, HiEye } from 'react-icons/hi';
import { applicationsAPI } from '../../api/api';
import PdfViewer from '../../components/PdfViewer';
import './RecruiterDashboard.css';

const Applicants = () => {
    const { jobId } = useParams();
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);
    const [viewResumeUrl, setViewResumeUrl] = useState(null);

    useEffect(() => {
        const fetchApplicants = async () => {
            try {
                const response = await applicationsAPI.getApplicantsForJob(jobId);
                setApplicants(response.data);
            } catch {
                setApplicants([]);
            } finally {
                setLoading(false);
            }
        };
        fetchApplicants();
    }, [jobId]);

    const handleStatusChange = async (appId, newStatus) => {
        try {
            const response = await applicationsAPI.updateStatus(appId, newStatus);
            setApplicants((prev) =>
                prev.map((a) => (a.id === appId ? { ...a, status: response.data.status } : a))
            );
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update status');
        }
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

    const toggleExpand = (id) => {
        setExpandedId((prev) => (prev === id ? null : id));
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const jobTitle = applicants.length > 0 ? applicants[0].jobTitle : `Job #${jobId}`;

    return (
        <>
            <div className="applicants-page container">
                <div className="page-header">
                    <h1>Applicants</h1>
                    <p>Manage applications for <strong>{jobTitle}</strong></p>
                </div>

                <Link to="/recruiter/dashboard" className="btn btn-secondary btn-sm" style={{ marginBottom: 'var(--space-lg)', display: 'inline-flex' }}>
                    ← Back to Dashboard
                </Link>

                {loading ? (
                    <div className="spinner"></div>
                ) : applicants.length > 0 ? (
                    <div className="applicants-list">
                        {applicants.map((app) => (
                            <div key={app.id} className="applicant-card glass-card">
                                {/* Top row: avatar + info + actions */}
                                <div className="applicant-top-row" onClick={() => toggleExpand(app.id)} style={{ cursor: 'pointer' }}>
                                    <div className="applicant-info">
                                        <div className="applicant-avatar" style={app.profilePhoto ? {
                                            backgroundImage: `url(${app.profilePhoto})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            fontSize: 0,
                                        } : {}}>
                                            {!app.profilePhoto && (app.applicantName?.charAt(0)?.toUpperCase() || '?')}
                                        </div>
                                        <div className="applicant-details">
                                            <h3>{app.applicantName}</h3>
                                            <span><HiMail style={{ verticalAlign: 'middle', marginRight: '0.25rem' }} />{app.applicantEmail}</span>
                                            {app.appliedAt && (
                                                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', display: 'block', marginTop: '0.15rem' }}>
                                                    <HiCalendar style={{ verticalAlign: 'middle', marginRight: '0.25rem' }} />
                                                    Applied {formatDate(app.appliedAt)}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="applicant-meta">
                                        {app.resumeUrl && (
                                            <button className="btn btn-secondary btn-sm"
                                                onClick={(e) => { e.stopPropagation(); setViewResumeUrl(app.resumeUrl); }}>
                                                <HiEye /> Resume
                                            </button>
                                        )}
                                        <span className={getStatusBadge(app.status)}>{app.status}</span>
                                        <span className="expand-icon">
                                            {expandedId === app.id ? <HiChevronUp /> : <HiChevronDown />}
                                        </span>
                                    </div>
                                </div>

                                {/* Expanded detail section */}
                                {expandedId === app.id && (
                                    <div className="applicant-expanded animate-fade-in">
                                        <div className="applicant-profile-grid">
                                            {app.about && (
                                                <div className="profile-detail-item full-width">
                                                    <span className="detail-label">About</span>
                                                    <span className="detail-value">{app.about}</span>
                                                </div>
                                            )}
                                            {app.collegeName && (
                                                <div className="profile-detail-item">
                                                    <span className="detail-label"><HiAcademicCap style={{ verticalAlign: 'middle', marginRight: '0.25rem' }} />College</span>
                                                    <span className="detail-value">{app.collegeName}</span>
                                                </div>
                                            )}
                                            {app.degree && (
                                                <div className="profile-detail-item">
                                                    <span className="detail-label">Degree</span>
                                                    <span className="detail-value">{app.degree}</span>
                                                </div>
                                            )}
                                            {app.graduationYear && (
                                                <div className="profile-detail-item">
                                                    <span className="detail-label">Graduation Year</span>
                                                    <span className="detail-value">{app.graduationYear}</span>
                                                </div>
                                            )}
                                            {app.cgpa && (
                                                <div className="profile-detail-item">
                                                    <span className="detail-label">CGPA</span>
                                                    <span className="detail-value">{app.cgpa}</span>
                                                </div>
                                            )}
                                            {app.skills && (
                                                <div className="profile-detail-item full-width">
                                                    <span className="detail-label">Skills</span>
                                                    <div className="detail-skills">
                                                        {app.skills.split(',').map((skill, i) => (
                                                            <span key={i} className="skill-tag">{skill.trim()}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {app.coverLetter && (
                                            <div className="applicant-cover">
                                                <strong>Cover Letter:</strong><br />
                                                {app.coverLetter}
                                            </div>
                                        )}

                                        <div className="status-selector">
                                            {['APPLIED', 'SHORTLISTED', 'HIRED', 'REJECTED'].map((s) => (
                                                <button
                                                    key={s}
                                                    className={app.status === s ? 'active-status' : ''}
                                                    onClick={() => handleStatusChange(app.id, s)}
                                                >
                                                    {s.charAt(0) + s.slice(1).toLowerCase()}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state glass-card">
                        <p>No applications received for this job yet.</p>
                    </div>
                )}
            </div>

            {/* Resume Viewer Modal */}
            {viewResumeUrl && (
                <PdfViewer
                    url={viewResumeUrl}
                    onClose={() => setViewResumeUrl(null)}
                />
            )}
        </>
    );
};

export default Applicants;

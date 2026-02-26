import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { HiLocationMarker, HiClock, HiCurrencyRupee, HiCalendar, HiAcademicCap, HiBriefcase, HiX, HiGlobe, HiCloudUpload, HiCheck } from 'react-icons/hi';
import { jobsAPI, applicationsAPI, filesAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';
import './JobDetail.css';

const JobDetail = () => {
    const { id } = useParams();
    const { user, isAuthenticated } = useAuth();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [applyForm, setApplyForm] = useState({ resumeUrl: '', coverLetter: '' });
    const [applyLoading, setApplyLoading] = useState(false);
    const [applySuccess, setApplySuccess] = useState(false);
    const [applyError, setApplyError] = useState('');
    const [resumeFile, setResumeFile] = useState(null);
    const [resumeUploading, setResumeUploading] = useState(false);
    const resumeInputRef = useRef(null);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const response = await jobsAPI.getById(id);
                setJob(response.data);
            } catch {
                setJob(null);
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id]);

    const formatJobType = (type) => {
        switch (type) {
            case 'FULL_TIME': return 'Full Time';
            case 'PART_TIME': return 'Part Time';
            case 'INTERNSHIP': return 'Internship';
            default: return type;
        }
    };

    const formatSalary = (min, max) => {
        if (!min && !max) return 'Not Disclosed';
        const fmt = (v) => {
            const num = Number(v);
            if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
            if (num >= 1000) return `₹${(num / 1000).toFixed(0)}K`;
            return `₹${num}`;
        };
        if (min && max) return `${fmt(min)} - ${fmt(max)}`;
        if (min) return `From ${fmt(min)}`;
        return `Up to ${fmt(max)}`;
    };

    const handleResumeUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setResumeFile(file);
        setResumeUploading(true);
        setApplyError('');
        try {
            const res = await filesAPI.uploadResume(file);
            setApplyForm((p) => ({ ...p, resumeUrl: res.data.url }));
        } catch {
            setApplyError('Failed to upload resume');
            setResumeFile(null);
        } finally {
            setResumeUploading(false);
        }
    };

    const handleApply = async (e) => {
        e.preventDefault();
        setApplyLoading(true);
        setApplyError('');
        try {
            await applicationsAPI.apply(id, applyForm);
            setApplySuccess(true);
            setShowModal(false);
        } catch (err) {
            setApplyError(err.message || 'Failed to submit application');
        } finally {
            setApplyLoading(false);
        }
    };

    if (loading) return <div className="spinner" style={{ marginTop: '30vh' }}></div>;
    if (!job) return (
        <div className="container page-container">
            <div className="empty-state">
                <p>Job not found.</p>
                <Link to="/jobs" className="btn btn-secondary" style={{ marginTop: '1rem' }}>Back to Jobs</Link>
            </div>
        </div>
    );

    return (
        <div className="job-detail-page container">
            <div className="job-detail-content animate-fade-in">
                {/* Main Content */}
                <div className="job-detail-main">
                    <div className="job-detail-header glass-card">
                        <div className="job-detail-top">
                            <div className="job-detail-logo">
                                {job.companyName?.charAt(0)?.toUpperCase() || 'C'}
                            </div>
                            <div className="job-detail-title">
                                <h1>{job.title}</h1>
                                <span className="job-detail-company">{job.companyName}</span>
                            </div>
                        </div>
                        <div className="job-detail-tags">
                            <span className="badge badge-job-type">{formatJobType(job.jobType)}</span>
                            {job.isActive ? (
                                <span className="badge badge-active">Active</span>
                            ) : (
                                <span className="badge badge-inactive">Closed</span>
                            )}
                            {job.categoryName && <span className="badge badge-applied">{job.categoryName}</span>}
                        </div>
                    </div>

                    <div className="job-detail-section glass-card">
                        <h2>Job Description</h2>
                        <div className="description-text">{job.description}</div>
                    </div>

                    {job.skillsRequired && (
                        <div className="job-detail-section glass-card">
                            <h2>Skills Required</h2>
                            <div className="skills-list">
                                {job.skillsRequired.split(',').map((skill, i) => (
                                    <span key={i} className="skill-tag">{skill.trim()}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="job-detail-sidebar">
                    <div className="job-info-card glass-card">
                        <h3>Job Details</h3>
                        <div className="job-info-list">
                            {job.location && (
                                <div className="job-info-item">
                                    <div className="info-icon"><HiLocationMarker /></div>
                                    <div>
                                        <div className="info-label">Location</div>
                                        <div className="info-value">{job.location}</div>
                                    </div>
                                </div>
                            )}
                            <div className="job-info-item">
                                <div className="info-icon"><HiClock /></div>
                                <div>
                                    <div className="info-label">Experience</div>
                                    <div className="info-value">{job.experienceRequired === 0 ? 'Fresher (0 Years)' : '0-1 Year'}</div>
                                </div>
                            </div>
                            <div className="job-info-item">
                                <div className="info-icon"><HiCurrencyRupee /></div>
                                <div>
                                    <div className="info-label">Salary</div>
                                    <div className="info-value">{formatSalary(job.salaryMin, job.salaryMax)}</div>
                                </div>
                            </div>
                            <div className="job-info-item">
                                <div className="info-icon"><HiBriefcase /></div>
                                <div>
                                    <div className="info-label">Job Type</div>
                                    <div className="info-value">{formatJobType(job.jobType)}</div>
                                </div>
                            </div>
                            {job.graduationYear && (
                                <div className="job-info-item">
                                    <div className="info-icon"><HiAcademicCap /></div>
                                    <div>
                                        <div className="info-label">Grad Year</div>
                                        <div className="info-value">{job.graduationYear} Batch</div>
                                    </div>
                                </div>
                            )}
                            {job.expiresAt && (
                                <div className="job-info-item">
                                    <div className="info-icon"><HiCalendar /></div>
                                    <div>
                                        <div className="info-label">Expires</div>
                                        <div className="info-value">{new Date(job.expiresAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                                    </div>
                                </div>
                            )}
                            {job.companyWebsite && (
                                <div className="job-info-item">
                                    <div className="info-icon"><HiGlobe /></div>
                                    <div>
                                        <div className="info-label">Website</div>
                                        <div className="info-value">
                                            <a href={job.companyWebsite} target="_blank" rel="noopener noreferrer">{job.companyWebsite}</a>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="apply-card glass-card">
                        <h3>Interested in this role?</h3>
                        {applySuccess ? (
                            <div className="alert alert-success">Application submitted successfully! 🎉</div>
                        ) : isAuthenticated && user?.role === 'JOB_SEEKER' ? (
                            <>
                                <p>Apply now and take the first step in your career.</p>
                                <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={() => setShowModal(true)}>
                                    Apply Now
                                </button>
                            </>
                        ) : isAuthenticated ? (
                            <p style={{ color: 'var(--text-muted)' }}>Only job seekers can apply for jobs.</p>
                        ) : (
                            <>
                                <p>Login as a job seeker to apply.</p>
                                <Link to="/login" className="btn btn-primary btn-lg" style={{ width: '100%' }}>Login to Apply</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Apply Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Apply for {job.title}</h2>
                            <button className="modal-close" onClick={() => setShowModal(false)}><HiX /></button>
                        </div>

                        {applyError && <div className="alert alert-error">{applyError}</div>}

                        <form className="modal-form" onSubmit={handleApply}>
                            <div className="form-group">
                                <label>Resume (PDF)</label>
                                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => resumeInputRef.current?.click()}
                                        disabled={resumeUploading}
                                        style={{ flex: 'none' }}
                                    >
                                        {resumeUploading ? 'Uploading...' : <><HiCloudUpload /> Upload Resume</>}
                                    </button>
                                    <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)' }}>
                                        {resumeFile ? <><HiCheck style={{ color: 'var(--success)' }} /> {resumeFile.name}</> : 'No file selected'}
                                    </span>
                                    <input
                                        ref={resumeInputRef}
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={handleResumeUpload}
                                        style={{ display: 'none' }}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Cover Letter</label>
                                <textarea
                                    className="form-input"
                                    placeholder="Tell the recruiter why you're a great fit..."
                                    value={applyForm.coverLetter}
                                    onChange={(e) => setApplyForm((p) => ({ ...p, coverLetter: e.target.value }))}
                                    rows={5}
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={applyLoading || resumeUploading}>
                                    {applyLoading ? 'Submitting...' : 'Submit Application'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobDetail;

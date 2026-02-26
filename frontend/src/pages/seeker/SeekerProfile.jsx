import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiCloudUpload, HiCheck, HiPhotograph, HiEye, HiTrash, HiExclamation } from 'react-icons/hi';
import { profileAPI, filesAPI, userAPI } from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import PdfViewer from '../../components/PdfViewer';
import './SeekerDashboard.css';

const SeekerProfile = () => {
    const [form, setForm] = useState({
        collegeName: '',
        degree: '',
        graduationYear: '',
        cgpa: '',
        skills: '',
        resumeUrl: '',
        profilePhoto: '',
        about: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [resumeFile, setResumeFile] = useState(null);
    const [resumeUploading, setResumeUploading] = useState(false);
    const [photoUploading, setPhotoUploading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const resumeInputRef = useRef(null);
    const photoInputRef = useRef(null);
    const [showResume, setShowResume] = useState(false);
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await profileAPI.getMyProfile();
                const p = response.data;
                setForm({
                    collegeName: p.collegeName || '',
                    degree: p.degree || '',
                    graduationYear: p.graduationYear || '',
                    cgpa: p.cgpa || '',
                    skills: p.skills || '',
                    resumeUrl: p.resumeUrl || '',
                    profilePhoto: p.profilePhoto || '',
                    about: p.about || '',
                });
            } catch (err) {
                // Profile not found is OK for new users, but show other errors
                if (err.response?.status !== 404) {
                    setMessage({ type: 'error', text: err.message || 'Failed to load profile' });
                }
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setMessage({ type: '', text: '' });
    };

    const handleResumeUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setResumeFile(file);
        setResumeUploading(true);
        setMessage({ type: '', text: '' });
        try {
            const res = await filesAPI.uploadResume(file);
            setForm((prev) => ({ ...prev, resumeUrl: res.data.url }));
            setMessage({ type: 'success', text: `Resume "${res.data.filename}" uploaded!` });
        } catch (err) {
            setMessage({ type: 'error', text: err.message || 'Failed to upload resume' });
            setResumeFile(null);
        } finally {
            setResumeUploading(false);
        }
    };

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setPhotoUploading(true);
        setMessage({ type: '', text: '' });
        try {
            const res = await filesAPI.uploadPhoto(file);
            setForm((prev) => ({ ...prev, profilePhoto: res.data.url }));
            setMessage({ type: 'success', text: 'Profile photo uploaded!' });
        } catch (err) {
            setMessage({ type: 'error', text: err.message || 'Failed to upload photo' });
        } finally {
            setPhotoUploading(false);
        }
    };

    const handleDeleteAccount = async () => {
        setShowDeleteModal(false);
        setDeleting(true);
        setMessage({ type: '', text: '' });

        try {
            await userAPI.deleteAccount();
            logout();
            navigate('/');
        } catch (err) {
            setMessage({ type: 'error', text: err.message || 'Failed to delete account' });
        } finally {
            setDeleting(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });
        try {
            const payload = {
                ...form,
                graduationYear: form.graduationYear ? Number(form.graduationYear) : null,
                cgpa: form.cgpa ? Number(form.cgpa) : null,
            };
            await profileAPI.createOrUpdate(payload);
            setMessage({ type: 'success', text: 'Profile saved successfully! 🎉 Redirecting to dashboard...' });

            // Redirect to dashboard after 1.5s
            setTimeout(() => {
                navigate('/seeker/dashboard');
            }, 1500);
        } catch (err) {
            setMessage({ type: 'error', text: err.message || 'Failed to save profile' });
            setSaving(false);
        }
    };

    if (loading) return <div className="spinner" style={{ marginTop: '30vh' }}></div>;

    const photoPreviewUrl = form.profilePhoto || null;

    return (
        <div className="profile-page container">
            <div className="page-header" style={{ textAlign: 'center' }}>
                <h1>My Profile</h1>
                <p>Complete your profile to stand out to recruiters</p>
            </div>

            <div className="profile-form-card glass-card animate-fade-in">
                {message.text && (
                    <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                        {message.text}
                    </div>
                )}

                <form className="profile-form" onSubmit={handleSubmit}>
                    {/* Profile Photo */}
                    <div className="form-group" style={{ textAlign: 'center' }}>
                        <label>Profile Photo</label>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
                            <div
                                onClick={() => photoInputRef.current?.click()}
                                style={{
                                    width: '100px',
                                    height: '100px',
                                    borderRadius: '50%',
                                    background: photoPreviewUrl ? `url(${photoPreviewUrl}) center/cover` : 'var(--gradient-secondary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    border: '3px solid var(--border-color)',
                                    transition: 'border-color var(--transition-fast)',
                                    overflow: 'hidden',
                                }}
                            >
                                {!photoPreviewUrl && <HiPhotograph style={{ fontSize: '2rem', color: 'white' }} />}
                            </div>
                            <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                onClick={() => photoInputRef.current?.click()}
                                disabled={photoUploading}
                            >
                                {photoUploading ? 'Uploading...' : photoPreviewUrl ? <><HiCheck /> Change Photo</> : <><HiCloudUpload /> Upload Photo</>}
                            </button>
                            <input
                                ref={photoInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoUpload}
                                style={{ display: 'none' }}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>About Me</label>
                        <textarea
                            name="about"
                            value={form.about}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="Tell recruiters about yourself..."
                            rows={4}
                        />
                    </div>

                    <div className="profile-form-row">
                        <div className="form-group">
                            <label>College Name</label>
                            <input type="text" name="collegeName" value={form.collegeName} onChange={handleChange} className="form-input" placeholder="Your College" />
                        </div>
                        <div className="form-group">
                            <label>Degree</label>
                            <input type="text" name="degree" value={form.degree} onChange={handleChange} className="form-input" placeholder="B.Tech, BCA, etc." />
                        </div>
                    </div>

                    <div className="profile-form-row">
                        <div className="form-group">
                            <label>Graduation Year</label>
                            <input type="number" name="graduationYear" value={form.graduationYear} onChange={handleChange} className="form-input" placeholder="2025" />
                        </div>
                        <div className="form-group">
                            <label>CGPA</label>
                            <input type="number" name="cgpa" value={form.cgpa} onChange={handleChange} className="form-input" placeholder="8.5" step="0.1" min="0" max="10" />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Skills (comma separated)</label>
                        <input type="text" name="skills" value={form.skills} onChange={handleChange} className="form-input" placeholder="Java, React, Python, SQL..." />
                    </div>

                    {/* Resume File Upload */}
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
                                {resumeUploading ? 'Uploading...' : <><HiCloudUpload /> {form.resumeUrl ? 'Change Resume' : 'Upload Resume'}</>}
                            </button>
                            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)' }}>
                                {resumeFile ? <><HiCheck style={{ color: 'var(--success)' }} /> {resumeFile.name}</> :
                                    !form.resumeUrl && 'No resume uploaded yet'}
                            </span>
                            <input
                                ref={resumeInputRef}
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={handleResumeUpload}
                                style={{ display: 'none' }}
                            />
                        </div>
                        {form.resumeUrl && (
                            <div style={{
                                marginTop: '0.75rem',
                                padding: '0.75rem 1rem',
                                background: 'var(--bg-glass)',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--border-color)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '0.75rem',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ fontSize: '1.5rem' }}>📄</span>
                                    <div>
                                        <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
                                            {resumeFile?.name || 'Resume'}
                                        </div>
                                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
                                            <HiCheck style={{ color: 'var(--success)', verticalAlign: 'middle' }} /> Uploaded successfully
                                        </div>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    className="btn btn-primary btn-sm"
                                    style={{ flex: 'none' }}
                                    onClick={() => setShowResume(true)}
                                >
                                    <HiEye /> View Resume
                                </button>
                            </div>
                        )}
                    </div>

                    <button type="submit" className="btn btn-primary btn-lg" disabled={saving} style={{ width: '100%', marginTop: 'var(--space-sm)' }}>
                        {saving ? 'Saving...' : 'Save Profile'}
                    </button>

                    <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => setShowDeleteModal(true)}
                            disabled={deleting}
                            style={{ width: '100%' }}
                        >
                            <HiTrash /> {deleting ? 'Deleting Account...' : 'Delete Account'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Resume Viewer Modal */}
            {showResume && form.resumeUrl && (
                <PdfViewer
                    url={form.resumeUrl}
                    onClose={() => setShowResume(false)}
                    title={resumeFile?.name || 'Resume'}
                />
            )}
            {/* Delete Confirm Modal */}
            {showDeleteModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 9999
                }} onClick={() => setShowDeleteModal(false)}>
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: '#ffffff', borderRadius: '20px',
                            padding: '2.5rem 2rem 2rem', maxWidth: '400px', width: '90%',
                            boxShadow: '0 25px 80px rgba(0, 0, 0, 0.4)',
                            textAlign: 'center', position: 'relative'
                        }}
                    >
                        {/* Warning Icon */}
                        <div style={{
                            width: '64px', height: '64px', borderRadius: '50%',
                            background: '#fef2f2', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 1.25rem',
                            border: '2px solid #fecaca'
                        }}>
                            <HiExclamation style={{ fontSize: '32px', color: '#dc2626' }} />
                        </div>

                        {/* Title */}
                        <h3 style={{
                            margin: '0 0 0.5rem', fontSize: '1.3rem',
                            fontWeight: 700, color: '#111827', letterSpacing: '-0.01em'
                        }}>
                            Delete Your Account?
                        </h3>

                        {/* Description */}
                        <p style={{
                            margin: '0 0 2rem', color: '#6b7280',
                            fontSize: '0.875rem', lineHeight: '1.6'
                        }}>
                            This will permanently delete your profile, resume, and all job applications.
                            This action <span style={{ color: '#dc2626', fontWeight: 600 }}>cannot be undone</span>.
                        </p>

                        {/* Buttons */}
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                style={{
                                    flex: 1, padding: '0.8rem 1rem', borderRadius: '12px',
                                    border: '1.5px solid #e5e7eb', background: '#f9fafb',
                                    color: '#374151', cursor: 'pointer', fontSize: '0.9rem',
                                    fontWeight: 600, transition: 'all 0.2s ease',
                                    letterSpacing: '0.01em'
                                }}
                                onMouseEnter={(e) => { e.target.style.background = '#f3f4f6'; e.target.style.borderColor = '#d1d5db'; }}
                                onMouseLeave={(e) => { e.target.style.background = '#f9fafb'; e.target.style.borderColor = '#e5e7eb'; }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                style={{
                                    flex: 1, padding: '0.8rem 1rem', borderRadius: '12px',
                                    border: 'none', background: '#dc2626',
                                    color: '#ffffff', cursor: 'pointer', fontSize: '0.9rem',
                                    fontWeight: 600, transition: 'all 0.2s ease',
                                    letterSpacing: '0.01em',
                                    boxShadow: '0 4px 14px rgba(220, 38, 38, 0.35)'
                                }}
                                onMouseEnter={(e) => { e.target.style.background = '#b91c1c'; }}
                                onMouseLeave={(e) => { e.target.style.background = '#dc2626'; }}
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SeekerProfile;

import { useNavigate } from 'react-router-dom';
import { HiLocationMarker, HiClock, HiAcademicCap } from 'react-icons/hi';
import './JobCard.css';

const JobCard = ({ job }) => {
    const navigate = useNavigate();

    const formatJobType = (type) => {
        switch (type) {
            case 'FULL_TIME': return 'Full Time';
            case 'PART_TIME': return 'Part Time';
            case 'INTERNSHIP': return 'Internship';
            default: return type;
        }
    };

    const formatSalary = (min, max) => {
        if (!min && !max) return null;
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

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now - date;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays}d ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
        return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    };

    const salary = formatSalary(job.salaryMin, job.salaryMax);

    return (
        <div className="job-card glass-card" onClick={() => navigate(`/jobs/${job.id}`)}>
            <div className="job-card-header">
                <div className="job-card-company">
                    <div className="job-card-logo">
                        {job.companyName?.charAt(0)?.toUpperCase() || 'C'}
                    </div>
                    <div className="job-card-company-info">
                        <h3>{job.title}</h3>
                        <span>{job.companyName}</span>
                    </div>
                </div>
                <span className="badge badge-job-type">{formatJobType(job.jobType)}</span>
            </div>

            <p className="job-card-title">{job.description}</p>

            <div className="job-card-meta">
                {job.location && (
                    <span className="job-card-meta-item">
                        <HiLocationMarker /> {job.location}
                    </span>
                )}
                <span className="job-card-meta-item">
                    <HiClock /> {job.experienceRequired === 0 ? 'Fresher' : '0-1 Yr'}
                </span>
                {job.graduationYear && (
                    <span className="job-card-meta-item">
                        <HiAcademicCap /> {job.graduationYear} Batch
                    </span>
                )}
                {job.categoryName && (
                    <span className="job-card-meta-item">
                        {job.categoryName}
                    </span>
                )}
            </div>

            <div className="job-card-footer">
                <span className="job-card-salary">{salary || 'Not Disclosed'}</span>
                <span className="job-card-date">{formatDate(job.postedAt)}</span>
            </div>
        </div>
    );
};

export default JobCard;

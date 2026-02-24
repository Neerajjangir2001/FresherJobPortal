import { useState, useEffect, useMemo } from 'react';
import { HiSearch } from 'react-icons/hi';
import { jobsAPI } from '../api/api';
import JobCard from '../components/JobCard';
import './Jobs.css';

const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('ALL');
    const [locationFilter, setLocationFilter] = useState('ALL');

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await jobsAPI.getAll();
                setJobs(response.data);
            } catch {
                setJobs([]);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    const locations = useMemo(() => {
        const locs = [...new Set(jobs.map((j) => j.location).filter(Boolean))];
        return locs.sort();
    }, [jobs]);

    const filteredJobs = useMemo(() => {
        return jobs.filter((job) => {
            const matchSearch =
                !search ||
                job.title?.toLowerCase().includes(search.toLowerCase()) ||
                job.companyName?.toLowerCase().includes(search.toLowerCase()) ||
                job.skillsRequired?.toLowerCase().includes(search.toLowerCase());
            const matchType = typeFilter === 'ALL' || job.jobType === typeFilter;
            const matchLocation = locationFilter === 'ALL' || job.location === locationFilter;
            return matchSearch && matchType && matchLocation;
        });
    }, [jobs, search, typeFilter, locationFilter]);

    return (
        <div className="jobs-page container">
            <div className="page-header">
                <h1>Browse Jobs</h1>
                <p>Find the perfect fresher opportunity for you</p>
            </div>

            <div className="jobs-search-bar">
                <div className="search-input" style={{ position: 'relative', flex: 1 }}>
                    <HiSearch
                        style={{
                            position: 'absolute',
                            left: '14px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'var(--text-muted)',
                            fontSize: '1.1rem',
                        }}
                    />
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Search by title, company, or skills..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ paddingLeft: '2.5rem', width: '100%' }}
                    />
                </div>

                <select className="form-input" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                    <option value="ALL">All Types</option>
                    <option value="FULL_TIME">Full Time</option>
                    <option value="PART_TIME">Part Time</option>
                    <option value="INTERNSHIP">Internship</option>
                </select>

                <select className="form-input" value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
                    <option value="ALL">All Locations</option>
                    {locations.map((loc) => (
                        <option key={loc} value={loc}>{loc}</option>
                    ))}
                </select>
            </div>

            <div className="jobs-count">
                {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} found
            </div>

            {loading ? (
                <div className="spinner"></div>
            ) : filteredJobs.length > 0 ? (
                <div className="jobs-grid">
                    {filteredJobs.map((job) => (
                        <JobCard key={job.id} job={job} />
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <p>No jobs match your search. Try adjusting your filters.</p>
                </div>
            )}
        </div>
    );
};

export default Jobs;

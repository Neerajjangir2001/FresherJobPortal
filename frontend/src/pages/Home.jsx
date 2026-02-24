import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { HiLightningBolt, HiShieldCheck, HiUserGroup, HiTrendingUp, HiViewGrid } from 'react-icons/hi';
import { jobsAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';
import JobCard from '../components/JobCard';
import './Home.css';

const Home = () => {
    const { user, isAuthenticated } = useAuth();
    const [featuredJobs, setFeaturedJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    const dashboardLink = useMemo(() => {
        if (!user) return '/';
        switch (user.role) {
            case 'JOB_SEEKER': return '/seeker/dashboard';
            case 'RECRUITER': return '/recruiter/dashboard';
            case 'ADMIN': return '/admin/dashboard';
            default: return '/';
        }
    }, [user]);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await jobsAPI.getAll();
                setFeaturedJobs(response.data.slice(0, 6));
            } catch {
                // API might not be running — show empty
                setFeaturedJobs([]);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    return (
        <div className="home">
            {/* Hero Section */}
            <section className="home-hero">
                <div className="container hero-content animate-fade-in">
                    <div className="hero-badge">
                        <span className="dot"></span>
                        Exclusively for Freshers &amp; Graduates
                    </div>
                    <h1>
                        Launch Your Career<br />
                        with <span className="gradient-text">FresherJobs</span>
                    </h1>
                    <p>
                        Discover thousands of entry-level opportunities, internships, and fresher roles
                        from top companies. Your first job is just a click away.
                    </p>
                    <div className="hero-actions">
                        <Link to="/jobs" className="btn btn-primary btn-lg">
                            <HiLightningBolt /> Browse Jobs
                        </Link>
                        {isAuthenticated ? (
                            <Link to={dashboardLink} className="btn btn-secondary btn-lg">
                                <HiViewGrid /> Go to Dashboard
                            </Link>
                        ) : (
                            <Link to="/register" className="btn btn-secondary btn-lg">
                                Create Account
                            </Link>
                        )}
                    </div>
                    <div className="hero-stats">
                        <div className="hero-stat">
                            <div className="number">5,000+</div>
                            <div className="label">Active Jobs</div>
                        </div>
                        <div className="hero-stat">
                            <div className="number">1,200+</div>
                            <div className="label">Companies</div>
                        </div>
                        <div className="hero-stat">
                            <div className="number">50K+</div>
                            <div className="label">Freshers Hired</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Jobs */}
            <section className="home-featured container">
                <div className="section-header">
                    <h2> Latest Opportunities</h2>
                    <Link to="/jobs" className="btn btn-secondary btn-sm">View All</Link>
                </div>
                {loading ? (
                    <div className="spinner"></div>
                ) : featuredJobs.length > 0 ? (
                    <div className="jobs-grid">
                        {featuredJobs.map((job) => (
                            <JobCard key={job.id} job={job} />
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <p>No jobs available right now. Check back soon!</p>
                    </div>
                )}
            </section>

            {/* Features */}
            <section className="home-features">
                <div className="container">
                    <div className="section-header" style={{ justifyContent: 'center' }}>
                        <h2>Why Choose FresherJobs?</h2>
                    </div>
                    <div className="features-grid">
                        <div className="feature-card glass-card animate-slide-up delay-1">
                            <div className="feature-icon"><HiShieldCheck /></div>
                            <h3>Verified Companies</h3>
                            <p>Every recruiter is verified by our admin team before they can post jobs.</p>
                        </div>
                        <div className="feature-card glass-card animate-slide-up delay-2">
                            <div className="feature-icon" style={{ background: 'var(--gradient-success)' }}><HiUserGroup /></div>
                            <h3>Fresher-Only Jobs</h3>
                            <p>All jobs require 0-1 years of experience. No more irrelevant listings.</p>
                        </div>
                        <div className="feature-card glass-card animate-slide-up delay-3">
                            <div className="feature-icon" style={{ background: 'var(--gradient-warning)' }}><HiTrendingUp /></div>
                            <h3>Track Applications</h3>
                            <p>Real-time status updates on your applications — Applied, Shortlisted, Hired.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="home-cta container">
                <div className="cta-card glass-card">
                    {isAuthenticated ? (
                        <>
                            <h2>Explore New Opportunities</h2>
                            <p>Browse the latest job openings and find the perfect role for you.</p>
                            <Link to="/jobs" className="btn btn-primary btn-lg">
                                <HiLightningBolt /> Browse All Jobs
                            </Link>
                        </>
                    ) : (
                        <>
                            <h2>Ready to Start Your Journey?</h2>
                            <p>Join thousands of freshers who found their dream job through FresherJobs.</p>
                            <Link to="/register" className="btn btn-primary btn-lg">
                                Sign Up Free — It&apos;s Quick
                            </Link>
                        </>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;

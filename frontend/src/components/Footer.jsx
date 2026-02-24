import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-inner">
                <div className="footer-brand">
                    <h3>FresherJobs</h3>
                    <p>India&apos;s #1 job portal exclusively for freshers and recent graduates. Launch your career with the right opportunity.</p>
                </div>

                <div className="footer-col">
                    <h4>For Seekers</h4>
                    <Link to="/jobs">Browse Jobs</Link>
                    <Link to="/register">Create Account</Link>
                    <Link to="/seeker/profile">Build Profile</Link>
                </div>

                <div className="footer-col">
                    <h4>For Recruiters</h4>
                    <Link to="/register">Post a Job</Link>
                    <Link to="/recruiter/dashboard">Manage Jobs</Link>
                </div>

                <div className="footer-col">
                    <h4>Company</h4>
                    <Link to="/">About Us</Link>
                    <Link to="/">Contact</Link>
                    <Link to="/">Privacy Policy</Link>
                </div>
            </div>

            <div className="footer-bottom">
                <span>&copy; {new Date().getFullYear()} FresherJobs. All rights reserved.</span>
                <span>Built with ❤️ for freshers</span>
            </div>
        </footer>
    );
};

export default Footer;

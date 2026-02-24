import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { HiBriefcase, HiMenu, HiX } from 'react-icons/hi';
import './Navbar.css';

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
        setMenuOpen(false);
    };

    const closeMenu = () => setMenuOpen(false);

    const getDashboardLink = () => {
        if (!user) return '/';
        switch (user.role) {
            case 'JOB_SEEKER': return '/seeker/dashboard';
            case 'RECRUITER': return '/recruiter/dashboard';
            case 'ADMIN': return '/admin/dashboard';
            default: return '/';
        }
    };

    const getRoleName = (role) => {
        switch (role) {
            case 'JOB_SEEKER': return 'Job Seeker';
            case 'RECRUITER': return 'Recruiter';
            case 'ADMIN': return 'Admin';
            default: return role;
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-inner">
                <Link to="/" className="navbar-logo">
                    <div className="logo-icon"><HiBriefcase /></div>
                    <span>FresherJobs</span>
                </Link>

                <button
                    className="navbar-toggle"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    {menuOpen ? <HiX /> : <HiMenu />}
                </button>

                <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
                    <NavLink to="/" end onClick={closeMenu}>Home</NavLink>
                    <NavLink to="/jobs" onClick={closeMenu}>Browse Jobs</NavLink>

                    {isAuthenticated ? (
                        <>
                            <NavLink to={getDashboardLink()} onClick={closeMenu}>Dashboard</NavLink>

                            {user?.role === 'JOB_SEEKER' && (
                                <NavLink to="/seeker/profile" onClick={closeMenu}>Profile</NavLink>
                            )}

                            {user?.role === 'RECRUITER' && (
                                <NavLink to="/recruiter/create-job" onClick={closeMenu}>Post Job</NavLink>
                            )}

                            <div className="navbar-user">
                                <div className="navbar-user-info">
                                    <span className="navbar-user-name">{user?.name}</span>
                                    <span className="navbar-user-role">{getRoleName(user?.role)}</span>
                                </div>
                                <div className="navbar-avatar">
                                    {user?.name?.charAt(0)?.toUpperCase()}
                                </div>
                                <button className="nav-logout-btn" onClick={handleLogout}>
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <NavLink to="/login" onClick={closeMenu}>Login</NavLink>
                            <Link to="/register" className="btn btn-primary btn-sm" onClick={closeMenu}>
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

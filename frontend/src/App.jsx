import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';

// Seeker pages
import SeekerDashboard from './pages/seeker/SeekerDashboard';
import SeekerProfile from './pages/seeker/SeekerProfile';

// Recruiter pages
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import CreateJob from './pages/recruiter/CreateJob';
import Applicants from './pages/recruiter/Applicants';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-layout">
          <Navbar />
          <main className="app-main">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/jobs/:id" element={<JobDetail />} />

              {/* Job Seeker Routes */}
              <Route path="/seeker/dashboard" element={
                <ProtectedRoute roles={['JOB_SEEKER']}>
                  <SeekerDashboard />
                </ProtectedRoute>
              } />
              <Route path="/seeker/profile" element={
                <ProtectedRoute roles={['JOB_SEEKER']}>
                  <SeekerProfile />
                </ProtectedRoute>
              } />

              {/* Recruiter Routes */}
              <Route path="/recruiter/dashboard" element={
                <ProtectedRoute roles={['RECRUITER']}>
                  <RecruiterDashboard />
                </ProtectedRoute>
              } />
              <Route path="/recruiter/create-job" element={
                <ProtectedRoute roles={['RECRUITER']}>
                  <CreateJob />
                </ProtectedRoute>
              } />
              <Route path="/recruiter/edit-job/:id" element={
                <ProtectedRoute roles={['RECRUITER']}>
                  <CreateJob />
                </ProtectedRoute>
              } />
              <Route path="/recruiter/jobs/:jobId/applicants" element={
                <ProtectedRoute roles={['RECRUITER']}>
                  <Applicants />
                </ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute roles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

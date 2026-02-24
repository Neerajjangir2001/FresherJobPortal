# 🎯 FresherJobs — Fresher-Only Job Portal

A full-stack job portal built exclusively for **fresh graduates and entry-level candidates**. The platform connects job seekers with recruiters, featuring admin verification, email notifications, and cloud-based file uploads.

---

## ✨ Features

### 👤 Three User Roles

| Role | Capabilities |
|------|-------------|
| **Job Seeker** | Browse & search jobs, apply with resume, track application status, manage profile |
| **Recruiter** | Post jobs (Full-time / Part-time / Internship), review applicants, shortlist / reject / hire candidates |
| **Admin** | Approve/reject recruiter registrations, manage all jobs, platform oversight |

### 🔑 Core Functionality

- **JWT Authentication** — Secure login & registration with role-based access control
- **Job Management** — Create, update, delete, and browse job listings
- **Application Tracking** — Apply to jobs and track status (Applied → Shortlisted → Hired / Rejected)
- **Recruiter Verification** — Admin approval required before recruiter-posted jobs become visible
- **Email Notifications** — HTML email templates for welcome, application submitted, and status updates
- **File Uploads** — Resume & profile photo uploads via Cloudinary
- **PDF Viewer** — In-app resume preview for recruiters
- **Responsive UI** — Modern, mobile-friendly design

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|-----------|---------|
| Java 17 | Language |
| Spring Boot 3.2 | Framework |
| Spring Security | Authentication & Authorization |
| Spring Data JPA | Database ORM |
| PostgreSQL | Database |
| JWT (jjwt 0.11.5) | Token-based auth |
| Spring Mail | Email notifications |
| Cloudinary | File storage (resume & photos) |
| Lombok | Boilerplate reduction |

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 19 | UI framework |
| Vite 7 | Build tool & dev server |
| React Router 7 | Client-side routing |
| Axios | HTTP client |
| React Icons | Icon library |
| React PDF | Resume viewer |

---

## 📁 Project Structure

```
fresher_job_portal/
├── fresherjobs/                    # Backend (Spring Boot)
│   └── src/main/java/com/fresherjobs/
│       ├── config/                 # Security, CORS, Cloudinary config
│       ├── controller/             # REST API endpoints
│       │   ├── AuthController      # Login & Register
│       │   ├── JobController       # CRUD for jobs
│       │   ├── ApplicationController # Apply & manage applications
│       │   ├── ProfileController   # User profile management
│       │   ├── FileController      # File upload endpoints
│       │   ├── AdminController     # Admin operations
│       │   └── UserController      # User account management
│       ├── entity/                 # JPA entities
│       │   ├── User, Job, Application, Company
│       │   ├── FresherProfile, JobCategory, Notification
│       ├── service/                # Business logic
│       ├── repository/             # Data access layer
│       ├── dto/                    # Request/Response DTOs
│       ├── enums/                  # Role, JobType, AppStatus
│       ├── security/               # JWT filter & utilities
│       └── exception/              # Custom exception handling
│
├── frontend/                       # Frontend (React + Vite)
│   └── src/
│       ├── api/api.js              # Axios API client
│       ├── context/AuthContext.jsx  # Auth state management
│       ├── components/             # Reusable UI components
│       │   ├── Navbar, Footer, JobCard
│       │   ├── PdfViewer, ProtectedRoute
│       └── pages/
│           ├── Home, Jobs, JobDetail
│           ├── Login, Register
│           ├── seeker/             # Seeker dashboard & profile
│           ├── recruiter/          # Job posting & applicant review
│           └── admin/              # Admin dashboard
```

---

## 🚀 Getting Started

### Prerequisites

- **Java 17+**
- **Node.js 18+**
- **PostgreSQL**
- **Gmail App Password** (for email notifications)
- **Cloudinary Account** (for file uploads)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/fresher_job_portal.git
cd fresher_job_portal
```

### 2. Backend Setup

Create a `.env` file in the `fresherjobs/` directory:

```env
DB_URL=jdbc:postgresql://localhost:5432/fresherjobs
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
JWT_SECRET=your_jwt_secret_key
EMAIL=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
FRONTED_URL=http://localhost:5173
```

Run the backend:

```bash
cd fresherjobs
./mvnw spring-boot:run
```

The backend starts on **http://localhost:8080**.

### 3. Frontend Setup

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

Install dependencies and start:

```bash
cd frontend
npm install
npm run dev
```

The frontend starts on **http://localhost:5173**.

---

## 📡 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Login & get JWT token | No |
| GET | `/api/jobs` | List all visible jobs | No |
| GET | `/api/jobs/{id}` | Get job details | No |
| POST | `/api/jobs` | Create a job | Recruiter |
| PUT | `/api/jobs/{id}` | Update a job | Recruiter |
| DELETE | `/api/jobs/{id}` | Delete a job | Recruiter |
| GET | `/api/jobs/my` | Get recruiter's own jobs | Recruiter |
| POST | `/api/applications/{jobId}/apply` | Apply to a job | Seeker |
| GET | `/api/applications/my` | Get my applications | Seeker |
| GET | `/api/applications/job/{jobId}` | Get applicants for a job | Recruiter |
| PUT | `/api/applications/{id}/status` | Update application status | Recruiter |
| GET | `/api/profile/my` | Get my profile | Yes |
| POST | `/api/profile` | Create/update profile | Yes |
| POST | `/api/files/upload/resume` | Upload resume | Seeker |
| POST | `/api/files/upload/photo` | Upload profile photo | Yes |
| GET | `/api/admin/recruiters` | List all recruiters | Admin |
| PUT | `/api/admin/recruiters/{id}/approve` | Approve a recruiter | Admin |
| GET | `/api/admin/jobs` | List all jobs (admin) | Admin |
| DELETE | `/api/admin/jobs/{id}` | Remove a job | Admin |
| DELETE | `/api/users/me` | Delete own account | Yes |

---

## 📧 Email Notifications

The platform sends HTML email notifications for:

- **Welcome Email** — On successful registration
- **New Application** — Notifies recruiter when someone applies
- **Application Submitted** — Confirmation to the job seeker
- **Status Update** — When application status changes (shortlisted / rejected / hired)

---

## 📄 License

This project is for educational and portfolio purposes.

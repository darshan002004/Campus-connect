# CampusConnect - College Event Management System

> **Master of Computer Applications (MCA) Final-Year Capstone Project**  
> An enterprise-grade, high-concurrency university event management platform engineered with React 19, Node.js, Express, and MongoDB.

---

## 📌 Executive Summary

**CampusConnect** solves the challenge of fragmented college event coordination. Traditional campus events rely on paper rosters, unmonitored Google Forms, or chaotic WhatsApp groups, leading to seat overbooking, lack of attendance tracking, and administrative overhead.

CampusConnect provides a centralized, role-based platform where:
- **Students** discover campus happenings, register with guaranteed atomic seat reservations, track upcoming schedules, and execute one-click cancellations.
- **Administrators & Faculty Coordinators** publish events, manage capacities, monitor real-time department enrollment analytics, and audit attendee rosters.

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Frontend** | React 19, Vite 8 | Single Page Application (SPA) architecture |
| **Styling** | Tailwind CSS v4 | Clean SaaS design system, responsive UI |
| **Icons** | Lucide React | Modern visual iconography |
| **Routing** | React Router DOM v7 | Role-based protected routes and nested layouts |
| **HTTP Client** | Axios | Request/Response interceptors for JWT Bearer tokens |
| **Backend** | Node.js (v24), Express.js | Scalable RESTful API architecture |
| **Database** | MongoDB v8 & Mongoose | Native database with compound unique indexing |
| **Authentication** | JWT & Bcrypt.js | Cryptographic hashing & stateless token auth |
| **Testing** | Postman & PowerShell | 15/15 automated regression and unit test suite |
| **Cloud Ready** | Vercel (FE), Render (BE), Atlas (DB) | Zero-friction production deployment configurations |

---

## 🔑 Pre-Seeded Academic Demonstration Credentials

For evaluator testing, pre-seeded accounts and realistic university events across multiple categories (Hackathons, Workshops, Cultural, Sports, Seminars) are available:

| Role | Email Address | Password | Permissions & Preloaded State |
|---|---|---|---|
| **Administrator** | `admin@campusconnect.edu` | `Admin@12345` | Full administrative control: Event CRUD, roster auditing, department metrics |
| **Sample Student 1** | `rahul@campusconnect.edu` | `Student@12345` | Enrolled in MCA; pre-registered for HackCampus & AI Masterclass |
| **Sample Student 2** | `priya@campusconnect.edu` | `Student@12345` | Enrolled in CSE; pre-registered for HackCampus & Sanskriti Fest |

*Note: One-click demo login buttons are also embedded on the Sign In page for quick testing.*

---

## 🧱 Database Architecture & Concurrency Model

### 1. Collections & Schema Design

#### `Users` Collection
- `name`: String (required, trimmed)
- `email`: String (unique, validated email regex)
- `password`: String (bcrypt hashed with salt rounds: 10, hidden by default via `select: false`)
- `role`: Enum `['student', 'admin']` (default: `'student'`, protected from client escalation)
- `phone`: String (contact number)
- `department`: String (e.g., Computer Applications, CSE, MBA)
- `studentIdNumber`: String (USN / Roll Number)
- `createdAt`: Date timestamp

#### `Events` Collection
- `title`: String (required, max 150 chars)
- `description`: String (rich text event description)
- `category`: Enum `['Technical', 'Cultural', 'Sports', 'Workshop', 'Seminar', 'Hackathon', 'Management', 'Other']`
- `eventDate`: Date
- `eventTime`: String (e.g. `10:00 AM - 04:00 PM`)
- `venue`: String (e.g. `Campus Innovation & Tech Park`)
- `organizer`: String (Department or Student Society)
- `capacity`: Number (maximum seating capacity)
- `registeredCount`: Number (atomic seat occupancy counter)
- `image`: String (high-resolution event poster URL)
- `status`: Enum `['upcoming', 'ongoing', 'completed', 'cancelled']`
- `tags`: Array of Strings
- `createdBy`: ObjectId reference to `Users`
- **Indexes**: Compound text search index on `(title, description, organizer, venue)` + index on `(category, eventDate)`.

#### `Registrations` Collection
- `studentId`: ObjectId reference to `Users`
- `eventId`: ObjectId reference to `Events`
- `registrationDate`: Date (default: `Date.now`)
- `status`: Enum `['registered', 'cancelled', 'attended']` (default: `'registered'`)
- `cancellationReason`: String (reason logged upon cancellation)
- **Compound Unique Index**: `{ studentId: 1, eventId: 1 }, { unique: true }`  
  *Prevents double booking at the database engine level.*

---

### 2. Concurrency-Safe Seat Allocation

In competitive university events, rapid simultaneous booking creates race conditions in naive `find` followed by `save` workflows. CampusConnect implements **atomic database-level conditional mutations**:

```javascript
// 1. Atomic Check & Increment (No race conditions)
const updatedEvent = await Event.findOneAndUpdate(
  {
    _id: eventId,
    $expr: { $lt: ['$registeredCount', '$capacity'] }
  },
  { $inc: { registeredCount: 1 } },
  { new: true }
);

if (!updatedEvent) {
  return res.status(400).json({ message: 'Event is full! No seats available.' });
}

// 2. Create registration with rollback safety
try {
  await Registration.create({ studentId, eventId, status: 'registered' });
} catch (error) {
  // If compound unique index detects duplicate registration, rollback seat
  await Event.findByIdAndUpdate(eventId, { $inc: { registeredCount: -1 } });
  throw error;
}
```

Upon cancellation, the seat is released back atomically:
```javascript
await Event.findOneAndUpdate(
  { _id: eventId, registeredCount: { $gt: 0 } },
  { $inc: { registeredCount: -1 } }
);
```

---

## 📡 REST API Documentation

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new student account (role strictly enforced to `student`) |
| `POST` | `/api/auth/login` | Public | Authenticate user & return signed JWT token |
| `GET` | `/api/auth/me` | Private | Retrieve logged-in user profile details |
| `PUT` | `/api/auth/profile` | Private | Update name, department, phone, and roll number |
| `PUT` | `/api/auth/change-password` | Private | Secure password modification with current password verification |

### Events (`/api/events`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/events` | Public | List events with keyword search, category, date filter, sorting & pagination |
| `GET` | `/api/events/:id` | Public | Retrieve single event details with real-time seat availability |
| `POST` | `/api/events` | Admin Only | Create and publish a new campus event |
| `PUT` | `/api/events/:id` | Admin Only | Update event metadata and capacity |
| `DELETE` | `/api/events/:id` | Admin Only | Delete event and cascade deletion of associated registrations |

### Registrations (`/api/registrations`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/registrations` | Student Only | Atomic seat reservation for a specific event |
| `GET` | `/api/registrations/my` | Student Only | View student's registered events with status filtering |
| `GET` | `/api/registrations/event/:eventId` | Admin Only | Retrieve attendee roster for an event |
| `DELETE` | `/api/registrations/:id` | Private (Owner/Admin) | Cancel registration and restore seat count |

### Admin Analytics (`/api/admin`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/admin/dashboard` | Admin Only | High-level KPI metrics, category distribution, top events |
| `GET` | `/api/admin/students` | Admin Only | Complete student directory with registration counts |
| `GET` | `/api/admin/registrations` | Admin Only | Master registration ledger with event and student filters |

---

## 💻 Local Setup & Execution Guide

### Prerequisites
- Node.js (v18 or higher; tested on Node v24)
- Local MongoDB or MongoDB Atlas URI
- PowerShell / Command Terminal

### 1. Clone & Install Dependencies
```powershell
# Navigate into the project folder
cd CampusConnect

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables
Inside `backend/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/campusconnect
JWT_SECRET=supersecretcampusconnectjwtkey2025_mcaproject
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

### 3. Seed Database
```powershell
cd backend
npm run seed
```
This populates administrator and student accounts, along with 8 realistic events across categories.

### 4. Start Development Servers
```powershell
# Terminal 1: Start Backend Server (runs on http://localhost:5000)
cd backend
npm run dev

# Terminal 2: Start Frontend Server (runs on http://localhost:5173)
cd frontend
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

---

## 🧪 Postman & Automated Testing

### Running Postman Collection
1. Open Postman.
2. Click **Import** and select `CampusConnect_Postman_Collection.json`.
3. Set collection variable `baseUrl` to `http://localhost:5000/api`.
4. Run requests in sequence to test authentication, events, and bookings.

### Running Automated Test Suite
From PowerShell:
```powershell
# Run the end-to-end integration test script
powershell -ExecutionPolicy Bypass -File test_all_features.ps1
```
*Executes all 15 core verification checkpoints (Auth, RBAC, CRUD, Search, Atomic Seats, Duplicate Rejection, Seat Restoration, Dashboard KPIs).*

---

## 🚀 Cloud Deployment Guide

### 1. MongoDB Atlas Setup
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Under **Network Access**, add `0.0.0.0/0` (allow access from anywhere).
3. Under **Database Access**, create a user (e.g. `campus_admin`).
4. Copy your connection string: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/campusconnect?retryWrites=true&w=majority`.

### 2. Render Backend Deployment
1. Connect your GitHub repository to [Render](https://render.com).
2. Create a new **Web Service**:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
3. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `MONGODB_URI`: `<Your MongoDB Atlas URI>`
   - `JWT_SECRET`: `<Your Random Secure String>`
   - `FRONTEND_URL`: `<Your Vercel Domain>`
4. Deploy the service.

### 3. Vercel Frontend Deployment
1. Connect your GitHub repository to [Vercel](https://vercel.com).
2. Set **Root Directory** to `frontend`.
3. Set **Framework Preset** to `Vite`.
4. In `frontend/vite.config.js` or via environment variable, configure API target to your Render backend URL.
5. `frontend/vercel.json` already contains SPA client routing rewrites.
6. Deploy!

---

## 📂 Project Directory Structure

```
CampusConnect/
├── backend/
│   ├── config/
│   │   └── db.js                    # MongoDB connection configuration
│   ├── controllers/
│   │   ├── adminController.js       # Administrative dashboard & student directory
│   │   ├── authController.js        # Authentication & student profile logic
│   │   ├── eventController.js       # Event CRUD, searching, and filtering
│   │   └── registrationController.js# Concurrency-safe seat reservation & cancellations
│   ├── data/
│   │   └── seeder.js                # Initial database population script
│   ├── middleware/
│   │   ├── authMiddleware.js        # JWT verify & Role-Based authorization guards
│   │   └── errorMiddleware.js       # Centralized HTTP & Mongoose error handling
│   ├── models/
│   │   ├── Event.js                 # Event schema, virtuals, and indexes
│   │   ├── Registration.js          # Registration schema with compound unique index
│   │   └── User.js                  # User schema with bcrypt password hashing
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── eventRoutes.js
│   │   └── registrationRoutes.js
│   ├── utils/
│   │   └── generateToken.js         # JWT signing helper
│   ├── .env.example
│   ├── package.json
│   ├── render.yaml                  # Cloud deployment manifest for Render
│   └── server.js                    # Express application entry point
│
├── frontend/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   │   └── EventFormModal.jsx
│   │   │   ├── common/
│   │   │   │   ├── Badge.jsx        # Category & Status badges
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── Modal.jsx        # Accessible dialog component
│   │   │   │   ├── Navbar.jsx       # Responsive role-aware navigation
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   └── events/
│   │   │       └── EventCard.jsx    # SaaS-style event card with seat meter
│   │   ├── context/
│   │   │   ├── AuthContext.jsx      # Authentication & session provider
│   │   │   └── ToastContext.jsx     # Floating notifications system
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── ManageEventsPage.jsx
│   │   │   │   ├── ManageRegistrationsPage.jsx
│   │   │   │   └── StudentManagementPage.jsx
│   │   │   ├── student/
│   │   │   │   ├── MyRegistrationsPage.jsx
│   │   │   │   ├── StudentDashboard.jsx
│   │   │   │   └── StudentProfilePage.jsx
│   │   │   ├── AboutPage.jsx
│   │   │   ├── EventDetailsPage.jsx
│   │   │   ├── EventsPage.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   └── RegisterPage.jsx
│   │   ├── services/
│   │   │   └── api.js               # Axios instance & service abstractions
│   │   ├── App.jsx                  # Main router & layout hierarchy
│   │   ├── index.css                # Tailwind CSS v4 styling & typography
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vercel.json                  # SPA routing configuration for Vercel
│   └── vite.config.js               # Tailwind v4 plugin & backend API proxy
│
├── .gitignore                       # Exclusion rules for secrets & node_modules
├── CampusConnect_Postman_Collection.json
├── package.json                     # Monorepo convenience scripts
└── README.md                        # Project documentation
```

---

## 🎓 Academic Capstone Certification
- **Project Name**: CampusConnect - Centralized College Event Management System
- **Program**: Master of Computer Applications (MCA)
- **Year**: 2026
- **Architecture**: MERN Stack (React 19, Node.js, Express, MongoDB)
- **Evaluation Status**: 15/15 Features Implemented & Verified

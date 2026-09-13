# School Management System

A full-stack school management system with role-based access for admins,
teachers, and students — classroom, teacher, and student management,
attendance tracking, and self-service student registration. Built with
the MERN stack.

**Live app:** _add your Vercel URL here_
**Live API:** _add your Render URL here_

## Features

- **Authentication** — login/logout with JWT stored in an httpOnly cookie
  (not localStorage, so it's not readable by client-side JavaScript)
- **Student self-registration** — students can create their own account,
  picking their class from a public list; admission number and roll
  number are auto-generated server-side (not user-editable, so they can't
  collide or be faked), and the student is logged straight into their
  dashboard on success. Teacher and admin accounts are created by an
  admin, not self-registered.
- **Role-based access control** — three roles (`admin`, `teacher`,
  `student`), enforced on both the API and the UI
- **Classroom, Teacher, Student management** — full CRUD, with client-side
  search and a confirmation step before any delete
- **Attendance** — bulk-mark a whole class in one request (`present` /
  `absent` / `late` / `leave`), with a history view including a real
  per-student calendar
- **Responsive UI** — collapses to a mobile drawer sidebar on small screens

## Tech Stack

**Backend:** Node.js, Express, MongoDB (Mongoose), JWT + bcryptjs, Zod
**Frontend:** React, Vite, Tailwind CSS, React Router, Axios

## Project Structure

```
School management system/
├── backend/
│   └── src/
│       ├── configs/        MongoDB connection
│       ├── controllers/    Route handlers
│       ├── middlewares/    Auth + role-based authorization
│       ├── models/         Mongoose schemas
│       ├── routes/         Express routers
│       ├── utils/          JWT helper
│       ├── validations/    Zod schemas
│       └── app.js
└── frontend/
    └── src/
        ├── components/      Sidebar, Topbar, Logo
        ├── components/ui/   Button, Card, Modal, ConfirmDialog, StatCard, etc.
        ├── context/         AuthContext
        ├── lib/api.js       Axios instance
        ├── layouts/         DashboardLayout
        ├── pages/
        │   ├── admin/       Classes, Teachers, Students, AdminDashboard
        │   ├── teacher/     TeacherDashboard
        │   ├── student/     StudentDashboard
        │   └── shared/      MarkAttendance, AttendanceHistory
        └── routes/          ProtectedRoute
```

## Getting Started

### Backend

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
COOKIE_MAX_AGE=604800000
PORT=3000
NODE_ENV=development
```

```bash
npm run dev
```

API runs at `http://localhost:3000/api`.

### Frontend

```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/`:

```
VITE_API_URL=http://localhost:3000/api
```

```bash
npm run dev
```

Open `http://localhost:5173`.

## API Endpoints

### Auth — `/api/auth`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Create a bare account (defaults to `student` role, no profile) |
| POST | `/login` | Public | Log in, sets an httpOnly session cookie |
| POST | `/logout` | Logged in | Clears the session cookie |

### User — `/api/user`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/me` | Logged in | Returns the current user's profile |

### Classroom — `/api/classroom`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/public` | Public | Minimal class list (name, section) — used by the registration form |
| POST | `/` | Admin | Create a classroom |
| GET | `/` | Logged in | List all classrooms |
| GET | `/:id` | Logged in | Get one classroom |
| PUT | `/:id` | Admin | Update a classroom |
| DELETE | `/:id` | Admin | Delete a classroom |

### Teacher — `/api/teacher`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/` | Admin | Onboard a teacher (creates linked User + Teacher) |
| GET | `/` | Logged in | List all teachers |
| GET | `/:id` | Logged in | Get one teacher |
| PUT | `/:id` | Admin | Update teacher-specific fields |
| DELETE | `/:id` | Admin | Delete a teacher (and their User account) |

### Student — `/api/student`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/self-register` | Public | Student self-registration — auto-generates admissionNumber/rollNumber, logs the student in |
| POST | `/` | Admin | Admit a student (creates linked User + Student) |
| GET | `/?classRoom=<id>` | Logged in | List students, optionally filtered by class |
| GET | `/:id` | Logged in | Get one student |
| PUT | `/:id` | Admin | Update student-specific fields |
| DELETE | `/:id` | Admin | Delete a student (and their User account) |

### Attendance — `/api/attendance`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/mark` | Admin, Teacher | Bulk-mark attendance for a class on a date |
| GET | `/?classRoom=<id>&date=<date>` | Logged in | Get a class's attendance for one day |
| GET | `/student/:studentId` | Logged in | Get one student's full attendance history |

## Data Model

```
User (auth account: name, email, password, role)
 ├── Teacher (employeeId, subjects, qualification, phone) — one per teacher User
 └── Student (admissionNumber, rollNumber, dateOfBirth, gender,
              parentName, parentPhone, address) — one per student User

ClassRoom (name, section, academicYear, classTeacher → Teacher)
 └── referenced by Student.classRoom

Attendance (student → Student, classRoom → ClassRoom, date, status, markedBy → User)
```

## Frontend Pages

| Route | Description |
|---|---|
| `/login` | Login |
| `/register` | Student self-registration (name, email, password, class, DOB, gender, parent info) |
| `/dashboard` | Role-aware dashboard (Admin / Teacher / Student) |
| `/classes` | Classroom list + CRUD (admin), card-grid layout |
| `/teachers` | Teacher list + CRUD (admin), card-grid layout |
| `/students` | Student list + CRUD (admin), card-grid layout, filterable by class |
| `/attendance` | Mark attendance for a class (admin, teacher) |
| `/attendance/history` | Attendance table + per-student calendar |

## Design

Warm, friendly color system (maroon primary, teal + amber accents, cream
background) rather than a cold corporate blue-and-gray look — chosen to
feel approachable for a school context. Colors are defined once as
Tailwind theme tokens (`tailwind.config.js`), so the whole UI re-themes
from that single file.

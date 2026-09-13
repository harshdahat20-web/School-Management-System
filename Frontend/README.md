# School Management System — Frontend

A React frontend for a school management system, with role-based
dashboards for admins, teachers, and students. Connects to a
[Node/Express/MongoDB backend](#) _(add your backend repo link here)_.

**Live app:** _add your deployed URL here once live_

## Features

- **Role-based UI** — separate dashboards and navigation for Admin,
  Teacher, and Student, each seeing only what their role can act on
- **Auth** — login/register with a persistent session (restored on page
  refresh via the backend's httpOnly cookie, not client-stored tokens)
- **Classroom, Teacher, Student management** — full CRUD with client-side
  search and a confirmation step before any delete
- **Attendance** — bulk-mark a class's attendance for a date (4 states:
  present / absent / late / leave), plus a history view with a real
  per-student calendar (month navigation included)
- **Responsive** — collapses to a mobile drawer sidebar below the `lg`
  breakpoint

## Tech Stack

- **React** + **Vite**
- **Tailwind CSS**
- **React Router** for client-side routing and role-gated routes
- **Axios** for API calls
- **Lucide** for icons

## Pages

| Route | Description |
|---|---|
| `/login`, `/register` | Auth |
| `/dashboard` | Role-aware dashboard (Admin / Teacher / Student) |
| `/classes` | Classroom list + CRUD (admin) |
| `/teachers` | Teacher list + CRUD (admin) |
| `/students` | Student list + CRUD (admin), filterable by class |
| `/attendance` | Mark attendance for a class (admin, teacher) |
| `/attendance/history` | Attendance table + per-student calendar |

## Getting Started

```bash
npm install
```

Create a `.env` file in the project root:

```
VITE_API_URL=http://localhost:3000/api
```

(Point this at your deployed backend URL in production.)

Run the dev server:

```bash
npm run dev
```

Open `http://localhost:5173`.

## Project Structure

```
src/
  components/       Sidebar, Topbar, Logo
  components/ui/    Reusable primitives (Button, Card, Modal, ConfirmDialog,
                     Field, StatusPicker, StatusBadge, StatCard)
  context/          AuthContext (session state, login/register/logout)
  lib/api.js        Axios instance (baseURL + credentials)
  layouts/          DashboardLayout (sidebar + topbar shell)
  pages/
    admin/          Classes, Teachers, Students, AdminDashboard
    teacher/        TeacherDashboard
    student/        StudentDashboard
    shared/         MarkAttendance, AttendanceHistory
  routes/           ProtectedRoute (auth + role gating)
```

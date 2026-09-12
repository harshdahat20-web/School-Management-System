# SchoolMS — Frontend

React + Vite + Tailwind CSS frontend for the School Management System.
Fully wired to the real backend (no more mock data) — auth, classrooms,
teachers, students, and attendance all hit real endpoints.

## Setup

```bash
npm install
cp .env.example .env   # adjust VITE_API_URL if your backend isn't on :3000
npm run dev
```

Open http://localhost:5173. Your backend must be running, and its CORS
`origin` must match whatever port Vite actually starts on (default 5173 —
if that port is busy Vite will pick another one, and you'll need to update
the backend's `cors({ origin: ... })` to match).

## What's wired up

- **Auth** (`src/context/AuthContext.jsx`) — login/register/logout hit
  `/api/auth/*`, session restored via `GET /api/user/me`. Register does not
  log you in (backend sets no cookie there) — it sends you to `/login` after.
- **Classes** (`src/pages/admin/Classes.jsx`) — full CRUD (`/api/classroom`),
  including edit and a delete-confirmation dialog, plus a local search box.
- **Teachers** (`src/pages/admin/Teachers.jsx`) — full CRUD (`/api/teacher`).
  Editing only sends `employeeId`/`subjects`/`qualification`/`phone` —
  name/email/password live on `User`, and `PUT /api/teacher/:id` has no way
  to touch those, so the edit form hides them and shows a note instead.
- **Students** (`src/pages/admin/Students.jsx`) — full CRUD (`/api/student`),
  same name/email/password limitation as Teachers on edit, plus class-based
  filtering and a local search box.
- **Mark Attendance** (`src/pages/shared/MarkAttendance.jsx`) — loads a
  class roster, pre-fills any already-marked statuses for that date, and
  bulk-submits via `POST /api/attendance/mark`.
- **Attendance History** (`src/pages/shared/AttendanceHistory.jsx`) —
  class+date table plus a real per-student calendar (month navigation
  included) via `GET /api/attendance` and `GET /api/attendance/student/:id`.
- **Dashboards** — Admin dashboard shows real totals (students, teachers,
  classes) and today's attendance % (aggregated client-side across
  classes, since there's no single endpoint for it). Teacher/Student
  dashboards find "my classes" / "my profile" by matching the logged-in
  user's id against the full teacher/student lists — see the ⚠️ note below.
- **Delete confirmation** — every delete (`Classes`/`Teachers`/`Students`)
  goes through `components/ui/ConfirmDialog.jsx` first.
- **Search** — each list page has its own local, client-side search box
  filtering the rows already fetched. There's no backend search endpoint,
  so this isn't a server query — it just filters what's on screen.

Reports and Settings pages were removed — there's no backend support for
either yet (no reports endpoint, no profile-update/change-password route),
so they were dead ends with no real functionality behind them.

## ⚠️ Known backend gaps to be aware of

- **No `GET /api/teacher/me` or `GET /api/student/me`.** To find "my own"
  teacher/student record, the frontend fetches the *entire* list and finds
  the entry where `entry.user._id === currentUser.id`. Works fine at
  school scale, but a dedicated `/me` endpoint on each would be cleaner
  and cheaper.
- **Attendance history table can't show student names directly** — the
  backend's `GET /api/attendance` only populates `student` with
  `rollNumber` (`.populate("student", "rollNumber")`), and `Student`
  itself has no `name` field (it lives on `User`, one hop further).
  The frontend works around this by separately fetching the class roster
  and matching by student id. If you want names to come straight from
  the attendance endpoint, you'd need a nested populate on the backend.
- **Double-check your `GET /api/student` populate for `classRoom`.**
  It should select `"name section academicYear"` (your `ClassRoom` model's
  class-label field is `name`) — if any populate call selects `"class"`
  instead, `classRoom.name` will come back `undefined` even though
  `classRoom` itself is populated.
- **No `PATCH /api/user/me` or change-password route yet** —
  `src/pages/shared/Settings.jsx` still has placeholder forms; add these
  endpoints on the backend before wiring them up.
- **No dashboard-stats endpoint** — the admin dashboard's stat cards are
  computed client-side from the list endpoints (and, for attendance %, by
  querying every class for today's date individually). Fine for a small
  school; would get slow with a lot of classes. A dedicated
  `GET /api/dashboard/stats` would scale better.

## Structure

```
src/
  components/       shared UI (Sidebar, Topbar, Logo)
  components/ui/     primitives (Button, Card, Modal, Field, StatusPicker, etc.)
  context/          AuthContext (real API calls)
  lib/api.js        axios instance (baseURL + credentials)
  layouts/          DashboardLayout (sidebar + topbar shell, mobile drawer)
  pages/
    admin/          Classes, Teachers, Students, AdminDashboard
    teacher/        TeacherDashboard
    student/        StudentDashboard
    shared/         MarkAttendance, AttendanceHistory, Reports, Settings
    Login.jsx, Register.jsx, Dashboard.jsx (role router)
  routes/           ProtectedRoute (handles the initial auth-check loading state)
```

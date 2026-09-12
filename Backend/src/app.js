const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.route");
const userRoutes = require("./routes/user.route");
const classroomRoutes = require("./routes/classroom.route");
const teacherRoutes = require("./routes/teacher.route");
const studentRoutes = require("./routes/student.route");
const attendanceRoutes = require("./routes/attendance.route");

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "school-management-system-phi-murex.vercel.app",
    ],
    credentials: true,
  }),
);
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/classroom", classroomRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/attendance", attendanceRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is up and running",
  });
});

module.exports = app;

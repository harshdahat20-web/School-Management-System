import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Card from "../../components/ui/Card.jsx";
import { Select, Input } from "../../components/ui/Field.jsx";
import StatusBadge from "../../components/ui/StatusBadge.jsx";
import api from "../../lib/api.js";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const dotColor = {
  present: "bg-emerald-500",
  absent: "bg-red-500",
  late: "bg-amber-500",
  leave: "bg-ink-400",
};

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function buildMonthWeeks(year, monthIndex0) {
  const startWeekday = new Date(year, monthIndex0, 1).getDay();
  const daysInMonth = new Date(year, monthIndex0 + 1, 0).getDate();
  const cells = [
    ...Array(startWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

export default function AttendanceHistory() {
  const [classOptions, setClassOptions] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [date, setDate] = useState(todayISO());
  const [roster, setRoster] = useState([]);
  const [dayRows, setDayRows] = useState([]);
  const [loadingDay, setLoadingDay] = useState(false);
  const [error, setError] = useState("");

  const [selectedStudent, setSelectedStudent] = useState("");
  const [studentHistory, setStudentHistory] = useState([]);
  const [viewMonth, setViewMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  useEffect(() => {
    api
      .get("/classroom")
      .then((res) => {
        setClassOptions(res.data.data);
        if (res.data.data.length > 0) setSelectedClass(res.data.data[0]._id);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedClass) return;
    api
      .get("/student", { params: { classRoom: selectedClass } })
      .then((res) => {
        setRoster(res.data.data);
        if (res.data.data.length > 0) setSelectedStudent(res.data.data[0]._id);
        else setSelectedStudent("");
      })
      .catch(() => {});
  }, [selectedClass]);

  useEffect(() => {
    if (!selectedClass || !date) return;
    setLoadingDay(true);
    setError("");
    api
      .get("/attendance", { params: { classRoom: selectedClass, date } })
      .then((res) => setDayRows(res.data.data))
      .catch((err) =>
        setError(err.response?.data?.message || "Could not load attendance."),
      )
      .finally(() => setLoadingDay(false));
  }, [selectedClass, date]);

  useEffect(() => {
    if (!selectedStudent) {
      setStudentHistory([]);
      return;
    }
    api
      .get(`/attendance/student/${selectedStudent}`)
      .then((res) => setStudentHistory(res.data.data))
      .catch(() => setStudentHistory([]));
  }, [selectedStudent]);

  const rosterById = useMemo(() => {
    const map = {};
    roster.forEach((s) => (map[s._id] = s));
    return map;
  }, [roster]);

  const statusByDay = useMemo(() => {
    const map = {};
    studentHistory.forEach((rec) => {
      const d = new Date(rec.date);
      if (
        d.getFullYear() === viewMonth.getFullYear() &&
        d.getMonth() === viewMonth.getMonth()
      ) {
        map[d.getDate()] = rec.status;
      }
    });
    return map;
  }, [studentHistory, viewMonth]);

  const weeks = useMemo(
    () => buildMonthWeeks(viewMonth.getFullYear(), viewMonth.getMonth()),
    [viewMonth],
  );

  const activeStudent = rosterById[selectedStudent];
  const activeClass = classOptions.find((c) => c._id === selectedClass);

  function shiftMonth(delta) {
    setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() + delta, 1));
  }

  return (
    <div className="max-w-6xl">
      <h1 className="text-xl font-bold text-ink-900">Attendance History</h1>
      <p className="text-sm text-ink-500 mt-1">View past attendance records.</p>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5 mt-6">
        <Card className="overflow-hidden">
          <div className="p-5 border-b border-ink-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">
                Select Class
              </label>
              <Select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                {classOptions.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} {c.section}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">
                Date
              </label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="px-5 pt-4 text-sm text-red-500">{error}</p>}

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-ink-500 border-b border-ink-100">
                  <th className="font-medium px-5 py-3">Roll No</th>
                  <th className="font-medium px-5 py-3">Name</th>
                  <th className="font-medium px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {loadingDay ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-5 py-6 text-center text-ink-500"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : dayRows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-5 py-6 text-center text-ink-500"
                    >
                      No attendance marked for this date yet.
                    </td>
                  </tr>
                ) : (
                  dayRows.map((row) => {
                    const studentId = row.student?._id || row.student;
                    return (
                      <tr
                        key={row._id}
                        className="border-b border-ink-100 last:border-0"
                      >
                        <td className="px-5 py-3 text-ink-700">
                          {row.student?.rollNumber ??
                            rosterById[studentId]?.rollNumber}
                        </td>
                        <td className="px-5 py-3 text-ink-900 font-medium">
                          {rosterById[studentId]?.user?.name || "—"}
                        </td>
                        <td className="px-5 py-3">
                          <StatusBadge status={row.status} />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-5">
          <div className="mb-4">
            <label className="block text-sm font-medium text-ink-700 mb-1.5">
              Student
            </label>
            <Select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
            >
              {roster.length === 0 && <option value="">No students</option>}
              {roster.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.user?.name}
                </option>
              ))}
            </Select>
          </div>

          {activeStudent && (
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-white text-sm font-semibold shrink-0">
                {(activeStudent.user?.name || "?")
                  .split(" ")
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join("")}
              </div>
              <div>
                <p className="text-sm font-semibold text-ink-900">
                  {activeStudent.user?.name}
                </p>
                <p className="text-xs text-ink-500">
                  {activeClass
                    ? `${activeClass.name} ${activeClass.section}`
                    : ""}{" "}
                  • Roll No. {activeStudent.rollNumber}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mb-3">
            <button
              className="text-ink-500 hover:text-ink-900"
              onClick={() => shiftMonth(-1)}
            >
              <ChevronLeft size={18} />
            </button>
            <p className="text-sm font-semibold text-ink-900">
              {MONTH_NAMES[viewMonth.getMonth()]} {viewMonth.getFullYear()}
            </p>
            <button
              className="text-ink-500 hover:text-ink-900"
              onClick={() => shiftMonth(1)}
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs text-ink-500 mb-1">
            {DAYS.map((d) => (
              <div key={d} className="py-1">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {weeks.flat().map((day, i) => {
              const status = day ? statusByDay[day] : null;
              return (
                <div
                  key={i}
                  className={`aspect-square flex flex-col items-center justify-center rounded-lg text-xs relative ${
                    day ? "text-ink-700" : ""
                  }`}
                >
                  {day && (
                    <>
                      <span>{day}</span>
                      {status && (
                        <span
                          className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${dotColor[status]}`}
                        />
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-ink-100 text-xs text-ink-500">
            <Legend color="bg-emerald-500" label="Present" />
            <Legend color="bg-red-500" label="Absent" />
            <Legend color="bg-amber-500" label="Late" />
            <Legend color="bg-ink-400" label="Leave" />
          </div>
        </Card>
      </div>
    </div>
  );
}

function Legend({ color, label }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`w-2 h-2 rounded-full ${color}`} />
      {label}
    </div>
  );
}

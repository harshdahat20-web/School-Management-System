import { useEffect, useState } from "react";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import { Select, Input } from "../../components/ui/Field.jsx";
import StatusPicker from "../../components/ui/StatusPicker.jsx";
import api from "../../lib/api.js";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function MarkAttendance() {
  const [classOptions, setClassOptions] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [date, setDate] = useState(todayISO());
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    api
      .get("/classroom")
      .then((res) => {
        setClassOptions(res.data.data);
        if (res.data.data.length > 0) setSelectedClass(res.data.data[0]._id);
      })
      .catch(() => {});
  }, []);

  async function handleLoad() {
    if (!selectedClass || !date) return;
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const [studentsRes, attendanceRes] = await Promise.all([
        api.get("/student", { params: { classRoom: selectedClass } }),
        api.get("/attendance", { params: { classRoom: selectedClass, date } }),
      ]);

      const existingByStudent = {};
      attendanceRes.data.data.forEach((a) => {
        const studentId = a.student?._id || a.student;
        existingByStudent[studentId] = a.status;
      });

      setRows(
        studentsRes.data.data.map((s) => ({
          student: s._id,
          rollNumber: s.rollNumber,
          name: s.user?.name,
          status: existingByStudent[s._id] || "present",
        })),
      );
      setLoaded(true);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load students.");
    } finally {
      setLoading(false);
    }
  }

  function setStatus(student, status) {
    setRows((rs) =>
      rs.map((r) => (r.student === student ? { ...r, status } : r)),
    );
  }

  async function handleSubmit() {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await api.post("/attendance/mark", {
        classRoom: selectedClass,
        date,
        records: rows.map((r) => ({ student: r.student, status: r.status })),
      });
      setSuccess("Attendance submitted.");
    } catch (err) {
      setError(err.response?.data?.message || "Could not submit attendance.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-xl font-bold text-ink-900">Mark Attendance</h1>
      <p className="text-sm text-ink-500 mt-1">
        Mark attendance for your class.
      </p>

      <Card className="mt-6 p-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">
              Select Class
            </label>
            <Select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              {classOptions.length === 0 && (
                <option value="">No classes yet</option>
              )}
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
          <Button
            variant="ghost"
            onClick={handleLoad}
            disabled={loading || !selectedClass}
          >
            {loading ? "Loading..." : "Load Students"}
          </Button>
        </div>
      </Card>

      {error && (
        <p className="mt-4 text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
      {success && (
        <p className="mt-4 text-sm text-emerald-600 bg-emerald-50 rounded-lg px-3 py-2">
          {success}
        </p>
      )}

      {loaded && (
        <Card className="mt-4 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-ink-500 border-b border-ink-100">
                  <th className="font-medium px-5 py-3">Roll No</th>
                  <th className="font-medium px-5 py-3">Name</th>
                  <th className="font-medium px-5 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-5 py-6 text-center text-ink-500"
                    >
                      No students in this class.
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <tr
                      key={row.student}
                      className="border-b border-ink-100 last:border-0"
                    >
                      <td className="px-5 py-3 text-ink-700">
                        {row.rollNumber}
                      </td>
                      <td className="px-5 py-3 text-ink-900 font-medium">
                        {row.name}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex justify-end">
                          <StatusPicker
                            value={row.status}
                            onChange={(status) =>
                              setStatus(row.student, status)
                            }
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {rows.length > 0 && (
            <div className="flex justify-end px-5 py-4 border-t border-ink-100">
              <Button onClick={handleSubmit} disabled={saving}>
                {saving ? "Submitting..." : "Submit Attendance"}
              </Button>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

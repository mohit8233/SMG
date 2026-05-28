import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { studentAPI, courseAPI } from "../../services/api";

const Icon = ({ d, size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

function StatCard({ label, value, icon, color, sub }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "var(--bg-card)",
        border: `1px solid ${hovered ? color + "44" : "var(--border)"}`,
        borderRadius: "16px", padding: "24px",
        transition: "all 0.22s ease",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hovered ? `0 12px 40px ${color}18` : "none",
        cursor: "default",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "6px", fontWeight: 500 }}>{label}</p>
          <p style={{ fontSize: "32px", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1 }}>{value ?? "—"}</p>
          {sub && <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "6px" }}>{sub}</p>}
        </div>
        <div style={{
          width: 44, height: 44, borderRadius: "12px",
          background: color + "18", display: "flex", alignItems: "center", justifyContent: "center", color,
        }}>
          <Icon d={icon} size={22} />
        </div>
      </div>
    </div>
  );
}

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studRes, courseRes] = await Promise.allSettled([
          studentAPI.getAll(),
          courseAPI.getAll(),
        ]);
        if (studRes.status === "fulfilled") setStudents(studRes.value.data.students || []);
        if (courseRes.status === "fulfilled") setCourses(courseRes.value.data.courses || []);
      } catch (e) { /* fail silently */ }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  return (
    <div style={{ padding: "32px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Welcome Banner */}
      <div style={{
        background: "linear-gradient(135deg, #5B5EA6 0%, #8B5CF6 100%)",
        borderRadius: "20px", padding: "32px", color: "#fff",
        marginBottom: "32px", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", right: -20, top: -20, fontSize: "120px", opacity: 0.08 }}>🎓</div>
        <p style={{ fontSize: "14px", opacity: 0.8, marginBottom: "4px" }}>{greeting},</p>
        <h1 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "6px" }}>{user?.name || "Teacher"} 👋</h1>
        <p style={{ fontSize: "14px", opacity: 0.75 }}>
          Welcome to your Teacher Dashboard. Manage attendance, marks & assignments from here.
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "20px", marginBottom: "32px" }}>
        <StatCard label="Total Students" value={loading ? "..." : students.length} color="#5B5EA6"
          icon="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75"
          sub="Enrolled students" />
        <StatCard label="Total Courses" value={loading ? "..." : courses.length} color="#8B5CF6"
          icon="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"
          sub="Active courses" />
        <StatCard label="My Role" value="Teacher" color="#06b6d4"
          icon="M12 20h9 M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"
          sub="Your account role" />
        <StatCard label="Status" value="Active" color="#10b981"
          icon="M22 11.08V12a10 10 0 11-5.93-9.14 M22 4L12 14.01l-3-3"
          sub="Account status" />
      </div>

      {/* Quick Actions */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "24px", marginBottom: "24px" }}>
        <h2 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "16px" }}>Quick Actions</h2>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          {[
            { label: "Mark Attendance", icon: "M9 11l3 3L22 4", color: "#5B5EA6" },
            { label: "Add Marks",       icon: "M12 20h9 M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z", color: "#8B5CF6" },
            { label: "Assignments",     icon: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6", color: "#06b6d4" },
          ].map((a, i) => (
            <button key={i} style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "10px 18px", borderRadius: "10px",
              background: a.color + "12", border: `1px solid ${a.color}30`,
              color: a.color, fontSize: "14px", fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
            }}>
              <Icon d={a.icon} size={16} />
              {a.label}
            </button>
          ))}
        </div>
      </div>

      {/* Recent Students */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "24px" }}>
        <h2 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "16px" }}>Recent Students</h2>
        {loading ? (
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Loading...</p>
        ) : students.length === 0 ? (
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>No students found.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {students.slice(0, 5).map((s, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: "12px",
                padding: "12px 16px", borderRadius: "10px",
                background: "var(--bg-page)", border: "1px solid var(--border)",
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: "linear-gradient(135deg, #5B5EA6, #8B5CF6)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontWeight: 700, fontSize: "14px",
                }}>
                  {s.userId?.name?.[0]?.toUpperCase() || "S"}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>{s.userId?.name || "Student"}</p>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>{s.rollNumber} • {s.course} • Sem {s.semester}</p>
                </div>
                <span style={{ fontSize: "12px", fontWeight: 600, padding: "3px 10px", borderRadius: "20px", background: "#10b98118", color: "#10b981" }}>
                  {s.attendence ?? 0}% Attendance
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
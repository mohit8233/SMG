import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { studentAPI, teacherAPI, courseAPI, assignmentAPI } from "../../services/api";

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ students: 0, teachers: 0, courses: 0, assignments: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [s, t, c, a] = await Promise.all([
          studentAPI.getAll(), teacherAPI.getAll(),
          courseAPI.getAll(), assignmentAPI.getAll(),
        ]);
        setStats({
          students:    s.data.students?.length  || s.data.count  || 0,
          teachers:    t.data.teachers?.length  || t.data.count  || 0,
          courses:     c.data.courses?.length   || c.data.count  || 0,
          assignments: a.data.assignments?.length || a.data.count || 0,
        });
      } catch { /* backend data na aave to 0 rakhse */ }
      finally { setLoading(false); }
    })();
  }, []);

  const cards = [
    { label: "Total Students",  key: "students",    icon: "👥", color: "#5B5EA6", bg: "#EEF2FF", to: "/admin/students" },
    { label: "Total Teachers",  key: "teachers",    icon: "🧑‍🏫", color: "#7C3AED", bg: "#F3E8FF", to: "/admin/teachers" },
    { label: "Active Courses",  key: "courses",     icon: "📚", color: "#059669", bg: "#ECFDF5", to: "/admin/courses"  },
    { label: "Assignments",     key: "assignments", icon: "📝", color: "#D97706", bg: "#FEF3C7", to: null             },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1a1d2e" }}>Admin Dashboard</h1>
        <p style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>
          Welcome, {user?.name}! Here's your school overview.
        </p>
      </div>

      {/* Stat Cards — same style as image */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14, marginBottom: 24 }}>
        {cards.map((c) => (
          <div
            key={c.key}
            onClick={() => c.to && navigate(c.to)}
            style={{
              background: "#fff", borderRadius: 12,
              border: "1px solid #e4e7f0",
              padding: "20px 22px", cursor: c.to ? "pointer" : "default",
              transition: "box-shadow 0.18s, transform 0.18s",
            }}
            onMouseEnter={e => { if(c.to){ e.currentTarget.style.boxShadow="0 4px 18px rgba(0,0,0,0.08)"; e.currentTarget.style.transform="translateY(-2px)"; }}}
            onMouseLeave={e => { e.currentTarget.style.boxShadow="none"; e.currentTarget.style.transform="translateY(0)"; }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ fontSize: 12, color: "#9ca3af", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>
                  {c.label}
                </p>
                <p style={{ fontSize: 36, fontWeight: 700, color: "#1a1d2e", lineHeight: 1 }}>
                  {loading ? <span style={{ fontSize: 20, color: "#d1d5db" }}>—</span> : stats[c.key]}
                </p>
                {c.to && <p style={{ fontSize: 12, color: c.color, marginTop: 6, fontWeight: 500 }}>View all →</p>}
              </div>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: c.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                {c.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Nav */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e4e7f0", padding: "20px 22px" }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1a1d2e", marginBottom: 14 }}>Quick Navigation</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { label: "Manage Students",  desc: "Add, edit or remove students",  icon: "👥", to: "/admin/students",  color: "#5B5EA6", bg: "#EEF2FF" },
            { label: "Manage Teachers",  desc: "Add, edit or remove teachers",  icon: "🧑‍🏫", to: "/admin/teachers",  color: "#7C3AED", bg: "#F3E8FF" },
            { label: "Manage Courses",   desc: "Create and manage courses",     icon: "📚", to: "/admin/courses",   color: "#059669", bg: "#ECFDF5" },
          ].map((item) => (
            <div
              key={item.to}
              onClick={() => navigate(item.to)}
              style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "13px 16px", borderRadius: 10,
                background: item.bg, cursor: "pointer",
                border: `1px solid ${item.color}22`,
                transition: "opacity 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              <span style={{ fontSize: 22 }}>{item.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: item.color }}>{item.label}</div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>{item.desc}</div>
              </div>
              <span style={{ color: item.color, fontSize: 18 }}>→</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
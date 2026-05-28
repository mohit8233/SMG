import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// ── Icons (inline SVG, zero deps) ──────────────────────────────
const Icon = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((path, i) => <path key={i} d={path} />) : <path d={d} />}
  </svg>
);

const icons = {
  dashboard: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  students:  ["M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2","M9 7a4 4 0 100 8 4 4 0 000-8z","M23 21v-2a4 4 0 00-3-3.87","M16 3.13a4 4 0 010 7.75"],
  teachers:  ["M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2","M12 3a4 4 0 100 8 4 4 0 000-8z"],
  courses:   ["M4 19.5A2.5 2.5 0 016.5 17H20","M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"],
  attendance:"M9 11l3 3L22 4 M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11",
  marks:     ["M18 20V10","M12 20V4","M6 20v-6"],
  assignments:["M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8"],
  profile:   ["M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2","M12 3a4 4 0 100 8 4 4 0 000-8z"],
  logout:    ["M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4","M16 17l5-5-5-5","M21 12H9"],
  chevron:   "M9 18l6-6-6-6",
  menu:      "M3 12h18 M3 6h18 M3 18h18",
  close:     "M18 6L6 18 M6 6l12 12",
  shield:    ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"],
};

// ── Nav config per role ──────────────────────────────────────────
const navConfig = {
  admin: [
    { label: "Dashboard",   to: "/admin/dashboard",    icon: "dashboard" },
    { label: "Students",    to: "/admin/students",     icon: "students" },
    { label: "Teachers",    to: "/admin/teachers",     icon: "teachers" },
    { label: "Courses",     to: "/admin/courses",      icon: "courses" },

  ],
  teacher: [
    { label: "Dashboard",   to: "/teacher/dashboard", icon: "dashboard" },
    { label: "Attendance",  to: "/teacher/attendance",icon: "attendance" },
    { label: "Marks",       to: "/teacher/marks",     icon: "marks" },
    { label: "Assignments", to: "/teacher/assignments",icon:"assignments" },
  ],
  student: [
    { label: "Dashboard",   to: "/student/dashboard", icon: "dashboard" },
    { label: "Profile",     to: "/student/profile",   icon: "profile" },
    { label: "Attendance",  to: "/student/attendance",icon: "attendance" },
    { label: "Marks",       to: "/student/marks",     icon: "marks" },
    { label: "Assignments", to: "/student/assignments",icon:"assignments" },
  ],
};

const roleColors = {
  admin:   { pill: "#4f8ef7", bg: "rgba(79,142,247,0.12)"  },
  teacher: { pill: "#a78bfa", bg: "rgba(167,139,250,0.12)" },
  student: { pill: "#34d399", bg: "rgba(52,211,153,0.12)"  },
};

// ── Sidebar ──────────────────────────────────────────────────────
export default function Sidebar({ collapsed, setCollapsed }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const role = user?.role || "student";
  const navItems = navConfig[role] || navConfig.student;
  const rc = roleColors[role];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* Mobile overlay */}
      {!collapsed && (
        <div
          className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}

      <aside
        style={{
          width: collapsed ? "72px" : "260px",
          background: "var(--bg-surface)",
          borderRight: "1px solid var(--border)",
          transition: "width 0.28s cubic-bezier(.4,0,.2,1)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          position: "sticky",
          top: 0,
          flexShrink: 0,
          zIndex: 30,
        }}
      >
        {/* ── Logo / Brand ── */}
        <div style={{
          padding: collapsed ? "20px 0" : "20px 20px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          borderBottom: "1px solid var(--border)",
          minHeight: "68px",
          justifyContent: collapsed ? "center" : "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", overflow: "hidden" }}>
            {/* Logo mark */}
            <div style={{
              width: 36, height: 36, borderRadius: "10px", flexShrink: 0,
              background: "linear-gradient(135deg, #4f8ef7 0%, #a78bfa 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 20px rgba(79,142,247,0.35)",
            }}>
              <Icon d={icons.shield} size={18} />
            </div>

            {!collapsed && (
              <div style={{ overflow: "hidden" }}>
                <div style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: "17px",
                  letterSpacing: "-0.3px",
                  color: "var(--text-primary)",
                  whiteSpace: "nowrap",
                }}>
                  EduManage
                </div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", letterSpacing: "0.5px" }}>
                  School System
                </div>
              </div>
            )}
          </div>

          {/* Collapse toggle */}
          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              style={{
                background: "transparent", border: "none", cursor: "pointer",
                color: "var(--text-muted)", padding: "4px", borderRadius: "6px",
                display: "flex", alignItems: "center",
                flexShrink: 0,
              }}
            >
              <Icon d={icons.close} size={16} />
            </button>
          )}
        </div>

        {/* ── User Card ── */}
        <div style={{
          margin: "16px 12px",
          padding: collapsed ? "10px 0" : "12px 14px",
          borderRadius: "12px",
          background: rc.bg,
          border: `1px solid ${rc.pill}28`,
          display: "flex",
          alignItems: "center",
          gap: "12px",
          justifyContent: collapsed ? "center" : "flex-start",
          transition: "all 0.28s ease",
        }}>
          {/* Avatar */}
          <div style={{
            width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
            background: `linear-gradient(135deg, ${rc.pill}99, ${rc.pill}44)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "14px",
            color: rc.pill, border: `1.5px solid ${rc.pill}55`,
          }}>
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          {!collapsed && (
            <div style={{ overflow: "hidden", flex: 1 }}>
              <div style={{
                fontSize: "13px", fontWeight: 600,
                color: "var(--text-primary)", whiteSpace: "nowrap",
                overflow: "hidden", textOverflow: "ellipsis",
              }}>
                {user?.name || "User"}
              </div>
              <div style={{
                fontSize: "11px", marginTop: "2px",
                display: "inline-flex", alignItems: "center",
                padding: "1px 8px", borderRadius: "20px",
                background: `${rc.pill}22`, color: rc.pill,
                fontWeight: 600, letterSpacing: "0.4px", textTransform: "capitalize",
              }}>
                {role}
              </div>
            </div>
          )}
        </div>

        {/* ── Nav Label ── */}
        {!collapsed && (
          <div style={{
            padding: "4px 20px 8px",
            fontSize: "10px", fontWeight: 700,
            color: "var(--text-muted)", letterSpacing: "1.2px",
            textTransform: "uppercase",
          }}>
            Navigation
          </div>
        )}

        {/* ── Nav Items ── */}
        <nav style={{ flex: 1, padding: "0 10px", display: "flex", flexDirection: "column", gap: "2px" }}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              title={collapsed ? item.label : ""}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: collapsed ? "11px 0" : "11px 14px",
                justifyContent: collapsed ? "center" : "flex-start",
                borderRadius: "10px",
                textDecoration: "none",
                fontWeight: 500,
                fontSize: "14px",
                transition: "all 0.18s ease",
                color: isActive ? "#4f8ef7" : "var(--text-secondary)",
                background: isActive ? "var(--accent-glow)" : "transparent",
                border: isActive ? "1px solid rgba(79,142,247,0.2)" : "1px solid transparent",
                position: "relative",
              })}
            >
              {({ isActive }) => (
                <>
                  {/* Active left bar */}
                  {isActive && (
                    <span style={{
                      position: "absolute", left: 0, top: "20%", bottom: "20%",
                      width: "3px", borderRadius: "0 3px 3px 0",
                      background: "linear-gradient(180deg, #4f8ef7, #a78bfa)",
                    }} />
                  )}
                  <span style={{
                    color: isActive ? "#4f8ef7" : "var(--text-muted)",
                    transition: "color 0.18s",
                    flexShrink: 0,
                  }}>
                    <Icon d={icons[item.icon]} />
                  </span>
                  {!collapsed && (
                    <span style={{ whiteSpace: "nowrap" }}>{item.label}</span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* ── Bottom: Expand + Logout ── */}
        <div style={{
          padding: "12px 10px",
          borderTop: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}>
          {/* Expand button (when collapsed) */}
          {collapsed && (
            <button
              onClick={() => setCollapsed(false)}
              title="Expand sidebar"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: "100%", padding: "10px 0", borderRadius: "10px",
                background: "transparent", border: "1px solid var(--border)",
                color: "var(--text-muted)", cursor: "pointer",
                transition: "all 0.18s",
              }}
              onMouseEnter={e => { e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.borderColor = "var(--border-light)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.borderColor = "var(--border)"; }}
            >
              <Icon d={icons.menu} size={16} />
            </button>
          )}

          {/* Logout */}
          <button
            onClick={handleLogout}
            style={{
              display: "flex", alignItems: "center",
              gap: "12px", padding: collapsed ? "11px 0" : "11px 14px",
              justifyContent: collapsed ? "center" : "flex-start",
              borderRadius: "10px", width: "100%",
              background: "transparent", border: "none",
              color: "var(--text-muted)", cursor: "pointer",
              fontSize: "14px", fontWeight: 500,
              transition: "all 0.18s",
            }}
            title={collapsed ? "Logout" : ""}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(248,113,113,0.1)"; e.currentTarget.style.color = "#f87171"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-muted)"; }}
          >
            <Icon d={icons.logout} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
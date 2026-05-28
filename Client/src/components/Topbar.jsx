import { useAuth } from "../context/AuthContext";

const Icon = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const today = new Date().toLocaleDateString("en-IN", {
  weekday: "long", year: "numeric", month: "long", day: "numeric",
});

export default function Topbar({ collapsed, setCollapsed }) {
  const { user } = useAuth();

  return (
    <header style={{
      height: "68px",
      background: "var(--bg-surface)",
      borderBottom: "1px solid var(--border)",
      display: "flex",
      alignItems: "center",
      padding: "0 28px",
      gap: "16px",
      position: "sticky",
      top: 0,
      zIndex: 10,
    }}>
      {/* Hamburger (mobile / collapsed toggle) */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        style={{
          background: "transparent", border: "none", cursor: "pointer",
          color: "var(--text-muted)", padding: "6px", borderRadius: "8px",
          display: "flex", alignItems: "center",
        }}
      >
        <Icon d="M3 12h18 M3 6h18 M3 18h18" size={20} />
      </button>

      {/* Page date */}
      <span style={{ fontSize: "13px", color: "var(--text-muted)", flex: 1 }}>
        {today}
      </span>

      {/* Right: notification + avatar */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {/* Bell */}
        <button style={{
          position: "relative", background: "var(--bg-card)", border: "1px solid var(--border)",
          borderRadius: "10px", padding: "8px", cursor: "pointer",
          color: "var(--text-secondary)", display: "flex",
        }}>
          <Icon d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0" size={16} />
          <span style={{
            position: "absolute", top: 6, right: 6,
            width: 7, height: 7, borderRadius: "50%",
            background: "#4f8ef7", border: "1.5px solid var(--bg-surface)",
          }} />
        </button>

        {/* User pill */}
        <div style={{
          display: "flex", alignItems: "center", gap: "10px",
          background: "var(--bg-card)", border: "1px solid var(--border)",
          borderRadius: "10px", padding: "6px 12px 6px 8px",
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: "50%",
            background: "linear-gradient(135deg, #4f8ef7, #a78bfa)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "12px", fontWeight: 700, color: "#fff",
            fontFamily: "'Syne', sans-serif",
          }}>
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.2 }}>
              {user?.name || "User"}
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "capitalize" }}>
              {user?.role || "guest"}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
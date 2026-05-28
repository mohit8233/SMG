import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { authAPI } from "../../services/api";

const inp = {
  width: "100%", padding: "11px 14px", borderRadius: 8,
  border: "1.5px solid #e4e7f0", color: "#1a1d2e",
  fontSize: 14, outline: "none", background: "#fff", fontFamily: "inherit",
};

export default function Login() {
  const { login }   = useAuth();
  const navigate    = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError("Email ane password joiye!"); return; }
    setLoading(true); setError("");
    try {
      const res  = await authAPI.login({ email: form.email, password: form.password });
      const { token, user } = res.data;
      login(user, token);
      if (user.role === "admin")        navigate("/admin/dashboard");
      else if (user.role === "teacher") navigate("/teacher/dashboard");
      else                              navigate("/student/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "linear-gradient(135deg,#f0f2f8,#e8ebf5)" }}>
      {/* Left panel */}
      <div style={{ width: "45%", background: "linear-gradient(135deg,#5B5EA6,#8B5CF6)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40 }}>
        <div style={{ textAlign: "center", color: "#fff" }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>🏫</div>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 10 }}>Student MS</h1>
          <p style={{ fontSize: 15, opacity: 0.85, lineHeight: 1.6, maxWidth: 280 }}>Complete school management system for admins, teachers and students.</p>
          <div style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
            {["Role-based access control", "Real-time attendance tracking", "Marks & assignment management"].map((f, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, opacity: 0.9 }}>
                <span style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>✓</span>
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
        <div style={{ width: "100%", maxWidth: 400 }}>
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 26, fontWeight: 700, color: "#1a1d2e", marginBottom: 6 }}>Welcome back 👋</h2>
            <p style={{ fontSize: 14, color: "#6b7280" }}>Sign in to access your dashboard</p>
          </div>

          {error && (
            <div style={{ marginBottom: 16, padding: "11px 14px", borderRadius: 8, background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: 13 }}>⚠️ {error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Email Address</label>
              <input type="email" required value={form.email} onChange={e => { setForm({ ...form, email: e.target.value }); setError(""); }} placeholder="you@school.com"
                style={inp} onFocus={e => e.target.style.borderColor = "#5B5EA6"} onBlur={e => e.target.style.borderColor = "#e4e7f0"} />
            </div>
            <div style={{ marginBottom: 22 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Password</label>
              <input type="password" required value={form.password} onChange={e => { setForm({ ...form, password: e.target.value }); setError(""); }} placeholder="••••••••"
                style={inp} onFocus={e => e.target.style.borderColor = "#5B5EA6"} onBlur={e => e.target.style.borderColor = "#e4e7f0"} />
            </div>
            <button type="submit" disabled={loading} style={{ width: "100%", padding: 13, background: loading ? "#9ca3af" : "linear-gradient(135deg,#5B5EA6,#8B5CF6)", border: "none", borderRadius: 8, color: "#fff", fontSize: 15, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", boxShadow: loading ? "none" : "0 4px 15px rgba(91,94,166,0.35)" }}>
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: 18, fontSize: 13, color: "#6b7280" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "#5B5EA6", fontWeight: 600, textDecoration: "none" }}>Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

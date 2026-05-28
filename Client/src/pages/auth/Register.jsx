import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authAPI } from "../../services/api";
const inputStyle = {
  width: "100%", padding: "11px 14px", borderRadius: "8px",
  border: "1.5px solid #e4e7f0", color: "#1a1d2e",
  fontSize: "14px", outline: "none", background: "#fff",
  fontFamily: "inherit", transition: "border-color 0.15s",
};
export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: "", phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setError("Badha required fields bharjo!");
      return;
    }
    if (form.password.length < 6) {
      setError("Password ochama 6 characters nu hovu joiye!");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Password ane Confirm Password match nathi thata!");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await authAPI.register({
        name:     form.name.trim(),
        email:    form.email.trim().toLowerCase(),
        password: form.password,
        phone:    form.phone.trim(),
      });
      setSuccess("Account bani gayu! Hve login karo...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f6f7fb", fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Left panel */}
      <div className="left-panel" style={{ flex: 1, background: "#4A5FC1", color: "#fff", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "40px", textAlign: "center" }}>
        <div style={{ fontSize: "64px", marginBottom: "20px" }}>✏️</div>
        <h1 style={{ fontSize: "32px", fontWeight: 700, marginBottom: "10px" }}>Join Student MS</h1>
        <p style={{ fontSize: "16px", opacity: 0.9, maxWidth: "320px", lineHeight: 1.5 }}>
          Create your account and get started.
        </p>
        <div style={{ marginTop: "40px", display: "flex", flexDirection: "column", gap: "16px" }}>
          {[
            { role: "👨‍💼 Admin",   desc: "Manage students, teachers & courses" },
          ].map((r, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.15)", borderRadius: "12px", padding: "14px 20px", textAlign: "left", minWidth: "260px" }}>
              <div style={{ fontWeight: 600, fontSize: "15px" }}>{r.role}</div>
              <div style={{ fontSize: "13px", opacity: 0.85, marginTop: "2px" }}>{r.desc}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Right form */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <div style={{ width: "100%", maxWidth: "420px", background: "#fff", borderRadius: "16px", padding: "32px", boxShadow: "0 8px 32px rgba(0,0,0,0.06)" }}>
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#1a1d2e", marginBottom: "6px" }}>
              Create Account 🚀
            </h2>
            <p style={{ color: "#6b6f80", fontSize: "14px" }}>Fill in your details to get started</p>
          </div>
          {/* Error */}
          {error && (
            <div style={{ background: "#fff0f0", color: "#c0392b", padding: "10px 14px", borderRadius: "8px", fontSize: "13px", marginBottom: "14px", fontWeight: 500 }}>
              ⚠️ {error}
            </div>
          )}
          {/* Success */}
          {success && (
            <div style={{ background: "#f0fff4", color: "#27ae60", padding: "10px 14px", borderRadius: "8px", fontSize: "13px", marginBottom: "14px", fontWeight: 500 }}>
              ✅ {success}
            </div>
          )}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {/* Name */}
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#4a4d5e", marginBottom: "6px" }}>Full Name *</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="Enter your full name" style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#5B5EA6"}
                onBlur={e => e.target.style.borderColor = "#e4e7f0"} />
            </div>
            {/* Email */}
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#4a4d5e", marginBottom: "6px" }}>Email Address *</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="name@school.com" style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#5B5EA6"}
                onBlur={e => e.target.style.borderColor = "#e4e7f0"} />
            </div>
            {/* Phone */}
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#4a4d5e", marginBottom: "6px" }}>Phone Number</label>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="e.g. 9876543210" style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#5B5EA6"}
                onBlur={e => e.target.style.borderColor = "#e4e7f0"} />
            </div>
            {/* Password */}
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#4a4d5e", marginBottom: "6px" }}>Password * (min 6 characters)</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#5B5EA6"}
                onBlur={e => e.target.style.borderColor = "#e4e7f0"} />
            </div>
            {/* Confirm Password */}
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#4a4d5e", marginBottom: "6px" }}>Confirm Password *</label>
              <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} placeholder="••••••••" style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#5B5EA6"}
                onBlur={e => e.target.style.borderColor = form.confirmPassword && form.password !== form.confirmPassword ? "#ef4444" : "#e4e7f0"} />
              {form.confirmPassword && form.password !== form.confirmPassword && (
                <div style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>Passwords match nathi thata!</div>
              )}
            </div>
            {/* Submit */}
            <button type="submit" disabled={loading} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "none", background: "#5B5EA6", color: "#fff", fontSize: "15px", fontWeight: 600, cursor: "pointer", marginTop: "6px", opacity: loading ? 0.7 : 1 }}>
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                  <span style={{ width: "16px", height: "16px", border: "2px solid #fff", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }}></span>
                  Creating account...
                </span>
              ) : "Create Account →"}
            </button>
          </form>
          <p style={{ textAlign: "center", marginTop: "18px", fontSize: "13px", color: "#6b6f80" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#5B5EA6", fontWeight: 600, textDecoration: "none" }}>Sign in</Link>
          </p>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } @media (max-width: 768px) { .left-panel { display: none !important; } }`}</style>
    </div>
  );
}
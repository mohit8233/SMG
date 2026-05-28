import { useState, useEffect } from "react";
import { teacherAPI, authAPI } from "../../services/api";

const initForm = { name: "", email: "", password: "", phone: "", subject: "", experience: 0 };

export default function AdminTeachers() {
  const [teachers, setTeachers]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showModal, setShowModal]   = useState(false);
  const [form, setForm]             = useState(initForm);
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState("");
  const [search, setSearch]         = useState("");
  const [deleteId, setDeleteId]     = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  const fetchTeachers = async () => {
    try {
      const res = await teacherAPI.getAll();
      setTeachers(res.data.teachers || []);
    } catch { setTeachers([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchTeachers(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.subject) {
      setError("Badha required fields bharjo!"); return;
    }
    setSaving(true); setError("");
    try {
      // Step 1: User (teacher role) create karo
      const userRes = await authAPI.register({
        name: form.name,
        email: form.email,
        password: form.password,
        role: "teacher",
        phone: form.phone,
      });

      // Step 2: Register response mathi directly userId lo — no login needed!
      const userId = userRes.data.user._id;

      // Step 3: Teacher profile create karo
      await teacherAPI.create({
        userId,
        subject: form.subject,
        experience: Number(form.experience),
      });

      setShowModal(false);
      setForm(initForm);
      setSuccessMsg(`✅ Teacher "${form.name}" successfully add thaya!`);
      setTimeout(() => setSuccessMsg(""), 4000);
      fetchTeachers();
    } catch (err) {
      setError(err.response?.data?.message || "Error adding teacher");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try { await teacherAPI.delete(id); fetchTeachers(); }
    catch { alert("Delete karvamaa error"); }
    finally { setDeleteId(null); }
  };

  const filtered = teachers.filter(t =>
    t.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
    t.subject?.toLowerCase().includes(search.toLowerCase())
  );

  const inputStyle = {
    width: "100%", padding: "9px 12px", borderRadius: 8,
    border: "1.5px solid #e4e7f0", fontSize: 13,
    outline: "none", fontFamily: "inherit", color: "#1a1d2e", background: "#fff",
    boxSizing: "border-box",
  };

  return (
    <div>
      {/* Top bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1a1d2e" }}>Teachers</h1>
          <p style={{ fontSize: 13, color: "#6b7280" }}>{teachers.length} total teachers</p>
        </div>
        <button onClick={() => { setShowModal(true); setError(""); setForm(initForm); }} style={{
          padding: "9px 18px", background: "#7C3AED", color: "#fff",
          border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer",
        }}>
          + Add Teacher
        </button>
      </div>

      {/* Success Message */}
      {successMsg && (
        <div style={{ marginBottom: 16, padding: "12px 16px", borderRadius: 8, background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#15803d", fontSize: 14, fontWeight: 500 }}>
          {successMsg}
        </div>
      )}

      {/* Search */}
      <div style={{ marginBottom: 16 }}>
        <input
          placeholder="🔍  Search by name or subject..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ ...inputStyle, padding: "10px 14px", width: "100%", maxWidth: 380 }}
        />
      </div>

      {/* Table */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e4e7f0", overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1.5fr 1fr 100px", background: "#f8fafc", borderBottom: "1px solid #e4e7f0", padding: "11px 20px" }}>
          {["Name", "Email", "Subject", "Experience", "Actions"].map(h => (
            <span key={h} style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</span>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 40, color: "#9ca3af" }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: "#9ca3af" }}>
            {search ? "No teachers found" : "No teachers yet — Add your first teacher!"}
          </div>
        ) : filtered.map((t, i) => (
          <div key={t._id} style={{
            display: "grid", gridTemplateColumns: "2fr 1.5fr 1.5fr 1fr 100px",
            alignItems: "center", padding: "13px 20px",
            borderBottom: i < filtered.length - 1 ? "1px solid #f3f4f6" : "none",
            transition: "background 0.12s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#F3E8FF", color: "#7C3AED", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                {t.userId?.name?.charAt(0)?.toUpperCase() || "?"}
              </div>
              <span style={{ fontSize: 14, fontWeight: 500, color: "#1a1d2e" }}>{t.userId?.name || "—"}</span>
            </div>
            <span style={{ fontSize: 13, color: "#6b7280" }}>{t.userId?.email || "—"}</span>
            <span>
              <span style={{ background: "#F3E8FF", color: "#7C3AED", padding: "2px 10px", borderRadius: 20, fontWeight: 600, fontSize: 12 }}>{t.subject}</span>
            </span>
            <span style={{ fontSize: 13, color: "#6b7280" }}>{t.experience} yrs</span>
            <button onClick={() => setDeleteId(t._id)}
              style={{ padding: "5px 10px", fontSize: 12, borderRadius: 6, border: "1px solid #fecaca", background: "#fef2f2", color: "#dc2626", cursor: "pointer", fontWeight: 500 }}>
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 14, padding: 28, width: "100%", maxWidth: 460, maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700 }}>Add New Teacher</h3>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#9ca3af" }}>✕</button>
            </div>

            {error && <div style={{ marginBottom: 14, padding: "10px 14px", borderRadius: 8, background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: 13 }}>⚠️ {error}</div>}

            <form onSubmit={handleAdd}>
              {[
                { label: "Full Name *", name: "name",     type: "text",     placeholder: "Ankit Sharma" },
                { label: "Email *",     name: "email",    type: "email",    placeholder: "ankit@school.com" },
                { label: "Password *",  name: "password", type: "password", placeholder: "min 6 characters" },
                { label: "Phone",       name: "phone",    type: "tel",      placeholder: "9876543210" },
                { label: "Subject *",   name: "subject",  type: "text",     placeholder: "React / NodeJS" },
              ].map(f => (
                <div key={f.name} style={{ marginBottom: 12 }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 4 }}>{f.label}</label>
                  <input type={f.type} name={f.name} placeholder={f.placeholder}
                    value={form[f.name]} onChange={handleChange} style={inputStyle}
                    onFocus={e => e.target.style.borderColor = "#7C3AED"}
                    onBlur={e => e.target.style.borderColor = "#e4e7f0"} />
                </div>
              ))}
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Experience (years)</label>
                <input type="number" name="experience" min={0} max={40}
                  value={form.experience} onChange={handleChange} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "#7C3AED"}
                  onBlur={e => e.target.style.borderColor = "#e4e7f0"} />
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: "11px", borderRadius: 8, border: "1px solid #e4e7f0", background: "#fff", fontSize: 14, cursor: "pointer", fontWeight: 500 }}>Cancel</button>
                <button type="submit" disabled={saving} style={{ flex: 1, padding: "11px", borderRadius: 8, border: "none", background: saving ? "#9ca3af" : "#7C3AED", color: "#fff", fontSize: 14, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer" }}>
                  {saving ? "Adding..." : "Add Teacher"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 14, padding: 28, width: 340 }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>Delete Teacher?</h3>
            <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 20 }}>This will permanently delete this teacher and their account.</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setDeleteId(null)} style={{ flex: 1, padding: "10px", borderRadius: 8, border: "1px solid #e4e7f0", background: "#fff", cursor: "pointer", fontWeight: 500 }}>Cancel</button>
              <button onClick={() => handleDelete(deleteId)} style={{ flex: 1, padding: "10px", borderRadius: 8, border: "none", background: "#ef4444", color: "#fff", cursor: "pointer", fontWeight: 600 }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
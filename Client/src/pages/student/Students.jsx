import { useState, useEffect } from "react";
import { studentAPI, authAPI } from "../../services/api";

const initForm = { name: "", email: "", password: "", phone: "", rollNumber: "", course: "", semester: 1 };

export default function AdminStudents() {
  const [students, setStudents]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]           = useState(initForm);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState("");
  const [search, setSearch]       = useState("");
  const [deleteId, setDeleteId]   = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  const fetchStudents = async () => {
    try {
      const res = await studentAPI.getAll();
      setStudents(res.data.students || []);
    } catch { setStudents([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchStudents(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.rollNumber || !form.course) {
      setError("Badha required fields bharjo!"); return;
    }
    setSaving(true); setError("");
    try {
      // Step 1: User (student role) create karo
      const userRes = await authAPI.register({
        name: form.name,
        email: form.email,
        password: form.password,
        role: "student",
        phone: form.phone
      });

      // Step 2: Register response mathi directly userId lo — no login needed!
      const userId = userRes.data.user._id;

      // Step 3: Student profile create karo with userId
      await studentAPI.create({
        userId,
        rollNumber: form.rollNumber,
        course: form.course,
        semester: Number(form.semester)
      });

      setShowModal(false);
      setForm(initForm);
      setSuccessMsg(`✅ Student "${form.name}" successfully add thayo!`);
      setTimeout(() => setSuccessMsg(""), 4000);
      fetchStudents();
    } catch (err) {
      setError(err.response?.data?.message || "Error adding student");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try { await studentAPI.delete(id); fetchStudents(); }
    catch { alert("Delete karvamaa error aavyo"); }
    finally { setDeleteId(null); }
  };

  const filtered = students.filter(s =>
    s.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.rollNumber?.toLowerCase().includes(search.toLowerCase()) ||
    s.course?.toLowerCase().includes(search.toLowerCase())
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
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1a1d2e" }}>Students</h1>
          <p style={{ fontSize: 13, color: "#6b7280" }}>{students.length} total students</p>
        </div>
        <button onClick={() => { setShowModal(true); setError(""); setForm(initForm); }} style={{
          padding: "9px 18px", background: "#5B5EA6", color: "#fff",
          border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600,
          cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
        }}>
          + Add Student
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
          placeholder="🔍  Search by name, roll number, course..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ ...inputStyle, padding: "10px 14px", width: "100%", maxWidth: 380 }}
        />
      </div>

      {/* Table */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e4e7f0", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1.5fr 1fr 1fr 100px", gap: 0, background: "#f8fafc", borderBottom: "1px solid #e4e7f0", padding: "11px 20px" }}>
          {["Name", "Email", "Course", "Roll No.", "Semester", "Actions"].map(h => (
            <span key={h} style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</span>
          ))}
        </div>

        {/* Rows */}
        {loading ? (
          <div style={{ textAlign: "center", padding: 40, color: "#9ca3af" }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: "#9ca3af" }}>
            {search ? "No students found" : "No students yet — Add your first student!"}
          </div>
        ) : filtered.map((s, i) => (
          <div key={s._id} style={{
            display: "grid", gridTemplateColumns: "2fr 1.5fr 1.5fr 1fr 1fr 100px",
            alignItems: "center", padding: "13px 20px",
            borderBottom: i < filtered.length - 1 ? "1px solid #f3f4f6" : "none",
            transition: "background 0.12s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            {/* Name + avatar */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#EEF2FF", color: "#5B5EA6", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                {s.userId?.name?.charAt(0)?.toUpperCase() || "?"}
              </div>
              <span style={{ fontSize: 14, fontWeight: 500, color: "#1a1d2e" }}>{s.userId?.name || "—"}</span>
            </div>
            <span style={{ fontSize: 13, color: "#6b7280" }}>{s.userId?.email || "—"}</span>
            <span style={{ fontSize: 13 }}>
              <span style={{ background: "#EEF2FF", color: "#5B5EA6", padding: "2px 10px", borderRadius: 20, fontWeight: 600, fontSize: 12 }}>{s.course}</span>
            </span>
            <span style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>{s.rollNumber}</span>
            <span style={{ fontSize: 13, color: "#6b7280" }}>Sem {s.semester}</span>
            <div style={{ display: "flex", gap: 6 }}>
              <button
                onClick={() => setDeleteId(s._id)}
                style={{ padding: "5px 10px", fontSize: 12, borderRadius: 6, border: "1px solid #fecaca", background: "#fef2f2", color: "#dc2626", cursor: "pointer", fontWeight: 500 }}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 14, padding: 28, width: "100%", maxWidth: 480, maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1a1d2e" }}>Add New Student</h3>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#9ca3af" }}>✕</button>
            </div>

            {error && <div style={{ marginBottom: 14, padding: "10px 14px", borderRadius: 8, background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: 13 }}>⚠️ {error}</div>}

            <form onSubmit={handleAdd}>
              {[
                { label: "Full Name *",    name: "name",       type: "text",     placeholder: "Rahul Sharma" },
                { label: "Email *",        name: "email",      type: "email",    placeholder: "rahul@school.com" },
                { label: "Password *",     name: "password",   type: "password", placeholder: "min 6 characters" },
                { label: "Phone",          name: "phone",      type: "tel",      placeholder: "9876543210" },
                { label: "Roll Number *",  name: "rollNumber", type: "text",     placeholder: "101" },
                { label: "Course *",       name: "course",     type: "text",     placeholder: "MERN Stack" },
              ].map(f => (
                <div key={f.name} style={{ marginBottom: 12 }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 4 }}>{f.label}</label>
                  <input type={f.type} name={f.name} placeholder={f.placeholder}
                    value={form[f.name]} onChange={handleChange} style={inputStyle}
                    onFocus={e => e.target.style.borderColor = "#5B5EA6"}
                    onBlur={e => e.target.style.borderColor = "#e4e7f0"} />
                </div>
              ))}
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Semester *</label>
                <select name="semester" value={form.semester} onChange={handleChange} style={{ ...inputStyle, cursor: "pointer" }}>
                  {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>Semester {n}</option>)}
                </select>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: "11px", borderRadius: 8, border: "1px solid #e4e7f0", background: "#fff", fontSize: 14, cursor: "pointer", color: "#374151", fontWeight: 500 }}>
                  Cancel
                </button>
                <button type="submit" disabled={saving} style={{ flex: 1, padding: "11px", borderRadius: 8, border: "none", background: saving ? "#9ca3af" : "#5B5EA6", color: "#fff", fontSize: 14, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer" }}>
                  {saving ? "Adding..." : "Add Student"}
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
            <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>Delete Student?</h3>
            <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 20 }}>This will permanently delete this student and their account.</p>
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
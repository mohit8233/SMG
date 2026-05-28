import { useState, useEffect } from "react";
import { assignmentAPI, studentAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function TeacherAssignments() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [students, setStudents]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [showModal, setShowModal]     = useState(false);
  const [form, setForm]               = useState({ title: "", description: "", studentId: "" });
  const [file, setFile]               = useState(null);
  const [saving, setSaving]           = useState(false);
  const [error, setError]             = useState("");

  const fetchData = async () => {
    try {
      const [a, s] = await Promise.all([assignmentAPI.getAll(), studentAPI.getAll()]);
      setAssignments(a.data.assignments || []);
      setStudents(s.data.students || []);
    } catch { setAssignments([]); setStudents([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.title || !form.studentId) { setError("Title ane Student select karjo!"); return; }
    setSaving(true); setError("");
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("studentId", form.studentId);
      if (file) fd.append("file", file);
      await assignmentAPI.create(fd);
      setShowModal(false); setForm({ title: "", description: "", studentId: "" }); setFile(null);
      fetchData();
    } catch (err) { setError(err.response?.data?.message || "Error uploading assignment"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this assignment?")) return;
    try { await assignmentAPI.delete(id); fetchData(); } catch { alert("Delete error"); }
  };

  const inputStyle = { width: "100%", padding: "9px 12px", borderRadius: 8, border: "1.5px solid #e4e7f0", fontSize: 13, outline: "none", fontFamily: "inherit", color: "#1a1d2e", background: "#fff" };

  const statusStyle = (status) => status === "submitted"
    ? { bg: "#ECFDF5", color: "#059669", label: "Submitted" }
    : { bg: "#FEF3C7", color: "#D97706", label: "Pending" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1a1d2e" }}>Assignments</h1>
          <p style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>{assignments.length} assignments total</p>
        </div>
        <button onClick={() => { setShowModal(true); setError(""); setForm({ title: "", description: "", studentId: "" }); setFile(null); }}
          style={{ padding: "9px 18px", background: "#D97706", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
          + Upload Assignment
        </button>
      </div>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 18 }}>
        {[
          { label: "Total", val: assignments.length, bg: "#EEF2FF", color: "#5B5EA6" },
          { label: "Pending", val: assignments.filter(a => a.status === "pending").length, bg: "#FEF3C7", color: "#D97706" },
          { label: "Submitted", val: assignments.filter(a => a.status === "submitted").length, bg: "#ECFDF5", color: "#059669" },
        ].map((s, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 12, border: "1px solid #e4e7f0", padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 11, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: "#1a1d2e" }}>{s.val}</div>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: s.color }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Assignment cards */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 50, color: "#9ca3af" }}>Loading...</div>
      ) : assignments.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, background: "#fff", borderRadius: 12, border: "1px solid #e4e7f0" }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>📝</div>
          <p style={{ fontWeight: 600, color: "#374151", fontSize: 15 }}>No assignments yet</p>
          <p style={{ fontSize: 13, color: "#9ca3af" }}>Upload your first assignment</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 12 }}>
          {assignments.map((a) => {
            const st = statusStyle(a.status);
            const student = a.studentId;
            return (
              <div key={a._id} style={{ background: "#fff", borderRadius: 12, border: "1px solid #e4e7f0", overflow: "hidden", transition: "box-shadow 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.07)"}
                onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
                <div style={{ padding: "16px 18px", borderBottom: "1px solid #f3f4f6" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 700, color: "#1a1d2e", flex: 1, marginRight: 8 }}>{a.title}</h4>
                    <span style={{ padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: st.bg, color: st.color, flexShrink: 0 }}>{st.label}</span>
                  </div>
                  {a.description && <p style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.5 }}>{a.description}</p>}
                </div>
                <div style={{ padding: "12px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#EEF2FF", color: "#5B5EA6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>
                      {student?.userId?.name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <span style={{ fontSize: 12, color: "#6b7280" }}>{student?.userId?.name || "—"}</span>
                  </div>
                  <button onClick={() => handleDelete(a._id)} style={{ padding: "5px 10px", fontSize: 12, borderRadius: 6, border: "1px solid #fecaca", background: "#fef2f2", color: "#dc2626", cursor: "pointer", fontWeight: 500 }}>Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 14, padding: 28, width: "100%", maxWidth: 440 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontSize: 17, fontWeight: 700 }}>Upload Assignment</h3>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#9ca3af" }}>✕</button>
            </div>
            {error && <div style={{ marginBottom: 14, padding: "10px 14px", borderRadius: 8, background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: 13 }}>⚠️ {error}</div>}
            <form onSubmit={handleAdd}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5 }}>Title *</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Assignment title..." style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "#D97706"} onBlur={e => e.target.style.borderColor = "#e4e7f0"} />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5 }}>Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Assignment details..." rows={3}
                  style={{ ...inputStyle, resize: "vertical" }}
                  onFocus={e => e.target.style.borderColor = "#D97706"} onBlur={e => e.target.style.borderColor = "#e4e7f0"} />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5 }}>Assign to Student *</label>
                <select value={form.studentId} onChange={e => setForm({ ...form, studentId: e.target.value })} style={{ ...inputStyle, cursor: "pointer" }}
                  onFocus={e => e.target.style.borderColor = "#D97706"} onBlur={e => e.target.style.borderColor = "#e4e7f0"}>
                  <option value="">-- Select Student --</option>
                  {students.map(s => <option key={s._id} value={s._id}>{s.userId?.name} ({s.rollNumber})</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5 }}>Attach File (optional)</label>
                <input type="file" accept=".pdf,.doc,.docx,.jpg,.png" onChange={e => setFile(e.target.files[0])}
                  style={{ ...inputStyle, padding: "7px 12px", cursor: "pointer" }} />
                {file && <p style={{ fontSize: 11, color: "#059669", marginTop: 4 }}>✓ {file.name}</p>}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: 11, borderRadius: 8, border: "1px solid #e4e7f0", background: "#fff", fontSize: 14, cursor: "pointer", fontWeight: 500 }}>Cancel</button>
                <button type="submit" disabled={saving} style={{ flex: 1, padding: 11, borderRadius: 8, border: "none", background: saving ? "#9ca3af" : "#D97706", color: "#fff", fontSize: 14, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer" }}>
                  {saving ? "Uploading..." : "Upload"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
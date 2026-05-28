import { useState, useEffect } from "react";
import { studentAPI, marksAPI } from "../../services/api";

const SUBJECTS = ["React", "NodeJS", "MongoDB", "Express", "JavaScript", "HTML/CSS"];

export default function TeacherMarks() {
  const [students, setStudents]   = useState([]);
  const [allMarks, setAllMarks]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]           = useState({ studentId: "", subject: "", marks: "" });
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState("");
  const [saved, setSaved]         = useState(false);

  const fetchData = async () => {
    try {
      const [s, m] = await Promise.all([studentAPI.getAll(), marksAPI.getAll()]);
      setStudents(s.data.students || []);
      setAllMarks(m.data.marks || []);
    } catch { setStudents([]); setAllMarks([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.studentId || !form.subject || !form.marks) { setError("Badha fields bharjo!"); return; }
    if (form.marks < 0 || form.marks > 100) { setError("Marks 0-100 vachche hova joiye!"); return; }
    setSaving(true); setError("");
    try {
      await marksAPI.add({ studentId: form.studentId, subject: form.subject, marks: Number(form.marks) });
      setShowModal(false); setForm({ studentId: "", subject: "", marks: "" });
      setSaved(true); setTimeout(() => setSaved(false), 3000);
      fetchData();
    } catch (err) { setError(err.response?.data?.message || "Error adding marks"); }
    finally { setSaving(false); }
  };

  const getGrade = (m) => {
    if (m >= 90) return { g: "A+", color: "#059669", bg: "#ECFDF5" };
    if (m >= 80) return { g: "A",  color: "#059669", bg: "#ECFDF5" };
    if (m >= 70) return { g: "B",  color: "#5B5EA6", bg: "#EEF2FF" };
    if (m >= 60) return { g: "C",  color: "#D97706", bg: "#FEF3C7" };
    if (m >= 40) return { g: "D",  color: "#D97706", bg: "#FEF3C7" };
    return { g: "F", color: "#dc2626", bg: "#fef2f2" };
  };

  const inputStyle = { width: "100%", padding: "9px 12px", borderRadius: 8, border: "1.5px solid #e4e7f0", fontSize: 13, outline: "none", fontFamily: "inherit", color: "#1a1d2e", background: "#fff" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1a1d2e" }}>Marks</h1>
          <p style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>Add and manage student marks</p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {saved && <span style={{ fontSize: 13, color: "#059669", fontWeight: 600 }}>✅ Marks saved!</span>}
          <button onClick={() => { setShowModal(true); setError(""); setForm({ studentId: "", subject: "", marks: "" }); }}
            style={{ padding: "9px 18px", background: "#7C3AED", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
            + Add Marks
          </button>
        </div>
      </div>

      {/* Marks Table */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e4e7f0", overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 80px 80px", padding: "10px 20px", background: "#f8fafc", borderBottom: "1px solid #e4e7f0" }}>
          {["Student", "Subject", "Marks", "Grade", "Actions"].map(h => (
            <span key={h} style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</span>
          ))}
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "#9ca3af" }}>Loading...</div>
        ) : allMarks.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "#9ca3af" }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>📊</div>
            <p style={{ fontWeight: 600, color: "#374151" }}>No marks added yet</p>
            <p style={{ fontSize: 13 }}>Click "Add Marks" to get started</p>
          </div>
        ) : allMarks.map((m, i) => {
          const grade = getGrade(m.marks);
          const student = m.studentId;
          return (
            <div key={m._id} style={{
              display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 80px 80px",
              alignItems: "center", padding: "12px 20px",
              borderBottom: i < allMarks.length - 1 ? "1px solid #f3f4f6" : "none",
              transition: "background 0.12s",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#EEF2FF", color: "#5B5EA6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>
                  {student?.userId?.name?.charAt(0)?.toUpperCase() || "?"}
                </div>
                <span style={{ fontSize: 13, fontWeight: 500, color: "#1a1d2e" }}>{student?.userId?.name || "—"}</span>
              </div>
              <span style={{ fontSize: 12 }}>
                <span style={{ background: "#F3E8FF", color: "#7C3AED", padding: "2px 9px", borderRadius: 20, fontSize: 11, fontWeight: 600 }}>{m.subject}</span>
              </span>
              <div>
                <span style={{ fontSize: 16, fontWeight: 700, color: "#1a1d2e" }}>{m.marks}</span>
                <span style={{ fontSize: 11, color: "#9ca3af" }}>/100</span>
                <div style={{ height: 4, borderRadius: 2, background: "#f3f4f6", marginTop: 4, width: 60, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${m.marks}%`, borderRadius: 2, background: grade.color }} />
                </div>
              </div>
              <span><span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700, background: grade.bg, color: grade.color }}>{grade.g}</span></span>
              <button onClick={async () => { if(window.confirm("Delete this marks record?")) { await marksAPI.delete(m._id); fetchData(); } }}
                style={{ padding: "5px 10px", fontSize: 12, borderRadius: 6, border: "1px solid #fecaca", background: "#fef2f2", color: "#dc2626", cursor: "pointer", fontWeight: 500 }}>
                Delete
              </button>
            </div>
          );
        })}
      </div>

      {/* Add Marks Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 14, padding: 28, width: "100%", maxWidth: 420 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontSize: 17, fontWeight: 700 }}>Add Marks</h3>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#9ca3af" }}>✕</button>
            </div>
            {error && <div style={{ marginBottom: 14, padding: "10px 14px", borderRadius: 8, background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: 13 }}>⚠️ {error}</div>}
            <form onSubmit={handleAdd}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5 }}>Select Student *</label>
                <select value={form.studentId} onChange={e => setForm({ ...form, studentId: e.target.value })} style={{ ...inputStyle, cursor: "pointer" }}
                  onFocus={e => e.target.style.borderColor = "#7C3AED"}
                  onBlur={e => e.target.style.borderColor = "#e4e7f0"}>
                  <option value="">-- Select Student --</option>
                  {students.map(s => <option key={s._id} value={s._id}>{s.userId?.name} ({s.rollNumber})</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5 }}>Subject *</label>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                  {SUBJECTS.map(sub => (
                    <span key={sub} onClick={() => setForm({ ...form, subject: sub })} style={{
                      padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 500, cursor: "pointer",
                      background: form.subject === sub ? "#F3E8FF" : "#f3f4f6",
                      color: form.subject === sub ? "#7C3AED" : "#6b7280",
                      border: form.subject === sub ? "1px solid #d8b4fe" : "1px solid transparent",
                    }}>{sub}</span>
                  ))}
                </div>
                <input placeholder="Or type custom subject..." value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "#7C3AED"}
                  onBlur={e => e.target.style.borderColor = "#e4e7f0"} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5 }}>Marks (0 - 100) *</label>
                <input type="number" min={0} max={100} placeholder="85" value={form.marks} onChange={e => setForm({ ...form, marks: e.target.value })} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "#7C3AED"}
                  onBlur={e => e.target.style.borderColor = "#e4e7f0"} />
                {form.marks && <div style={{ fontSize: 12, color: "#6b7280", marginTop: 5 }}>Grade: <strong style={{ color: getGrade(form.marks).color }}>{getGrade(form.marks).g}</strong></div>}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: 11, borderRadius: 8, border: "1px solid #e4e7f0", background: "#fff", fontSize: 14, cursor: "pointer", fontWeight: 500 }}>Cancel</button>
                <button type="submit" disabled={saving} style={{ flex: 1, padding: 11, borderRadius: 8, border: "none", background: saving ? "#9ca3af" : "#7C3AED", color: "#fff", fontSize: 14, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer" }}>
                  {saving ? "Saving..." : "Save Marks"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
import { useState, useEffect } from "react";
import { courseAPI } from "../../services/api";

const initForm = { courseName: "", duration: "", fees: "" };

export default function AdminCourses() {
  const [courses, setCourses]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showModal, setShowModal]   = useState(false);
  const [form, setForm]             = useState(initForm);
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState("");
  const [deleteId, setDeleteId]     = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  const fetchCourses = async () => {
    try {
      const res = await courseAPI.getAll();
      setCourses(res.data.courses || []);
    } catch { setCourses([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCourses(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.courseName || !form.duration || !form.fees) {
      setError("Badha fields bharjo!"); return;
    }
    setSaving(true); setError("");
    try {
      await courseAPI.create({
        courseName: form.courseName,
        duration: form.duration,
        fees: Number(form.fees),
      });
      setShowModal(false);
      setForm(initForm);
      setSuccessMsg(`✅ Course "${form.courseName}" successfully create thayo!`);
      setTimeout(() => setSuccessMsg(""), 4000);
      fetchCourses();
    } catch (err) {
      setError(err.response?.data?.message || "Error creating course");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try { await courseAPI.delete(id); fetchCourses(); }
    catch { alert("Delete karvamaa error"); }
    finally { setDeleteId(null); }
  };

  const inputStyle = {
    width: "100%", padding: "9px 12px", borderRadius: 8,
    border: "1.5px solid #e4e7f0", fontSize: 13,
    outline: "none", fontFamily: "inherit", color: "#1a1d2e", background: "#fff",
    boxSizing: "border-box",
  };

  const courseColors = ["#EEF2FF", "#F3E8FF", "#ECFDF5", "#FEF3C7", "#FFF1F2", "#F0F9FF"];
  const textColors   = ["#5B5EA6", "#7C3AED", "#059669", "#D97706", "#E11D48", "#0284C7"];

  return (
    <div>
      {/* Top bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1a1d2e" }}>Courses</h1>
          <p style={{ fontSize: 13, color: "#6b7280" }}>{courses.length} active courses</p>
        </div>
        <button onClick={() => { setShowModal(true); setError(""); setForm(initForm); }} style={{
          padding: "9px 18px", background: "#059669", color: "#fff",
          border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer",
        }}>
          + Create Course
        </button>
      </div>

      {/* Success Message */}
      {successMsg && (
        <div style={{ marginBottom: 16, padding: "12px 16px", borderRadius: 8, background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#15803d", fontSize: 14, fontWeight: 500 }}>
          {successMsg}
        </div>
      )}

      {/* Course Cards */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 60, color: "#9ca3af" }}>Loading...</div>
      ) : courses.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, color: "#9ca3af", background: "#fff", borderRadius: 12, border: "1px solid #e4e7f0" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📚</div>
          <p style={{ fontWeight: 600, fontSize: 15, color: "#374151" }}>No courses yet</p>
          <p style={{ fontSize: 13 }}>Create your first course to get started</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
          {courses.map((c, i) => {
            const bg  = courseColors[i % courseColors.length];
            const clr = textColors[i % textColors.length];
            return (
              <div key={c._id} style={{ background: "#fff", borderRadius: 12, border: "1px solid #e4e7f0", overflow: "hidden", transition: "box-shadow 0.18s" }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 18px rgba(0,0,0,0.08)"}
                onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
                <div style={{ background: bg, padding: "20px 20px 16px", borderBottom: "1px solid #e4e7f0" }}>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>📚</div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: clr }}>{c.courseName}</h3>
                </div>
                <div style={{ padding: "14px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: "#6b7280" }}>Duration</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{c.duration}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                    <span style={{ fontSize: 12, color: "#6b7280" }}>Fees</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#059669" }}>₹{c.fees?.toLocaleString()}</span>
                  </div>
                  <button onClick={() => setDeleteId(c._id)}
                    style={{ width: "100%", padding: "8px", borderRadius: 7, border: "1px solid #fecaca", background: "#fef2f2", color: "#dc2626", cursor: "pointer", fontSize: 13, fontWeight: 500 }}>
                    Delete Course
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 14, padding: 28, width: "100%", maxWidth: 420 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700 }}>Create New Course</h3>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#9ca3af" }}>✕</button>
            </div>

            {error && <div style={{ marginBottom: 14, padding: "10px 14px", borderRadius: 8, background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: 13 }}>⚠️ {error}</div>}

            <form onSubmit={handleAdd}>
              {[
                { label: "Course Name *", name: "courseName", type: "text",   placeholder: "MERN Stack Development" },
                { label: "Duration *",    name: "duration",   type: "text",   placeholder: "6 Months" },
                { label: "Fees (₹) *",   name: "fees",       type: "number", placeholder: "25000" },
              ].map(f => (
                <div key={f.name} style={{ marginBottom: 14 }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5 }}>{f.label}</label>
                  <input type={f.type} name={f.name} placeholder={f.placeholder}
                    value={form[f.name]}
                    onChange={e => { setForm({ ...form, [e.target.name]: e.target.value }); setError(""); }}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = "#059669"}
                    onBlur={e => e.target.style.borderColor = "#e4e7f0"} />
                </div>
              ))}
              <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: "11px", borderRadius: 8, border: "1px solid #e4e7f0", background: "#fff", fontSize: 14, cursor: "pointer", fontWeight: 500 }}>Cancel</button>
                <button type="submit" disabled={saving} style={{ flex: 1, padding: "11px", borderRadius: 8, border: "none", background: saving ? "#9ca3af" : "#059669", color: "#fff", fontSize: 14, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer" }}>
                  {saving ? "Creating..." : "Create Course"}
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
            <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>Delete Course?</h3>
            <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 20 }}>This will permanently delete this course.</p>
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
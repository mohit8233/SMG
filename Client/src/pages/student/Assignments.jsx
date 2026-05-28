import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { studentAPI, assignmentAPI } from "../../services/api";

export default function StudentAssignments() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [submitModal, setSubmitModal] = useState(null);
  const [file, setFile]               = useState(null);
  const [submitting, setSubmitting]   = useState(false);
  const [done, setDone]               = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const sRes = await studentAPI.getAll();
        const mine = (sRes.data.students || []).find(s =>
          s.userId?._id?.toString() === user?._id?.toString() ||
          s.userId?.email === user?.email
        );
        if (mine) {
          const aRes = await assignmentAPI.getByStudent(mine._id);
          setAssignments(aRes.data.assignments || []);
        }
      } catch { setAssignments([]); }
      finally { setLoading(false); }
    })();
  }, []);

  const handleSubmit = async () => {
    if (!file) { alert("File select karo!"); return; }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      await assignmentAPI.submit(submitModal, fd);
      setDone(true);
      setAssignments(prev => prev.map(a => a._id === submitModal ? { ...a, status: "submitted" } : a));
      setTimeout(() => { setSubmitModal(null); setFile(null); setDone(false); }, 1500);
    } catch { alert("Submit karvamaa error aavyo"); }
    finally { setSubmitting(false); }
  };

  const pending   = assignments.filter(a => a.status === "pending").length;
  const submitted = assignments.filter(a => a.status === "submitted").length;

  return (
    <div>
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1a1d2e" }}>My Assignments</h1>
        <p style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>View and submit your assignments</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Total",     val: assignments.length, icon: "📝", bg: "#EEF2FF", color: "#5B5EA6" },
          { label: "Pending",   val: pending,            icon: "⏳", bg: "#FEF3C7", color: "#D97706" },
          { label: "Submitted", val: submitted,          icon: "✅", bg: "#ECFDF5", color: "#059669" },
        ].map((c, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 12, border: "1px solid #e4e7f0", padding: "16px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 10, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 5, fontWeight: 600 }}>{c.label}</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#1a1d2e" }}>{loading ? "—" : c.val}</div>
            </div>
            <div style={{ width: 42, height: 42, borderRadius: 11, background: c.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{c.icon}</div>
          </div>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 50, color: "#9ca3af" }}>Loading...</div>
      ) : assignments.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, background: "#fff", borderRadius: 12, border: "1px solid #e4e7f0" }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>📝</div>
          <p style={{ fontWeight: 600, color: "#374151", fontSize: 15 }}>No assignments yet</p>
          <p style={{ fontSize: 13, color: "#9ca3af" }}>Your teacher hasn't assigned anything yet</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {assignments.map((a) => {
            const isSubmitted = a.status === "submitted";
            return (
              <div key={a._id} style={{ background: "#fff", borderRadius: 12, border: "1px solid #e4e7f0", overflow: "hidden" }}>
                <div style={{ display: "flex", gap: 14, padding: "16px 20px", alignItems: "flex-start" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: isSubmitted ? "#ECFDF5" : "#FEF3C7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                    {isSubmitted ? "✅" : "📝"}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <h4 style={{ fontSize: 15, fontWeight: 700, color: "#1a1d2e", margin: 0 }}>{a.title}</h4>
                      <span style={{ padding: "3px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: isSubmitted ? "#ECFDF5" : "#FEF3C7", color: isSubmitted ? "#059669" : "#D97706", marginLeft: 8, flexShrink: 0 }}>
                        {isSubmitted ? "✅ Submitted" : "⏳ Pending"}
                      </span>
                    </div>
                    {a.description && <p style={{ fontSize: 13, color: "#6b7280", marginTop: 6, lineHeight: 1.5 }}>{a.description}</p>}
                    {a.teacherId?.userId?.name && (
                      <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 6 }}>
                        👨‍🏫 Assigned by: <strong style={{ color: "#374151" }}>{a.teacherId.userId.name}</strong>
                      </p>
                    )}
                    {a.file && (
                      <a href={`http://localhost:8000/uploads/${a.file}`} target="_blank" rel="noreferrer"
                        style={{ display: "inline-flex", alignItems: "center", gap: 5, marginTop: 8, fontSize: 12, color: "#5B5EA6", textDecoration: "none", fontWeight: 600 }}>
                        📎 Download attachment
                      </a>
                    )}
                  </div>
                </div>
                {!isSubmitted && (
                  <div style={{ padding: "12px 20px", borderTop: "1px solid #f3f4f6", background: "#fafafa", display: "flex", justifyContent: "flex-end" }}>
                    <button onClick={() => setSubmitModal(a._id)} style={{ padding: "8px 20px", background: "#5B5EA6", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                      Submit Assignment →
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Submit Modal */}
      {submitModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 14, padding: 28, width: "100%", maxWidth: 420 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <h3 style={{ fontSize: 17, fontWeight: 700 }}>Submit Assignment</h3>
              <button onClick={() => { setSubmitModal(null); setFile(null); }} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#9ca3af" }}>✕</button>
            </div>
            {done ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: 48, marginBottom: 10 }}>✅</div>
                <p style={{ fontWeight: 700, fontSize: 16, color: "#059669" }}>Submitted successfully!</p>
              </div>
            ) : (
              <>
                <div onClick={() => document.getElementById("sub-file-inp").click()}
                  style={{ border: "2px dashed #d1d5db", borderRadius: 10, padding: 24, textAlign: "center", cursor: "pointer", marginBottom: 14, background: "#fafafa", transition: "all 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#5B5EA6"; e.currentTarget.style.background = "#f0f1ff"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#d1d5db"; e.currentTarget.style.background = "#fafafa"; }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>📁</div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Click to browse file</p>
                  <p style={{ fontSize: 11, color: "#9ca3af" }}>PDF, DOC, DOCX, JPG, PNG — max 5MB</p>
                </div>
                <input type="file" id="sub-file-inp" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" style={{ display: "none" }} onChange={e => setFile(e.target.files[0])} />
                {file && (
                  <div style={{ padding: "10px 14px", borderRadius: 8, background: "#ECFDF5", border: "1px solid #a7f3d0", marginBottom: 14, display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 18 }}>📄</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "#059669", margin: 0 }}>{file.name}</p>
                      <p style={{ fontSize: 11, color: "#6b7280", margin: 0 }}>{Math.round(file.size / 1024)} KB</p>
                    </div>
                    <button onClick={() => setFile(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: 16 }}>✕</button>
                  </div>
                )}
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => { setSubmitModal(null); setFile(null); }} style={{ flex: 1, padding: 11, borderRadius: 8, border: "1px solid #e4e7f0", background: "#fff", fontSize: 14, cursor: "pointer", fontWeight: 500 }}>Cancel</button>
                  <button onClick={handleSubmit} disabled={submitting || !file} style={{ flex: 1, padding: 11, borderRadius: 8, border: "none", background: submitting || !file ? "#9ca3af" : "#5B5EA6", color: "#fff", fontSize: 14, fontWeight: 600, cursor: submitting || !file ? "not-allowed" : "pointer" }}>
                    {submitting ? "Submitting..." : "Submit →"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

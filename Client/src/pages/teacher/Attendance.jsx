import { useState, useEffect } from "react";
import { studentAPI, attendanceAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function TeacherAttendance() {
  const { user } = useAuth();
  const [students, setStudents]     = useState([]);
  const [attendance, setAttendance] = useState({});   // { studentId: "present"|"absent" }
  const [date, setDate]             = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [saved, setSaved]           = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await studentAPI.getAll();
        const list = res.data.students || [];
        setStudents(list);
        // default: saau present
        const def = {};
        list.forEach(s => def[s._id] = "present");
        setAttendance(def);
      } catch { setStudents([]); }
      finally { setLoading(false); }
    })();
  }, []);

  const toggle = (id) => {
    setAttendance(prev => ({ ...prev, [id]: prev[id] === "present" ? "absent" : "present" }));
  };

  const handleSave = async () => {
    setSaving(true); setSaved(false);
    try {
      await Promise.all(
        students.map(s => attendanceAPI.mark({ studentId: s._id, date, status: attendance[s._id] || "absent" }))
      );
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) { alert("Error saving attendance"); }
    finally { setSaving(false); }
  };

  const presentCount = Object.values(attendance).filter(v => v === "present").length;
  const absentCount  = students.length - presentCount;

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1a1d2e" }}>Attendance</h1>
        <p style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>Mark daily attendance for your students</p>
      </div>

      {/* Date + Summary bar */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e4e7f0", padding: "16px 20px", marginBottom: 16, display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 4 }}>Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)}
            style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #e4e7f0", fontSize: 13, color: "#1a1d2e", outline: "none" }} />
        </div>
        <div style={{ display: "flex", gap: 14, marginLeft: "auto", alignItems: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#059669" }}>{presentCount}</div>
            <div style={{ fontSize: 11, color: "#6b7280" }}>Present</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#ef4444" }}>{absentCount}</div>
            <div style={{ fontSize: 11, color: "#6b7280" }}>Absent</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#5B5EA6" }}>{students.length}</div>
            <div style={{ fontSize: 11, color: "#6b7280" }}>Total</div>
          </div>
        </div>
      </div>

      {/* Mark all buttons */}
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        <button onClick={() => { const all={}; students.forEach(s=>all[s._id]="present"); setAttendance(all); }}
          style={{ padding: "7px 16px", borderRadius: 8, border: "1px solid #a7f3d0", background: "#ECFDF5", color: "#059669", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          ✅ Mark All Present
        </button>
        <button onClick={() => { const all={}; students.forEach(s=>all[s._id]="absent"); setAttendance(all); }}
          style={{ padding: "7px 16px", borderRadius: 8, border: "1px solid #fecaca", background: "#fef2f2", color: "#ef4444", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          ❌ Mark All Absent
        </button>
      </div>

      {/* Student list */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e4e7f0", overflow: "hidden", marginBottom: 16 }}>
        {/* Header */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 140px", padding: "10px 20px", background: "#f8fafc", borderBottom: "1px solid #e4e7f0" }}>
          {["Student", "Roll No.", "Course", "Status"].map(h => (
            <span key={h} style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</span>
          ))}
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "#9ca3af" }}>Loading students...</div>
        ) : students.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "#9ca3af" }}>No students found. Admin must add students first.</div>
        ) : students.map((s, i) => {
          const isPresent = attendance[s._id] === "present";
          return (
            <div key={s._id} style={{
              display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 140px",
              alignItems: "center", padding: "12px 20px",
              borderBottom: i < students.length - 1 ? "1px solid #f3f4f6" : "none",
              background: isPresent ? "#f0fdf4" : "#fff9f9",
              transition: "background 0.15s",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: "50%",
                  background: isPresent ? "#ECFDF5" : "#fef2f2",
                  color: isPresent ? "#059669" : "#ef4444",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 700, fontSize: 13, flexShrink: 0,
                }}>
                  {s.userId?.name?.charAt(0)?.toUpperCase() || "?"}
                </div>
                <span style={{ fontSize: 14, fontWeight: 500, color: "#1a1d2e" }}>{s.userId?.name || "—"}</span>
              </div>
              <span style={{ fontSize: 13, color: "#6b7280", fontWeight: 500 }}>{s.rollNumber}</span>
              <span style={{ fontSize: 12 }}>
                <span style={{ background: "#EEF2FF", color: "#5B5EA6", padding: "2px 8px", borderRadius: 20, fontSize: 11, fontWeight: 600 }}>{s.course}</span>
              </span>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => setAttendance(prev => ({ ...prev, [s._id]: "present" }))}
                  style={{
                    padding: "6px 14px", borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: "pointer",
                    border: isPresent ? "none" : "1px solid #d1d5db",
                    background: isPresent ? "#059669" : "#fff",
                    color: isPresent ? "#fff" : "#6b7280",
                    transition: "all 0.15s",
                  }}>P</button>
                <button onClick={() => setAttendance(prev => ({ ...prev, [s._id]: "absent" }))}
                  style={{
                    padding: "6px 14px", borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: "pointer",
                    border: !isPresent ? "none" : "1px solid #d1d5db",
                    background: !isPresent ? "#ef4444" : "#fff",
                    color: !isPresent ? "#fff" : "#6b7280",
                    transition: "all 0.15s",
                  }}>A</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Save button */}
      {students.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button onClick={handleSave} disabled={saving} style={{
            padding: "11px 28px", background: saving ? "#9ca3af" : "#5B5EA6",
            color: "#fff", border: "none", borderRadius: 8,
            fontSize: 14, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer",
            boxShadow: saving ? "none" : "0 4px 14px rgba(91,94,166,0.3)",
          }}>
            {saving ? "Saving..." : "💾 Save Attendance"}
          </button>
          {saved && <span style={{ fontSize: 13, color: "#059669", fontWeight: 600 }}>✅ Attendance saved successfully!</span>}
        </div>
      )}
    </div>
  );
}
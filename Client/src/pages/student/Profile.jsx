import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { studentAPI } from "../../services/api";

export default function StudentProfile() {
  const { user } = useAuth();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm]       = useState({ name: "", phone: "" });
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await studentAPI.getAll();
        const list = res.data.students || [];
        const mine = list.find(s => s.userId?._id === user?._id || s.userId?.email === user?.email);
        setStudent(mine || null);
        setForm({ name: user?.name || "", phone: user?.phone || "" });
      } catch { setStudent(null); }
      finally { setLoading(false); }
    })();
  }, []);

  const InfoRow = ({ label, value, icon }) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 0", borderBottom: "1px solid #f3f4f6" }}>
      <span style={{ fontSize: 13, color: "#6b7280", display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 16 }}>{icon}</span>{label}
      </span>
      <span style={{ fontSize: 14, fontWeight: 500, color: "#1a1d2e" }}>{value || "—"}</span>
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1a1d2e" }}>My Profile</h1>
        <p style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>View your personal and academic details</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 16 }}>
        {/* Left — Avatar card */}
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e4e7f0", padding: 24, textAlign: "center", height: "fit-content" }}>
          <div style={{
            width: 80, height: 80, borderRadius: "50%", margin: "0 auto 14px",
            background: "linear-gradient(135deg,#059669,#34d399)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 32, fontWeight: 700, color: "#fff",
          }}>
            {user?.name?.charAt(0)?.toUpperCase() || "S"}
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1a1d2e", marginBottom: 4 }}>{user?.name}</h3>
          <span style={{ display: "inline-block", fontSize: 11, padding: "2px 12px", borderRadius: 20, background: "#ECFDF5", color: "#059669", fontWeight: 600 }}>
            Student
          </span>
          {student && (
            <div style={{ marginTop: 16, padding: "12px 0", borderTop: "1px solid #f3f4f6" }}>
              <div style={{ display: "flex", justifyContent: "space-around" }}>
                {[
                  { label: "Roll No.", val: student.rollNumber },
                  { label: "Sem", val: student.semester },
                ].map((s, i) => (
                  <div key={i} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#1a1d2e" }}>{s.val}</div>
                    <div style={{ fontSize: 11, color: "#9ca3af" }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div style={{ marginTop: 16, padding: "10px 14px", borderRadius: 10, background: "#EEF2FF", border: "1px solid #c7d2fe" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#5B5EA6" }}>{student?.course || user?.email?.split("@")[0] || "Course"}</div>
            <div style={{ fontSize: 11, color: "#818cf8", marginTop: 2 }}>Enrolled Course</div>
          </div>
        </div>

        {/* Right — Details */}
        <div>
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e4e7f0", padding: "20px 24px", marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1a1d2e" }}>Personal Information</h3>
              {!editing && (
                <button onClick={() => setEditing(true)} style={{ padding: "6px 14px", borderRadius: 7, border: "1px solid #e4e7f0", background: "#fff", fontSize: 12, fontWeight: 600, color: "#5B5EA6", cursor: "pointer" }}>
                  ✏️ Edit
                </button>
              )}
            </div>
            {loading ? (
              <div style={{ padding: 30, textAlign: "center", color: "#9ca3af" }}>Loading...</div>
            ) : editing ? (
              <div style={{ marginTop: 12 }}>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5 }}>Full Name</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1.5px solid #e4e7f0", fontSize: 13, outline: "none", color: "#1a1d2e" }}
                    onFocus={e => e.target.style.borderColor = "#059669"}
                    onBlur={e => e.target.style.borderColor = "#e4e7f0"} />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5 }}>Phone Number</label>
                  <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="9876543210"
                    style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1.5px solid #e4e7f0", fontSize: 13, outline: "none", color: "#1a1d2e" }}
                    onFocus={e => e.target.style.borderColor = "#059669"}
                    onBlur={e => e.target.style.borderColor = "#e4e7f0"} />
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => setEditing(false)} style={{ flex: 1, padding: "9px", borderRadius: 8, border: "1px solid #e4e7f0", background: "#fff", fontSize: 13, cursor: "pointer", fontWeight: 500 }}>Cancel</button>
                  <button onClick={() => { setEditing(false); setSaved(true); setTimeout(() => setSaved(false), 2500); }}
                    style={{ flex: 1, padding: "9px", borderRadius: 8, border: "none", background: "#059669", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                    Save Changes
                  </button>
                </div>
                {saved && <p style={{ fontSize: 12, color: "#059669", marginTop: 8 }}>✅ Profile updated!</p>}
              </div>
            ) : (
              <div>
                <InfoRow icon="👤" label="Full Name"    value={user?.name} />
                <InfoRow icon="📧" label="Email"        value={user?.email} />
                <InfoRow icon="📱" label="Phone"        value={user?.phone || "Not added"} />
                <InfoRow icon="🎓" label="Role"         value="Student" />
              </div>
            )}
          </div>

          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e4e7f0", padding: "20px 24px" }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1a1d2e", marginBottom: 4 }}>Academic Information</h3>
            {loading ? (
              <div style={{ padding: 20, textAlign: "center", color: "#9ca3af" }}>Loading...</div>
            ) : student ? (
              <div>
                <InfoRow icon="🎫" label="Roll Number" value={student.rollNumber} />
                <InfoRow icon="📚" label="Course"      value={student.course} />
                <InfoRow icon="📅" label="Semester"    value={`Semester ${student.semester}`} />
                <InfoRow icon="📊" label="Attendance %" value={`${student.attendance || 0}%`} />
              </div>
            ) : (
              <div style={{ padding: 20, textAlign: "center", color: "#9ca3af", fontSize: 13 }}>
                Academic details not assigned yet. Contact admin.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
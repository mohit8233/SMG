import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { studentAPI, marksAPI } from "../../services/api";

export default function StudentMarks() {
  const { user } = useAuth();
  const [marks, setMarks]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const sRes = await studentAPI.getAll();
        const all  = sRes.data.students || [];
        // userId._id OR userId (string match) sathe find karo
        const mine = all.find(s =>
          s.userId?._id?.toString() === user?._id?.toString() ||
          s.userId?.email === user?.email
        );
        if (mine) {
          const mRes = await marksAPI.getByStudent(mine._id);
          setMarks(mRes.data.marks || []);
        }
      } catch { setMarks([]); }
      finally { setLoading(false); }
    })();
  }, []);

  const getGrade = (m) => {
    if (m >= 90) return { g: "A+", color: "#059669", bg: "#ECFDF5" };
    if (m >= 80) return { g: "A",  color: "#059669", bg: "#ECFDF5" };
    if (m >= 70) return { g: "B",  color: "#5B5EA6", bg: "#EEF2FF" };
    if (m >= 60) return { g: "C",  color: "#D97706", bg: "#FEF3C7" };
    if (m >= 40) return { g: "D",  color: "#D97706", bg: "#FEF3C7" };
    return { g: "F", color: "#dc2626", bg: "#fef2f2" };
  };

  const avg     = marks.length ? Math.round(marks.reduce((s, m) => s + m.marks, 0) / marks.length) : 0;
  const best    = marks.length ? Math.max(...marks.map(m => m.marks)) : 0;
  const lowest  = marks.length ? Math.min(...marks.map(m => m.marks)) : 0;
  const overall = getGrade(avg);

  return (
    <div>
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1a1d2e" }}>My Marks</h1>
        <p style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>Subject-wise marks added by your teacher</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Subjects", val: marks.length, icon: "📚", bg: "#EEF2FF", color: "#5B5EA6" },
          { label: "Average",  val: avg + "%",    icon: "📊", bg: overall.bg, color: overall.color },
          { label: "Highest",  val: best,         icon: "🏆", bg: "#ECFDF5", color: "#059669" },
          { label: "Lowest",   val: lowest,       icon: "📉", bg: "#FEF3C7", color: "#D97706" },
        ].map((c, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 12, border: "1px solid #e4e7f0", padding: "16px 18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 10, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6, fontWeight: 600 }}>{c.label}</div>
                <div style={{ fontSize: 26, fontWeight: 700, color: "#1a1d2e" }}>{loading ? "—" : c.val}</div>
              </div>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: c.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{c.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {!loading && marks.length > 0 && (
        <div style={{ background: overall.bg, borderRadius: 12, border: `1px solid ${overall.color}33`, padding: "14px 20px", marginBottom: 16, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 52, height: 52, borderRadius: 12, background: overall.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 22, fontWeight: 800 }}>{overall.g}</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1d2e" }}>Overall Grade: {overall.g}</div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>Average of {marks.length} subjects · {avg}%</div>
          </div>
        </div>
      )}

      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e4e7f0", overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1.5fr 80px", padding: "10px 20px", background: "#f8fafc", borderBottom: "1px solid #e4e7f0" }}>
          {["Subject", "Marks", "Progress", "Grade"].map(h => (
            <span key={h} style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</span>
          ))}
        </div>
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "#9ca3af" }}>Loading marks...</div>
        ) : marks.length === 0 ? (
          <div style={{ padding: 50, textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>📊</div>
            <p style={{ fontWeight: 600, color: "#374151" }}>No marks yet</p>
            <p style={{ fontSize: 13, color: "#9ca3af" }}>Your teacher hasn't added marks yet</p>
          </div>
        ) : marks.map((m, i) => {
          const grade = getGrade(m.marks);
          return (
            <div key={m._id} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1.5fr 80px", alignItems: "center", padding: "14px 20px", borderBottom: i < marks.length - 1 ? "1px solid #f3f4f6" : "none" }}
              onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: grade.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>📘</div>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#1a1d2e" }}>{m.subject}</span>
              </div>
              <div>
                <span style={{ fontSize: 20, fontWeight: 700, color: "#1a1d2e" }}>{m.marks}</span>
                <span style={{ fontSize: 12, color: "#9ca3af" }}>/100</span>
              </div>
              <div>
                <div style={{ height: 8, borderRadius: 4, background: "#f3f4f6", overflow: "hidden", marginBottom: 3 }}>
                  <div style={{ height: "100%", width: `${m.marks}%`, borderRadius: 4, background: grade.color }} />
                </div>
                <div style={{ fontSize: 11, color: "#9ca3af" }}>{m.marks}%</div>
              </div>
              <span style={{ padding: "4px 12px", borderRadius: 20, fontSize: 13, fontWeight: 700, background: grade.bg, color: grade.color, display: "inline-block", textAlign: "center" }}>{grade.g}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

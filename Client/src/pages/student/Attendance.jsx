import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { studentAPI, attendanceAPI } from "../../services/api";

export default function StudentAttendance() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [stats, setStats]     = useState({ total: 0, present: 0, absent: 0, percentage: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const sRes = await studentAPI.getAll();
        const mine = (sRes.data.students || []).find(s =>
          s.userId?._id?.toString() === user?._id?.toString() ||
          s.userId?.email === user?.email
        );
        if (mine) {
          const aRes = await attendanceAPI.getByStudent(mine._id);
          setRecords(aRes.data.attendance || []);
          setStats(aRes.data.stats || { total: 0, present: 0, absent: 0, percentage: 0 });
        }
      } catch { setRecords([]); }
      finally { setLoading(false); }
    })();
  }, []);

  const pct      = stats.percentage || 0;
  const pctColor = pct >= 75 ? "#059669" : pct >= 50 ? "#D97706" : "#dc2626";
  const pctBg    = pct >= 75 ? "#ECFDF5" : pct >= 50 ? "#FEF3C7" : "#fef2f2";

  const stStyle = (s) => s === "present"
    ? { bg: "#ECFDF5", color: "#059669", label: "✅ Present" }
    : { bg: "#fef2f2", color: "#dc2626", label: "❌ Absent" };

  return (
    <div>
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1a1d2e" }}>My Attendance</h1>
        <p style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>Your daily attendance record</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 3fr", gap: 14, marginBottom: 20 }}>
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e4e7f0", padding: 20, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 100, height: 100, borderRadius: "50%", background: `conic-gradient(${pctColor} ${pct * 3.6}deg, #f3f4f6 0deg)`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
            <div style={{ width: 74, height: 74, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 20, fontWeight: 800, color: pctColor }}>{pct}%</span>
            </div>
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1d2e" }}>Attendance</div>
          <div style={{ fontSize: 11, color: pctColor, fontWeight: 600, marginTop: 3, padding: "2px 10px", borderRadius: 20, background: pctBg }}>
            {pct >= 75 ? "Good ✓" : pct >= 50 ? "Average ⚠️" : "Low ❌"}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
          {[
            { label: "Total Days",   val: stats.total,   icon: "📅", bg: "#EEF2FF", color: "#5B5EA6" },
            { label: "Present Days", val: stats.present, icon: "✅", bg: "#ECFDF5", color: "#059669" },
            { label: "Absent Days",  val: stats.absent,  icon: "❌", bg: "#fef2f2", color: "#dc2626" },
          ].map((c, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 12, border: "1px solid #e4e7f0", padding: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ fontSize: 10, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600 }}>{c.label}</div>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: c.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{c.icon}</div>
              </div>
              <div style={{ fontSize: 32, fontWeight: 700, color: "#1a1d2e", marginTop: 10 }}>{loading ? "—" : c.val}</div>
            </div>
          ))}
          <div style={{ gridColumn: "1/-1", background: "#fff", borderRadius: 12, border: "1px solid #e4e7f0", padding: "14px 18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Overall Progress</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: pctColor }}>{pct}%</span>
            </div>
            <div style={{ height: 10, borderRadius: 6, background: "#f3f4f6", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${pct}%`, borderRadius: 6, background: pctColor }} />
            </div>
            <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 6 }}>
              {pct >= 75 ? "Great attendance! Keep it up." : pct >= 50 ? "Try to improve attendance." : "Attendance is very low. Please attend regularly."}
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e4e7f0", overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "10px 20px", background: "#f8fafc", borderBottom: "1px solid #e4e7f0" }}>
          {["Date", "Day", "Status"].map(h => (
            <span key={h} style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</span>
          ))}
        </div>
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "#9ca3af" }}>Loading attendance...</div>
        ) : records.length === 0 ? (
          <div style={{ padding: 50, textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>📅</div>
            <p style={{ fontWeight: 600, color: "#374151" }}>No attendance records yet</p>
            <p style={{ fontSize: 13, color: "#9ca3af" }}>Teacher hasn't marked attendance yet</p>
          </div>
        ) : records.map((r, i) => {
          const st  = stStyle(r.status);
          const d   = new Date(r.date);
          const day = d.toLocaleDateString("en-IN", { weekday: "long" });
          const dt  = d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
          return (
            <div key={r._id} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", alignItems: "center", padding: "12px 20px", borderBottom: i < records.length - 1 ? "1px solid #f3f4f6" : "none", background: r.status === "present" ? "rgba(236,253,245,0.3)" : "rgba(254,242,242,0.3)" }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: "#1a1d2e" }}>{dt}</span>
              <span style={{ fontSize: 13, color: "#6b7280" }}>{day}</span>
              <span style={{ padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: st.bg, color: st.color, display: "inline-block" }}>{st.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

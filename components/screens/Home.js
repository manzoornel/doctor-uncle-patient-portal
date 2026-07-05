"use client";
import { Calendar, FileText, MessageCircle, HeartPulse, Droplet, Weight, ChevronRight, Phone } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { T, CLINIC_PHONE } from "../../lib/theme";
import { VitalPill, Spinner, ErrorBox } from "../ui";

export function HomeScreen({ c, session, data, setScreen, setSelectedVisit }) {
  const { visits, appointments, loading, error, reload } = data;

  if (loading) return <Spinner />;
  if (error) return <ErrorBox text={c.error} onRetry={reload} />;

  const latest = visits?.[0];
  const nextAppt = appointments?.[0];
  const sugarTrend = (visits || [])
    .slice()
    .reverse()
    .map((v) => ({ date: (v.date || "").slice(5), sugar: v.vitals?.sugar }))
    .filter((d) => d.sugar != null);

  return (
    <div style={{ padding: "18px 20px 90px" }}>
      <div style={{ fontSize: 14, color: "#7A8A8F" }}>
        {c.hi}{session?.name ? `, ${session.name}` : ""} 👋
      </div>
      <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 20, color: T.dark, marginBottom: 16 }}>
        {c.appName}
      </div>

      <div style={{
        background: `linear-gradient(135deg, ${T.teal}, ${T.tealDark})`, borderRadius: 18, padding: 16,
        color: "#fff", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div>
          <div style={{ fontSize: 11, opacity: 0.85 }}>{c.nextVisit}</div>
          {nextAppt ? (
            <>
              <div style={{ fontWeight: 800, fontSize: 15, marginTop: 4 }}>
                {nextAppt.doctor_name || nextAppt.doctor} · {nextAppt.slot_date}
              </div>
              <div style={{ fontSize: 12, opacity: 0.9 }}>
                {nextAppt.slot_time} · Token {nextAppt.token_no}
              </div>
            </>
          ) : (
            <div style={{ fontWeight: 700, fontSize: 14, marginTop: 6 }}>{c.noVisit}</div>
          )}
        </div>
        <button onClick={() => setScreen("appointments")} style={{ background: "none", border: "none", cursor: "pointer" }}>
          <ChevronRight size={20} color="#fff" />
        </button>
      </div>

      {latest && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: T.dark }}>{c.latestVitals}</div>
            <button
              onClick={() => { setSelectedVisit(latest); setScreen("visit"); }}
              style={{ border: "none", background: "none", color: T.tealDark, fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}
            >
              {c.viewAll}
            </button>
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            <VitalPill icon={HeartPulse} label="BP" value={latest.vitals?.bp ?? "—"} unit="" />
            <VitalPill icon={Droplet} label="Sugar" value={latest.vitals?.sugar ?? "—"} unit="mg/dL" />
            <VitalPill icon={Weight} label="Weight" value={latest.vitals?.weight ?? "—"} unit="kg" />
          </div>
        </>
      )}

      <div style={{ fontWeight: 700, fontSize: 14, color: T.dark, marginBottom: 10 }}>{c.quickActions}</div>
      <div style={{ display: "flex", gap: 10 }}>
        {[
          { icon: Calendar, label: c.bookAppt, key: "appointments" },
          { icon: FileText, label: c.myRecords, key: "records" },
          { icon: MessageCircle, label: c.askAi, key: "chat" },
        ].map((a) => (
          <button key={a.key} onClick={() => setScreen(a.key)} style={{
            flex: 1, background: "#fff", border: `1px solid ${T.border}`, borderRadius: 16,
            padding: "18px 6px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, cursor: "pointer",
          }}>
            <a.icon size={26} color={T.coral} />
            <span style={{ fontSize: 12.5, fontWeight: 700, color: T.dark, textAlign: "center" }}>{a.label}</span>
          </button>
        ))}
      </div>

      <a href={`tel:${CLINIC_PHONE}`} style={{
        marginTop: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
        background: T.green, color: "#fff", borderRadius: 16, padding: "16px 0",
        fontWeight: 800, fontSize: 15.5, textDecoration: "none",
      }}>
        <Phone size={20} /> {c.callClinic}
      </a>

      {sugarTrend.length > 1 && (
        <>
          <div style={{ fontWeight: 700, fontSize: 14, color: T.dark, margin: "20px 0 10px" }}>
            {c.vitalsTrend} — Sugar
          </div>
          <div style={{ background: "#fff", borderRadius: 14, border: `1px solid ${T.border}`, padding: "10px 6px 0" }}>
            <ResponsiveContainer width="100%" height={110}>
              <LineChart data={sugarTrend}>
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#A9A199" }} axisLine={false} tickLine={false} />
                <YAxis hide domain={["dataMin-10", "dataMax+10"]} />
                <Tooltip />
                <Line type="monotone" dataKey="sugar" stroke={T.coral} strokeWidth={2.5} dot={{ r: 3, fill: T.coral }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}

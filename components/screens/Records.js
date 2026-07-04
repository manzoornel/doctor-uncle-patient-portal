"use client";
import { ChevronRight, HeartPulse, Droplet, Activity, Pill } from "lucide-react";
import { T, flagColor } from "../../lib/theme";
import { VitalPill, Spinner, ErrorBox } from "../ui";

export function RecordsScreen({ c, visits, loading, error, reload, setScreen, setSelectedVisit }) {
  if (loading) return <Spinner />;
  if (error) return <ErrorBox text={c.error} onRetry={reload} />;

  return (
    <div style={{ padding: "14px 20px 90px" }}>
      <div style={{ fontWeight: 700, fontSize: 14, color: T.dark, marginBottom: 12 }}>{c.visitHistory}</div>
      {(visits || []).map((v) => (
        <button
          key={v.visit_id || v.id}
          onClick={() => { setSelectedVisit(v); setScreen("visit"); }}
          style={{
            width: "100%", textAlign: "left", background: "#fff", border: `1px solid ${T.border}`,
            borderRadius: 16, padding: 14, marginBottom: 10, cursor: "pointer",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}
        >
          <div>
            <div style={{ fontWeight: 700, fontSize: 13.5, color: T.dark }}>{v.doctor_name || v.doctor}</div>
            <div style={{ fontSize: 12, color: "#7A8A8F", marginTop: 2 }}>
              {v.date} {v.vitals?.bp ? `· BP ${v.vitals.bp}` : ""} {v.vitals?.sugar ? `· Sugar ${v.vitals.sugar}` : ""}
            </div>
          </div>
          <ChevronRight size={18} color="#A9A199" />
        </button>
      ))}
      {(!visits || visits.length === 0) && (
        <div style={{ color: "#7A8A8F", fontSize: 13.5, textAlign: "center", marginTop: 30, lineHeight: 1.5 }}>
          {c.noRecordsYet}
        </div>
      )}
    </div>
  );
}

export function VisitScreen({ c, visit, labs, meds, loading, error }) {
  if (loading) return <Spinner />;

  return (
    <div style={{ padding: "14px 20px 90px" }}>
      <div style={{ fontWeight: 800, fontSize: 15, color: T.dark }}>{visit.doctor_name || visit.doctor}</div>
      <div style={{ fontSize: 12, color: "#7A8A8F", marginBottom: 14 }}>
        {visit.date} · Visit #{visit.visit_id || visit.id}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        <VitalPill icon={HeartPulse} label="BP" value={visit.vitals?.bp ?? "—"} unit="" />
        <VitalPill icon={Droplet} label="Sugar" value={visit.vitals?.sugar ?? "—"} unit="mg/dL" />
        <VitalPill icon={Activity} label="Pulse" value={visit.vitals?.pulse ?? "—"} unit="bpm" />
      </div>

      <div style={{ fontWeight: 700, fontSize: 13.5, color: T.dark, marginBottom: 8 }}>{c.labReports}</div>
      {error && <div style={{ color: T.coral, fontSize: 12.5, marginBottom: 8 }}>{c.error}</div>}
      {(labs || []).map((l, i) => (
        <div key={i} style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "10px 12px", background: "#fff", border: `1px solid ${T.border}`, borderRadius: 12, marginBottom: 6,
        }}>
          <span style={{ fontSize: 13, color: T.dark }}>{l.name || l.test_name}</span>
          <span style={{ fontSize: 13, fontWeight: 800, color: flagColor(l.flag) }}>{l.value} {l.unit}</span>
        </div>
      ))}
      {(!labs || labs.length === 0) && <div style={{ color: "#7A8A8F", fontSize: 12.5, marginBottom: 12 }}>—</div>}

      <div style={{ fontWeight: 700, fontSize: 13.5, color: T.dark, margin: "16px 0 8px" }}>{c.medications}</div>
      {(meds || []).map((m, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: T.tint, borderRadius: 12, marginBottom: 6 }}>
          <Pill size={16} color={T.tealDark} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.dark }}>{m.name || m.medicine_name}</div>
            <div style={{ fontSize: 11.5, color: "#7A8A8F" }}>{m.dose || m.dosage} {m.days ? `· ${m.days} days` : ""}</div>
          </div>
        </div>
      ))}
      {(!meds || meds.length === 0) && <div style={{ color: "#7A8A8F", fontSize: 12.5 }}>—</div>}
    </div>
  );
}

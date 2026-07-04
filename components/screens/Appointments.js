"use client";
import { useState, useEffect } from "react";
import { ChevronRight, Check } from "lucide-react";
import { T } from "../../lib/theme";
import { api } from "../../lib/api";
import { Spinner, ErrorBox } from "../ui";

export function AppointmentsScreen({ c, lang, doctors, loading, error, reload, setScreen, setDoctor }) {
  if (loading) return <Spinner />;
  if (error) return <ErrorBox text={c.error} onRetry={reload} />;

  return (
    <div style={{ padding: "0 20px 90px" }}>
      <div style={{ fontWeight: 700, fontSize: 14, color: T.dark, margin: "14px 0 10px" }}>{c.doctors}</div>
      {(doctors || []).map((d) => (
        <button
          key={d.doctor_id || d.id}
          onClick={() => { setDoctor(d); setScreen("slots"); }}
          style={{
            width: "100%", display: "flex", alignItems: "center", gap: 12, background: "#fff",
            border: `1px solid ${T.border}`, borderRadius: 16, padding: 12, marginBottom: 10,
            cursor: "pointer", textAlign: "left",
          }}
        >
          <div style={{
            width: 44, height: 44, borderRadius: 12, background: T.tint, color: T.tealDark,
            fontWeight: 800, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {(d.name || d.doctor_name || "DR").split(" ").map((w) => w[0]).slice(0, 2).join("")}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: T.dark }}>{d.name || d.doctor_name}</div>
            <div style={{ fontSize: 12, color: "#7A8A8F" }}>{d.department || d.specialization || ""}</div>
          </div>
          <ChevronRight size={18} color="#A9A199" />
        </button>
      ))}
      {(!doctors || doctors.length === 0) && (
        <div style={{ color: "#7A8A8F", fontSize: 13, textAlign: "center", marginTop: 30 }}>—</div>
      )}
    </div>
  );
}

export function SlotsScreen({ c, session, doctor, bookingDate }) {
  const todayStr = new Date().toISOString().slice(0, 10);
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

  const [date, setDate] = useState(bookingDate || todayStr);
  const [slots, setSlots] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sel, setSel] = useState(null);
  const [booking, setBooking] = useState(false);
  const [done, setDone] = useState(false);

  async function loadSlots(forDate) {
    setLoading(true);
    setError("");
    setSel(null);
    try {
      const res = await api.getDoctorSlots(session.token, doctor.doctor_id || doctor.id, forDate);
      // ASSUMPTION: response is either an array of slot times, or { slots: [...] }
      setSlots(Array.isArray(res) ? res : res.slots || []);
    } catch (e) {
      setError(c.error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadSlots(date); }, [date]); // eslint-disable-line react-hooks/exhaustive-deps

  async function confirm() {
    setBooking(true);
    try {
      await api.createAppointment(
        session.token,
        doctor.doctor_id || doctor.id,
        date,
        sel.token_no || sel.token || 0,
        sel.time || sel
      );
      setDone(true);
    } catch (e) {
      setError(c.error);
    } finally {
      setBooking(false);
    }
  }

  if (done) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40, textAlign: "center" }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: T.green, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
          <Check size={30} color="#fff" />
        </div>
        <div style={{ fontWeight: 800, fontSize: 17, color: T.dark }}>{c.booked}</div>
        <div style={{ fontSize: 13, color: "#7A8A8F", marginTop: 6 }}>
          {doctor.name || doctor.doctor_name} · {sel?.time || sel}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "14px 20px 90px" }}>
      <div style={{ fontWeight: 700, fontSize: 15, color: T.dark, marginBottom: 12 }}>
        {c.selectSlot} — {doctor.name || doctor.doctor_name}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {[
          { label: c.today, value: todayStr },
          { label: c.tomorrow, value: tomorrowStr },
        ].map((d) => (
          <button key={d.value} onClick={() => setDate(d.value)} style={{
            flex: 1, padding: "12px 0", borderRadius: 14,
            border: `1.5px solid ${date === d.value ? T.teal : T.border}`,
            background: date === d.value ? T.tint : "#fff",
            color: date === d.value ? T.tealDark : T.dark,
            fontWeight: 800, fontSize: 14.5, cursor: "pointer",
          }}>
            {d.label}
          </button>
        ))}
      </div>

      {loading && <Spinner />}
      {error && <div style={{ color: T.coral, fontSize: 12.5, marginBottom: 10 }}>{error}</div>}

      {!loading && (slots || []).length === 0 && !error && (
        <div style={{ color: "#7A8A8F", fontSize: 13.5, textAlign: "center", padding: "24px 10px" }}>
          {c.noSlots}
        </div>
      )}

      {!loading && (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        {(slots || []).map((s, i) => {
          const label = s.time || s;
          const active = sel && (sel.time || sel) === label;
          return (
            <button key={i} onClick={() => setSel(s)} style={{
              padding: "14px 0", borderRadius: 14, border: `1.5px solid ${active ? T.teal : T.border}`,
              background: active ? T.tint : "#fff", color: active ? T.tealDark : T.dark,
              fontWeight: 700, fontSize: 14, cursor: "pointer",
            }}>
              {label}
            </button>
          );
        })}
      </div>
      )}
      <button disabled={!sel || booking} onClick={confirm} style={{
        marginTop: 26, width: "100%", padding: "14px 0", borderRadius: 14, border: "none",
        background: !sel || booking ? "#CFE9EB" : T.teal, color: "#fff", fontWeight: 700, fontSize: 15,
        cursor: !sel ? "default" : "pointer",
      }}>
        {booking ? c.loading : c.confirmBooking}
      </button>
    </div>
  );
}

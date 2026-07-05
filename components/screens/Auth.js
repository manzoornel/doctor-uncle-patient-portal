"use client";
import { useState } from "react";
import { Stethoscope, Phone } from "lucide-react";
import { T } from "../../lib/theme";
import { api } from "../../lib/api";

export function LoginScreen({ c, onOtpSent }) {
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function sendOtp() {
    setLoading(true);
    setError("");
    try {
      // Step 1: find the patient record for this mobile (live portal flow)
      const lookup = await api.getPatientsByMobile(mobile);
      const patients = lookup?.data || [];
      if (!patients.length || !patients[0]?.patient_id) {
        setError(
          c.appName === "ഡോക്ടർ അങ്കിൾ"
            ? "ഈ നമ്പറിൽ രോഗി രജിസ്റ്റർ ചെയ്തിട്ടില്ല. ക്ലിനിക്കിൽ ബന്ധപ്പെടുക."
            : "No patient found with this number. Please contact the clinic."
        );
        setLoading(false);
        return;
      }
      // Step 2: request OTP using the patient_id
      await api.getLoginOTP(patients[0].patient_id);
      onOtpSent(mobile, patients[0].patient_id);
    } catch (e) {
      setError(c.error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      padding: "70px 26px", minHeight: "100%", display: "flex", flexDirection: "column",
      alignItems: "center", background: `linear-gradient(180deg, ${T.tint} 0%, ${T.cream} 55%)`,
    }}>
      <div style={{
        width: 84, height: 84, borderRadius: 24, background: T.teal,
        display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 22,
        boxShadow: "0 10px 24px -8px rgba(37,190,203,0.6)",
      }}>
        <Stethoscope size={40} color="#fff" />
      </div>
      <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 24, color: T.dark }}>
        {c.appName}
      </div>
      <div style={{ fontSize: 13.5, color: "#7A8A8F", marginTop: 4, marginBottom: 40 }}>{c.tagline}</div>

      <div style={{ width: "100%" }}>
        <label style={{ fontSize: 12.5, color: T.dark, fontWeight: 700 }}>{c.enterMobile}</label>
        <div style={{
          display: "flex", alignItems: "center", gap: 8, background: "#fff",
          border: `1.5px solid ${T.border}`, borderRadius: 14, padding: "12px 14px", marginTop: 8,
        }}>
          <Phone size={18} color={T.tealDark} />
          <input
            value={mobile}
            onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
            placeholder="98470 XXXXX"
            style={{ border: "none", outline: "none", fontSize: 15, flex: 1, background: "transparent", color: T.dark }}
          />
        </div>
      </div>

      {error && <div style={{ color: T.coral, fontSize: 12.5, marginTop: 10 }}>{error}</div>}

      <button
        onClick={sendOtp}
        disabled={mobile.length < 10 || loading}
        style={{
          marginTop: 26, width: "100%", padding: "14px 0", borderRadius: 14, border: "none",
          background: mobile.length < 10 || loading ? "#CFE9EB" : T.teal, color: "#fff",
          fontWeight: 700, fontSize: 15, cursor: mobile.length < 10 ? "default" : "pointer",
        }}
      >
        {loading ? c.loading : c.sendOtp}
      </button>
    </div>
  );
}

export function OtpScreen({ c, mobile, onVerified }) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function verify() {
    setLoading(true);
    setError("");
    try {
      const res = await api.patientLogin(mobile, otp);
      // Live portal response: { code: 1, data: { token, patient_name, uhid, ... } }
      const d = res?.data;
      if (!d?.token) throw new Error("no token");
      onVerified(d.token, {
        name: d.patient_name || "",
        uhid: d.uhid || "",
        patient_id: d.patient_id || "",
      });
    } catch (e) {
      setError(c.error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: "70px 26px", minHeight: "100%", background: T.cream }}>
      <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 19, color: T.dark, marginBottom: 6 }}>
        {c.enterOtp}
      </div>
      <div style={{ fontSize: 13, color: "#7A8A8F", marginBottom: 30 }}>+91 {mobile}</div>
      <input
        value={otp}
        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
        placeholder="••••••"
        style={{
          width: "100%", textAlign: "center", letterSpacing: 8, fontSize: 22, padding: "14px 0",
          borderRadius: 14, border: `1.5px solid ${T.border}`, outline: "none", color: T.dark,
        }}
      />
      {error && <div style={{ color: T.coral, fontSize: 12.5, marginTop: 10 }}>{error}</div>}
      <button
        onClick={verify}
        disabled={otp.length < 4 || loading}
        style={{
          marginTop: 22, width: "100%", padding: "14px 0", borderRadius: 14, border: "none",
          background: otp.length < 4 || loading ? "#CFE9EB" : T.teal, color: "#fff",
          fontWeight: 700, fontSize: 15, cursor: otp.length < 4 ? "default" : "pointer",
        }}
      >
        {loading ? c.loading : c.verify}
      </button>
    </div>
  );
}

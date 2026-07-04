"use client";
import { useState, useEffect, useCallback } from "react";
import { Stethoscope } from "lucide-react";
import { T, copy } from "../lib/theme";
import { api } from "../lib/api";
import { TopBar, BottomNav } from "./ui";
import { LoginScreen, OtpScreen } from "./screens/Auth";
import { HomeScreen } from "./screens/Home";
import { AppointmentsScreen, SlotsScreen } from "./screens/Appointments";
import { RecordsScreen, VisitScreen } from "./screens/Records";
import { ChatScreen } from "./screens/Chat";
import { ProfileScreen } from "./screens/Profile";

const SESSION_KEY = "du_patient_session";

export default function PatientApp() {
  const [lang, setLang] = useState("ml");
  const [screen, setScreen] = useState("login");
  const [session, setSession] = useState(null); // { token, mobile }
  const [pendingMobile, setPendingMobile] = useState("");
  const [hydrated, setHydrated] = useState(false);

  const [doctors, setDoctors] = useState([]);
  const [doctorsLoading, setDoctorsLoading] = useState(true);
  const [doctorsError, setDoctorsError] = useState("");

  const [visits, setVisits] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [homeLoading, setHomeLoading] = useState(true);
  const [homeError, setHomeError] = useState("");

  const [doctor, setDoctor] = useState(null);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [labs, setLabs] = useState([]);
  const [meds, setMeds] = useState([]);
  const [visitDetailLoading, setVisitDetailLoading] = useState(false);
  const [visitDetailError, setVisitDetailError] = useState("");

  const c = copy[lang];

  // Restore session from localStorage on first load (real app, not artifact).
  useEffect(() => {
    const raw = typeof window !== "undefined" ? window.localStorage.getItem(SESSION_KEY) : null;
    if (raw) {
      try {
        const s = JSON.parse(raw);
        setSession(s);
        setScreen("home");
      } catch {}
    }
    setHydrated(true);
  }, []);

  const loadHomeData = useCallback(async (tok) => {
    setHomeLoading(true);
    setHomeError("");
    try {
      const [visitsRes, apptRes] = await Promise.all([
        api.fetchPatientVisits(tok),
        api.fetchAppointments(tok),
      ]);
      // ASSUMPTION: both endpoints return arrays directly, or { data: [...] }.
      setVisits(Array.isArray(visitsRes) ? visitsRes : visitsRes.data || []);
      setAppointments(Array.isArray(apptRes) ? apptRes : apptRes.data || []);
    } catch (e) {
      setHomeError(String(e));
    } finally {
      setHomeLoading(false);
    }
  }, []);

  const loadDoctors = useCallback(async (tok) => {
    setDoctorsLoading(true);
    setDoctorsError("");
    try {
      const res = await api.listDoctors(tok);
      setDoctors(Array.isArray(res) ? res : res.data || []);
    } catch (e) {
      setDoctorsError(String(e));
    } finally {
      setDoctorsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session?.token) {
      loadHomeData(session.token);
      loadDoctors(session.token);
    }
  }, [session, loadHomeData, loadDoctors]);

  async function loadVisitDetail(visit) {
    setVisitDetailLoading(true);
    setVisitDetailError("");
    try {
      const visitId = visit.visit_id || visit.id;
      const [labsRes, medsRes] = await Promise.all([
        api.fetchLabReports(session.token, visitId),
        api.fetchPatientMedications(session.token, visitId),
      ]);
      setLabs(Array.isArray(labsRes) ? labsRes : labsRes.data || []);
      setMeds(Array.isArray(medsRes) ? medsRes : medsRes.data || []);
    } catch (e) {
      setVisitDetailError(String(e));
    } finally {
      setVisitDetailLoading(false);
    }
  }

  useEffect(() => {
    if (screen === "visit" && selectedVisit) loadVisitDetail(selectedVisit);
  }, [screen, selectedVisit]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleVerified(token) {
    const s = { token, mobile: pendingMobile };
    setSession(s);
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(s));
    setScreen("home");
  }

  function handleLogout() {
    window.localStorage.removeItem(SESSION_KEY);
    setSession(null);
    setScreen("login");
  }

  const showTopBar = !["login", "otp"].includes(screen);
  const showNav = session && screen !== "login" && screen !== "otp";

  const titleMap = {
    home: "",
    appointments: c.doctors,
    slots: c.selectSlot,
    records: c.visitHistory,
    visit: selectedVisit ? `Visit #${selectedVisit.visit_id || selectedVisit.id}` : "",
    chat: c.askAi,
    profile: c.profile,
  };

  const patientContext = { visits, appointments };

  if (!hydrated) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: T.cream }}>
        <Stethoscope size={32} color={T.teal} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: T.cream, maxWidth: 480, margin: "0 auto", position: "relative" }}>
      {showTopBar && (
        <TopBar
          title={titleMap[screen]}
          lang={lang}
          setLang={setLang}
          onBack={
            screen === "slots" ? () => setScreen("appointments") :
            screen === "visit" ? () => setScreen("records") :
            null
          }
        />
      )}

      {screen === "login" && (
        <LoginScreen c={c} onOtpSent={(mobile) => { setPendingMobile(mobile); setScreen("otp"); }} />
      )}
      {screen === "otp" && (
        <OtpScreen c={c} mobile={pendingMobile} onVerified={handleVerified} />
      )}
      {screen === "home" && session && (
        <HomeScreen
          c={c}
          session={session}
          data={{ visits, appointments, loading: homeLoading, error: homeError, reload: () => loadHomeData(session.token) }}
          setScreen={setScreen}
          setSelectedVisit={setSelectedVisit}
        />
      )}
      {screen === "appointments" && (
        <AppointmentsScreen
          c={c} lang={lang} doctors={doctors} loading={doctorsLoading} error={doctorsError}
          reload={() => loadDoctors(session.token)} setScreen={setScreen} setDoctor={setDoctor}
        />
      )}
      {screen === "slots" && doctor && (
        <SlotsScreen c={c} session={session} doctor={doctor} bookingDate={new Date().toISOString().slice(0, 10)} />
      )}
      {screen === "records" && (
        <RecordsScreen
          c={c} visits={visits} loading={homeLoading} error={homeError}
          reload={() => loadHomeData(session.token)} setScreen={setScreen} setSelectedVisit={setSelectedVisit}
        />
      )}
      {screen === "visit" && selectedVisit && (
        <VisitScreen c={c} visit={selectedVisit} labs={labs} meds={meds} loading={visitDetailLoading} error={visitDetailError} />
      )}
      {screen === "chat" && (
        <ChatScreen c={c} lang={lang} patientContext={patientContext} />
      )}
      {screen === "profile" && (
        <ProfileScreen c={c} mobile={session?.mobile} onLogout={handleLogout} />
      )}

      {showNav && <BottomNav screen={screen} setScreen={setScreen} c={c} />}
    </div>
  );
}

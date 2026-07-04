import { NextResponse } from "next/server";
import { grandis } from "../../../lib/grandisServer";

// Every call the app is allowed to make. Keeping this as an explicit
// whitelist (rather than forwarding any "api" name from the client)
// means the browser can never call an arbitrary Grandis endpoint.
const ACTIONS = {
  getLoginOTP: (p) => grandis.getLoginOTP(p.mobile),
  patientLogin: (p) => grandis.patientLogin(p.mobile, p.otp),
  fetchAppointments: (p) => grandis.fetchAppointments(p.token),
  listDoctors: (p) => grandis.listDoctors(p.token),
  getDoctorSlots: (p) => grandis.getDoctorSlots(p.token, p.doctor_id, p.booking_date),
  createAppointment: (p) =>
    grandis.createAppointment(p.token, p.doctor_id, p.slot_date, p.token_no, p.slot_time),
  fetchPatientVisits: (p) => grandis.fetchPatientVisits(p.token),
  fetchVitals: (p) => grandis.fetchVitals(p.token),
  fetchLabReports: (p) => grandis.fetchLabReports(p.token, p.visit_id),
  fetchPatientMedications: (p) => grandis.fetchPatientMedications(p.token, p.visit_id),
};

export async function POST(req) {
  try {
    const { action, ...params } = await req.json();
    const handler = ACTIONS[action];
    if (!handler) {
      return NextResponse.json({ error: `Unknown action "${action}"` }, { status: 400 });
    }
    const data = await handler(params);
    return NextResponse.json(data);
  } catch (err) {
    console.error("Grandis proxy error:", err);
    return NextResponse.json({ error: "Grandis request failed" }, { status: 502 });
  }
}

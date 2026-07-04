import { NextResponse } from "next/server";
import { grandis } from "../../../lib/grandisServer";

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
    const body = await req.json();
    const { action, ...params } = body;
    console.log("[API /grandis] action:", action, "params:", JSON.stringify(params));

    const handler = ACTIONS[action];
    if (!handler) {
      return NextResponse.json({ error: `Unknown action "${action}"` }, { status: 400 });
    }

    const data = await handler(params);
    console.log("[API /grandis] success for:", action);
    return NextResponse.json(data);
  } catch (err) {
    console.error("[API /grandis] ERROR:", err.message);
    return NextResponse.json(
      { error: err.message || "Grandis request failed" },
      { status: 502 }
    );
  }
}


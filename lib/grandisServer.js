/**
 * Server-side Grandis API client.
 *
 * IMPORTANT — CONFIRM WITH GRANDIS BEFORE GOING LIVE:
 * The PDF you shared lists the API name, description, and the header/body
 * fields each endpoint expects, but doesn't show a raw sample request/response.
 * This client assumes the common Grandis pattern:
 *   POST { api: "<apiName>", ...otherFields }  to the single mirror endpoint,
 *   with "token" sent as a normal body field (not an HTTP header) once logged in.
 *
 * Ask Grandis support to confirm (or send you a Postman collection for):
 *   1. Exact request shape (is "api" the right key name?)
 *   2. Where the auth token goes (body field vs. HTTP header)
 *   3. Exact response JSON shape for each endpoint (field names for
 *      vitals, lab values, medication dosage, etc.)
 * Once confirmed, only this file needs to change — nothing in the UI does.
 */

const GRANDIS_BASE_URL =
  process.env.GRANDIS_BASE_URL ||
  "http://103.99.205.192:8008/mirrors/Dr_Mirror/public";

async function callGrandis(apiName, fields = {}) {
  const res = await fetch(GRANDIS_BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ api: apiName, ...fields }),
    // Grandis server is on a plain HTTP internal IP — this call must happen
    // server-side (Next.js API route), never from the browser.
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Grandis API "${apiName}" failed with status ${res.status}`);
  }
  return res.json();
}

export const grandis = {
  getLoginOTP: (mobile) => callGrandis("getLoginOTP", { mobile }),
  patientLogin: (mobile, otp) => callGrandis("patientLogin", { mobile, otp }),
  fetchAppointments: (token) => callGrandis("fetchAppointments", { token }),
  listDoctors: (token) => callGrandis("listDoctors", { token }),
  getDoctorSlots: (token, doctor_id, booking_date) =>
    callGrandis("getDoctorSlots", { token, doctor_id, booking_date }),
  createAppointment: (token, doctor_id, slot_date, token_no, slot_time) =>
    callGrandis("createAppointment", { token, doctor_id, slot_date, token_no, slot_time }),
  fetchPatientVisits: (token) => callGrandis("fetchPatientVisits", { token }),
  fetchVitals: (token) => callGrandis("fetchVitals", { token }),
  fetchLabReports: (token, visit_id) => callGrandis("fetchLabReports", { token, visit_id }),
  fetchPatientMedications: (token, visit_id) =>
    callGrandis("fetchPatientMedications", { token, visit_id }),
};

/**
 * Server-side Grandis API client.
 *
 * The Grandis API PDF shows fields in format  mobile:1234567890
 * which is form-encoded (not JSON). This file sends as form data.
 * All console.log lines appear in your Vercel "Function Logs" so you
 * can see exactly what Grandis replies — useful for debugging.
 */

const GRANDIS_BASE_URL =
  process.env.GRANDIS_BASE_URL ||
  "http://103.99.205.192:8008/mirrors/Dr_Mirror/public";

async function callGrandis(apiName, fields = {}) {
  const formBody = new URLSearchParams({ api: apiName, ...fields });

  console.log("[Grandis] →", apiName, JSON.stringify(fields));

  let res;
  try {
    res = await fetch(GRANDIS_BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formBody.toString(),
      cache: "no-store",
    });
  } catch (networkErr) {
    console.error("[Grandis] Network error:", networkErr.message);
    throw new Error("Cannot reach Grandis server: " + networkErr.message);
  }

  const rawText = await res.text();
  console.log("[Grandis] ←", apiName, "status=" + res.status, "body=" + rawText.slice(0, 400));

  if (!res.ok) {
    throw new Error("Grandis " + apiName + " HTTP " + res.status + ": " + rawText.slice(0, 200));
  }

  try {
    return JSON.parse(rawText);
  } catch {
    // Some endpoints return plain text (e.g. "OTP sent successfully")
    return { message: rawText, success: true };
  }
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


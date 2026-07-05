/**
 * Server-side Grandis API client — matches the LIVE working portal exactly.
 *
 * Base: https://clinictrial.grandissolutions.in/patientApp/
 * Pattern discovered from the working Trust Care portal:
 *   - Login flow params go in the URL query string, empty POST body
 *   - Authenticated calls send  Authorization: Bearer <token>
 *   - Every response is wrapped: { code: 1|0, data, status }
 *     code 1 = success, code 0 = error (message in "status")
 */

const GRANDIS_BASE_URL =
  process.env.GRANDIS_BASE_URL ||
  "https://clinictrial.grandissolutions.in/patientApp";

async function callGrandis(apiName, { query = {}, body = null, token = null } = {}) {
  const qs = new URLSearchParams(query).toString();
  const url = `${GRANDIS_BASE_URL}/${apiName}${qs ? "?" + qs : ""}`;
  console.log("[Grandis] →", url);

 const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json, text/plain, */*",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
    "Origin": "https://www.doctoruncle.in",
    "Referer": "https://www.doctoruncle.in/",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  let res;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body || {}),
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
  } catch (networkErr) {
    console.error("[Grandis] Network error:", networkErr.message);
    throw new Error("Cannot reach Grandis server: " + networkErr.message);
  }

  const rawText = await res.text();
  console.log("[Grandis] ←", apiName, "status=" + res.status, "body=" + rawText.slice(0, 300));

  if (!res.ok) {
    throw new Error("Grandis " + apiName + " HTTP " + res.status);
  }

  let json;
  try {
    json = JSON.parse(rawText);
  } catch {
    throw new Error("Grandis returned non-JSON response");
  }

  // Grandis wraps everything in { code, data, status }
  if (json.code === 0) {
    throw new Error(json.status || json.message || "Grandis request failed");
  }
  return json;
}

export const grandis = {
  // --- Login flow (3 steps, matching the live portal) ---
  getPatientsByMobile: (mobile) =>
    callGrandis("getPatientsByMobile", { query: { mobile } }),
  getLoginOTP: (patient_id) =>
    callGrandis("getLoginOTP", { query: { patient_id } }),
  patientLogin: (mobile, otp) =>
    callGrandis("patientLogin", { query: { mobile, otp } }),

  // --- Authenticated data calls ---
  fetchAppointments: (token) =>
    callGrandis("fetchAppointments", { token }),
  listDoctors: (token) =>
    callGrandis("listDoctors", { token }),
  getDoctorSlots: (token, doctor_id, booking_date) =>
    callGrandis("getDoctorSlots", { token, body: { doctor_id, booking_date } }),
  createAppointment: (token, doctor_id, slot_date, token_no, slot_time) =>
    callGrandis("createAppointment", {
      token,
      body: { doctor_id, slot_date, slot_time, token_no },
    }),
  fetchPatientVisits: (token) =>
    callGrandis("fetchPatientVisits", { token }),
  fetchVitals: (token, visit_id) =>
    callGrandis("fetchPatientVitals", { token, query: visit_id ? { visit_id } : {} }),
  fetchLabReports: (token, visit_id) =>
    callGrandis("fetchLabReports", { token, query: visit_id ? { visit_id } : {} }),
  fetchPatientMedications: (token, visit_id) =>
    callGrandis("fetchPatientMedications", { token, query: visit_id ? { visit_id } : {} }),
};

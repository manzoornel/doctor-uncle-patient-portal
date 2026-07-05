// Calls Grandis directly from the browser — exactly like the old working portal.
const GRANDIS = "https://clinictrial.grandissolutions.in/patientApp";

async function grandisCall(apiName, query = {}, body = null, token = null) {
  const qs = new URLSearchParams(query).toString();
  const url = `${GRANDIS}/${apiName}${qs ? "?" + qs : ""}`;
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body || {}),
  });
  const json = await res.json();
  if (json?.code === 0) {
    throw new Error(json.status || json.message || "Grandis request failed");
  }
  return json;
}

export const api = {
  getPatientsByMobile: (mobile) => grandisCall("getPatientsByMobile", { mobile }),
  getLoginOTP: (patient_id) => grandisCall("getLoginOTP", { patient_id }),
  patientLogin: (mobile, otp) => grandisCall("patientLogin", { mobile, otp }),
  fetchAppointments: (token) => grandisCall("fetchAppointments", {}, null, token),
  listDoctors: (token) => grandisCall("listDoctors", {}, null, token),
  getDoctorSlots: (token, doctor_id, booking_date) =>
    grandisCall("getDoctorSlots", {}, { doctor_id, booking_date }, token),
  createAppointment: (token, doctor_id, slot_date, token_no, slot_time) =>
    grandisCall("createAppointment", {}, { doctor_id, slot_date, slot_time, token_no }, token),
  fetchPatientVisits: (token) => grandisCall("fetchPatientVisits", {}, null, token),
  fetchVitals: (token, visit_id) =>
    grandisCall("fetchPatientVitals", visit_id ? { visit_id } : {}, null, token),
  fetchLabReports: (token, visit_id) =>
    grandisCall("fetchLabReports", visit_id ? { visit_id } : {}, null, token),
  fetchPatientMedications: (token, visit_id) =>
    grandisCall("fetchPatientMedications", visit_id ? { visit_id } : {}, null, token),

  askAi: (question, patientContext, lang) =>
    fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, patientContext, lang }),
    }).then((r) => r.json()),
};

async function callGrandis(action, params = {}) {
  const res = await fetch("/api/grandis", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, ...params }),
  });
  if (!res.ok) throw new Error(`${action} failed`);
  return res.json();
}

export const api = {
  getPatientsByMobile: (mobile) => callGrandis("getPatientsByMobile", { mobile }),
  getLoginOTP: (patient_id) => callGrandis("getLoginOTP", { patient_id }),
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

  askAi: (question, patientContext, lang) =>
    fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, patientContext, lang }),
    }).then((r) => r.json()),
};

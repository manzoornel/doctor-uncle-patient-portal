export const T = {
  teal: "#25BECB",
  tealDark: "#1B8F98",
  dark: "#2D4047",
  cream: "#FBF8F3",
  card: "#FFFFFF",
  tint: "#E8F7F8",
  coral: "#FF7A59",
  green: "#3FA772",
  amber: "#E0A013",
  border: "#EAE4DA",
};

export const copy = {
  ml: {
    appName: "ഡോക്ടർ അങ്കിൾ",
    tagline: "നിങ്ങളുടെ ആരോഗ്യം, എപ്പോഴും കൈയിൽ",
    enterMobile: "മൊബൈൽ നമ്പർ നൽകുക",
    sendOtp: "OTP അയക്കുക",
    enterOtp: "OTP നൽകുക",
    verify: "സ്ഥിരീകരിക്കുക",
    hi: "നമസ്കാരം",
    nextVisit: "അടുത്ത അപ്പോയിന്റ്മെന്റ്",
    noVisit: "അപ്പോയിന്റ്മെന്റ് ഒന്നും ഇല്ല",
    bookNow: "ബുക്ക് ചെയ്യുക",
    latestVitals: "ഏറ്റവും പുതിയ വൈറ്റൽസ്",
    viewAll: "എല്ലാം കാണുക",
    quickActions: "വേഗത്തിൽ ചെയ്യാവുന്നവ",
    bookAppt: "അപ്പോയിന്റ്മെന്റ്",
    myRecords: "എന്റെ റെക്കോർഡുകൾ",
    askAi: "AI-യോട് ചോദിക്കുക",
    doctors: "ഡോക്ടർമാർ",
    selectSlot: "സ്ലോട്ട് തിരഞ്ഞെടുക്കുക",
    confirmBooking: "ബുക്കിംഗ് ഉറപ്പിക്കുക",
    booked: "ബുക്ക് ചെയ്തു!",
    visitHistory: "വിസിറ്റ് ചരിത്രം",
    labReports: "ലാബ് റിപ്പോർട്ടുകൾ",
    medications: "മരുന്നുകൾ",
    vitalsTrend: "വൈറ്റൽസ് ട്രെൻഡ്",
    chatPlaceholder: "മലയാളത്തിലോ ഇംഗ്ലീഷിലോ ചോദിക്കുക...",
    profile: "പ്രൊഫൈൽ",
    logout: "ലോഗ്ഔട്ട്",
    loading: "ലോഡ് ചെയ്യുന്നു...",
    error: "എന്തോ പ്രശ്നം ഉണ്ടായി. വീണ്ടും ശ്രമിക്കുക.",
    resend: "OTP വീണ്ടും അയക്കുക",
    callClinic: "ക്ലിനിക്കിലേക്ക് വിളിക്കുക",
    today: "ഇന്ന്",
    tomorrow: "നാളെ",
    noRecordsYet: "ഇതുവരെ വിസിറ്റുകൾ ഇല്ല. ക്ലിനിക്കിൽ വന്നതിനു ശേഷം ഇവിടെ കാണാം.",
    noSlots: "ഈ ദിവസം സ്ലോട്ടുകൾ ഇല്ല. വേറെ ദിവസം നോക്കുക.",
    tapToAsk: "ചോദിക്കാൻ ടാപ്പ് ചെയ്യുക:",
  },
  en: {
    appName: "Doctor Uncle",
    tagline: "Your health, always at hand",
    enterMobile: "Enter mobile number",
    sendOtp: "Send OTP",
    enterOtp: "Enter OTP",
    verify: "Verify",
    hi: "Hello",
    nextVisit: "Next appointment",
    noVisit: "No upcoming appointment",
    bookNow: "Book now",
    latestVitals: "Latest vitals",
    viewAll: "View all",
    quickActions: "Quick actions",
    bookAppt: "Book appointment",
    myRecords: "My records",
    askAi: "Ask AI",
    doctors: "Doctors",
    selectSlot: "Select a slot",
    confirmBooking: "Confirm booking",
    booked: "Booked!",
    visitHistory: "Visit history",
    labReports: "Lab reports",
    medications: "Medications",
    vitalsTrend: "Vitals trend",
    chatPlaceholder: "Ask in Malayalam or English...",
    profile: "Profile",
    logout: "Log out",
    loading: "Loading...",
    error: "Something went wrong. Please try again.",
    resend: "Resend OTP",
    callClinic: "Call clinic",
    today: "Today",
    tomorrow: "Tomorrow",
    noRecordsYet: "No visits yet. After your clinic visit, records appear here.",
    noSlots: "No slots on this day. Try another date.",
    tapToAsk: "Tap to ask:",
  },
};

// Clinic phone number shown on the Home screen "Call clinic" button.
// CHANGE THIS to the real reception number.
export const CLINIC_PHONE = "+919999999999";

// One-tap questions for the AI chat, so patients never have to type.
export const chatSuggestions = {
  ml: [
    "എന്റെ അവസാന ഷുഗർ എത്രയാണ്?",
    "എന്റെ ബിപി നോർമൽ ആണോ?",
    "ഞാൻ ഇപ്പോൾ കഴിക്കുന്ന മരുന്നുകൾ ഏതൊക്കെ?",
    "അടുത്ത അപ്പോയിന്റ്മെന്റ് എപ്പോഴാണ്?",
  ],
  en: [
    "What was my last sugar level?",
    "Is my BP normal?",
    "What medicines am I taking now?",
    "When is my next appointment?",
  ],
};

export function flagColor(f) {
  if (f === "high") return T.coral;
  if (f === "low") return T.amber;
  return T.green;
}

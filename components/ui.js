"use client";
import { Home, Calendar, FileText, MessageCircle, User, ChevronLeft } from "lucide-react";
import { T } from "../lib/theme";

export function TopBar({ title, onBack, lang, setLang }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "18px 20px 14px", background: T.cream, position: "sticky", top: 0, zIndex: 5,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 24 }}>
        {onBack && (
          <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
            <ChevronLeft size={22} color={T.dark} />
          </button>
        )}
      </div>
      <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 17, color: T.dark }}>
        {title}
      </div>
      <button
        onClick={() => setLang(lang === "ml" ? "en" : "ml")}
        style={{
          border: `1.5px solid ${T.teal}`, color: T.tealDark, background: T.tint,
          borderRadius: 20, padding: "4px 10px", fontSize: 12, fontWeight: 700, cursor: "pointer",
        }}
      >
        {lang === "ml" ? "EN" : "മല"}
      </button>
    </div>
  );
}

export function BottomNav({ screen, setScreen, c }) {
  const items = [
    { key: "home", icon: Home, label: c.hi === "നമസ്കാരം" ? "ഹോം" : "Home" },
    { key: "appointments", icon: Calendar, label: c.bookAppt.split(" ")[0] },
    { key: "records", icon: FileText, label: c.myRecords.split(" ")[0] },
    { key: "chat", icon: MessageCircle, label: "AI" },
    { key: "profile", icon: User, label: c.profile },
  ];
  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, height: 74, maxWidth: 480, margin: "0 auto",
      background: "#FFFFFF", borderTop: `1px solid ${T.border}`,
      display: "flex", alignItems: "center", justifyContent: "space-around", paddingBottom: 6,
    }}>
      {items.map((it) => {
        const active =
          screen === it.key ||
          (screen === "visit" && it.key === "records") ||
          (screen === "slots" && it.key === "appointments");
        const Icon = it.icon;
        return (
          <button key={it.key} onClick={() => setScreen(it.key)} style={{
            background: "none", border: "none", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
            color: active ? T.tealDark : "#A9A199", padding: 4,
          }}>
            <Icon size={22} strokeWidth={active ? 2.4 : 1.8} />
            <span style={{ fontSize: 10.5, fontWeight: active ? 700 : 500 }}>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function VitalPill({ icon: Icon, label, value, unit }) {
  return (
    <div style={{ flex: 1, background: T.tint, borderRadius: 14, padding: "12px 10px", display: "flex", flexDirection: "column", gap: 6 }}>
      <Icon size={16} color={T.tealDark} />
      <div style={{ fontSize: 15, fontWeight: 800, color: T.dark }}>
        {value}<span style={{ fontSize: 10.5, fontWeight: 600, color: "#7A8A8F" }}> {unit}</span>
      </div>
      <div style={{ fontSize: 10.5, color: "#7A8A8F" }}>{label}</div>
    </div>
  );
}

export function Spinner() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: 30 }}>
      <div style={{
        width: 26, height: 26, borderRadius: "50%",
        border: `3px solid ${T.border}`, borderTopColor: T.teal,
        animation: "spin 0.8s linear infinite",
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export function ErrorBox({ text, onRetry }) {
  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <div style={{ color: T.coral, fontSize: 13, marginBottom: 10 }}>{text}</div>
      {onRetry && (
        <button onClick={onRetry} style={{
          border: `1.5px solid ${T.coral}`, color: T.coral, background: "none",
          borderRadius: 10, padding: "6px 14px", fontSize: 12.5, fontWeight: 700, cursor: "pointer",
        }}>Retry</button>
      )}
    </div>
  );
}

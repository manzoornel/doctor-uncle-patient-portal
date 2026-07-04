"use client";
import { T } from "../../lib/theme";

export function ProfileScreen({ c, mobile, onLogout }) {
  return (
    <div style={{ padding: "24px 20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: T.tint, color: T.tealDark, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
          {(mobile || "").slice(-2) || "DU"}
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 16, color: T.dark }}>{c.profile}</div>
          <div style={{ fontSize: 12.5, color: "#7A8A8F" }}>+91 {mobile}</div>
        </div>
      </div>
      <button onClick={onLogout} style={{
        width: "100%", padding: "13px 0", borderRadius: 14, border: `1.5px solid ${T.coral}`,
        background: "none", color: T.coral, fontWeight: 700, fontSize: 14, cursor: "pointer",
      }}>
        {c.logout}
      </button>
    </div>
  );
}

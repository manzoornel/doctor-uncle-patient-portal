"use client";
import { useState } from "react";
import { Send } from "lucide-react";
import { T, chatSuggestions } from "../../lib/theme";
import { api } from "../../lib/api";

export function ChatScreen({ c, lang, patientContext }) {
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  async function sendText(question) {
    if (!question || sending) return;
    setInput("");
    setMsgs((m) => [...m, { from: "user", text: question }]);
    setSending(true);
    try {
      const res = await api.askAi(question, patientContext, lang);
      setMsgs((m) => [...m, { from: "ai", text: res.answer || c.error }]);
    } catch (e) {
      setMsgs((m) => [...m, { from: "ai", text: c.error }]);
    } finally {
      setSending(false);
    }
  }

  function send() {
    sendText(input.trim());
  }

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px 10px" }}>
        {msgs.length === 0 && (
          <div style={{ marginTop: 30 }}>
            <div style={{ color: "#7A8A8F", fontSize: 13.5, textAlign: "center", marginBottom: 16 }}>
              {c.tapToAsk}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {chatSuggestions[lang].map((q, i) => (
                <button key={i} onClick={() => sendText(q)} style={{
                  background: "#fff", border: `1.5px solid ${T.teal}`, color: T.tealDark,
                  borderRadius: 16, padding: "14px 16px", fontSize: 14, fontWeight: 700,
                  cursor: "pointer", textAlign: "left",
                }}>
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
        {msgs.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.from === "user" ? "flex-end" : "flex-start", marginBottom: 10 }}>
            <div style={{
              maxWidth: "78%", padding: "10px 13px", borderRadius: 16, fontSize: 13, lineHeight: 1.4,
              background: m.from === "user" ? T.teal : "#fff",
              color: m.from === "user" ? "#fff" : T.dark,
              border: m.from === "user" ? "none" : `1px solid ${T.border}`,
            }}>
              {m.text}
            </div>
          </div>
        ))}
        {sending && <div style={{ color: "#A9A199", fontSize: 12 }}>…</div>}
      </div>
      <div style={{ display: "flex", gap: 8, padding: "10px 14px 90px", borderTop: `1px solid ${T.border}` }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder={c.chatPlaceholder}
          style={{ flex: 1, border: `1px solid ${T.border}`, borderRadius: 20, padding: "10px 14px", fontSize: 13, outline: "none" }}
        />
        <button onClick={send} style={{ width: 40, height: 40, borderRadius: "50%", background: T.teal, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <Send size={16} color="#fff" />
        </button>
      </div>
    </div>
  );
}

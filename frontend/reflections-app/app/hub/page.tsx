"use client";
import { useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "assistant" | "system"; content: string; meta?: any };
type HubReply = { role: "assistant"; content: string; sources?: { mentor: string; preview: string }[]; session_id?: string };

const DEFAULT_MENTORS = ["gemini", "claude", "deepseek", "perplexity"];
const HUB_TITLE = process.env.NEXT_PUBLIC_HUB_TITLE || "OAA Assistant";

export default function HubPage() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "system", content: "You are the OAA Assistant. Answer succinctly; mention mentors when useful." }
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [model, setModel] = useState<string>("ensemble");
  const [mentors, setMentors] = useState<string[]>([...DEFAULT_MENTORS]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, sending]);

  async function send() {
    if (!input.trim() || sending) return;
    const userMsg: Msg = { role: "user", content: input.trim() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setSending(true);
    try {
      const res = await fetch("/api/hub/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          user_id: "hub",
          messages: [...messages, userMsg].filter((x) => x.role !== "system"),
          model,
          mentors,
          system: messages.find((x) => x.role === "system")?.content
        })
      });
      const data: HubReply | { error: string } = await res.json();
      if ((data as any).error) throw new Error((data as any).error);
      const reply = data as HubReply;

      // progressive rendering (feels like stream)
      const full = reply.content || "";
      let drafted = "";
      const chunks = full.split(/(\. |\n)/); // rough
      for (const c of chunks) {
        drafted += c;
        setMessages((m) => [...m.slice(0, -0), { role: "assistant", content: drafted } as Msg]);
        // tiny delay to mimic streaming
        // eslint-disable-next-line no-await-in-loop
        await new Promise((r) => setTimeout(r, 10));
      }
      // attach sources
      if (reply.sources?.length) {
        setMessages((m) => [...m, { role: "assistant", content: renderSources(reply.sources), meta: { sources: reply.sources } }]);
      }
    } catch (e: any) {
      setMessages((m) => [...m, { role: "assistant", content: `⚠️ ${e.message || "Hub error"}` }]);
    } finally {
      setSending(false);
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }

  function renderSources(sources: { mentor: string; preview: string }[]) {
    const lines = sources.map((s) => `- **${s.mentor}**: ${s.preview}…`);
    return `**Mentor sources**\n${lines.join("\n")}`;
  }

  function toggleMentor(name: string) {
    setMentors((cur) => (cur.includes(name) ? cur.filter((x) => x !== name) : [...cur, name]));
  }

  return (
    <div style={wrap}>
      {/* Sidebar */}
      <aside style={side}>
        <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 12 }}>OAA Central Hub</div>
        <div style={{ opacity: 0.7, marginBottom: 16 }}>Models</div>
        <div style={{ display: "grid", gap: 6 }}>
          {["ensemble", "gemini", "claude", "deepseek", "perplexity"].map((m) => (
            <button key={m} onClick={() => setModel(m)} style={chip(model === m)}>{m}</button>
          ))}
        </div>
        <div style={{ height: 1, background: "#eee", margin: "16px 0" }} />
        <div style={{ opacity: 0.7, marginBottom: 8 }}>Mentor Ensemble</div>
        <div style={{ display: "grid", gap: 6 }}>
          {DEFAULT_MENTORS.map((m) => (
            <label key={m} style={mentorRow}>
              <input
                type="checkbox"
                checked={mentors.includes(m)}
                onChange={() => toggleMentor(m)}
              />
              <span style={{ textTransform: "capitalize" }}>{m}</span>
            </label>
          ))}
        </div>
        <div style={{ height: 1, background: "#eee", margin: "16px 0" }} />
        <div style={{ fontSize: 12, opacity: 0.7 }}>Hub: {HUB_TITLE}</div>
      </aside>

      {/* Main */}
      <main style={main}>
        <header style={topbar}>
          <div style={{ fontWeight: 700 }}>{HUB_TITLE}</div>
          <div style={{ fontSize: 12, opacity: 0.7 }}>Mode: {model}</div>
        </header>

        <div style={chat}>
          {messages.map((m, i) => (
            <div key={i} style={bubble(m.role)}>
              <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 4 }}>{m.role}</div>
              <pre style={pre}>{m.content}</pre>
            </div>
          ))}
          {sending && <div style={{ ...bubble("assistant"), opacity: 0.6 }}>…</div>}
          <div ref={bottomRef} />
        </div>

        <div style={composer}>
          <textarea
            style={ta}
            rows={3}
            placeholder="Ask OAA… (Shift+Enter = newline)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
            }}
          />
          <button style={sendBtn} disabled={!input.trim() || sending} onClick={send}>
            {sending ? "Sending…" : "Send"}
          </button>
        </div>
      </main>
    </div>
  );
}

/* ---------- styles ---------- */
const wrap: React.CSSProperties = { display: "grid", gridTemplateColumns: "260px 1fr", height: "100vh", background: "#0f172a" };
const side: React.CSSProperties = { background: "#0b1225", color: "white", padding: 16, borderRight: "1px solid #1e293b", overflow: "auto" };
const main: React.CSSProperties = { display: "grid", gridTemplateRows: "56px 1fr auto", background: "white" };
const topbar: React.CSSProperties = { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", borderBottom: "1px solid #e5e7eb" };
const chat: React.CSSProperties = { padding: 16, overflow: "auto", background: "#f8fafc" };
const composer: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 120px", gap: 8, padding: 12, borderTop: "1px solid #e5e7eb", background: "white" };
const ta: React.CSSProperties = { border: "1px solid #d1d5db", borderRadius: 10, padding: 12, fontSize: 14, background: "white", resize: "vertical" };
const sendBtn: React.CSSProperties = { border: "1px solid #111827", background: "#111827", color: "white", borderRadius: 10, fontWeight: 700, cursor: "pointer" };
const bubble = (role: "user" | "assistant" | "system"): React.CSSProperties => ({
  background: role === "user" ? "white" : role === "assistant" ? "#eef2ff" : "#fff7ed",
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 12,
  marginBottom: 10
});
const pre: React.CSSProperties = { whiteSpace: "pre-wrap", margin: 0, fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace", fontSize: 13, lineHeight: 1.5 };
const chip = (active: boolean): React.CSSProperties => ({
  textAlign: "left",
  border: "1px solid #334155",
  background: active ? "#1e293b" : "#0f172a",
  color: "white",
  padding: "8px 10px",
  borderRadius: 8,
  cursor: "pointer",
  textTransform: "capitalize"
});
const mentorRow: React.CSSProperties = { display: "flex", alignItems: "center", gap: 8, fontSize: 14 };

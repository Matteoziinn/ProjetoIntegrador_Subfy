import React, { useState, useEffect } from "react";
import { Mail, Shield, User, Bell, Moon, Sun, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import { getAlerts } from "./NotificationSystem";

export default function Profile({ darkMode, setDarkMode }) {
  const [userData, setUserData]     = useState(null);
  const [alerts, setAlerts]         = useState([]);
  const [sending, setSending]       = useState(false);
  const [sendMsg, setSendMsg]       = useState("");
  const navigate  = useNavigate();
  const token     = localStorage.getItem("token");
  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    if (!token || !userEmail) { navigate("/"); return; }

    fetch(`http://localhost:8080/users/${userEmail}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.ok ? r.json() : null)
      .then(d => setUserData(d))
      .catch(() => {});

    fetch(`http://localhost:8080/subscriptions/${userEmail}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.ok ? r.json() : [])
      .then(data => { if (Array.isArray(data)) setAlerts(getAlerts(data)); })
      .catch(() => {});
  }, []);

  const enviarAlertas = async () => {
    setSending(true);
    setSendMsg("");
    try {
      const res = await fetch("http://localhost:8080/notifications/send", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setSendMsg("success");
      } else {
        setSendMsg("error");
      }
    } catch {
      setSendMsg("error");
    } finally {
      setSending(false);
      setTimeout(() => setSendMsg(""), 4000);
    }
  };

  const initials = userData?.name
    ? userData.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : (userEmail?.[0] || "U").toUpperCase();

  const Row = ({ icon, label, value }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderBottom: "1px solid var(--border-2)" }}>
      <div style={{ width: 34, height: 34, borderRadius: 8, background: "var(--brand-100)", color: "var(--brand-400)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 11, color: "var(--text-3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text)" }}>{value}</div>
      </div>
    </div>
  );

  return (
    <Layout darkMode={darkMode} setDarkMode={setDarkMode} alertCount={alerts.length} alerts={alerts}>
      <div className="page-inner" style={{ maxWidth: 640 }}>
        <div className="anim-1" style={{ marginBottom: 24 }}>
          <div className="page-title">Perfil</div>
          <div className="page-subtitle">Suas informações e preferências</div>
        </div>

        {/* Hero card */}
        <div className="anim-2" style={{
          borderRadius: 20,
          background: "var(--grad-brand)",
          padding: "28px 28px 32px",
          marginBottom: 16,
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.06)", top: -60, right: -60, pointerEvents: "none" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 16, position: "relative", zIndex: 1 }}>
            <div style={{
              width: 64, height: 64, borderRadius: 16,
              background: "rgba(255,255,255,0.2)",
              color: "#fff", fontWeight: 900, fontSize: 26,
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "2px solid rgba(255,255,255,0.3)",
            }}>
              {initials}
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 2 }}>
                {userData?.name || userEmail?.split("@")[0] || "Usuário"}
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)" }}>{userEmail}</div>
              <span className="badge" style={{ background: "rgba(255,255,255,0.2)", color: "#fff", marginTop: 8, display: "inline-flex" }}>
                <Shield size={10} />
                {userData?.plan || "Plano Básico"}
              </span>
            </div>
          </div>
        </div>

        {/* Info panel */}
        <div className="panel anim-3" style={{ marginBottom: 14 }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: "var(--text-2)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>
            Informações da conta
          </div>
          <Row icon={<User size={15} />} label="Nome" value={userData?.name || "—"} />
          <Row icon={<Mail size={15} />} label="Email" value={userEmail || "—"} />
          <Row icon={<Shield size={15} />} label="Plano" value={userData?.plan || "Básico"} />
        </div>

        {/* Preferences */}
        <div className="panel anim-4" style={{ marginBottom: 14 }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: "var(--text-2)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>
            Preferências
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid var(--border-2)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: "var(--brand-100)", color: "var(--brand-400)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {darkMode ? <Moon size={15} /> : <Sun size={15} />}
              </div>
              <div>
                <div style={{ fontSize: 11, color: "var(--text-3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>Aparência</div>
                <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text)" }}>{darkMode ? "Modo escuro" : "Modo claro"}</div>
              </div>
            </div>
            <button
              className={`theme-toggle${darkMode ? " is-dark" : ""}`}
              onClick={() => setDarkMode(!darkMode)}
              style={{ border: "none", background: "var(--surface-2)", cursor: "pointer" }}
            >
              <div className="theme-toggle-thumb">{darkMode ? "🌙" : "☀️"}</div>
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: "var(--brand-100)", color: "var(--brand-400)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Bell size={15} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: "var(--text-3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>Notificações</div>
                <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text)" }}>Alertas automáticos às 08h</div>
              </div>
            </div>
            <span className="badge badge-active">Ativo</span>
          </div>
        </div>

        {/* Enviar alertas manualmente */}
        <div className="panel anim-5">
          <div style={{ fontWeight: 700, fontSize: 13, color: "var(--text-2)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>
            Notificações por Email
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text)", marginBottom: 3 }}>
                Enviar alertas agora
              </div>
              <div style={{ fontSize: 12, color: "var(--text-2)" }}>
                Dispara emails para assinaturas vencendo em até 3 dias
              </div>
            </div>
            <button
              className="btn btn-brand"
              onClick={enviarAlertas}
              disabled={sending}
              style={{ opacity: sending ? 0.7 : 1, flexShrink: 0 }}
            >
              <Send size={14} />
              {sending ? "Enviando…" : "Enviar alertas"}
            </button>
          </div>

          {/* Feedback */}
          {sendMsg === "success" && (
            <div style={{
              marginTop: 12, padding: "10px 14px",
              borderRadius: "var(--r-md)",
              background: "rgba(5,150,105,0.08)",
              border: "1px solid rgba(5,150,105,0.25)",
              fontSize: 13, color: "var(--success)", fontWeight: 500,
            }}>
              ✅ Alertas enviados com sucesso! Verifique sua caixa de entrada.
            </div>
          )}
          {sendMsg === "error" && (
            <div style={{
              marginTop: 12, padding: "10px 14px",
              borderRadius: "var(--r-md)",
              background: "rgba(220,38,38,0.08)",
              border: "1px solid rgba(220,38,38,0.25)",
              fontSize: 13, color: "var(--danger)", fontWeight: 500,
            }}>
              ❌ Erro ao enviar. Verifique as configurações de email no backend.
            </div>
          )}
        </div>

      </div>
    </Layout>
  );
}

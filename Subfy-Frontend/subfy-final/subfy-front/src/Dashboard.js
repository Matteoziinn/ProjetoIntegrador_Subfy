import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { TrendingUp, AlertTriangle, CheckCircle, XCircle, ArrowRight, Wallet } from "lucide-react";
import Layout from "./Layout";
import { getAlerts } from "./NotificationSystem";

function daysUntilBilling(billingDay) {
  const today    = new Date();
  const year     = today.getFullYear();
  const month    = today.getMonth();
  const todayDay = today.getDate();

  // Próxima ocorrência desse dia no mês atual
  let nextDate = new Date(year, month, billingDay);

  // Se já passou (ou é hoje), pula para o próximo mês
  if (billingDay < todayDay) {
    nextDate = new Date(year, month + 1, billingDay);
  }

  const diffMs   = nextDate.getTime() - new Date(year, month, todayDay).getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  return diffDays;
}

export default function Dashboard({ darkMode, setDarkMode }) {
  const [subs, setSubs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchSubs = useCallback(async () => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("userEmail");
    if (!token || !email) { navigate("/"); return; }
    try {
      const res = await fetch(`http://localhost:8080/subscriptions/${email}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) { navigate("/"); return; }
      const data = await res.json();
      setSubs(Array.isArray(data) ? data : []);
    } catch { setSubs([]); }
    finally { setLoading(false); }
  }, [navigate]);

  useEffect(() => { fetchSubs(); }, [fetchSubs]);

  const active   = subs.filter(s => s.status !== "CANCELADA");
  const canceled = subs.filter(s => s.status === "CANCELADA");
  const monthly  = active.reduce((sum, s) => sum + (s.price || 0), 0);
  const alerts   = getAlerts(subs);

  const upcoming = active
    .map(s => ({ ...s, days: daysUntilBilling(s.billingDate) }))
    .filter(s => s.days <= 7)
    .sort((a, b) => a.days - b.days);

  const email = localStorage.getItem("userEmail") || "";

  const STATS = [
    {
      label: "Gasto mensal",
      value: loading ? "—" : `R$ ${monthly.toFixed(2).replace(".", ",")}`,
      icon: <Wallet size={20} />,
      iconBg: "rgba(109,40,217,0.12)", iconColor: "var(--brand-400)",
      bar: "var(--grad-brand)",
    },
    {
      label: "Ativas",
      value: loading ? "—" : active.length,
      icon: <CheckCircle size={20} />,
      iconBg: "rgba(5,150,105,0.12)", iconColor: "var(--success)",
      bar: "linear-gradient(90deg,#059669,#34d399)",
      cls: "stat-card-alt",
    },
    {
      label: "Canceladas",
      value: loading ? "—" : canceled.length,
      icon: <XCircle size={20} />,
      iconBg: "rgba(220,38,38,0.09)", iconColor: "var(--danger)",
      bar: "linear-gradient(90deg,#dc2626,#f87171)",
      cls: "stat-card-muted",
    },
    {
      label: "Alertas de vencimento",
      value: loading ? "—" : alerts.length,
      icon: <AlertTriangle size={20} />,
      iconBg: alerts.length > 0 ? "rgba(217,119,6,0.12)" : "var(--surface-2)",
      iconColor: alerts.length > 0 ? "var(--warning)" : "var(--text-3)",
      bar: alerts.length > 0 ? "linear-gradient(90deg,#d97706,#fbbf24)" : "var(--border)",
      cls: "stat-card-warn",
    },
  ];

  return (
    <Layout darkMode={darkMode} setDarkMode={setDarkMode} alertCount={alerts.length} alerts={alerts}>
      <div className="page-inner">
        {/* Header */}
        <div className="anim-1" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24, gap: 16 }}>
          <div>
            <div className="page-title">Dashboard</div>
            <div className="page-subtitle">
              Olá, <strong>{email.split("@")[0]}</strong> — aqui está o resumo das suas assinaturas.
            </div>
          </div>
          <Link to="/subscriptions" className="btn btn-brand btn-sm" style={{ flexShrink: 0 }}>
            + Nova assinatura
          </Link>
        </div>

        {/* Stat cards */}
        <div className="anim-2" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))", gap: 14, marginBottom: 24 }}>
          {STATS.map((s, i) => (
            <div key={i} className={`stat-card ${s.cls || ""}`}>
              <div className="stat-card-bar" style={{ background: s.bar }} />
              <div className="stat-icon-wrap" style={{ background: s.iconBg, color: s.iconColor }}>
                {s.icon}
              </div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="panel anim-3" style={{ marginBottom: 16 }}>
            <div className="panel-header">
              <div className="panel-title">
                <AlertTriangle size={15} color="var(--warning)" />
                Vencimentos próximos
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {alerts.map(a => (
                <div key={a.sub.id} className="alert-row"
                  style={{ borderLeft: `3px solid ${a.type === "danger" ? "var(--danger)" : "var(--warning)"}` }}>
                  <div>
                    <div className="alert-name">{a.sub.serviceName}</div>
                    <div className="alert-meta">Dia {a.sub.billingDate} · R$ {Number(a.sub.price).toFixed(2).replace(".", ",")}</div>
                  </div>
                  <span className={`badge badge-${a.type === "danger" ? "canceled" : "warning"}`}>
                    {a.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Two panels side by side */}
        <div className="anim-4" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {/* Upcoming this week */}
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">Cobranças esta semana</div>
              <Link to="/subscriptions" className="panel-link">Ver todas <ArrowRight size={12} /></Link>
            </div>
            {loading ? (
              <p style={{ fontSize: 14, color: "var(--text-3)" }}>Carregando…</p>
            ) : upcoming.length === 0 ? (
              <p style={{ fontSize: 14, color: "var(--text-3)" }}>Nenhuma nos próximos 7 dias.</p>
            ) : (
              upcoming.map(s => (
                <div key={s.id} className="act-row">
                  <div className="act-icon">{s.serviceName[0].toUpperCase()}</div>
                  <div style={{ flex: 1 }}>
                    <div className="act-name">{s.serviceName}</div>
                    <div className="act-meta">
                      {s.days === 0
                        ? "Hoje"
                        : s.days === 1
                        ? "Amanhã"
                        : `Em ${s.days} dias`}
                      {" · "}dia {s.billingDate}
                    </div>
                  </div>
                  <div className="act-price">R$ {Number(s.price).toFixed(2).replace(".", ",")}</div>
                </div>
              ))
            )}
          </div>

          {/* Active subscriptions */}
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">Assinaturas ativas</div>
              <Link to="/subscriptions" className="panel-link">Ver todas <ArrowRight size={12} /></Link>
            </div>
            {loading ? (
              <p style={{ fontSize: 14, color: "var(--text-3)" }}>Carregando…</p>
            ) : active.length === 0 ? (
              <p style={{ fontSize: 14, color: "var(--text-3)" }}>Nenhuma assinatura ativa.</p>
            ) : (
              active.slice(0, 5).map(s => (
                <div key={s.id} className="act-row">
                  <div className="act-icon">{s.serviceName[0].toUpperCase()}</div>
                  <div style={{ flex: 1 }}>
                    <div className="act-name">{s.serviceName}</div>
                    <div className="act-meta">Dia {s.billingDate} de cada mês</div>
                  </div>
                  <div className="act-price">R$ {Number(s.price).toFixed(2).replace(".", ",")}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

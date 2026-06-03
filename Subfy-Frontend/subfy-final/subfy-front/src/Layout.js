import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard, CreditCard, List, User, LogOut, Bell, AlertTriangle, X
} from "lucide-react";

const NAV = [
  { to: "/dashboard",     icon: LayoutDashboard, label: "Dashboard"   },
  { to: "/subscriptions", icon: List,             label: "Assinaturas" },
  { to: "/plans",         icon: CreditCard,       label: "Planos"      },
  { to: "/profile",       icon: User,             label: "Perfil"      },
];

export default function Layout({ darkMode, setDarkMode, children, alertCount = 0, alerts = [] }) {
  const loc          = useLocation();
  const navigate     = useNavigate();
  const email        = localStorage.getItem("userEmail") || "";
  const initials     = email[0]?.toUpperCase() || "U";
  const [bellOpen, setBellOpen] = useState(false);
  const bellRef      = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setBellOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("subfy_notif_shown"); // limpa flag de notificação
    navigate("/");
  };

  return (
    <div className="app-shell">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-mark">S</div>
          <span className="sidebar-logo-name">Subfy</span>
          <span className="sidebar-logo-dot" />
        </div>

        <div className="sidebar-section">
          <div className="sidebar-label">Menu</div>
          {NAV.map(({ to, icon: Icon, label }) => {
            const active = loc.pathname === to;
            return (
              <Link key={to} to={to} className={`nav-item${active ? " active" : ""}`}>
                <div className="nav-item-icon">
                  <Icon size={16} strokeWidth={active ? 2.2 : 1.8} />
                </div>
                {label}
                {label === "Assinaturas" && alertCount > 0 && (
                  <span className="nav-badge">{alertCount}</span>
                )}
              </Link>
            );
          })}
        </div>

        <div className="sidebar-bottom">
          <div className="sidebar-user" onClick={logout} title="Sair da conta">
            <div className="sidebar-avatar">{initials}</div>
            <div>
              <div className="sidebar-user-name">{email}</div>
              <div className="sidebar-user-role">Clique para sair</div>
            </div>
            <LogOut size={14} color="var(--text-3)" style={{ marginLeft: "auto", flexShrink: 0 }} />
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <div className="main-content">
        <div className="topbar">

          {/* Theme toggle */}
          <button
            className={`theme-toggle${darkMode ? " is-dark" : ""}`}
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? "Ativar modo claro" : "Ativar modo escuro"}
            style={{ border: "none", background: "none", padding: 0, cursor: "pointer" }}
          >
            <div className="theme-toggle-thumb">
              {darkMode ? "🌙" : "☀️"}
            </div>
          </button>

          {/* Bell + dropdown */}
          <div ref={bellRef} style={{ position: "relative" }}>
            <button
              className="topbar-btn"
              onClick={() => setBellOpen(o => !o)}
              title={alertCount > 0 ? `${alertCount} alerta(s)` : "Sem alertas"}
              style={{ position: "relative" }}
            >
              <Bell size={16} />
              {alertCount > 0 && (
                <span style={{
                  position: "absolute", top: "-4px", right: "-4px",
                  background: "var(--rose-400)", color: "#fff",
                  fontSize: "9px", fontWeight: 700,
                  width: "16px", height: "16px", borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  pointerEvents: "none",
                }}>
                  {alertCount}
                </span>
              )}
            </button>

            {bellOpen && (
              <div style={{
                position: "absolute",
                top: "calc(100% + 10px)",
                right: 0,
                width: 320,
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--r-lg)",
                boxShadow: "var(--shadow-lg)",
                zIndex: 200,
                overflow: "hidden",
                animation: "slideUp 0.2s ease both",
              }}>
                {/* Header */}
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "14px 16px",
                  borderBottom: "1px solid var(--border-2)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Bell size={14} color="var(--brand-400)" />
                    <span style={{ fontWeight: 700, fontSize: 14, color: "var(--text)" }}>
                      Notificações
                    </span>
                    {alertCount > 0 && (
                      <span style={{
                        background: "var(--rose-400)", color: "#fff",
                        fontSize: "10px", fontWeight: 700,
                        padding: "2px 7px", borderRadius: 99,
                      }}>
                        {alertCount}
                      </span>
                    )}
                  </div>
                  <button onClick={() => setBellOpen(false)} style={{
                    background: "none", border: "none",
                    color: "var(--text-3)", cursor: "pointer", padding: 2,
                  }}>
                    <X size={15} />
                  </button>
                </div>

                {/* Body */}
                {alertCount === 0 ? (
                  <div style={{
                    padding: "32px 16px", textAlign: "center",
                    color: "var(--text-3)", fontSize: 14,
                  }}>
                    <div style={{ marginBottom: 10 }}>
                      <Bell size={28} color="var(--border)" />
                    </div>
                    <div style={{ fontWeight: 600, marginBottom: 4, color: "var(--text-2)" }}>
                      Tudo em dia!
                    </div>
                    <div style={{ fontSize: 13 }}>
                      Nenhuma assinatura vencendo em breve.
                    </div>
                  </div>
                ) : (
                  <div style={{ maxHeight: 320, overflowY: "auto" }}>
                    {alerts.map((a, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex", alignItems: "center", gap: 12,
                          padding: "12px 16px",
                          borderBottom: "1px solid var(--border-2)",
                          borderLeft: `3px solid ${a.type === "danger" ? "var(--danger)" : "var(--warning)"}`,
                          cursor: "default",
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = "var(--surface-2)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        <div style={{
                          width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                          background: a.type === "danger" ? "rgba(220,38,38,0.1)" : "rgba(217,119,6,0.1)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <AlertTriangle
                            size={16}
                            color={a.type === "danger" ? "var(--danger)" : "var(--warning)"}
                          />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text)" }}>
                            {a.sub.serviceName}
                          </div>
                          <div style={{ fontSize: 12, color: "var(--text-2)", marginTop: 2 }}>
                            {a.label} · R$ {Number(a.sub.price).toFixed(2).replace(".", ",")}
                          </div>
                        </div>
                        <span style={{
                          fontSize: 10, fontWeight: 700,
                          textTransform: "uppercase", letterSpacing: "0.05em",
                          padding: "3px 8px", borderRadius: 99, whiteSpace: "nowrap",
                          background: a.type === "danger" ? "rgba(220,38,38,0.1)" : "rgba(217,119,6,0.1)",
                          color: a.type === "danger" ? "var(--danger)" : "var(--warning)",
                        }}>
                          {a.type === "danger" ? "Hoje" : `${a.days}d`}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Footer */}
                {alertCount > 0 && (
                  <div style={{ padding: "10px 16px" }}>
                    <Link
                      to="/subscriptions"
                      onClick={() => setBellOpen(false)}
                      style={{
                        display: "block", textAlign: "center",
                        fontSize: 13, fontWeight: 600,
                        color: "var(--brand-400)",
                        padding: "8px", borderRadius: "var(--r-sm)",
                        background: "var(--brand-100)",
                        transition: "opacity 0.15s",
                      }}
                    >
                      Ver todas as assinaturas
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

        {children}
      </div>
    </div>
  );
}

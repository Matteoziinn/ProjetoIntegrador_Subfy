import React, { useState, useEffect } from "react";
import { Check, X, Sparkles, Bell, CheckCircle } from "lucide-react";
import Layout from "./Layout";
import { getAlerts } from "./NotificationSystem";

const PLANS = [
  {
    id: "basic",
    name: "Básico",
    price: "29",
    cents: "90",
    desc: "Ideal para uso pessoal e controle simples.",
    features: ["Até 10 assinaturas", "Dashboard básico", "Alertas de vencimento", "Suporte por e-mail"],
    cta: "Plano atual",
    current: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: "49",
    cents: "90",
    desc: "Para quem quer controle total e relatórios.",
    features: ["Assinaturas ilimitadas", "Dashboard avançado", "Alertas + notificações push", "Relatórios mensais", "Suporte prioritário"],
    cta: "Quero este plano",
    featured: true,
  },
  {
    id: "pro",
    name: "Profissional",
    price: "99",
    cents: "90",
    desc: "Para equipes e empresas com múltiplos usuários.",
    features: ["Tudo do Premium", "Multi-usuário", "API access", "Integração Stripe", "Suporte 24/7"],
    cta: "Quero este plano",
  },
];

export default function Plans({ darkMode, setDarkMode }) {
  const [alerts, setAlerts]       = useState([]);
  const [modal, setModal]         = useState(null); // null | "basic" | "premium" | "pro"
  const [interestEmail, setInterestEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("userEmail");
    if (!token || !email) return;
    fetch(`http://localhost:8080/subscriptions/${email}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.ok ? r.json() : [])
      .then(data => { if (Array.isArray(data)) setAlerts(getAlerts(data)); })
      .catch(() => {});

    // Preenche o email automaticamente
    setInterestEmail(email);
  }, []);

  const openModal = (plan) => {
    setSubmitted(false);
    setModal(plan);
  };

  const closeModal = () => {
    setModal(null);
    setSubmitted(false);
  };

  const handleInterest = () => {
    if (!interestEmail) return;
    // Aqui poderia salvar no backend futuramente
    setSubmitted(true);
  };

  const selectedPlan = PLANS.find(p => p.id === modal);

  return (
    <Layout darkMode={darkMode} setDarkMode={setDarkMode} alertCount={alerts.length} alerts={alerts}>
      <div className="page-inner">
        <div className="anim-1" style={{ textAlign: "center", marginBottom: 36 }}>
          <div className="page-title" style={{ fontSize: 28 }}>Planos & Preços</div>
          <div className="page-subtitle" style={{ marginTop: 6 }}>
            Escolha o plano ideal para o seu perfil de uso
          </div>
        </div>

        {/* Cards */}
        <div className="anim-2" style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 18, alignItems: "center",
        }}>
          {PLANS.map(plan => (
            <div key={plan.id} className={`plan-card${plan.featured ? " featured" : ""}`}
              style={{ paddingTop: plan.featured ? 42 : 28 }}>
              {plan.featured && <div className="plan-popular-badge">Mais popular</div>}

              <div style={{
                fontSize: 13, fontWeight: 700,
                color: plan.featured ? "rgba(255,255,255,0.7)" : "var(--text-2)",
                textTransform: "uppercase", letterSpacing: "0.08em",
                marginBottom: 8,
              }}>{plan.name}</div>

              <div style={{ display: "flex", alignItems: "flex-start", gap: 2, marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: plan.featured ? "rgba(255,255,255,0.8)" : "var(--text-2)", marginTop: 8 }}>R$</span>
                <span style={{ fontSize: 44, fontWeight: 900, color: plan.featured ? "#fff" : "var(--text)", letterSpacing: -2, lineHeight: 1 }}>{plan.price}</span>
                <span style={{ fontSize: 18, fontWeight: 700, color: plan.featured ? "rgba(255,255,255,0.8)" : "var(--text-2)", marginTop: 4 }}>,{plan.cents}</span>
                <span style={{ fontSize: 13, color: plan.featured ? "rgba(255,255,255,0.6)" : "var(--text-3)", alignSelf: "flex-end", paddingBottom: 4, marginLeft: 2 }}>/mês</span>
              </div>

              <p style={{ fontSize: 13, color: plan.featured ? "rgba(255,255,255,0.75)" : "var(--text-2)", marginBottom: 20, lineHeight: 1.5 }}>
                {plan.desc}
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24, flex: 1 }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13, color: plan.featured ? "rgba(255,255,255,0.85)" : "var(--text)" }}>
                    <Check size={14} color={plan.featured ? "#c4b5fd" : "var(--success)"} strokeWidth={2.5} />
                    {f}
                  </div>
                ))}
              </div>

              <button
                className="btn"
                onClick={() => openModal(plan.id)}
                style={{
                  width: "100%", padding: "11px",
                  background: plan.current
                    ? "transparent"
                    : plan.featured
                    ? "rgba(255,255,255,0.18)"
                    : "var(--grad-brand)",
                  color: plan.current ? (plan.featured ? "rgba(255,255,255,0.6)" : "var(--text-3)") : "#fff",
                  border: plan.current
                    ? `1px solid ${plan.featured ? "rgba(255,255,255,0.2)" : "var(--border)"}`
                    : plan.featured
                    ? "1px solid rgba(255,255,255,0.3)"
                    : "none",
                  boxShadow: (!plan.current && !plan.featured) ? "0 4px 16px rgba(109,40,217,0.35)" : "none",
                  cursor: plan.current ? "default" : "pointer",
                }}>
                {plan.current ? "✓  Plano atual" : plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ===== MODAL ===== */}
      {modal && (
        <div
          onClick={closeModal}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.45)",
            backdropFilter: "blur(4px)",
            zIndex: 1000,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 24,
            animation: "fadeIn 0.2s ease both",
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--r-xl)",
              padding: "36px 32px",
              width: "100%", maxWidth: 440,
              boxShadow: "var(--shadow-lg)",
              position: "relative",
              animation: "slideUp 0.25s ease both",
            }}
          >
            {/* Botão fechar */}
            <button
              onClick={closeModal}
              style={{
                position: "absolute", top: 16, right: 16,
                background: "var(--surface-2)", border: "1px solid var(--border)",
                borderRadius: 8, width: 32, height: 32,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--text-3)", cursor: "pointer",
              }}
            >
              <X size={15} />
            </button>

            {/* === MODAL PLANO BÁSICO === */}
            {modal === "basic" && (
              <div style={{ textAlign: "center" }}>
                <div style={{
                  width: 64, height: 64, borderRadius: 18,
                  background: "var(--success-dim, rgba(5,150,105,0.1))",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 18px",
                }}>
                  <CheckCircle size={32} color="var(--success)" />
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "var(--text)", marginBottom: 8 }}>
                  Você já está no plano Básico!
                </div>
                <div style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.6, marginBottom: 24 }}>
                  Este é o seu plano atual. Aproveite todos os recursos disponíveis.
                  Para desbloquear funcionalidades avançadas, considere fazer upgrade para o plano <strong>Premium</strong>.
                </div>
                <button className="btn btn-brand" style={{ width: "100%" }} onClick={closeModal}>
                  Entendido
                </button>
              </div>
            )}

            {/* === MODAL PREMIUM / PRO === */}
            {(modal === "premium" || modal === "pro") && (
              <div>
                {!submitted ? (
                  <>
                    {/* Ícone */}
                    <div style={{
                      width: 64, height: 64, borderRadius: 18,
                      background: "var(--brand-dim, rgba(109,40,217,0.1))",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      margin: "0 auto 18px",
                    }}>
                      <Sparkles size={30} color="var(--brand-400)" />
                    </div>

                    <div style={{ textAlign: "center", marginBottom: 20 }}>
                      <div style={{ fontSize: 20, fontWeight: 800, color: "var(--text)", marginBottom: 6 }}>
                        Plano {selectedPlan?.name} — Em breve!
                      </div>
                      <div style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.6 }}>
                        Este plano ainda está em desenvolvimento. Deixe seu email e você será o
                        <strong> primeiro a saber</strong> quando estiver disponível!
                      </div>
                    </div>

                    {/* Benefícios resumidos */}
                    <div style={{
                      background: "var(--surface-2)",
                      borderRadius: "var(--r-md)",
                      padding: "14px 16px",
                      marginBottom: 20,
                    }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-2)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
                        O que você vai ganhar
                      </div>
                      {selectedPlan?.features.map(f => (
                        <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text)", marginBottom: 6 }}>
                          <Check size={13} color="var(--brand-400)" strokeWidth={2.5} />
                          {f}
                        </div>
                      ))}
                    </div>

                    {/* Campo de email */}
                    <div className="field" style={{ marginBottom: 14 }}>
                      <label className="field-label">
                        <Bell size={11} style={{ display: "inline", marginRight: 4 }} />
                        Seu email para notificação
                      </label>
                      <input
                        className="field-input"
                        type="email"
                        placeholder="seu@email.com"
                        value={interestEmail}
                        onChange={e => setInterestEmail(e.target.value)}
                      />
                    </div>

                    <button
                      className="btn btn-brand"
                      style={{ width: "100%" }}
                      onClick={handleInterest}
                      disabled={!interestEmail}
                    >
                      <Bell size={15} />
                      Me avise quando lançar
                    </button>

                    <button
                      onClick={closeModal}
                      style={{
                        width: "100%", marginTop: 10,
                        padding: "10px", borderRadius: "var(--r-md)",
                        background: "none", border: "1px solid var(--border)",
                        color: "var(--text-2)", fontSize: 14, cursor: "pointer",
                        fontFamily: "var(--font)",
                      }}
                    >
                      Agora não
                    </button>
                  </>
                ) : (
                  /* === SUCESSO === */
                  <div style={{ textAlign: "center" }}>
                    <div style={{
                      width: 64, height: 64, borderRadius: 18,
                      background: "var(--success-dim, rgba(5,150,105,0.1))",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      margin: "0 auto 18px",
                    }}>
                      <CheckCircle size={32} color="var(--success)" />
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "var(--text)", marginBottom: 8 }}>
                      Interesse registrado!
                    </div>
                    <div style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.6, marginBottom: 24 }}>
                      Ótimo! Assim que o plano <strong>{selectedPlan?.name}</strong> estiver disponível,
                      enviaremos um email para <strong>{interestEmail}</strong>.
                    </div>
                    <button className="btn btn-brand" style={{ width: "100%" }} onClick={closeModal}>
                      Perfeito, obrigado!
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Animação fadeIn para o overlay */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </Layout>
  );
}

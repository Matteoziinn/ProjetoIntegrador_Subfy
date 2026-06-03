import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle, Eye, EyeOff } from "lucide-react";

const FEATURES = [
  "Grátis para começar",
  "Alertas automáticos de vencimento",
  "Dashboard financeiro em tempo real",
  "Cancele quando quiser",
];

function getPasswordStrength(password) {
  if (!password) return null;
  if (password.length < 6) return { level: 1, label: "Muito fraca", color: "#dc2626" };
  let score = 0;
  if (password.length >= 8)            score++;
  if (/[A-Z]/.test(password))          score++;
  if (/[0-9]/.test(password))          score++;
  if (/[^A-Za-z0-9]/.test(password))   score++;
  if (score <= 1) return { level: 2, label: "Fraca",      color: "#f97316" };
  if (score === 2) return { level: 3, label: "Média",      color: "#eab308" };
  if (score === 3) return { level: 4, label: "Forte",      color: "#22c55e" };
  return              { level: 5, label: "Muito forte", color: "#059669" };
}

const eyeBtnStyle = {
  position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
  background: "none", border: "none", cursor: "pointer",
  color: "var(--text-2)", display: "flex", alignItems: "center",
  justifyContent: "center", padding: 0, zIndex: 2,
};

export default function Register() {
  const [name, setName]               = useState("");
  const [email, setEmail]             = useState("");
  const [password, setPassword]       = useState("");
  const [confirm, setConfirm]         = useState("");
  const [showPass, setShowPass]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading]         = useState(false);
  const [errors, setErrors]           = useState({});
  const navigate = useNavigate();

  const strength = getPasswordStrength(password);

  const clearErr = (field) => setErrors(prev => ({ ...prev, [field]: "" }));

  const validate = () => {
    const e = {};
    if (!name.trim() || name.trim().length < 3)
      e.name = "O nome deve ter pelo menos 3 caracteres.";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = "Informe um endereço de email válido.";
    if (!password || password.length < 6)
      e.password = "A senha deve ter no mínimo 6 caracteres.";
    if (password !== confirm)
      e.confirm = "As senhas não coincidem.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const register = async () => {
    setErrors({});
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) { navigate("/"); return; }

      // Lê o body como texto
      let body = "";
      try { body = await res.text(); } catch { body = ""; }
      const lower = body.toLowerCase();

      // Email duplicado — detecta por status ou qualquer menção a email no body
      if (
        res.status === 409 ||
        lower.includes("email") ||
        lower.includes("already") ||
        lower.includes("exists") ||
        lower.includes("duplicate") ||
        lower.includes("unique") ||
        lower.includes("cadastrado")
      ) {
        setErrors({ email: "Este email já está cadastrado. Faça login ou use outro email." });
        return;
      }

      // Para qualquer outro erro do backend, assumimos email duplicado
      // pois os campos já foram validados localmente antes de chegar aqui
      if (res.status === 400 || res.status === 500) {
        setErrors({ email: "Este email já está cadastrado. Faça login ou use outro email." });
        return;
      }

      setErrors({ name: body || "Erro ao criar conta. Tente novamente." });

    } catch {
      setErrors({ name: "Sem conexão com o servidor. Verifique se o backend está rodando." });
    } finally {
      setLoading(false);
    }
  };

  const fieldStyle = (field) => ({
    paddingRight: (field === "password" || field === "confirm") ? 46 : undefined,
    borderColor: errors[field] ? "var(--danger)" : undefined,
    boxShadow:   errors[field] ? "0 0 0 3px rgba(220,38,38,0.1)" : undefined,
  });

  const Err = ({ field }) => errors[field]
    ? <span style={{ fontSize: 12, color: "var(--danger)", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>⚠️ {errors[field]}</span>
    : null;

  return (
    <div className="auth-page">
      <div className="auth-panel anim-1">
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 6, marginBottom: 8 }}>
            <span style={{ fontSize: 28, fontWeight: 900, color: "var(--text)", letterSpacing: -1 }}>Subfy</span>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--rose-400)", display: "inline-block", marginTop: 6 }} />
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", letterSpacing: -0.5, marginBottom: 6 }}>
            Criar sua conta
          </div>
          <div style={{ fontSize: 14, color: "var(--text-2)" }}>Comece a controlar suas assinaturas hoje</div>
        </div>

        {/* Nome */}
        <div className="field" style={{ marginBottom: 12 }}>
          <label className="field-label">Nome completo</label>
          <input className="field-input" type="text" placeholder="Seu nome"
            value={name} onChange={e => { setName(e.target.value); clearErr("name"); }}
            style={fieldStyle("name")} autoComplete="name" />
          <Err field="name" />
        </div>

        {/* Email */}
        <div className="field" style={{ marginBottom: 12 }}>
          <label className="field-label">Email</label>
          <input className="field-input" type="email" placeholder="seu@email.com"
            value={email} onChange={e => { setEmail(e.target.value); clearErr("email"); }}
            style={fieldStyle("email")} autoComplete="email" />
          <Err field="email" />
        </div>

        {/* Senha */}
        <div className="field" style={{ marginBottom: 8 }}>
          <label className="field-label">Senha</label>
          <div style={{ position: "relative" }}>
            <input className="field-input"
              type={showPass ? "text" : "password"}
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={e => { setPassword(e.target.value); clearErr("password"); }}
              style={{ ...fieldStyle("password"), paddingRight: 46 }}
              autoComplete="new-password" />
            <button type="button" onClick={() => setShowPass(s => !s)} style={eyeBtnStyle}>
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Barra de força */}
          {password && strength && (
            <div style={{ marginTop: 8 }}>
              <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                {[1,2,3,4,5].map(i => (
                  <div key={i} style={{
                    flex: 1, height: 3, borderRadius: 99,
                    background: i <= strength.level ? strength.color : "var(--border)",
                    transition: "background 0.3s",
                  }} />
                ))}
              </div>
              <span style={{ fontSize: 11, color: strength.color, fontWeight: 600 }}>
                Senha {strength.label}
              </span>
            </div>
          )}
          <Err field="password" />
        </div>

        {/* Confirmar senha */}
        <div className="field" style={{ marginBottom: 20 }}>
          <label className="field-label">Confirmar senha</label>
          <div style={{ position: "relative" }}>
            <input className="field-input"
              type={showConfirm ? "text" : "password"}
              placeholder="Repita a senha"
              value={confirm}
              onChange={e => { setConfirm(e.target.value); clearErr("confirm"); }}
              style={{ ...fieldStyle("confirm"), paddingRight: 46 }}
              autoComplete="new-password"
              onKeyDown={e => e.key === "Enter" && register()} />
            <button type="button" onClick={() => setShowConfirm(s => !s)} style={eyeBtnStyle}>
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Indicador em tempo real */}
          {confirm && password && !errors.confirm && (
            <span style={{
              fontSize: 12, marginTop: 4, display: "flex", alignItems: "center", gap: 4,
              color: confirm === password ? "var(--success)" : "var(--danger)",
            }}>
              {confirm === password
                ? <><CheckCircle size={12} /> Senhas coincidem</>
                : "⚠️ As senhas não coincidem"}
            </span>
          )}
          <Err field="confirm" />
        </div>

        <button
          className="btn btn-brand"
          style={{ width: "100%", padding: "13px", fontSize: 15, opacity: loading ? 0.7 : 1 }}
          onClick={register} disabled={loading}>
          {loading ? "Criando…" : "Criar conta grátis"}
        </button>

        <p style={{ marginTop: 22, textAlign: "center", fontSize: 14, color: "var(--text-2)" }}>
          Já tem conta?{" "}
          <Link to="/" style={{ color: "var(--brand-400)", fontWeight: 700 }}>Fazer login</Link>
        </p>
      </div>

      <div className="auth-visual">
        <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <div className="auth-logo-big">Subfy<span className="auth-logo-dot-big" /></div>
          <div className="auth-tagline">Controle financeiro inteligente para suas assinaturas</div>
          <div className="auth-features">
            {FEATURES.map(f => (
              <div key={f} className="auth-feature">
                <CheckCircle size={16} color="#c4b5fd" strokeWidth={2.5} />
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

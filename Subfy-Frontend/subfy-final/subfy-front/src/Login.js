import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle, Eye, EyeOff } from "lucide-react";

const FEATURES = [
  "Controle total das suas assinaturas",
  "Alertas automáticos de vencimento",
  "Dashboard financeiro em tempo real",
  "Suporte a múltiplos usuários",
];

export default function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [attempts, setAttempts] = useState(0);
  const [blocked, setBlocked]   = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    if (!email.trim()) { setError("Informe seu email."); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Formato de email inválido."); return false; }
    if (!password) { setError("Informe sua senha."); return false; }
    return true;
  };

  const login = async () => {
    if (blocked) { setError("Muitas tentativas. Aguarde 30 segundos."); return; }
    if (!validate()) return;
    setLoading(true); setError("");
    try {
      const res = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const next = attempts + 1;
        setAttempts(next);
        if (next >= 5) {
          setBlocked(true);
          setError("Conta bloqueada temporariamente por excesso de tentativas. Aguarde 30 segundos.");
          setTimeout(() => { setBlocked(false); setAttempts(0); }, 30000);
        } else {
          setError(`Email ou senha incorretos. Tentativa ${next} de 5.`);
        }
        return;
      }
      const data = await res.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("userEmail", email);
      navigate("/dashboard");
    } catch {
      setError("Sem conexão com o servidor. Verifique se o backend está rodando.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-panel anim-1">
        <div style={{ marginBottom: 36 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 6, marginBottom: 8 }}>
            <span style={{ fontSize: 28, fontWeight: 900, color: "var(--text)", letterSpacing: -1 }}>Subfy</span>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--rose-400)", display: "inline-block", marginTop: 6 }} />
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", letterSpacing: -0.5, marginBottom: 6 }}>
            Bem-vindo de volta
          </div>
          <div style={{ fontSize: 14, color: "var(--text-2)" }}>Entre para acessar seu painel</div>
        </div>

        {error && (
          <div className="error-box" style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 16 }}>
            <span style={{ flexShrink: 0 }}>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Email */}
        <div className="field" style={{ marginBottom: 14 }}>
          <label className="field-label">Email</label>
          <input
            className="field-input"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={e => { setEmail(e.target.value); setError(""); }}
            onKeyDown={e => e.key === "Enter" && login()}
            autoComplete="email"
          />
        </div>

        {/* Senha com olhinho */}
        <div className="field" style={{ marginBottom: 26 }}>
          <label className="field-label">Senha</label>
          <div style={{ position: "relative" }}>
            <input
              className="field-input"
              type={showPass ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(""); }}
              onKeyDown={e => e.key === "Enter" && login()}
              autoComplete="current-password"
              style={{ paddingRight: 46 }}
            />
            <button
              type="button"
              onClick={() => setShowPass(s => !s)}
              title={showPass ? "Ocultar senha" : "Mostrar senha"}
              style={{
                position: "absolute",
                right: 12,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--text-2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
                zIndex: 2,
              }}
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          className="btn btn-brand"
          style={{ width: "100%", padding: "13px", fontSize: 15, opacity: (loading || blocked) ? 0.7 : 1 }}
          onClick={login}
          disabled={loading || blocked}
        >
          {loading ? "Entrando…" : blocked ? "Aguarde 30 segundos…" : "Entrar"}
        </button>

        <p style={{ marginTop: 22, textAlign: "center", fontSize: 14, color: "var(--text-2)" }}>
          Não tem conta?{" "}
          <Link to="/register" style={{ color: "var(--brand-400)", fontWeight: 700 }}>
            Criar conta grátis
          </Link>
        </p>
      </div>

      <div className="auth-visual">
        <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <div className="auth-logo-big">Subfy<span className="auth-logo-dot-big" /></div>
          <div className="auth-tagline">Gerencie todas as suas assinaturas em um só lugar</div>
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

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Calendar, Trash2, XCircle, CheckCircle, Edit3, X, Check } from "lucide-react";
import Layout from "./Layout";
import { getAlerts } from "./NotificationSystem";

export default function Subscriptions({ darkMode, setDarkMode }) {
  const [subs, setSubs]           = useState([]);
  const [serviceName, setSN]      = useState("");
  const [price, setPrice]         = useState("");
  const [billingDate, setBD]      = useState("");
  const [loading, setLoading]     = useState(true);
  const [formError, setFormError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData]   = useState({});
  const [filter, setFilter]       = useState("all");
  const navigate = useNavigate();
  const token     = localStorage.getItem("token");
  const userEmail = localStorage.getItem("userEmail");

  const fetch_ = async () => {
    if (!token || !userEmail) { navigate("/"); return; }
    try {
      const res = await fetch(`http://localhost:8080/subscriptions/${userEmail}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) { navigate("/"); return; }
      const data = await res.json();
      setSubs(Array.isArray(data) ? data : []);
    } catch { setSubs([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch_(); }, []);

  const create = async () => {
    if (!serviceName || !price || !billingDate) { setFormError("Preencha todos os campos."); return; }
    if (Number(billingDate) < 1 || Number(billingDate) > 31) { setFormError("Dia deve ser entre 1 e 31."); return; }
    setFormError("");
    try {
      const res = await fetch("http://localhost:8080/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ serviceName, price: Number(price), billingDate: Number(billingDate), status: "ATIVA", userEmail }),
      });
      if (!res.ok) { setFormError("Erro ao criar assinatura."); return; }
      setSN(""); setPrice(""); setBD("");
      fetch_();
    } catch { setFormError("Erro de conexão."); }
  };

  const cancel = async (id, sub) => {
    if (!window.confirm(`Cancelar ${sub.serviceName}?`)) return;
    await fetch(`http://localhost:8080/subscriptions/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...sub, status: "CANCELADA" }),
    }).catch(() => {});
    fetch_();
  };

  const remove = async (id) => {
    if (!window.confirm("Remover permanentemente?")) return;
    await fetch(`http://localhost:8080/subscriptions/${id}`, {
      method: "DELETE", headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {});
    fetch_();
  };

  const save = async (id) => {
    const sub = subs.find(s => s.id === id);
    await fetch(`http://localhost:8080/subscriptions/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...sub, ...editData }),
    }).catch(() => {});
    setEditingId(null); fetch_();
  };

  const alerts  = getAlerts(subs);
  const filtered = subs.filter(s => {
    if (filter === "active")   return s.status !== "CANCELADA";
    if (filter === "canceled") return s.status === "CANCELADA";
    return true;
  });

  return (
    <Layout darkMode={darkMode} setDarkMode={setDarkMode} alertCount={alerts.length} alerts={alerts}>
      <div className="page-inner">
        {/* Header */}
        <div className="anim-1" style={{ marginBottom: 22 }}>
          <div className="page-title">Assinaturas</div>
          <div className="page-subtitle">Gerencie todos os seus serviços recorrentes</div>
        </div>

        {/* Add form */}
        <div className="panel anim-2" style={{ marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "var(--brand-100)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Plus size={14} color="var(--brand-400)" />
            </div>
            <span style={{ fontWeight: 700, fontSize: 14, color: "var(--text)" }}>Nova assinatura</span>
          </div>

          {formError && <div className="error-box">{formError}</div>}

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr auto", gap: 12, alignItems: "flex-end" }}>
            <div className="field">
              <label className="field-label">Serviço</label>
              <input className="field-input" placeholder="Netflix, Spotify…" value={serviceName}
                onChange={e => setSN(e.target.value)} />
            </div>
            <div className="field">
              <label className="field-label">Preço (R$)</label>
              <input className="field-input" type="number" placeholder="29.90" value={price}
                onChange={e => setPrice(e.target.value)} />
            </div>
            <div className="field">
              <label className="field-label">Dia de cobrança</label>
              <input className="field-input" type="number" placeholder="15" min="1" max="31" value={billingDate}
                onChange={e => setBD(e.target.value)} />
            </div>
            <button className="btn btn-brand" onClick={create}>
              <Plus size={15} /> Adicionar
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="anim-3" style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
          {[["all","Todas"],["active","Ativas"],["canceled","Canceladas"]].map(([key,lbl]) => (
            <button key={key} onClick={() => setFilter(key)}
              style={{
                padding: "6px 14px", borderRadius: 99, fontFamily: "var(--font)",
                fontSize: 13, fontWeight: 500, cursor: "pointer",
                border: filter === key ? "1px solid var(--brand-400)" : "1px solid var(--border)",
                background: filter === key ? "var(--brand-100)" : "var(--surface)",
                color: filter === key ? "var(--brand-500)" : "var(--text-2)",
                transition: "all 0.15s",
              }}>
              {lbl}
            </button>
          ))}
          <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--text-3)" }}>
            {filtered.length} item{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* List */}
        <div className="anim-4" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {loading ? (
            <p style={{ fontSize: 14, color: "var(--text-3)", padding: "8px 0" }}>Carregando…</p>
          ) : filtered.length === 0 ? (
            <p style={{ fontSize: 14, color: "var(--text-3)", padding: "8px 0" }}>Nenhuma assinatura encontrada.</p>
          ) : filtered.map(sub => (
            <div key={sub.id} className="sub-item">
              {editingId === sub.id ? (
                <>
                  <input className="field-input" style={{ flex: 2 }} defaultValue={sub.serviceName}
                    onChange={e => setEditData(d => ({ ...d, serviceName: e.target.value }))} />
                  <input className="field-input" type="number" style={{ width: 100 }} defaultValue={sub.price}
                    onChange={e => setEditData(d => ({ ...d, price: Number(e.target.value) }))} />
                  <input className="field-input" type="number" style={{ width: 80 }} defaultValue={sub.billingDate}
                    onChange={e => setEditData(d => ({ ...d, billingDate: Number(e.target.value) }))} />
                  <button className="btn btn-success btn-icon" onClick={() => save(sub.id)}><Check size={14} /></button>
                  <button className="btn btn-surface btn-icon" onClick={() => setEditingId(null)}><X size={14} /></button>
                </>
              ) : (
                <>
                  <div className="sub-avatar">{sub.serviceName[0].toUpperCase()}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 15, color: "var(--text)" }}>{sub.serviceName}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--text-2)", marginTop: 2 }}>
                      <Calendar size={11} />
                      Dia {sub.billingDate} · R$ {Number(sub.price).toFixed(2).replace(".", ",")}/mês
                    </div>
                  </div>
                  <span className={`badge badge-${sub.status === "CANCELADA" ? "canceled" : "active"}`}>
                    {sub.status === "CANCELADA" ? <XCircle size={11}/> : <CheckCircle size={11}/>}
                    {sub.status}
                  </span>
                  {sub.status !== "CANCELADA" && (
                    <button className="btn btn-surface btn-icon btn-sm"
                      onClick={() => { setEditingId(sub.id); setEditData({}); }} title="Editar">
                      <Edit3 size={13} />
                    </button>
                  )}
                  {sub.status !== "CANCELADA" && (
                    <button className="btn btn-warning btn-icon btn-sm"
                      onClick={() => cancel(sub.id, sub)} title="Cancelar">
                      <XCircle size={13} />
                    </button>
                  )}
                  <button className="btn btn-danger btn-icon btn-sm"
                    onClick={() => remove(sub.id)} title="Remover">
                    <Trash2 size={13} />
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

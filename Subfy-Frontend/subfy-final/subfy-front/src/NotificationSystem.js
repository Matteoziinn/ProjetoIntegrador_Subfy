import { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";

export function getAlerts(subscriptions) {
  const alerts = [];
  for (const sub of subscriptions) {
    if (sub.status === "CANCELADA") continue;
    const today = new Date();
    const cur = today.getDate();
    const dim = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    let diff = sub.billingDate - cur;
    if (diff < 0) diff += dim;
    if (diff === 0) alerts.push({ type: "danger", sub, days: 0, label: "Vence HOJE" });
    else if (diff <= 3) alerts.push({ type: "warning", sub, days: diff, label: `Vence em ${diff} dia${diff > 1 ? "s" : ""}` });
  }
  return alerts.sort((a, b) => a.days - b.days);
}

export default function NotificationSystem() {
  const [toasts, setToasts] = useState([]);
  const [shown, setShown]   = useState(false);
  const location            = useLocation();

  // Páginas públicas — não mostrar notificações
  const publicPages = ["/", "/register"];
  const isPublic    = publicPages.includes(location.pathname);

  const remove = useCallback((id) => setToasts(t => t.filter(x => x.id !== id)), []);

  // Limpa toasts ao navegar para página pública (logout)
  useEffect(() => {
    if (isPublic) {
      setToasts([]);
      setShown(false);
    }
  }, [isPublic]);

  useEffect(() => {
    // Não roda em páginas públicas ou se já mostrou
    if (isPublic || shown) return;

    const token = localStorage.getItem("token");
    const email = localStorage.getItem("userEmail");
    if (!token || !email) return;

    const timer = setTimeout(async () => {
      // Verifica novamente se ainda está logado no momento do disparo
      const t = localStorage.getItem("token");
      const e = localStorage.getItem("userEmail");
      if (!t || !e) return;

      try {
        const res = await fetch(`http://localhost:8080/subscriptions/${e}`, {
          headers: { Authorization: `Bearer ${t}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        if (!Array.isArray(data)) return;

        const alerts = getAlerts(data);
        if (!alerts.length) return;

        setShown(true);

        if ("Notification" in window && Notification.permission === "granted") {
          alerts.slice(0, 2).forEach(a =>
            new Notification(" Subfy — Vencimento próximo", {
              body: `${a.sub.serviceName} — ${a.label} (R$ ${a.sub.price})`,
              icon: "/favicon.ico",
            })
          );
        }

        const newToasts = alerts.slice(0, 3).map(a => ({
          ...a,
          id: Math.random().toString(36).slice(2),
        }));
        setToasts(newToasts);
        newToasts.forEach(t => setTimeout(() => remove(t.id), 7000));
      } catch {}
    }, 1800);

    return () => clearTimeout(timer);
  }, [isPublic, shown, remove]);

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default")
      Notification.requestPermission();
  }, []);

  // Não renderiza nada em páginas públicas
  if (isPublic || !toasts.length) return null;

  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <span style={{ fontSize: 18, flexShrink: 0 }}>
            {t.type === "danger" ? "🔴" : "🟡"}
          </span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text)" }}>
              {t.sub.serviceName}
            </div>
            <div style={{ fontSize: 13, color: "var(--text-2)", marginTop: 2 }}>
              {t.label} · R$ {Number(t.sub.price).toFixed(2).replace(".", ",")}
            </div>
          </div>
          <button className="toast-close" onClick={() => remove(t.id)}>×</button>
        </div>
      ))}
    </div>
  );
}

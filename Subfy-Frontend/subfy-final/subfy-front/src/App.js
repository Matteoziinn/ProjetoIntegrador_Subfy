import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import "./index.css";

import Login          from "./Login";
import Register       from "./Register";
import Dashboard      from "./Dashboard";
import Subscriptions  from "./Subscriptions";
import Plans          from "./Plans";
import Profile        from "./Profile";
import NotificationSystem from "./NotificationSystem";

export default function App() {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const p = { darkMode, setDarkMode };

  return (
    <>
      <NotificationSystem />
      <Routes>
        <Route path="/"              element={<Login />} />
        <Route path="/register"      element={<Register />} />
        <Route path="/dashboard"     element={<Dashboard {...p} />} />
        <Route path="/subscriptions" element={<Subscriptions {...p} />} />
        <Route path="/plans"         element={<Plans {...p} />} />
        <Route path="/profile"       element={<Profile {...p} />} />
      </Routes>
    </>
  );
}

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api, { setToken } from "./api/axios";

import Login from "./pages/Login";
import UserForm from "./pages/UserForm";

import BoardList from "./components/BoardList";
import BoardForm from "./components/BoardForm";
import BoardDetail from "./components/BoardDetail";

export default function App() {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================
  // refresh 로그인
  // =========================
  useEffect(() => {
    const autoLogin = async () => {
      try {
        const res = await api.post("/refresh");

        console.log("REFRESH:", res.data);

        setToken(res.data.access_token);
        setUser(res.data.user);

      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    autoLogin();
  }, []);

  // =========================
  // login 성공 처리
  // =========================
  const handleLogin = (userData) => {
    console.log("LOGIN USER:", userData);

    setUser(userData);
  };
  // =========================
  // logout
  // =========================
  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } finally {
      setUser(null);
      setToken(null);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/login"
          element={<Login onLogin={handleLogin} />}
        />

        <Route path="/register" element={<UserForm />} />
        <Route
          path="/write"
          element={
            user
              ? <BoardForm user={user} />
              : <Navigate to="/login" />
          }
        />
        <Route
          path="/post/:id"
          element={
            user
              ? <BoardDetail user={user} />
              : <Navigate to="/login" />
          }
        />
        <Route
          path="/"
          element={
            user ? (
              <BoardList user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

      </Routes>
    </BrowserRouter>
  );
}
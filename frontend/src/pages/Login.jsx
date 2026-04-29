import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { setToken } from "../api/axios";

export default function Login({ onLogin }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await api.post("/login", form);
      console.log("LOGIN RESPONSE:", res.data);
      const { access_token, user } = res.data;

      if (!user) {
        alert("서버에서 user 정보가 없습니다");
        return;
      }
      setToken(access_token);

      //핵심: user 그대로 전달
      onLogin(user);
      navigate("/");
    } catch (err) {
      console.log("LOGIN ERROR:", err);
      alert("로그인 실패 (네트워크 or 인증 오류)");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">
          로그인
        </h1>
        <input
          className="w-full border p-2 mb-3"
          placeholder="email"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />
        <input
          className="w-full border p-2 mb-3"
          type="password"
          placeholder="password"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />
        <button
          className="w-full bg-blue-500 text-white p-2"
          onClick={handleLogin}
        >
          로그인
        </button>
        <button
          className="w-full mt-3 text-sm text-blue-500"
          onClick={() => navigate("/register")}
        >
          회원가입
        </button>

      </div>
    </div>
  );
}
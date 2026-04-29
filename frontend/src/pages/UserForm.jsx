import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function UserForm() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    nickname: "",
    name: "",
    address: "",
    phone: "",
  });

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await api.post("/register", form);
      alert("회원가입 완료");
      navigate("/login"); // 로그인으로 이동
    } catch (err) {
      alert("회원가입 실패");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6">

        {/* 타이틀 */}
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
          회원가입
        </h1>

        {/* 이메일 */}
        <input
          placeholder="이메일"
          className="w-full mb-3 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        {/* 비밀번호 */}
        <input
          type="password"
          placeholder="비밀번호"
          className="w-full mb-3 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        {/* 닉네임 */}
        <input
          placeholder="닉네임"
          className="w-full mb-3 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
          onChange={(e) =>
            setForm({ ...form, nickname: e.target.value })
          }
        />

        {/* 이름 */}
        <input
          placeholder="이름"
          className="w-full mb-3 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        {/* 주소 */}
        <input
          placeholder="주소"
          className="w-full mb-3 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
          onChange={(e) =>
            setForm({ ...form, address: e.target.value })
          }
        />

        {/* 전화번호 */}
        <input
          placeholder="전화번호"
          className="w-full mb-5 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
          onChange={(e) =>
            setForm({ ...form, phone: e.target.value })
          }
        />

        {/* 버튼 */}
        <button
          onClick={handleRegister}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
        >
          회원가입
        </button>

        {/* 로그인 이동 */}
        <button
          onClick={() => navigate("/login")}
          className="w-full mt-3 text-sm text-blue-500 hover:underline"
        >
          로그인으로 돌아가기
        </button>

      </div>
    </div>
  );
}
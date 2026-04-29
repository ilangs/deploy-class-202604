import { useState } from "react";
import { createPost } from "../api/post";
import { useNavigate } from "react-router-dom";

export default function BoardForm({ user }) {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    content: ""
  });

  const handleSubmit = async () => {
    await createPost(form);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">

      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">

        <h2 className="text-xl font-bold mb-4">
          글쓰기
        </h2>

        <input
          className="w-full mb-3 p-3 border rounded"
          placeholder="제목"
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />

        <textarea
          className="w-full h-40 mb-4 p-3 border rounded"
          placeholder="내용"
          onChange={(e) =>
            setForm({ ...form, content: e.target.value })
          }
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-500 text-white py-3 rounded"
        >
          저장
        </button>

      </div>
    </div>
  );
}
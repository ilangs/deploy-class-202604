import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { getPost, deletePost, updatePost } from "../api/post"; // ⭐ 수정
import {
  getComments,
  createComment,
  deleteComment,
  updateComment
} from "../api/comment";

export default function BoardDetail({ user }) {

  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  // =========================
  // ⭐ 게시글 수정 상태 추가
  // =========================
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    content: ""
  });

  const loadPost = async () => {
    const res = await getPost(id);
    setPost(res.data);
  };

  const loadComments = async () => {
    const res = await getComments(id);
    setComments(res.data || []);
  };

  useEffect(() => {
    loadPost();
    loadComments();
  }, [id]);

  const isPostOwner = Number(post?.user_id) === Number(user?.id);

  // =========================
  // ⭐ 게시글 수정 시작
  // =========================
  const startEditPost = () => {
    setEditForm({
      title: post.title,
      content: post.content
    });
    setIsEditing(true);
  };

  // =========================
  // ⭐ 게시글 수정 저장
  // =========================
  const saveEditPost = async () => {
    await updatePost(id, editForm);
    setIsEditing(false);
    loadPost();
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-3xl mx-auto px-4">

        {/* 뒤로 */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-gray-600 hover:text-black"
        >
          ← 뒤로
        </button>

        {/* 게시글 */}
        {post && (
          <div className="bg-white shadow rounded-lg p-6 mb-6">

            {/* =========================
                ⭐ 수정 모드
            ========================= */}
            {isEditing ? (
              <>
                <input
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value })
                  }
                  className="w-full border p-2 mb-2 rounded"
                />

                <textarea
                  value={editForm.content}
                  onChange={(e) =>
                    setEditForm({ ...editForm, content: e.target.value })
                  }
                  className="w-full border p-2 mb-2 rounded"
                />

                <div className="flex justify-end gap-2">
                  <button
                    onClick={saveEditPost}
                    className="bg-green-500 text-white px-4 py-1 rounded"
                  >
                    저장
                  </button>

                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-400 text-white px-4 py-1 rounded"
                  >
                    취소
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* 제목 */}
                <div className="flex justify-between items-start">
                  <h2 className="text-2xl font-bold mb-2">
                    {post.title}
                  </h2>

                  {/* ⭐ 오른쪽 버튼 */}
                  {isPostOwner && (
                    <div className="flex gap-2">
                      <button
                        onClick={startEditPost}
                        className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                      >
                        수정
                      </button>

                      <button
                        onClick={async () => {
                          await deletePost(id);
                          navigate("/");
                        }}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        삭제
                      </button>
                    </div>
                  )}
                </div>

                {/* 내용 */}
                <p className="text-gray-700 mb-4">
                  {post.content}
                </p>

                <p className="text-sm text-gray-500">
                  작성자: {post.nickname ?? "알수없음"}
                </p>
              </>
            )}

          </div>
        )}

        {/* 댓글 입력 */}
        <div className="bg-white p-4 rounded shadow mb-4 flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 border p-2 rounded"
            placeholder="댓글 입력"
          />
          <button
            onClick={async () => {
              await createComment(id, { text });
              setText("");
              loadComments();
            }}
            className="bg-blue-500 text-white px-4 rounded"
          >
            등록
          </button>
        </div>

        {/* 댓글 리스트 */}
        {comments.map((c) => {

          const isOwner = Number(c.user_id) === Number(user?.id);

          return (
            <div key={c.id} className="bg-white p-3 rounded shadow mb-2">

              {editId === c.id ? (
                <div className="flex gap-2">
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="flex-1 border p-1"
                  />
                  <button
                    onClick={async () => {
                      await updateComment(c.id, { text: editText });
                      setEditId(null);
                      loadComments();
                    }}
                    className="bg-green-500 text-white px-2"
                  >
                    저장
                  </button>
                </div>
              ) : (
                <div className="flex justify-between">

                  <span>{c.text}</span>

                  {isOwner && (
                    <div className="flex gap-2 text-sm">
                      <button
                        onClick={() => {
                          setEditId(c.id);
                          setEditText(c.text);
                        }}
                        className="text-yellow-600"
                      >
                        수정
                      </button>
                      <button
                        onClick={async () => {
                          await deleteComment(c.id);
                          loadComments();
                        }}
                        className="text-red-500"
                      >
                        삭제
                      </button>
                    </div>
                  )}

                </div>
              )}

            </div>
          );
        })}

      </div>
    </div>
  );
}
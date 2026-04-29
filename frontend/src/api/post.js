// ==========================
// 게시글 API
// ==========================
import api from "./axios";

// =========================
// 게시글 목록 ( 수정된 부분)
// =========================
export const getPosts = ({ page = 1, size = 10, keyword = "" }) => {
  return api.get("/posts", {
    params: {
      page,
      size,
      keyword
    }
  });
};

// 게시글 상세
export const getPost = (id) => api.get(`/posts/${id}`);

// 게시글 생성
export const createPost = (data) => api.post("/posts", data);

// 게시글 수정
export const updatePost = (id, data) => api.put(`/posts/${id}`, data);

// 게시글 삭제
export const deletePost = (id) => api.delete(`/posts/${id}`);
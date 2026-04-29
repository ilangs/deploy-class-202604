// =========================
// 댓글 API 모듈
// =========================

import api from "./axios";

// =========================
// 댓글 목록 조회
// =========================
export const getComments = (postId) => {
  return api.get(`/posts/${postId}/comments`);
};
// =========================
// 댓글 생성
// =========================
export const createComment = (postId, data) => {
  return api.post(`/posts/${postId}/comments`, data);
};
// =========================
// 댓글 삭제
// =========================
export const deleteComment = (commentId) => {
  return api.delete(`/comments/${commentId}`);
};
// =========================
// 댓글 수정
// =========================
export const updateComment = (commentId, data) => {
  return api.put(`/comments/${commentId}`, data);
};
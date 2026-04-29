import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "../api/comment";

export const useComments = (postId) => {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => (await api.fetchComments(postId)).data
  });

  const createMut = useMutation({
    mutationFn: ({ text }) => api.createComment(postId, text),
    onSuccess: () => qc.invalidateQueries(["comments", postId])
  });

  const updateMut = useMutation({
    mutationFn: ({ id, text }) => api.updateComment(id, text),
    onSuccess: () => qc.invalidateQueries(["comments", postId])
  });

  const deleteMut = useMutation({
    mutationFn: (id) => api.deleteComment(id),
    onSuccess: () => qc.invalidateQueries(["comments", postId])
  });

  return {
    ...query,
    createComment: createMut.mutate,
    updateComment: updateMut.mutate,
    deleteComment: deleteMut.mutate
  };
};
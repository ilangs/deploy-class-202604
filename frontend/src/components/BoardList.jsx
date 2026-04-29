import { useEffect, useState } from "react";
import { getPosts } from "../api/post";
import { useNavigate } from "react-router-dom";
import Pagination from "./Pagination";

const PAGE_SIZE = 5;

export default function BoardList({ user, onLogout }) {

  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  const navigate = useNavigate();

  const loadPosts = async () => {
    const res = await getPosts({
      page,
      size: PAGE_SIZE,
      keyword: searchKeyword
    });
    setPosts(res.data.items || []);
    setTotal(res.data.total || 0);
  };

  useEffect(() => {
    loadPosts();
  }, [page, searchKeyword]);

  const handleSearch = () => {
    setSearchKeyword(keyword);
    setPage(1);
    setKeyword("");
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-5xl mx-auto px-4">

        {/* 상단 */}
        <div className="flex justify-between mb-6">
          <div className="font-semibold text-lg">
            👤 {user?.nickname || user?.email}
          </div>
          <button onClick={onLogout} className="text-red-500">
            로그아웃
          </button>
        </div>

        {/* 검색 */}
        <div className="flex gap-2 mb-6">
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="검색어 입력"
            className="border p-2 flex-1 rounded"
          />
          <button
            onClick={handleSearch}
            className="bg-gray-700 text-white px-4 rounded"
          >
            검색
          </button>
        </div>

        {/* 글쓰기 */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => navigate("/write")}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            글쓰기
          </button>
        </div>

        {/* 테이블 */}
        <div className="bg-white rounded shadow overflow-hidden">
          <table className="w-full">

            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 text-center">ID</th>
                <th className="p-3 text-left">제목</th>
                <th className="p-3 text-center">작성자</th>
                <th className="p-3 text-center">댓글</th> {/* ⭐ 추가 */}
              </tr>
            </thead>

            <tbody>
              {posts.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => navigate(`/post/${p.id}`)}
                  className="cursor-pointer hover:bg-gray-50 border-t"
                >
                  <td className="p-3 text-center">{p.id}</td>

                  {/* ⭐ 제목 + 댓글수 표시 */}
                  <td className="p-3">
                    <span className="font-medium">{p.title}</span>

                    {p.comment_count > 0 && (
                      <span className="ml-2 text-sm text-red-500">
                        ({p.comment_count})
                      </span>
                    )}
                  </td>

                  <td className="p-3 text-center text-gray-600">
                    {p.nickname ?? "알수없음"}
                  </td>

                  {/* ⭐ 숫자만 따로 */}
                  <td className="p-3 text-center text-blue-500 font-semibold">
                    {p.comment_count}
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>

        {/* 페이징 */}
        <Pagination
          total={total}
          page={page}
          setPage={setPage}
        />

      </div>
    </div>
  );
}
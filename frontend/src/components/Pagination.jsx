export default function Pagination({ total, page, setPage }) {

  const pageSize = 5;
  const totalPages = Math.ceil(total / pageSize);

  const blockSize = 10;
  const currentBlock = Math.floor((page - 1) / blockSize);

  const startPage = currentBlock * blockSize + 1;
  const endPage = Math.min(startPage + blockSize - 1, totalPages);

  return (
    <div className="flex justify-center items-center gap-2 mt-6">

      {/* 이전 블럭 */}
      {startPage > 1 && (
        <button
          onClick={() => setPage(startPage - 1)}
          className="px-3 py-1 border rounded bg-gray-200"
        >
          ◀
        </button>
      )}

      {/* 페이지 번호 */}
      {Array.from({ length: endPage - startPage + 1 }).map((_, i) => {
        const p = startPage + i;

        return (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`px-3 py-1 rounded border ${
              page === p
                ? "bg-blue-500 text-white"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            {p}
          </button>
        );
      })}
      {/* 다음 블럭 */}
      {endPage < totalPages && (
        <button
          onClick={() => setPage(endPage + 1)}
          className="px-3 py-1 border rounded bg-gray-200"
        >
          ▶
        </button>
      )}
    </div>
  );
}
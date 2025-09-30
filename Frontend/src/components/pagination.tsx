interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages: (number | string)[] = [];

  for (let i = 1; i <= totalPages; i++) {
    // Only show first, last, current, and nearby pages
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pages.push(i);
    } else if (
      (i === currentPage - 2 && currentPage > 3) ||
      (i === currentPage + 2 && currentPage < totalPages - 2)
    ) {
      pages.push("...");
    }
  }

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3 mt-6 flex-wrap">
      {/* Previous Button */}
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={`px-2 sm:px-3 py-1 rounded-full border text-sm sm:text-base ${
          currentPage === 1
            ? "text-gray-400 border-gray-300 cursor-not-allowed"
            : "text-purple-600 border-purple-400 hover:bg-purple-100"
        }`}
      >
        &lt;
      </button>

      {/* Page Numbers */}
      {/* Small screens: only show current page */}
      <div className="flex sm:hidden items-center gap-2">
        <span className="px-3 py-1 rounded-full bg-purple-600 text-white border border-purple-600">
          {currentPage}
        </span>
        <span className="text-gray-600">/ {totalPages}</span>
      </div>

      {/* Medium+ screens: show full pagination */}
      <div className="hidden sm:flex items-center gap-2 sm:gap-3">
        {pages.map((p, idx) =>
          p === "..." ? (
            <span key={idx} className="px-2 text-gray-500">
              ...
            </span>
          ) : (
            <button
              key={idx}
              onClick={() => onPageChange(p as number)}
              className={`px-3 py-1 rounded-full border ${
                currentPage === p
                  ? "bg-purple-600 text-white border-purple-600"
                  : "text-purple-600 border-purple-400 hover:bg-purple-100"
              }`}
            >
              {p}
            </button>
          )
        )}
      </div>

      {/* Next Button */}
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className={`px-2 sm:px-3 py-1 rounded-full border text-sm sm:text-base ${
          currentPage === totalPages
            ? "text-gray-400 border-gray-300 cursor-not-allowed"
            : "text-purple-600 border-purple-400 hover:bg-purple-100"
        }`}
      >
        &gt;
      </button>
    </div>
  );
}

export default Pagination;

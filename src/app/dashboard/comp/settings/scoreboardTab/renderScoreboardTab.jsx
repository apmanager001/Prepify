import React from "react";
import useUserScores from "./useUserScores";
import useTotalScore from "../../dashboardComps/useTotalScore";

const Scoreboard = () => {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [sort, setSort] = React.useState("createdAt:desc");
  const [filter, setFilter] = React.useState("");
  const { data: totalData, isLoading: isTotalLoading, isError: isTotalError } = useTotalScore();

  const { data, isLoading, isError, error, isFetching } = useUserScores({
    page,
    pageSize,
    sort,
    filter,
  });

  const scores = data?.items || [];
  const total = data?.total || 0;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Scoreboard</h2>
        {isTotalLoading ? (
          <div className="text-sm text-gray-500">Loading total score...</div>
        ) : isTotalError ? (
          <div className="text-sm text-gray-500">
            {isFetching ? "Refreshing..." : ""}
          </div>
        ) : (
          <div className="text-sm text-gray-500">
            Lifetime Score: {totalData?.totalScore ?? 0}
          </div>
        )}
      </div>

      <div className="flex gap-3 items-center">
        <input
          type="text"
          placeholder="Filter by type"
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setPage(1);
          }}
          className="input input-sm input-bordered"
        />

        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            setPage(1);
          }}
          className="select select-sm select-bordered"
        >
          <option value="createdAt:desc">Newest</option>
          <option value="createdAt:asc">Oldest</option>
          <option value="amount:desc">Highest score</option>
          <option value="amount:asc">Lowest score</option>
        </select>

        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setPage(1);
          }}
          className="select select-sm select-bordered"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={25}>25</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Type</th>
              <th>Amount</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={3} className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={3} className="text-center py-6">
                  Error: {error?.message || "Failed to load"}
                </td>
              </tr>
            ) : scores.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-6">
                  No scores found
                </td>
              </tr>
            ) : (
              scores.map((s) => (
                <tr key={s._id || `${s.type}-${s.createdAt}`}>
                  <td className="font-medium">{s.type}</td>
                  <td>{s.amount}</td>
                  <td className="text-sm text-gray-500">
                    {new Date(s.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col md:flex-row gap-2 md:gap-0 items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {(page - 1) * pageSize + 1} -{" "}
          {Math.min(page * pageSize, total)} of {total}
        </div>
        <div className="btn-group">
          <button
            className="btn btn-sm"
            onClick={() => setPage(1)}
            disabled={page === 1}
          >
            First
          </button>
          <button
            className="btn btn-sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Prev
          </button>
          <button className="btn btn-sm">{page}</button>
          <button
            className="btn btn-sm"
            onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
            disabled={page === pageCount}
          >
            Next
          </button>
          <button
            className="btn btn-sm"
            onClick={() => setPage(pageCount)}
            disabled={page === pageCount}
          >
            Last
          </button>
        </div>
      </div>
    </div>
  );
};

export default Scoreboard;

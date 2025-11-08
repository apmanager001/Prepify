import { useQuery } from "@tanstack/react-query";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND;

if (!API_BASE_URL) {
  console.error("❌ NEXT_PUBLIC_BACKEND environment variable is not set!");
}

async function fetchUserScores({
  page = 1,
  pageSize = 50,
  sort = "createdAt:desc",
  fields = "",
} = {}) {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("pageSize", String(pageSize));
  if (sort) params.set("sort", sort);
  if (fields) params.set("fields", fields);

  // The backend endpoint is GET /score/details and returns an object:
  // { scores: [...], page, pageSize, totalCount, totalPages }
  const res = await fetch(
    `${API_BASE_URL}/score/details?${params.toString()}`,
    {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    }
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to fetch user scores: ${res.status} ${text}`);
  }

  // return parsed JSON exactly as the backend shapes it
  return res.json();
}

const useUserScores = ({ page, pageSize, sort, filter }) => {
  return useQuery({
    queryKey: ["userScores", { page, pageSize, sort, filter }],
    queryFn: () => fetchUserScores({ page, pageSize, sort, filter }),
    keepPreviousData: true,
    staleTime: 30 * 1000,
  });
};

export default useUserScores;
export { fetchUserScores };

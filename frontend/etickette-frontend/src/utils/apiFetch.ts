const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export const apiFetch = async (
  endpoint: string,
  options: RequestInit = {},
  withAuth: boolean = true
): Promise<Response> => {
  const token = localStorage.getItem("token");

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {}),
    "Content-Type": "application/json",
  };

  if (withAuth && token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  return res;
};

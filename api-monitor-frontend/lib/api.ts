export const API_BASE = "http://localhost:8000/api";

export async function apiFetch(
  url: string,
  method: string = "GET",
  body?: any
) {
  const token = localStorage.getItem("token");

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  return res.json();
}

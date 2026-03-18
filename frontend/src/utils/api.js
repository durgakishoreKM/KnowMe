export const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  return fetch(import.meta.env.VITE_API_URL + url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
};
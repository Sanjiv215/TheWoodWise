const API_URL = import.meta.env.VITE_API_URL || "/api";

function authHeaders(token) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function getAccountData(token) {
  const response = await fetch(`${API_URL}/me/data`, {
    headers: authHeaders(token),
  });

  if (!response.ok) throw new Error("Could not load account data");
  return response.json();
}

export async function saveAccountData(token, data) {
  const response = await fetch(`${API_URL}/me/data`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Could not save account data");
  return response.json();
}

export async function logoutAccount(token) {
  if (!token) return;

  await fetch(`${API_URL}/logout`, {
    method: "POST",
    headers: authHeaders(token),
  });
}

export async function deleteAccount(token) {
  const response = await fetch(`${API_URL}/me`, {
    method: "DELETE",
    headers: authHeaders(token),
  });

  if (!response.ok) throw new Error("Could not delete account");
  return response.json();
}

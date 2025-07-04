const BASE_URL = "https://story-api.dicoding.dev/v1";

export async function loginUser(email, password) {
  try {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return await res.json();
  } catch {
    return { error: true, message: "Login gagal: jaringan error" };
  }
}

export async function registerUser(name, email, password) {
  try {
    const res = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    return await res.json();
  } catch {
    return { error: true, message: "Registrasi gagal: jaringan error" };
  }
}

export async function fetchAllStories({ size = 100 } = {}) {
  const token = localStorage.getItem("token");
  const params = new URLSearchParams({ size, location }).toString();
  const res = await fetch(`${BASE_URL}/stories?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  return data.error ? [] : data.listStory;
}

export async function uploadStory(formData) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/stories`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  return await res.json();
}

export const registerModel = {
  async registerUser(name, email, password) {
    try {
      const response = await fetch("https://story-api.dicoding.dev/v1/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      return data;
    } catch {
      return {
        error: true,
        message: "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.",
      };
    }
  },
};

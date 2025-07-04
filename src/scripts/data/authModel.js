export const authModel = {
  saveToken(token) {
    localStorage.setItem("token", token);
  },
  getToken() {
    return localStorage.getItem("token");
  },
  clearToken() {
    localStorage.removeItem("token");
  },
};

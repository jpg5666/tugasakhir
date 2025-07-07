import { registerModel } from "./registerModel.js";
import {
  displayRegisterPage,
  setupRegisterEvents,
  showRegisterAlert,
  getRegisterFormData,
  navigateToLogin,
} from "./registerView.js";
import { withViewTransition } from "../../utils/transition.js";

export function renderRegister() {
  const main = document.getElementById("main");
  if (!main) return;

  withViewTransition(() => {
    displayRegisterPage(main);
    registerPresenter();
  });
}

export function registerPresenter() {
  setupRegisterEvents({
    onSubmit: handleRegisterSubmit,
    onNavigateToLogin: handleNavigateToLogin,
  });
}

async function handleRegisterSubmit() {
  const { name, email, password } = getRegisterFormData();

  if (!name || !email || !password) {
    showRegisterAlert("Semua kolom wajib diisi!");
    return;
  }

  if (password.length < 8) {
    showRegisterAlert("Password minimal 8 karakter!");
    return;
  }

  const result = await registerModel.registerUser(name, email, password);

  if (!result.error) {
    showRegisterAlert("Registrasi berhasil! Silakan login.");
    navigateToLogin();
  } else {
    showRegisterAlert("Registrasi gagal: " + result.message);
  }
}

function handleNavigateToLogin() {
  navigateToLogin();
}

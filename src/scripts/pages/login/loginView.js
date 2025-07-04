export function renderLoginView() {
  return `
    <section class="login-section">
      <div class="login-card">
        <h1>Login</h1>
        <form id="login-form">
          <label for="email">Email:</label>
          <input type="email" id="email" required />
          <label for="password">Password:</label>
          <input type="password" id="password" required />
          <button type="submit">Login</button>
        </form>
        <p>Belum punya akun? <a href="#/register" id="to-register-link">Daftar di sini</a></p>
      </div>
    </section>
  `;
}

export function getLoginElements() {
  return {
    form: document.getElementById("login-form"),
    emailInput: document.getElementById("email"),
    passwordInput: document.getElementById("password"),
    toRegisterLink: document.getElementById("to-register-link"),
  };
}

export function getLoginFormData() {
  const { emailInput, passwordInput } = getLoginElements();
  return {
    email: emailInput?.value.trim(),
    password: passwordInput?.value,
  };
}

export function setupLoginEvents({ onSubmit, onNavigateToRegister }) {
  const { form, toRegisterLink } = getLoginElements();

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    onSubmit();
  });

  toRegisterLink?.addEventListener("click", (e) => {
    e.preventDefault();
    onNavigateToRegister();
  });
}

export function showSuccessLoginAlert() {
  alert("Login berhasil!");
}

export function showFailedLoginAlert(message) {
  alert("Login gagal: " + (message || "Email atau password salah."));
}

export function goToRegister() {
  window.location.hash = "#/register";
}

export function goToHome() {
  window.location.hash = "#/home";
}

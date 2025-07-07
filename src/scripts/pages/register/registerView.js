export function renderRegisterView() {
  return `
    <section class="auth-page" tabindex="-1">
      <div class="auth-card">
        <h1>Register</h1>
        <form id="register-form">
          <label for="name">Nama</label>
          <input type="text" id="name" required />
          <label for="email">Email</label>
          <input type="email" id="email" required />
          <label for="password">Password</label>
          <input type="password" id="password" required />
          <button type="submit">Daftar</button>
        </form>
        <p>Sudah punya akun? <a href="#/login" id="to-login-link">Login di sini</a></p>
      </div>
    </section>
  `;
}

export function displayRegisterPage(mainElement) {
  if (!mainElement) return;
  mainElement.innerHTML = renderRegisterView();
}

export function getRegisterElements() {
  return {
    form: document.getElementById("register-form"),
    nameInput: document.getElementById("name"),
    emailInput: document.getElementById("email"),
    passwordInput: document.getElementById("password"),
    toLoginLink: document.getElementById("to-login-link"),
  };
}

export function getRegisterFormData() {
  const { nameInput, emailInput, passwordInput } = getRegisterElements();
  return {
    name: nameInput?.value.trim(),
    email: emailInput?.value.trim(),
    password: passwordInput?.value,
  };
}

export function setupRegisterEvents({ onSubmit, onNavigateToLogin }) {
  const { form, toLoginLink } = getRegisterElements();

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    onSubmit();
  });

  toLoginLink?.addEventListener("click", (e) => {
    e.preventDefault();
    onNavigateToLogin();
  });
}

export function showRegisterAlert(message) {
  alert(message);
}

export function navigateToLogin() {
  window.location.hash = "#/login";
}

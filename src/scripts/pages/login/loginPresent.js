import { loginModel } from "./loginModel.js";
import {
  displayLoginPage,
  setupLoginEvents,
  showSuccessLoginAlert,
  showFailedLoginAlert,
  getLoginFormData,
  goToHome,
  goToRegister,
} from "./loginView.js";
import { withViewTransition } from "../../utils/transition.js";

export function renderLogin() {
  const main = document.getElementById("main");
  if (!main) return;

  withViewTransition(() => {
    displayLoginPage(main);
    loginPresenter();
  });
}

export function loginPresenter() {
  setupLoginEvents({
    onSubmit: handleLoginSubmit,
    onNavigateToRegister: () => withViewTransition(goToRegister),
  });
}

async function handleLoginSubmit() {
  const { email, password } = getLoginFormData();

  if (!email || !password) {
    showFailedLoginAlert("Email dan Password harus diisi!");
    return;
  }

  const result = await loginModel.loginUserAndSaveToken(email, password);
  const token = result?.loginResult?.token;

  if (!result.error && token) {
    showSuccessLoginAlert();
    withViewTransition(goToHome);
  } else {
    showFailedLoginAlert(result.message);
  }
}

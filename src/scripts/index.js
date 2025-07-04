import App from "./pages/app.js";
import { initRouter } from "./routes/routes.js";
import "../styles/styles.css";
import "./utils/transition.js";

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const currentHash = window.location.hash;

  if (!token && (!currentHash || currentHash === "#/" || currentHash === "#")) {
    window.location.hash = "#/login";
  }

  const app = new App({
    navigationDrawer: document.querySelector("#navigation-drawer"),
    drawerButton: document.querySelector("#drawer-button"),
    content: document.querySelector("#main"),
  });

  document.addEventListener("rerender", () => {
    app.renderPage();
  });

  initRouter();
});

import App from "./pages/app.js";
import { initRouter } from "./routes/routes.js";
import "../styles/styles.css";
import "./utils/transition.js";

document.addEventListener("DOMContentLoaded", () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/sw.js")
      .then(() => {
        console.log("Service Worker berhasil didaftarkan.");
      })
      .catch((error) => {
        console.error("Gagal mendaftarkan Service Worker:", error);
      });
  }

  const token = localStorage.getItem("token");
  const currentHash = window.location.hash;

  const skipLink = document.querySelector(".skip-to-content");

  const updateSkipLinkStatus = () => {
    const currentRoute = window.location.hash.substring(1);
    const isHomePage =
      currentRoute === "" ||
      currentRoute === "/" ||
      currentRoute === "/home" ||
      currentRoute === "/main";

    if (skipLink) {
      if (isHomePage) {
        skipLink.removeAttribute("tabindex");
        skipLink.removeAttribute("aria-hidden");
        skipLink.style.display = "";
      } else {
        skipLink.style.display = "none";
        skipLink.setAttribute("tabindex", "-1");
        skipLink.setAttribute("aria-hidden", "true");
      }
    }
  };

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

  app.renderPage();

  updateSkipLinkStatus();
  window.addEventListener("hashchange", updateSkipLinkStatus);
});

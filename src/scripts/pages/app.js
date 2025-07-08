import routes from "../routes/routes.js";
import { getActiveRoute } from "../routes/url-parser.js";

class App {
  #content;
  #drawerButton;
  #navigationDrawer;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;
    this._setupDrawer();
  }

  _setupDrawer() {
    this.#drawerButton.addEventListener("click", (event) => {
      event.stopPropagation();
      this.#navigationDrawer.classList.toggle("open");
    });

    window.addEventListener("click", (event) => {
      const isInsideDrawer = this.#navigationDrawer.contains(event.target);
      const isDrawerButton = this.#drawerButton.contains(event.target);
      if (!isInsideDrawer && !isDrawerButton) {
        this.#navigationDrawer.classList.remove("open");
      }
    });

    this.#navigationDrawer.addEventListener("click", (event) => {
      if (event.target.tagName === "A") {
        this.#navigationDrawer.classList.remove("open");
      }
    });
  }

  updateHeaderBasedOnAuth() {
    const navList = document.getElementById("nav-list");
    const token = localStorage.getItem("token");

    if (!navList) return;

    if (token) {
      navList.innerHTML = `
        <li><a href="#/fav">Favorit</a></li>
        <li><a href="#/map">Map</a></li>
        <li><a href="#/logout">Logout</a></li>
      `;
    } else {
      navList.innerHTML = `
        <li><a href="#/login">Login</a></li>
        <li><a href="#/register">Register</a></li>
      `;
    }

    if (token) {
      const logoutLink = navList.querySelector('a[href="#/logout"]');
      logoutLink?.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("token");
        alert("Logout berhasil!");
        window.location.hash = "#/login";
      });
    }
  }

  async renderPage() {
    let url = getActiveRoute();
    if (url === "/") url = "/home";

    const page = routes[url];

    if (page?.redirectTo) {
      window.location.hash = page.redirectTo();
      return;
    }

    const token = localStorage.getItem("token");
    if (page?.requireAuth && !token) {
      window.location.hash = "#/login";
      return;
    }

    this.updateHeaderBasedOnAuth();

    const isAuthPage = url === "/login" || url === "/register" || url === "/upload";
    const navDrawer = document.getElementById("navigation-drawer");
    const homeLink = document.getElementById("home-link");

    if (navDrawer) navDrawer.style.display = isAuthPage ? "none" : "";
    if (homeLink) homeLink.style.display = isAuthPage ? "none" : "inline-block";

    if (typeof page === "function") {
      await page();
    } else if (typeof page?.render === "function") {
      await page.render();
      await page.afterRender?.();
    } else {
      this.#content.innerHTML = "<p>Halaman tidak ditemukan.</p>";
    }
  }
}

export default App;

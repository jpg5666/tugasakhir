import { renderLogin, loginPresenter } from "../pages/login/loginPresent.js";
import { renderRegister, registerPresenter } from "../pages/register/registerPresent.js";
import { renderHomePage, homePresenter } from "../pages/home/homePresent.js";
import { renderMap } from "../pages/map/mapPresent.js";
import { renderUploadPage, uploadPresenter } from "../pages/upload/uploadPresent.js";
import { authModel } from "../data/authModel.js";

const routes = {
  "/": {
    render: () => {
      if (authModel.getToken()) renderHomePage();
      else renderLogin();
    },
    afterRender: () => {
      if (authModel.getToken()) homePresenter();
      else loginPresenter();
    },
  },
  "/home": { render: renderHomePage, afterRender: homePresenter },
  "/login": { render: renderLogin, afterRender: loginPresenter },
  "/register": { render: renderRegister, afterRender: registerPresenter },
  "/map": { render: renderMap, afterRender: null },
  "/upload": { render: renderUploadPage, afterRender: uploadPresenter },
  "/logout": {
    render: () => {
      authModel.clearToken();
      alert("Logout berhasil");
      window.location.hash = "#/login";
    },
    afterRender: () => {},
  },
};

export function initRouter() {
  window.addEventListener("hashchange", () => {
    document.dispatchEvent(new Event("rerender"));
  });
  document.dispatchEvent(new Event("rerender"));
}

export default routes;

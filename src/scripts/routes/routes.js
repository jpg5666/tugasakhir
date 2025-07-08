import { renderLogin, loginPresenter } from "../pages/login/loginPresent.js";
import { renderRegister, registerPresenter } from "../pages/register/registerPresent.js";
import { renderHomePage, homePresenter } from "../pages/home/homePresent.js";
import { renderMap, mapPresenter } from "../pages/map/mapPresent.js";
import { uploadPresenter } from "../pages/upload/uploadPresent.js";
import { renderFavPageView } from "../pages/fav/favView.js";
import { authModel } from "../data/authModel.js";
import { favPresenter } from "../pages/fav/favPresent.js";

function stopActiveCamera() {
  const video = document.getElementById("camera-preview");
  if (video?.srcObject) {
    video.srcObject.getTracks().forEach((t) => t.stop());
    video.srcObject = null;
  }
}

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
  "/map": { render: renderMap, afterRender: mapPresenter },
  "/upload": { render: uploadPresenter, afterRender: null },
  "/fav": { render: renderFavPageView, afterRender: favPresenter },
  "/logout": {
    render: () => {
      stopActiveCamera();
      authModel.clearToken();
      alert("Logout berhasil");
      window.location.hash = "#/login";
    },
    afterRender: () => {},
  },
};

export function initRouter() {
  window.addEventListener("hashchange", () => {
    stopActiveCamera();
    document.dispatchEvent(new Event("rerender"));
  });
}

export default routes;

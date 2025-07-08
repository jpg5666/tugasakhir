import { favModel } from "./favModel.js";
import { renderFavPageView, renderFavCards } from "./favView.js";

export function favPresenter() {
  renderFavPageView();

  favModel.getAll().then((stories) => {
    renderFavCards(stories, async (id) => {
      await favModel.remove(id);
      favPresenter();
    });
  });
}

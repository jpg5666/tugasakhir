import { homeModel } from "./homeModel.js";
import { renderHomePageView, renderStoryList, showHomeErrorMessage } from "./homeView.js";
import { withViewTransition } from "../../utils/transition.js";

export function renderHomePage() {
  withViewTransition(() => {
    renderHomePageView();
    homePresenter();
  });
}

export async function homePresenter() {
  try {
    const stories = await homeModel.fetchStoriesWithLocation();
    renderStoryList(stories);
  } catch {
    showHomeErrorMessage("Gagal memuat daftar cerita.");
  }
}

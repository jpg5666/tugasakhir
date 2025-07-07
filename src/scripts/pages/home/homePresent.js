import { homeModel } from "./homeModel.js";
import {
  renderHomePageView,
  renderStoryList,
  showHomeErrorMessage,
  showHomeLoadingMessage,
  setupClearDataButton,
  setClearDataButtonVisibility,
  showToast,
} from "./homeView.js";
import { withViewTransition } from "../../utils/transition.js";
import { getStoryList, saveStoryList } from "../../data/database.js";

export function renderHomePage() {
  withViewTransition(() => {
    renderHomePageView();
    homePresenter();
  });
}

export async function homePresenter() {
  setupNetworkStatusHandler();

  setupClearDataButton(async () => {
    if (!navigator.onLine) {
      await saveStoryList([]);
      alert("Data offline berhasil dihapus!");
      renderStoryList([]);
      showHomeErrorMessage("Belum ada cerita yang tersedia.");
    } else {
      alert("Hapus data offline hanya bisa dilakukan saat sedang offline.");
    }
  });

  showHomeLoadingMessage();

  if (!navigator.onLine) {
    const cached = await getStoryList();
    if (cached?.length) {
      renderStoryList(cached);
    } else {
      showHomeErrorMessage("Anda sedang offline dan belum ada data tersimpan.");
    }
    return;
  }

  try {
    const stories = await homeModel.fetchStoriesWithLocation();
    renderStoryList(stories);
    await saveStoryList(stories);
  } catch {
    const fallback = await getStoryList();
    if (fallback?.length) {
      renderStoryList(fallback);
    } else {
      showHomeErrorMessage("Gagal memuat daftar cerita.");
    }
  }
}

function setupNetworkStatusHandler() {
  let lastStatus = navigator.onLine;

  const updateUI = async (isOnline) => {
    if (isOnline !== lastStatus) {
      showToast(isOnline ? "Anda kembali online" : "Anda sedang offline");
      lastStatus = isOnline;

      if (isOnline) {
        showHomeLoadingMessage();
        try {
          const stories = await homeModel.fetchStoriesWithLocation();
          renderStoryList(stories);
          await saveStoryList(stories);
        } catch {
          showHomeErrorMessage("Gagal memuat ulang data dari server.");
        }
      }
    }

    setClearDataButtonVisibility(!isOnline);
  };

  updateUI(lastStatus);

  window.addEventListener("online", () => updateUI(true));
  window.addEventListener("offline", () => updateUI(false));
}

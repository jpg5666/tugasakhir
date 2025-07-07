export function renderHomePageView() {
  const main = document.getElementById("main");
  if (!main) return;

  const section = renderHome();
  main.replaceChildren(section);
}

export function renderHome() {
  const section = document.createElement("section");
  section.className = "home-section";

  const heading = document.createElement("h1");
  heading.textContent = "Daftar Cerita";

  const clearDataBtn = document.createElement("button");
  clearDataBtn.id = "clear-data-btn";
  clearDataBtn.className = "button-danger";
  clearDataBtn.textContent = "Hapus Data Offline";
  clearDataBtn.style.margin = "1rem 0";
  clearDataBtn.style.display = navigator.onLine ? "none" : "block";

  const storyList = document.createElement("div");
  storyList.id = "story-list";
  storyList.className = "story-list";

  const message = document.createElement("p");
  message.id = "home-message";
  message.className = "message";

  const uploadBtnWrapper = document.createElement("div");
  uploadBtnWrapper.className = "upload-float-btn";

  const uploadLink = document.createElement("a");
  uploadLink.href = "#/upload";
  uploadLink.className = "floating-button";
  uploadLink.textContent = "+";

  uploadBtnWrapper.appendChild(uploadLink);
  section.append(heading, clearDataBtn, storyList, message, uploadBtnWrapper);
  return section;
}

export function renderStoryList(stories) {
  const listContainer = document.getElementById("story-list");
  if (!listContainer) return;

  if (!stories || stories.length === 0) {
    showHomeErrorMessage("Belum ada cerita yang tersedia.");
    listContainer.innerHTML = "";
    return;
  }

  const storyCards = stories.map((story) => {
    const card = document.createElement("div");
    card.className = "story-card";

    const img = document.createElement("img");
    img.src = story.photoUrl;
    img.alt = `Foto oleh ${story.name}`;
    img.className = "story-img";
    img.onerror = function () {
      this.src = "https://placehold.co/600x400?text=Gambar+Error";
    };

    const title = document.createElement("h3");
    title.textContent = story.name;

    const desc = document.createElement("p");
    desc.textContent = story.description;

    const coord = document.createElement("p");
    if (story.lat && story.lon) {
      coord.innerHTML = `<small>${story.lat}, ${story.lon}</small>`;
    }

    card.append(img, title, desc, coord);
    return card;
  });

  listContainer.replaceChildren(...storyCards);
  const msg = document.getElementById("home-message");
  if (msg) msg.textContent = "";
}

export function showHomeErrorMessage(message) {
  const msg = document.getElementById("home-message");
  if (msg) msg.textContent = message;
}

export function showHomeLoadingMessage() {
  const msg = document.getElementById("home-message");
  if (msg) msg.textContent = "Memuat data...";
}

export function setClearDataButtonVisibility(visible) {
  const clearButton = document.getElementById("clear-data-btn");
  if (clearButton) {
    clearButton.style.display = visible ? "block" : "none";
  }
}

export function setupClearDataButton(onClickCallback) {
  const clearButton = document.getElementById("clear-data-btn");
  if (clearButton) {
    clearButton.addEventListener("click", onClickCallback);
  }
}

export function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.remove("hidden");
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
    toast.classList.add("hidden");
  }, 3000);
}

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
  section.append(heading, storyList, message, uploadBtnWrapper);
  return section;
}

export function renderStoryList(stories) {
  const listContainer = document.getElementById("story-list");
  if (!listContainer) return;

  if (stories.length === 0) {
    showHomeErrorMessage("Belum ada cerita yang tersedia.");
    return;
  }

  listContainer.replaceChildren(
    ...stories.map((story) => {
      const card = document.createElement("div");
      card.className = "story-card";

      const img = document.createElement("img");
      img.src = story.photoUrl;
      img.alt = `Foto oleh ${story.name}`;
      img.className = "story-img";

      const title = document.createElement("h3");
      title.textContent = story.name;

      const desc = document.createElement("p");
      desc.textContent = story.description;

      const coord = document.createElement("p");
      coord.innerHTML = `<small>${story.lat}, ${story.lon}</small>`;

      card.append(img, title, desc, coord);
      return card;
    })
  );
}

export function showHomeErrorMessage(message) {
  const msg = document.getElementById("home-message");
  if (msg) msg.textContent = message;
}

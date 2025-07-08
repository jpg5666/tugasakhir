export function renderFavPageView() {
  const main = document.getElementById("main");
  if (!main) return;

  const section = document.createElement("section");
  section.className = "fav-section";
  section.innerHTML = `
    <h1>Halaman Favorit</h1>
    <div id="fav-list" class="story-list"></div>
  `;

  main.replaceChildren(section);
}

export function renderFavCards(stories, onDelete) {
  const container = document.getElementById("fav-list");
  if (!container) return;

  container.innerHTML = "";

  if (!stories.length) {
    container.innerHTML = "<p>Belum ada cerita favorit.</p>";
    return;
  }

  stories.forEach((story) => {
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

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "button-danger";
    deleteBtn.textContent = "Hapus";
    deleteBtn.addEventListener("click", () => onDelete(story.id));

    card.append(img, title, desc, coord, deleteBtn);
    container.appendChild(card);
  });
}
